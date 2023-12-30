const mongoose =require("mongoose");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const mongoURI=process.env.MONGO_URL;

const connectToMongo = ()=>{
    mongoose.connect(mongoURI).then(()=>{
        console.log("Connected to database successfully.")
    }).catch((err)=>{
        console.log("Could not connect to database.", err)
    });
}

module.exports=connectToMongo;