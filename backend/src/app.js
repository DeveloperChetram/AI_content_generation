const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser')

const userRouter = require('./routes/auth.routes')

const app = express();
app.use(express.json())
app.use(cookieParser())

app.get('/',(_,res)=>{
res.send("You'll not see cannot get GET '/' Because SERVER IS RUNNING BABY")
})

app.use('/api/auth/',userRouter)
module.exports = app;