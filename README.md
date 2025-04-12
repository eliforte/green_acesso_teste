# Condomínio API - Green Acesso

API para gerenciamento de boletos de condomínio desenvolvida como solução para o desafio técnico da Green Acesso.

## 🌟 Visão Geral

O projeto implementa um sistema completo para importação e gerenciamento de boletos de condomínio, atendendo aos requisitos do Condomínio Green Park, onde são utilizados dois aplicativos: um para controle de acesso da portaria e outro para gerenciamento de taxas condominiais.

O problema central é a necessidade de importar boletos do sistema financeiro para o sistema da portaria, permitindo que os moradores utilizem uma única plataforma.

## 🏗️ Arquitetura
O projeto é construído seguindo os princípios da **Arquitetura Hexagonal** (também conhecida como Ports and Adapters), que proporciona:

- **Isolamento do domínio**: O núcleo da aplicação é independente de frameworks e detalhes técnicos
- **Alta testabilidade**: Interfaces bem definidas facilitam a criação de testes unitários
- **Manutenibilidade**: Separação clara de responsabilidades
- **Flexibilidade**: Facilidade para substituir implementações específicas

### Estrutura de Pastas

```
.
├── .github/workflows         # CI/CD com GitHub Actions
│   └── build.yaml            # Pipeline de build e testes
├── .husky                    # Git hooks para garantir qualidade de código
│   ├── commit-msg            # Validação de mensagens de commit
│   └── pre-commit            # Verificações antes do commit
├── docker                    # Configurações Docker
│   └── development           # Ambiente de desenvolvimento
│       ├── volumes           # Volumes para persistência
│       ├── docker-compose.yml # Configuração dos serviços
│       └── Dockerfile        # Configuração do container da API
├── src                       # Código fonte da aplicação
│   ├── core                  # Núcleo da aplicação
│   │   ├── domain            # Entidades e regras de negócio
│   │   │   ├── entities      # Entidades do domínio
│   │   │   └── ports         # Interfaces para adaptadores
│   │   └── application       # Casos de uso
│   ├── infra                 # Infraestrutura
│   │   ├── adapters          # Implementações de adaptadores
│   │   └── persistence       # Repositórios e conexão com BD
│   │       └── database
│   │           └── prisma    # ORM e schema
│   └── presentation          # Camada de apresentação
│       └── http              # Controllers e DTOs
└── config                    # Configurações da aplicação
    └── utils                 # Utilitários como geração de PDFs
```

## 🔧 Tecnologias

- **TypeScript**: Linguagem principal, com tipagem estática
- **NestJS**: Framework backend progressivo baseado em Node.js
- **Prisma**: ORM moderno para TypeScript/Node.js
- **PostgreSQL**: Banco de dados relacional
- **Docker**: Containerização da aplicação e serviços
- **PDF-Lib**: Biblioteca para manipulação de PDFs
- **JWT e Passport**: Autenticação e autorização
- **Jest**: Framework de testes
- **ESLint e Prettier**: Garantia de qualidade e padronização de código
- **Husky e Commitlint**: Automação de verificações e padrões de commit
- **Swagger**: Documentação da API
## ✨ Funcionalidades

O sistema implementa as seguintes funcionalidades:

### 1. Importação de Boletos via CSV

- **Endpoint**: `POST /upload/csv`
- **Funcionalidade**: Importa arquivo CSV com dados de boletos
- **Mapeamento**: Correlaciona automaticamente as unidades externas com os IDs internos dos lotes

### 2. Processamento de Boletos em PDF

- **Endpoint**: `POST /upload/pdf`
- **Funcionalidade**: Processa arquivo PDF com múltiplos boletos
- **Processamento**: Divide o PDF em páginas individuais e associa cada uma ao boleto correspondente
- **Armazenamento**: Salva os boletos individualizados com o ID como nome do arquivo

### 3. Listagem e Filtro de Boletos

- **Endpoint**: `GET /boletos`
- **Funcionalidade**: Lista boletos com opções avançadas de filtro
- **Filtros**: Por nome, valor (inicial/final), ID de lote
- **Paginação**: Suporte à paginação para grandes volumes de dados

### 4. Geração de Relatórios em PDF

- **Endpoint**: `GET /boletos?relatorio=1`
- **Funcionalidade**: Gera um relatório PDF dos boletos filtrados
- **Retorno**: Base64 do PDF gerado para visualização ou download

## 🚀 Como Executar

### Pré-requisitos

- Docker e Docker Compose
- Node.js (recomendado v18+)
- Yarn ou NPM

### Usando Docker

1. **Clone o repositório**:
   ```bash
   git clone [url-do-repositorio]
   cd condominio-api
   ```

2. **Configure o ambiente**:
   ```bash
   cp .env.example .env
   # Edite o arquivo .env conforme necessário
   ```

3. **Inicie os containers**:
   ```bash
   yarn docker:build
   # ou
   npm run docker:build
   ```

4. **Execute as migrações**:
   ```bash
   yarn migration:run
   # ou
   npm run migration:run
   ```

5. **Crie dados de exemplo** (opcional):
   ```bash
   yarn seed:run
   # ou
   npm run seed:run
   ```

6. **Crie PDF de teste** (opcional):
   ```bash
   yarn create:fake:pdf
   # ou
   npm run create:fake:pdf
   ```

Após esses passos, a API estará disponível em `http://localhost:3000`.

### Execução Local

1. **Instale as dependências**:
   ```bash
   yarn install
   # ou
   npm install
   ```

2. **Configure o banco de dados**:
   ```bash
   # Inicie apenas o container do PostgreSQL
   yarn docker:up
   # Execute as migrações
   yarn migration:run
   ```

3. **Inicie a aplicação**:
   ```bash
   yarn start:dev
   # ou
   npm run start:dev
   ```

## 📚 Documentação da API

A documentação completa da API está disponível via Swagger:

```
http://localhost:3000/api
```

## 🧪 Testes

O projeto inclui testes unitários e de integração para garantir a qualidade do código:

```bash
# Executar todos os testes
yarn test

# Executar testes com watch mode
yarn test:watch

# Verificar cobertura de testes
yarn test:cov
```

## 📋 Padrões de Código

O projeto segue rigorosos padrões de código e contribuição:

- **SOLID**: Princípios para código orientado a objetos de qualidade
- **Clean Code**: Nomes significativos, funções pequenas e bem definidas
- **Conventional Commits**: Padrão para mensagens de commit
- **ESLint e Prettier**: Garantia de estilo consistente
- **Testes Automatizados**: Cobertura mínima de código

## 🔒 CI/CD e Qualidade

O projeto utiliza GitHub Actions para:

- **Build automatizado**: Garante que o código compila corretamente
- **Testes automáticos**: Executa todos os testes em cada PR/commit
- **Linting e formatação**: Verifica o estilo do código
- **SonarQube**: Análise estática para identificar problemas de qualidade
