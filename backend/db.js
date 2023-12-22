const mongoose=require("mongoose");
const mongoURI="mongodb://localhost:27017/iNotebook"

const connectTomongo=async()=>{
    await mongoose.connect(mongoURI)
    console.log("connected to mongo successfully");
}
module.exports=connectTomongo;