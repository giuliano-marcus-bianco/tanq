package com.tanq.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "precos")
public class Preco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "posto_id", nullable = false)
    private Long postoId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoCombustivel tipoCombustivel;

    @Column(precision = 10, scale = 3, nullable = false)
    private BigDecimal valor;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    public Preco() {
        this.criadoEm = LocalDateTime.now();
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPostoId() {
        return postoId;
    }

    public void setPostoId(Long postoId) {
        this.postoId = postoId;
    }

    public TipoCombustivel getTipoCombustivel() {
        return tipoCombustivel;
    }

    public void setTipoCombustivel(TipoCombustivel tipoCombustivel) {
        this.tipoCombustivel = tipoCombustivel;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}
