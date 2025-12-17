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

## � Usuários e Autenticação

### Entidade Usuario (`Usuario.java`)

```java
@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String senha;
    
    @Column(nullable = false)
    private String nome;
    
    @Enumerated(EnumType.STRING)
    private TipoUsuario tipo = TipoUsuario.MOTORISTA;
    
    private LocalDateTime criadoEm;
    
    // Getters e Setters
}

public enum TipoUsuario {
    MOTORISTA, DONO_POSTO, ADMINISTRADOR
}
```

### Controller de Autenticação (`AuthController.java`)

```java
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String senha = credentials.get("senha");
        
        Optional<Usuario> usuario = usuarioService.autenticar(email, senha);
        
        if (usuario.isPresent()) {
            return ResponseEntity.ok(Map.of(
                "id", usuario.get().getId(),
                "nome", usuario.get().getNome(),
                "email", usuario.get().getEmail()
            ));
        }
        return ResponseEntity.status(401).body(Map.of("erro", "Credenciais inválidas"));
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario usuario) {
        try {
            Usuario novo = usuarioService.registrar(usuario);
            return ResponseEntity.status(201).body(Map.of(
                "id", novo.getId(),
                "nome", novo.getNome()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}
```

### Frontend: Contexto de Autenticação (`AuthContext.jsx`)

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioSalvo = authService.obterUsuario();
    if (usuarioSalvo) setUsuario(usuarioSalvo);
  }, []);

  const login = async (email, senha) => {
    const response = await authService.login(email, senha);
    authService.salvarUsuario(response.data);
    setUsuario(response.data);
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, estaLogado: !!usuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### Página de Login (`LoginPage.jsx`)

```jsx
function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(email, senha);
      navigate('/');
    } catch (error) {
      setErro('Email ou senha inválidos');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={senha} onChange={e => setSenha(e.target.value)} />
      {erro && <p className="erro">{erro}</p>}
      <button type="submit">Entrar</button>
    </form>
  );
}
```

### Usuários de Demonstração

| Email | Senha | Tipo |
|-------|-------|------|
| admin@tanq.com | admin123 | Administrador |
| joao@email.com | 123456 | Motorista |
| maria@posto.com | 123456 | Dono de Posto |

---

## 🔐 Sistema de Permissões por Tipo de Usuário

O sistema implementa controle de acesso baseado no tipo de usuário:

### Regras de Acesso

| Tipo | Postos | Preços |
|------|--------|--------|
| **Administrador** | Criar/Deletar qualquer | Criar/Deletar qualquer |
| **Dono de Posto** | Criar/Deletar próprios | Criar/Deletar preços dos seus postos |
| **Motorista** | Não pode | Criar/Deletar próprios preços |

### Modelo de Dados Atualizado

A entidade `Preco` foi separada de `Posto` para rastrear quem cadastrou cada preço:

```java
@Entity
@Table(name = "precos")
public class Preco {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long postoId;
    
    @Enumerated(EnumType.STRING)
    private TipoCombustivel tipoCombustivel; // GASOLINA, ETANOL, DIESEL
    
    private BigDecimal valor;
    
    private Long usuarioId; // Quem cadastrou o preço
    
    private LocalDateTime criadoEm;
}
```

A entidade `Posto` agora tem `donoId`:

```java
@Entity
@Table(name = "postos")
public class Posto {
    private Long id;
    private String nome;
    private String endereco;
    private Double latitude;
    private Double longitude;
    private Long donoId; // Quem criou o posto
    private LocalDateTime criadoEm;
}
```

### Verificação de Permissão no Service

```java
public void deletar(Long id, Long usuarioId, TipoUsuario tipoUsuario) {
    Posto posto = postoRepository.findById(id).orElseThrow();
    
    // Administrador pode deletar qualquer posto
    if (tipoUsuario == TipoUsuario.ADMINISTRADOR) {
        postoRepository.deleteById(id);
        return;
    }
    
    // Dono só pode deletar posto que criou
    if (tipoUsuario == TipoUsuario.DONO_POSTO && posto.getDonoId().equals(usuarioId)) {
        postoRepository.deleteById(id);
        return;
    }
    
    throw new RuntimeException("Permissão negada");
}
```

---

## �📱 Frontend (React + Vite)

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
- [x] Criar entidades e banco de dados
- [x] CRUD básico de Postos
- [x] CRUD de Usuários e Autenticação
- [x] Telas de Login/Cadastro no frontend

### Semana 2: Funcionalidades Core
- [x] Ranking de preços
- [x] Listar postos no frontend
- [x] Formulário de cadastro
- [x] Implementação do mapa com leaflet
- [x] Implementação de todos os testes unitários core

### Semana 3: Avaliações
- [x] Implementação do sistema de avaliações
- [x] Exibição das informações de avaliações, como média, número de avaliações e comentários no frontend
- [x] Implementação de todos os testes unitários das avaliações

### Semana 4: Finalização
- [ ] Melhorar a estilização para deixar com um design e uma experiência do usuário profissional
- [ ] Implemente todos os testes da aplicação
- [ ] Deixar tudo pronto para a documentação e apresentação

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

## �️ Mapa Interativo com Exibição de Postos

O mapa interativo é uma funcionalidade central do Tanq, permitindo que usuários visualizem postos de combustível ao seu redor com preços e avaliações.

### Objetivos

- Visualizar postos de combustível no mapa com marcadores
- Exibir informações de preço e avaliação ao clicar no marcador
- Centralizar o mapa na localização do usuário
- Permitir navegação e zoom no mapa

### Biblioteca Recomendada

Para o **frontend web (React + Vite)**, usamos a biblioteca **Leaflet**:

```bash
npm install leaflet react-leaflet
```

| Biblioteca | Função |
|------------|--------|
| `leaflet` | Mapas interativos open-source |
| `react-leaflet` | Componentes React para Leaflet |

### Estrutura de Arquivos

```
frontend/src/
├── components/
│   └── MapaPostos.jsx       # Componente do mapa
├── pages/
│   └── MapaPage.jsx         # Página do mapa
└── services/
    └── api.js               # Já existente (endpoint /postos)
```

---

### Backend: Endpoint para Postos com Coordenadas

O backend já possui o modelo `Posto` com campos `latitude` e `longitude`. Certifique-se que os dados incluem coordenadas:

```sql
-- Atualizar postos com coordenadas de exemplo (Florianópolis/SC)
UPDATE postos SET latitude = -27.5954, longitude = -48.5480 WHERE id = 1;
UPDATE postos SET latitude = -27.5969, longitude = -48.5495 WHERE id = 2;
UPDATE postos SET latitude = -27.6000, longitude = -48.5520 WHERE id = 3;
```

---

### Frontend: Componente do Mapa (`MapaPostos.jsx`)

```jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { postoService } from '../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corrigir ícones do Leaflet (problema conhecido com bundlers)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para centralizar no usuário
function LocalizacaoUsuario({ posicao }) {
  const map = useMap();
  useEffect(() => {
    if (posicao) {
      map.setView(posicao, 14);
    }
  }, [posicao, map]);
  return null;
}

function MapaPostos() {
  const [postos, setPostos] = useState([]);
  const [posicaoUsuario, setPosicaoUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Posição padrão (Florianópolis)
  const posicaoPadrao = [-27.5969, -48.5480];

  useEffect(() => {
    // Carregar postos do backend
    async function carregarPostos() {
      try {
        const response = await postoService.listarTodos();
        setPostos(response.data);
      } catch (error) {
        console.error('Erro ao carregar postos:', error);
      } finally {
        setLoading(false);
      }
    }

    // Obter localização do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosicaoUsuario([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn('Erro ao obter localização:', error);
        }
      );
    }

    carregarPostos();
  }, []);

  if (loading) return <p>Carregando mapa...</p>;

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer
        center={posicaoUsuario || posicaoPadrao}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <LocalizacaoUsuario posicao={posicaoUsuario} />

        {postos.map((posto) => (
          posto.latitude && posto.longitude && (
            <Marker key={posto.id} position={[posto.latitude, posto.longitude]}>
              <Popup>
                <strong>{posto.nome}</strong><br />
                <span>Gasolina: R$ {posto.precoGasolina?.toFixed(2)}</span><br />
                <span>Etanol: R$ {posto.precoEtanol?.toFixed(2)}</span><br />
                <small>{posto.endereco}</small>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
}

export default MapaPostos;
```

---

### Página do Mapa (`MapaPage.jsx`)

```jsx
import MapaPostos from '../components/MapaPostos';
import './MapaPage.css';

function MapaPage() {
  return (
    <div className="mapa-page">
      <h1>🗺️ Mapa de Postos</h1>
      <p>Encontre postos próximos a você e compare preços</p>
      <MapaPostos />
    </div>
  );
}

export default MapaPage;
```

---

### Estilo CSS (`MapaPage.css`)

```css
.mapa-page {
  padding: 20px;
}

.mapa-page h1 {
  margin-bottom: 10px;
}

.mapa-page p {
  margin-bottom: 20px;
  color: #666;
}

/* Importante: garantir que o container do mapa tenha altura */
.leaflet-container {
  height: 500px;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
```

---

### Adicionar Rota no App.jsx

```jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RankingPage from './pages/RankingPage';
import CadastroPage from './pages/CadastroPage';
import MapaPage from './pages/MapaPage';  // Nova importação

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/mapa">Mapa</Link>  {/* Novo link */}
        <Link to="/ranking">Ranking</Link>
        <Link to="/cadastro">Cadastro</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mapa" element={<MapaPage />} />  {/* Nova rota */}
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

### Teste do Componente (`MapaPostos.test.jsx`)

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import MapaPostos from './MapaPostos';
import { postoService } from '../services/api';

// Mock do serviço
vi.mock('../services/api', () => ({
  postoService: {
    listarTodos: vi.fn(),
  },
}));

describe('MapaPostos', () => {
  it('deve exibir loading inicialmente', () => {
    postoService.listarTodos.mockReturnValue(new Promise(() => {}));
    
    render(<MapaPostos />);
    
    expect(screen.getByText('Carregando mapa...')).toBeInTheDocument();
  });

  it('deve renderizar o mapa após carregar postos', async () => {
    postoService.listarTodos.mockResolvedValue({
      data: [
        { id: 1, nome: 'Posto Shell', latitude: -27.5954, longitude: -48.5480, precoGasolina: 5.89 },
      ],
    });

    render(<MapaPostos />);

    await waitFor(() => {
      expect(screen.queryByText('Carregando mapa...')).not.toBeInTheDocument();
    });
  });
});
```

---

### Checklist de Implementação do Mapa

- [ ] Instalar dependências: `npm install leaflet react-leaflet`
- [ ] Criar componente `MapaPostos.jsx`
- [ ] Criar página `MapaPage.jsx` e CSS
- [ ] Adicionar rota `/mapa` no `App.jsx`
- [ ] Atualizar postos no banco com coordenadas reais
- [ ] Testar geolocalização do navegador
- [ ] Adicionar testes unitários

---

## �💡 Dicas para a Apresentação

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
