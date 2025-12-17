-- Dados iniciais para demonstração
-- Este arquivo é executado automaticamente pelo Spring Boot
-- Usando INSERT IGNORE para evitar duplicatas

-- Usuários de exemplo (senha em texto plano apenas para projeto acadêmico)
INSERT IGNORE INTO usuarios (id, nome, email, senha, tipo, criado_em) VALUES
(1, 'Admin', 'admin@tanq.com', 'admin123', 'ADMINISTRADOR', CURRENT_TIMESTAMP()),
(2, 'João Motorista', 'joao@email.com', '123456', 'MOTORISTA', CURRENT_TIMESTAMP()),
(3, 'Maria Posto', 'maria@posto.com', '123456', 'DONO_POSTO', CURRENT_TIMESTAMP());

-- Postos de exemplo (com dono_id referenciando os usuários)
INSERT IGNORE INTO postos (id, nome, endereco, latitude, longitude, dono_id, criado_em) VALUES
(1, 'Posto Shell Centro', 'Rua Principal, 100 - Centro', -27.5954, -48.5480, 1, CURRENT_TIMESTAMP()),
(2, 'Posto Ipiranga', 'Av. Brasil, 500 - Jardim América', -27.5969, -48.5495, 3, CURRENT_TIMESTAMP()),
(3, 'Posto BR', 'Rua das Flores, 200 - Vila Nova', -27.6000, -48.5520, 1, CURRENT_TIMESTAMP()),
(4, 'Posto Petrobras', 'Av. Paulista, 1000 - Centro', -27.5800, -48.5300, 3, CURRENT_TIMESTAMP()),
(5, 'Posto Ale', 'Rua do Comércio, 50 - Bairro Industrial', -27.6100, -48.5600, 1, CURRENT_TIMESTAMP());

-- Preços de exemplo (com usuario_id indicando quem cadastrou)
INSERT IGNORE INTO precos (id, posto_id, tipo_combustivel, valor, usuario_id, criado_em) VALUES
(1, 1, 'GASOLINA', 5.89, 1, CURRENT_TIMESTAMP()),
(2, 1, 'ETANOL', 3.99, 1, CURRENT_TIMESTAMP()),
(3, 1, 'DIESEL', 5.29, 1, CURRENT_TIMESTAMP()),
(4, 2, 'GASOLINA', 5.79, 3, CURRENT_TIMESTAMP()),
(5, 2, 'ETANOL', 3.89, 3, CURRENT_TIMESTAMP()),
(6, 2, 'DIESEL', 5.19, 3, CURRENT_TIMESTAMP()),
(7, 3, 'GASOLINA', 5.99, 2, CURRENT_TIMESTAMP()),
(8, 3, 'ETANOL', 4.09, 2, CURRENT_TIMESTAMP()),
(9, 4, 'GASOLINA', 6.05, 3, CURRENT_TIMESTAMP()),
(10, 4, 'ETANOL', 4.15, 3, CURRENT_TIMESTAMP()),
(11, 5, 'GASOLINA', 5.69, 1, CURRENT_TIMESTAMP()),
(12, 5, 'ETANOL', 3.79, 2, CURRENT_TIMESTAMP());
