import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Serviço de Postos
export const postoService = {
  listarTodos: () => api.get('/postos'),
  buscarPorId: (id) => api.get(`/postos/${id}`),
  meusPostos: (usuarioId) => api.get(`/postos/meus?usuarioId=${usuarioId}`),
  buscar: (nome) => api.get(`/postos/buscar?nome=${nome}`),
  criar: (posto, usuarioId) => api.post('/postos', { ...posto, usuarioId }),
  atualizar: (id, posto, usuarioId) => api.put(`/postos/${id}`, { ...posto, usuarioId }),
  deletar: (id, usuarioId) => api.delete(`/postos/${id}?usuarioId=${usuarioId}`),
};

// Serviço de Preços
export const precoService = {
  listarTodos: () => api.get('/precos'),
  listarPorPosto: (postoId) => api.get(`/precos/posto/${postoId}`),
  listarPorUsuario: (usuarioId) => api.get(`/precos/usuario/${usuarioId}`),
  ranking: (tipo) => api.get(`/precos/ranking/${tipo}`),
  criar: (preco, usuarioId) => api.post('/precos', { ...preco, usuarioId }),
  deletar: (id, usuarioId) => api.delete(`/precos/${id}?usuarioId=${usuarioId}`),
};

// Serviço de Autenticação
export const authService = {
  login: (email, senha) => api.post('/auth/login', { email, senha }),
  register: (usuario) => api.post('/auth/register', usuario),
  me: (id) => api.get(`/auth/me/${id}`),
  
  // Gerenciamento de sessão local
  salvarUsuario: (usuario) => {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  },
  obterUsuario: () => {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  },
  logout: () => {
    localStorage.removeItem('usuario');
  },
  estaLogado: () => {
    return !!localStorage.getItem('usuario');
  }
};

// Serviço de Usuários
export const usuarioService = {
  listarTodos: () => api.get('/usuarios'),
  buscarPorId: (id) => api.get(`/usuarios/${id}`),
  criar: (usuario) => api.post('/usuarios', usuario),
  atualizar: (id, usuario) => api.put(`/usuarios/${id}`, usuario),
  deletar: (id) => api.delete(`/usuarios/${id}`),
};

export default api;
