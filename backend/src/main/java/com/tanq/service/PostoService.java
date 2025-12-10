package com.tanq.service;

import com.tanq.model.Posto;
import com.tanq.repository.PostoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostoService {

    @Autowired
    private PostoRepository postoRepository;

    public List<Posto> listarTodos() {
        return postoRepository.findAll();
    }

    public Optional<Posto> buscarPorId(Long id) {
        return postoRepository.findById(id);
    }

    public List<Posto> rankingPorPrecoGasolina() {
        return postoRepository.findAllByOrderByPrecoGasolinaAsc();
    }

    public List<Posto> rankingPorPrecoEtanol() {
        return postoRepository.findAllByOrderByPrecoEtanolAsc();
    }

    public List<Posto> buscarPorNome(String nome) {
        return postoRepository.findByNomeContainingIgnoreCase(nome);
    }

    public Posto salvar(Posto posto) {
        posto.setAtualizadoEm(LocalDateTime.now());
        return postoRepository.save(posto);
    }

    public Posto atualizar(Long id, Posto postoAtualizado) {
        return postoRepository.findById(id)
                .map(posto -> {
                    posto.setNome(postoAtualizado.getNome());
                    posto.setEndereco(postoAtualizado.getEndereco());
                    posto.setLatitude(postoAtualizado.getLatitude());
                    posto.setLongitude(postoAtualizado.getLongitude());
                    posto.setPrecoGasolina(postoAtualizado.getPrecoGasolina());
                    posto.setPrecoEtanol(postoAtualizado.getPrecoEtanol());
                    posto.setPrecoDiesel(postoAtualizado.getPrecoDiesel());
                    posto.setAtualizadoEm(LocalDateTime.now());
                    return postoRepository.save(posto);
                })
                .orElseThrow(() -> new RuntimeException("Posto não encontrado com id: " + id));
    }

    public void deletar(Long id) {
        postoRepository.deleteById(id);
    }

    public long contarPostos() {
        return postoRepository.count();
    }
}
