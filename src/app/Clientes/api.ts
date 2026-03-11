import { post, put, delet, get } from "@/helpers/conexao";
import type { Cliente } from "@/types/types";
import type { BackendCliente, CreateClienteInput, TipoClienteBackend } from "./types";

function normalizeCliente(item: BackendCliente): Cliente {
  return {
    id: item.id,
    nome: item.nome,
    telefone: item.telefone,
    email: item.email,
    documento: item.cpf ?? item.cnpj ?? "",
    endereco: item.endereco,
    createdAt: item.createdAt,
  };
}

function toBackendPayload(body: CreateClienteInput) {
  const documento = (body.documento ?? body.cpf ?? body.cnpj ?? "").replace(/\D/g, "");
  const tipo: TipoClienteBackend =
    body.tipo ?? (documento.length === 14 ? "JURIDICA" : "PESSOA_FISICA");

  return {
    nome: body.nome,
    telefone: body.telefone ?? "",
    email: body.email ?? "",
    endereco: body.endereco ?? "",
    tipo,
    cpf: tipo === "PESSOA_FISICA" ? documento : undefined,
    cnpj: tipo === "JURIDICA" ? documento : undefined,
  };
}

export async function getClientes(): Promise<Cliente[]> {
  const res = await get("/clientes");
  return (res.data as BackendCliente[]).map(normalizeCliente);
}

export async function createCliente(body: CreateClienteInput): Promise<Cliente> {
  const res = await post("/clientes", toBackendPayload(body));
  return normalizeCliente(res.data as BackendCliente);
}

export async function updateCliente(id: number, body: CreateClienteInput): Promise<Cliente> {
  const res = await put(`/clientes/${id}`, toBackendPayload(body));
  return normalizeCliente(res.data as BackendCliente);
}

export async function deleteCliente(id: number): Promise<void> {
  await delet(`/clientes/${id}`);
}
