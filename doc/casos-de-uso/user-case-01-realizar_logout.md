**Caso de Uso:** Realizar Logout

**Ator primário:** Usuário Logado (Motorista, Proprietário de Posto ou Administrador)

**Meta no contexto:** Permitir que o usuário encerre sua sessão ativa de forma segura no aplicativo.

**Pré-condições:** O usuário deve estar com uma sessão autenticada (logado) no sistema.

**Pós-condições:** A sessão do usuário é invalidada, e o usuário é redirecionado para a tela de login ou tela inicial não autenticada.

**Disparador:** O usuário seleciona a opção "Sair" ou "Logout" na interface do aplicativo.

**Cenário:**
1. O usuário está navegando no aplicativo com uma sessão ativa.
2. O usuário acessa o menu de perfil ou configurações.
3. O usuário clica na opção "Sair".
4. O sistema solicita uma confirmação para o logout (Opcional, mas recomendado).
5. O usuário confirma a ação.
6. O sistema invalida o token de sessão do usuário no servidor.
7. O sistema remove os dados de sessão armazenados localmente no dispositivo.
8. O sistema redireciona o usuário para a tela de login.
9. O sistema exibe uma mensagem de confirmação (ex: "Logout realizado com sucesso").

**Exceções:**
1. **Falha de comunicação:** Se o dispositivo estiver offline ao tentar fazer logout, o sistema deve remover os dados da sessão localmente e redirecionar para a tela de login. A invalidação do token no servidor ocorrerá na próxima vez que o aplicativo se conectar à internet.
2. **Sessão já expirada:** Se a sessão do usuário já expirou no servidor quando ele tenta fazer logout, o sistema deve simplesmente limpar os dados locais e redirecioná-lo para a tela de login sem apresentar um erro.

**Prioridade:** Essencial.

**Quando disponível:** Primeira versão.

**Frequência de uso:** Diariamente.

**Canal com o ator:** Interface do aplicativo móvel.

**Atores secundários:** Nenhum.

**Canais com atores secundários:** Não se aplica.

**Questões em aberto:**
* Deve haver um prompt de confirmação ("Você tem certeza que deseja sair?") antes de efetuar o logout?