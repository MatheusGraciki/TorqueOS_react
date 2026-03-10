import { post, put, delet, get } from "@/helpers/conexao";
import type { Cliente } from "@/types/types";

export type CreateClienteInput = Omit<Cliente, "id" | "createdAt">;

export async function listClientes(): Promise<Cliente[]> {
  const res = await get("/clientes");
  return res.data;
}

export async function createCliente(body: CreateClienteInput): Promise<Cliente> {
  const res = await post("/clientes", body);
  return res.data;
}

export async function updateCliente(id: string, body: CreateClienteInput): Promise<Cliente> {
  const res = await put(`/clientes/${id}`, body);
  return res.data;
}

export async function deleteCliente(id: string): Promise<void> {
  await delet(`/clientes/${id}`);
}
