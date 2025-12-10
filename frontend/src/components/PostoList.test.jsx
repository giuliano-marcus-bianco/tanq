import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import PostoList from './PostoList';

describe('PostoList', () => {
  const mockOnDelete = vi.fn();

  it('deve exibir mensagem quando não há postos', () => {
    render(<PostoList postos={[]} onDelete={mockOnDelete} />);
    
    expect(screen.getByText('Nenhum posto encontrado.')).toBeInTheDocument();
  });

  it('deve exibir lista de postos', () => {
    const postos = [
      { id: 1, nome: 'Posto Shell', endereco: 'Rua A', precoGasolina: 5.89, precoEtanol: 3.99 },
      { id: 2, nome: 'Posto Ipiranga', endereco: 'Rua B', precoGasolina: 5.99, precoEtanol: 4.09 },
    ];

    render(<PostoList postos={postos} onDelete={mockOnDelete} />);
    
    expect(screen.getByText('Posto Shell')).toBeInTheDocument();
    expect(screen.getByText('Posto Ipiranga')).toBeInTheDocument();
    expect(screen.getByText('R$ 5.89')).toBeInTheDocument();
    expect(screen.getByText('R$ 3.99')).toBeInTheDocument();
  });

  it('deve exibir posição no ranking', () => {
    const postos = [
      { id: 1, nome: 'Posto 1', precoGasolina: 5.00 },
      { id: 2, nome: 'Posto 2', precoGasolina: 5.50 },
    ];

    render(<PostoList postos={postos} onDelete={mockOnDelete} />);
    
    expect(screen.getByText('1º')).toBeInTheDocument();
    expect(screen.getByText('2º')).toBeInTheDocument();
  });

  it('deve exibir traço quando preço não informado', () => {
    const postos = [
      { id: 1, nome: 'Posto Sem Preço' },
    ];

    render(<PostoList postos={postos} onDelete={mockOnDelete} />);
    
    // Deve ter traços para preços não informados
    const dashes = screen.getAllByText('-');
    expect(dashes.length).toBeGreaterThan(0);
  });
});
