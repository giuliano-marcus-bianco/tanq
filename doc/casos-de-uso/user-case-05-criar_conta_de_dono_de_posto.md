**Caso de Uso:** Criar Conta de Dono de Posto

**Ator primário:** Proprietário de Posto (ou Gerente)

**Meta no contexto:** Permitir que o dono de um posto de combustível cadastre seu estabelecimento e crie uma conta de parceiro para gerenciar informações, cupons e promoções.

**Pré-condições:**

1. O proprietário de posto não possui uma conta de parceiro ativa.
2. O CNPJ do estabelecimento não está cadastrado em outra conta.
3. O usuário está na tela de "Seja um Parceiro" ou "Cadastrar meu Posto".

**Pós-condições:**

1. Uma nova solicitação de conta de parceiro é criada no sistema com o status "Pendente de Aprovação".
2. Os Administradores da Plataforma (UC11) são notificados para revisar a solicitação.
3. (Após aprovação manual) A conta do proprietário é ativada, e o posto torna-se visível como "Parceiro".

**Disparador:** O usuário (proprietário de posto) seleciona a opção "Quero ser parceiro" ou "Cadastrar meu posto" no aplicativo ou site.

**Cenário:**

1. O usuário seleciona a opção para se tornar um parceiro.
2. O sistema apresenta um formulário de cadastro de parceiro.
3. O usuário preenche os dados do responsável (Nome, E-mail, Telefone, Senha).
4. O usuário preenche os dados do estabelecimento (Razão Social, Nome Fantasia, CNPJ, Endereço completo).
5. O usuário (opcionalmente) anexa documentos de comprovação (ex: Contrato Social).
6. O usuário lê e aceita os "Termos e Condições de Parceria".
7. O usuário clica no botão "Enviar para Análise" (ou "Solicitar Cadastro").
8. O sistema valida o formato dos dados (ex: CNPJ válido, e-mail único).
9. O sistema cria a conta no banco de dados com o status "Pendente de Aprovação".
10. O sistema notifica a equipe de Administradores (UC11) sobre a nova solicitação.
11. O sistema exibe a mensagem "Solicitação enviada com sucesso! Entraremos em contato após a análise."

**Exceções:**

1. **CNPJ ou E-mail já cadastrado:** Se o CNPJ ou o e-mail do responsável já estiverem em uso, o sistema exibe a mensagem "Dados já cadastrados. Entre em contato com o suporte."
2. **Dados inválidos:** Se o CNPJ tiver um formato inválido ou o endereço não for encontrado, o sistema solicita a correção dos campos.
3. **Termos não aceitos:** Se os "Termos e Condições de Parceria" não forem aceitos, o sistema impede o envio e sinaliza a obrigatoriedade.
4. **Falha de comunicação:** Em caso de erro de rede, o sistema informa a falha e permite que o usuário tente enviar novamente sem perder os dados preenchidos.

**Prioridade:** Alta (Fundamental para o modelo de negócio de cupons).

**Quando disponível:** Primeira versão (V1).

**Frequência de uso:** Baixa (Apenas uma vez por proprietário/posto).

**Canal com o ator:** Interface do aplicativo móvel ou (provavelmente) um Portal Web de Parceiros.

**Atores secundários:** Administrador da Plataforma (para aprovação).

**Canais com atores secundários:** Painel de Administração, E-mail (para notificação de nova solicitação).

**Questões em aberto:**

* A validação do CNPJ será feita em tempo real via API da Receita Federal?
* O cadastro será feito pelo app de motorista ou haverá um app/portal separado para parceiros?
* Quais documentos serão estritamente obrigatórios para a aprovação (UC11)?
