const adminMiddleware = (req, res, next) => {
    const {user} = req;
    console.log(user)
    if (!user || user.role !== 'admin') {
        return res.status(403).json({
            message: "Access denied for non-admin users"
        });
    }
    next();
}

 module.exports = adminMiddleware;