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

    // Campos de endereço obrigatórios
    @NotBlank(message = "Rua é obrigatória")
    @Column(nullable = false)
    private String rua;

    private String numero;

    private String complemento;

    private String bairro;

    @NotBlank(message = "Cidade é obrigatória")
    @Column(nullable = false)
    private String cidade;

    @NotBlank(message = "Estado é obrigatório")
    @Column(nullable = false, length = 2)
    private String estado;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "dono_id")
    private Long donoId;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    // Construtores
    public Posto() {
        this.criadoEm = LocalDateTime.now();
    }

    // Método para obter endereço formatado
    public String getEnderecoFormatado() {
        StringBuilder sb = new StringBuilder();
        if (rua != null && !rua.isEmpty()) {
            sb.append(rua);
            if (numero != null && !numero.isEmpty()) {
                sb.append(", ").append(numero);
            }
        }
        if (bairro != null && !bairro.isEmpty()) {
            sb.append(" - ").append(bairro);
        }
        if (cidade != null && !cidade.isEmpty()) {
            sb.append(", ").append(cidade);
        }
        if (estado != null && !estado.isEmpty()) {
            sb.append(" - ").append(estado);
        }
        return sb.toString();
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

    public String getRua() {
        return rua;
    }

    public void setRua(String rua) {
        this.rua = rua;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getComplemento() {
        return complemento;
    }

    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
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
