import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';
import { postoService, precoService, avaliacaoService, usuarioService, useAuth } from '@tanq/core-logic';

// Mock consolidado do módulo @tanq/core-logic
vi.mock('@tanq/core-logic', () => ({
  postoService: {
    listarTodos: vi.fn(),
    deletar: vi.fn(),
  },
  precoService: {
    listarTodos: vi.fn(),
  },
  avaliacaoService: {
    mediaPorPosto: vi.fn(),
    listarPorPosto: vi.fn(),
  },
  usuarioService: {
    buscarPorId: vi.fn(),
  },
  useAuth: vi.fn(),
}));

// Mock do componente MapaPostos para evitar problemas com Leaflet
vi.mock('../components/MapaPostos', () => ({
  default: () => <div data-testid="mapa-mock">Mapa Mock</div>
}));

// Mock do componente PostoCard para simplificar testes
vi.mock('../components/PostoCard', () => ({
  default: ({ posto, precos }) => (
    <div data-testid={`posto-card-${posto.id}`}>
      <span>{posto.nome}</span>
      {precos?.GASOLINA && <span>R$ {precos.GASOLINA}</span>}
    </div>
  )
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ usuario: null });
  });

  it('deve exibir loading inicialmente', () => {
    postoService.listarTodos.mockReturnValue(new Promise(() => {}));
    precoService.listarTodos.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve exibir erro quando API falha', async () => {
    postoService.listarTodos.mockRejectedValue(new Error('API Error'));
    precoService.listarTodos.mockRejectedValue(new Error('API Error'));

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Não foi possível conectar ao servidor/)).toBeInTheDocument();
    });
  });

  it('deve exibir hero section', async () => {
    postoService.listarTodos.mockResolvedValue({ data: [] });
    precoService.listarTodos.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Encontre os melhores preços de combustível/)).toBeInTheDocument();
    });
  });

  it('deve exibir contagem de postos', async () => {
    const mockPostos = [
      { id: 1, nome: 'Posto Shell', rua: 'Rua A', cidade: 'Florianópolis' },
      { id: 2, nome: 'Posto Ipiranga', rua: 'Rua B', cidade: 'Florianópolis' },
    ];

    postoService.listarTodos.mockResolvedValue({ data: mockPostos });
    precoService.listarTodos.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Postos Cadastrados')).toBeInTheDocument();
    });
  });

  it('deve exibir lista de postos', async () => {
    const mockPostos = [
      { id: 1, nome: 'Posto Shell', rua: 'Rua A', cidade: 'Florianópolis' },
      { id: 2, nome: 'Posto Ipiranga', rua: 'Rua B', cidade: 'Florianópolis' },
    ];

    postoService.listarTodos.mockResolvedValue({ data: mockPostos });
    precoService.listarTodos.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('posto-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('posto-card-2')).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem quando não há postos', async () => {
    postoService.listarTodos.mockResolvedValue({ data: [] });
    precoService.listarTodos.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Nenhum posto cadastrado ainda.')).toBeInTheDocument();
    });
  });

  it('deve ter links para ranking e cadastro', async () => {
    postoService.listarTodos.mockResolvedValue({ data: [] });
    precoService.listarTodos.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Ver Ranking de Preços')).toBeInTheDocument();
      expect(screen.getByText('Cadastrar Novo')).toBeInTheDocument();
    });
  });

  it('deve exibir mapa de postos', async () => {
    postoService.listarTodos.mockResolvedValue({ data: [] });
    precoService.listarTodos.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('mapa-mock')).toBeInTheDocument();
    });
  });

  it('deve exibir botão ver mais quando há mais de 6 postos', async () => {
    const mockPostos = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      nome: `Posto ${i + 1}`,
      rua: `Rua ${i + 1}`,
      cidade: 'Florianópolis'
    }));

    postoService.listarTodos.mockResolvedValue({ data: mockPostos });
    precoService.listarTodos.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Ver todos (8 postos)')).toBeInTheDocument();
    });
  });
});
