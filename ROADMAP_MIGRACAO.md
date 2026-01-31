# Master Plan: Migração Tanq para Arquitetura Monorepo (Web + Mobile)

**Objetivo Estratégico:** Transformar o projeto atual (Web React + Spring Boot) em uma arquitetura de nível empresarial, focada em escalabilidade e compartilhamento de código entre plataformas (Web e Mobile Nativo), utilizando um Monorepo.

**Contexto para o Agente de IA:**
Você atuará como um Arquiteto de Software Sênior. Sua tarefa é refatorar a estrutura do frontend existente para um workspace **Nx (ou Turborepo)**, isolar a lógica de negócios em bibliotecas compartilhadas e implementar um novo aplicativo móvel utilizando **React Native (Expo)** que consuma essa mesma lógica. O Backend Spring Boot será mantido, mas deverá receber ajustes de configuração para suportar o ambiente móvel.

---

## FASE 1: Infraestrutura do Monorepo

**Objetivo:** Estabelecer a fundação do projeto onde múltiplos aplicativos (Apps) e bibliotecas (Libs) coexistam.

1.  **Inicialização do Workspace:**
    * Crie um novo workspace utilizando **Nx** na raiz do projeto (preservando a pasta `backend` como está, ou movendo-a para uma pasta `apps/api` se decidir integrar o Java ao monorepo, mas a prioridade é o ecossistema JS/TS).
    * Nome do workspace: `tanq-workspace`.
    * Preset: `apps` (vazio).

2.  **Migração do Frontend Existente:**
    * Mova todo o conteúdo da pasta `frontend/` atual para `apps/web-tanq`.
    * Ajuste os arquivos de configuração (`vite.config.js`, `package.json`) para que o aplicativo Web rode corretamente dentro da estrutura do Monorepo.
    * **Validação:** O comando `nx serve web-tanq` deve rodar o site exatamente como ele é hoje.

3.  **Criação do App Mobile:**
    * Gere um novo aplicativo React Native dentro do workspace: `apps/mobile-tanq`.
    * **Stack Obrigatória:** Utilize **Expo** (Managed Workflow) para facilitar o build e deploy.
    * Configuração de Navegação: Instale e configure o **Expo Router** (baseado em arquivos, similar ao Next.js) para gerenciar as rotas.

---

## FASE 2: Extração e Compartilhamento de Lógica ("The Brain")

**Objetivo:** Criar uma "Single Source of Truth" (Fonte Única da Verdade) para a lógica de negócios.

1.  **Criação da Shared Library:**
    * Gere uma biblioteca JS/TS chamada `libs/core-logic`.
    * Esta biblioteca **não deve conter** componentes visuais (JSX/TSX que renderizam HTML ou Views), apenas lógica pura.

2.  **Refatoração dos Serviços (API):**
    * Extraia o arquivo `frontend/src/services/api.js` para `libs/core-logic/src/services/api.js`.
    * **Adaptação de Ambiente:** Modifique a configuração do Axios. Implemente uma lógica que detecte o ambiente:
        * Se Web: `baseURL` = URL relativa ou `localhost`.
        * Se Mobile (detectar via `Platform.OS` do React Native ou variável de ambiente): `baseURL` = IP da máquina host (ex: `10.0.2.2` para Android Emulator) ou IP da LAN.
    * Exporte a instância da API da biblioteca.

3.  **Refatoração do Contexto de Autenticação (AuthContext):**
    * Extraia `frontend/src/contexts/AuthContext.jsx` para `libs/core-logic/src/context/AuthContext.tsx`.
    * **Desafio do Storage (Adapter Pattern):** O código atual usa `localStorage` (exclusivo da Web).
        * Crie uma interface de `StorageAdapter`.
        * Na Web, implemente usando `window.localStorage`.
        * No Mobile, implemente usando `Expo SecureStore` ou `AsyncStorage`.
        * Injete o adaptador correto no `AuthContext` dependendo de quem está consumindo a biblioteca.

4.  **Consumo na Web:**
    * Atualize o `apps/web-tanq` para importar `api` e `AuthContext` de `@tanq/core-logic` em vez de arquivos locais.
    * Remova os arquivos antigos da pasta `apps/web-tanq`.

---

## FASE 3: Implementação da Interface Mobile ("The Native Skin")

**Objetivo:** Construir uma UI nativa, performática e fluida, consumindo a lógica compartilhada.

1.  **Framework de UI:**
    * Instale uma biblioteca de componentes robusta no `apps/mobile-tanq`. Sugestão: **NativeBase** ou **React Native Paper**.
    * Configure o tema (cores, tipografia) para espelhar a identidade visual do Tanq (Verde/Amarelo/Escuro).

2.  **Implementação de Telas (Paridade de Funcionalidade):**
    * **Auth:** Recrie as telas de Login e Cadastro usando componentes nativos (`<View>`, `<TextInput>`, `<TouchableOpacity>`). Conecte ao `useAuth` da `libs/core-logic`.
    * **Home/Feed:** Crie a listagem de postos usando `<FlatList>` (muito mais performático que map em div).

3.  **Geolocalização e Mapas (O Diferencial):**
    * **NÃO** tente portar o Leaflet/OpenStreetMap da Web.
    * Instale `react-native-maps` no projeto mobile.
    * Implemente a tela `MapaPage` usando o Google Maps ou Apple Maps nativo.
    * A lógica de buscar os pontos (latitude/longitude) vem da `libs/core-logic`, mas a renderização usa `<Marker>` nativo.

---

## FASE 4: Integração com Backend Spring Boot

**Objetivo:** Garantir que o servidor Java aceite conexões do novo ecossistema.

1.  **Ajuste de Rede:**
    * No arquivo `backend/src/main/resources/application.properties`, garanta que o servidor não esteja travado em `localhost`. Configure `server.address=0.0.0.0` para aceitar conexões externas (do emulador/dispositivo físico).

2.  **Segurança (CORS & JWT):**
    * Atualize a classe de configuração `CorsConfig.java` para ser permissiva em ambiente de desenvolvimento (`allowedOrigins("*")` ou especificando os esquemas do Capacitor/Expo).
    * Verifique se o `AuthController.java` retorna o token JWT corretamente no corpo ou header, e garanta que o App Mobile capture e armazene esse token no `SecureStore` para sessões persistentes.

---

## FASE 5: Polimento e Qualidade (Portfólio Grade)

**Objetivo:** Elevar o nível do código para demonstração sênior.

1.  **Tipagem Estrita (TypeScript):**
    * Converta os arquivos `.js` e `.jsx` críticos para `.ts` e `.tsx` durante a migração. Defina interfaces para `Usuario`, `Posto`, `Avaliacao` na `libs/core-logic`.

2.  **Feedback Tátil e Animações:**
    * Adicione **Haptic Feedback** (vibração) ao interagir com botões importantes no mobile.
    * Use **Reanimated** para transições suaves entre lista e mapa.

3.  **Documentação:**
    * Atualize o `README.md` na raiz explicando a nova arquitetura Monorepo, como rodar o web (`nx serve web-tanq`) e o mobile (`nx start mobile-tanq`).

---

**Resumo da Entrega Esperada:**
Ao final desta execução, espero um repositório onde a lógica de negócios seja compartilhada, o site funcione como antes, e exista um aplicativo Android/iOS funcional, nativo e performático, ambos alimentados pelo mesmo backend Java.