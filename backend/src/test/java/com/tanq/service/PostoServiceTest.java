package com.tanq.service;

import com.tanq.model.Posto;
import com.tanq.repository.PostoRepository;
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
    void deveSalvarPosto() {
        // Arrange
        Posto posto = new Posto();
        posto.setNome("Posto Shell");
        posto.setEndereco("Rua Principal, 100");
        posto.setPrecoGasolina(new BigDecimal("5.89"));
        posto.setPrecoEtanol(new BigDecimal("3.99"));

        // Act
        Posto salvo = postoService.salvar(posto);

        // Assert
        assertNotNull(salvo.getId());
        assertEquals("Posto Shell", salvo.getNome());
        assertNotNull(salvo.getAtualizadoEm());
    }

    @Test
    void deveListarTodosOsPostos() {
        // Arrange
        Posto posto1 = new Posto();
        posto1.setNome("Posto 1");
        postoRepository.save(posto1);

        Posto posto2 = new Posto();
        posto2.setNome("Posto 2");
        postoRepository.save(posto2);

        // Act
        List<Posto> postos = postoService.listarTodos();

        // Assert
        assertEquals(2, postos.size());
    }

    @Test
    void deveRetornarRankingOrdenadoPorPrecoGasolina() {
        // Arrange
        Posto caro = new Posto();
        caro.setNome("Posto Caro");
        caro.setPrecoGasolina(new BigDecimal("6.50"));
        postoRepository.save(caro);

        Posto barato = new Posto();
        barato.setNome("Posto Barato");
        barato.setPrecoGasolina(new BigDecimal("5.20"));
        postoRepository.save(barato);

        Posto medio = new Posto();
        medio.setNome("Posto Médio");
        medio.setPrecoGasolina(new BigDecimal("5.89"));
        postoRepository.save(medio);

        // Act
        List<Posto> ranking = postoService.rankingPorPrecoGasolina();

        // Assert
        assertEquals(3, ranking.size());
        assertEquals("Posto Barato", ranking.get(0).getNome());
        assertEquals("Posto Médio", ranking.get(1).getNome());
        assertEquals("Posto Caro", ranking.get(2).getNome());
    }

    @Test
    void deveBuscarPostoPorNome() {
        // Arrange
        Posto shell = new Posto();
        shell.setNome("Posto Shell Centro");
        postoRepository.save(shell);

        Posto ipiranga = new Posto();
        ipiranga.setNome("Posto Ipiranga");
        postoRepository.save(ipiranga);

        // Act
        List<Posto> resultado = postoService.buscarPorNome("shell");

        // Assert
        assertEquals(1, resultado.size());
        assertEquals("Posto Shell Centro", resultado.get(0).getNome());
    }

    @Test
    void deveDeletarPosto() {
        // Arrange
        Posto posto = new Posto();
        posto.setNome("Posto para Deletar");
        Posto salvo = postoRepository.save(posto);

        // Act
        postoService.deletar(salvo.getId());

        // Assert
        assertEquals(0, postoRepository.count());
    }
}
