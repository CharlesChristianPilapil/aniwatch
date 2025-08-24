import jwt from "jsonwebtoken";

const ACCESS_TOKEN_DURATION = 15 * 60 * 1000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// @desc    Get session
// @route   GET /auth/session
// @access  Private
export const session = (req, res, next) => {
    try {
        return res.status(200).json({
            is_authenticated: true,
            user: req.user,
        });
    } catch (err) {
        const error = new Error("Something went wrong.");
        return next(error);
    }
};

// @desc    Refresh session
// @route   POST /auth/refresh
// @access  Private
export const refreshSession = (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            const error = new Error("No refresh token provided");
            error.status = 401;
            return next(error);
        }

        const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        const accessSecret = process.env.ACCESS_TOKEN_SECRET;
        
        if (!refreshSecret || !accessSecret) {
            throw new Error("JWT secrets are not configured properly.");
        }

        jwt.verify(
            refreshToken, 
            process.env.REFRESH_TOKEN_SECRET || "refresh-secret",
            (err, decoded) => {
                if (err) {
                    const error = new Error("Invalid or expired refresh token");
                    error.status = 403;
                    return next(error);
                }

                const accessToken = jwt.sign(
                    { id: decoded.id },
                    process.env.ACCESS_TOKEN_SECRET || "access-secret",
                    { expiresIn: "15m" }
                );

                return res
                    .cookie("accessToken", accessToken, {
                        httpOnly: true,
                        secure: IS_PRODUCTION,
                        sameSite: IS_PRODUCTION ? "None" : "Lax",
                        maxAge: ACCESS_TOKEN_DURATION,
                    })
                    .status(200)
                    .json({
                        success: true,
                        message: "Access token refreshed successfully.",
                    });
            }
        );
    } catch (err) {
        const error = new Error("Something went wrong during refresh.");
        return next(error);
    }
};