package com.tanq.service;

import com.tanq.model.Posto;
import com.tanq.model.TipoUsuario;
import com.tanq.repository.PostoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostoService {

    @Autowired
    private PostoRepository postoRepository;

    @Autowired
    private PrecoService precoService;

    public List<Posto> listarTodos() {
        return postoRepository.findAll();
    }

    public Optional<Posto> buscarPorId(Long id) {
        return postoRepository.findById(id);
    }

    public List<Posto> buscarPorDonoId(Long donoId) {
        return postoRepository.findByDonoId(donoId);
    }

    public List<Posto> buscarPorNome(String nome) {
        return postoRepository.findByNomeContainingIgnoreCase(nome);
    }

    public Posto salvar(Posto posto, Long usuarioId, TipoUsuario tipoUsuario) {
        // Apenas Admin ou Dono de Posto podem criar postos
        if (tipoUsuario != TipoUsuario.ADMINISTRADOR && tipoUsuario != TipoUsuario.DONO_POSTO) {
            throw new RuntimeException("Apenas Administradores ou Donos de Posto podem criar postos");
        }

        posto.setDonoId(usuarioId);
        posto.setCriadoEm(LocalDateTime.now());
        return postoRepository.save(posto);
    }

    public Posto atualizar(Long id, Posto postoAtualizado, Long usuarioId, TipoUsuario tipoUsuario) {
        return postoRepository.findById(id)
                .map(posto -> {
                    // Verificar permissão
                    if (tipoUsuario != TipoUsuario.ADMINISTRADOR && !posto.getDonoId().equals(usuarioId)) {
                        throw new RuntimeException("Você não tem permissão para editar este posto");
                    }

                    posto.setNome(postoAtualizado.getNome());
                    posto.setEndereco(postoAtualizado.getEndereco());
                    posto.setLatitude(postoAtualizado.getLatitude());
                    posto.setLongitude(postoAtualizado.getLongitude());
                    return postoRepository.save(posto);
                })
                .orElseThrow(() -> new RuntimeException("Posto não encontrado com id: " + id));
    }

    @Transactional
    public void deletar(Long id, Long usuarioId, TipoUsuario tipoUsuario) {
        Optional<Posto> posto = postoRepository.findById(id);
        if (posto.isEmpty()) {
            throw new RuntimeException("Posto não encontrado");
        }

        Posto p = posto.get();

        // Administrador pode deletar qualquer posto
        if (tipoUsuario == TipoUsuario.ADMINISTRADOR) {
            precoService.deletarTodosPorPosto(id);
            postoRepository.deleteById(id);
            return;
        }

        // Dono de Posto só pode deletar posto que ele criou
        if (tipoUsuario == TipoUsuario.DONO_POSTO) {
            if (!p.getDonoId().equals(usuarioId)) {
                throw new RuntimeException("Você só pode deletar postos que você criou");
            }
            precoService.deletarTodosPorPosto(id);
            postoRepository.deleteById(id);
            return;
        }

        // Motorista não pode deletar postos
        throw new RuntimeException("Motoristas não podem deletar postos");
    }

    public long contarPostos() {
        return postoRepository.count();
    }
}
