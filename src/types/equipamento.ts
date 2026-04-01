export interface Equipamento {
  id: string;
  nome: string;
  quantidadeEstoque: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface EntradaEquipamentoDto {
  nome: string;
  quantidade: number;
}
