**Caso de Uso:** Consultar Detalhes e Avaliações de um Posto

**Ator primário:** Motorista

**Meta no contexto:** Permitir que o motorista veja informações detalhadas de um posto específico (preços de todos os combustíveis, endereço, avaliações da comunidade) para tomar uma decisão informada se vale a pena ir até lá.

**Pré-condições:**

1. O usuário está visualizando o "Ranking de Preços" (UC06) ou o "Mapa Interativo".
2. O posto de combustível selecionado está cadastrado no sistema.

**Pós-condições:**

1. O sistema exibe ao motorista a tela de perfil completa do posto selecionado.
2. O motorista pode analisar os preços, comentários e nota geral do posto.

**Disparador:** O usuário seleciona um posto específico (toca no ícone do mapa ou no item da lista de ranking).

**Cenário:**

1. O usuário está na tela do "Ranking de Preços" (UC06) ou no "Mapa Interativo".
2. O usuário toca no nome ou ícone de um posto de combustível.
3. O sistema navega para a tela de "Detalhes do Posto".
4. O sistema exibe informações cadastrais do posto: Nome Fantasia, endereço completo, bandeira e (se disponível) horário de funcionamento e comodidades (ex: loja de conveniência, calibrador).
5. O sistema exibe a lista completa de preços dos combustíveis (Gasolina Comum, Aditivada, Etanol, Diesel, etc.) e a data da última atualização de cada preço.
6. O sistema exibe a nota média geral do posto (ex: 4.2 estrelas).
7. O sistema exibe uma lista de avaliações e comentários individuais deixados por outros motoristas (relacionado ao UC10), ordenados do mais recente para o mais antigo.
8. O usuário analisa as informações.
9. O usuário (opcionalmente) clica em um botão para "Iniciar Rota" (integrando com app de mapas) ou "Avaliar este Posto" (iniciando o UC10).

**Exceções:**

1. **Posto sem informações:** Se for um posto recém-cadastrado sem preços ou avaliações, o sistema exibe o perfil básico (nome, endereço) com mensagens como "Nenhum preço informado" ou "Seja o primeiro a avaliar".
2. **Falha de comunicação:** Se o aplicativo não conseguir carregar os detalhes do servidor, o sistema exibe uma mensagem de erro de conexão e um botão para "Tentar Novamente".

**Prioridade:** Essencial.

**Quando disponível:** Primeira versão.

**Frequência de uso:** Alta.

**Canal com o ator:** Interface do aplicativo móvel.

**Atores secundários:** Banco de Dados (de Postos, Preços e Avaliações).

**Canais com atores secundários:** Rede (API segura HTTPS).

**Questões em aberto:**

* Quais comodidades (serviços extras, ex: troca de óleo, calibrador) serão listadas?
* O usuário poderá ver fotos do posto (enviadas por usuários ou pelo proprietário)?
* Haverá um limite de quantas avaliações serão carregadas inicialmente (paginação)?