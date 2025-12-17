package com.tanq.controller;

import com.tanq.model.Usuario;
import com.tanq.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String senha = credentials.get("senha");

        if (email == null || senha == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", "Email e senha são obrigatórios"));
        }

        Optional<Usuario> usuario = usuarioService.autenticar(email, senha);

        if (usuario.isPresent()) {
            Usuario u = usuario.get();
            Map<String, Object> response = new HashMap<>();
            response.put("id", u.getId());
            response.put("email", u.getEmail());
            response.put("nome", u.getNome());
            response.put("tipo", u.getTipo());
            response.put("mensagem", "Login realizado com sucesso");
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("erro", "Email ou senha inválidos"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario usuario) {
        try {
            if (usuario.getEmail() == null || usuario.getSenha() == null || usuario.getNome() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("erro", "Email, senha e nome são obrigatórios"));
            }

            Usuario novoUsuario = usuarioService.registrar(usuario);

            Map<String, Object> response = new HashMap<>();
            response.put("id", novoUsuario.getId());
            response.put("email", novoUsuario.getEmail());
            response.put("nome", novoUsuario.getNome());
            response.put("tipo", novoUsuario.getTipo());
            response.put("mensagem", "Usuário cadastrado com sucesso");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", e.getMessage()));
        }
    }

    @GetMapping("/me/{id}")
    public ResponseEntity<?> me(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioService.buscarPorId(id);
        if (usuario.isPresent()) {
            Usuario u = usuario.get();
            Map<String, Object> response = new HashMap<>();
            response.put("id", u.getId());
            response.put("email", u.getEmail());
            response.put("nome", u.getNome());
            response.put("tipo", u.getTipo());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
}
