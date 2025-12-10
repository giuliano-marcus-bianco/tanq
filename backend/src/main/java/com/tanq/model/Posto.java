package com.tanq.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
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

    @Column(name = "preco_gasolina", precision = 10, scale = 3)
    private BigDecimal precoGasolina;

    @Column(name = "preco_etanol", precision = 10, scale = 3)
    private BigDecimal precoEtanol;

    @Column(name = "preco_diesel", precision = 10, scale = 3)
    private BigDecimal precoDiesel;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    // Construtores
    public Posto() {
    }

    public Posto(String nome, String endereco) {
        this.nome = nome;
        this.endereco = endereco;
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

    public BigDecimal getPrecoGasolina() {
        return precoGasolina;
    }

    public void setPrecoGasolina(BigDecimal precoGasolina) {
        this.precoGasolina = precoGasolina;
    }

    public BigDecimal getPrecoEtanol() {
        return precoEtanol;
    }

    public void setPrecoEtanol(BigDecimal precoEtanol) {
        this.precoEtanol = precoEtanol;
    }

    public BigDecimal getPrecoDiesel() {
        return precoDiesel;
    }

    public void setPrecoDiesel(BigDecimal precoDiesel) {
        this.precoDiesel = precoDiesel;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }
}
