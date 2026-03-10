export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  documento: string; // CPF ou CNPJ
  endereco: string; // rua, número, etc.
  createdAt: string;
}

export interface Carro {
  id: string;
  clienteId: string;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  cor: string;
  quilometragem: number;
  createdAt: string;
}

export interface Peca {
  id: string;
  nome: string;
  valor: number;
}

export interface Servico {
  id: string;
  carroId: string;
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