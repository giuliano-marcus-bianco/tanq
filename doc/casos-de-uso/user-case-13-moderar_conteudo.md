**Caso de Uso:** Moderar Conteúdo

**Ator primário:** Administrador da Plataforma (ou Moderador)

**Meta no contexto:** Garantir que o conteúdo gerado pelo usuário (avaliações, comentários, fotos) esteja em conformidade com os Termos de Serviço da plataforma, removendo spam, conteúdo ofensivo ou inadequado.

**Pré-condições:**

1. O usuário (Administrador) deve estar autenticado (logado) no Painel de Administração (UC02).
2. Existem conteúdos gerados por usuários (ex: via UC11 - Avaliar Posto) que estão "Pendentes de Aprovação" ou que foram "Denunciados" por outros usuários.

**Pós-condições:**

1. (Se aprovado) O conteúdo é publicado ou mantido visível para todos os usuários.
2. (Se rejeitado) O conteúdo é removido da visão pública e/ou excluído do banco de dados.
3. O item sai da fila de moderação.

**Disparador:**

1. Um novo conteúdo (avaliação/comentário) é submetido por um Motorista (conclusão do UC11).
2. Um usuário (Motorista ou Proprietário) "denuncia" um conteúdo existente como impróprio.
3. O Administrador acessa proativamente a fila de moderação.

**Cenário (Fluxo Principal - Aprovação de Conteúdo):**

1. O Administrador realiza login (UC02) no Painel de Administração.
2. O Administrador navega até a seção "Fila de Moderação" ou "Conteúdo Pendente".
3. O sistema exibe o item de conteúdo mais antigo (ou mais denunciado) da fila.
4. O sistema exibe o conteúdo (ex: o comentário, a nota, o usuário que postou) e o contexto (ex: o posto que foi avaliado).
5. O Administrador analisa o conteúdo e verifica se ele viola alguma regra dos Termos de Serviço.
6. O Administrador determina que o conteúdo é apropriado e clica no botão "Aprovar" (ou "Manter").
7. O sistema torna o conteúdo visível publicamente (se estava pendente) e o remove da fila de moderação.
8. O sistema apresenta o próximo item da fila.

**Exceções:**

1. **Rejeição de Conteúdo:** No passo 6, o Administrador determina que o conteúdo é impróprio (spam, ofensa, etc.). Ele clica em "Rejeitar". O sistema oculta/exclui o conteúdo da plataforma e (opcionalmente) notifica o usuário que o postou.
2. **Edição de Conteúdo:** No passo 6, o Administrador vê que o comentário é útil, mas contém uma informação sensível (ex: número de telefone). O Administrador clica em "Editar", remove o trecho problemático, salva a alteração e aprova o comentário modificado.
3. **Suspensão de Usuário:** Se o Administrador identificar um usuário que posta repetidamente conteúdo inadequado, ele pode clicar em "Rejeitar e Suspender Usuário", bloqueando temporária ou permanentemente a conta do Motorista.
4. **Fila Vazia:** Se o Administrador acessar a fila (passo 2) e não houver itens pendentes, o sistema exibe a mensagem "Nenhum item para moderar."

**Prioridade:** Alta (Essencial para manter a qualidade e segurança da comunidade).

**Quando disponível:** Primeira versão (juntamente com o UC11 - Avaliar Posto).

**Frequência de uso:** Alta (Diariamente, pela equipe de administração).

**Canal com o ator:** Painel de Administração (Web ou App).

**Atores secundários:** Motorista (criador do conteúdo), Banco de Dados.

**Canais com atores secundários:** Rede (API segura HTTPS), E-mail (para notificações de rejeição).

**Questões em aberto:**

* Haverá um filtro automático (blacklist de palavras) que envia o conteúdo para moderação, ou todo conteúdo será moderado?
* O usuário (Motorista) será notificado quando seu comentário for rejeitado? Qual será a política de advertência?
* Os Administradores poderão apenas "Aprovar/Rejeitar" ou também "Editar" comentários?
* Quantas denúncias de usuários são necessárias para que um conteúdo já publicado volte para a fila de moderação?