import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postoService, precoService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function CadastroPage() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [tabAtiva, setTabAtiva] = useState('preco'); // 'posto' ou 'preco'
  const [postos, setPostos] = useState([]);
  
  // Form Posto
  const [formPosto, setFormPosto] = useState({
    nome: '',
    endereco: '',
  });

  // Form Preço
  const [formPreco, setFormPreco] = useState({
    postoId: '',
    tipoCombustivel: 'GASOLINA',
    valor: '',
  });

  useEffect(() => {
    carregarPostos();
  }, []);

  async function carregarPostos() {
    try {
      const response = await postoService.listarTodos();
      setPostos(response.data);
    } catch (err) {
      console.error('Erro ao carregar postos:', err);
    }
  }

  // Verificar permissões
  const podeAdicionarPosto = usuario && (usuario.tipo === 'ADMINISTRADOR' || usuario.tipo === 'DONO_POSTO');
  const podeAdicionarPreco = !!usuario; // Qualquer usuário logado pode adicionar preço

  async function handleSubmitPosto(e) {
    e.preventDefault();
    setErro('');
    setSucesso('');
    
    if (!formPosto.nome.trim()) {
      setErro('Nome do posto é obrigatório.');
      return;
    }

    setLoading(true);

    try {
      await postoService.criar(formPosto, usuario.id);
      setSucesso('Posto cadastrado com sucesso!');
      setFormPosto({ nome: '', endereco: '' });
      carregarPostos();
      setTimeout(() => navigate('/ranking'), 2000);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao cadastrar posto.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitPreco(e) {
    e.preventDefault();
    setErro('');
    setSucesso('');
    
    if (!formPreco.postoId || !formPreco.valor) {
      setErro('Selecione um posto e informe o valor.');
      return;
    }

    setLoading(true);

    try {
      await precoService.criar(formPreco, usuario.id);
      setSucesso('Preço cadastrado com sucesso!');
      setFormPreco({ postoId: '', tipoCombustivel: 'GASOLINA', valor: '' });
      setTimeout(() => navigate('/ranking'), 2000);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao cadastrar preço.');
    } finally {
      setLoading(false);
    }
  }

  if (!usuario) {
    return (
      <div className="cadastro-page">
        <h2>📝 Cadastro</h2>
        <div className="mensagem erro">
          Você precisa estar logado para cadastrar postos ou preços.
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Fazer Login
        </button>
      </div>
    );
  }

  return (
    <div className="cadastro-page">
      <h2>📝 Cadastrar</h2>

      <div className="tabs">
        <button 
          className={`tab ${tabAtiva === 'preco' ? 'active' : ''}`}
          onClick={() => setTabAtiva('preco')}
        >
          ⛽ Novo Preço
        </button>
        {podeAdicionarPosto && (
          <button 
            className={`tab ${tabAtiva === 'posto' ? 'active' : ''}`}
            onClick={() => setTabAtiva('posto')}
          >
            🏪 Novo Posto
          </button>
        )}
      </div>

      {erro && <div className="mensagem erro">{erro}</div>}
      {sucesso && <div className="mensagem sucesso">{sucesso}</div>}

      {tabAtiva === 'preco' && (
        <form onSubmit={handleSubmitPreco} className="form-cadastro">
          <h3>Cadastrar Preço de Combustível</h3>
          
          <div className="form-group">
            <label htmlFor="postoId">Posto *</label>
            <select
              id="postoId"
              value={formPreco.postoId}
              onChange={(e) => setFormPreco({...formPreco, postoId: e.target.value})}
              required
            >
              <option value="">Selecione um posto</option>
              {postos.map(posto => (
                <option key={posto.id} value={posto.id}>{posto.nome}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tipoCombustivel">Tipo de Combustível *</label>
            <select
              id="tipoCombustivel"
              value={formPreco.tipoCombustivel}
              onChange={(e) => setFormPreco({...formPreco, tipoCombustivel: e.target.value})}
            >
              <option value="GASOLINA">Gasolina</option>
              <option value="ETANOL">Etanol</option>
              <option value="DIESEL">Diesel</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="valor">Preço (R$) *</label>
            <input
              type="number"
              id="valor"
              value={formPreco.valor}
              onChange={(e) => setFormPreco({...formPreco, valor: e.target.value})}
              placeholder="5.89"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar Preço'}
            </button>
          </div>
        </form>
      )}

      {tabAtiva === 'posto' && podeAdicionarPosto && (
        <form onSubmit={handleSubmitPosto} className="form-cadastro">
          <h3>Cadastrar Novo Posto</h3>
          
          <div className="form-group">
            <label htmlFor="nome">Nome do Posto *</label>
            <input
              type="text"
              id="nome"
              value={formPosto.nome}
              onChange={(e) => setFormPosto({...formPosto, nome: e.target.value})}
              placeholder="Ex: Posto Shell Centro"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endereco">Endereço</label>
            <input
              type="text"
              id="endereco"
              value={formPosto.endereco}
              onChange={(e) => setFormPosto({...formPosto, endereco: e.target.value})}
              placeholder="Ex: Rua Principal, 100"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar Posto'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CadastroPage;
