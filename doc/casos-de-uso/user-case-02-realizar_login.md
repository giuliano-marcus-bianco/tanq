**Caso de Uso:** Realizar Login

**Ator primário:** Usuário (Motorista, Proprietário de Posto, Administrador)

**Meta no contexto:** Permitir que um usuário com conta existente acesse o sistema de forma segura, obtendo autorização para usar as funcionalidades restritas ao seu perfil.

**Pré-condições:**
1. O usuário deve possuir uma conta válida (criada anteriormente, ex: UC04).
2. O usuário deve estar em um estado não autenticado (ex: na tela de login).

**Pós-condições:**
1. O sistema valida as credenciais do usuário.
2. O sistema estabelece uma sessão segura (ex: gera um token de acesso).
3. O usuário é redirecionado para a tela principal do aplicativo (dashboard, mapa, etc.) de acordo com seu perfil.

**Disparador:** O usuário abre o aplicativo sem uma sessão ativa ou após realizar logout (UC01).

**Cenário:**
1. O usuário é apresentado à tela de login.
2. O usuário insere seu identificador (ex: e-mail ou nome de usuário).
3. O usuário insere sua senha.
4. O usuário clica no botão "Entrar" (ou "Login").
5. O sistema envia as credenciais para o servidor de autenticação.
6. O servidor de autenticação valida se as credenciais correspondem a uma conta existente e ativa.
7. O servidor gera um token de sessão e o retorna ao aplicativo.
8. O aplicativo armazena o token de sessão de forma segura no dispositivo.
9. O sistema redireciona o usuário para a tela inicial autenticada.

**Exceções:**
1. **Credenciais inválidas:** Se o e-mail ou a senha estiverem incorretos, o sistema exibe a mensagem "Usuário ou senha inválidos." e permite que o usuário tente novamente.
2. **Conta bloqueada/inativa:** Se a conta estiver bloqueada ou desativada, o sistema exibe a mensagem "Esta conta está temporariamente bloqueada" e sugere contato com o suporte ou recuperação de senha.
3. **Múltiplas tentativas falhas:** Após 5 tentativas de login com a senha errada, o sistema pode bloquear a conta temporariamente por (ex: 15 minutos) e sugerir o fluxo de "Recuperar Senha" (UC03).
4. **Falha de comunicação:** Se o aplicativo não conseguir se conectar ao servidor, o sistema exibe a mensagem "Erro de conexão. Verifique sua internet."

**Prioridade:** Essencial.

**Quando disponível:** Primeira versão.

**Frequência de uso:** Diariamente.

**Canal com o ator:** Interface do aplicativo móvel.

**Atores secundários:** Servidor de Autenticação.

**Canais com atores secundários:** Rede (API segura HTTPS).

**Questões em aberto:**
* Haverá opção de "Lembrar-me" ou "Manter conectado"?
* Haverá integração com logins sociais (Google, Facebook, Apple)?
* Qual será o tempo de expiração padrão da sessão?
---
