package com.tanq.repository;

import com.tanq.model.Posto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostoRepository extends JpaRepository<Posto, Long> {

    // Buscar postos por dono
    List<Posto> findByDonoId(Long donoId);

    // Buscar postos por nome (busca parcial, ignorando maiúsculas/minúsculas)
    List<Posto> findByNomeContainingIgnoreCase(String nome);

    // Buscar postos por cidade
    List<Posto> findByCidadeContainingIgnoreCase(String cidade);
}
