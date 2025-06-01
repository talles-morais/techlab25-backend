# Techlab 2025 - Backend API

Este repositório contém o código-fonte para a aplicação **backend** do desafio Techlab 2025. Ele é responsável por fornecer a API que gerencia autenticação, contas bancárias, transações, categorias e usuários, integrando com o banco de dados relacional via **TypeORM**.

## Sumário

- [Techlab 2025 - Backend API](#techlab-2025---backend-api)
  - [Sumário](#sumário)
  - [Introdução](#introdução)
  - [Modelagem do sistema](#modelagem-do-sistema)
    - [Modelagem do banco de dados](#modelagem-do-banco-de-dados)
    - [Documentação da API](#documentação-da-api)
  - [Planejamento de desenvolvimento](#planejamento-de-desenvolvimento)
    - [Utilização do Gitflow](#utilização-do-gitflow)
  - [Ferramentas e tecnologias escolhidas](#ferramentas-e-tecnologias-escolhidas)
  - [Estrutura de pastas](#estrutura-de-pastas)
  - [Como instalar e rodar o projeto](#como-instalar-e-rodar-o-projeto)
    - [1. Clone o repositório](#1-clone-o-repositório)
    - [2. Configure o ambiente com Docker](#2-configure-o-ambiente-com-docker)
    - [3. Instale as dependências](#3-instale-as-dependências)
    - [4. Configure as variáveis de ambiente](#4-configure-as-variáveis-de-ambiente)
    - [5. Rode a aplicação](#5-rode-a-aplicação)
    - [6. Execute os testes](#6-execute-os-testes)
  - [Minhas dificuldades](#minhas-dificuldades)
  - [Meus acertos e aprendizados](#meus-acertos-e-aprendizados)
  - [O que eu gostaria de ter feito a mais?](#o-que-eu-gostaria-de-ter-feito-a-mais)
  - [Conclusão](#conclusão)

## Introdução

Seguindo os requisitos do desafio, desenvolvi a **API RESTful** responsável pela lógica de negócios e persistência dos dados da aplicação de organização financeira pessoal. A API oferece endpoints seguros para autenticação de usuários, gestão de contas bancárias, categorias de transações e registros financeiros.

Por se tratar de um backend para uma aplicação web moderna, priorizei boas práticas de segurança, validação de dados e documentação automática da API.

## Modelagem do sistema

### Modelagem do banco de dados

Utilizei **TypeORM** para realizar o mapeamento objeto-relacional (ORM), garantindo uma modelagem sólida, alinhada com as necessidades da aplicação. O banco de dados utilizado é o **PostgreSQL**.

A modelagem foi inicialmente planejada no **dbdiagram.io** com a linguagem **DBML** para organizar as entidades e seus relacionamentos.

👉 [Diagrama Entidade Relacionamento](https://dbdiagram.io/d/techLab-682a846b1227bdcb4edf97fc)

As principais entidades do sistema incluem:

- **User**: informações de autenticação e perfil.
- **BankAccount**: dados de contas bancárias do usuário.
- **Transaction**: registros financeiros (entradas e saídas).
- **Category**: categorias personalizadas para classificar transações.

### Documentação da API

Utilizei o **Swagger** para documentar automaticamente todos os endpoints da API.

Após rodar a aplicação, a documentação interativa pode ser acessada via:
**[http://localhost:3333/api-docs](http://localhost:3333/docs)**

## Planejamento de desenvolvimento

Apliquei conceitos de desenvolvimento ágil, organizando as tarefas via **Kanban** no **Trello**. As funcionalidades foram priorizadas conforme a criticidade e complexidade.

### Utilização do Gitflow

O fluxo de desenvolvimento seguiu o **Gitflow**, garantindo organização e segurança nas entregas:

- `main`: branch de produção.
- `develop`: branch de desenvolvimento.
- `feature/*`: novas funcionalidades.
- `hotfix/*`: correções rápidas.
- `release/*`: preparação para deploy.

Essa abordagem minimizou conflitos e manteve o histórico limpo e compreensível.

## Ferramentas e tecnologias escolhidas

- **Node.js + Express**
  Framework para construção de servidores HTTP, amplamente utilizado e com excelente performance.

- **TypeORM**
  ORM para TypeScript, simplificando a interação com o banco de dados relacional.

- **PostgreSQL**
  Sistema de banco de dados robusto e confiável, ideal para aplicações com múltiplas relações.

- **TypeScript**
  Tipagem estática para garantir maior segurança e previsibilidade no desenvolvimento.

- **Zod**
  Validação de schemas e dados recebidos via requisições HTTP.

- **JWT + Cookie HTTPOnly**
  Autenticação via tokens seguros e armazenamento em cookies protegidos contra XSS.

- **Swagger (swagger-jsdoc + swagger-ui-express)**
  Documentação automática e interativa da API.

- **Jest**
  Framework de testes para garantir a qualidade e estabilidade do código.

- **Argon2**
  Algoritmo Argon2 para hash de senhas. (ganhou o Password Hashing Competition (PHC) e é bastante recomendado por especialistas em segurança).

- **Docker e Docker Compose**
  Utilizados para provisionar os serviços do PostgreSQL e do PGAdmin de forma isolada e prática. Facilitando o esforço de configuração inicial do projeto.

## Estrutura de pastas

```bash
src/                             # Código-fonte principal da aplicação
├── config                      # Configurações globais (ex.: variáveis, ambientes)
│   └── config.ts
│
├── controllers                 # Camada de entrada: recebem requisições HTTP e delegam para serviços
│   ├── bank-account.controller.ts
│   ├── category.controller.ts
│   ├── transaction.controller.ts
│   └── user.controller.ts
│
├── dtos                        # Data Transfer Objects: definem formato de entrada/saída dos dados
│   ├── bank-account
│   │   ├── create-bank-account.dto.ts
│   │   └── update-bank-account.dto.ts
│   ├── category
│   │   ├── create-category.dto.ts
│   │   └── update-category.dto.ts
│   ├── transaction
│   │   ├── create-transaction.dto.ts
│   │   └── update-transaction.dto.ts
│   └── user
│       ├── create-user.dto.ts
│       ├── create-user-response.dto.ts
│       ├── login-user.dto.ts
│       └── login-user-response.dto.ts
│
├── entities                    # Mapeamento das tabelas no banco de dados via ORM
│   ├── BankAccount.ts
│   ├── Category.ts
│   ├── CreditCard.ts
│   ├── CreditInvoice.ts
│   ├── ScheduledTransaction.ts
│   ├── Transaction.ts
│   └── User.ts
│
├── enums                       # Tipos fixos e constantes usadas no domínio
│   ├── BankAccountType.enum.ts
│   ├── CreditInvoiceStatus.enum.ts
│   ├── Recurrence.enum.ts
│   ├── ScheduledTransactionsStatus.enum.ts
│   └── TransactionType.enum.ts
│
├── middlewares                 # Interceptadores de requisições (ex.: autenticação, erros)
│   ├── auth.middleware.ts
│   └── error-handler.ts
│
├── repositories                # Camada de acesso a dados: consultas e manipulações no banco
│   ├── bank-account.repository.ts
│   ├── category.repository.ts
│   ├── transaction.repository.ts
│   └── user.repository.ts
│
├── routes                      # Definição das rotas e vinculação com os controllers
│   ├── bank-account.routes.ts
│   ├── category.routes.ts
│   ├── transaction.routes.ts
│   └── user.routes.ts
│
├── services                    # Camada de lógica de negócio: regras e processos
│   ├── bank-account.service.ts
│   ├── category.service.ts
│   ├── transaction.service.ts
│   └── user.service.ts
│
├── utils                       # Funções utilitárias e helpers
│   ├── hash.ts                   # Funções para criptografia
│   └── http-error.ts             # Manipulação de erros HTTP
│
├── data-source.ts                 # Configuração da conexão com o banco de dados (TypeORM)
├── index.ts                       # Ponto de entrada principal
├── migration/                     # Scripts de migração do banco de dados
├── routes.ts                      # Agregador geral de rotas
├── server.ts                      # Inicialização do servidor (Express ou outro)
└── swagger.ts                     # Configuração da documentação com Swagger
tests/                           # Testes automatizados
├── controllers                  # Testes da camada de controladores
│   ├── category
│   │   ├── CreateCategory.spec.ts
│   │   ├── DeleteCategory.spec.ts
│   │   ├── GetAllCategories.spec.ts
│   │   └── UpdateCategory.spec.ts
│   ├── helpers                 # Funções auxiliares para setup de testes
│   │   ├── makeSutForCategoryController.ts
│   │   ├── makeSutForUserController.ts
│   │   └── mockUtils.ts
│   └── user
│       ├── LoginUser.spec.ts
│       └── RegisterUser.spec.ts
│
├── services                    # Testes da camada de serviços
│   ├── helpers                 # Função auxiliar para setup de testes de serviços
│   │   └── makeSutForTransactionService.ts
│   └── transaction
│       ├── CreateTransactionService.spec.ts
│       └── UpdateTransactionService.spec.ts
```

## Como instalar e rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/talles-morais/techlab25-backend.git
cd techlab25-backend
```

### 2. Configure o ambiente com Docker

Certifique-se de ter o **Docker** e o **Docker Compose** instalados na sua máquina.

Para iniciar o banco de dados e o PGAdmin, rode o seguinte comando na raiz do projeto:

```bash
docker-compose up -d
```

Isso iniciará automaticamente o PostgreSQL e o PGAdmin conforme configurado no `docker-compose.yml` do repositório.

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto seguindo o modelo disponível em `.env.example`.

### 5. Rode a aplicação

```bash
npm run dev
```

O servidor será iniciado em:
**[http://localhost:3333](http://localhost:3333)**

### 6. Execute os testes

```bash
npm test
```

## Minhas dificuldades

- **Aprendizado sobre testes unitários com Jest:**
  Antes deste projeto, eu nunca havia estudado ou aplicado testes unitários de forma prática. Foi desafiador entender os conceitos fundamentais de testes automatizados (como mocks). Tirei muitas das minhas dúvidas durante a mentoria com o Allan, debatendo sobre o uso de testes unitários nos controllers ou nos services e, com o auxílio do Allan, cheguei a conclusão de que faria mais sentido, para este projeto, focar em testar os services pois são eles que detêm as regras de negócio da minha aplicação.

- **Utilização de transações e rollback com TypeORM:**
  Outra dificuldade importante foi implementar corretamente o controle de transações e rollback nos serviços relacionados às operações financeiras, como a criação e atualização de transações bancárias. Foi essencial garantir que, caso alguma parte do processo falhasse, nenhuma alteração inconsistente fosse persistida no banco de dados.

## Meus acertos e aprendizados

- **Implementação do Express na versão 5:**
  O express evoluiu na questão do tratamento de erros assíncronos que não eram tratados de forma automática na versão 4, era necessário que fosse utilizado um bloco try-catch e o erro fosse tratado manualmente. Na versão 5 isto foi otimizado e o Express captura os lançamentos de erro automaticamente, o que me permitiu criar um middleware de Error Handling que captura os erros dos endpoints e os devolve em formatos padronizados, facilitando a comunicação através da API.

- **Login utilizando HTTPOnly Cookies:**
  Método de login mais seguro e sem acesso ao cookie pelo lado do cliente. Facilitou a integração com o frontend e os testes por meios de ferramentas de testes de requisição HTTP (como Insomnia e Postman), pois os cookies são enviados automaticamente em cada solicitação ao backend.

- **Testes automatizados:**
  A introdução de testes com Jest proporcionou maior confiança na estabilidade do sistema. Um dos meus acertos importantes nesse processo foi, graças à dica da Ludimilla em uma das mentorias, utilizar o padrão SUT (System Under Test) types nos testes. Essa prática ajudou a estruturar melhor a criação e o uso das instâncias dos serviços e controllers dentro dos testes, tornando-os mais organizados, reutilizáveis e fáceis de manter.

- **Documentação automatizada:**
  A integração do Swagger trouxe clareza e facilitou a comunicação sobre os endpoints da API, permitindo que qualquer pessoa interessada pudesse entender e testar a aplicação rapidamente.

## O que eu gostaria de ter feito a mais?

- Implementado mais testes para garantir maior confiabilidade ao sistema. Devido ao curto período de tempo e minha inexperiência com o tema, não atingi os níveis de cobertura de testes que gostaria de ter atingido. Poderia ter utilizado metodologias como TDD (Test Driven Design) para desenvolver funcionalidades testáveis desde sua concepção.
- Implementado as funcionalides de cartão de crédito e fatura de cartão de crédito. Considerei como funcionalidades essenciais para o sistema mas, no fim, não consegui implementar por falta de tempo. Estas funcionalidades seriam cruciais para proporcionar uma visão mais ampla do usuário sobre suas finanças.
- Implementação de transações agendadas e recorrentes (como pagamento de boletos), para garantir que o usuário consiga prever os seus gastos futuros.
- Implementação de metas financeiras onde o usuário poderia escolher prazos, métodos e valores alvo para acompanhar seus gastos, economizar dinheiro ou concluir compras desejadas.
- Implementação de um serviço de notificação para avisar sobre o vencimento de transações recorrentes, pagamento da fatura do cartão e acompanhamento da evolução de metas financeiras.

## Conclusão

Ao longo deste desafio, aprendi muito não apenas sobre aspectos técnicos, mas também sobre como organizar meu próprio processo de desenvolvimento. Percebi a importância de priorizar tarefas, focando primeiro nas funcionalidades essenciais antes de partir para implementações mais complexas ou complementares. Esse aprendizado foi fundamental para conseguir entregar uma aplicação funcional dentro do prazo.

Além disso, entendi que minha empolgação com o projeto, embora positiva, também pode ser um fator de risco quando não está equilibrada com uma visão realista sobre tempo e capacidade. Foi um exercício valioso de autoconhecimento e gestão de expectativas.

Outro ponto importante foi o hábito que desenvolvi de anotar diariamente minhas dificuldades, acertos e aprendizados. Esse registro constante me ajudou a refletir sobre o que estava funcionando bem e o que precisava ser ajustado, tornando o processo de desenvolvimento mais consciente e iterativo.

Sinto que evoluí significativamente como desenvolvedor ao encarar desafios técnicos que antes me pareciam complexos, como a implementação de testes automatizados, o uso adequado de transações com TypeORM e a configuração de autenticação segura com cookies HTTPOnly.

Por fim, este projeto me mostrou na prática como é importante equilibrar qualidade, escopo e tempo, e me deixou motivado a continuar evoluindo e aprimorando minhas habilidades em projetos futuros.

Quero também agradecer à equipe da Tech4Humans pelo apoio nas mentorias e pela organização desse evento, que foi muito divertido de participar — tanto nesta edição quanto na anterior.
