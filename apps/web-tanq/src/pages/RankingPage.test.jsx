import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import RankingPage from './RankingPage';
import { precoService, postoService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// Mock dos serviços
vi.mock('../services/api', () => ({
  precoService: {
    ranking: vi.fn(),
    deletar: vi.fn(),
  },
  postoService: {
    listarTodos: vi.fn(),
  },
}));

// Mock do hook useAuth
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('RankingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ usuario: null });
  });

  it('deve exibir loading inicialmente', () => {
    precoService.ranking.mockReturnValue(new Promise(() => {}));
    postoService.listarTodos.mockReturnValue(new Promise(() => {}));

    render(<RankingPage />);

    expect(screen.getByText('Carregando ranking...')).toBeInTheDocument();
  });

  it('deve exibir título da página', async () => {
    precoService.ranking.mockResolvedValue({ data: [] });
    postoService.listarTodos.mockResolvedValue({ data: [] });

    render(<RankingPage />);

    await waitFor(() => {
      expect(screen.getByText('🏆 Ranking de Preços')).toBeInTheDocument();
    });
  });

  it('deve exibir filtro de combustível', async () => {
    precoService.ranking.mockResolvedValue({ data: [] });
    postoService.listarTodos.mockResolvedValue({ data: [] });

    render(<RankingPage />);

    await waitFor(() => {
      expect(screen.getByText('Tipo de combustível:')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('deve exibir ranking de preços', async () => {
    const mockPrecos = [
      { id: 1, postoId: 1, tipoCombustivel: 'GASOLINA', valor: 5.49, usuarioId: 2 },
      { id: 2, postoId: 2, tipoCombustivel: 'GASOLINA', valor: 5.69, usuarioId: 3 },
    ];
    const mockPostos = [
      { id: 1, nome: 'Posto Barato', endereco: 'Rua A' },
      { id: 2, nome: 'Posto Médio', endereco: 'Rua B' },
    ];

    precoService.ranking.mockResolvedValue({ data: mockPrecos });
    postoService.listarTodos.mockResolvedValue({ data: mockPostos });

    render(<RankingPage />);

    await waitFor(() => {
      expect(screen.getByText('1º')).toBeInTheDocument();
      expect(screen.getByText('2º')).toBeInTheDocument();
      expect(screen.getByText('Posto Barato')).toBeInTheDocument();
      expect(screen.getByText('Posto Médio')).toBeInTheDocument();
      expect(screen.getByText('R$ 5.49')).toBeInTheDocument();
      expect(screen.getByText('R$ 5.69')).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem quando não há preços', async () => {
    precoService.ranking.mockResolvedValue({ data: [] });
    postoService.listarTodos.mockResolvedValue({ data: [] });

    render(<RankingPage />);

    await waitFor(() => {
      expect(screen.getByText('Nenhum preço cadastrado para este combustível.')).toBeInTheDocument();
    });
  });

  it('deve alterar ranking ao mudar tipo de combustível', async () => {
    precoService.ranking.mockResolvedValue({ data: [] });
    postoService.listarTodos.mockResolvedValue({ data: [] });

    render(<RankingPage />);

    await waitFor(() => {
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'ETANOL' } });
    });

    expect(precoService.ranking).toHaveBeenCalledWith('ETANOL');
  });

  it('deve exibir botão de excluir para ADMINISTRADOR', async () => {
    useAuth.mockReturnValue({
      usuario: { id: 1, nome: 'Admin', tipo: 'ADMINISTRADOR' }
    });

    const mockPrecos = [
      { id: 1, postoId: 1, tipoCombustivel: 'GASOLINA', valor: 5.49, usuarioId: 2 },
    ];
    const mockPostos = [
      { id: 1, nome: 'Posto Shell', endereco: 'Rua A' },
    ];

    precoService.ranking.mockResolvedValue({ data: mockPrecos });
    postoService.listarTodos.mockResolvedValue({ data: mockPostos });

    render(<RankingPage />);

    await waitFor(() => {
      expect(screen.getByText('Excluir')).toBeInTheDocument();
    });
  });

  it('deve exibir botão de excluir para próprio usuário', async () => {
    useAuth.mockReturnValue({
      usuario: { id: 2, nome: 'João', tipo: 'MOTORISTA' }
    });

    const mockPrecos = [
      { id: 1, postoId: 1, tipoCombustivel: 'GASOLINA', valor: 5.49, usuarioId: 2 },
    ];
    const mockPostos = [
      { id: 1, nome: 'Posto Shell', endereco: 'Rua A' },
    ];

    precoService.ranking.mockResolvedValue({ data: mockPrecos });
    postoService.listarTodos.mockResolvedValue({ data: mockPostos });

    render(<RankingPage />);

    await waitFor(() => {
      expect(screen.getByText('Excluir')).toBeInTheDocument();
    });
  });

  it('não deve exibir botão de excluir para outro usuário', async () => {
    useAuth.mockReturnValue({
      usuario: { id: 3, nome: 'Maria', tipo: 'MOTORISTA' }
    });

    const mockPrecos = [
      { id: 1, postoId: 1, tipoCombustivel: 'GASOLINA', valor: 5.49, usuarioId: 2 },
    ];
    const mockPostos = [
      { id: 1, nome: 'Posto Shell', endereco: 'Rua A' },
    ];

    precoService.ranking.mockResolvedValue({ data: mockPrecos });
    postoService.listarTodos.mockResolvedValue({ data: mockPostos });

    render(<RankingPage />);

    await waitFor(() => {
      expect(screen.queryByText('Excluir')).not.toBeInTheDocument();
    });
  });

  it('deve exibir erro quando API falha', async () => {
    precoService.ranking.mockRejectedValue(new Error('API Error'));
    postoService.listarTodos.mockRejectedValue(new Error('API Error'));

    render(<RankingPage />);

    await waitFor(() => {
      expect(screen.getByText(/Erro ao carregar ranking/)).toBeInTheDocument();
    });
  });
});
