# Análise de Requisitos e Regras de Negócio - Projeto Tanq

Este documento detalha os requisitos funcionais, não funcionais e as regras de negócio para o aplicativo Tanq.

---

## 1. Requisitos Funcionais (RF)

* **RF01:** O sistema deve permitir que o usuário visualize um mapa interativo com a geolocalização dos postos de combustível.
* **RF02:** O sistema deve exibir no mapa o preço dos combustíveis e a avaliação média de cada posto.
* **RF03:** O sistema deve apresentar uma lista (ranking) de postos de combustível, ordenada do preço mais baixo para o mais alto.
* **RF04:** O usuário deve poder registrar uma avaliação (nota) para um posto de combustível.
* **RF05:** O usuário deve poder escrever um comentário sobre sua experiência em um posto.
* **RF06:** O sistema deve exibir as avaliações e comentários de outros usuários na página de detalhes de um posto.
* **RF07:** Usuários parceiros (postos de combustível) devem poder criar e disponibilizar cupons de desconto na plataforma.
* **RF08:** O usuário deve poder visualizar e resgatar cupons de desconto de postos parceiros.
* **RF09:** O sistema deve fornecer um assistente virtual (chatbot) para interação com o usuário.
* **RF10:** O chatbot deve ser capaz de recomendar postos com base na combinação de preço, distância e avaliação.
* **RF11:** O chatbot deve justificar textualmente o motivo de suas recomendações.
* **RF12:** O usuário deve poder submeter uma foto da placa de preços de um posto para atualizar os valores.
* **RF13:** O sistema deve utilizar a geolocalização do dispositivo do usuário para identificar automaticamente a qual posto a foto enviada pertence.
* **RF14:** O sistema deve ser capaz de extrair os valores dos combustíveis a partir da foto enviada pelo usuário.

---

## 2. Requisitos Não Funcionais (RNF)

* **RNF01 (Desempenho):** As informações de preço no mapa e no ranking devem ser atualizadas para o usuário em, no máximo, 5 segundos após a consulta.
* **RNF02 (Usabilidade):** Um novo usuário deve ser capaz de encontrar o posto mais barato em sua região e iniciar a navegação até ele em menos de 60 segundos.
* **RNF03 (Precisão da IA):** O sistema de leitura de imagem (OCR) deve ter uma taxa de acerto de, no mínimo, 98% na extração de preços de fotos nítidas e bem iluminadas.
* **RNF04 (Precisão de Geolocalização):** O sistema de georreferenciamento para atualização por foto deve identificar o posto correto com uma margem de erro máxima de 25 metros.
* **RNF05 (Disponibilidade):** A plataforma deve permanecer online e acessível para os usuários durante 99,5% do tempo.
* **RNF06 (Compatibilidade):** O aplicativo deve ser compatível com as duas últimas versões principais dos sistemas operacionais Android e iOS.
* **RNF07 (Segurança):** Os dados dos usuários, como localização e informações de perfil, devem ser armazenados de forma criptografada.

---

## 3. Regras de Negócio (RN)

* **RN01:** Apenas postos de combustível cadastrados como "parceiros" podem publicar cupons de desconto.
* **RN02:** Um usuário deve estar logado para publicar uma avaliação, um comentário ou atualizar um preço.
* **RN03:** Cada usuário pode submeter apenas uma avaliação por posto a cada 24 horas para evitar spam.
* **RN04:** O algoritmo de recomendação do chatbot deve ponderar as variáveis preço, distância e avaliação, não se baseando apenas no menor valor.
* **RN05:** Uma atualização de preço enviada por um usuário através da funcionalidade de foto deve ser processada pela IA antes de ser publicada para a comunidade.
* **RN06:** Os administradores da plataforma devem ter a capacidade de moderar e remover comentários ou avaliações que violem os termos de serviço.

---
