**Caso de Uso:** Recuperar Senha

**Ator primário:** Usuário (Motorista, Proprietário de Posto, Administrador)

**Meta no contexto:** Permitir que um usuário que esqueceu sua senha possa redefini-la de forma segura e recuperar o acesso à sua conta.

**Pré-condições:**
1. O usuário deve possuir uma conta válida no sistema.
2. O usuário deve ter acesso à conta de e-mail que foi utilizada no cadastro.

**Pós-condições:**
1. A senha anterior do usuário é invalidada permanentemente.
2. Uma nova senha, definida pelo usuário, é registrada e ativada no sistema.
3. O usuário pode utilizar a nova senha para realizar login (UC02).

**Disparador:** O usuário clica na opção "Esqueci minha senha" (ou similar) na tela de login (UC02).

**Cenário:**
1. O usuário clica na opção "Esqueci minha senha" na tela de login.
2. O sistema exibe um campo solicitando o e-mail cadastrado.
3. O usuário insere seu e-mail e clica no botão "Enviar".
4. O sistema verifica se o e-mail fornecido existe na base de dados.
5. O sistema gera um token de redefinição de senha (com tempo de expiração definido, ex: 1 hora).
6. O sistema envia um e-mail para o endereço do usuário contendo um link único para a página de redefinição de senha.
7. O usuário abre seu aplicativo de e-mail e clica no link recebido.
8. O sistema abre uma nova tela no aplicativo (ou navegador) solicitando "Nova Senha" e "Confirmação da Nova Senha".
9. O usuário insere a nova senha nos dois campos, atendendo aos requisitos de segurança.
10. O usuário clica no botão "Salvar" (ou "Redefinir").
11. O sistema valida o token (se é válido e não expirou), verifica se as duas senhas inseridas coincidem e se atendem aos requisitos.
12. O sistema atualiza a senha do usuário no banco de dados e invalida o token de redefinição.
13. O sistema exibe a mensagem "Senha redefinida com sucesso!" e redireciona o usuário para a tela de login (UC02).

**Exceções:**
1. **E-mail não cadastrado:** Se o e-mail inserido no passo 3 não for encontrado no sistema, o sistema deve exibir uma mensagem genérica por segurança (ex: "Se este e-mail estiver cadastrado, você receberá um link para redefinir sua senha.") para não confirmar quais e-mails existem ou não na base.
2. **Link/Token expirado:** Se o usuário clicar no link (passo 7) após o tempo de validade do token, o sistema deve informar "Link expirado. Por favor, solicite a redefinição novamente."
3. **Link/Token inválido:** Se o token for malformado ou já tiver sido utilizado, o sistema informa "Link inválido." e sugere que o processo seja reiniciado.
4. **Senhas não coincidem:** Se as senhas inseridas no passo 9 não forem idênticas, o sistema exibe a mensagem "As senhas não coincidem." e solicita a correção.
5. **Senha fora do padrão:** Se a nova senha não atender aos requisitos mínimos de segurança (ex: 8 caracteres, 1 número), o sistema deve informar a regra que não foi atendida.

**Prioridade:** Essencial.

**Quando disponível:** Primeira versão.

**Frequência de uso:** Ocasionalmente (apenas quando o usuário esquece a senha).

**Canal com o ator:** Interface do aplicativo móvel e E-mail do usuário.

**Atores secundários:** Servidor de E-mail, Servidor de Autenticação.

**Canais com atores secundários:** Rede (API segura HTTPS), SMTP (ou API de serviço de e-mail).

**Questões em aberto:**
* Qual será o tempo de validade do token de redefinição (ex: 60 minutos, 24 horas)?
* Quais são os requisitos exatos para a nova senha (comprimento, caracteres especiais, etc.)?
* O fluxo de recuperação será por e-mail (como descrito) ou usará um código OTP (One-Time Password) via SMS?