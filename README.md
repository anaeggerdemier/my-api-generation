# NodeUser API

**NodeUser API** is a RESTful application developed with Node.js and Express to manage users in a PostgreSQL database. It supports CRUD operations and includes additional features such as pagination and data validation.

## Description

This project implements a RESTful API for managing users using Node.js and PostgreSQL. It supports CRUD operations with input validation and error handling. The API is documented with Swagger (OpenAPI) for improved developer integration and provides scalable, secure management of user data.

## Tech Stack

- [![Node.js](https://img.shields.io/badge/Node.js-20.8.0-green)](https://nodejs.org/)
- [![Express](https://img.shields.io/badge/Express-4.18.2-blue)](https://expressjs.com/)
- [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.4-blue)](https://www.postgresql.org/)
- [![Swagger](https://img.shields.io/badge/Swagger-4.10.0-brightgreen)](https://swagger.io/)
- [![dotenv](https://img.shields.io/badge/dotenv-16.0.0-orange)](https://www.npmjs.com/package/dotenv)
- [![cors](https://img.shields.io/badge/cors-2.8.5-lightgrey)](https://www.npmjs.com/package/cors)
- [![compression](https://img.shields.io/badge/compression-1.7.4-blueviolet)](https://www.npmjs.com/package/compression)

## Features

- **CRUD Operations**: Create, Read, Update, and Delete users.
- **Pagination**: Handle large datasets efficiently.
- **Data Validation**: Ensure data integrity with input validation.

## API Endpoints

Refer to the [API Documentation](http://localhost:3000/api-docs) for a complete list of endpoints and their usage.

## Installation and Setup

1. **Clone the repository:**

    ```bash
    git clone <repository URL>
    ```

2. **Navigate to the project directory:**

    ```bash
    cd <project directory>
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Create a `.env` file** and add the `DATABASE_URL` variable with your PostgreSQL connection URL.

5. **Start the server:**

    ```bash
    npm start
    ```

   For development, use:

    ```bash
    npm run dev
    ```

6. **The API will be available at** [http://localhost:3000](http://localhost:3000).

## Error Handling

- **Validation Errors**: Returns a 400 status code with details about validation errors.
- **Server Errors**: Returns a 500 status code for unexpected server issues.

## Documentation

For detailed API documentation, refer to the [OpenAPI Specification](http://localhost:3000/api-docs).
