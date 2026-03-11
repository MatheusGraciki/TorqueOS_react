import type { Cliente, Peca, Servico } from "@/types/types";

export interface CreateServicoInput {
  carroId: number;
  descricaoServico: string;
  pecasUtilizadas: Peca[];
  valorHora: number;
  horasTrabalhadas: number;
  dataServico: string;
  observacoes: string;
}

export type BackendPeca = {
  id?: number;
  nome?: string;
  valor?: number;
  pecaId?: number;
  valorUnit?: number;
  quantidade?: number;
  peca?: {
    id: number;
    nome: string;
    valor: number;
  };
};

export type BackendServico = Omit<Servico, "pecasUtilizadas"> & {
  servicoPecas?: BackendPeca[];
  pecasUtilizadas?: BackendPeca[];
};

export type ClienteInlineForm = Partial<Cliente> & {
  tipoPessoa?: "PF" | "PJ";
};
