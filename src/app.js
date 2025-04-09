import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();
// set up middleware for CORS
app.use(cors({
    origins: process.env.CORS_ORIGIN || "*",
}));

// set up middleware for parsing JSON and URL-encoded data
app.use(express.json( {limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));   
app.use(express.static("public"));
app.use(cookieParser());


// routes import
import userRouter from "./routes/user.routes.js";

// routes declaration
app.use("/users" , userRouter);

export {app};