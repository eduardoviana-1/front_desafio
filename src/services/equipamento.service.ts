import api from '../api/client';
import { Equipamento, EntradaEquipamentoDto } from '../types/equipamento';

export const equipamentoService = {
  async listarTodos(): Promise<Equipamento[]> {
    const { data } = await api.get<Equipamento[]>('/equipamentos');
    return data;
  },

  async entrada(equipamento: EntradaEquipamentoDto): Promise<Equipamento> {
    const { data } = await api.post<Equipamento>('/equipamentos', equipamento);
    return data;
  },
};
