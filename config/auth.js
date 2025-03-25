const jwt = require("jsonwebtoken")

const authMiddleware= (req,res,next)=>{
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "Unauthorized! No token provided." });
    }
    try {
        const decoded=jwt.verify(token,"RECIPE")
        req.user = decoded
        next()
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
}
module.exports= authMiddleware