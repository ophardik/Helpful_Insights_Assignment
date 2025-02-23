const mongoose=require("mongoose");
const candidateSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address",
        ],
    },
    phone:{
        type:String,
        required:true,
        match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    position:{
        type:String,
        required:true
    },
})
const candidateModel=mongoose.model("Candidate",candidateSchema);
module.exports=candidateModel