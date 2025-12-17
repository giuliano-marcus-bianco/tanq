import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const usuarioSalvo = authService.obterUsuario();
    if (usuarioSalvo) {
      setUsuario(usuarioSalvo);
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    const response = await authService.login(email, senha);
    const dadosUsuario = response.data;
    authService.salvarUsuario(dadosUsuario);
    setUsuario(dadosUsuario);
    return dadosUsuario;
  };

  const register = async (dados) => {
    const response = await authService.register(dados);
    const dadosUsuario = response.data;
    authService.salvarUsuario(dadosUsuario);
    setUsuario(dadosUsuario);
    return dadosUsuario;
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
  };

  const value = {
    usuario,
    loading,
    login,
    register,
    logout,
    estaLogado: !!usuario
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
