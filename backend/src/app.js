const express = require('express');
require('dotenv').config();

const app = express();

app.get('/',(_,res)=>{
res.send("You'll not see cannot get GET '/' Because SERVER IS RUNNING BABY")
})


module.exports= app;