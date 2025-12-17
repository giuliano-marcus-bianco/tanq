import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AuthPages.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      await login(email, senha);
      navigate('/');
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>🔐 Login</h1>
        <p>Entre na sua conta Tanq</p>

        {erro && <div className="erro-mensagem">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Sua senha"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-link">
          Não tem conta? <Link to="/cadastro-usuario">Cadastre-se</Link>
        </p>

        <div className="demo-info">
          <h4>Usuários de Demonstração:</h4>
          <p><strong>Admin:</strong> admin@tanq.com / admin123</p>
          <p><strong>Motorista:</strong> joao@email.com / 123456</p>
          <p><strong>Dono de Posto:</strong> maria@posto.com / 123456</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
