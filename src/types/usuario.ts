export interface Usuario {
  id: string;
  nomeCompleto: string;
  cpf: string;
  email: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CriarUsuarioDto {
  nomeCompleto: string;
  cpf: string;
  email: string;
  senha?: string;
}
