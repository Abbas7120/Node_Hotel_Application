const mongoose=require('mongoose')
require('dotenv').config();

const mongoURL=process.env.MONGODB_URL;
//const mongoURL=process.env.MONGODB_URL_LOCAL;
mongoose.connect(mongoURL)
.then(()=>{
    console.log("Connected to MongoDB Server")
})
.catch((error)=>{
    console.error('MongoDB Connection Error',error)
})

module.exports=mongoose;
