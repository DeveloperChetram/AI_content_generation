

const getAdminController = (_, res) =>{

    res.status(201).json({
        message: "Welcome to the admin dashboard"
    })


}


module.exports = {getAdminController};