import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

import 'dotenv/config'

const connectDB = async () => {
    try {
        
        const dbString = `${process.env.MONGODB_URI}/${DB_NAME}`;
        console.log( "process variables : " , process.env.MONGODB_URI);

        const connectionInstance = await mongoose.connect(dbString);
        console.log("MongoDB connected successfully");
        console.log(`\n MongoDB connected !! DB host : ${connectionInstance.connection.host} \n`);
    } catch (error) {
        console.error(`MongDB connection Error: ${error}`);
        process.exit(1); // Exit process with failure
    }
}       
export default connectDB;