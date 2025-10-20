**Caso de Uso:** Visualizar Postos no Mapa

**Ator primário:** Motoristas e Condutores de Veículos

**Meta no contexto:** Permitir que o motorista visualize todos os postos de combustível ao seu redor em um mapa interativo, identificando suas localizações, preços e avaliações de forma intuitiva.

**Pré-condições:**

1. O usuário abriu o aplicativo.
2. O sistema tem permissão de acesso à geolocalização (GPS) do dispositivo.
3. O dispositivo possui conexão com a internet para carregar o mapa-base e os dados dos postos.

**Pós-condições:**

1. O sistema exibe um mapa centrado na localização atual do usuário.
2. O sistema exibe ícones (pins) no mapa, representando os postos de combustível na área visível.

**Disparador:** O usuário abre o aplicativo e acessa a tela principal do mapa (pode ser a tela de abertura padrão).

**Cenário:**

1. O usuário abre o aplicativo Tanq.
2. O sistema solicita (caso ainda não tenha) a permissão de acesso à localização (GPS).
3. O sistema obtém a localização atual do usuário via GPS.
4. O sistema carrega a interface do mapa interativo, centralizando-o na localização do usuário.
5. O sistema consulta o banco de dados buscando os postos de combustível dentro da área visível do mapa (viewport).
6. O sistema exibe ícones (pins) no mapa para cada posto de combustível encontrado.
7. O usuário (opcionalmente) move o mapa (arrasta) ou aplica zoom para explorar outras regiões.
8. Ao mover o mapa, o sistema atualiza a consulta e exibe os postos da nova área visível.
9. O usuário toca em um ícone de posto para visualizar um resumo rápido (ex: Nome, Preço, Avaliação) e obter a opção de ver detalhes (iniciando o UC08).

**Exceções:**

1. **Localização desativada/Sem permissão:** Se o GPS estiver desligado ou a permissão for negada, o sistema centraliza o mapa em uma localização padrão (ex: centro da cidade) e exibe um aviso, ou solicita que o usuário digite um endereço/CEP para pesquisa manual.
2. **Falha de comunicação (API do Mapa):** Se o serviço de mapa (ex: Google Maps) não puder ser carregado, o sistema exibe uma mensagem de erro "Não foi possível carregar o mapa."
3. **Falha de comunicação (Dados dos Postos):** Se o mapa carregar, mas os dados dos postos não puderem ser buscados, o sistema exibe o mapa sem ícones e uma mensagem de "Erro ao buscar postos. Tente novamente."
4. **Nenhum posto na área:** Se a consulta (passo 5) não retornar postos na área visível, o mapa é exibido sem ícones, e uma mensagem (ex: "Nenhum posto encontrado nesta região") pode ser exibida.

**Prioridade:** Essencial (descrita como "Funcionalidade Principal").

**Quando disponível:** Primeira versão.

**Frequência de uso:** Alta.

**Canal com o ator:** Interface do aplicativo móvel.

**Atores secundários:** Sistema de Geolocalização (GPS do dispositivo), API de Mapas, Banco de Dados de Postos.

**Canais com atores secundários:** API de localização do dispositivo, Rede (API segura HTTPS).

**Questões em aberto:**

* Os ícones dos postos terão cores diferentes (ex: para postos parceiros ou os mais baratos)?
* O mapa mostrará o tráfego em tempo real?
* Qual será o nível de zoom inicial padrão?
* Ao clicar no ícone (passo 9), o preço de qual combustível será exibido por padrão?