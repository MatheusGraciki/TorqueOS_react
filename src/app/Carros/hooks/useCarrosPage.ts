import { useState, useEffect } from "react";
import { getC, postC, cancel } from "@/helpers/conexao";
import { getCarros, createCarro, updateCarro, deleteCarro } from "../api";
import type { CreateCarroInput } from "../types";
import type { Carro, Cliente } from "@/types/types";

const emptyForm: CreateCarroInput = {
  clienteId: 0,
  marca: "",
  modelo: "",
  ano: new Date().getFullYear(),
  placa: "",
  cor: "",
  quilometragem: 0,
};

export function useCarrosPage() {
  const [carros, setCarros] = useState<Carro[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateCarroInput>(emptyForm);
  const [filterCliente, setFilterCliente] = useState<"all" | number>("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cPromise, cCtrl] = getC("/clientes");
      const [carPromise, carCtrl] = getC("/carros");
      const cRes = await cPromise;
      const carRes = await carPromise;
      setClientes(cRes.data);
      setCarros(carRes.data);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = filterCliente === "all" ? carros : carros.filter((c) => c.clienteId === filterCliente);
  const getClienteNome = (id: number) => clientes.find((c) => c.id === id)?.nome ?? "—";

  const openNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (c: Carro) => {
    setEditId(c.id);
    setForm({
      clienteId: c.clienteId,
      marca: c.marca,
      modelo: c.modelo,
      ano: c.ano,
      placa: c.placa,
      cor: c.cor,
      quilometragem: c.quilometragem,
    });
    setOpen(true);
  };

  const handleSave = async (onSuccess: (msg: string) => void) => {
    if (!form.clienteId || !form.marca.trim() || !form.placa.trim()) {
      setError("Cliente, marca e placa são obrigatórios.");
      return;
    }
    try {
      if (editId) {
        await updateCarro(editId, form);
        onSuccess("Carro atualizado");
      } else {
        await createCarro(form);
        onSuccess("Carro cadastrado");
      }
      setOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || String(err));
    }
  };

  const handleDelete = async (id: number, onSuccess: (msg: string) => void) => {
    try {
      await deleteCarro(id);
      onSuccess("Carro removido");
      loadData();
    } catch (err: any) {
      setError(err.message || String(err));
    }
  };

  return {
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
    filtered,
    getClienteNome,
    openNew,
    openEdit,
    handleSave,
    handleDelete,
  };
}
