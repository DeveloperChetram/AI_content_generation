const verifyTokenController = async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access: token not found" });
    }try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ _id: decoded.id });
        res.status(200).json({ message: "Token verified", user });
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized access: invalid token" });
    }
    
}

module.exports = { verifyTokenController };