import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postoService, precoService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import MapaPostos from '../components/MapaPostos';

// Formata o endereço para exibição
function getEnderecoFormatado(posto) {
  const partes = [];
  if (posto.rua) {
    let end = posto.rua;
    if (posto.numero) end += ', ' + posto.numero;
    partes.push(end);
  }
  if (posto.bairro) partes.push(posto.bairro);
  if (posto.cidade) partes.push(posto.cidade);
  return partes.join(' - ') || 'Endereço não informado';
}

function HomePage() {
  const [postos, setPostos] = useState([]);
  const [precos, setPrecos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const { usuario } = useAuth();

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [postosResponse, precosResponse] = await Promise.all([
        postoService.listarTodos(),
        precoService.listarTodos()
      ]);
      
      setPostos(postosResponse.data);
      
      // Agrupar preços por posto
      const precosMap = {};
      precosResponse.data.forEach(preco => {
        if (!precosMap[preco.postoId]) {
          precosMap[preco.postoId] = {};
        }
        precosMap[preco.postoId][preco.tipoCombustivel] = preco.valor;
      });
      setPrecos(precosMap);
      
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePosto(postoId) {
    if (!usuario) {
      alert('Você precisa estar logado para excluir postos.');
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir este posto?')) {
      try {
        await postoService.deletar(postoId, usuario.id);
        carregarDados();
      } catch (err) {
        alert(err.response?.data?.erro || 'Erro ao excluir posto.');
      }
    }
  }

  function podeDeletarPosto(posto) {
    if (!usuario) return false;
    if (usuario.tipo === 'ADMINISTRADOR') return true;
    if (usuario.tipo === 'DONO_POSTO' && posto.donoId === usuario.id) return true;
    return false;
  }

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={carregarDados}>Tentar novamente</button>
      </div>
    );
  }

  const postosParaExibir = mostrarTodos ? postos : postos.slice(0, 6);

  return (
    <div className="home-page">
      <section className="hero">
        <h2>Encontre os melhores preços de combustível! 🚗</h2>
        <p>Compare preços de gasolina, etanol e diesel em postos da sua região.</p>
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
          Cadastrar Novo
        </Link>
      </section>

      {/* Mapa na HomePage */}
      <section className="mapa-section">
        <h3>🗺️ Postos no Mapa</h3>
        <MapaPostos height="350px" />
      </section>

      <section className="postos-section">
        <h3>📍 Postos Disponíveis</h3>
        
        {postos.length === 0 ? (
          <p className="empty-message">Nenhum posto cadastrado ainda.</p>
        ) : (
          <>
            <div className="posts-grid">
              {postosParaExibir.map((posto) => (
                <div key={posto.id} className="posto-card">
                  <div className="posto-header">
                    <h4>{posto.nome}</h4>
                    {podeDeletarPosto(posto) && (
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeletePosto(posto.id)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <p className="endereco">{getEnderecoFormatado(posto)}</p>
                  <div className="precos">
                    {precos[posto.id]?.GASOLINA && (
                      <span className="preco gasolina">
                        ⛽ Gasolina: R$ {Number(precos[posto.id].GASOLINA).toFixed(2)}
                      </span>
                    )}
                    {precos[posto.id]?.ETANOL && (
                      <span className="preco etanol">
                        🌿 Etanol: R$ {Number(precos[posto.id].ETANOL).toFixed(2)}
                      </span>
                    )}
                    {precos[posto.id]?.DIESEL && (
                      <span className="preco diesel">
                        🛢️ Diesel: R$ {Number(precos[posto.id].DIESEL).toFixed(2)}
                      </span>
                    )}
                    {!precos[posto.id] && (
                      <span className="sem-preco">Sem preços cadastrados</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {postos.length > 6 && (
              <div className="ver-mais">
                <button 
                  className="btn btn-outline"
                  onClick={() => setMostrarTodos(!mostrarTodos)}
                >
                  {mostrarTodos ? 'Mostrar menos' : `Ver todos (${postos.length} postos)`}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default HomePage;
