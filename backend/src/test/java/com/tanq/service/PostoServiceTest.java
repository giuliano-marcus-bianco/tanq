package com.tanq.service;

import com.tanq.model.Posto;
import com.tanq.model.TipoUsuario;
import com.tanq.repository.PostoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class PostoServiceTest {

    @Autowired
    private PostoService postoService;

    @Autowired
    private PostoRepository postoRepository;

    @BeforeEach
    void setUp() {
        postoRepository.deleteAll();
    }

    private Posto criarPostoValido(String nome) {
        Posto posto = new Posto();
        posto.setNome(nome);
        posto.setRua("Rua Principal");
        posto.setNumero("100");
        posto.setBairro("Centro");
        posto.setCidade("Florianópolis");
        posto.setEstado("SC");
        posto.setLatitude(-27.5954);
        posto.setLongitude(-48.5480);
        return posto;
    }

    @Test
    void deveSalvarPostoComoAdmin() {
        Posto posto = criarPostoValido("Posto Shell");

        Posto salvo = postoService.salvar(posto, 1L, TipoUsuario.ADMINISTRADOR);

        assertNotNull(salvo.getId());
        assertEquals("Posto Shell", salvo.getNome());
        assertEquals("Rua Principal", salvo.getRua());
        assertEquals("100", salvo.getNumero());
        assertEquals("Centro", salvo.getBairro());
        assertEquals("Florianópolis", salvo.getCidade());
        assertEquals("SC", salvo.getEstado());
        assertEquals(-27.5954, salvo.getLatitude());
        assertEquals(-48.5480, salvo.getLongitude());
        assertEquals(1L, salvo.getDonoId());
    }

    @Test
    void deveSalvarPostoComoDonoDePosto() {
        Posto posto = criarPostoValido("Posto Ipiranga");

        Posto salvo = postoService.salvar(posto, 2L, TipoUsuario.DONO_POSTO);

        assertNotNull(salvo.getId());
        assertEquals("Posto Ipiranga", salvo.getNome());
        assertEquals(2L, salvo.getDonoId());
    }

    @Test
    void naoDevePermitirMotoristaCriarPosto() {
        Posto posto = criarPostoValido("Posto Teste");

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            postoService.salvar(posto, 3L, TipoUsuario.MOTORISTA);
        });

        assertEquals("Apenas Administradores ou Donos de Posto podem criar postos", exception.getMessage());
    }

    @Test
    void naoDeveSalvarPostoSemRua() {
        Posto posto = criarPostoValido("Posto Teste");
        posto.setRua(null);

        assertThrows(RuntimeException.class, () -> {
            postoService.salvar(posto, 1L, TipoUsuario.ADMINISTRADOR);
        });
    }

    @Test
    void naoDeveSalvarPostoSemCidade() {
        Posto posto = criarPostoValido("Posto Teste");
        posto.setCidade(null);

        assertThrows(RuntimeException.class, () -> {
            postoService.salvar(posto, 1L, TipoUsuario.ADMINISTRADOR);
        });
    }

    @Test
    void naoDeveSalvarPostoSemCoordenadas() {
        Posto posto = criarPostoValido("Posto Teste");
        posto.setLatitude(null);
        posto.setLongitude(null);

        assertThrows(RuntimeException.class, () -> {
            postoService.salvar(posto, 1L, TipoUsuario.ADMINISTRADOR);
        });
    }

    @Test
    void deveListarTodosOsPostos() {
        postoService.salvar(criarPostoValido("Posto 1"), 1L, TipoUsuario.ADMINISTRADOR);
        postoService.salvar(criarPostoValido("Posto 2"), 1L, TipoUsuario.ADMINISTRADOR);

        assertEquals(2, postoService.listarTodos().size());
    }

    @Test
    void deveBuscarPorId() {
        Posto salvo = postoService.salvar(criarPostoValido("Posto Shell"), 1L, TipoUsuario.ADMINISTRADOR);

        assertTrue(postoService.buscarPorId(salvo.getId()).isPresent());
        assertFalse(postoService.buscarPorId(99999L).isPresent());
    }

    @Test
    void deveBuscarPorNome() {
        postoService.salvar(criarPostoValido("Posto Shell Centro"), 1L, TipoUsuario.ADMINISTRADOR);
        postoService.salvar(criarPostoValido("Posto Ipiranga"), 1L, TipoUsuario.ADMINISTRADOR);

        assertEquals(1, postoService.buscarPorNome("Shell").size());
        assertEquals(2, postoService.buscarPorNome("Posto").size());
        assertEquals(0, postoService.buscarPorNome("BR").size());
    }

    @Test
    void deveContarPostos() {
        assertEquals(0, postoService.contarPostos());

        postoService.salvar(criarPostoValido("Posto 1"), 1L, TipoUsuario.ADMINISTRADOR);
        assertEquals(1, postoService.contarPostos());

        postoService.salvar(criarPostoValido("Posto 2"), 1L, TipoUsuario.ADMINISTRADOR);
        assertEquals(2, postoService.contarPostos());
    }
}
