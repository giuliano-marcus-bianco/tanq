import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postoService, precoService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import SeletorLocalizacao from '../components/SeletorLocalizacao';

function CadastroPage() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [tabAtiva, setTabAtiva] = useState('preco');
  const [postos, setPostos] = useState([]);
  
  // Form Posto com campos de endereço separados
  const [formPosto, setFormPosto] = useState({
    nome: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    latitude: null,
    longitude: null,
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

  const podeAdicionarPosto = usuario && (usuario.tipo === 'ADMINISTRADOR' || usuario.tipo === 'DONO_POSTO');
  const podeAdicionarPreco = !!usuario;

  // Monta o endereço para buscar no geocoding
  function montarEnderecoParaBusca() {
    const partes = [];
    if (formPosto.rua) partes.push(formPosto.rua);
    if (formPosto.numero) partes.push(formPosto.numero);
    if (formPosto.bairro) partes.push(formPosto.bairro);
    if (formPosto.cidade) partes.push(formPosto.cidade);
    if (formPosto.estado) partes.push(formPosto.estado);
    return partes.join(', ');
  }

  function handleLocationChange(location) {
    setFormPosto({
      ...formPosto,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  }

  async function handleSubmitPosto(e) {
    e.preventDefault();
    setErro('');
    setSucesso('');
    
    if (!formPosto.nome.trim()) {
      setErro('Nome do posto é obrigatório.');
      return;
    }

    if (!formPosto.rua.trim() || !formPosto.cidade.trim() || !formPosto.estado.trim()) {
      setErro('Rua, cidade e estado são obrigatórios.');
      return;
    }

    if (!formPosto.latitude || !formPosto.longitude) {
      setErro('Clique em "Buscar no Mapa" para verificar a localização.');
      return;
    }

    setLoading(true);

    try {
      await postoService.criar(formPosto, usuario.id);
      setSucesso('Posto cadastrado com sucesso!');
      setFormPosto({ 
        nome: '', rua: '', numero: '', complemento: '', 
        bairro: '', cidade: '', estado: '', 
        latitude: null, longitude: null 
      });
      carregarPostos();
      setTimeout(() => navigate('/'), 2000);
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
    if (posto.estado) partes.push(posto.estado);
    return partes.join(' - ') || 'Endereço não informado';
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
                <option key={posto.id} value={posto.id}>
                  {posto.nome} - {getEnderecoFormatado(posto)}
                </option>
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

          <div className="form-section-title">Endereço</div>

          <div className="form-row">
            <div className="form-group flex-3">
              <label htmlFor="rua">Rua *</label>
              <input
                type="text"
                id="rua"
                value={formPosto.rua}
                onChange={(e) => setFormPosto({...formPosto, rua: e.target.value})}
                placeholder="Ex: Av. Brasil"
                required
              />
            </div>
            <div className="form-group flex-1">
              <label htmlFor="numero">Número</label>
              <input
                type="text"
                id="numero"
                value={formPosto.numero}
                onChange={(e) => setFormPosto({...formPosto, numero: e.target.value})}
                placeholder="100"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-2">
              <label htmlFor="complemento">Complemento</label>
              <input
                type="text"
                id="complemento"
                value={formPosto.complemento}
                onChange={(e) => setFormPosto({...formPosto, complemento: e.target.value})}
                placeholder="Ex: Próximo ao shopping"
              />
            </div>
            <div className="form-group flex-2">
              <label htmlFor="bairro">Bairro</label>
              <input
                type="text"
                id="bairro"
                value={formPosto.bairro}
                onChange={(e) => setFormPosto({...formPosto, bairro: e.target.value})}
                placeholder="Ex: Centro"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-3">
              <label htmlFor="cidade">Cidade *</label>
              <input
                type="text"
                id="cidade"
                value={formPosto.cidade}
                onChange={(e) => setFormPosto({...formPosto, cidade: e.target.value})}
                placeholder="Ex: Florianópolis"
                required
              />
            </div>
            <div className="form-group flex-1">
              <label htmlFor="estado">UF *</label>
              <input
                type="text"
                id="estado"
                value={formPosto.estado}
                onChange={(e) => setFormPosto({...formPosto, estado: e.target.value.toUpperCase()})}
                placeholder="SC"
                maxLength="2"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Localização no Mapa *</label>
            <SeletorLocalizacao 
              onLocationChange={handleLocationChange}
              enderecoBusca={montarEnderecoParaBusca()}
              posicaoInicial={formPosto.latitude && formPosto.longitude ? [formPosto.latitude, formPosto.longitude] : null}
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
