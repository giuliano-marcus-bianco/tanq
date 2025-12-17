package com.tanq.repository;

import com.tanq.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

    List<Avaliacao> findByPostoId(Long postoId);

    List<Avaliacao> findByUsuarioId(Long usuarioId);

    List<Avaliacao> findByPostoIdOrderByCriadoEmDesc(Long postoId);

    void deleteByPostoId(Long postoId);
}
