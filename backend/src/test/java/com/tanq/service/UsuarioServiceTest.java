package com.tanq.service;

import com.tanq.model.TipoUsuario;
import com.tanq.model.Usuario;
import com.tanq.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class UsuarioServiceTest {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @BeforeEach
    void setUp() {
        usuarioRepository.deleteAll();
    }

    @Test
    void deveSalvarUsuario() {
        Usuario usuario = new Usuario();
        usuario.setNome("Teste");
        usuario.setEmail("teste@email.com");
        usuario.setSenha("123456");

        Usuario salvo = usuarioService.salvar(usuario);

        assertNotNull(salvo.getId());
        assertEquals("Teste", salvo.getNome());
        assertEquals("teste@email.com", salvo.getEmail());
    }

    @Test
    void deveAutenticarUsuarioComCredenciaisValidas() {
        Usuario usuario = new Usuario();
        usuario.setNome("Usuario Teste");
        usuario.setEmail("auth@email.com");
        usuario.setSenha("senha123");
        usuarioRepository.save(usuario);

        Optional<Usuario> resultado = usuarioService.autenticar("auth@email.com", "senha123");

        assertTrue(resultado.isPresent());
        assertEquals("Usuario Teste", resultado.get().getNome());
    }

    @Test
    void naoDeveAutenticarComSenhaErrada() {
        Usuario usuario = new Usuario();
        usuario.setNome("Usuario");
        usuario.setEmail("user@email.com");
        usuario.setSenha("correta");
        usuarioRepository.save(usuario);

        Optional<Usuario> resultado = usuarioService.autenticar("user@email.com", "errada");

        assertFalse(resultado.isPresent());
    }

    @Test
    void deveRegistrarNovoUsuario() {
        Usuario usuario = new Usuario();
        usuario.setNome("Novo Usuario");
        usuario.setEmail("novo@email.com");
        usuario.setSenha("123456");
        usuario.setTipo(TipoUsuario.MOTORISTA);

        Usuario registrado = usuarioService.registrar(usuario);

        assertNotNull(registrado.getId());
        assertEquals(TipoUsuario.MOTORISTA, registrado.getTipo());
    }

    @Test
    void naoDeveRegistrarEmailDuplicado() {
        Usuario usuario1 = new Usuario();
        usuario1.setNome("Usuario 1");
        usuario1.setEmail("duplicado@email.com");
        usuario1.setSenha("123456");
        usuarioRepository.save(usuario1);

        Usuario usuario2 = new Usuario();
        usuario2.setNome("Usuario 2");
        usuario2.setEmail("duplicado@email.com");
        usuario2.setSenha("654321");

        assertThrows(RuntimeException.class, () -> {
            usuarioService.registrar(usuario2);
        });
    }

    @Test
    void deveListarTodosUsuarios() {
        Usuario u1 = new Usuario();
        u1.setNome("Usuario 1");
        u1.setEmail("u1@email.com");
        u1.setSenha("123");
        usuarioRepository.save(u1);

        Usuario u2 = new Usuario();
        u2.setNome("Usuario 2");
        u2.setEmail("u2@email.com");
        u2.setSenha("456");
        usuarioRepository.save(u2);

        List<Usuario> usuarios = usuarioService.listarTodos();

        assertEquals(2, usuarios.size());
    }
}
