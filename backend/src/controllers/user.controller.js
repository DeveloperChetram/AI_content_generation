const userModel = require("../models/user.model");
const jtw = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const getProfileController = async (req, res)=>{
    res.send('get profile chal rha hai ')
}

const updateProfileController = async (req,res)=>{
const {token} = req.cookies;
const {username, email, password} = req.body;
if(!token){
    return res.status(404).json({
        message:'anuthorized: token not found'
    })
}
const userId = jtw.verify(token, process.env.JWT_SECRET).id
if(!userId){
    return res.status(404).json({
        message:'user id not found'
    })

}
const user = await userModel.findOne({_id:userId})
const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
const updatedUser = await userModel.findByIdAndUpdate({id:userId}, {
    username:username? username : user.username,
    email:email?email: user.email,
    passwordHash: isPasswordValid? await bcrypt.hash(password,10) : user.passwordHash
})
res.status(201).json({
    message:"user updated",
    updatedUser
})
}

module.exports = {
    getProfileController,
    updateProfileController
}