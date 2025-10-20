**Caso de Uso:** Gerenciar Contas de Parceiros

**Ator primário:** Administrador da Plataforma

**Meta no contexto:** Aprovar, rejeitar, suspender ou editar contas de parceiros (Proprietários de Posto) para garantir a integridade da plataforma, a veracidade dos dados e o cumprimento das regras de negócio.

**Pré-condições:**

1. O usuário deve estar autenticado (logado) como um Administrador (UC02).
2. Deve existir um painel de administração com permissões de gerenciamento.
3. Existem contas de parceiros no sistema, seja com status "Pendente", "Ativo" ou "Inativo" (criadas via UC05).

**Pós-condições:**

1. O status da conta do parceiro é atualizado no banco de dados (ex: de "Pendente" para "Aprovado").
2. (Se aprovado) O Proprietário do Posto ganha acesso às funcionalidades de parceiro (UC08, UC07).
3. (Se rejeitado/suspenso) O Proprietário do Posto é notificado e/ou tem seu acesso restrito.

**Disparador:**

1. Um novo Proprietário de Posto envia uma solicitação de cadastro (conclusão do UC05), gerando uma notificação.
2. O Administrador acessa proativamente o painel para auditar ou gerenciar parceiros.
3. Uma denúncia ou problema é reportado sobre um posto parceiro.

**Cenário (Fluxo Principal - Aprovação de Novo Parceiro):**

1. O Administrador recebe uma notificação de "Nova solicitação de parceria" (vinda do UC05).
2. O Administrador realiza login (UC02) no Painel de Administração.
3. O Administrador navega até a seção "Contas de Parceiros" ou "Solicitações Pendentes".
4. O Administrador seleciona a solicitação do "Posto X" com status "Pendente".
5. O Administrador revisa todos os dados e documentos enviados (CNPJ, Endereço, Contrato Social, etc.).
6. O Administrador (opcionalmente) realiza uma validação externa dos dados (ex: consulta de CNPJ na Receita Federal).
7. Após verificar a conformidade dos dados, o Administrador clica no botão "Aprovar".
8. O sistema pede uma confirmação final. O Administrador confirma.
9. O sistema atualiza o status da conta do "Posto X" para "Aprovado" no banco de dados.
10. O sistema envia um e-mail de boas-vindas ao Proprietário do Posto, informando que sua conta foi ativada.
11. O Proprietário do "Posto X" agora pode realizar login e acessar o painel de parceiro (UC08, UC07).

**Exceções:**

1. **Rejeição de Solicitação:** No passo 7, se o Administrador constatar que os dados são inválidos ou não cumprem os requisitos, ele clica em "Rejeitar". O sistema solicita um motivo (opcional ou obrigatório), registra a rejeição e notifica o solicitante por e-mail.
2. **Suspensão de Conta Ativa:** Um Administrador pode buscar uma conta "Aprovada" e clicar em "Suspender" (ex: por fraude em cupons). O sistema bloqueia o login do parceiro e oculta seus cupons do app (UC10) até que a suspensão seja revertida.
3. **Dados Incompletos:** Se a solicitação (passo 5) estiver com documentos faltantes, o Administrador pode (se o sistema permitir) movê-la para o status "Informações Pendentes" e notificar o solicitante.
4. **Acesso Não Autorizado:** Se um usuário que não é Administrador tentar acessar o painel de gerenciamento, o sistema deve bloquear o acesso e registrar a tentativa.

**Prioridade:** Essencial (Vital para a operação do modelo de negócio B2B).

**Quando disponível:** Primeira versão (Necessário para o ecossistema de parceiros funcionar).

**Frequência de uso:** Moderada (Diária ou semanal, conforme novas solicitações e manutenções).

**Canal com o ator:** Painel de Administração (provavelmente uma interface Web).

**Atores secundários:** Proprietário de Posto (é o objeto do gerenciamento e é notificado), Banco de Dados, Servidor de E-mail.

**Canais com atores secundários:** Rede (API segura HTTPS), SMTP (para notificações por e-mail).

**Questões em aberto:**

* Quais serão os níveis de permissão (ex: Administrador vs. Moderador)?
* O motivo da rejeição ou suspensão será um campo de texto livre ou opções pré-definidas?
* O Administrador poderá editar os dados cadastrais de um parceiro (ex: corrigir um endereço)?
* Existirá um fluxo automatizado de verificação de documentos ou será 100% manual?