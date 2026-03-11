import { useState, useMemo, useEffect } from "react";
import { getServicos, createServico, updateServico, deleteServico } from "../api";
import { getCarros, createCarro } from "@/app/Carros/api";
import { getClientes, createCliente } from "@/app/Clientes/api";
import type { CreateClienteInput } from "@/app/Clientes/types";
import { calcularCustoPecas, calcularValorTotal } from "@/lib/calculations";
import type { Servico, Carro, Cliente, Peca } from "@/types/types";
import type { ClienteInlineForm, CreateServicoInput } from "../types";

const emptyForm: CreateServicoInput = {
  carroId: 0,
  descricaoServico: "",
  pecasUtilizadas: [],
  valorHora: 0,
  horasTrabalhadas: 0,
  dataServico: new Date().toISOString().split("T")[0],
  observacoes: "",
};

export function useServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carros, setCarros] = useState<Carro[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateServicoInput>(emptyForm);
  const [filterCliente, setFilterCliente] = useState<"all" | number>("all");
  const [filterCarro, setFilterCarro] = useState<"all" | number>("all");
  const [pecaNome, setPecaNome] = useState<string>("");
  const [pecaValor, setPecaValor] = useState<string>("");

  // extra state so the service page can create cars/clients inline
  const [openCarro, setOpenCarro] = useState<boolean>(false);
  const [openCliente, setOpenCliente] = useState<boolean>(false);
  const [carroForm, setCarroForm] = useState<Partial<Carro>>({});
  const [clienteForm, setClienteForm] = useState<ClienteInlineForm>({ tipoPessoa: "PF" });

  const loadServicos = async () => {
    const servicosData = await getServicos();
    setServicos(servicosData);
  };

  const loadCarros = async () => {
    const carrosData = await getCarros();
    setCarros(carrosData);
  };

  const loadClientes = async () => {
    const clientesData = await getClientes();
    setClientes(clientesData);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([loadServicos(), loadCarros(), loadClientes()]);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCarroLabel = (id: number) => {
    const car = carros.find((c) => c.id === id);
    if (!car) return "—";
    return `${car.marca} ${car.modelo} — ${car.placa}`;
  };

  const getCarroNome = (id: number) => {
    const car = carros.find((c) => c.id === id);
    if (!car) return "—";
    return `${car.marca} ${car.modelo}`;
  };

  const getCarroPlaca = (id: number) => {
    const car = carros.find((c) => c.id === id);
    return car?.placa ?? "—";
  };

  const getClienteFromCarro = (carroId: number) => {
    const car = carros.find((c) => c.id === carroId);
    return car?.clienteId ?? "";
  };

  const filtered = useMemo(() => {
    let list = servicos;
    if (filterCliente !== "all") {
      list = list.filter((s) => getClienteFromCarro(s.carroId) === filterCliente);
    }
    if (filterCarro !== "all") {
      list = list.filter((s) => s.carroId === filterCarro);
    }
    return list;
  }, [servicos, filterCliente, filterCarro, carros]);

  const custoPecas = calcularCustoPecas(form.pecasUtilizadas);
  const valorTotal = calcularValorTotal(form.valorHora, form.horasTrabalhadas, custoPecas);

  const openNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (s: Servico) => {
    setEditId(s.id);
    setForm({
      carroId: s.carroId,
      descricaoServico: s.descricaoServico,
      pecasUtilizadas: s.pecasUtilizadas,
      valorHora: s.valorHora,
      horasTrabalhadas: s.horasTrabalhadas,
      dataServico: s.dataServico,
      observacoes: s.observacoes,
    });
    setOpen(true);
  };

  const addPeca = () => {
    if (!pecaNome.trim() || !pecaValor) return;
    const peca: Peca = { id: crypto.randomUUID(), nome: pecaNome, valor: Number(pecaValor) };
    setForm({ ...form, pecasUtilizadas: [...form.pecasUtilizadas, peca] });
    setPecaNome("");
    setPecaValor("");
  };

  const removePeca = (id: string | number) => {
    setForm({ ...form, pecasUtilizadas: form.pecasUtilizadas.filter((p) => p.id !== id) });
  };

  const handleSave = async (onSuccess: (msg: string) => void) => {
    if (!form.carroId || !form.descricaoServico.trim()) {
      setError("Carro e descrição são obrigatórios.");
      return;
    }
    try {
      if (editId) {
        await updateServico(editId, form);
        onSuccess("Serviço atualizado");
      } else {
        await createServico(form);
        onSuccess("Serviço registrado");
      }
      setOpen(false);
      await loadServicos();
    } catch (err: any) {
      setError(err.message || String(err));
    }
  };

  const handleDelete = async (id: number, onSuccess: (msg: string) => void) => {
    try {
      await deleteServico(id);
      onSuccess("Serviço removido");
      await loadServicos();
    } catch (err: any) {
      setError(err.message || String(err));
    }
  };

  // helper used after creating car/client to refresh lists
  const reloadCars = async () => {
    try {
      await loadCarros();
    } catch {}
  };

  const reloadClients = async () => {
    try {
      await loadClientes();
    } catch {}
  };

  const createCarroInline = async (data: Partial<Carro>) => {
    if (!data.clienteId || !data.marca || !data.placa) {
      setError("Para criar carro: cliente, marca e placa são obrigatórios.");
      return null;
    }

    const payload = {
      clienteId: Number(data.clienteId),
      marca: data.marca,
      modelo: data.modelo ?? "",
      ano: Number(data.ano ?? new Date().getFullYear()),
      placa: data.placa,
      cor: data.cor ?? "",
      quilometragem: Number(data.quilometragem ?? 0),
    };

    const newCar = await createCarro(payload);
    await reloadCars();
    return newCar;
  };

  const createClienteInline = async (data: ClienteInlineForm) => {
    if (!data.nome?.trim()) {
      setError("Nome do cliente é obrigatório.");
      return null;
    }

    if (!data.tipoPessoa) {
      setError("Tipo de cliente (PF/PJ) é obrigatório.");
      return null;
    }

    if (!data.documento?.trim()) {
      setError(`${data.tipoPessoa === "PF" ? "CPF" : "CNPJ"} é obrigatório.`);
      return null;
    }

    if (!data.endereco?.trim()) {
      setError("Endereço é obrigatório.");
      return null;
    }

    const documentoNumerico = data.documento.replace(/\D/g, "");
    if (data.tipoPessoa === "PF" && documentoNumerico.length !== 11) {
      setError("CPF deve ter 11 dígitos.");
      return null;
    }
    if (data.tipoPessoa === "PJ" && documentoNumerico.length !== 14) {
      setError("CNPJ deve ter 14 dígitos.");
      return null;
    }

    const payload: CreateClienteInput = {
      nome: data.nome.trim(),
      email: data.email ?? "",
      telefone: data.telefone ?? "",
      endereco: data.endereco.trim(),
      tipo: data.tipoPessoa === "PJ" ? "JURIDICA" : "PESSOA_FISICA",
      cpf: data.tipoPessoa === "PF" ? documentoNumerico : undefined,
      cnpj: data.tipoPessoa === "PJ" ? documentoNumerico : undefined,
    };

    const newCli = await createCliente(payload);
    await reloadClients();
    return newCli;
  };

  return {
    servicos,
    carros,
    clientes,
    loading,
    error,
    open,
    setOpen,
    editId,
    form,
    setForm,
    filterCliente,
    setFilterCliente,
    filterCarro,
    setFilterCarro,
    pecaNome,
    setPecaNome,
    pecaValor,
    setPecaValor,
    filtered,
    custoPecas,
    valorTotal,
    getCarroLabel,
    getCarroNome,
    getCarroPlaca,
    getClienteFromCarro,
    openNew,
    openEdit,
    addPeca,
    removePeca,
    handleSave,
    handleDelete,
    openCarro,
    setOpenCarro,
    carroForm,
    setCarroForm,
    openCliente,
    setOpenCliente,
    clienteForm,
    setClienteForm,
    createCarroInline,
    createClienteInline,
  };
}
