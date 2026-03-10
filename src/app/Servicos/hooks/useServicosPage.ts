import { useState, useMemo, useEffect } from "react";
import { getC } from "@/helpers/conexao";
import { listServicos, createServico, updateServico, deleteServico, type CreateServicoInput } from "../api";
import { calcularCustoPecas, calcularValorTotal } from "@/lib/calculations";
import type { Servico, Carro, Cliente, Peca } from "@/types/types";

const emptyForm: CreateServicoInput = {
  carroId: "",
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
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateServicoInput>(emptyForm);
  const [filterCliente, setFilterCliente] = useState<string>("all");
  const [filterCarro, setFilterCarro] = useState<string>("all");
  const [pecaNome, setPecaNome] = useState<string>("");
  const [pecaValor, setPecaValor] = useState<string>("");

  // extra state so the service page can create cars/clients inline
  const [openCarro, setOpenCarro] = useState<boolean>(false);
  const [openCliente, setOpenCliente] = useState<boolean>(false);
  const [carroForm, setCarroForm] = useState<Partial<Carro>>({});
  const [clienteForm, setClienteForm] = useState<Partial<Cliente>>({});

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sPromise, sAbort] = getC("/servicos");
      const [cPromise, cAbort] = getC("/carros");
      const [clPromise, clAbort] = getC("/clientes");
      
      const sRes = await sPromise;
      const cRes = await cPromise;
      const clRes = await clPromise;
      
      setServicos(sRes.data);
      setCarros(cRes.data);
      setClientes(clRes.data);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCarroLabel = (id: string) => {
    const car = carros.find((c) => c.id === id);
    if (!car) return "—";
    const cli = clientes.find((c) => c.id === car.clienteId);
    return `${car.placa} — ${car.marca} ${car.modelo} (${cli?.nome ?? "?"})`;
  };

  const getClienteFromCarro = (carroId: string) => {
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

  const removePeca = (id: string) => {
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
      loadData();
    } catch (err: any) {
      setError(err.message || String(err));
    }
  };

  const handleDelete = async (id: string, onSuccess: (msg: string) => void) => {
    try {
      await deleteServico(id);
      onSuccess("Serviço removido");
      loadData();
    } catch (err: any) {
      setError(err.message || String(err));
    }
  };

  // helper used after creating car/client to refresh lists
  const reloadCars = async () => {
    try {
      const [, cRes] = await getC("/carros");
      setCarros(cRes.data);
    } catch {}
  };

  const reloadClients = async () => {
    try {
      const [, clRes] = await getC("/clientes");
      setClientes(clRes.data);
    } catch {}
  };

  const createCarroInline = async (data: Partial<Carro>) => {
    if (!data.clienteId || !data.marca || !data.placa) return null;
    const newCar = await createCarro(data as any);
    reloadCars();
    return newCar;
  };

  const createClienteInline = async (data: Partial<Cliente>) => {
    if (!data.nome) return null;
    const newCli = await createCliente(data as any);
    reloadClients();
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
