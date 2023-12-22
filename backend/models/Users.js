const mongoose=require("mongoose");
const { Schema } = mongoose;
const UsersSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    // Date:{
    //     type:Date,
    //     required:Date.now
    // },
  });

  module.exports=mongoose.model('user',UsersSchema);