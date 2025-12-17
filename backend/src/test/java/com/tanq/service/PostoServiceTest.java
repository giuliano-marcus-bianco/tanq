package com.tanq.service;

import com.tanq.model.Posto;
import com.tanq.model.TipoUsuario;
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
        posto.setEndereco("Rua Principal, 100");

        Posto salvo = postoService.salvar(posto, 1L, TipoUsuario.ADMINISTRADOR);

        assertNotNull(salvo.getId());
        assertEquals("Posto Shell", salvo.getNome());
        assertEquals(1L, salvo.getDonoId());
    }

    @Test
    void deveSalvarPostoComoDonoDePosto() {
        Posto posto = new Posto();
        posto.setNome("Meu Posto");
        posto.setEndereco("Rua do Posto, 50");

        Posto salvo = postoService.salvar(posto, 3L, TipoUsuario.DONO_POSTO);

        assertNotNull(salvo.getId());
        assertEquals(3L, salvo.getDonoId());
    }

    @Test
    void naoDeveSalvarPostoComoMotorista() {
        Posto posto = new Posto();
        posto.setNome("Posto Teste");

        assertThrows(RuntimeException.class, () -> {
            postoService.salvar(posto, 2L, TipoUsuario.MOTORISTA);
        });
    }

    @Test
    void deveListarTodosOsPostos() {
        Posto posto1 = new Posto();
        posto1.setNome("Posto 1");
        posto1.setDonoId(1L);
        postoRepository.save(posto1);

        Posto posto2 = new Posto();
        posto2.setNome("Posto 2");
        posto2.setDonoId(1L);
        postoRepository.save(posto2);

        List<Posto> postos = postoService.listarTodos();

        assertEquals(2, postos.size());
    }

    @Test
    void deveDeletarPostoComoAdmin() {
        Posto posto = new Posto();
        posto.setNome("Posto para Deletar");
        posto.setDonoId(3L);
        Posto salvo = postoRepository.save(posto);

        postoService.deletar(salvo.getId(), 1L, TipoUsuario.ADMINISTRADOR);

        assertEquals(0, postoRepository.count());
    }

    @Test
    void deveDeletarPostoProprio() {
        Posto posto = new Posto();
        posto.setNome("Meu Posto");
        posto.setDonoId(3L);
        Posto salvo = postoRepository.save(posto);

        postoService.deletar(salvo.getId(), 3L, TipoUsuario.DONO_POSTO);

        assertEquals(0, postoRepository.count());
    }

    @Test
    void naoDeveDeletarPostoDeOutro() {
        Posto posto = new Posto();
        posto.setNome("Posto de Outro");
        posto.setDonoId(1L);
        Posto salvo = postoRepository.save(posto);

        assertThrows(RuntimeException.class, () -> {
            postoService.deletar(salvo.getId(), 3L, TipoUsuario.DONO_POSTO);
        });
    }
}
