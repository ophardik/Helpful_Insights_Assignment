const mongoose=require("mongoose");
require("dotenv").config()

async function connectToDB(){
    const connection=await mongoose.connect(process.env.MONGO_URI)
    console.log("connect to database")
}
module.exports=connectToDB