import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/api';
import type { Usuario } from '../types';

export interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  estaLogado: boolean;
  login: (email: string, senha: string) => Promise<Usuario>;
  register: (dados: Omit<Usuario, 'id'>) => Promise<Usuario>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar usuário salvo de forma ASSÍNCRONA (funciona em Web e Mobile)
    const loadUser = async () => {
      try {
        const usuarioSalvo = await authService.obterUsuario();
        if (usuarioSalvo) {
          setUsuario(usuarioSalvo);
        }
      } catch (error) {
        console.error('[AuthContext] Erro ao carregar usuário:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (email: string, senha: string): Promise<Usuario> => {
    const response = await authService.login(email, senha);
    const dadosUsuario = response.data;
    await authService.salvarUsuario(dadosUsuario);
    setUsuario(dadosUsuario);
    return dadosUsuario;
  };

  const register = async (dados: Omit<Usuario, 'id'>): Promise<Usuario> => {
    const response = await authService.register(dados);
    const dadosUsuario = response.data;
    await authService.salvarUsuario(dadosUsuario);
    setUsuario(dadosUsuario);
    return dadosUsuario;
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
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
