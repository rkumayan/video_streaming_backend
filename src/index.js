// require('dotenv').config(); // Load environment variables from .env file    
import 'dotenv/config';

import express from 'express';
const app = express();

import connectDB from './db/index.js'; // Import the connectDB function from db/index.js

connectDB()
    .then( ()=>{
        app.listen( process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT || 8000}`);
        })
    })
    .catch(    (err) => {
        console.error('Database connection error:', err);
    })


app.get('/', (req, res) => {    
    res.send('Hello World!');
});


