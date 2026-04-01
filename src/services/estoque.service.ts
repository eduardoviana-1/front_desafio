import api from '../api/client';
import { Retirada, RealizarRetiradaDto } from '../types/retirada';

export const estoqueService = {
  async listarRetiradas(): Promise<Retirada[]> {
    const { data } = await api.get<Retirada[]>('/estoque/retirada');
    return data;
  },

  async realizarRetirada(retirada: RealizarRetiradaDto): Promise<Retirada> {
    const { data } = await api.post<Retirada>('/estoque/retirada', retirada);
    return data;
  },
};
