import sql from "../config/pg-db.js";

export const getBookmarks = async (req, res, next) => {
    const { username } = req.query;

    let page = Math.max(+req.query.page || 1, 1);
    const limit = 40;

    const { status, sort = "created_at", order = "asc" } = req.query;
    const allowedSort = ["created_at", "title", "type"];
    const allowedOrder = ["asc", "desc"];

    try {
        let conditionSql;
        if (username) {
            const [user] = await sql`
                SELECT * FROM users
                WHERE username = ${username};
            `;
            if (!user) {
                const error = new Error("User does not exist");
                error.status = 404;
                return next(error);
            }
            conditionSql = sql`WHERE user_id = ${user.id}`;
        } else {
            conditionSql = sql`WHERE user_id = ${req.user.id}`
        }

        if (status) {
            conditionSql = sql`${conditionSql} AND bookmark_status = ${status}`;
        }

        const [totalResults] = await sql`
            SELECT COUNT(*) FROM bookmarks
            ${conditionSql}
        `;

        const totalCount = Number(totalResults.count);
        const totalPages = Math.ceil(totalCount / limit);

        const sortBy = allowedSort.includes(sort) ? sort : "created_at";
        const orderSanitized = allowedOrder.includes(order.toLowerCase()) ? order.toUpperCase() : "ASC";
        const sortOrderSql = orderSanitized === "ASC" ? sql`ASC` : sql`DESC`;
        const sortBySql = sql([sortBy]);

        if (page > totalPages && totalPages > 0) page = totalPages;

        const offset = (page - 1) * limit;

        const results = await sql`
            SELECT * FROM bookmarks
            ${conditionSql}
            ORDER BY ${sortBySql} ${sortOrderSql}
            LIMIT ${limit} OFFSET ${offset};
        `;

        return res.status(200).json({
            success: true,
            currentPage: page,
            hasNextPage: page < totalPages,
            totalPages,
            results,
        });
    } catch (err) {
        const error = new Error("Something went wrong.", err);
        console.error(err);
        return next(error);
    }
};

export const addBookmark = async (req, res, next) => {
    const { id: user_id } = req.user;

    const { anime_id, title, image, type, bookmark_status, anime_status } = req.body;

    if (!anime_id || !title || !bookmark_status) {
        const error = new Error("Missing required data.");
        return next(error);
    }

    try {
        const [data] = await sql`
            INSERT INTO bookmarks (user_id, title, anime_id, image, type, anime_status, bookmark_status)
            VALUES (${user_id}, ${title}, ${anime_id}, ${image || ""}, 
                ${type || ""}, ${anime_status || ""}, ${bookmark_status})
            ON CONFLICT (user_id, anime_id) DO NOTHING;
        `;

        return res.status(200).json({ success: true, data: data });
    } catch (err) {
        const error = new Error("Failed to add bookmark.");
        console.error(err);
        return next(error);
    }
};

export const updateBookmark = async (req, res, next) => {
    const { id: bookmark_id } = req.params;
    const { status, anime_id } = req.body;
    const { id: user_id } = req.user;

    if (!status || !anime_id) {
        const error = new Error("Missing status or anime ID.");
        return next(error);
    }

    try {
        if (!bookmark_id) {
            const error = new Error("Missing bookmark ID.");
            return next(error);
        }

        const [result] = await sql`
            UPDATE bookmarks
            SET status = ${status}, updated_at = NOW()
            WHERE id = ${bookmark_id} AND user_id = ${user_id}
            RETURNING *;
        `;

        return res.status(200).json({
            success: true,
            message: `Bookmark with ID of ${bookmark_id} updated.`,
            data: result,
        });
    } catch (err) {
        const error = new Error("Failed to update.");
        return next(error);
    }
};

export const isBookmarked = async (req, res, next) => {
    const { id: user_id } = req.user;
    const { id: anime_id } = req.params;

    try {
        const [bookmark] = await sql`
            SELECT id, user_id, anime_id, title, image, type, bookmark_status, anime_status
            FROM bookmarks
            WHERE anime_id = ${anime_id} AND user_id = ${user_id};
        `;

        if (!bookmark) {
            return res.status(200).json({
                success: true,
                isBookmarked: false,
            });
        }

        return res.status(200).json({
            success: true,
            isBookmarked: true,
            info: bookmark,
        });
    } catch (err) {
        const error = new Error("Failed to get bookmark status.");
        return next(error);
    }
};
