**Caso de Uso:** Resgatar Cupom de Desconto

**Ator primário:** Motorista (Usuário Logado)

**Meta no contexto:** Permitir que o motorista utilize um cupom de desconto exclusivo de um posto parceiro para obter um benefício (desconto no combustível, brinde, etc.) no momento da compra.

**Pré-condições:**

1. O usuário deve estar autenticado (logado) no sistema.
2. O posto de combustível onde o usuário se encontra é um "Parceiro" (RN01) e oferece o cupom.
3. O cupom selecionado está ativo, dentro da data de validade e não foi esgotado.
4. O usuário ainda não utilizou este cupom (se for de uso único).

**Pós-condições:**

1. O cupom é registrado como "utilizado" no banco de dados e removido da lista de cupons disponíveis para aquele usuário.
2. O motorista recebe o benefício/desconto aplicado pelo estabelecimento.
3. O sistema contabiliza o uso do cupom para o posto parceiro.

**Disparador:** O motorista está em um posto parceiro e decide usar uma oferta disponível no aplicativo Tanq.

**Cenário:**

1. O motorista (logado) está no posto parceiro.
2. O motorista abre o aplicativo, navega até a tela do posto (UC08) ou sua carteira de cupons.
3. O motorista seleciona o cupom que deseja usar (ex: "R$ 0,10 de desconto por litro").
4. O motorista clica no botão "Resgatar Agora" ou "Usar Cupom".
5. O sistema solicita uma confirmação final ("Você está no posto e deseja usar este cupom? Esta ação não pode ser desfeita.").
6. O motorista confirma.
7. O sistema gera e exibe na tela um código de validação (ex: QR Code, código alfanumérico ou um temporizador visual).
8. O motorista apresenta a tela do celular ao frentista ou caixa do posto.
9. O funcionário do posto valida o cupom (seja visualmente, digitando o código em seu sistema, ou escaneando o QR Code).
10. O sistema (Tanq) recebe a confirmação (se houver integração) ou o cupom é invalidado após o temporizador expirar/ser confirmado.
11. O sistema exibe a mensagem "Cupom resgatado com sucesso!".
12. O motorista recebe o desconto em sua compra.

**Exceções:**

1. **Cupom expirado ou esgotado:** Ao tentar selecionar o cupom (passo 3), o sistema informa "Este cupom não está mais disponível (expirado ou limite atingido)."
2. **Cupom já utilizado:** Se o cupom for de uso único e o usuário já o utilizou, o sistema informa "Você já utilizou este cupom anteriormente."
3. **Falha de comunicação/Validação:** Se o aplicativo não conseguir se conectar ao servidor para validar o resgate (passo 7), ele exibe "Erro de conexão. Não foi possível resgatar o cupom. Verifique sua internet."
4. **Localização inválida:** Se o sistema exigir validação por GPS (geofencing) e o usuário não estiver no local do posto, ele pode exibir "Você precisa estar no posto parceiro para resgatar este cupom."
5. **Validação negada pelo posto:** Se o sistema do posto (ator secundário) rejeitar o código, o cupom não é invalidado e o usuário é informado "Posto não validou o cupom. Verifique com o frentista."

**Prioridade:** Alta (Fundamental para o modelo de negócio com parceiros).

**Quando disponível:** Primeira versão (V1).

**Frequência de uso:** Moderada (Depende das ofertas disponíveis e da frequência de abastecimento do usuário).

**Canal com o ator:** Interface do aplicativo móvel.

**Atores secundários:** Sistema de Ponto de Venda (PDV) do Posto (ou funcionário do posto) e Banco de Dados de Cupons.

**Canais com atores secundários:** Rede (API segura HTTPS) para integração com PDV, ou validação visual/manual pelo funcionário.

**Questões em aberto:**

* A validação do cupom (passo 9) será integrada com o sistema do posto (via API), por leitura de QR Code, ou será apenas visual/manual (confiando no frentista)?
* O resgate exigirá que o usuário esteja fisicamente no posto (validado por GPS)?
* Os cupons serão de uso único por usuário ou de uso diário/semanal?
* Haverá um temporizador (ex: 10 minutos) após o usuário clicar em "Resgatar" para que o código expire, evitando resgate acidental?