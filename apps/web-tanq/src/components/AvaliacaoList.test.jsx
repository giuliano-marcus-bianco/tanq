import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AvaliacaoList from './AvaliacaoList';
import { avaliacaoService, usuarioService, useAuth } from '@tanq/core-logic';

// Mock consolidado do módulo @tanq/core-logic
vi.mock('@tanq/core-logic', () => ({
  avaliacaoService: {
    listarPorPosto: vi.fn(),
    deletar: vi.fn(),
  },
  usuarioService: {
    buscarPorId: vi.fn(),
  },
  useAuth: vi.fn(),
}));

describe('AvaliacaoList', () => {
  const mockOnAvaliacaoDeleted = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ usuario: null });
  });

  it('deve exibir loading inicialmente', () => {
    avaliacaoService.listarPorPosto.mockReturnValue(new Promise(() => {}));

    render(<AvaliacaoList postoId={1} onAvaliacaoDeleted={mockOnAvaliacaoDeleted} />);

    expect(screen.getByText('Carregando avaliações...')).toBeInTheDocument();
  });

  it('deve exibir mensagem quando não há avaliações', async () => {
    avaliacaoService.listarPorPosto.mockResolvedValue({ data: [] });

    render(<AvaliacaoList postoId={1} onAvaliacaoDeleted={mockOnAvaliacaoDeleted} />);

    await waitFor(() => {
      expect(screen.getByText('Nenhuma avaliação ainda')).toBeInTheDocument();
    });
  });

  it('deve exibir lista de avaliações', async () => {
    const mockAvaliacoes = [
      { id: 1, nota: 5, comentario: 'Excelente!', usuarioId: 2, criadoEm: '2024-01-15T10:00:00' },
      { id: 2, nota: 4, comentario: 'Bom', usuarioId: 3, criadoEm: '2024-01-14T10:00:00' },
    ];

    avaliacaoService.listarPorPosto.mockResolvedValue({ data: mockAvaliacoes });
    usuarioService.buscarPorId.mockResolvedValue({ data: { nome: 'João' } });

    render(<AvaliacaoList postoId={1} onAvaliacaoDeleted={mockOnAvaliacaoDeleted} />);

    await waitFor(() => {
      expect(screen.getByText('Excelente!')).toBeInTheDocument();
      expect(screen.getByText('Bom')).toBeInTheDocument();
    });
  });

  it('deve exibir estrelas corretamente', async () => {
    const mockAvaliacoes = [
      { id: 1, nota: 3, comentario: 'Regular', usuarioId: 2, criadoEm: '2024-01-15T10:00:00' },
    ];

    avaliacaoService.listarPorPosto.mockResolvedValue({ data: mockAvaliacoes });
    usuarioService.buscarPorId.mockResolvedValue({ data: { nome: 'Maria' } });

    render(<AvaliacaoList postoId={1} onAvaliacaoDeleted={mockOnAvaliacaoDeleted} />);

    await waitFor(() => {
      // 3 estrelas cheias + 2 vazias = ★★★☆☆
      expect(screen.getByText('★★★☆☆')).toBeInTheDocument();
    });
  });

  it('deve mostrar botão de deletar para ADMINISTRADOR', async () => {
    useAuth.mockReturnValue({
      usuario: { id: 1, nome: 'Admin', tipo: 'ADMINISTRADOR' }
    });

    const mockAvaliacoes = [
      { id: 1, nota: 5, usuarioId: 2, criadoEm: '2024-01-15T10:00:00' },
    ];

    avaliacaoService.listarPorPosto.mockResolvedValue({ data: mockAvaliacoes });
    usuarioService.buscarPorId.mockResolvedValue({ data: { nome: 'João' } });

    render(<AvaliacaoList postoId={1} onAvaliacaoDeleted={mockOnAvaliacaoDeleted} />);

    await waitFor(() => {
      expect(screen.getByText('✕')).toBeInTheDocument();
    });
  });

  it('deve mostrar botão de deletar para próprio MOTORISTA', async () => {
    useAuth.mockReturnValue({
      usuario: { id: 2, nome: 'João', tipo: 'MOTORISTA' }
    });

    const mockAvaliacoes = [
      { id: 1, nota: 5, usuarioId: 2, criadoEm: '2024-01-15T10:00:00' },
    ];

    avaliacaoService.listarPorPosto.mockResolvedValue({ data: mockAvaliacoes });
    usuarioService.buscarPorId.mockResolvedValue({ data: { nome: 'João' } });

    render(<AvaliacaoList postoId={1} onAvaliacaoDeleted={mockOnAvaliacaoDeleted} />);

    await waitFor(() => {
      expect(screen.getByText('✕')).toBeInTheDocument();
    });
  });

  it('não deve mostrar botão de deletar para outro MOTORISTA', async () => {
    useAuth.mockReturnValue({
      usuario: { id: 3, nome: 'Maria', tipo: 'MOTORISTA' }
    });

    const mockAvaliacoes = [
      { id: 1, nota: 5, usuarioId: 2, criadoEm: '2024-01-15T10:00:00' },
    ];

    avaliacaoService.listarPorPosto.mockResolvedValue({ data: mockAvaliacoes });
    usuarioService.buscarPorId.mockResolvedValue({ data: { nome: 'João' } });

    render(<AvaliacaoList postoId={1} onAvaliacaoDeleted={mockOnAvaliacaoDeleted} />);

    await waitFor(() => {
      expect(screen.queryByText('✕')).not.toBeInTheDocument();
    });
  });
});
