package com.tanq.repository;

import com.tanq.model.Preco;
import com.tanq.model.TipoCombustivel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrecoRepository extends JpaRepository<Preco, Long> {

    // Buscar preços de um posto
    List<Preco> findByPostoId(Long postoId);

    // Buscar preços cadastrados por um usuário
    List<Preco> findByUsuarioId(Long usuarioId);

    // Buscar último preço de um combustível em um posto
    Optional<Preco> findFirstByPostoIdAndTipoCombustivelOrderByCriadoEmDesc(Long postoId,
            TipoCombustivel tipoCombustivel);

    // Deletar todos preços de um posto
    void deleteByPostoId(Long postoId);

    // Ranking por tipo de combustível (menor preço primeiro)
    @Query("SELECT p FROM Preco p WHERE p.tipoCombustivel = :tipo ORDER BY p.valor ASC")
    List<Preco> findRankingByTipoCombustivel(TipoCombustivel tipo);
}
