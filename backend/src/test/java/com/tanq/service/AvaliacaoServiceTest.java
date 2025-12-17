package com.tanq.service;

import com.tanq.model.Avaliacao;
import com.tanq.model.Posto;
import com.tanq.model.TipoUsuario;
import com.tanq.repository.AvaliacaoRepository;
import com.tanq.repository.PostoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class AvaliacaoServiceTest {

    @Autowired
    private AvaliacaoService avaliacaoService;

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Autowired
    private PostoRepository postoRepository;

    private Posto postoTeste;

    @BeforeEach
    void setUp() {
        avaliacaoRepository.deleteAll();
        postoRepository.deleteAll();

        // Criar posto de teste
        postoTeste = new Posto();
        postoTeste.setNome("Posto Teste");
        postoTeste.setRua("Rua Teste");
        postoTeste.setCidade("Florianópolis");
        postoTeste.setEstado("SC");
        postoTeste.setLatitude(-27.5954);
        postoTeste.setLongitude(-48.5480);
        postoTeste.setDonoId(1L);
        postoTeste = postoRepository.save(postoTeste);
    }

    private Avaliacao criarAvaliacao(Integer nota, String comentario) {
        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setPostoId(postoTeste.getId());
        avaliacao.setNota(nota);
        avaliacao.setComentario(comentario);
        return avaliacao;
    }

    @Test
    void deveSalvarAvaliacaoComoMotorista() {
        Avaliacao avaliacao = criarAvaliacao(5, "Excelente atendimento!");

        Avaliacao salva = avaliacaoService.salvar(avaliacao, 2L, TipoUsuario.MOTORISTA);

        assertNotNull(salva.getId());
        assertEquals(5, salva.getNota());
        assertEquals("Excelente atendimento!", salva.getComentario());
        assertEquals(2L, salva.getUsuarioId());
    }

    @Test
    void deveSalvarAvaliacaoComoAdmin() {
        Avaliacao avaliacao = criarAvaliacao(4, "Bom serviço");

        Avaliacao salva = avaliacaoService.salvar(avaliacao, 1L, TipoUsuario.ADMINISTRADOR);

        assertNotNull(salva.getId());
        assertEquals(4, salva.getNota());
    }

    @Test
    void donoDePostoNaoDeveCriarAvaliacao() {
        Avaliacao avaliacao = criarAvaliacao(5, "Tentando avaliar");

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            avaliacaoService.salvar(avaliacao, 1L, TipoUsuario.DONO_POSTO);
        });

        assertEquals("Dono de posto não pode criar avaliações", exception.getMessage());
    }

    @Test
    void naoDeveSalvarNotaMenorQue1() {
        Avaliacao avaliacao = criarAvaliacao(0, "Nota inválida");

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            avaliacaoService.salvar(avaliacao, 2L, TipoUsuario.MOTORISTA);
        });

        assertEquals("Nota deve ser entre 1 e 5", exception.getMessage());
    }

    @Test
    void naoDeveSalvarNotaMaiorQue5() {
        Avaliacao avaliacao = criarAvaliacao(6, "Nota inválida");

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            avaliacaoService.salvar(avaliacao, 2L, TipoUsuario.MOTORISTA);
        });

        assertEquals("Nota deve ser entre 1 e 5", exception.getMessage());
    }

    @Test
    void naoDeveSalvarAvaliacaoParaPostoInexistente() {
        Avaliacao avaliacao = criarAvaliacao(5, "Bom posto");
        avaliacao.setPostoId(99999L);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            avaliacaoService.salvar(avaliacao, 2L, TipoUsuario.MOTORISTA);
        });

        assertEquals("Posto não encontrado", exception.getMessage());
    }

    @Test
    void deveListarAvaliacoesPorPosto() {
        avaliacaoService.salvar(criarAvaliacao(5, "Ótimo!"), 2L, TipoUsuario.MOTORISTA);
        avaliacaoService.salvar(criarAvaliacao(4, "Bom"), 3L, TipoUsuario.MOTORISTA);

        List<Avaliacao> avaliacoes = avaliacaoService.listarPorPosto(postoTeste.getId());
        assertEquals(2, avaliacoes.size());
    }

    @Test
    void deveCalcularMediaCorretamente() {
        avaliacaoService.salvar(criarAvaliacao(5, null), 2L, TipoUsuario.MOTORISTA);
        avaliacaoService.salvar(criarAvaliacao(4, null), 3L, TipoUsuario.MOTORISTA);
        avaliacaoService.salvar(criarAvaliacao(3, null), 4L, TipoUsuario.MOTORISTA);

        double media = avaliacaoService.calcularMediaPosto(postoTeste.getId());
        assertEquals(4.0, media, 0.01);
    }

    @Test
    void deveRetornarMediaZeroParaPostoSemAvaliacoes() {
        double media = avaliacaoService.calcularMediaPosto(postoTeste.getId());
        assertEquals(0.0, media, 0.01);
    }

    @Test
    void adminPodeDeletarQualquerAvaliacao() {
        Avaliacao avaliacao = avaliacaoService.salvar(criarAvaliacao(5, "Teste"), 2L, TipoUsuario.MOTORISTA);

        // Admin deleta avaliação de outro usuário
        avaliacaoService.deletar(avaliacao.getId(), 1L, TipoUsuario.ADMINISTRADOR);

        assertFalse(avaliacaoService.buscarPorId(avaliacao.getId()).isPresent());
    }

    @Test
    void motoristaSoPodeDeletarPropriaAvaliacao() {
        Avaliacao avaliacao = avaliacaoService.salvar(criarAvaliacao(5, "Minha avaliação"), 2L, TipoUsuario.MOTORISTA);

        // Outro motorista não pode deletar
        assertThrows(RuntimeException.class, () -> {
            avaliacaoService.deletar(avaliacao.getId(), 3L, TipoUsuario.MOTORISTA);
        });

        // Próprio motorista pode deletar
        avaliacaoService.deletar(avaliacao.getId(), 2L, TipoUsuario.MOTORISTA);
        assertFalse(avaliacaoService.buscarPorId(avaliacao.getId()).isPresent());
    }

    @Test
    void donoDePostoNaoPodeDeletarAvaliacao() {
        Avaliacao avaliacao = avaliacaoService.salvar(criarAvaliacao(5, "Teste"), 2L, TipoUsuario.MOTORISTA);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            avaliacaoService.deletar(avaliacao.getId(), 1L, TipoUsuario.DONO_POSTO);
        });

        assertEquals("Dono de posto não pode deletar avaliações", exception.getMessage());
    }

    @Test
    void deveDeletarTodasAvaliacoesDoPosto() {
        avaliacaoService.salvar(criarAvaliacao(5, "Um"), 2L, TipoUsuario.MOTORISTA);
        avaliacaoService.salvar(criarAvaliacao(4, "Dois"), 3L, TipoUsuario.MOTORISTA);
        avaliacaoService.salvar(criarAvaliacao(3, "Três"), 4L, TipoUsuario.MOTORISTA);

        assertEquals(3, avaliacaoService.listarPorPosto(postoTeste.getId()).size());

        avaliacaoService.deletarTodosPorPosto(postoTeste.getId());

        assertEquals(0, avaliacaoService.listarPorPosto(postoTeste.getId()).size());
    }
}
