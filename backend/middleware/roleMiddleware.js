const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.admin && !req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                });
            }
            const currentUser = req.admin || req.user;

            if (!allowedRoles.includes(currentUser.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Access Denied"
                });
            }
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };
};

module.exports = authorize;