# Firebase Functions + Firestore DDD Project

Este projeto foi desenvolvido utilizando **Firebase Functions** e **Firestore** para implementar um sistema de registro que incrementa automaticamente um ID. O projeto segue os princípios de **Domain-Driven Design (DDD)** e **SOLID**, e está configurado para rodar localmente utilizando o **Firebase Emulator**.

## Arquitetura Utilizada

### Domain-Driven Design (DDD)

- O **domínio** da aplicação está bem encapsulado. As regras de negócio são implementadas dentro da camada de domínio (`domain`).
- A responsabilidade de persistência de dados foi abstraída através de um repositório (`IRecordRepository`), permitindo que seja substituído se necessário.
- A aplicação foi organizada em camadas:
  - **Domain**: Contém as entidades e interfaces que definem a lógica central.
  - **Application**: Casos de uso, que implementam a lógica de negócios.
  - **Infrastructure**: Implementação concreta dos repositórios e integrações com Firebase.
  - **Interfaces**: Funções de interface, como a função HTTP que expõe o serviço.

### SOLID

- **Single Responsibility Principle (SRP)**: Cada classe tem uma única responsabilidade. As funções HTTP não contêm lógica de negócios, que está separada nos casos de uso.
- **Dependency Inversion Principle (DIP)**: A lógica de negócio depende de abstrações (interfaces), e não de implementações concretas.
- **Open/Closed Principle (OCP)**: O código é aberto para extensões (ex: adicionar um novo serviço de persistência), mas fechado para modificações.

## Funcionalidades

- **Firebase Functions**: Implementação de funções HTTP que criam novos registros no Firestore.
- **Firestore**: Persistência de dados utilizando o Firestore.
- **Trigger Firestore (onCreate)**: Sempre que um novo documento é criado, o trigger preenche o campo `increment_id` com o próximo ID disponível.

## Requisitos

- **Node.js** v18+
- **Firebase CLI**
- **Jest** para testes unitários
- **TypeScript** como linguagem principal

## Estrutura do Projeto

```bash
/src
  /application
    - createRecordService.ts    # Caso de uso para criar registros
    - incrementIdRecordTriggers # Trigger Firestore para setar o increment_id
  /domain
    - Ilogger.ts                # Interface do logger
    - IRecordRepository.ts      # Interface do repositório
    - record.ts                 # Entidade Record
  /infra
    - firebaseRepository.ts     # Implementação do repositório Firebase
  /interfaces
    - recordController.ts       # Função HTTP para criar registros
  /shared
    - validationError.ts        # Classe para erro de validação
/tests
  /unit # Testes de unidade com jest
  /integration # Testes de integracão com Jest
```

## Configuração e Execução

### Instalação das Dependências

Após clonar o repositório, instale as dependências no diretório **functions**:

```bash
npm install
```

### Configuração do Firebase

Certifique-se de ter o Firebase CLI instalado e configurado:

```bash
npm install -g firebase-tools
firebase login
```

### Inicialização do Firebase

Inicie o emulador local do Firebase. Isso irá simular o ambiente Firebase (Firestore e Functions) em sua máquina local:

```bash
npm run emulador
```

### Testando a Função HTTP Localmente

Utilize um cliente HTTP como Postman, Insomnia ou curl para testar a função localmente. Exemplo de chamada com curl:

```bash
curl -X POST http://localhost:4000/YOUR_PROJECT_ID/us-central1/createRecord \
-H "Content-Type: application/json" \
-d '{"name": "Test Record"}'
```

### Verificando os Resultados no Firestore

Você pode verificar os documentos criados no painel do Firestore emulador:

```bash
http://localhost:8080/firestore
```

### Executando os Testes

Os testes unitários utilizam o Jest. Para rodar os testes:

```bash
npm run test
```

Os testes e2e utilizam o Jest. Para rodar os testes primeiro é necessário configurar a url do serviço no arquivo **createRecord.e2e.ts** ou configurar a variável de ambiente **API_BASE_URL**

```bash
npm run test:e2e
```

### Funções do Projeto

#### Função HTTP

A função HTTP recebe requisições POST e cria um novo registro no Firestore com o atributo **name**. Exemplo de payload:

```json
{
  "name": "Novo Registro"
}
```

#### Trigger Firestore

Cada vez que um documento é criado na coleção **records**, o trigger Firestore **onCreate** é acionado, e o campo **increment_id** é atualizado com o próximo ID disponível.

### Testes

- Testes unitários foram criados usando Jest para garantir que o **increment_id** está sendo gerado corretamente.
- Mock do repositório foi utilizado para simular o comportamento do Firestore nos testes.

### Tecnologias Utilizadas

- Firebase Functions para criação de funções serverless.
- Firestore para armazenamento e consulta de dados.
- Jest para testes automatizados.
- TypeScript para tipagem estática e melhor legibilidade.

## Conclusão

Este projeto foi desenvolvido para demonstrar como aplicar princípios de DDD e SOLID em uma aplicação escalável utilizando Firebase e Firestore. O código está organizado em camadas, facilitando a manutenção, testes e futura extensão do projeto.
