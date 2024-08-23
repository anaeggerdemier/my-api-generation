const express = require('express');
const { Pool } = require('pg');
const { body, param, validationResult } = require('express-validator');
const createError = require('http-errors'); // Creating fancy HTTP errors

const router = express.Router();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false }
});

// Functions to interact with the database
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

//  Middleware to ensure names are valid
const validateName = [
    body('name')
        .trim() // Remove any extra spaces
        .isString().withMessage('Name must be a string, not a number or something else!')
        .notEmpty().withMessage('Name is required. Can’t leave it blank!')
        .isLength({ min: 3, max: 50 }).withMessage('Name must be between 3 and 50 characters long. Not too short, not too long!')
];

//  Middleware to ensure IDs are valid
const validateId = [
    param('id').isInt({ gt: 0 }).withMessage('ID must be a positive integer. No negative numbers or non-numbers!')
];

//  Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Global error handler for unexpected issues
const errorHandler = (err, req, res, next) => {
    console.error('Unexpected Error:', err.message);
    res.status(err.status || 500).json({ error: err.message || 'Oops! Something went wrong.' });
};

// CREATE - Adding a new user
router.post('/', validateName, handleValidationErrors, async (req, res, next) => {
    try {
        const { name } = req.body;
        const newUser = await createUser(name);
        res.status(201).json(newUser);
    } catch (error) {
        next(createError(500, 'Error creating user: ' + error.message));
    }
});

//  READ ALL - Get a list of users with pagination
router.get('/', async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        if (isNaN(limit) || isNaN(offset)) {
            return res.status(400).json({ error: 'Invalid pagination parameters. Make sure the numbers are correct!' });
        }

        // Some filter
        const users = await getUsers(limit, offset);
        res.json(users);
    } catch (error) {
        next(createError(500, 'Error fetching users by ID: ' + error.message));
    }
});

// READ ONE - Get a user by ID
router.get('/:id', validateId, handleValidationErrors, async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const user = await getUserById(userId);
        if (user) {
            res.json(user);
        } else {
            next(createError(404, 'User not found'));
        }
    } catch (error) {
        next(createError(500, 'Error fetching user by ID: ' + error.message));
    }
});

// UPDATE - Modify an existing user
router.put('/:id', validateId, validateName, handleValidationErrors, async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const { name } = req.body;
        const updatedUser = await updateUser(userId, name);
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            next(createError(404, 'User not found. Maybe they ran away?'));
        }
    } catch (error) {
        next(createError(500, 'Error updating user: ' + error.message));
    }
});

// DELETE - Remove a user 
router.delete('/:id', validateId, handleValidationErrors, async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id, 10);
        await deleteUser(userId);
        res.status(204).send(); // No content left, user deleted!
    } catch (error) {
        next(createError(500, 'Error deleting user: ' + error.message));
    }
});

// Use global error handler
router.use(errorHandler);

module.exports = router;
