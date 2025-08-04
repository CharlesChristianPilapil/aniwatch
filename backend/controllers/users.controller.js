import sql from "../config/pg-db.js";

export const getUser = async (req, res, next) => {
    try {
        console.log('DATABASE_URL:', process.env.DATABASE_URL);
        const data = await sql`SELECT * FROM users;`
        return res.status(200).json({success: true, ...data })
    } catch (err) {
        const error = new Error("Something went wrong.");
        console.error(err);
        return next(error);
    }
}