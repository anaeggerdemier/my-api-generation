const express = require('express');
const { Pool } = require('pg');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Configuração do PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false }
});

// Funções para interagir com o banco de dados
const getUsers = async (limit, offset) => {
    const result = await pool.query('SELECT * FROM users LIMIT $1 OFFSET $2', [limit, offset]);
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
router.post('/', [
    body('name').isString().notEmpty().withMessage('Name is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name } = req.body;
        const newUser = await createUser(name);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// READ ALL with pagination
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const users = await getUsers(limit, offset);
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// READ ONE
router.get('/:id', async (req, res) => {
    const userId = parseInt(req.params.id, 10); // Converte o ID para um número
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    
    try {
        const user = await getUserById(userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user by ID:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// UPDATE
router.put('/:id', [
    body('name').isString().notEmpty().withMessage('Name is required')
], async (req, res) => {
    const userId = parseInt(req.params.id, 10); // Converte o ID para um número
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name } = req.body;
        const updatedUser = await updateUser(userId, name);
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    const userId = parseInt(req.params.id, 10); // Converte o ID para um número
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        await deleteUser(userId);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
