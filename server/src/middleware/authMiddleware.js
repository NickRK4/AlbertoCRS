import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    let token;
    const authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(' ')[1];
        if (!token){
            return res.status(401).json({ message: "Unauthorized" });
        }
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            console.log("The decoder user is: ", req.user);
            next();

        } catch (err) {
            return res.status(401).json({ message: "Token invalid" });
        }
    } else {
        return res.status(401).json( { message: "Unauthorized" } );
    }
}

export default verifyToken;