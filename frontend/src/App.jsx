import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RankingPage from './pages/RankingPage';
import CadastroPage from './pages/CadastroPage';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>⛽ Tanq</h1>
        <nav>
          <Link to="/">Início</Link>
          <Link to="/ranking">Ranking</Link>
          <Link to="/cadastro">Cadastrar Posto</Link>
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>Tanq © 2024 - Projeto Acadêmico IFSC</p>
      </footer>
    </div>
  );
}

export default App;
