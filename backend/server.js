const app = require("./app");
const dotenv = require("dotenv");
const {dbConn} = require("./config/db")

// Handling Uncaught Exception 
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`)
    console.log(`Server Shutting Down Due To Uncaught Exception`)
    process.exit(1)
})

// config 
dotenv.config({path:"backend/config/config.env"});

//DB Connection
dbConn();

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is running at http://localhost:${process.env.PORT}`)
});

// Unhandled Promise Rejection 
process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}\n Stack:${err.stack}`);
    console.log(`Server Shutting Down Due To Unhandled Rejection`);

    server.close(()=>{
        process.exit(1);
    })
})