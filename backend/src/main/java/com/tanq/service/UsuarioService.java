package com.tanq.service;

import com.tanq.model.Usuario;
import com.tanq.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public Usuario salvar(Usuario usuario) {
        if (usuario.getCriadoEm() == null) {
            usuario.setCriadoEm(LocalDateTime.now());
        }
        return usuarioRepository.save(usuario);
    }

    public void deletar(Long id) {
        usuarioRepository.deleteById(id);
    }

    public boolean emailExiste(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    // Autenticação simples (sem JWT - apenas para projeto acadêmico)
    public Optional<Usuario> autenticar(String email, String senha) {
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        if (usuario.isPresent() && usuario.get().getSenha().equals(senha)) {
            return usuario;
        }
        return Optional.empty();
    }

    // Registro de novo usuário
    public Usuario registrar(Usuario usuario) {
        if (emailExiste(usuario.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }
        usuario.setCriadoEm(LocalDateTime.now());
        return usuarioRepository.save(usuario);
    }
}
