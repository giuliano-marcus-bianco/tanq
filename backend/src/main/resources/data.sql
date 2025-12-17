-- Dados iniciais para demonstração
-- Este arquivo é executado automaticamente pelo Spring Boot

-- Usuários de exemplo (senha em texto plano apenas para projeto acadêmico)
INSERT IGNORE INTO usuarios (id, nome, email, senha, tipo, criado_em) VALUES
(1, 'Admin', 'admin@tanq.com', 'admin123', 'ADMINISTRADOR', CURRENT_TIMESTAMP()),
(2, 'João Motorista', 'joao@email.com', '123456', 'MOTORISTA', CURRENT_TIMESTAMP()),
(3, 'Maria Posto', 'maria@posto.com', '123456', 'DONO_POSTO', CURRENT_TIMESTAMP());

-- ATUALIZAR todos os postos com coordenadas únicas e endereços reais de Florianópolis
-- Cada posto terá uma localização diferente na região

UPDATE postos SET 
    rua = 'Rua Felipe Schmidt', numero = '100', bairro = 'Centro', cidade = 'Florianópolis', estado = 'SC',
    latitude = -27.5954, longitude = -48.5480
WHERE id = 1;

UPDATE postos SET 
    rua = 'Av. Madre Benvenuta', numero = '500', bairro = 'Trindade', cidade = 'Florianópolis', estado = 'SC',
    latitude = -27.5815, longitude = -48.5213
WHERE id = 2;

UPDATE postos SET 
    rua = 'Av. Ivo Silveira', numero = '200', bairro = 'Estreito', cidade = 'Florianópolis', estado = 'SC',
    latitude = -27.5916, longitude = -48.5764
WHERE id = 3;

UPDATE postos SET 
    rua = 'Rua Desembargador Pedro Silva', numero = '1000', bairro = 'Coqueiros', cidade = 'Florianópolis', estado = 'SC',
    latitude = -27.5754, longitude = -48.5872
WHERE id = 4;

UPDATE postos SET 
    rua = 'Av. Beira Mar Norte', numero = '50', bairro = 'Centro', cidade = 'Florianópolis', estado = 'SC',
    latitude = -27.5871, longitude = -48.5518
WHERE id = 5;

UPDATE postos SET 
    rua = 'Av. das Torres', numero = '100', bairro = 'Pedra Branca', cidade = 'Palhoça', estado = 'SC',
    latitude = -27.6355, longitude = -48.6718
WHERE id = 6;

UPDATE postos SET 
    rua = 'Av. Gov. Irineu Bornhausen', numero = '800', bairro = 'Agronômica', cidade = 'Florianópolis', estado = 'SC',
    latitude = -27.5765, longitude = -48.5442
WHERE id = 7;

UPDATE postos SET 
    rua = 'Rod. SC-401', numero = '1500', bairro = 'Canasvieiras', cidade = 'Florianópolis', estado = 'SC',
    latitude = -27.4264, longitude = -48.4684
WHERE id = 8;

UPDATE postos SET 
    rua = 'Av. Santa Catarina', numero = '300', bairro = 'Campinas', cidade = 'São José', estado = 'SC',
    latitude = -27.5912, longitude = -48.6194
WHERE id = 9;

UPDATE postos SET 
    rua = 'Av. Hercílio Luz', numero = '1000', bairro = 'Centro', cidade = 'Florianópolis', estado = 'SC',
    latitude = -27.5929, longitude = -48.5525
WHERE id = 10;

UPDATE postos SET 
    rua = 'Rod. Virgílio Várzea', numero = '500', bairro = 'Saco Grande', cidade = 'Florianópolis', estado = 'SC',
    latitude = -27.5478, longitude = -48.5124
WHERE id = 12;

UPDATE postos SET 
    rua = 'Av. Luiz Boiteux Piazza', numero = '200', bairro = 'Cachoeira do Bom Jesus', cidade = 'Florianópolis', estado = 'SC',
    latitude = -27.4121, longitude = -48.4583
WHERE id = 13;

UPDATE postos SET 
    rua = 'Rod. João Paulo', numero = '800', bairro = 'João Paulo', cidade = 'Florianópolis', estado = 'SC',
    latitude = -27.5542, longitude = -48.5284
WHERE id = 14;

UPDATE postos SET 
    rua = 'Av. Lédio João Martins', numero = '400', bairro = 'Kobrasol', cidade = 'São José', estado = 'SC',
    latitude = -27.5871, longitude = -48.6120
WHERE id = 15;

UPDATE postos SET 
    rua = 'Av. Beira Mar', numero = '2000', bairro = 'Centro', cidade = 'São José', estado = 'SC',
    latitude = -27.6021, longitude = -48.6353
WHERE id = 16;

UPDATE postos SET 
    rua = 'Rua Lauro Linhares', numero = '600', bairro = 'Trindade', cidade = 'Florianópolis', estado = 'SC',
    latitude = -27.5789, longitude = -48.5156
WHERE id = 17;

UPDATE postos SET 
    rua = 'Av. Mauro Ramos', numero = '800', bairro = 'Centro', cidade = 'Florianópolis', estado = 'SC',
    latitude = -27.5989, longitude = -48.5468
WHERE id = 18;

UPDATE postos SET 
    rua = 'Av. Eng. Max de Souza', numero = '1500', bairro = 'Coqueiros', cidade = 'Florianópolis', estado = 'SC',
    latitude = -27.5698, longitude = -48.5832
WHERE id = 19;

UPDATE postos SET 
    rua = 'SC-401', numero = '3000', bairro = 'Jurere', cidade = 'Florianópolis', estado = 'SC',
    latitude = -27.4335, longitude = -48.4901
WHERE id = 20;

UPDATE postos SET 
    rua = 'Av. Osni Ortiga', numero = '200', bairro = 'Itacorubi', cidade = 'Florianópolis', estado = 'SC',
    latitude = -27.5698, longitude = -48.5012
WHERE id = 21;

UPDATE postos SET 
    rua = 'Av. Beira Mar Norte', numero = '4500', bairro = 'Monte Verde', cidade = 'Florianópolis', estado = 'SC',
    latitude = -27.5513, longitude = -48.5205
WHERE id = 22;

-- Preços de exemplo
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
