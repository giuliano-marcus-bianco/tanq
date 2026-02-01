import { useState } from 'react';
import { avaliacaoService } from '@tanq/core-logic';
import { useAuth } from '@tanq/core-logic';

function AvaliacaoForm({ postoId, onAvaliacaoAdded }) {
  const [nota, setNota] = useState(0);
  const [hoverNota, setHoverNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const { usuario } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    if (!usuario) {
      setErro('Você precisa estar logado para avaliar');
      return;
    }

    if (usuario.tipo === 'DONO_POSTO') {
      setErro('Dono de posto não pode criar avaliações');
      return;
    }

    if (nota === 0) {
      setErro('Selecione uma nota');
      return;
    }

    setLoading(true);
    try {
      await avaliacaoService.criar({ postoId, nota, comentario }, usuario.id);
      setNota(0);
      setComentario('');
      if (onAvaliacaoAdded) onAvaliacaoAdded();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar avaliação');
    } finally {
      setLoading(false);
    }
  }

  // Se usuário não está logado ou é DONO_POSTO, não mostra o formulário
  if (!usuario || usuario.tipo === 'DONO_POSTO') {
    return null;
  }

  return (
    <form className="avaliacao-form" onSubmit={handleSubmit}>
      <div className="estrelas-input">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`estrela ${star <= (hoverNota || nota) ? 'ativa' : ''}`}
            onClick={() => setNota(star)}
            onMouseEnter={() => setHoverNota(star)}
            onMouseLeave={() => setHoverNota(0)}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        placeholder="Comentário (opcional)"
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        maxLength={500}
        rows={2}
      />
      {erro && <p className="erro">{erro}</p>}
      <button type="submit" disabled={loading} className="btn btn-primary btn-sm">
        {loading ? 'Enviando...' : 'Enviar Avaliação'}
      </button>
    </form>
  );
}

export default AvaliacaoForm;
