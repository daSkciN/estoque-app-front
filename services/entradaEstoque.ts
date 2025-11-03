import { api } from "./api";

export interface EntradaEstoqueDTO {
  idProduto: number;
  quantidade: number;
}

export async function registrarEntrada(dto: EntradaEstoqueDTO) {
  const response = await api.post("/entradaEstoque", dto);
  return response.data;
}
