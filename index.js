require('dotenv').config();
const express = require('express');
const path = require('path');
const userRoutes = require('./src/api/users');
const cors = require('cors');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express'); 
const yaml = require('yamljs');

const app = express();
const swaggerDocument = yaml.load('./swagger/swagger.yaml');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/swagger.yaml', express.static(path.join(__dirname, 'swagger', 'swagger.yaml')));

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send({
        message: 'API is running',
        version: '1.0.0',
        endpoints: [
            { method: 'GET', path: '/api/users', description: 'Retrieve all users' },
            { method: 'GET', path: '/api/users/:id', description: 'Retrieve a user by ID' },
            { method: 'POST', path: '/api/users', description: 'Create a new user' },
            { method: 'PUT', path: '/api/users/:id', description: 'Update a user by ID' },
            { method: 'DELETE', path: '/api/users/:id', description: 'Delete a user by ID' }
        ]
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
