package com.tanq.controller;

import com.tanq.model.Posto;
import com.tanq.service.PostoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/postos")
public class PostoController {

    @Autowired
    private PostoService postoService;

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

    @GetMapping("/ranking")
    public List<Posto> rankingGasolina() {
        return postoService.rankingPorPrecoGasolina();
    }

    @GetMapping("/ranking/etanol")
    public List<Posto> rankingEtanol() {
        return postoService.rankingPorPrecoEtanol();
    }

    @GetMapping("/buscar")
    public List<Posto> buscarPorNome(@RequestParam String nome) {
        return postoService.buscarPorNome(nome);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Posto criar(@Valid @RequestBody Posto posto) {
        return postoService.salvar(posto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Posto> atualizar(@PathVariable Long id, @Valid @RequestBody Posto posto) {
        try {
            Posto postoAtualizado = postoService.atualizar(id, posto);
            return ResponseEntity.ok(postoAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        postoService.deletar(id);
    }
}
