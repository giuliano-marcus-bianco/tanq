import { useState, useEffect } from 'react';
import { avaliacaoService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import AvaliacaoForm from './AvaliacaoForm';
import AvaliacaoList from './AvaliacaoList';

function PostoCard({ posto, precos, onDelete, podeDeletar, getEnderecoFormatado }) {
  const [avaliacaoStats, setAvaliacaoStats] = useState({ media: 0, total: 0 });
  const [mostrarAvaliacoes, setMostrarAvaliacoes] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { usuario } = useAuth();

  useEffect(() => {
    carregarStats();
  }, [posto.id, refreshKey]);

  async function carregarStats() {
    try {
      const response = await avaliacaoService.mediaPorPosto(posto.id);
      setAvaliacaoStats(response.data);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  }

  function handleAvaliacaoAdded() {
    setRefreshKey(prev => prev + 1);
  }

  function renderEstrelas(media) {
    const fullStars = Math.floor(media);
    const hasHalf = media % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (hasHalf && fullStars < 5) stars += '½';
    const empty = 5 - fullStars - (hasHalf ? 1 : 0);
    stars += '☆'.repeat(Math.max(0, empty));
    return stars;
  }

  return (
    <div className="posto-card">
      <div className="posto-header">
        <h4>{posto.nome}</h4>
        {podeDeletar && (
          <button 
            className="btn btn-danger btn-sm"
            onClick={onDelete}
          >
            ✕
          </button>
        )}
      </div>
      <p className="endereco">{getEnderecoFormatado(posto)}</p>
      
      <div className="precos">
        {precos?.GASOLINA && (
          <span className="preco gasolina">
            ⛽ Gasolina: R$ {Number(precos.GASOLINA).toFixed(2)}
          </span>
        )}
        {precos?.ETANOL && (
          <span className="preco etanol">
            🌿 Etanol: R$ {Number(precos.ETANOL).toFixed(2)}
          </span>
        )}
        {precos?.DIESEL && (
          <span className="preco diesel">
            🛢️ Diesel: R$ {Number(precos.DIESEL).toFixed(2)}
          </span>
        )}
        {!precos && (
          <span className="sem-preco">Sem preços cadastrados</span>
        )}
      </div>

      {/* Estatísticas de Avaliações */}
      <div className="avaliacao-stats">
        <span className="avaliacao-media">
          {renderEstrelas(avaliacaoStats.media)} {avaliacaoStats.media.toFixed(1)}
        </span>
        <span className="avaliacao-count">
          ({avaliacaoStats.total} {avaliacaoStats.total === 1 ? 'avaliação' : 'avaliações'})
        </span>
      </div>

      {/* Toggle para ver/criar avaliações */}
      <div className="avaliacoes-section">
        <button 
          className="avaliacoes-toggle"
          onClick={() => setMostrarAvaliacoes(!mostrarAvaliacoes)}
        >
          {mostrarAvaliacoes ? '▼ Ocultar avaliações' : '▶ Ver avaliações'}
        </button>

        {mostrarAvaliacoes && (
          <>
            {usuario && usuario.tipo === 'MOTORISTA' && (
              <AvaliacaoForm 
                postoId={posto.id} 
                onAvaliacaoAdded={handleAvaliacaoAdded} 
              />
            )}
            <AvaliacaoList postoId={posto.id} refresh={refreshKey} onAvaliacaoDeleted={handleAvaliacaoAdded} />
          </>
        )}
      </div>
    </div>
  );
}

export default PostoCard;
