package com.tanq.controller;

import com.tanq.model.Avaliacao;
import com.tanq.model.TipoUsuario;
import com.tanq.service.AvaliacaoService;
import com.tanq.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/avaliacoes")
@CrossOrigin(origins = "http://localhost:5173")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService avaliacaoService;

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<Avaliacao> listarTodos() {
        return avaliacaoService.listarTodos();
    }

    @GetMapping("/posto/{postoId}")
    public List<Avaliacao> listarPorPosto(@PathVariable Long postoId) {
        return avaliacaoService.listarPorPosto(postoId);
    }

    @GetMapping("/posto/{postoId}/media")
    public ResponseEntity<?> mediaPorPosto(@PathVariable Long postoId) {
        double media = avaliacaoService.calcularMediaPosto(postoId);
        int total = avaliacaoService.contarAvaliacoesPosto(postoId);
        return ResponseEntity.ok(Map.of("media", media, "total", total));
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Avaliacao> listarPorUsuario(@PathVariable Long usuarioId) {
        return avaliacaoService.listarPorUsuario(usuarioId);
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Map<String, Object> request) {
        try {
            Long usuarioId = Long.valueOf(request.get("usuarioId").toString());

            var usuario = usuarioService.buscarPorId(usuarioId);
            if (usuario.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Usuário não encontrado"));
            }

            Avaliacao avaliacao = new Avaliacao();
            avaliacao.setPostoId(Long.valueOf(request.get("postoId").toString()));
            avaliacao.setNota(Integer.valueOf(request.get("nota").toString()));

            if (request.get("comentario") != null) {
                avaliacao.setComentario(request.get("comentario").toString());
            }

            Avaliacao salva = avaliacaoService.salvar(avaliacao, usuarioId, usuario.get().getTipo());
            return ResponseEntity.status(HttpStatus.CREATED).body(salva);
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

            avaliacaoService.deletar(id, usuarioId, usuario.get().getTipo());
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}
