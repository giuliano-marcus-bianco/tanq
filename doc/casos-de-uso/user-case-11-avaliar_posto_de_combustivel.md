**Caso de Uso:** Avaliar Posto de Combustível

**Ator primário:** Motorista (Usuário Logado)

**Meta no contexto:** Permitir que o motorista compartilhe sua experiência (atribuindo uma nota e um comentário) sobre um posto, ajudando outros membros da comunidade a tomar decisões e fornecendo feedback ao estabelecimento.

**Pré-condições:**

1. O usuário deve estar autenticado (logado) no sistema (RN02).
2. O usuário deve ter selecionado um posto (ex: estar na tela de "Detalhes do Posto" - UC08).

**Pós-condições:**

1. A avaliação (nota e comentário) é salva no banco de dados, associada ao motorista e ao posto.
2. A avaliação fica pendente de moderação (se aplicável, ver UC12) ou é publicada.
3. A nota média do posto é recalculada e atualizada para todos os usuários.

**Disparador:** O motorista clica no botão "Avaliar" ou "Escrever Avaliação" na tela de detalhes de um posto (UC08), ou através de um *prompt* após uma visita.

**Cenário:**

1. O usuário (logado) acessa a tela de detalhes de um posto (UC08).
2. O usuário clica no botão "Avaliar este Posto".
3. O sistema exibe a interface de avaliação, solicitando uma nota (ex: de 1 a 5 estrelas).
4. O usuário seleciona a nota desejada (ex: 4 estrelas).
5. O sistema exibe um campo de texto para o comentário.
6. O usuário escreve seu comentário sobre a experiência (ex: qualidade do combustível, atendimento, limpeza).
7. O usuário clica no botão "Publicar Avaliação".
8. O sistema valida os dados (ex: nota mínima obrigatória).
9. O sistema salva a avaliação no banco de dados e (se aplicável) a envia para moderação (UC12).
10. O sistema exibe a mensagem "Obrigado pela sua avaliação!".
11. O sistema recalcula a nota média do posto.

**Exceções:**

1. **Usuário não logado:** Se um usuário não logado tentar avaliar (passo 2), o sistema deve primeiro direcioná-lo para a tela de login (UC02) e, após o sucesso, retornar ao fluxo de avaliação.
2. **Tentativa de avaliação repetida:** Se o usuário tentar avaliar o mesmo posto múltiplas vezes em um curto período (ex: infringindo a RN03 - limite de 24h), o sistema exibe a mensagem "Você já avaliou este posto recentemente. Tente novamente mais tarde."
3. **Falha de comunicação:** Se o aplicativo não conseguir se conectar ao servidor para salvar a avaliação (passo 9), o sistema exibe a mensagem "Erro ao enviar sua avaliação. Verifique sua conexão e tente novamente."
4. **Conteúdo impróprio (Moderação):** Se o comentário (passo 6) contiver linguagem ofensiva detectada automaticamente, o sistema pode bloquear a publicação e informar o usuário ou enviá-la para revisão manual prioritária (UC12).

**Prioridade:** Essencial (descrita como "Funcionalidade Principal").

**Quando disponível:** Primeira versão.

**Frequência de uso:** Moderada (Ocasionalmente, após o usuário abastecer).

**Canal com o ator:** Interface do aplicativo móvel.

**Atores secundários:** Banco de Dados de Avaliações, Administrador da Plataforma (para moderação).

**Canais com atores secundários:** Rede (API segura HTTPS), Painel de Moderação.

**Questões em aberto:**

* A avaliação será anônima (mostrando "Usuário Anônimo") ou exibirá o nome do motorista?
* Haverá critérios de avaliação separados (ex: Preço, Atendimento, Limpeza) ou apenas uma nota geral?
* O usuário poderá editar ou excluir uma avaliação após publicá-la?
* Qual será a regra de negócio para o limite de avaliações (RN03)? Uma por dia? Uma por visita?