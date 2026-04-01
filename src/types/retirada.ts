import { Usuario } from './usuario';
import { Equipamento } from './equipamento';

export interface Retirada {
  id: string;
  usuarioId: string;
  equipamentoId: string;
  quantidade: number;
  realizadoEm: string;
  usuario?: Usuario;
  equipamento?: Equipamento;
}

export interface RealizarRetiradaDto {
  usuarioId: string;
  equipamentoId: string;
  quantidade: number;
}
