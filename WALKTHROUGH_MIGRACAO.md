# Walkthrough: FASE 1, 2 & 3 - Monorepo Nx + Core Logic + Mobile

## Resumo da Execução

O projeto Tanq foi migrado para uma **arquitetura Monorepo Nx** com:
- Biblioteca compartilhada `@tanq/core-logic`
- App Web React + Vite funcionando
- App Mobile React Native + Expo com telas completas

---

## Estrutura Final do Projeto

```
tanq/
├── apps/
│   ├── web-tanq/              ✅ Frontend React
│   │   ├── src/
│   │   ├── package.json
│   │   ├── project.json
│   │   ├── tsconfig.json
│   │   └── vite.config.js
│   └── mobile-tanq/           ✅ App React Native (Expo)
│       ├── app/
│       │   ├── _layout.tsx           (Root Layout + PaperProvider)
│       │   ├── index.tsx             (Welcome Screen)
│       │   ├── login.tsx             (Login integrado ao AuthContext)
│       │   ├── register.tsx          (Registro integrado ao AuthContext)
│       │   └── (tabs)/
│       │       ├── _layout.tsx       (Tab Navigator)
│       │       ├── index.tsx         (Home - FlatList de postos)
│       │       ├── map.tsx           (Mapa com react-native-maps)
│       │       └── profile.tsx       (Perfil do usuário)
│       ├── theme.ts                  (Tema Tanq - Verde/Amarelo)
│       ├── metro.config.js           (Config do bundler)
│       └── package.json
├── libs/
│   └── core-logic/            ✅ Biblioteca compartilhada
│       └── src/
│           ├── adapters/
│           │   ├── storage.ts        (Interface)
│           │   ├── storage.web.ts    (localStorage)
│           │   └── storage.native.ts (expo-secure-store)
│           ├── context/
│           │   └── AuthContext.tsx
│           ├── services/
│           │   ├── api.ts
│           │   └── environment.ts
│           ├── types/
│           │   └── index.ts
│           ├── index.ts              (entry Web)
│           └── index.native.ts       (entry Mobile)
├── backend/                   ✅ Spring Boot (preservado)
├── nx.json
├── package.json
└── tsconfig.base.json
```

---

## FASE 3: Interface Mobile

### Tecnologias Utilizadas

| Pacote | Versão | Uso |
|--------|--------|-----|
| expo | ~52.0.0 | Framework React Native |
| expo-router | ~4.0.0 | Navegação file-based |
| react-native-paper | ^5.12.5 | UI Components Material Design |
| react-native-maps | 1.18.0 | Mapas nativos |
| expo-secure-store | ~14.0.0 | Storage seguro |

### Telas Implementadas

#### 1. Welcome Screen (`app/index.tsx`)
- Apresentação do app com features
- Redirecionamento automático se logado
- Botões para Login, Registro e Explorar

#### 2. Login (`app/login.tsx`)
- Formulário com email/senha
- Validações client-side
- Integração com `useAuth()` da core-logic
- Tratamento de erros do backend

#### 3. Register (`app/register.tsx`)
- Formulário completo com nome, email, senha
- Seleção de tipo (Motorista/Dono de Posto)
- SegmentedButtons para tipo
- Integração com `register()` da core-logic

#### 4. Home Tab (`app/(tabs)/index.tsx`)
- Searchbar para busca
- FlatList com RefreshControl
- Cards de postos com preços
- Chips coloridos por tipo de combustível
- FAB para login quando deslogado

#### 5. Map Tab (`app/(tabs)/map.tsx`)
- MapView com marcadores
- Cores por faixa de preço (verde/amarelo/vermelho)
- Legenda de cores
- Card do posto selecionado
- Callouts com informações

#### 6. Profile Tab (`app/(tabs)/profile.tsx`)
- Estado não logado com call-to-action
- Avatar com iniciais do nome
- Badge de tipo de usuário
- Menu com ações futuras
- Botão de logout

### Tema Tanq

```typescript
const tanqColors = {
  primary: '#2E7D32',      // Verde escuro
  primaryLight: '#4CAF50', // Verde claro
  secondary: '#FBC02D',    // Amarelo
  secondaryLight: '#FFEB3B', // Amarelo claro
};
```

### Configuração do Metro Bundler

O `metro.config.js` foi configurado para:
1. Resolver `@tanq/core-logic` da pasta libs
2. Priorizar arquivos `.native.ts` sobre `.ts`
3. Buscar módulos na raiz do monorepo

---

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npx nx serve @tanq/web-tanq` | Servidor web |
| `cd apps/mobile-tanq && npx expo start` | Servidor mobile |
| `npx nx test @tanq/web-tanq` | Testes web |
| `npx nx show projects` | Lista projetos |

---

## Próximos Passos

Para testar o app mobile:

```powershell
cd apps/mobile-tanq
npx expo start
```

Depois, escaneie o QR code com o app Expo Go no celular ou pressione `a` para Android Emulator / `i` para iOS Simulator.

> [!IMPORTANT]
> Certifique-se de que o backend Spring Boot está rodando em `localhost:8080` para que o login funcione.

---

## Validação Pendente

- [ ] Iniciar app no emulador
- [ ] Testar login com backend
- [ ] Verificar listagem de postos
- [ ] Verificar mapa com marcadores
- [ ] Capturar screenshots/vídeo
