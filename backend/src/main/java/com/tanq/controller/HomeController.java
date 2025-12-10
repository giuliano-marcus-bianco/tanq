package com.tanq.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HomeController {

    @GetMapping
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("mensagem", "Bem-vindo à API do Tanq! ⛽");
        response.put("versao", "1.0.0");
        response.put("endpoints", new String[] {
                "GET /api/postos - Listar todos os postos",
                "GET /api/postos/ranking - Ranking por preço de gasolina",
                "GET /api/postos/ranking/etanol - Ranking por preço de etanol",
                "GET /api/postos/{id} - Buscar posto por ID",
                "GET /api/postos/buscar?nome=... - Buscar por nome",
                "POST /api/postos - Criar novo posto",
                "PUT /api/postos/{id} - Atualizar posto",
                "DELETE /api/postos/{id} - Deletar posto"
        });
        return response;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }
}
