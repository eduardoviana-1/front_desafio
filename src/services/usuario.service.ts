import api from '../api/client';
import { Usuario, CriarUsuarioDto } from '../types/usuario';

export const usuarioService = {
  async listarTodos(): Promise<Usuario[]> {
    const { data } = await api.get<Usuario[]>('/usuario');
    return data;
  },

  async criar(usuario: CriarUsuarioDto): Promise<Usuario> {
    const { data } = await api.post<Usuario>('/usuario', usuario);
    return data;
  },
};
