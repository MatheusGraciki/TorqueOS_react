import { post, put, delet, get } from "@/helpers/conexao";
import type { Servico, Peca } from "@/types/types";
import type { BackendServico, CreateServicoInput } from "./types";

function normalizeServico(item: BackendServico): Servico {
  const rawPecas = item.pecasUtilizadas ?? item.servicoPecas ?? [];
  const pecasUtilizadas: Peca[] = rawPecas.map((piece) => ({
    id: String(piece.peca?.id ?? piece.pecaId ?? piece.id ?? crypto.randomUUID()),
    nome: piece.peca?.nome ?? piece.nome ?? "Peça",
    valor: Number(piece.valorUnit ?? piece.peca?.valor ?? piece.valor ?? 0),
  }));

  return {
    ...item,
    id: item.id,
    carroId: item.carroId,
    pecasUtilizadas,
    valorHora: Number(item.valorHora || 0),
    horasTrabalhadas: Number(item.horasTrabalhadas || 0),
    custoPecas: Number(item.custoPecas || 0),
    valorTotal: Number(item.valorTotal || 0),
  };
}

async function resolvePecaId(peca: Peca): Promise<number> {
  const parsed = Number(peca.id);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  const created = await post("/pecas", {
    nome: peca.nome,
    valor: Number(peca.valor),
    estoque: 0,
  });

  return Number(created.data.id);
}

async function toBackendPayload(body: CreateServicoInput) {
  const pecasUtilizadas = await Promise.all(
    body.pecasUtilizadas.map(async (p) => ({
      pecaId: await resolvePecaId(p),
      quantidade: 1,
      valorUnit: Number(p.valor),
    }))
  );

  return {
    ...body,
    pecasUtilizadas,
  };
}

export async function getServicos(): Promise<Servico[]> {
  const res = await get("/servicos");
  return (res.data as BackendServico[]).map(normalizeServico);
}

export async function createServico(body: CreateServicoInput): Promise<Servico> {
  const payload = await toBackendPayload(body);
  const res = await post("/servicos", payload);
  return normalizeServico(res.data as BackendServico);
}

export async function updateServico(id: number, body: CreateServicoInput): Promise<Servico> {
  const payload = await toBackendPayload(body);
  const res = await put(`/servicos/${id}`, payload);
  return normalizeServico(res.data as BackendServico);
}

export async function deleteServico(id: number): Promise<void> {
  await delet(`/servicos/${id}`);
}
