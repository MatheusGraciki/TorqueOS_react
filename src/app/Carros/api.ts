import { post, put, delet, get } from "@/helpers/conexao";
import type { Carro } from "@/types/types";
import type { BackendCarro, CreateCarroInput } from "./types";

export async function getCarros(): Promise<Carro[]> {
  const res = await get("/carros");
  return res.data as BackendCarro[];
}

export async function createCarro(body: CreateCarroInput): Promise<Carro> {
  const res = await post("/carros", body);
  return res.data as BackendCarro;
}

export async function updateCarro(id: number, body: CreateCarroInput): Promise<Carro> {
  const res = await put(`/carros/${id}`, body);
  return res.data as BackendCarro;
}

export async function deleteCarro(id: number): Promise<void> {
  await delet(`/carros/${id}`);
}
