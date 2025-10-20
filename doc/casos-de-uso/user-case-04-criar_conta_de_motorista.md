**Caso de Uso:** Criar Conta de Motorista

**Ator primário:** Novo Usuário (Motorista)

**Meta no contexto:** Permitir que um novo usuário (motorista) se registre na plataforma para poder utilizar as funcionalidades que exigem autenticação.

**Pré-condições:**

1. O usuário não possui uma conta existente com o e-mail que será utilizado.
2. O usuário está na tela de cadastro do aplicativo.

**Pós-condições:**

1. Um novo registro de usuário (motorista) é criado no banco de dados.
2. O usuário é redirecionado para a tela de login (UC02) para entrar (ou é autenticado automaticamente).

**Disparador:** O usuário seleciona a opção "Criar Conta" ou "Cadastrar-se" na tela de login ou na tela inicial.

**Cenário:**

1. O usuário clica na opção "Criar Conta".
2. O sistema apresenta um formulário de registro.
3. O usuário preenche os campos obrigatórios (ex: Nome, E-mail, Senha, Confirmação de Senha).
4. O usuário (opcionalmente) preenche campos não obrigatórios.
5. O usuário lê e aceita os "Termos de Uso" e "Política de Privacidade".
6. O usuário clica no botão "Cadastrar".
7. O sistema valida os dados:
    a. Verifica se o e-mail já está em uso.
    b. Verifica se as senhas coincidem.
    c. Verifica se a senha atende aos requisitos de segurança.
    d. Verifica se os Termos de Uso foram aceitos.
8. O sistema cria o novo registro de conta de motorista no banco de dados.
9. O sistema (opcionalmente) envia um e-mail de boas-vindas ou de verificação de conta.
10. O sistema exibe a mensagem "Conta criada com sucesso!".
11. O sistema redireciona o usuário para a tela de login (UC02).

**Exceções:**

1. **E-mail já cadastrado:** Se o e-mail fornecido no passo 3 já existir no sistema, o sistema exibe a mensagem "Este e-mail já está em uso. Tente fazer login ou recuperar sua senha."
2. **Senhas não coincidem:** Se a "Senha" e a "Confirmação de Senha" não forem idênticas, o sistema exibe a mensagem "As senhas não coincidem." e solicita a correção.
3. **Senha fora do padrão:** Se a senha não atender aos requisitos mínimos de segurança, o sistema informa as regras (ex: "A senha deve ter no mínimo 8 caracteres.").
4. **Termos não aceitos:** Se o usuário não marcar a aceitação dos Termos de Uso (passo 5), o sistema exibe a mensagem "Você deve aceitar os Termos de Uso para continuar."
5. **Falha de comunicação:** Se o aplicativo não conseguir se conectar ao servidor no passo 8, o sistema exibe a mensagem "Erro de conexão. Tente novamente mais tarde."

**Prioridade:** Essencial.

**Quando disponível:** Primeira versão.

**Frequência de uso:** Baixa (apenas uma vez por usuário).

**Canal com o ator:** Interface do aplicativo móvel.

**Atores secundários:** Servidor de Autenticação, Servidor de E-mail (opcional).

**Canais com atores secundários:** Rede (API segura HTTPS), SMTP (opcional).

**Questões em aberto:**
