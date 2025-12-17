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

    @Test
    void deveSalvarPostoComoAdmin() {
        Posto posto = new Posto();
        posto.setNome("Posto Shell");
        posto.setRua("Rua Principal");
        posto.setNumero("100");
        posto.setBairro("Centro");
        posto.setCidade("Florianópolis");
        posto.setEstado("SC");

        Posto salvo = postoService.salvar(posto, 1L, TipoUsuario.ADMINISTRADOR);

        assertNotNull(salvo.getId());
        assertEquals("Posto Shell", salvo.getNome());
        assertEquals("Rua Principal", salvo.getRua());
        assertEquals("100", salvo.getNumero());
        assertEquals("Centro", salvo.getBairro());
        assertEquals("Florianópolis", salvo.getCidade());
        assertEquals("SC", salvo.getEstado());
        assertEquals(1L, salvo.getDonoId());
    }

    @Test
    void deveSalvarPostoComoDonoDePosto() {
        Posto posto = new Posto();
        posto.setNome("Posto Ipiranga");
        posto.setRua("Av. Brasil");
        posto.setNumero("500");
        posto.setCidade("São Paulo");
        posto.setEstado("SP");

        Posto salvo = postoService.salvar(posto, 2L, TipoUsuario.DONO_POSTO);

        assertNotNull(salvo.getId());
        assertEquals("Posto Ipiranga", salvo.getNome());
        assertEquals(2L, salvo.getDonoId());
    }

    @Test
    void naoDevePermitirMotoristaCriarPosto() {
        Posto posto = new Posto();
        posto.setNome("Posto Teste");
        posto.setCidade("Teste");
        posto.setEstado("SC");

        assertThrows(RuntimeException.class, () -> {
            postoService.salvar(posto, 3L, TipoUsuario.MOTORISTA);
        });
    }

    @Test
    void deveListarTodosOsPostos() {
        Posto posto1 = new Posto();
        posto1.setNome("Posto 1");
        posto1.setCidade("Florianópolis");
        posto1.setEstado("SC");
        postoService.salvar(posto1, 1L, TipoUsuario.ADMINISTRADOR);

        Posto posto2 = new Posto();
        posto2.setNome("Posto 2");
        posto2.setCidade("Joinville");
        posto2.setEstado("SC");
        postoService.salvar(posto2, 1L, TipoUsuario.ADMINISTRADOR);

        assertEquals(2, postoService.listarTodos().size());
    }

    @Test
    void deveContarPostos() {
        assertEquals(0, postoService.contarPostos());

        Posto posto = new Posto();
        posto.setNome("Posto 1");
        posto.setCidade("Florianópolis");
        posto.setEstado("SC");
        postoService.salvar(posto, 1L, TipoUsuario.ADMINISTRADOR);

        assertEquals(1, postoService.contarPostos());
    }
}
