package com.tanq.controller;

import com.tanq.model.Posto;
import com.tanq.model.TipoUsuario;
import com.tanq.service.PostoService;
import com.tanq.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/postos")
@CrossOrigin(origins = "http://localhost:5173")
public class PostoController {

    @Autowired
    private PostoService postoService;

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<Posto> listarTodos() {
        return postoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Posto> buscarPorId(@PathVariable Long id) {
        return postoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/meus")
    public ResponseEntity<?> meusPostos(@RequestParam Long usuarioId) {
        return ResponseEntity.ok(postoService.buscarPorDonoId(usuarioId));
    }

    @GetMapping("/buscar")
    public List<Posto> buscarPorNome(@RequestParam String nome) {
        return postoService.buscarPorNome(nome);
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Map<String, Object> request) {
        try {
            Long usuarioId = Long.valueOf(request.get("usuarioId").toString());

            var usuario = usuarioService.buscarPorId(usuarioId);
            if (usuario.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Usuário não encontrado"));
            }

            Posto posto = new Posto();
            posto.setNome(request.get("nome").toString());
            if (request.get("endereco") != null) {
                posto.setEndereco(request.get("endereco").toString());
            }
            if (request.get("latitude") != null) {
                posto.setLatitude(Double.valueOf(request.get("latitude").toString()));
            }
            if (request.get("longitude") != null) {
                posto.setLongitude(Double.valueOf(request.get("longitude").toString()));
            }

            Posto salvo = postoService.salvar(posto, usuarioId, usuario.get().getTipo());
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Long usuarioId = Long.valueOf(request.get("usuarioId").toString());

            var usuario = usuarioService.buscarPorId(usuarioId);
            if (usuario.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Usuário não encontrado"));
            }

            Posto postoAtualizado = new Posto();
            postoAtualizado.setNome(request.get("nome").toString());
            if (request.get("endereco") != null) {
                postoAtualizado.setEndereco(request.get("endereco").toString());
            }
            if (request.get("latitude") != null) {
                postoAtualizado.setLatitude(Double.valueOf(request.get("latitude").toString()));
            }
            if (request.get("longitude") != null) {
                postoAtualizado.setLongitude(Double.valueOf(request.get("longitude").toString()));
            }

            Posto atualizado = postoService.atualizar(id, postoAtualizado, usuarioId, usuario.get().getTipo());
            return ResponseEntity.ok(atualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id, @RequestParam Long usuarioId) {
        try {
            var usuario = usuarioService.buscarPorId(usuarioId);
            if (usuario.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Usuário não encontrado"));
            }

            postoService.deletar(id, usuarioId, usuario.get().getTipo());
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}
