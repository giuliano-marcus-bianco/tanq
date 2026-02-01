import axios, { AxiosInstance } from 'axios';
import { getApiBaseUrl } from './environment';
import { getStorageAdapter } from '../adapters/storage';
import type { Usuario, Posto, Preco, Avaliacao } from '../types';

// Cria instância do Axios com URL dinâmica
const createApiInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: getApiBaseUrl(),
  });
};

// Instância singleton (será recriada se o environment mudar)
let api = createApiInstance();

/**
 * Reinicializa a API com a URL atual do ambiente
 * Chamar após configureEnvironment()
 */
export function reinitializeApi(): void {
  api = createApiInstance();
}

/**
 * Retorna a instância atual do Axios
 */
export function getApiInstance(): AxiosInstance {
  return api;
}

// ============================================
// Serviço de Postos
// ============================================
export const postoService = {
  listarTodos: () => api.get<Posto[]>('/postos'),
  buscarPorId: (id: number) => api.get<Posto>(`/postos/${id}`),
  meusPostos: (usuarioId: number) => api.get<Posto[]>(`/postos/meus?usuarioId=${usuarioId}`),
  buscar: (nome: string) => api.get<Posto[]>(`/postos/buscar?nome=${nome}`),
  criar: (posto: Omit<Posto, 'id'>, usuarioId: number) => 
    api.post<Posto>('/postos', { ...posto, usuarioId }),
  atualizar: (id: number, posto: Partial<Posto>, usuarioId: number) => 
    api.put<Posto>(`/postos/${id}`, { ...posto, usuarioId }),
  deletar: (id: number, usuarioId: number) => 
    api.delete(`/postos/${id}?usuarioId=${usuarioId}`),
};

// ============================================
// Serviço de Preços
// ============================================
export const precoService = {
  listarTodos: () => api.get<Preco[]>('/precos'),
  listarPorPosto: (postoId: number) => api.get<Preco[]>(`/precos/posto/${postoId}`),
  listarPorUsuario: (usuarioId: number) => api.get<Preco[]>(`/precos/usuario/${usuarioId}`),
  ranking: (tipo: string) => api.get<Preco[]>(`/precos/ranking/${tipo}`),
  criar: (preco: Omit<Preco, 'id' | 'dataAtualizacao'>, usuarioId: number) => 
    api.post<Preco>('/precos', { ...preco, usuarioId }),
  deletar: (id: number, usuarioId: number) => 
    api.delete(`/precos/${id}?usuarioId=${usuarioId}`),
};

// ============================================
// Serviço de Autenticação
// ============================================
const USUARIO_STORAGE_KEY = 'usuario';

export const authService = {
  login: (email: string, senha: string) => 
    api.post<Usuario>('/auth/login', { email, senha }),
  
  register: (usuario: Omit<Usuario, 'id'>) => 
    api.post<Usuario>('/auth/register', usuario),
  
  me: (id: number) => api.get<Usuario>(`/auth/me/${id}`),

  // Gerenciamento de sessão com Storage Adapter
  salvarUsuario: async (usuario: Usuario): Promise<void> => {
    const storage = getStorageAdapter();
    await storage.setItem(USUARIO_STORAGE_KEY, JSON.stringify(usuario));
  },

  obterUsuario: async (): Promise<Usuario | null> => {
    const storage = getStorageAdapter();
    const usuario = await storage.getItem(USUARIO_STORAGE_KEY);
    return usuario ? JSON.parse(usuario) : null;
  },

  logout: async (): Promise<void> => {
    const storage = getStorageAdapter();
    await storage.removeItem(USUARIO_STORAGE_KEY);
  },

  estaLogado: async (): Promise<boolean> => {
    const storage = getStorageAdapter();
    const usuario = await storage.getItem(USUARIO_STORAGE_KEY);
    return !!usuario;
  },

  // Versões síncronas para compatibilidade com código legado (Web only)
  salvarUsuarioSync: (usuario: Usuario): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(USUARIO_STORAGE_KEY, JSON.stringify(usuario));
    }
  },

  obterUsuarioSync: (): Usuario | null => {
    if (typeof window === 'undefined') return null;
    const usuario = window.localStorage.getItem(USUARIO_STORAGE_KEY);
    return usuario ? JSON.parse(usuario) : null;
  },

  logoutSync: (): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(USUARIO_STORAGE_KEY);
    }
  },

  estaLogadoSync: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!window.localStorage.getItem(USUARIO_STORAGE_KEY);
  },
};

// ============================================
// Serviço de Usuários
// ============================================
export const usuarioService = {
  listarTodos: () => api.get<Usuario[]>('/usuarios'),
  buscarPorId: (id: number) => api.get<Usuario>(`/usuarios/${id}`),
  criar: (usuario: Omit<Usuario, 'id'>) => api.post<Usuario>('/usuarios', usuario),
  atualizar: (id: number, usuario: Partial<Usuario>) => 
    api.put<Usuario>(`/usuarios/${id}`, usuario),
  deletar: (id: number) => api.delete(`/usuarios/${id}`),
};

// ============================================
// Serviço de Avaliações
// ============================================
export const avaliacaoService = {
  listarTodos: () => api.get<Avaliacao[]>('/avaliacoes'),
  listarPorPosto: (postoId: number) => api.get<Avaliacao[]>(`/avaliacoes/posto/${postoId}`),
  mediaPorPosto: (postoId: number) => api.get<{ media: number }>(`/avaliacoes/posto/${postoId}/media`),
  criar: (avaliacao: Omit<Avaliacao, 'id' | 'dataCriacao'>, usuarioId: number) => 
    api.post<Avaliacao>('/avaliacoes', { ...avaliacao, usuarioId }),
  deletar: (id: number, usuarioId: number) => 
    api.delete(`/avaliacoes/${id}?usuarioId=${usuarioId}`),
};

export default api;
