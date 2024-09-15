require('dotenv').config(); // Loads environment variables

const express = require('express');
const path = require('path');
const userRoutes = require('./src/api/users');
const cors = require('cors');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const helmet = require('helmet');

const app = express();
const swaggerDocument = yaml.load(path.join(__dirname, 'swagger', 'swagger.yaml'));

// Main configurations
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// CORS configuration to allow requests from specific origins
app.use(cors({
    origin: ['https://my-api-generation.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware for response compression to enhance performance
app.use(compression());

// Security headers to protect against common vulnerabilities
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://unpkg.com"],
            connectSrc: ["'self'", "https://my-api-generation.onrender.com", "http://localhost:3000"],
            imgSrc: ["'self'", "data:"],
            styleSrc: ["'self'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com", "'unsafe-inline'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"]
        },
    },
    referrerPolicy: { policy: 'strict-origin' },
    frameguard: { action: 'sameorigin' }
}));

// Route for Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serves the Swagger YAML file directly
app.use('/swagger.yaml', express.static(path.join(__dirname, 'swagger', 'swagger.yaml')));

// Routes for user API
app.use('/api/users', userRoutes);

// Root endpoint for health check
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

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Error stack:', err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong',
        error: process.env.NODE_ENV === 'development' ? err : {} // Include error details only in development
    });
});

const PORT = process.env.PORT || 3000; // Use port from environment or default to 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
