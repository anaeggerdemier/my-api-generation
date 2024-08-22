require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./api/users');// Importa o arquivo que contém as rotas de usuários

const app = express();

// Middleware
app.use(express.json());

// Usar as rotas de usuários
app.use('/api/users', userRoutes);

// Configuração da Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
