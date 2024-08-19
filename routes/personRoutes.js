const express=require('express')
const Person=require('./../models/Person')

const router=express.Router()
require('dotenv').config();
const {jwtAuthMiddleWare,generateToken}=require('./../jwt')

//Post route to add Person
router.post('/signup',async(req,res)=>{
    try{
        const data=req.body
        const newPerson=new Person(data)
        const response=await newPerson.save()
        console.log('Data Saved')
        
        
        /* --->Without Payload
        const token=generateToken(response.username)
        console.log("Token is :",token)
        res.status(200).json({response:response ,token:token}) 
        --->With Payload , below
        */

        const payload={
            id:response.id,
            username:response.username
        }
console.log(JSON.stringify(payload))
const token=generateToken(payload)
console.log("Token is :",token)

res.status(200).json({response:response,token:token})
   

 }
    catch(error){
console.log(error)
res.status(500).json({error:'Internal Server Error'})
    }
})
//Login Route
router.post('/login',async(req,res)=>{
    try{ 

        const {username,password}=req.body;
        const user= await Person.findOne({username:username});
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error:'Invalid Username or Password'})
        }

        const payload={
            id:user.id,
            username:user.username
        }
        const token=generateToken(payload)
        res.json({token})
    }
    catch(error){
console.error(error)
res.status(500).json({error:'Internal Server Error'})
    }
})

//Profile Route
router.get('/profile',jwtAuthMiddleWare,async (req,res)=>{
    try{
const userData=req.user;
console.log("User Data :",userData)
const userId=userData.id
const user=await Person.findById(userId)
res.status(200).json({user})
    }
    catch(error){

console.error(error)
res.status(500).json({error:'Internal Server Error'})

    }
})
// GET method to get the person
router.get('/',jwtAuthMiddleWare,async (req,res)=>{
    try{
        const data=await Person.find()
        console.log('Data Fetched')
        res.status(200).json(data);

    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

//WorkType
router.get('/:workType',async(req,res)=>{
    try{
const workType=req.params.workType;
if(workType=='chef' || workType=='manager' || workType=='waiter'){
    const response=await Person.find({work:workType})
    console.log('response fetched')
    res.status(200).json({response})
}
else {
    res.status(404).json({error: 'Invalid work type'});  
}
    }
    catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

//Update
router.put('/:id',async(req,res)=>{
try{
const personId=req.params.id;
const updatePersonData=req.body;
const response=await Person.findByIdAndUpdate(personId,updatePersonData,{
    new:true,
    runValidators:true
})
if(!response){
    return res.status(404).json({error:'Person Not Found'})
}
console.log('Data Updated')
res.status(200).json(response)
}
catch(error){
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
}
})

//Delete
router.delete('/:id',async (req,res)=>{
try{
const personId=req.params.id;
const response=await Person.findByIdAndRemove(personId)
if(!response){
    return res.status(404).json({error:'Person not found'})
}
console.log('Data deleted')
res.status(200).json({message:'Person Deleted Successfully'})
}
catch(error){
    console.log(error)
    res.status(500).json({error:'Internal Server Error'})
}
})

module.exports=router
