**Caso de Uso:** Consultar Ranking de Preços

**Ator primário:** Motorista

**Meta no contexto:** Permitir que o motorista visualize uma lista de postos de combustível, ordenados do mais barato para o mais caro, facilitando a decisão de onde abastecer para economizar.

**Pré-condições:**

1. O usuário está com o aplicativo aberto (logado ou não, a depender da regra de negócio).
2. O sistema tem permissão e acesso à localização (GPS) do usuário ou a uma área de pesquisa definida por ele.
3. Existem dados de preços de postos de combustível na base de dados para a região consultada.

**Pós-condições:**

1. O sistema exibe ao motorista uma lista de postos ordenada por preço.
2. O motorista pode tomar uma decisão informada sobre onde abastecer.

**Disparador:** O motorista seleciona a opção "Ver Ranking", "Mais Baratos" ou uma aba similar na interface do aplicativo.

**Cenário:**

1. O motorista aciona a funcionalidade de "Ranking de Preços".
2. O sistema (opcionalmente) solicita que o motorista selecione o tipo de combustível desejado (ex: Gasolina Comum, Etanol, Diesel S10).
3. O sistema utiliza a geolocalização do usuário para definir um raio de busca (ex: 10km).
4. O sistema consulta o banco de dados e busca os preços mais recentes para o combustível selecionado dentro do raio de busca.
5. O sistema exibe uma lista de postos, ordenada do menor preço para o maior.
6. Para cada item na lista, o sistema exibe o nome do posto, o preço do combustível, a distância até o usuário e a data/hora da última atualização do preço.
7. O motorista analisa a lista.
8. O motorista (opcionalmente) clica em um item da lista para ver detalhes (iniciando o UC07) ou iniciar a navegação.

**Exceções:**

1. **Localização desativada:** Se o GPS estiver desligado ou sem permissão, o sistema solicita que o usuário ative a localização ou, alternativamente, digite um endereço ou CEP para a pesquisa.
2. **Nenhum posto encontrado:** Se não houver postos cadastrados ou dados de preços na área de busca, o sistema exibe a mensagem "Nenhum preço encontrado para sua região."
3. **Falha de comunicação:** Se o aplicativo não conseguir se conectar ao servidor, o sistema exibe a mensagem "Erro de conexão. Verifique sua internet." e (opcionalmente) oferece um botão para "Tentar Novamente".
4. **Preços desatualizados:** Se os preços de um posto estiverem significativamente desatualizados (ex