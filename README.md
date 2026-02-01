# Tanq ⛽✨

> **Sistema Colaborativo de Comparação de Preços de Combustível**

[![Java](https://img.shields.io/badge/Java-21+-orange.svg)](https://adoptium.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5+-purple.svg)](https://vitejs.dev)

---

## 📋 Índice

- [Descrição](#-descrição-geral)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Como Rodar](#-como-rodar-o-projeto)
- [API Documentation](#-api-documentation)
- [Testes](#-testes)
- [Equipe](#-equipe)

---

## 📝 Descrição Geral

O **Tanq** é uma plataforma web colaborativa que permite aos usuários compartilhar e encontrar os melhores preços de combustíveis em sua região. Motoristas podem comparar preços, avaliar postos e contribuir com a comunidade cadastrando preços atualizados.

### Tipos de Usuário

| Tipo | Descrição | Permissões |
|------|-----------|------------|
| **Motorista** | Usuário comum | Cadastrar preços, avaliar postos |
| **Dono de Posto** | Proprietário | Gerenciar próprio posto e preços |
| **Administrador** | Admin do sistema | Acesso total a todos os recursos |

---

## ✨ Funcionalidades

### Core
- 🔐 **Autenticação** - Login e cadastro de usuários
- ⛽ **CRUD de Postos** - Cadastro completo de postos de combustível
- 💰 **Gestão de Preços** - Cadastro de preços por tipo de combustível (Gasolina, Etanol, Diesel)
- 🏆 **Ranking** - Ordenação de postos por menor preço

### Avançadas
- ⭐ **Avaliações** - Sistema de notas (1-5 estrelas) com comentários
- 🗺️ **Mapa Interativo** - Visualização de postos com Leaflet e geolocalização
- 📱 **Design Responsivo** - Interface adaptativa para mobile e desktop

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────┐
│           FRONTEND (React + Vite)       │
│         http://localhost:5173           │
│   pages/ → components/ → services/api   │
└────────────────────┬────────────────────┘
                     │ REST API (JSON)
                     ▼
┌─────────────────────────────────────────┐
│        BACKEND (Spring Boot)            │
│         http://localhost:8080           │
│  Controller → Service → Repository      │
└────────────────────┬────────────────────┘
                     │ JPA/Hibernate
                     ▼
┌─────────────────────────────────────────┐
│              MySQL 8.0                  │
│           localhost:3307                │
└─────────────────────────────────────────┘
```

### Estrutura de Pastas

```
tanq/
├── backend/                # Spring Boot + Java 21
│   ├── src/main/java/com/tanq/
│   │   ├── controller/     # Endpoints REST
│   │   ├── service/        # Lógica de negócio
│   │   ├── repository/     # Acesso a dados
│   │   └── model/          # Entidades JPA
│   └── src/test/           # Testes JUnit
│
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── services/       # Chamadas à API
│   │   └── contexts/       # Estado global (Auth)
│   └── package.json
│
├── APRESENTACAO.md         # Documentação de apresentação
├── IMPLEMENT_SIMPLE.md     # Guia de implementação
└── docker-compose.yml      # MySQL container
```

---

## 🛠️ Como Rodar o Projeto

### Pré-requisitos

- [Docker](https://www.docker.com/get-started) instalado
- [Java 21](https://adoptium.net/) instalado
- [Node.js 18+](https://nodejs.org/) instalado

### 1. Subir o Banco de Dados (MySQL via Docker)

```bash
docker-compose up -d
```

O MySQL estará disponível em `localhost:3307`:
- **Database:** tanq
- **Usuário:** tanq
- **Senha:** tanq123

### 2. Rodar o Backend (Spring Boot)

```bash
cd backend
.\gradlew bootRun
```

A API estará disponível em **http://localhost:8083/api**

### 3. Rodar o Frontend Web (React + Vite)

Em um **novo terminal**:

```bash
npx nx serve web-tanq
```

O frontend web estará disponível em **http://localhost:5173**

### 4. Rodar o App Mobile (Expo + React Native)

Em um **novo terminal**:

```bash
npx nx start mobile-tanq
```

> [!IMPORTANT]
> Para o mobile se conectar ao backend, edite o arquivo `libs/core-logic/src/services/api.ts` e configure o IP local da sua máquina no campo `android`.

**Exemplo:**
```typescript
const API_URL = {
  android: 'http://192.168.1.100:8083/api', // Seu IP local
  ios: 'http://localhost:8083/api',
};
```

Para descobrir seu IP local:
- **Windows:** `ipconfig` no terminal (procure por IPv4)
- **Mac/Linux:** `ifconfig` ou `ip addr`

### Modo Alternativo (sem Docker)

Para rodar com banco H2 em memória:

```bash
cd backend
.\gradlew bootRun --args='--spring.profiles.active=h2'
```

---

## 📚 API Documentation

### Autenticação (`/api/auth`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/login` | Login de usuário |
| POST | `/register` | Cadastro de usuário |

### Postos (`/api/postos`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Listar todos os postos |
| GET | `/{id}` | Buscar posto por ID |
| GET | `/buscar?nome=` | Buscar por nome |
| GET | `/meus?usuarioId=` | Meus postos (Dono) |
| POST | `/` | Criar novo posto |
| PUT | `/{id}` | Atualizar posto |
| DELETE | `/{id}?usuarioId=` | Deletar posto |

### Preços (`/api/precos`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Listar todos os preços |
| GET | `/posto/{postoId}` | Preços de um posto |
| GET | `/ranking/{tipo}` | Ranking por combustível |
| POST | `/` | Criar novo preço |
| DELETE | `/{id}?usuarioId=` | Deletar preço |

### Avaliações (`/api/avaliacoes`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/posto/{postoId}` | Avaliações de um posto |
| GET | `/posto/{postoId}/media` | Média e total |
| POST | `/` | Criar avaliação |
| DELETE | `/{id}?usuarioId=` | Deletar avaliação |

---

## 🧪 Testes

### Backend (JUnit 5)

```bash
cd backend
.\gradlew test
```

**Arquivos de teste:**
- `UsuarioServiceTest.java` - Autenticação
- `PostoServiceTest.java` - CRUD de postos
- `PrecoServiceTest.java` - Gestão de preços
- `AvaliacaoServiceTest.java` - Avaliações

### Frontend (Vitest)

```bash
cd frontend
npm test
```

**Arquivos de teste:**
- `PostoList.test.jsx` - Lista de postos
- `AvaliacaoForm.test.jsx` - Formulário de avaliação
- `AvaliacaoList.test.jsx` - Lista de avaliações
- `PostoCard.test.jsx` - Card de posto
- `HomePage.test.jsx` - Página inicial
- `RankingPage.test.jsx` - Ranking

**Total: 45+ testes automatizados**

---

## 👤 Usuários de Demonstração

| Email | Senha | Tipo |
|-------|-------|------|
| admin@tanq.com | admin123 | Administrador |
| joao@email.com | 123456 | Motorista |
| maria@posto.com | 123456 | Dono de Posto |

---

## 🚀 Equipe do Projeto

* **Giuliano Marcus Bianco**
* **Nicolas Pitz**

---

## 📄 Licença

Este projeto é desenvolvido para fins acadêmicos como parte da disciplina de Engenharia de Software - IFSC.

---

<p align="center">
  <b>Tanq © 2024 - Projeto Acadêmico IFSC</b>
</p>
