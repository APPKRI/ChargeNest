const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            return next();
        } catch (error) {
            console.error("Token verification failed:", error.message);
        }
    }
    
    // Fallback support if driverId/hostId is directly provided in body (for flexibility)
    if (req.body.driverId || req.body.hostId) {
        req.user = { id: req.body.driverId || req.body.hostId };
        return next();
    }
    
    return res.status(401).json({ message: "Authentication required" });
};

module.exports = auth;
