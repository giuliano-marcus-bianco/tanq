package com.tanq.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "postos")
public class Posto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Column(nullable = false)
    private String nome;

    private String endereco;

    private Double latitude;

    private Double longitude;

    @Column(name = "dono_id")
    private Long donoId;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    // Construtores
    public Posto() {
        this.criadoEm = LocalDateTime.now();
    }

    public Posto(String nome, String endereco) {
        this.nome = nome;
        this.endereco = endereco;
        this.criadoEm = LocalDateTime.now();
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Long getDonoId() {
        return donoId;
    }

    public void setDonoId(Long donoId) {
        this.donoId = donoId;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}
