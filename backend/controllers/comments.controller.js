import sql from "../config/pg-db.js";
import checkUser from "../utils/helpers/checkUser.js";

// @desc    Add a comment.
// @route   POST /comment
// @access  Private
export const addComment = async (req, res, next) => {
    const { id: user_id } = req.user;
    const { entity_id, entity_type, parent_comment_id, reply_to_comment_id, content } = req.body;
    
    try {
        const user = await checkUser(user_id);

        const [inserted] = await sql`
            INSERT INTO comments (user_id, entity_id, entity_type, parent_comment_id, reply_to_comment_id, content)
            VALUES (${user.id}, ${entity_id}, ${entity_type}, ${parent_comment_id || null}, ${reply_to_comment_id || null}, ${content})
            RETURNING id;
        `;

        const [comment] = await sql`
            SELECT
                c.id,
                c.content,
                c.created_at,
                c.updated_at,
                c.parent_comment_id,
                c.reply_to_comment_id,
                u.id AS user_id,
                u.username,
                u.avatar_image
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.id = ${inserted.id};
        `;

        return res.status(200).json({
            success: true,
            message: "Comment added successfully.",
            info: comment,
        });
    } catch (err) {
        console.error(err);
        const error = new Error("Failed to add error.");
        return next(error);
    }
};

// @desc    Fetch comments.
// @route   GET /comment
// @access  Public
export const getComments = async (req, res, next) => {

    const limit = 10;
    const { entity_id, entity_type, page } = req.query;
    const currentPage = parseInt(page || "1", 10);
    const offset = (currentPage - 1) * limit;

    try {
        const comments = await sql`
            SELECT
                c.id,
                c.content,
                c.created_at,
                c.updated_at,
                c.parent_comment_id,
                c.reply_to_comment_id,
                u.id AS user_id,
                u.username,
                u.avatar_image,
                (
                    SELECT COUNT(*)::int
                    FROM comments r
                    WHERE r.parent_comment_id = c.id
                ) AS replies_count
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.entity_id = ${entity_id}
                AND c.entity_type = ${entity_type}
                AND c.parent_comment_id IS NULL
            ORDER BY c.created_at DESC
            LIMIT ${limit} OFFSET ${offset};
        `;

        const [topCommentsTotal] = await sql`
            SELECT COUNT(*)::int AS total
            FROM comments c
            WHERE c.entity_id = ${entity_id}
                AND c.entity_type = ${entity_type}
                AND c.parent_comment_id IS NULL;
        `;

        const totalPages = Math.ceil(topCommentsTotal.total / limit);

        res.status(200).json({
            success: true,
            results: comments,
            totalPages,
            currentPage,
            hasNextPage: currentPage < totalPages,
            totalCount: topCommentsTotal.total
        });
    } catch (err) {
        console.error(err);
        const error = new Error("Failed to get comments.");
        return next(error);
    }
};

export const getReplies = async (req, res, next) => {
    const limit = 10;
    const { entity_id, entity_type, parent_comment_id, page } = req.query;
    const currentPage = parseInt(page || "1", 10);
    const offset = (currentPage - 1) * limit;

    try {
        const replies = await sql`
            SELECT
                c.id,
                c.content,
                c.created_at,
                c.updated_at,
                c.parent_comment_id,
                c.reply_to_comment_id,
                u.id AS user_id,
                u.username,
                u.avatar_image
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.entity_id = ${entity_id}
                AND c.entity_type = ${entity_type}
                AND c.parent_comment_id = ${parent_comment_id}
            ORDER BY c.created_at ASC
            LIMIT ${limit} OFFSET ${offset};
        `;

        const [totalCountResult] = await sql`
            SELECT COUNT(*)::int AS total
            FROM comments c
            WHERE c.entity_id = ${entity_id}
                AND c.entity_type = ${entity_type}
                AND c.parent_comment_id = ${parent_comment_id};
        `;

        const totalCount = totalCountResult.total;
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            success: true,
            results: replies,
            totalPages,
            currentPage,
            hasNextPage: currentPage < totalPages,
            totalCount,
        });
    } catch (err) {
        console.error(err);
        const error = new Error("Failed to get comments.");
        return next(error);
    }
};