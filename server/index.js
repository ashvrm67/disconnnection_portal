const mongoose= require('mongoose');
const  bcrypt= require('bcrypt');
const express= require('express');
const cors= require('cors');
const User=require('./model');
const Add_lineman= require('./model_addlineman');
const Consumers= require('./model_consumer');
const { response } = require('express');
const multer= require('multer');

const imageStorage = multer.diskStorage({

     destination:(req,file,cb)=>{
        cb(null,"./uploads");

     },
     filename:(req,file,cb)=>{
        cb(null,file.originalname);
     

    }
});
//const upload = multer({storage:imageStorage});

const upload = multer({
    storage: imageStorage,
    limits:{fileSize: 10000000000000},
 });
//mongodb://localhost:27017
//mongodb+srv://ashvrm67:openmongodb2022@cluster0.wdwitjx.mongodb.net/MongoSampleDB?retryWrites=true&w=majority
const app= express();
const PORT=8080;
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://ashvrm67:openmongodb2022@cluster0.wdwitjx.mongodb.net/Disconnection?retryWrites=true&w=majority')
.then(()=>console.log("connection OK") )
.catch((e)=>console.log("error in connection"));

//mongodb+srv://ashvrm67:<password>@cluster0.wdwitjx.mongodb.net/?retryWrites=true&w=majority
//mongodb+srv://ashvrm67:openmongodb2022@cluster0.wdwitjx.mongodb.net/Disconnection
app.listen(PORT,()=>{

console.log(`server listing at ${PORT}`);

})

app.post('/upload_consumer', upload.single("myfile"), async(req, res)=>
{
    
console.log('inside upload consumer');
console.log("req", req.body, req.file)
// const file = req.file.filename;
// console.log({file});
//res.send(file);

})

app.post('/work_allocation', async (req, res)=>
{

    let JEid=req.body.JEid;
    const linemanDetail=  await Add_lineman.find({JEid})

    const consumerDetail= await Consumers.find({JEid});
  


    if(consumerDetail && linemanDetail)
    {
     console.log('success');
     res.status(200).json({consumerDetail, linemanDetail})

    }
    else
    {
        console.log('Failure');

    }



})

app.post('/disconnection_report', async (req,res)=>
{
console.log('inside report')
console.log(req.body.JEid);
const reportData = await Consumers.find({$and:[{Jeid: {$eq:req.body.JEid}},{Action_Taken: {$in : ['Not Disconnected','Disconnected']}}]});
if(reportData)
{
    return res.status(200).json(reportData);
}


})

app.post('/works_detail', async(req, resp)=>{
    console.log("work detail");
console.log(req.body.Email);

const result= await Consumers.find({Assigned_lineman_id:req.body.Email});
console.log(result);
if(result)
{
    return resp.status(200).json(result);
}

})

app.post('/upload_action', async(req, res)=>{
let actionObj= req.body.Actionmapping;
console.log({actionObj});
actionObj.map(async(item)=>
{

  let temp=item.Account;
  let result =await Consumers.findOne({'Account_ID':temp+''});
  result.Action_Taken=item.Action;
  result.Action_Date= item.DateTime;
  await result.save();

})
return res.status(200).json('success');

})

app.post('/assign_work', async(req,res)=>{


let arrayObj= req.body.mapping;
console.log(arrayObj);

arrayObj.map(async(item)=>
{
    let temp=item.Account;
    console.log({temp});
  let result =await Consumers.findOne({'Account_ID':temp+''});
 result.Assigned_lineman_id=item.Lineman;

  await result.save();
  console.log(result.Account_ID);


})



return res.status(200).json('success');

})

app.get('/give_lineman', async(req,res)=>
{
    console.log("inside here")
    const user= await Add_lineman.find({});
    
    if(user)
    {
console.log(user);
 return res.status(200).json({message:user});
    }
    else
    {
        console.log("no lineman exist");
        return res.status(200).json({message:'No lineman Exist'});
    }


})

app.get("/", async(req, res)=>{

res.status(200).json({message:"you have reached server"});

})

app.post("/add_lineman", async(req,res)=>{




const user= await Add_lineman.findOne({Email:req.body.email});

if(user)
{

    console.log("Lineman Already exist");
    return res.status(200).json({message:"Exist"});
}
else{

    var newuser= new Add_lineman({
    Name:req.body.name,
    Password:req.body.password,
    Aadhar:req.body.aadhar,
    Mobile:req.body.mobile,
    Email:req.body.email,
    JEid:req.body.JEid,
    Role:"LM"


    });
    newuser.save((error,result)=>{
        if(error)
        {
            console.log(error);
        }
        else{
            console.log("Lineman Added");
            return res.status(200).json({message:"Added"});
        }



    })

}


});

app.post("/delete_lineman", async(req, res)=>{
    console.log("delete request from client");
let deletitem= req.body.Aadhar;
console.log({deletitem});

const v= await Add_lineman.deleteOne({Aadhar:deletitem});

if(v)
{
    return res.status(200).json({message:"deleted"});
}








});

app.post("/login", async(req, res)=>{
console.log("inside server login");
console.log(req.body);
const emailid= req.body.user;
const password= req.body.pass;
const loginBy= req.body.loginBy;
console.log(emailid);
// console.log({password});

const user= await User.findOne({Email_ID:emailid});
if(user)
{
return res.status(200).json({user});
}
else
{

console.log("user Not found ") ;   
res.status(404).json({message:"User not found"});

}



})





