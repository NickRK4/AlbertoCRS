
const authorizeRoles = (...allowedRoles) => {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }
    
            if (!allowedRoles.includes(req.user.user_type)) {
                return res.status(403).json({ message: "Access denied" });
            }
            next();
        };
    };