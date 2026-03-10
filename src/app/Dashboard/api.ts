import { get } from "@/helpers/conexao";
import type { Carro, Cliente, Servico } from "@/types/types";

export interface DashboardStats {
  clientes: number;
  carros: number;
  servicos: number;
  faturamento: number;
}

export async function listClientes(): Promise<Cliente[]> {
  const res = await get("/clientes");
  return res.data;
}

export async function listCarros(): Promise<Carro[]> {
  const res = await get("/carros");
  return res.data;
}

export async function listServicos(): Promise<Servico[]> {
  const res = await get("/servicos");
  return res.data;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [clientes, carros, servicos] = await Promise.all([
    listClientes(),
    listCarros(),
    listServicos(),
  ]);
  const faturamento = servicos.reduce((sum, s) => sum + (s.valorTotal || 0), 0);
  return {
    clientes: clientes.length,
    carros: carros.length,
    servicos: servicos.length,
    faturamento,
  };
}
