import type { Carro } from "@/types/types";

export type BackendCarro = Carro;

export type CreateCarroInput = {
  clienteId: number;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  cor: string;
  quilometragem: number;
};
