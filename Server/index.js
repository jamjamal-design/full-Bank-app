const express = require('express')
const app = express ()
require('dotenv').config()
const cors = require('cors')
app.use(cors())
const mongoURI = process.env.MONGO_URI
const port = process.env.PORT || 8080
const mongoose = require('mongoose')
app.use(express.json());
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth');
const bankingRoutes = require('./routes/banking');
const opayRoutes = require('./routes/opay');


app.use('/api/auth', authRoutes);
app.use('/api/banking', bankingRoutes);
app.use('/api/opay', opayRoutes);

mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });


app.get('/', (req, res) => {
    res.json({ message: 'SecureBank API is running!' });
});

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})