require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./api/users');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running');
});

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
