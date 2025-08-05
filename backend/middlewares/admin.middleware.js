/**
 * Middleware to check if the authenticated user is an admin
 * Must be used after the authorize middleware
 */
const admin = (req, res, next) => {
    try {
        // Check if user is authenticated (should be set by authorize middleware)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                error: "User not authenticated"
            });
        }

        // Check if user has admin role
        if (req.user.isAdmin !== true) {
            return res.status(403).json({
                success: false,
                message: "Forbidden",
                error: "Admin access required"
            });
        }

        // User is an admin, proceed to the next middleware/route handler
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

export default admin;
