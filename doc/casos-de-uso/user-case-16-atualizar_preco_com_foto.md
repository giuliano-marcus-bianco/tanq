**Caso de Uso:** Atualizar Preço com Foto

**Ator primário:** Motorista (Usuário Colaborador)

**Meta no contexto:** Permitir que o motorista colabore com a comunidade atualizando os preços de um posto de combustível de forma "mágica" e instantânea, usando a câmera do celular e a geolocalização.

**Pré-condições:**

1. O usuário deve estar autenticado (logado) no sistema (RN02).
2. O sistema deve ter permissão de acesso à Câmera do dispositivo.
3. O sistema deve ter permissão de acesso à Geolocalização (GPS) precisa.
4. O usuário está fisicamente no local do posto de combustível que deseja atualizar.

**Pós-condições:**

1. Os novos preços do posto, extraídos da foto pela IA, são salvos no banco de dados.
2. Os novos preços são atualizados e exibidos para outros usuários no Mapa (UC09) e no Ranking (UC06).
3. A "data/hora da última atualização" dos preços daquele posto é renovada.

**Disparador:** O motorista está em um posto, vê a placa de preços e decide colaborar clicando no botão "Atualizar Preços" ou "Enviar Foto".

**Cenário:**

1. O motorista (logado) clica no botão para "Atualizar Preço com Foto".
2. O sistema ativa e obtém a geolocalização precisa (GPS) do usuário.
3. O sistema identifica automaticamente o posto de combustível mais próximo da localização do usuário ("o app já sabe em qual posto você está").
4. O sistema (opcionalmente) exibe o nome do posto identificado (ex: "Atualizando preços do Posto Y?") e o usuário confirma.
5. O sistema abre a interface da câmera.
6. O usuário enquadra e tira uma foto da placa de preços do posto.
7. O usuário confirma o uso da foto (ou opta por tirar outra).
8. O aplicativo envia a foto e o ID do posto identificado para o servidor.
9. O sistema de IA no servidor processa a imagem usando Leitura de Imagem (OCR) e LLM para identificar e extrair os valores dos combustíveis.
10. O sistema salva os novos preços no banco de dados, associados ao posto.
11. O sistema exibe a mensagem "Preços atualizados com sucesso! Muito obrigado por sua colaboração!".

**Exceções:**

1. **Localização imprecisa/Sem permissão:** Se o GPS (passo 2) estiver desativado ou não identificar um posto com precisão, o sistema exibe "Não foi possível identificar o posto. Aproxime-se ou ative sua localização."
2. **Câmera sem permissão:** Se a permissão da câmera (pré-condição 2) for negada, o sistema solicita ao usuário que a ative nas configurações do dispositivo.
3. **Falha no OCR/IA (Foto Ruim):** Se a IA (passo 9) não conseguir extrair os valores (foto escura, embaçada, ângulo ruim), o sistema exibe "Não conseguimos ler os preços. Por favor, tente tirar uma foto mais nítida e de frente para a placa."
4. **Falha de comunicação:** Se o aplicativo não conseguir enviar a foto (passo 8), o sistema informa "Erro de conexão. Tentando novamente..." ou solicita que o usuário tente mais tarde.
5. **Usuário não logado:** Se o usuário tentar iniciar o fluxo (passo 1) sem estar logado, o sistema o redireciona para o Login (UC02), conforme RN02.

**Prioridade:** Essencial (É o principal diferencial de IA e o motor de colaboração do app).

**Quando disponível:** Primeira versão (mencionada como "Funcionalidade Principal").

**Frequência de uso:** Alta (Principal método de entrada de dados da comunidade).

**Canal com o ator:** Interface do aplicativo móvel (Câmera).

**Atores secundários:** Sistema de Geolocalização (GPS), Motor de IA (OCR/LLM), Banco de Dados de Preços.

**Canais com atores secundários:** API de localização do dispositivo, Rede (API segura HTTPS).

**Questões em aberto:**

* O sistema pedirá ao usuário para confirmar os preços lidos pela IA (passo 10 do cenário) antes de salvar, ou a IA publicará automaticamente (confiando no georreferenciamento)?
* Como o sistema lidará com diferentes layouts de placas de preço? O LLM será suficiente para interpretar (ex: "Gas. Adit.")?
* Haverá um sistema de recompensa (gamificação) para usuários que mais atualizam preços?