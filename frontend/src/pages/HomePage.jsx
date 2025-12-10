import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postoService } from '../services/api';

function HomePage() {
  const [postos, setPostos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarPostos();
  }, []);

  async function carregarPostos() {
    try {
      const response = await postoService.listarTodos();
      setPostos(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar postos:', err);
      setError('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={carregarPostos}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="home-page">
      <section className="hero">
        <h2>Encontre os melhores preços de combustível! 🚗</h2>
        <p>Compare preços de gasolina e etanol em postos da sua região.</p>
      </section>

      <section className="stats">
        <div className="stat-card">
          <span className="stat-number">{postos.length}</span>
          <span className="stat-label">Postos Cadastrados</span>
        </div>
      </section>

      <section className="actions">
        <Link to="/ranking" className="btn btn-primary">
          Ver Ranking de Preços
        </Link>
        <Link to="/cadastro" className="btn btn-secondary">
          Cadastrar Novo Posto
        </Link>
      </section>

      {postos.length > 0 && (
        <section className="recent-posts">
          <h3>Postos Recentes</h3>
          <div className="posts-grid">
            {postos.slice(0, 3).map((posto) => (
              <div key={posto.id} className="posto-card">
                <h4>{posto.nome}</h4>
                <p className="endereco">{posto.endereco || 'Endereço não informado'}</p>
                <div className="precos">
                  {posto.precoGasolina && (
                    <span className="preco gasolina">
                      Gasolina: R$ {Number(posto.precoGasolina).toFixed(2)}
                    </span>
                  )}
                  {posto.precoEtanol && (
                    <span className="preco etanol">
                      Etanol: R$ {Number(posto.precoEtanol).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default HomePage;
