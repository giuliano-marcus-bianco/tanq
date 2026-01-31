import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import RankingPage from './pages/RankingPage';
import CadastroPage from './pages/CadastroPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MapaPage from './pages/MapaPage';
import './App.css';

function App() {
  const { usuario, logout, estaLogado } = useAuth();

  return (
    <div className="app">
      <header className="header">
        <h1>⛽ Tanq</h1>
        <nav>
          <Link to="/">Início</Link>
          <Link to="/ranking">Ranking</Link>
          <Link to="/mapa">Mapa</Link>
          <Link to="/cadastro">Cadastrar</Link>
          {estaLogado ? (
            <>
              <span className="user-info">Olá, {usuario?.nome}</span>
              <button onClick={logout} className="btn-logout">Sair</button>
            </>
          ) : (
            <Link to="/login" className="btn-login">Entrar</Link>
          )}
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/mapa" element={<MapaPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro-usuario" element={<RegisterPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>Tanq © 2024 - Projeto Acadêmico IFSC</p>
      </footer>
    </div>
  );
}

export default App;
