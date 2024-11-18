const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
    console.log("HELLOOOOOOOOOOOOOOOOOO")
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: "Token is not valid." });
    }
};