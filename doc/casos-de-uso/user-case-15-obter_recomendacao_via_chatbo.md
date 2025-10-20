**Caso de Uso:** Obter Recomendação via Chatbot

**Ator primário:** Motorista

**Meta no contexto:** Permitir que o motorista receba uma recomendação inteligente de onde abastecer, baseada em uma combinação de fatores (preço, distância, avaliações), e entenda o motivo (o "porquê") dessa recomendação.

**Pré-condições:**

1. O usuário está com o aplicativo aberto.
2. O sistema tem permissão e acesso à localização (GPS) do usuário para calcular a distância.
3. Existem dados de postos (preços, avaliações) na região do usuário.

**Pós-condições:**

1. O chatbot exibe ao usuário uma ou mais recomendações de postos de combustível.
2. O chatbot exibe uma justificativa textual explicando por que aquela recomendação é a ideal (considerando preço, distância e avaliação).

**Disparador:** O usuário clica no ícone do "Assistente Inteligente (Chatbot)" e inicia uma interação solicitando ajuda.

**Cenário:**

1. O usuário toca no ícone do Chatbot na interface do aplicativo.
2. O sistema abre a interface de chat.
3. O usuário digita uma pergunta (ex: "Onde é melhor abastecer com etanol agora?") ou clica em um botão de "Recomendação Rápida".
4. O sistema (Chatbot) identifica a intenção de busca por recomendação.
5. O sistema consulta a localização atual do usuário (GPS).
6. O sistema consulta o banco de dados (preços, avaliações) e aplica o algoritmo de IA para ponderar a "combinação ideal de preço, distância e as melhores avaliações dos usuários".
7. O Chatbot apresenta a recomendação principal (ex: "Recomendo o Posto Y").
8. O Chatbot apresenta a justificativa (o "porquê"), conforme descrito no README (ex: "Embora o Posto X seja R$ 0,05 mais barato, o Posto Y está a 5km a menos e tem uma avaliação 4.9 estrelas.").
9. O usuário (opcionalmente) clica na recomendação para ver mais detalhes (UC08) ou iniciar a navegação.

**Exceções:**

1. **Localização desativada:** Se o GPS estiver desligado ou sem permissão (passo 5), o chatbot solicitará que o usuário ative a localização ou informe um endereço de partida.
2. **Dados insuficientes:** Se não houver postos ou dados suficientes na região (passo 6), o chatbot informará: "Desculpe, ainda não tenho informações suficientes na sua região para dar uma boa recomendação."
3. **Intenção não compreendida:** Se o usuário digitar algo não relacionado (ex: "Qual a previsão do tempo?"), o chatbot responderá: "Desculpe, meu foco é ajudar você a encontrar as melhores opções de abastecimento."
4. **Falha na API da IA:** Se o motor de IA (LLM) falhar em processar a recomendação, o sistema exibe uma mensagem: "Erro ao processar sua solicitação. Tente novamente em alguns instantes."

**Prioridade:** Alta (É um diferencial chave de IA do projeto).

**Quando disponível:** Primeira versão (mencionada como "Funcionalidade Principal").

**Frequência de uso:** Moderada.

**Canal com o ator:** Interface do Chatbot (dentro do aplicativo móvel).

**Atores secundários:** Sistema de Geolocalização (GPS), Motor de IA (LLM), Banco de Dados (Preços, Avaliações).

**Canais com atores secundários:** API de localização do dispositivo, Rede (API segura HTTPS).

**Questões em aberto:**

* O usuário poderá definir seus pesos de preferência (ex: "Priorizar preço acima de tudo")?
* Qual será o combustível padrão se o usuário apenas perguntar "Onde abastecer?"
* A conversa será aberta (baseada em LLM) ou guiada por botões? (O README sugere "converse").