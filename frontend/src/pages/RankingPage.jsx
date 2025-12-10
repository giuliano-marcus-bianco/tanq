import { useState, useEffect } from 'react';
import { postoService } from '../services/api';
import PostoList from '../components/PostoList';

function RankingPage() {
  const [postos, setPostos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipoRanking, setTipoRanking] = useState('gasolina');
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarRanking();
  }, [tipoRanking]);

  async function carregarRanking() {
    setLoading(true);
    try {
      const response = tipoRanking === 'gasolina' 
        ? await postoService.ranking()
        : await postoService.rankingEtanol();
      setPostos(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar ranking:', err);
      setError('Erro ao carregar ranking. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (window.confirm('Tem certeza que deseja excluir este posto?')) {
      try {
        await postoService.deletar(id);
        carregarRanking();
      } catch (err) {
        console.error('Erro ao deletar:', err);
        alert('Erro ao deletar posto.');
      }
    }
  }

  return (
    <div className="ranking-page">
      <h2>🏆 Ranking de Preços</h2>
      
      <div className="filtros">
        <label>Ordenar por:</label>
        <select 
          value={tipoRanking} 
          onChange={(e) => setTipoRanking(e.target.value)}
        >
          <option value="gasolina">Menor preço de Gasolina</option>
          <option value="etanol">Menor preço de Etanol</option>
        </select>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Carregando ranking...</div>
      ) : (
        <PostoList postos={postos} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default RankingPage;
