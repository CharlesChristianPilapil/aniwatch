import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        const error = new Error("Not authenticated.");
        error.status = 401;
        return next(error);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json("Invalid token.");
        req.user = user;
        next();
    });
};