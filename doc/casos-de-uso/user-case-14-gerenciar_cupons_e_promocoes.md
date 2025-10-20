**Caso de Uso:** Gerenciar Cupons e Promoções

**Ator primário:** Proprietário de Posto (ou Gerente)

**Meta no contexto:** Permitir que o proprietário do posto (parceiro) crie, publique, monitore o desempenho e desative ofertas, cupons de desconto e promoções exclusivas para atrair e fidelizar motoristas.

**Pré-condições:**

1. O usuário deve ser um Proprietário de Posto com uma conta de parceiro "Aprovada" (RN01, pós-UC05 e UC12).
2. O usuário deve estar autenticado (logado) no painel de gerenciamento de parceiros (UC02).

**Pós-condições:**

1. (Ao criar) Um novo cupom é registrado no banco de dados e fica disponível para os motoristas no aplicativo (iniciando o UC10).
2. (Ao desativar/expirar) O cupom não fica mais visível ou disponível para resgate pelos motoristas.
3. (Ao monitorar) O proprietário visualiza as métricas de uso do cupom (ex: quantos foram resgatados).

**Disparador:** O proprietário de posto decide criar uma nova campanha de marketing ou gerenciar suas ofertas ativas e acessa a seção "Meus Cupons" em seu painel.

**Cenário (Fluxo Principal - Criação de Novo Cupom):**

1. O proprietário de posto realiza login (UC02) em seu painel de parceiro.
2. O proprietário navega até a seção "Cupons" ou "Promoções".
3. O proprietário clica no botão "Criar Novo Cupom".
4. O sistema apresenta um formulário de criação de cupom.
5. O proprietário preenche os detalhes da promoção:
    * Título (ex: "Desconto Gasolina Aditivada").
    * Tipo de benefício (ex: R$ 0,10/litro, 5% de desconto no total, Lavagem grátis).
    * Regras e condições (ex: "Válido apenas para pagamentos em dinheiro", "Acima de 30 litros").
    * Data de Início e Data de Expiração da oferta.
    * Limite de uso (ex: "100 primeiros clientes" ou "Um por usuário").
6. O proprietário revisa os detalhes e clica em "Publicar".
7. O sistema valida todos os campos obrigatórios (ex: data de expiração deve ser após a data de início).
8. O sistema salva o novo cupom no banco de dados com o status "Ativo".
9. O sistema exibe a mensagem "Cupom publicado com sucesso!".
10. O novo cupom aparece imediatamente no aplicativo para os motoristas (na tela do posto - UC08).

**Exceções:**

1. **Dados Inválidos:** Se os dados inseridos no formulário (passo 5) forem inválidos (ex: data de expiração no passado), o sistema exibe uma mensagem de erro no campo específico e impede a publicação (passo 7).
2. **Falha de Comunicação:** Se o sistema não conseguir salvar o cupom no servidor (passo 8), exibe a mensagem "Erro ao salvar o cupom. Verifique sua conexão e tente novamente."
3. **Limite de Cupons Ativos:** Se o parceiro tiver um limite de (ex: 3) cupons ativos simultaneamente e tentar criar um quarto, o sistema pode bloquear e informar "Você atingiu o limite de cupons ativos."

**Variantes (Outros Cenários):**

* **Desativar Cupom:** O proprietário seleciona um cupom "Ativo" na lista e clica em "Desativar" (ou "Pausar"). O sistema confirma e oculta o cupom do app para novos resgates.
* **Monitorar Cupom:** O proprietário clica em um cupom (ativo ou expirado) para ver estatísticas de desempenho, como "Total de resgates" (provenientes do UC10) e "Visualizações".

**Prioridade:** Alta (Fundamental para o modelo de negócio com parceiros).

**Quando disponível:** Primeira versão (juntamente com o ecossistema de parceiros).

**Frequência de uso:** Moderada (Ex: mensalmente, para criar novas campanhas).

**Canal com o ator:** Painel de Administração de Parceiros (Web ou App).

**Atores secundários:** Motorista (que irá consumir o cupom), Banco de Dados.

**Canais com atores secundários:** Rede (API segura HTTPS), Interface do aplicativo móvel (onde o cupom é exibido).

**Questões em aberto:**

* Haverá um fluxo de aprovação pelo Administrador (UC12) para cada cupom criado, ou o parceiro tem autonomia total?
* Quais serão os tipos exatos de descontos/benefícios permitidos (R$, %, R$/L, Brinde)?
* A plataforma cobrará do parceiro por cupom publicado ou por cupom resgatado?