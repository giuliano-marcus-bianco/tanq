-- Dados iniciais para demonstração
-- Este arquivo é executado automaticamente pelo Spring Boot

INSERT INTO postos (nome, endereco, preco_gasolina, preco_etanol, preco_diesel, atualizado_em) VALUES
('Posto Shell Centro', 'Rua Principal, 100 - Centro', 5.89, 3.99, 5.29, CURRENT_TIMESTAMP()),
('Posto Ipiranga', 'Av. Brasil, 500 - Jardim América', 5.79, 3.89, 5.19, CURRENT_TIMESTAMP()),
('Posto BR', 'Rua das Flores, 200 - Vila Nova', 5.99, 4.09, 5.39, CURRENT_TIMESTAMP()),
('Posto Petrobras', 'Av. Paulista, 1000 - Centro', 6.05, 4.15, 5.45, CURRENT_TIMESTAMP()),
('Posto Ale', 'Rua do Comércio, 50 - Bairro Industrial', 5.69, 3.79, 5.09, CURRENT_TIMESTAMP());
