import { useState, useEffect } from 'react';
import { precoService, postoService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function RankingPage() {
  const [precos, setPrecos] = useState([]);
  const [postos, setPostos] = useState({});
  const [loading, setLoading] = useState(true);
  const [tipoCombustivel, setTipoCombustivel] = useState('GASOLINA');
  const [error, setError] = useState(null);
  const { usuario } = useAuth();

  useEffect(() => {
    carregarRanking();
  }, [tipoCombustivel]);

  async function carregarRanking() {
    setLoading(true);
    try {
      // Carregar ranking de preços
      const precosResponse = await precoService.ranking(tipoCombustivel);
      setPrecos(precosResponse.data);
      
      // Carregar postos para mostrar nomes
      const postosResponse = await postoService.listarTodos();
      const postosMap = {};
      postosResponse.data.forEach(p => {
        postosMap[p.id] = p;
      });
      setPostos(postosMap);
      
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar ranking:', err);
      setError('Erro ao carregar ranking. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(precoId) {
    if (!usuario) {
      alert('Você precisa estar logado para deletar preços.');
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir este preço?')) {
      try {
        await precoService.deletar(precoId, usuario.id);
        carregarRanking();
      } catch (err) {
        console.error('Erro ao deletar:', err);
        alert(err.response?.data?.erro || 'Erro ao deletar preço.');
      }
    }
  }

  function podeDeletar(preco) {
    if (!usuario) return false;
    if (usuario.tipo === 'ADMINISTRADOR') return true;
    return preco.usuarioId === usuario.id;
  }

  return (
    <div className="ranking-page">
      <h2>🏆 Ranking de Preços</h2>
      
      <div className="filtros">
        <label>Tipo de combustível:</label>
        <select 
          value={tipoCombustivel} 
          onChange={(e) => setTipoCombustivel(e.target.value)}
        >
          <option value="GASOLINA">Gasolina</option>
          <option value="ETANOL">Etanol</option>
          <option value="DIESEL">Diesel</option>
        </select>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Carregando ranking...</div>
      ) : (
        <div className="posto-list">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Posto</th>
                <th>Preço</th>
                <th>Endereço</th>
                {usuario && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {precos.map((preco, index) => (
                <tr key={preco.id}>
                  <td className="ranking-position">{index + 1}º</td>
                  <td className="posto-nome">{postos[preco.postoId]?.nome || 'Posto não encontrado'}</td>
                  <td className="preco">R$ {preco.valor?.toFixed(2)}</td>
                  <td>{postos[preco.postoId]?.endereco || '-'}</td>
                  {usuario && (
                    <td>
                      {podeDeletar(preco) && (
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(preco.id)}
                        >
                          Excluir
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {precos.length === 0 && (
                <tr>
                  <td colSpan={usuario ? 5 : 4} style={{ textAlign: 'center' }}>
                    Nenhum preço cadastrado para este combustível.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RankingPage;
