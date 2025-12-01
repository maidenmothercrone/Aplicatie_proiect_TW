require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

//route imports
const linkedinAuthRoutes = require('./routes/linkedinAuth');
const authRoutes = require('./routes/auth');
const candidateRoutes = require('./routes/candidates');
const experienceRoutes = require('./routes/experience');

const User = require('./models/User');
const Candidate = require('./models/Candidate');
const Experience = require('./models/Experience');

const app = express();
app.use(cors());
app.use(express.json());
const port = 5000;

//register routes
app.use('/api/auth/linkedin', linkedinAuthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/experience', experienceRoutes);

sequelize.sync()
    .then(() => {
        console.log('Database & tables (re)created!');
    })
    .catch((err) => {
        console.error('Unable to create tables, shutting down...', err);
        process.exit(1);
    });

//testing routes
app.get('/api/test', (req, res) => {
    res.json({message: 'API is working!'});
});


module.exports = { app, sequelize };

//start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});