import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import PostoCard from './PostoCard';
import { avaliacaoService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// Mock dos serviços
vi.mock('../services/api', () => ({
  avaliacaoService: {
    mediaPorPosto: vi.fn(),
    listarPorPosto: vi.fn(),
    criar: vi.fn(),
    deletar: vi.fn(),
  },
  usuarioService: {
    buscarPorId: vi.fn(),
  },
}));

// Mock do hook useAuth
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('PostoCard', () => {
  const mockPosto = {
    id: 1,
    nome: 'Posto Shell Centro',
    rua: 'Rua Principal',
    numero: '100',
    bairro: 'Centro',
    cidade: 'Florianópolis',
    donoId: 1,
  };

  const mockPrecos = {
    GASOLINA: 5.89,
    ETANOL: 3.99,
    DIESEL: 4.50,
  };

  const mockOnDelete = vi.fn();
  const mockGetEnderecoFormatado = (posto) => {
    const partes = [];
    if (posto.rua) {
      let end = posto.rua;
      if (posto.numero) end += ', ' + posto.numero;
      partes.push(end);
    }
    if (posto.bairro) partes.push(posto.bairro);
    if (posto.cidade) partes.push(posto.cidade);
    return partes.join(' - ') || 'Endereço não informado';
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ usuario: null });
    avaliacaoService.mediaPorPosto.mockResolvedValue({ data: { media: 4.5, total: 10 } });
  });

  it('deve renderizar informações do posto', async () => {
    render(
      <PostoCard
        posto={mockPosto}
        precos={mockPrecos}
        onDelete={mockOnDelete}
        podeDeletar={false}
        getEnderecoFormatado={mockGetEnderecoFormatado}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Posto Shell Centro')).toBeInTheDocument();
      expect(screen.getByText('Rua Principal, 100 - Centro - Florianópolis')).toBeInTheDocument();
    });
  });

  it('deve renderizar preços de combustíveis', async () => {
    render(
      <PostoCard
        posto={mockPosto}
        precos={mockPrecos}
        onDelete={mockOnDelete}
        podeDeletar={false}
        getEnderecoFormatado={mockGetEnderecoFormatado}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Gasolina: R\$ 5.89/)).toBeInTheDocument();
      expect(screen.getByText(/Etanol: R\$ 3.99/)).toBeInTheDocument();
      expect(screen.getByText(/Diesel: R\$ 4.50/)).toBeInTheDocument();
    });
  });

  it('deve renderizar mensagem quando não há preços', async () => {
    render(
      <PostoCard
        posto={mockPosto}
        precos={null}
        onDelete={mockOnDelete}
        podeDeletar={false}
        getEnderecoFormatado={mockGetEnderecoFormatado}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Sem preços cadastrados')).toBeInTheDocument();
    });
  });

  it('deve exibir estatísticas de avaliação', async () => {
    const { container } = render(
      <PostoCard
        posto={mockPosto}
        precos={mockPrecos}
        onDelete={mockOnDelete}
        podeDeletar={false}
        getEnderecoFormatado={mockGetEnderecoFormatado}
      />
    );

    await waitFor(() => {
      // Check that the avaliacao stats section is rendered
      const statsSection = container.querySelector('.avaliacao-stats');
      expect(statsSection).toBeInTheDocument();
    });
  });

  it('deve exibir singular para 1 avaliação', async () => {
    avaliacaoService.mediaPorPosto.mockResolvedValue({ data: { media: 5.0, total: 1 } });

    render(
      <PostoCard
        posto={mockPosto}
        precos={mockPrecos}
        onDelete={mockOnDelete}
        podeDeletar={false}
        getEnderecoFormatado={mockGetEnderecoFormatado}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('(1 avaliação)')).toBeInTheDocument();
    });
  });

  it('deve mostrar botão de deletar quando podeDeletar é true', async () => {
    render(
      <PostoCard
        posto={mockPosto}
        precos={mockPrecos}
        onDelete={mockOnDelete}
        podeDeletar={true}
        getEnderecoFormatado={mockGetEnderecoFormatado}
      />
    );

    await waitFor(() => {
      const deleteButton = screen.getByRole('button', { name: '✕' });
      expect(deleteButton).toBeInTheDocument();
    });
  });

  it('não deve mostrar botão de deletar quando podeDeletar é false', async () => {
    render(
      <PostoCard
        posto={mockPosto}
        precos={mockPrecos}
        onDelete={mockOnDelete}
        podeDeletar={false}
        getEnderecoFormatado={mockGetEnderecoFormatado}
      />
    );

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: '✕' })).not.toBeInTheDocument();
    });
  });

  it('deve ter toggle para ver/ocultar avaliações', async () => {
    render(
      <PostoCard
        posto={mockPosto}
        precos={mockPrecos}
        onDelete={mockOnDelete}
        podeDeletar={false}
        getEnderecoFormatado={mockGetEnderecoFormatado}
      />
    );

    await waitFor(() => {
      const toggleButton = screen.getByText('▶ Ver avaliações');
      expect(toggleButton).toBeInTheDocument();

      fireEvent.click(toggleButton);
      expect(screen.getByText('▼ Ocultar avaliações')).toBeInTheDocument();
    });
  });
});
