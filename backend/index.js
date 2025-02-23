const express=require("express");
const connectToDB = require("./config/db");
const candidateRoute=require("./Routes/candidateRoute")
const cors=require("cors")
const app=express();

app.use(cors());
app.use(express.json());
connectToDB()

app.use("/api",candidateRoute)
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})