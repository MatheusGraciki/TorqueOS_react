import { get } from "@/helpers/conexao";
import type { Carro, Cliente, Servico } from "@/types/types";

export interface DashboardStats {
  clientes: number;
  carros: number;
  servicos: number;
  faturamento: number;
  faturamentoPecas: number;
  faturamentoMaoDeObra: number;
}

export async function getClientes(): Promise<Cliente[]> {
  const res = await get("/clientes");
  return res.data;
}

export async function getCarros(): Promise<Carro[]> {
  const res = await get("/carros");
  return res.data;
}

export async function getServicos(): Promise<Servico[]> {
  const res = await get("/servicos");
  return res.data;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [clientes, carros, servicos] = await Promise.all([
    getClientes(),
    getCarros(),
    getServicos(),
  ]);
  const faturamento = servicos.reduce((sum, s) => sum + Number(s.valorTotal || 0), 0);
  const faturamentoPecas = servicos.reduce((sum, s) => sum + Number(s.custoPecas || 0), 0);
  const faturamentoMaoDeObra = servicos.reduce(
    (sum, s) => sum + Number((s.valorHora || 0) * (s.horasTrabalhadas || 0)),
    0
  );
  return {
    clientes: clientes.length,
    carros: carros.length,
    servicos: servicos.length,
    faturamento,
    faturamentoPecas,
    faturamentoMaoDeObra,
  };
}
