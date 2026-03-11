export type TipoClienteBackend = "PESSOA_FISICA" | "JURIDICA";

export type BackendCliente = {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  tipo: TipoClienteBackend;
  cpf?: string | null;
  cnpj?: string | null;
  endereco: string;
  createdAt: string;
};

export type CreateClienteInput = {
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  documento?: string;
  tipo?: TipoClienteBackend;
  cpf?: string;
  cnpj?: string;
};
