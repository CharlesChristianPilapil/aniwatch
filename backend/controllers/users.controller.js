import sql from "../config/pg-db.js";

export const getCurrentUser = async (req, res, next) => {
    const user = req.user;
    try {
        const [dbUser] = await sql`
            SELECT * FROM users
            WHERE id = ${user.id};
        `;

        if (!dbUser) {
            const error = new Error("User not found.");
            error.status = 404;
            return next(error);
        };

        const { password, is_verified, ...safeUser } = dbUser;

        return res.status(200).json({
            success: true,
            info: safeUser,
        });
    } catch (error) {
        console.error("Error fetching user", error);
        const err = new Error("Server error");
        return next(err); 
    }
};

export const getUserInfo = async (req, res, next) => {
    const { username } = req.params;
    try {
        const [user] = await sql`
            SELECT * FROM users
            WHERE username = ${username};
        `;

        if (!user) {
            const error = new Error("User not found.");
            error.status = 404;
            return next(error);
        }

        const { password, is_verified, created_at, ...safeUser } = user;

        console.log(created_at);

        return res.status(200).json({
            success: true,
            info: { joined: created_at, ...safeUser },
        });
    } catch (error) {
        console.error("Error fetching user info", error);
        const err = new Error("Server error");
        return next(err);  
    }
}