package com.tanq.service;

import com.tanq.model.Avaliacao;
import com.tanq.model.Posto;
import com.tanq.model.TipoUsuario;
import com.tanq.repository.AvaliacaoRepository;
import com.tanq.repository.PostoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Autowired
    private PostoRepository postoRepository;

    public List<Avaliacao> listarTodos() {
        return avaliacaoRepository.findAll();
    }

    public List<Avaliacao> listarPorPosto(Long postoId) {
        return avaliacaoRepository.findByPostoIdOrderByCriadoEmDesc(postoId);
    }

    public List<Avaliacao> listarPorUsuario(Long usuarioId) {
        return avaliacaoRepository.findByUsuarioId(usuarioId);
    }

    public Optional<Avaliacao> buscarPorId(Long id) {
        return avaliacaoRepository.findById(id);
    }

    /**
     * Calcula a média de notas de um posto.
     * Retorna um Map com 'media' e 'total'.
     */
    public double calcularMediaPosto(Long postoId) {
        List<Avaliacao> avaliacoes = avaliacaoRepository.findByPostoId(postoId);
        if (avaliacoes.isEmpty()) {
            return 0.0;
        }
        double soma = avaliacoes.stream().mapToInt(Avaliacao::getNota).sum();
        return soma / avaliacoes.size();
    }

    public int contarAvaliacoesPosto(Long postoId) {
        return avaliacaoRepository.findByPostoId(postoId).size();
    }

    /**
     * Salva uma avaliação.
     * Apenas MOTORISTA pode criar avaliações.
     * DONO_POSTO não pode criar avaliações.
     */
    public Avaliacao salvar(Avaliacao avaliacao, Long usuarioId, TipoUsuario tipoUsuario) {
        // Verificar se o posto existe
        Optional<Posto> posto = postoRepository.findById(avaliacao.getPostoId());
        if (posto.isEmpty()) {
            throw new RuntimeException("Posto não encontrado");
        }

        // Apenas MOTORISTA pode criar avaliações
        if (tipoUsuario == TipoUsuario.DONO_POSTO) {
            throw new RuntimeException("Dono de posto não pode criar avaliações");
        }

        // Validar nota
        if (avaliacao.getNota() == null || avaliacao.getNota() < 1 || avaliacao.getNota() > 5) {
            throw new RuntimeException("Nota deve ser entre 1 e 5");
        }

        avaliacao.setUsuarioId(usuarioId);
        avaliacao.setCriadoEm(LocalDateTime.now());
        return avaliacaoRepository.save(avaliacao);
    }

    /**
     * Deleta uma avaliação.
     * ADMINISTRADOR pode deletar qualquer avaliação.
     * MOTORISTA só pode deletar sua própria avaliação.
     * DONO_POSTO não pode deletar avaliações.
     */
    @Transactional
    public void deletar(Long id, Long usuarioId, TipoUsuario tipoUsuario) {
        Optional<Avaliacao> avaliacao = avaliacaoRepository.findById(id);
        if (avaliacao.isEmpty()) {
            throw new RuntimeException("Avaliação não encontrada");
        }

        Avaliacao a = avaliacao.get();

        // DONO_POSTO não pode deletar avaliações
        if (tipoUsuario == TipoUsuario.DONO_POSTO) {
            throw new RuntimeException("Dono de posto não pode deletar avaliações");
        }

        // Administrador pode deletar qualquer avaliação
        if (tipoUsuario == TipoUsuario.ADMINISTRADOR) {
            avaliacaoRepository.deleteById(id);
            return;
        }

        // MOTORISTA só pode deletar sua própria avaliação
        if (tipoUsuario == TipoUsuario.MOTORISTA) {
            if (!a.getUsuarioId().equals(usuarioId)) {
                throw new RuntimeException("Você só pode deletar suas próprias avaliações");
            }
            avaliacaoRepository.deleteById(id);
            return;
        }

        throw new RuntimeException("Permissão negada");
    }

    @Transactional
    public void deletarTodosPorPosto(Long postoId) {
        avaliacaoRepository.deleteByPostoId(postoId);
    }
}
