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
     const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
     res.cookie('token',token)
     res.status(201).json({
        messege:"user registered successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
     })
 }  catch (error) {
    return res.status(500).json({
        messege:"error in database"
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
            messege:"user not found"
        })

        
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if(!isPasswordValid){
        return res.status(400).json({
            messege:"Invalid password"
        })
    }
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
    res.cookie('token',token)
    res.status(200).json({
        messege:"user logged in successfully",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
}

const userController = async (req,res)=>{
    res.status(201).json({
            message:"authorized"
        })
}
module.exports = {
  registerController,
  loginController,
  userController
};
