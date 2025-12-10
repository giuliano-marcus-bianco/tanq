import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postoService } from '../services/api';

function CadastroPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    precoGasolina: '',
    precoEtanol: '',
    precoDiesel: '',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSucesso('');
    
    if (!formData.nome.trim()) {
      setErro('Nome do posto é obrigatório.');
      return;
    }

    setLoading(true);

    try {
      const posto = {
        nome: formData.nome,
        endereco: formData.endereco || null,
        precoGasolina: formData.precoGasolina ? parseFloat(formData.precoGasolina) : null,
        precoEtanol: formData.precoEtanol ? parseFloat(formData.precoEtanol) : null,
        precoDiesel: formData.precoDiesel ? parseFloat(formData.precoDiesel) : null,
      };

      await postoService.criar(posto);
      setSucesso('Posto cadastrado com sucesso!');
      
      // Limpar formulário
      setFormData({
        nome: '',
        endereco: '',
        precoGasolina: '',
        precoEtanol: '',
        precoDiesel: '',
      });

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/ranking');
      }, 2000);

    } catch (err) {
      console.error('Erro ao cadastrar:', err);
      setErro('Erro ao cadastrar posto. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cadastro-page">
      <h2>📝 Cadastrar Novo Posto</h2>

      {erro && <div className="mensagem erro">{erro}</div>}
      {sucesso && <div className="mensagem sucesso">{sucesso}</div>}

      <form onSubmit={handleSubmit} className="form-cadastro">
        <div className="form-group">
          <label htmlFor="nome">Nome do Posto *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Ex: Posto Shell Centro"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endereco">Endereço</label>
          <input
            type="text"
            id="endereco"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            placeholder="Ex: Rua Principal, 100"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="precoGasolina">Gasolina (R$)</label>
            <input
              type="number"
              id="precoGasolina"
              name="precoGasolina"
              value={formData.precoGasolina}
              onChange={handleChange}
              placeholder="5.89"
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="precoEtanol">Etanol (R$)</label>
            <input
              type="number"
              id="precoEtanol"
              name="precoEtanol"
              value={formData.precoEtanol}
              onChange={handleChange}
              placeholder="3.99"
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="precoDiesel">Diesel (R$)</label>
            <input
              type="number"
              id="precoDiesel"
              name="precoDiesel"
              value={formData.precoDiesel}
              onChange={handleChange}
              placeholder="5.49"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar Posto'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/ranking')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CadastroPage;
