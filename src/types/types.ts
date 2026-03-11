export interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  documento: string; // CPF ou CNPJ
  endereco: string; // rua, número, etc.
  createdAt: string;
}

export interface Carro {
  id: number;
  clienteId: number;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  cor: string;
  quilometragem: number;
  createdAt: string;
}

export interface Peca {
  id: number | string;
  nome: string;
  valor: number;
}

export interface Servico {
  id: number;
  carroId: number;
  descricaoServico: string;
  pecasUtilizadas: Peca[];
  valorHora: number;
  horasTrabalhadas: number;
  custoPecas: number;     // calculado
  valorTotal: number;     // calculado
  dataServico: string;
  observacoes: string;
  createdAt: string;
}