const express=require('express')
const app=express()
const db=require('./db')
const PORT=process.env.PORT ||3000
const bodyParser=require('body-parser')
const passport=require('./auth')
app.use(bodyParser.json())
require('dotenv').config();

const personRoutes=require('./routes/personRoutes')
const menuItemRoutes = require('./routes/menuItemRoutes');
const logRequest=(req,res,next)=>{
    console.log(`[${new Date().toLocaleString()}] Request made to : ${req.url}`)
    next()
}
app.use(logRequest)
app.use(passport.initialize())
const localauthMiddleware=passport.authenticate('local',{session:false})

app.use('/person',personRoutes)
app.use('/menu',menuItemRoutes)

app.get('/',(req,res)=>{
    res.send("Welcome to our Rangeen Hotel")
})
app.listen(PORT,()=>{ console.log(`Listening to PORT: ${PORT}`)})

