package com.tanq.service;

import com.tanq.model.Preco;
import com.tanq.model.Posto;
import com.tanq.model.TipoCombustivel;
import com.tanq.model.TipoUsuario;
import com.tanq.repository.PrecoRepository;
import com.tanq.repository.PostoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PrecoService {

    @Autowired
    private PrecoRepository precoRepository;

    @Autowired
    private PostoRepository postoRepository;

    public List<Preco> listarTodos() {
        return precoRepository.findAll();
    }

    public List<Preco> listarPorPosto(Long postoId) {
        return precoRepository.findByPostoId(postoId);
    }

    public List<Preco> listarPorUsuario(Long usuarioId) {
        return precoRepository.findByUsuarioId(usuarioId);
    }

    public Optional<Preco> buscarPorId(Long id) {
        return precoRepository.findById(id);
    }

    public List<Preco> rankingPorCombustivel(TipoCombustivel tipo) {
        return precoRepository.findRankingByTipoCombustivel(tipo);
    }

    public Preco salvar(Preco preco, Long usuarioId, TipoUsuario tipoUsuario) {
        // Verificar se o posto existe
        Optional<Posto> posto = postoRepository.findById(preco.getPostoId());
        if (posto.isEmpty()) {
            throw new RuntimeException("Posto não encontrado");
        }

        // Dono de Posto só pode cadastrar preço no próprio posto
        if (tipoUsuario == TipoUsuario.DONO_POSTO) {
            if (!posto.get().getDonoId().equals(usuarioId)) {
                throw new RuntimeException("Você só pode cadastrar preços no seu próprio posto");
            }
        }

        preco.setUsuarioId(usuarioId);
        preco.setCriadoEm(LocalDateTime.now());
        return precoRepository.save(preco);
    }

    @Transactional
    public void deletar(Long id, Long usuarioId, TipoUsuario tipoUsuario) {
        Optional<Preco> preco = precoRepository.findById(id);
        if (preco.isEmpty()) {
            throw new RuntimeException("Preço não encontrado");
        }

        Preco p = preco.get();

        // Administrador pode deletar qualquer preço
        if (tipoUsuario == TipoUsuario.ADMINISTRADOR) {
            precoRepository.deleteById(id);
            return;
        }

        // Motorista só pode deletar preço que ele cadastrou
        if (tipoUsuario == TipoUsuario.MOTORISTA) {
            if (!p.getUsuarioId().equals(usuarioId)) {
                throw new RuntimeException("Você só pode deletar preços que você cadastrou");
            }
            precoRepository.deleteById(id);
            return;
        }

        // Dono de Posto pode deletar preços que ele cadastrou
        if (tipoUsuario == TipoUsuario.DONO_POSTO) {
            if (!p.getUsuarioId().equals(usuarioId)) {
                throw new RuntimeException("Você só pode deletar preços que você cadastrou");
            }
            precoRepository.deleteById(id);
            return;
        }

        throw new RuntimeException("Permissão negada");
    }

    @Transactional
    public void deletarTodosPorPosto(Long postoId) {
        precoRepository.deleteByPostoId(postoId);
    }
}
