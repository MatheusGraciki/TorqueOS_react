import type { Peca } from "@/types/domain";

export function calcularCustoPecas(pecas: Peca[]): number {
  return pecas.reduce((total, peca) => total + peca.valor, 0);
}

export function calcularValorTotal(
  valorHora: number,
  horasTrabalhadas: number,
  custoPecas: number
): number {
  return valorHora * horasTrabalhadas + custoPecas;
}
