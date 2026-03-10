import { post, put, delet, get } from "@/helpers/conexao";
import type { Servico, Peca } from "@/types/types";

export interface CreateServicoInput {
  carroId: string;
  descricaoServico: string;
  pecasUtilizadas: Peca[];
  valorHora: number;
  horasTrabalhadas: number;
  dataServico: string;
  observacoes: string;
}

export async function listServicos(): Promise<Servico[]> {
  const res = await get("/servicos");
  return res.data;
}

export async function createServico(body: CreateServicoInput): Promise<Servico> {
  const res = await post("/servicos", body);
  return res.data;
}

export async function updateServico(id: string, body: CreateServicoInput): Promise<Servico> {
  const res = await put(`/servicos/${id}`, body);
  return res.data;
}

export async function deleteServico(id: string): Promise<void> {
  await delet(`/servicos/${id}`);
}
