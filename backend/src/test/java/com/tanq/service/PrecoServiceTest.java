package com.tanq.service;

import com.tanq.model.Posto;
import com.tanq.model.Preco;
import com.tanq.model.TipoCombustivel;
import com.tanq.model.TipoUsuario;
import com.tanq.repository.PostoRepository;
import com.tanq.repository.PrecoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class PrecoServiceTest {

    @Autowired
    private PrecoService precoService;

    @Autowired
    private PrecoRepository precoRepository;

    @Autowired
    private PostoRepository postoRepository;

    private Posto postoTeste;

    @BeforeEach
    void setUp() {
        precoRepository.deleteAll();
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

    private Preco criarPreco(TipoCombustivel tipo, BigDecimal valor) {
        Preco preco = new Preco();
        preco.setPostoId(postoTeste.getId());
        preco.setTipoCombustivel(tipo);
        preco.setValor(valor);
        return preco;
    }

    @Test
    void deveSalvarPrecoComoAdmin() {
        Preco preco = criarPreco(TipoCombustivel.GASOLINA, new BigDecimal("5.89"));

        Preco salvo = precoService.salvar(preco, 1L, TipoUsuario.ADMINISTRADOR);

        assertNotNull(salvo.getId());
        assertEquals(TipoCombustivel.GASOLINA, salvo.getTipoCombustivel());
        assertEquals(new BigDecimal("5.89"), salvo.getValor());
        assertEquals(1L, salvo.getUsuarioId());
    }

    @Test
    void deveSalvarPrecoComoMotorista() {
        Preco preco = criarPreco(TipoCombustivel.ETANOL, new BigDecimal("3.99"));

        Preco salvo = precoService.salvar(preco, 2L, TipoUsuario.MOTORISTA);

        assertNotNull(salvo.getId());
        assertEquals(TipoCombustivel.ETANOL, salvo.getTipoCombustivel());
        assertEquals(2L, salvo.getUsuarioId());
    }

    @Test
    void donoDePostoDeveSalvarPrecoApenasNoProprioPostoQuandoDonoDoMesmoPosto() {
        // Posto é do dono 1L
        Preco preco = criarPreco(TipoCombustivel.DIESEL, new BigDecimal("5.29"));

        // Dono do posto (1L) pode cadastrar
        Preco salvo = precoService.salvar(preco, 1L, TipoUsuario.DONO_POSTO);
        assertNotNull(salvo.getId());
    }

    @Test
    void donoDePostoNaoDeveSalvarPrecoEmPostoDeOutroDono() {
        // Posto é do dono 1L, mas tentamos salvar como dono 2L
        Preco preco = criarPreco(TipoCombustivel.DIESEL, new BigDecimal("5.29"));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            precoService.salvar(preco, 2L, TipoUsuario.DONO_POSTO);
        });

        assertEquals("Você só pode cadastrar preços no seu próprio posto", exception.getMessage());
    }

    @Test
    void naoDeveSalvarPrecoParaPostoInexistente() {
        Preco preco = criarPreco(TipoCombustivel.GASOLINA, new BigDecimal("5.89"));
        preco.setPostoId(99999L);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            precoService.salvar(preco, 1L, TipoUsuario.ADMINISTRADOR);
        });

        assertEquals("Posto não encontrado", exception.getMessage());
    }

    @Test
    void deveListarTodosPrecos() {
        precoService.salvar(criarPreco(TipoCombustivel.GASOLINA, new BigDecimal("5.89")), 1L,
                TipoUsuario.ADMINISTRADOR);
        precoService.salvar(criarPreco(TipoCombustivel.ETANOL, new BigDecimal("3.99")), 1L, TipoUsuario.ADMINISTRADOR);

        List<Preco> precos = precoService.listarTodos();
        assertEquals(2, precos.size());
    }

    @Test
    void deveListarPrecosPorPosto() {
        // Criar outro posto
        Posto outroPosto = new Posto();
        outroPosto.setNome("Outro Posto");
        outroPosto.setRua("Outra Rua");
        outroPosto.setCidade("São Paulo");
        outroPosto.setEstado("SP");
        outroPosto.setLatitude(-23.5505);
        outroPosto.setLongitude(-46.6333);
        outroPosto.setDonoId(1L);
        outroPosto = postoRepository.save(outroPosto);

        // Preços do posto teste
        precoService.salvar(criarPreco(TipoCombustivel.GASOLINA, new BigDecimal("5.89")), 1L,
                TipoUsuario.ADMINISTRADOR);
        precoService.salvar(criarPreco(TipoCombustivel.ETANOL, new BigDecimal("3.99")), 1L, TipoUsuario.ADMINISTRADOR);

        // Preço do outro posto
        Preco precoOutroPosto = new Preco();
        precoOutroPosto.setPostoId(outroPosto.getId());
        precoOutroPosto.setTipoCombustivel(TipoCombustivel.DIESEL);
        precoOutroPosto.setValor(new BigDecimal("5.29"));
        precoService.salvar(precoOutroPosto, 1L, TipoUsuario.ADMINISTRADOR);

        List<Preco> precosPostoTeste = precoService.listarPorPosto(postoTeste.getId());
        List<Preco> precosOutroPosto = precoService.listarPorPosto(outroPosto.getId());

        assertEquals(2, precosPostoTeste.size());
        assertEquals(1, precosOutroPosto.size());
    }

    @Test
    void deveRetornarRankingPorCombustivel() {
        // Criar outro posto com preço mais caro
        Posto outroPosto = new Posto();
        outroPosto.setNome("Posto Caro");
        outroPosto.setRua("Rua Cara");
        outroPosto.setCidade("São Paulo");
        outroPosto.setEstado("SP");
        outroPosto.setLatitude(-23.5505);
        outroPosto.setLongitude(-46.6333);
        outroPosto.setDonoId(1L);
        outroPosto = postoRepository.save(outroPosto);

        // Preço mais barato no posto teste
        precoService.salvar(criarPreco(TipoCombustivel.GASOLINA, new BigDecimal("5.49")), 1L,
                TipoUsuario.ADMINISTRADOR);

        // Preço mais caro no outro posto
        Preco precoCaro = new Preco();
        precoCaro.setPostoId(outroPosto.getId());
        precoCaro.setTipoCombustivel(TipoCombustivel.GASOLINA);
        precoCaro.setValor(new BigDecimal("6.29"));
        precoService.salvar(precoCaro, 1L, TipoUsuario.ADMINISTRADOR);

        List<Preco> ranking = precoService.rankingPorCombustivel(TipoCombustivel.GASOLINA);

        assertEquals(2, ranking.size());
        // O primeiro deve ser o mais barato (usar compareTo para BigDecimal)
        assertTrue(ranking.get(0).getValor().compareTo(ranking.get(1).getValor()) < 0);
    }

    @Test
    void adminPodeDeletarQualquerPreco() {
        Preco preco = precoService.salvar(criarPreco(TipoCombustivel.GASOLINA, new BigDecimal("5.89")), 2L,
                TipoUsuario.MOTORISTA);

        // Admin deleta preço de outro usuário
        precoService.deletar(preco.getId(), 1L, TipoUsuario.ADMINISTRADOR);

        assertFalse(precoService.buscarPorId(preco.getId()).isPresent());
    }

    @Test
    void motoristaSoPodeDeletarProprioPreco() {
        Preco preco = precoService.salvar(criarPreco(TipoCombustivel.GASOLINA, new BigDecimal("5.89")), 2L,
                TipoUsuario.MOTORISTA);

        // Outro motorista não pode deletar
        assertThrows(RuntimeException.class, () -> {
            precoService.deletar(preco.getId(), 3L, TipoUsuario.MOTORISTA);
        });

        // Próprio motorista pode deletar
        precoService.deletar(preco.getId(), 2L, TipoUsuario.MOTORISTA);
        assertFalse(precoService.buscarPorId(preco.getId()).isPresent());
    }

    @Test
    void deveDeletarTodosPrecosDoPosto() {
        precoService.salvar(criarPreco(TipoCombustivel.GASOLINA, new BigDecimal("5.89")), 1L,
                TipoUsuario.ADMINISTRADOR);
        precoService.salvar(criarPreco(TipoCombustivel.ETANOL, new BigDecimal("3.99")), 1L, TipoUsuario.ADMINISTRADOR);
        precoService.salvar(criarPreco(TipoCombustivel.DIESEL, new BigDecimal("5.29")), 1L, TipoUsuario.ADMINISTRADOR);

        assertEquals(3, precoService.listarPorPosto(postoTeste.getId()).size());

        precoService.deletarTodosPorPosto(postoTeste.getId());

        assertEquals(0, precoService.listarPorPosto(postoTeste.getId()).size());
    }
}
