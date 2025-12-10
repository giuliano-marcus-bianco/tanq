# 🛠️ Guia de Implementação Profissional - Projeto Tanq

> **Autor:** Consultoria de Desenvolvimento Sênior  
> **Data:** Dezembro de 2024  
> **Versão:** 1.0

---

## 📋 Sumário Executivo

Este documento apresenta as **recomendações técnicas** para a implementação do projeto **Tanq**, uma plataforma móvel colaborativa para monitoramento de preços de combustíveis. As escolhas tecnológicas foram feitas visando:

- **Escalabilidade** para milhares de usuários simultâneos
- **Manutenibilidade** para evolução contínua do sistema
- **Time-to-market** adequado para um projeto acadêmico
- **Boas práticas** da indústria de software

---

## 🏗️ Arquitetura Recomendada

### Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                        APLICATIVO MÓVEL                         │
│                    (React Native / Expo)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST API (HTTPS/JSON)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY / BACKEND                      │
│                    (Node.js + Express/NestJS)                   │
├─────────────────────────────────────────────────────────────────┤
│  Auth   │  Postos  │  Cupons  │  Avaliações  │  Chatbot/IA      │
└─────────────────────────────┬───────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
    ┌───────────┐      ┌───────────┐      ┌──────────────┐
    │ PostgreSQL│      │   Redis   │      │  OpenAI API  │
    │  (Dados)  │      │  (Cache)  │      │  (LLM/OCR)   │
    └───────────┘      └───────────┘      └──────────────┘
```

### Padrão de Arquitetura: Clean Architecture

Recomendo a **Clean Architecture** combinada com princípios **SOLID**, organizando o código em camadas:

1. **Domain Layer** - Entidades e regras de negócio
2. **Application Layer** - Casos de uso
3. **Infrastructure Layer** - Banco de dados, APIs externas
4. **Presentation Layer** - Controladores e DTOs

---

## 📱 Frontend Mobile

### Linguagem e Framework Recomendados

| Tecnologia | Justificativa |
|------------|---------------|
| **TypeScript** | Tipagem estática, menos bugs em runtime, melhor DX |
| **React Native** | Código único para iOS e Android, comunidade ativa |
| **Expo** | Acelera o desenvolvimento, facilita o build e deploy |

### Bibliotecas Essenciais

```json
{
  "dependencies": {
    "react-native": "^0.73.x",
    "expo": "^50.x",
    "expo-location": "^16.x",
    "expo-camera": "^14.x",
    "expo-image-picker": "^14.x",
    "react-native-maps": "^1.x",
    "@react-navigation/native": "^6.x",
    "@react-navigation/stack": "^6.x",
    "@tanstack/react-query": "^5.x",
    "axios": "^1.x",
    "zustand": "^4.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "nativewind": "^4.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "vitest": "^2.x",
    "@testing-library/react-native": "^12.x",
    "eslint": "^8.x",
    "prettier": "^3.x"
  }
}
```

### Justificativa das Escolhas

| Biblioteca | Função | Por que usar? |
|------------|--------|---------------|
| `expo-location` | Geolocalização | API simplificada para GPS do dispositivo |
| `expo-camera` | Captura de fotos | Necessário para RF12 (foto de preços) |
| `react-native-maps` | Mapa interativo | RF01/RF02 - Visualização de postos |
| `@tanstack/react-query` | Gerenciamento de estado servidor | Cache inteligente, invalidação automática |
| `zustand` | Estado global | Simples, performático, sem boilerplate |
| `react-hook-form` + `zod` | Formulários e validação | Performance e type-safety |
| `nativewind` | Estilização | TailwindCSS para React Native |

### Estrutura de Pastas Recomendada (Frontend)

```
src/
├── app/                    # Telas e navegação
│   ├── (auth)/            # Telas de autenticação
│   ├── (tabs)/            # Home, Mapa, Ranking, Perfil
│   └── posto/[id]/        # Detalhes do posto
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Botões, inputs, cards
│   └── features/         # Componentes específicos de features
├── hooks/                 # Custom hooks
├── services/              # Chamadas à API
├── stores/                # Estado global (Zustand)
├── types/                 # Interfaces TypeScript
└── utils/                 # Funções utilitárias
```

---

## 🖥️ Backend

### Opção 1: Node.js + NestJS (Recomendado)

| Tecnologia | Justificativa |
|------------|---------------|
| **TypeScript** | Mesma linguagem do frontend, consistência |
| **NestJS** | Framework enterprise-ready, estrutura opinada, boa documentação |
| **Prisma ORM** | Type-safe, migrations automáticas, excelente DX |

### Opção 2: Java + Spring Boot (Alternativa)

Se houver preferência por Java (mencionado no documento de arquitetura):

| Tecnologia | Justificativa |
|------------|---------------|
| **Java 21 (LTS)** | Versão estável com recursos modernos |
| **Spring Boot 3.x** | Framework maduro, vasta documentação |
| **Spring Data JPA** | Abstração de persistência |
| **Hibernate** | ORM robusto |

### Dependências do Backend (Node.js/NestJS)

```json
{
  "dependencies": {
    "@nestjs/common": "^10.x",
    "@nestjs/core": "^10.x",
    "@nestjs/platform-express": "^10.x",
    "@nestjs/jwt": "^10.x",
    "@nestjs/passport": "^10.x",
    "@prisma/client": "^5.x",
    "bcrypt": "^5.x",
    "class-validator": "^0.14.x",
    "class-transformer": "^0.5.x",
    "passport-jwt": "^4.x",
    "openai": "^4.x",
    "redis": "^4.x"
  },
  "devDependencies": {
    "prisma": "^5.x",
    "vite": "^5.x",
    "vitest": "^2.x",
    "@vitest/coverage-v8": "^2.x",
    "@nestjs/testing": "^10.x",
    "supertest": "^6.x",
    "eslint": "^8.x",
    "prettier": "^3.x"
  }
}
```

### Estrutura de Pastas Recomendada (Backend)

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   ├── guards/
│   │   └── strategies/
│   ├── posto/
│   ├── cupom/
│   ├── avaliacao/
│   ├── usuario/
│   └── ia/                 # Chatbot e OCR
├── common/
│   ├── filters/           # Exception filters
│   ├── interceptors/      # Logging, transformação
│   ├── decorators/        # Custom decorators
│   └── pipes/             # Validation pipes
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── config/
    └── configuration.ts
```

---

## 🗄️ Banco de Dados

### Recomendação: PostgreSQL

| Aspecto | Justificativa |
|---------|---------------|
| **Tipo** | Relacional (SQL) |
| **Escolha** | PostgreSQL 16 |
| **Extensão** | PostGIS (para dados geoespaciais) |

### Por que PostgreSQL + PostGIS?

1. **Consultas geoespaciais nativas** - Essencial para RF01/RF02 (postos no mapa)
2. **JSONB** - Flexibilidade para dados semi-estruturados
3. **Performance** - Índices GiST para coordenadas
4. **Gratuito e open-source**

### Schema Sugerido (Prisma)

```prisma
model Usuario {
  id            String      @id @default(uuid())
  email         String      @unique
  senha         String
  nome          String
  tipo          TipoUsuario
  criadoEm      DateTime    @default(now())
  atualizadoEm  DateTime    @updatedAt
  
  avaliacoes    Avaliacao[]
  cuponsUsados  CupomUsuario[]
  posto         Posto?
}

model Posto {
  id            String    @id @default(uuid())
  nome          String
  endereco      String
  latitude      Float
  longitude     Float
  parceiro      Boolean   @default(false)
  donoConta     Usuario   @relation(fields: [donoId], references: [id])
  donoId        String    @unique
  
  precos        Preco[]
  avaliacoes    Avaliacao[]
  cupons        Cupom[]
}

model Preco {
  id              String        @id @default(uuid())
  tipoCombustivel TipoCombustivel
  valor           Decimal       @db.Decimal(10, 3)
  atualizadoEm    DateTime      @default(now())
  fonteFoto       String?       // URL da imagem se atualizado por OCR
  
  posto           Posto         @relation(fields: [postoId], references: [id])
  postoId         String
}

model Avaliacao {
  id          String   @id @default(uuid())
  nota        Int      // 1-5
  comentario  String?
  criadoEm    DateTime @default(now())
  
  usuario     Usuario  @relation(fields: [usuarioId], references: [id])
  usuarioId   String
  posto       Posto    @relation(fields: [postoId], references: [id])
  postoId     String
  
  @@unique([usuarioId, postoId, criadoEm])
}

model Cupom {
  id               String      @id @default(uuid())
  codigo           String      @unique
  tipo             TipoCupom
  valor            Decimal     @db.Decimal(10, 2)
  valorMinimo      Decimal?    @db.Decimal(10, 2)
  dataInicio       DateTime
  dataFim          DateTime
  ativo            Boolean     @default(true)
  
  posto            Posto       @relation(fields: [postoId], references: [id])
  postoId          String
  usuariosUsaram   CupomUsuario[]
}

model CupomUsuario {
  id          String   @id @default(uuid())
  usadoEm     DateTime @default(now())
  
  cupom       Cupom    @relation(fields: [cupomId], references: [id])
  cupomId     String
  usuario     Usuario  @relation(fields: [usuarioId], references: [id])
  usuarioId   String
  
  @@unique([cupomId, usuarioId])
}

enum TipoUsuario {
  MOTORISTA
  DONO_POSTO
  ADMINISTRADOR
}

enum TipoCombustivel {
  GASOLINA_COMUM
  GASOLINA_ADITIVADA
  ETANOL
  DIESEL_COMUM
  DIESEL_S10
  GNV
}

enum TipoCupom {
  PORCENTAGEM
  VALOR_FIXO
}
```

---

## 🤖 Integração com IA

### Serviços Recomendados

| Funcionalidade | Serviço | Justificativa |
|----------------|---------|---------------|
| **Chatbot (RF09-11)** | OpenAI GPT-4 | Melhor compreensão de linguagem natural |
| **OCR (RF12-14)** | Google Cloud Vision ou OpenAI GPT-4 Vision | Alta precisão em extração de texto |

### Implementação do Chatbot

```typescript
// services/chatbot.service.ts
import OpenAI from 'openai';

export class ChatbotService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async recomendarPosto(
    localizacao: { lat: number; lng: number },
    preferencias: { priorizarPreco: boolean; raioMaximoKm: number }
  ): Promise<RecomendacaoResponse> {
    
    // 1. Buscar postos próximos no banco
    const postos = await this.postoService.buscarProximos(localizacao, preferencias.raioMaximoKm);
    
    // 2. Criar prompt com contexto
    const prompt = this.construirPromptRecomendacao(postos, preferencias);
    
    // 3. Chamar OpenAI
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT_RECOMENDACAO },
        { role: 'user', content: prompt }
      ],
      functions: [/* function calling para estruturar resposta */]
    });
    
    return this.parseResponse(response);
  }
}
```

### Implementação do OCR

```typescript
// services/ocr.service.ts
export class OcrService {
  async extrairPrecosDeImagem(
    imagemBase64: string,
    localizacao: { lat: number; lng: number }
  ): Promise<PrecosExtraidos> {
    
    // Opção 1: OpenAI GPT-4 Vision
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: PROMPT_EXTRACAO_PRECOS },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imagemBase64}` } }
          ]
        }
      ]
    });
    
    // Identificar posto por geolocalização
    const posto = await this.postoService.encontrarPorLocalizacao(localizacao);
    
    return {
      postoId: posto.id,
      precos: this.parsePrecos(response)
    };
  }
}
```

---

## 🧪 Testes

### Estratégia de Testes (Pirâmide)

```
                    ╱╲
                   ╱  ╲           E2E Tests (10%)
                  ╱────╲          Playwright / Detox
                 ╱      ╲
                ╱────────╲        Integration Tests (20%)
               ╱          ╲       Supertest / Testing Library
              ╱────────────╲
             ╱              ╲     Unit Tests (70%)
            ╱────────────────╲    Vitest
           ╱__________________╲
```

### Testes Unitários (Backend) - Vitest

```typescript
// posto.service.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';

describe('PostoService', () => {
  let service: PostoService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(() => {
    prisma = mockDeep<PrismaClient>();
    service = new PostoService(prisma);
  });

  describe('buscarProximos', () => {
    it('deve retornar postos dentro do raio especificado', async () => {
      // Arrange
      const localizacao = { lat: -27.5969, lng: -48.5495 };
      const raioKm = 5;
      prisma.posto.findMany.mockResolvedValue(mockPostos);

      // Act
      const resultado = await service.buscarProximos(localizacao, raioKm);

      // Assert
      expect(resultado).toHaveLength(3);
      expect(resultado[0].distanciaKm).toBeLessThanOrEqual(raioKm);
    });

    it('deve ordenar por distância ascendente', async () => {
      // ...
    });
  });
});
```

### Configuração do Vitest (Backend)

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', 'dist', '**/*.spec.ts'],
    },
    include: ['src/**/*.spec.ts', 'test/**/*.spec.ts'],
  },
});
```

### Testes de Integração (Backend)

```typescript
// posto.controller.spec.ts
describe('PostoController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    prisma = module.get(PrismaService);
    await app.init();
  });

  describe('GET /postos/ranking', () => {
    it('deve retornar ranking ordenado por preço', async () => {
      const response = await request(app.getHttpServer())
        .get('/postos/ranking?combustivel=GASOLINA_COMUM')
        .expect(200);

      expect(response.body.data[0].preco)
        .toBeLessThanOrEqual(response.body.data[1].preco);
    });
  });
});
```

### Testes no Frontend (React Native) - Vitest

```typescript
// PostoCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PostoCard } from './PostoCard';

describe('PostoCard', () => {
  const mockPosto = {
    id: '1',
    nome: 'Posto Shell Centro',
    distanciaKm: 1.2,
    avaliacaoMedia: 4.5,
    precoGasolina: 5.89,
  };

  it('deve exibir informações do posto corretamente', () => {
    render(<PostoCard posto={mockPosto} />);

    expect(screen.getByText('Posto Shell Centro')).toBeTruthy();
    expect(screen.getByText('1.2 km')).toBeTruthy();
    expect(screen.getByText('R$ 5,89')).toBeTruthy();
  });

  it('deve navegar para detalhes ao clicar', () => {
    const onPress = vi.fn();
    render(<PostoCard posto={mockPosto} onPress={onPress} />);

    fireEvent.press(screen.getByTestId('posto-card'));
    expect(onPress).toHaveBeenCalledWith('1');
  });
});
```

### Cobertura de Código Mínima Recomendada

| Camada | Cobertura Mínima |
|--------|------------------|
| Services (Backend) | 80% |
| Controllers | 70% |
| Hooks (Frontend) | 75% |
| Componentes críticos | 70% |
| Utilitários | 90% |

---

## 🔐 Segurança

### Autenticação e Autorização

| Aspecto | Implementação |
|---------|---------------|
| **Autenticação** | JWT (Access + Refresh Token) |
| **Hash de Senha** | bcrypt (cost factor 12) |
| **Autorização** | RBAC (Role-Based Access Control) |
| **Proteção de Rotas** | Guards (NestJS) / Middleware |

### Checklist de Segurança

- [ ] **HTTPS** obrigatório em produção
- [ ] **Rate Limiting** em endpoints públicos (RN03 - 1 avaliação/24h)
- [ ] **Input Validation** com class-validator/zod
- [ ] **SQL Injection** - Prisma/TypeORM previnem por padrão
- [ ] **XSS** - Sanitização de comentários/avaliações
- [ ] **CORS** - Configurar origens permitidas
- [ ] **Environment Variables** - Nunca commitar secrets (.env)
- [ ] **Helmet.js** - Headers de segurança
- [ ] **Criptografia de dados sensíveis** (RNF07)

### Implementação JWT

```typescript
// auth/auth.service.ts
export class AuthService {
  async login(email: string, senha: string): Promise<TokenPair> {
    const usuario = await this.usuarioService.findByEmail(email);
    
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: usuario.id, tipo: usuario.tipo };
    
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }
}
```

---

## 🚀 DevOps e Deploy

### Ambiente de Desenvolvimento

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgis/postgis:16-3.4
    environment:
      POSTGRES_DB: tanq
      POSTGRES_USER: tanq_user
      POSTGRES_PASSWORD: tanq_pass
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'

  api:
    build: ./backend
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: postgresql://tanq_user:tanq_pass@postgres:5432/tanq
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      - run: cd backend && npm ci
      - run: cd backend && npm run lint
      - run: cd backend && npm run test:cov
      - uses: codecov/codecov-action@v3

  test-mobile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd mobile && npm ci
      - run: cd mobile && npm run lint
      - run: cd mobile && npm run test

  build:
    needs: [test-backend, test-mobile]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Build and push Docker image
        run: |
          docker build -t tanq-api ./backend
          # Push to registry
```

### Plataformas de Deploy Recomendadas

| Componente | Opção Gratuita/Educacional | Opção Produção |
|------------|---------------------------|----------------|
| **Backend** | Railway / Render | AWS ECS / GCP Cloud Run |
| **Banco** | Railway Postgres | AWS RDS / Supabase |
| **Cache** | Upstash Redis | AWS ElastiCache |
| **Mobile Build** | Expo EAS (free tier) | Expo EAS Pro |

---

## 📁 Estrutura Final do Projeto

```
tanq/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   ├── common/
│   │   ├── prisma/
│   │   └── config/
│   ├── test/
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── mobile/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── types/
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
├── doc/
│   ├── arquitetura.md
│   ├── requisitos.md
│   └── casos-de-uso/
├── docker-compose.yml
├── README.md
└── IMPLEMENT.md
```

---

## 📅 Cronograma Sugerido (Sprint de 2 semanas)

### Sprint 1: Fundação
- [x] Setup do projeto (monorepo, linting, CI/CD)
- [ ] Modelagem do banco de dados
- [ ] CRUD de Usuários e Autenticação
- [ ] Telas de Login/Cadastro no mobile

### Sprint 2: Core Features
- [ ] CRUD de Postos
- [ ] Integração com Maps
- [ ] Mapa interativo no mobile
- [ ] Testes unitários core

### Sprint 3: Avaliações e Ranking
- [ ] Sistema de Avaliações
- [ ] Ranking de preços
- [ ] Testes de integração

### Sprint 4: IA e Cupons
- [ ] Integração com OpenAI (Chatbot)
- [ ] OCR para extração de preços
- [ ] Sistema de Cupons
- [ ] Testes E2E

### Sprint 5: Polish e Deploy
- [ ] Ajustes de UX/UI
- [ ] Performance optimization
- [ ] Documentação final
- [ ] Deploy em staging/produção

---

## 📚 Recursos de Estudo

### Documentação Oficial
- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [NestJS](https://docs.nestjs.com/)
- [Prisma](https://www.prisma.io/docs)
- [OpenAI API](https://platform.openai.com/docs)

### Cursos Recomendados
- Rocketseat (NLW, Ignite) - React Native
- NestJS Fundamentals - Udemy
- [Vitest Crash Course](https://vitest.dev/guide/) - Documentação Oficial
- [Vite Guide](https://vitejs.dev/guide/) - Documentação Oficial

---

## ✅ Checklist Final de Qualidade

### Código
- [ ] TypeScript strict mode habilitado
- [ ] ESLint + Prettier configurados
- [ ] Commits seguindo Conventional Commits
- [ ] Code review obrigatório via PRs

### Documentação
- [ ] README atualizado
- [ ] API documentada (Swagger/OpenAPI)
- [ ] Variáveis de ambiente documentadas (.env.example)
- [ ] Diagrama de arquitetura atualizado

### Testes
- [ ] Cobertura mínima atingida
- [ ] Testes rodando no CI
- [ ] Testes E2E críticos implementados

### Segurança
- [ ] Secrets em variáveis de ambiente
- [ ] HTTPS em produção
- [ ] Rate limiting implementado
- [ ] Input validation em todos os endpoints

---

> **Nota Final:** Este documento serve como guia. Adapte as escolhas conforme a experiência da equipe e o tempo disponível. O mais importante é manter consistência nas decisões e documentar qualquer desvio deste plano. Boa sorte no desenvolvimento! 🚀
