import { useState, useEffect } from "react";
import { getC } from "@/helpers/conexao";
import { listClientes, createCliente, updateCliente, deleteCliente, type CreateClienteInput } from "../api";
import type { Cliente } from "@/types/types";

const emptyForm: CreateClienteInput = {
  nome: "",
  email: "",
  telefone: "",
  endereco: "",
  documento: "",
};

export function useClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateClienteInput>(emptyForm);
  const [filterNome, setFilterNome] = useState<string>("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cPromise, cCtrl] = getC("/clientes");
      const cRes = await cPromise;
      setClientes(cRes.data);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = clientes.filter((c) =>
    c.nome.toLowerCase().includes(filterNome.toLowerCase())
  );

  const openNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (c: Cliente) => {
    setEditId(c.id);
    setForm({
      nome: c.nome,
      email: c.email,
      telefone: c.telefone,
      endereco: c.endereco,
      documento: c.documento,
    });
    setOpen(true);
  };

  const handleSave = async (onSuccess: (msg: string) => void) => {
    if (!form.nome.trim()) {
      setError("Nome é obrigatório.");
      return;
    }
    try {
      if (editId) {
        await updateCliente(editId, form);
        onSuccess("Cliente atualizado");
      } else {
        await createCliente(form);
        onSuccess("Cliente cadastrado");
      }
      setOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || String(err));
    }
  };

  const handleDelete = async (id: string, onSuccess: (msg: string) => void) => {
    try {
      await deleteCliente(id);
      onSuccess("Cliente removido");
      loadData();
    } catch (err: any) {
      setError(err.message || String(err));
    }
  };

  return {
    clientes,
    loading,
    error,
    open,
    setOpen,
    editId,
    form,
    setForm,
    filterNome,
    setFilterNome,
    filtered,
    openNew,
    openEdit,
    handleSave,
    handleDelete,
  };
}
