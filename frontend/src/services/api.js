import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const postoService = {
  // Listar todos os postos
  listarTodos: () => api.get('/postos'),

  // Buscar posto por ID
  buscarPorId: (id) => api.get(`/postos/${id}`),

  // Ranking de preços - gasolina
  ranking: () => api.get('/postos/ranking'),

  // Ranking de preços - etanol
  rankingEtanol: () => api.get('/postos/ranking/etanol'),

  // Buscar por nome
  buscarPorNome: (nome) => api.get(`/postos/buscar?nome=${nome}`),

  // Criar novo posto
  criar: (posto) => api.post('/postos', posto),

  // Atualizar posto
  atualizar: (id, posto) => api.put(`/postos/${id}`, posto),

  // Deletar posto
  deletar: (id) => api.delete(`/postos/${id}`),
};

export default api;
