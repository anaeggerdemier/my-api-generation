# My API

**My API** é uma aplicação RESTful desenvolvida com Node.js e Express, projetada para gerenciar usuários em um banco de dados PostgreSQL. Esta API oferece uma interface para realizar operações básicas de CRUD (Criar, Ler, Atualizar e Deletar) e inclui recursos adicionais, como paginação, para facilitar a manipulação de grandes conjuntos de dados.

## Descrição

O projeto tem como objetivo criar uma API simples para a gestão de usuários. Foi desenvolvido para demonstrar habilidades em desenvolvimento backend, incluindo:

1. Integração com banco de dados PostgreSQL.
2. Validação de dados de entrada.
3. Manipulação de erros e resposta adequada para diferentes cenários.

A aplicação é configurada para ser facilmente extensível e adaptável a diferentes cenários de uso.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript no lado do servidor, permitindo construir aplicações escaláveis e rápidas.
- **Express**: Framework web para Node.js que simplifica o roteamento e a criação de APIs.
- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional poderoso e confiável para armazenamento e consulta de dados.
- **Express-Validator**: Biblioteca para validação e sanitização de dados de entrada.
- **dotenv**: Gerenciador de variáveis de ambiente para configuração sensível ao ambiente.
- **cors**: Middleware para habilitar CORS (Cross-Origin Resource Sharing), permitindo que a API seja acessada de diferentes origens.
- **compression**: Middleware para compressão de respostas HTTP, melhorando a performance da API.

## Funcionalidades

1. **CRUD Completo**: Implementação das operações básicas para gerenciar usuários:
   - **Criar**: Adicionar novos usuários.
   - **Ler**:
     - Recuperar todos os usuários com suporte a paginação.
     - Buscar um usuário específico por ID.
   - **Atualizar**: Modificar informações de um usuário existente.
   - **Excluir**: Remover um usuário pelo ID.

2. **Paginação**: Permite recuperar usuários em páginas para melhor gerenciamento de grandes conjuntos de dados.

3. **Validação de Dados**: Valida entradas para garantir que os dados enviados são corretos e completos.

## Exemplos de Uso

### Criar Usuário

- **Método:** `POST /api/users`
- **Corpo da Requisição:**
  ```json
  {
      "name": "Nome do Usuário"
  }
## Instalação e Execução

1. **Clone o repositório:**

    ```bash
    git clone <URL do repositório>
    ```

2. **Navegue até o diretório do projeto:**

    ```bash
    cd <diretório do projeto>
    ```

3. **Instale as dependências:**

    ```bash
    npm install
    ```

4. **Crie um arquivo `.env` na raiz do projeto e adicione a variável `DATABASE_URL` com a URL de conexão ao seu banco de dados PostgreSQL.**

5. **Inicie o servidor:**

    ```bash
    npm start
    ```

   Para desenvolvimento, use:

    ```bash
    npm run dev
    ```

6. **A API estará disponível em [http://localhost:3000](http://localhost:3000).**

