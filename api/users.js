require('dotenv').config(); // Carregar variáveis de ambiente do arquivo .env
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Configuração do PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Funções para interagir com o banco de dados
const getUsers = async () => {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
};

const getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const createUser = async (name) => {
  const result = await pool.query('INSERT INTO users (name) VALUES ($1) RETURNING *', [name]);
  return result.rows[0];
};

const updateUser = async (id, name) => {
  const result = await pool.query('UPDATE users SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
  return result.rows[0];
};

const deleteUser = async (id) => {
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
};

// Endpoints CRUD

// CREATE
app.post('/api/users', async (req, res) => {
  try {
    const { name } = req.body;
    const newUser = await createUser(name);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ ALL
app.get('/api/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
app.put('/api/users/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const updatedUser = await updateUser(req.params.id, name);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE
app.delete('/api/users/:id', async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exporta a função para o Vercel
module.exports.handler = serverless(app);
