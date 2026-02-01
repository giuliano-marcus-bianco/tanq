import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AvaliacaoForm from './AvaliacaoForm';
import { avaliacaoService, useAuth } from '@tanq/core-logic';

// Mock do módulo @tanq/core-logic
vi.mock('@tanq/core-logic', () => ({
  avaliacaoService: {
    criar: vi.fn(),
  },
  useAuth: vi.fn(),
}));

describe('AvaliacaoForm', () => {
  const mockOnAvaliacaoAdded = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('não deve renderizar quando usuário não está logado', () => {
    useAuth.mockReturnValue({ usuario: null });

    const { container } = render(
      <AvaliacaoForm postoId={1} onAvaliacaoAdded={mockOnAvaliacaoAdded} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('não deve renderizar para DONO_POSTO', () => {
    useAuth.mockReturnValue({
      usuario: { id: 1, nome: 'Dono', tipo: 'DONO_POSTO' }
    });

    const { container } = render(
      <AvaliacaoForm postoId={1} onAvaliacaoAdded={mockOnAvaliacaoAdded} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar formulário para MOTORISTA', () => {
    useAuth.mockReturnValue({
      usuario: { id: 2, nome: 'João', tipo: 'MOTORISTA' }
    });

    render(<AvaliacaoForm postoId={1} onAvaliacaoAdded={mockOnAvaliacaoAdded} />);

    expect(screen.getByText('Enviar Avaliação')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Comentário (opcional)')).toBeInTheDocument();
  });

  it('deve exibir 5 estrelas para seleção', () => {
    useAuth.mockReturnValue({
      usuario: { id: 2, nome: 'João', tipo: 'MOTORISTA' }
    });

    render(<AvaliacaoForm postoId={1} onAvaliacaoAdded={mockOnAvaliacaoAdded} />);

    const estrelas = screen.getAllByText('★');
    expect(estrelas).toHaveLength(5);
  });

  it('deve exibir erro quando nota não é selecionada', async () => {
    useAuth.mockReturnValue({
      usuario: { id: 2, nome: 'João', tipo: 'MOTORISTA' }
    });

    render(<AvaliacaoForm postoId={1} onAvaliacaoAdded={mockOnAvaliacaoAdded} />);

    const submitButton = screen.getByText('Enviar Avaliação');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Selecione uma nota')).toBeInTheDocument();
    });
  });

  it('deve submeter avaliação com sucesso', async () => {
    useAuth.mockReturnValue({
      usuario: { id: 2, nome: 'João', tipo: 'MOTORISTA' }
    });
    avaliacaoService.criar.mockResolvedValue({ data: { id: 1 } });

    render(<AvaliacaoForm postoId={1} onAvaliacaoAdded={mockOnAvaliacaoAdded} />);

    // Selecionar 4 estrelas
    const estrelas = screen.getAllByText('★');
    fireEvent.click(estrelas[3]);

    // Adicionar comentário
    const textarea = screen.getByPlaceholderText('Comentário (opcional)');
    fireEvent.change(textarea, { target: { value: 'Ótimo posto!' } });

    // Submeter
    const submitButton = screen.getByText('Enviar Avaliação');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(avaliacaoService.criar).toHaveBeenCalledWith(
        { postoId: 1, nota: 4, comentario: 'Ótimo posto!' },
        2
      );
      expect(mockOnAvaliacaoAdded).toHaveBeenCalled();
    });
  });

  it('deve exibir erro quando API falha', async () => {
    useAuth.mockReturnValue({
      usuario: { id: 2, nome: 'João', tipo: 'MOTORISTA' }
    });
    avaliacaoService.criar.mockRejectedValue({
      response: { data: { erro: 'Erro no servidor' } }
    });

    render(<AvaliacaoForm postoId={1} onAvaliacaoAdded={mockOnAvaliacaoAdded} />);

    // Selecionar 5 estrelas
    const estrelas = screen.getAllByText('★');
    fireEvent.click(estrelas[4]);

    // Submeter
    const submitButton = screen.getByText('Enviar Avaliação');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Erro no servidor')).toBeInTheDocument();
    });
  });
});
