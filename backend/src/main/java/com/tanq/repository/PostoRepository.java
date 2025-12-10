package com.tanq.repository;

import com.tanq.model.Posto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostoRepository extends JpaRepository<Posto, Long> {

    // Buscar postos ordenados pelo menor preço de gasolina
    List<Posto> findAllByOrderByPrecoGasolinaAsc();

    // Buscar postos ordenados pelo menor preço de etanol
    List<Posto> findAllByOrderByPrecoEtanolAsc();

    // Buscar postos por nome (busca parcial, ignorando maiúsculas/minúsculas)
    List<Posto> findByNomeContainingIgnoreCase(String nome);

    // Buscar postos por endereço
    List<Posto> findByEnderecoContainingIgnoreCase(String endereco);
}
