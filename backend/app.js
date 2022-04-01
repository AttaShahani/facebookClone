const express = require("express");
const app = express();
const dotenv = require("dotenv");
const errorMiddleware = require("./middlewares/errorMiddleware");

// config 
dotenv.config({path:"backend/config/config.env"});

// middlewares 
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// Routes Imports
const userRoutes = require("./routes/userRoutes")
// Defining / Using Routes
app.use("/api/v1",userRoutes)

// Error Middleware 
app.use(errorMiddleware);

module.exports = app;