# 🛠️ Guia de Implementação Simplificado - Projeto Tanq

> **Versão:** Acadêmica (3º Semestre ADS)  
> **Stack:** React + Vite | Spring Boot + Java | MySQL

---

## 📋 Visão Geral

Este guia apresenta uma implementação **simplificada e didática** do projeto Tanq, adequada para estudantes do 3º semestre de Análise e Desenvolvimento de Sistemas.

### Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| **Frontend** | React + Vite | Framework popular, fácil de aprender, bundler rápido |
| **Backend** | Spring Boot + Java | Já estudado no curso, documentação extensa |
| **Banco de Dados** | MySQL | Familiar, usado em disciplinas anteriores |
| **Testes Backend** | JUnit 5 | Padrão do Spring Boot |
| **Testes Frontend** | Vitest | Rápido, sintaxe simples |

---

## 🏗️ Arquitetura Simplificada

```
┌─────────────────────────────────────────┐
│           FRONTEND (React + Vite)       │
│         http://localhost:5173           │
└────────────────────┬────────────────────┘
                     │ REST API (JSON)
                     ▼
┌─────────────────────────────────────────┐
│        BACKEND (Spring Boot)            │
│         http://localhost:8080           │
├─────────────────────────────────────────┤
│  Controller → Service → Repository      │
└────────────────────┬────────────────────┘
                     │ JPA/Hibernate
                     ▼
┌─────────────────────────────────────────┐
│              MySQL                       │
│           localhost:3306                 │
└─────────────────────────────────────────┘
```

---

## 📁 Estrutura de Pastas

```
tanq/
├── backend/                    # Spring Boot
│   ├── src/main/java/com/tanq/
│   │   ├── controller/        # Endpoints REST
│   │   ├── service/           # Lógica de negócio
│   │   ├── repository/        # Acesso ao banco
│   │   ├── model/             # Entidades JPA
│   │   └── dto/               # Objetos de transferência
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── src/test/java/         # Testes JUnit
│   └── pom.xml
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── pages/             # Páginas da aplicação
│   │   ├── services/          # Chamadas à API
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🖥️ Backend (Spring Boot)

### Dependências do `pom.xml`

```xml
<dependencies>
    <!-- Spring Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- MySQL Driver -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Validação -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!-- Testes -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### Configuração (`application.properties`)

```properties
# Servidor
server.port=8080

# MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/tanq?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# CORS (permitir frontend)
spring.web.cors.allowed-origins=http://localhost:5173
```

### Exemplo de Entidade (`Posto.java`)

```java
@Entity
@Table(name = "postos")
public class Posto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nome;
    
    private String endereco;
    
    private Double latitude;
    
    private Double longitude;
    
    @Column(name = "preco_gasolina")
    private BigDecimal precoGasolina;
    
    @Column(name = "preco_etanol")
    private BigDecimal precoEtanol;
    
    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;
    
    // Getters e Setters
}
```

### Exemplo de Repository

```java
@Repository
public interface PostoRepository extends JpaRepository<Posto, Long> {
    
    // Buscar postos ordenados pelo menor preço de gasolina
    List<Posto> findAllByOrderByPrecoGasolinaAsc();
    
    // Buscar postos por nome (busca parcial)
    List<Posto> findByNomeContainingIgnoreCase(String nome);
}
```

### Exemplo de Service

```java
@Service
public class PostoService {
    
    @Autowired
    private PostoRepository postoRepository;
    
    public List<Posto> listarTodos() {
        return postoRepository.findAll();
    }
    
    public List<Posto> rankingPorPreco() {
        return postoRepository.findAllByOrderByPrecoGasolinaAsc();
    }
    
    public Posto salvar(Posto posto) {
        posto.setAtualizadoEm(LocalDateTime.now());
        return postoRepository.save(posto);
    }
    
    public void deletar(Long id) {
        postoRepository.deleteById(id);
    }
}
```

### Exemplo de Controller

```java
@RestController
@RequestMapping("/api/postos")
@CrossOrigin(origins = "http://localhost:5173")
public class PostoController {
    
    @Autowired
    private PostoService postoService;
    
    @GetMapping
    public List<Posto> listarTodos() {
        return postoService.listarTodos();
    }
    
    @GetMapping("/ranking")
    public List<Posto> ranking() {
        return postoService.rankingPorPreco();
    }
    
    @PostMapping
    public Posto criar(@RequestBody Posto posto) {
        return postoService.salvar(posto);
    }
    
    @PutMapping("/{id}")
    public Posto atualizar(@PathVariable Long id, @RequestBody Posto posto) {
        posto.setId(id);
        return postoService.salvar(posto);
    }
    
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        postoService.deletar(id);
    }
}
```

### Teste com JUnit (`PostoServiceTest.java`)

```java
@SpringBootTest
class PostoServiceTest {
    
    @Autowired
    private PostoService postoService;
    
    @Autowired
    private PostoRepository postoRepository;
    
    @BeforeEach
    void setUp() {
        postoRepository.deleteAll();
    }
    
    @Test
    void deveSalvarPosto() {
        Posto posto = new Posto();
        posto.setNome("Posto Shell");
        posto.setPrecoGasolina(new BigDecimal("5.89"));
        
        Posto salvo = postoService.salvar(posto);
        
        assertNotNull(salvo.getId());
        assertEquals("Posto Shell", salvo.getNome());
    }
    
    @Test
    void deveRetornarRankingOrdenado() {
        // Arrange
        Posto caro = new Posto();
        caro.setNome("Posto Caro");
        caro.setPrecoGasolina(new BigDecimal("6.50"));
        postoRepository.save(caro);
        
        Posto barato = new Posto();
        barato.setNome("Posto Barato");
        barato.setPrecoGasolina(new BigDecimal("5.20"));
        postoRepository.save(barato);
        
        // Act
        List<Posto> ranking = postoService.rankingPorPreco();
        
        // Assert
        assertEquals(2, ranking.size());
        assertEquals("Posto Barato", ranking.get(0).getNome());
    }
}
```

---

## 📱 Frontend (React + Vite)

### Criar Projeto

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install axios react-router-dom
```

### Dependências (`package.json`)

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^14.0.0",
    "jsdom": "^23.0.0"
  }
}
```

### Configuração Vitest (`vite.config.js`)

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
```

### Serviço de API (`src/services/api.js`)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export const postoService = {
  listarTodos: () => api.get('/postos'),
  ranking: () => api.get('/postos/ranking'),
  criar: (posto) => api.post('/postos', posto),
  atualizar: (id, posto) => api.put(`/postos/${id}`, posto),
  deletar: (id) => api.delete(`/postos/${id}`),
};

export default api;
```

### Componente de Lista (`src/components/PostoList.jsx`)

```jsx
import { useState, useEffect } from 'react';
import { postoService } from '../services/api';

function PostoList() {
  const [postos, setPostos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPostos();
  }, []);

  async function carregarPostos() {
    try {
      const response = await postoService.ranking();
      setPostos(response.data);
    } catch (error) {
      console.error('Erro ao carregar postos:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h2>Ranking de Preços</h2>
      <table>
        <thead>
          <tr>
            <th>Posto</th>
            <th>Gasolina</th>
            <th>Etanol</th>
          </tr>
        </thead>
        <tbody>
          {postos.map((posto) => (
            <tr key={posto.id}>
              <td>{posto.nome}</td>
              <td>R$ {posto.precoGasolina?.toFixed(2)}</td>
              <td>R$ {posto.precoEtanol?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PostoList;
```

### Teste com Vitest (`src/components/PostoList.test.jsx`)

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import PostoList from './PostoList';
import { postoService } from '../services/api';

// Mock do serviço
vi.mock('../services/api', () => ({
  postoService: {
    ranking: vi.fn(),
  },
}));

describe('PostoList', () => {
  it('deve exibir lista de postos', async () => {
    // Arrange
    postoService.ranking.mockResolvedValue({
      data: [
        { id: 1, nome: 'Posto Shell', precoGasolina: 5.89 },
        { id: 2, nome: 'Posto Ipiranga', precoGasolina: 5.99 },
      ],
    });

    // Act
    render(<PostoList />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Posto Shell')).toBeInTheDocument();
      expect(screen.getByText('Posto Ipiranga')).toBeInTheDocument();
    });
  });

  it('deve exibir loading inicialmente', () => {
    postoService.ranking.mockReturnValue(new Promise(() => {}));
    
    render(<PostoList />);
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });
});
```

---

## 🗄️ Banco de Dados (MySQL)

### Script de Criação

```sql
CREATE DATABASE IF NOT EXISTS tanq;
USE tanq;

CREATE TABLE postos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    endereco VARCHAR(500),
    latitude DOUBLE,
    longitude DOUBLE,
    preco_gasolina DECIMAL(10, 3),
    preco_etanol DECIMAL(10, 3),
    atualizado_em DATETIME
);

-- Dados de exemplo
INSERT INTO postos (nome, endereco, preco_gasolina, preco_etanol, atualizado_em) VALUES
('Posto Shell Centro', 'Rua Principal, 100', 5.89, 3.99, NOW()),
('Posto Ipiranga', 'Av. Brasil, 500', 5.79, 3.89, NOW()),
('Posto BR', 'Rua das Flores, 200', 5.99, 4.09, NOW());
```

---

## 🧪 Executando os Testes

### Backend (JUnit)

```bash
cd backend
./mvnw test
```

### Frontend (Vitest)

```bash
cd frontend
npm run test
```

---

## 🚀 Como Executar o Projeto

### 1. Banco de Dados
```bash
# Certifique-se que o MySQL está rodando
# Crie o banco executando o script SQL acima
```

### 2. Backend
```bash
cd backend
./mvnw spring-boot:run
# Acesse: http://localhost:8080/api/postos
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# Acesse: http://localhost:5173
```

---

## 📅 Cronograma Simplificado (4 Semanas)

### Semana 1: Fundação
- [x] Setup do projeto (backend + frontend)
- [ ] Criar entidades e banco de dados
- [ ] CRUD básico de Postos

### Semana 2: Funcionalidades Core
- [ ] Ranking de preços
- [ ] Listar postos no frontend
- [ ] Formulário de cadastro

### Semana 3: Avaliações
- [ ] Sistema de avaliações
- [ ] Exibir média de avaliações
- [ ] Testes unitários

### Semana 4: Finalização
- [ ] Estilização CSS
- [ ] Testes finais
- [ ] Documentação e apresentação

---

## 📊 Funcionalidades para Apresentação

| Funcionalidade | Complexidade | Prioridade |
|----------------|--------------|------------|
| Listar postos | Baixa | Alta |
| Ranking por preço | Baixa | Alta |
| Cadastrar posto | Média | Alta |
| Editar preços | Média | Alta |
| Avaliações (1-5 estrelas) | Média | Média |
| Buscar por nome | Baixa | Média |

---

## 💡 Dicas para a Apresentação

1. **Demonstre o fluxo completo**: Cadastro → Listagem → Ranking → Avaliação
2. **Mostre os testes executando**: Tanto JUnit quanto Vitest
3. **Explique a arquitetura**: Controller → Service → Repository
4. **Tenha dados de exemplo**: Postos com preços variados para mostrar o ranking
5. **Prepare respostas para perguntas comuns**:
   - Por que Spring Boot? (Visto no curso, documentação extensa)
   - Por que React? (Popular, empregabilidade, fácil de aprender)
   - Como funciona a comunicação? (REST API com JSON)

---

> **Nota:** Esta versão foca no essencial para um projeto acadêmico de 3º semestre. Funcionalidades avançadas como autenticação JWT, mapa interativo e IA podem ser adicionadas como "melhorias futuras" na apresentação.
