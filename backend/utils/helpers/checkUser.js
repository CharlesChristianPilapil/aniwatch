import sql from "../../config/pg-db.js";

const checkUser = async (id) => {
    const [user] = await sql`
        SELECT * FROM users
        WHERE id = ${id};
    `;

    if (!user) {
        const error = new Error("User doesn't exist.");
        error.status = 404;
        throw error;
    }

    return user;
};

export default checkUser;