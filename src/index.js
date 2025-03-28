// require('dotenv').config(); // Load environment variables from .env file    
import 'dotenv/config';

import express from 'express';
const app = express();

import connectDB from './db/index.js'; // Import the connectDB function from db/index.js

/*
import mongoose from 'mongoose';
import { DB_NAME } from './constants';

async function connectDB(){
    try{
        await mongoose.connect( ` ${process.env.MONGODB_URI}/${DB_NAME}`);
         
        // if express is not able to connect to db, it will throw an error
        app.on("error", (err) => {
            console.log(`Express not able to connect to db : ${err}`);
            throw err;
        });
        // if everything is fine, it will start the server
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }
    catch(error){
        console.log( `Error: ${error}`);
        throw error;
    }
}
    ****/
connectDB();


const port = process.env.PORT || 3000;
app.get('/', (req, res) => {    
    res.send('Hello World!');
});


