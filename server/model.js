
const mongoose= require('mongoose');
const userName= mongoose.Schema({
Email_ID:{type:String, require:true},
Password:{type:String, required:true, minLength:6},
Role:{type:String, require:true}

});

const User= new mongoose.model("login", userName);
module.exports=User;


