const mongoose = require("mongoose");

exports.dbConn = async ()=>{
    mongoose.connect(process.env.MONGO_URI).then((conn)=>{
        console.log(`DB Connected: ${conn.connection.host}`)
    })
}