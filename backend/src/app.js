const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser')
const cors  = require('cors')
const authRouter = require('./routes/auth.routes')
const userRouter = require('./routes/user.routes')
const adminRouter = require('./routes/admin.routes')
const postRouter = require('./routes/post.routes');
const generateImageRouter = require('./routes/createImage.routes');

const app = express();
app.use(cors(
    {
        origin:'*',
        credentials:true
    }
))
app.use(express.json())
app.use(cookieParser())

app.get('/',(_,res)=>{
res.send("You'll not see cannot get GET '/' Because SERVER IS RUNNING BABY")
})

app.use('/api/auth/',authRouter)

app.use('/user', userRouter)

app.use('/api/admin/', adminRouter)

app.use('/api/posts/', postRouter)
app.use('/api/generate-image', generateImageRouter)

module.exports = app;