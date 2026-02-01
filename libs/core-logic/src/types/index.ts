/**
 * Tipos para o domínio Tanq
 */

export type TipoUsuario = 'MOTORISTA' | 'DONO_POSTO' | 'ADMINISTRADOR';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha?: string;
  tipo: TipoUsuario;
}

export interface Posto {
  id: number;
  nome: string;
  endereco: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  latitude: number;
  longitude: number;
  usuarioId: number;
}

export interface Preco {
  id: number;
  tipo: string;
  valor: number;
  postoId: number;
  usuarioId: number;
  dataAtualizacao: string;
}

export interface Avaliacao {
  id: number;
  nota: number;
  comentario?: string;
  postoId: number;
  usuarioId: number;
  dataCriacao: string;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface AuthState {
  usuario: Usuario | null;
  loading: boolean;
  estaLogado: boolean;
}
