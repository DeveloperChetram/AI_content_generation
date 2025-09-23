const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser')
const cors  = require('cors')

// Set NODE_ENV if not set
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const authRouter = require('./routes/auth.routes')
const userRouter = require('./routes/user.routes')
const adminRouter = require('./routes/admin.routes')
const postRouter = require('./routes/post.routes');
const generateImageRouter = require('./routes/createImage.routes');
const verifyRouter = require('./routes/verify.route');

const app = express();
app.use(cors(
    {
        origin: ['https://wraite-ai.vercel.app', 'http://localhost:5173'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
        exposedHeaders: ['Set-Cookie']
    }
))
app.use(express.json())
app.use(cookieParser())

app.get('/',(_,res)=>{
res.send("You'll not see cannot get GET '/' Because SERVER IS RUNNING BABY")
})

app.use('/api/auth/',authRouter)

app.use('/api/user', userRouter)

app.use('/api/admin/', adminRouter)

app.use('/api/posts/', postRouter)
app.use('/api/generate-image', generateImageRouter)
app.use('/api/verify', verifyRouter)

module.exports = app;