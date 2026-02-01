import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/api';
import type { Usuario } from '../types';

interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  estaLogado: boolean;
  login: (email: string, senha: string) => Promise<Usuario>;
  register: (dados: Omit<Usuario, 'id'>) => Promise<Usuario>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    // Usando versão síncrona para compatibilidade com SSR
    const usuarioSalvo = authService.obterUsuarioSync();
    if (usuarioSalvo) {
      setUsuario(usuarioSalvo);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, senha: string): Promise<Usuario> => {
    const response = await authService.login(email, senha);
    const dadosUsuario = response.data;
    authService.salvarUsuarioSync(dadosUsuario);
    setUsuario(dadosUsuario);
    return dadosUsuario;
  };

  const register = async (dados: Omit<Usuario, 'id'>): Promise<Usuario> => {
    const response = await authService.register(dados);
    const dadosUsuario = response.data;
    authService.salvarUsuarioSync(dadosUsuario);
    setUsuario(dadosUsuario);
    return dadosUsuario;
  };

  const logout = (): void => {
    authService.logoutSync();
    setUsuario(null);
  };

  const value: AuthContextType = {
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

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

export { AuthContext };
export type { AuthContextType };
