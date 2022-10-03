
const mongoose= require('mongoose');
const AddLineman= mongoose.Schema({
    Name:{type:String, require:true},
    Password:{type:String, required:true, minLength:6},
    Aadhar:{type:String, require:true},
    Email:{type:String, require:true},
    Mobile:{type:Number, require:true},
    Role:{type:String, require:true},
    JEid:{type:String, require:true}
    
    });
    

     const Add_lineman= new mongoose.model("LoginAll", AddLineman);

     module.exports=Add_lineman;