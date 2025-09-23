const userModel = require("../models/user.model");

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerController = async (req, res) => {
  const { name, email, password, role } = req.body;

  const isUser = await userModel.findOne({
    email,
  });

  if (isUser) {
    return res.status(400).send({
      message: "User already exists",
    });
  }

 try {
     const user = await userModel.create({
       name,
       email,
       passwordHash: await bcrypt.hash(password, 10),
       role,
     });
     const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
     res.cookie('token', token, {
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
       maxAge: 24 * 60 * 60 * 1000 // 1 day
     })
     res.status(201).json({
          message:"user registered successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          aiCredits: user.aiCredits,
          aiImageCredits: user.aiImageCredits,
          posts: user.posts,
          bio: user.bio,
          profilePicture: user.profilePicture,
        },
     })
 }  catch (error) {
    return res.status(500).json({
        message:"error in database"
    })
 }
};

const loginController = async (req,res)=>{
    const {email, password} = req.body;
    const user = await userModel.findOne({
        email
    })

    if(!user){
        return res.status(404).json({
            message:"user not found"
        })

        
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid password"
        })
    }
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET, {expiresIn: '1d'})
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    })
    res.status(200).json({
        message:"user logged in successfully",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            aiCredits: user.aiCredits,
            aiImageCredits: user.aiImageCredits,
            posts: user.posts,
            bio: user.bio,
            profilePicture: user.profilePicture,

        },
    });
}

const userController = async (req,res)=>{
    res.status(201).json({
            message:"authorized you can get the users information",
            user: req.user
        })
}

const logoutController = async (req, res)=>{
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  })
  res.status(200).json({
    message:"user logged out"
  })
}
module.exports = {
  registerController,
  loginController,
  userController,
  logoutController
};
