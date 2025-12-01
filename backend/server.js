const express = require('express');
const Sequelize = require('sequelize');
const cors = require('cors');

const app = express();
const port = 5000;
const sequelize = new Sequelize  ({
    dialect: 'sqlite',
    storage: 'database/database.sqlite',
    logging: false
})

sequelize.sync()
    .then(() => {
        console.log('Database & tables (re)created!');
    })
    .catch((err) => {
        console.error('Unable to create tables, shutting down...', err);
        process.exit(1);
    });

const User = require('../database/models/User');
const Candidate = require('../database/models/Candidate');
const Experience = require('../database/models/Experience');

//testing routes
app.get('/api/test', (req, res) => {
    res.json({message: 'API is working!'});
});

//start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = { app, sequelize };

app.use(cors());
app.use(express.json());