package com.tanq.repository;

import com.tanq.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Buscar usuário por email
    Optional<Usuario> findByEmail(String email);

    // Verificar se email já existe
    boolean existsByEmail(String email);
}
