**Caso de Uso:** Acompanhar Avaliações

**Ator primário:** Proprietário de Posto (ou Gerente)

**Meta no contexto:** Permitir que o proprietário do posto monitore a satisfação dos clientes visualizando as notas e os comentários deixados pelos motoristas sobre seu estabelecimento.

**Pré-condições:**

1. O usuário deve ser um Proprietário de Posto com uma conta de parceiro aprovada (pós-UC05 e UC11).
2. O usuário deve estar autenticado (logado) no painel de parceiros.

**Pós-condições:**

1. O proprietário visualiza o feedback dos clientes.
2. O proprietário pode identificar pontos fortes e fracos do seu serviço para tomar ações de melhoria.

**Disparador:** O proprietário de posto acessa a seção "Minhas Avaliações" ou "Feedback" em seu painel de gerenciamento.

**Cenário:**

1. O proprietário de posto realiza login (UC02) em seu painel de parceiro.
2. O proprietário navega até a seção "Avaliações".
3. O sistema consulta o banco de dados e busca todas as avaliações associadas ao posto daquele proprietário.
4. O sistema exibe a nota média geral do posto (ex: 4.2 estrelas).
5. O sistema exibe uma lista de avaliações individuais, ordenadas da mais recente para a mais antiga.
6. Cada item da lista contém a nota (ex: estrelas), o comentário do motorista e a data da avaliação.
7. O proprietário analisa as avaliações e comentários.
8. O proprietário (opcionalmente) filtra a lista de avaliações (ex: "Apenas positivas", "Apenas negativas", "Por período").
9. O proprietário (opcionalmente) responde a um comentário, se a funcionalidade estiver habilitada.

**Exceções:**

1. **Nenhuma avaliação:** Se o posto ainda não recebeu nenhuma avaliação, o sistema exibe a mensagem "Seu estabelecimento ainda não possui avaliações."
2. **Falha de comunicação:** Se o painel não conseguir carregar os dados do servidor, o sistema exibe a mensagem "Não foi possível carregar as avaliações. Verifique sua conexão."
3. **Avaliação sob moderação/removida:** Avaliações que foram removidas pelo Administrador (UC10) não são exibidas para o proprietário.

**Prioridade:** Média (Importante para o engajamento e retenção do parceiro).

**Quando disponível:** Primeira versão (V1).

**Frequência de uso:** Moderada (ex: Semanalmente).

**Canal com o ator:** Interface do Portal Web de Parceiros (ou aplicativo de parceiro).

**Atores secundários:** Banco de Dados de Avaliações.

**Canais com atores secundários:** Rede (API segura HTTPS).

**Questões em aberto:**

* Os proprietários poderão responder publicamente aos comentários?
* Haverá um dashboard com gráficos sobre a evolução das notas?
* O nome do motorista que avaliou será visível para o proprietário ou será anônimo?