import { useState, useEffect } from 'react';
import { avaliacaoService, usuarioService } from '@tanq/core-logic';
import { useAuth } from '@tanq/core-logic';

function AvaliacaoList({ postoId, refresh, onAvaliacaoDeleted }) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [loading, setLoading] = useState(true);
  const { usuario } = useAuth();

  useEffect(() => {
    carregarAvaliacoes();
  }, [postoId, refresh]);

  async function carregarAvaliacoes() {
    try {
      const response = await avaliacaoService.listarPorPosto(postoId);
      setAvaliacoes(response.data);
      
      // Carregar nomes dos usuários
      const usuariosMap = {};
      for (const av of response.data) {
        if (!usuariosMap[av.usuarioId]) {
          try {
            const userRes = await usuarioService.buscarPorId(av.usuarioId);
            usuariosMap[av.usuarioId] = userRes.data.nome;
          } catch {
            usuariosMap[av.usuarioId] = 'Usuário';
          }
        }
      }
      setUsuarios(usuariosMap);
    } catch (err) {
      console.error('Erro ao carregar avaliações:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Tem certeza que deseja excluir esta avaliação?')) return;
    
    try {
      await avaliacaoService.deletar(id, usuario.id);
      carregarAvaliacoes();
      // Notificar o componente pai para atualizar as estatísticas
      if (onAvaliacaoDeleted) onAvaliacaoDeleted();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao excluir avaliação');
    }
  }

  function podeDeletar(avaliacao) {
    if (!usuario) return false;
    if (usuario.tipo === 'ADMINISTRADOR') return true;
    if (usuario.tipo === 'MOTORISTA' && avaliacao.usuarioId === usuario.id) return true;
    return false;
  }

  function formatarData(dataStr) {
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR');
  }

  function renderEstrelas(nota) {
    return '★'.repeat(nota) + '☆'.repeat(5 - nota);
  }

  if (loading) return <p className="loading-text">Carregando avaliações...</p>;

  if (avaliacoes.length === 0) {
    return <p className="sem-avaliacoes">Nenhuma avaliação ainda</p>;
  }

  return (
    <div className="avaliacoes-list">
      {avaliacoes.map((av) => (
        <div key={av.id} className="avaliacao-item">
          <div className="avaliacao-header">
            <span className="avaliacao-usuario">{usuarios[av.usuarioId] || 'Usuário'}</span>
            <span className="avaliacao-estrelas">{renderEstrelas(av.nota)}</span>
            {podeDeletar(av) && (
              <button 
                className="btn btn-danger btn-xs"
                onClick={() => handleDelete(av.id)}
              >
                ✕
              </button>
            )}
          </div>
          {av.comentario && <p className="avaliacao-comentario">{av.comentario}</p>}
          <span className="avaliacao-data">{formatarData(av.criadoEm)}</span>
        </div>
      ))}
    </div>
  );
}

export default AvaliacaoList;
