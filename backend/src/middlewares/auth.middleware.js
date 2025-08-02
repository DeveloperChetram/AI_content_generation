const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model')

const authMddleware= (req, res, next) =>{
    const {token}= req.cookies;
    if(!token){
        return res.status(401).json({message: "Unauthorized access: token not found"});
    }
try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
    
        const user = userModel.findOne({
            _id:decoded.id
        })
        req.user = user;
      
        next()
} catch (error) {
    return res.status(401).json({
        messege:"unauthorized : invalid token",
        
    })
}
}


module.exports = authMddleware ;