package com.tanq.controller;

import com.tanq.model.Preco;
import com.tanq.model.TipoCombustivel;
import com.tanq.model.TipoUsuario;
import com.tanq.service.PrecoService;
import com.tanq.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/precos")
@CrossOrigin(origins = "http://localhost:5173")
public class PrecoController {

    @Autowired
    private PrecoService precoService;

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<Preco> listarTodos() {
        return precoService.listarTodos();
    }

    @GetMapping("/posto/{postoId}")
    public List<Preco> listarPorPosto(@PathVariable Long postoId) {
        return precoService.listarPorPosto(postoId);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Preco> listarPorUsuario(@PathVariable Long usuarioId) {
        return precoService.listarPorUsuario(usuarioId);
    }

    @GetMapping("/ranking/{tipo}")
    public List<Preco> ranking(@PathVariable String tipo) {
        TipoCombustivel tipoCombustivel = TipoCombustivel.valueOf(tipo.toUpperCase());
        return precoService.rankingPorCombustivel(tipoCombustivel);
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Map<String, Object> request) {
        try {
            Long usuarioId = Long.valueOf(request.get("usuarioId").toString());

            var usuario = usuarioService.buscarPorId(usuarioId);
            if (usuario.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Usuário não encontrado"));
            }

            Preco preco = new Preco();
            preco.setPostoId(Long.valueOf(request.get("postoId").toString()));
            preco.setTipoCombustivel(TipoCombustivel.valueOf(request.get("tipoCombustivel").toString().toUpperCase()));
            preco.setValor(new java.math.BigDecimal(request.get("valor").toString()));

            Preco salvo = precoService.salvar(preco, usuarioId, usuario.get().getTipo());
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
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

            precoService.deletar(id, usuarioId, usuario.get().getTipo());
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}
