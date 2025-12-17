# 📊 APRESENTAÇÃO - Projeto Tanq
> **Disciplina:** Engenharia de Software  
> **Curso:** Análise e Desenvolvimento de Sistemas (3º Semestre)  
> **Instituição:** IFSC

---

## 📋 Visão Geral do Projeto

O **Tanq** é uma aplicação web colaborativa para comparação de preços de combustíveis, permitindo que motoristas encontrem os melhores preços na sua região e avaliem postos de combustível.

### Stack Tecnológica
| Camada | Tecnologia |
|--------|------------|
| **Frontend** | React + Vite |
| **Backend** | Spring Boot + Java 21 |
| **Banco de Dados** | MySQL |
| **Testes Backend** | JUnit 5 |
| **Testes Frontend** | Vitest + Testing Library |

---

## 🏗️ Conceitos de Engenharia de Software Aplicados

### 1. Engenharia de Requisitos

O projeto seguiu um processo estruturado de levantamento de requisitos:

- **Requisitos Funcionais:**
  - RF01: Cadastro e autenticação de usuários
  - RF02: CRUD de postos de combustível
  - RF03: Cadastro e consulta de preços
  - RF04: Sistema de avaliações com notas e comentários
  - RF05: Ranking de preços por tipo de combustível
  - RF06: Visualização de postos em mapa interativo

- **Requisitos Não-Funcionais:**
  - RNF01: Interface responsiva (mobile-first)
  - RNF02: Tempo de resposta < 2 segundos
  - RNF03: Segurança através de controle de permissões por tipo de usuário

### 2. Arquitetura em Camadas (MVC Pattern)

O projeto implementa uma arquitetura em camadas bem definida:

```
┌─────────────────────────────────────────────┐
│           APRESENTAÇÃO (React)              │
│    Components → Pages → Services/API        │
└─────────────────────┬───────────────────────┘
                      │ REST API (JSON)
                      ▼
┌─────────────────────────────────────────────┐
│           APLICAÇÃO (Spring Boot)           │
│    Controller → Service → Repository        │
└─────────────────────┬───────────────────────┘
                      │ JPA/Hibernate
                      ▼
┌─────────────────────────────────────────────┐
│           DADOS (MySQL)                     │
│    Entities → Tables                        │
└─────────────────────────────────────────────┘
```

**Benefícios:**
- **Separação de responsabilidades:** Cada camada tem função específica
- **Manutenibilidade:** Mudanças em uma camada não afetam as outras
- **Testabilidade:** Camadas podem ser testadas isoladamente

### 3. Design de API REST

A API segue os princípios RESTful:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/postos` | Listar todos os postos |
| GET | `/api/postos/{id}` | Buscar posto por ID |
| POST | `/api/postos` | Criar novo posto |
| PUT | `/api/postos/{id}` | Atualizar posto |
| DELETE | `/api/postos/{id}` | Deletar posto |
| GET | `/api/precos/ranking/{tipo}` | Ranking por combustível |
| GET | `/api/avaliacoes/posto/{id}` | Avaliações de um posto |

**Princípios aplicados:**
- Verbos HTTP semânticos (GET, POST, PUT, DELETE)
- URLs orientadas a recursos
- Respostas em JSON padronizado
- Códigos de status HTTP apropriados

### 4. Controle de Acesso (RBAC)

Implementação de Role-Based Access Control:

| Tipo de Usuário | Permissões |
|-----------------|------------|
| **ADMINISTRADOR** | CRUD completo em todos os recursos |
| **DONO_POSTO** | CRUD apenas dos próprios postos/preços |
| **MOTORISTA** | Criar/deletar próprios preços e avaliações |

**Implementação:**
```java
public void deletar(Long id, Long usuarioId, TipoUsuario tipo) {
    if (tipo == TipoUsuario.ADMINISTRADOR) {
        // Admin pode deletar qualquer recurso
        repository.deleteById(id);
        return;
    }
    // Outros usuários só deletam próprios recursos
    if (recurso.getUsuarioId().equals(usuarioId)) {
        repository.deleteById(id);
    }
}
```

### 5. Testes Unitários

O projeto mantém alta cobertura de testes:

**Backend (JUnit 5):**
- `UsuarioServiceTest` - Autenticação e cadastro
- `PostoServiceTest` - CRUD de postos
- `PrecoServiceTest` - Gestão de preços
- `AvaliacaoServiceTest` - Sistema de avaliações

**Frontend (Vitest + Testing Library):**
- `PostoList.test.jsx` - Lista de postos
- `AvaliacaoForm.test.jsx` - Formulário de avaliação
- `AvaliacaoList.test.jsx` - Lista de avaliações
- `PostoCard.test.jsx` - Card de posto
- `HomePage.test.jsx` - Página inicial
- `RankingPage.test.jsx` - Página de ranking

**Total: 45+ testes automatizados**

### 6. Controle de Versão (Git/GitHub)

- Repositório organizado com estrutura clara
- Histórico de commits documentando evolução
- Branches para features e correções
- README.md com instruções de execução

### 7. Qualidade de Código (Clean Code)

Princípios aplicados:

- **Nomes significativos:** Classes e métodos autoexplicativos
- **Funções pequenas:** Cada função faz uma coisa
- **DRY (Don't Repeat Yourself):** Reuso através de serviços e componentes
- **Separação de responsabilidades:** Uma classe = uma responsabilidade

---

## 🎯 Funcionalidades Implementadas

| Funcionalidade | Status | Descrição |
|----------------|--------|-----------|
| Autenticação | ✅ | Login/Cadastro de usuários |
| CRUD Postos | ✅ | Criar, listar, editar, deletar postos |
| CRUD Preços | ✅ | Gerenciamento de preços por combustível |
| Ranking | ✅ | Ordenação por menor preço |
| Mapa Interativo | ✅ | Leaflet com geolocalização |
| Avaliações | ✅ | Notas (1-5 estrelas) + comentários |
| Responsividade | ✅ | Design adaptativo mobile/desktop |

---

## 🧪 Estratégia de Testes

### Pirâmide de Testes

```
        /\
       /  \  E2E (Manual)
      /----\
     /      \  Integração
    /--------\
   /          \  Unitários (45+)
  /------------\
```

### Execução dos Testes

**Backend:**
```bash
cd backend
.\gradlew test
```

**Frontend:**
```bash
cd frontend
npm test
```

---

## 📚 Padrões de Projeto Utilizados

1. **Repository Pattern** - Abstração do acesso a dados
2. **Service Layer** - Lógica de negócio centralizada
3. **Context API (React)** - Gerenciamento de estado global
4. **Custom Hooks** - Reutilização de lógica (useAuth)

---

## 🎓 Lições Aprendidas

1. **Planejamento é essencial** - Definir requisitos antes de codificar
2. **Testes economizam tempo** - Bugs encontrados cedo custam menos
3. **Arquitetura limpa facilita evolução** - Código organizado é mais fácil de manter
4. **Documentação é parte do código** - Facilita onboarding e manutenção

---

## 👥 Equipe

- **Giuliano Marcus Bianco**
- **Nicolas Pitz**

---

## 📎 Referências

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [Vitest Testing Framework](https://vitest.dev)
- [Leaflet Maps](https://leafletjs.com)
