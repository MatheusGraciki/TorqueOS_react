import { post, put, delet, get } from "@/helpers/conexao";
import type { Carro } from "@/types/types";

export type CreateCarroInput = Omit<Carro, "id" | "createdAt">;

export async function listCarros(): Promise<Carro[]> {
  const res = await get("/carros");
  return res.data;
}

export async function createCarro(body: CreateCarroInput): Promise<Carro> {
  const res = await post("/carros", body);
  return res.data;
}

export async function updateCarro(id: string, body: CreateCarroInput): Promise<Carro> {
  const res = await put(`/carros/${id}`, body);
  return res.data;
}

export async function deleteCarro(id: string): Promise<void> {
  await delet(`/carros/${id}`);
}
