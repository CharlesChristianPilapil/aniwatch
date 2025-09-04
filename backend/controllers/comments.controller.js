import sql from "../config/pg-db.js";
import checkUser from "../utils/helpers/checkUser.js";

// @desc    Add a comment.
// @route   POST /comment
// @access  Private
export const addComment = async (req, res, next) => {
    const { id: user_id } = req.user;
    const { entity_id, entity_type, parent_comment_id, content } = req.body;
    
    try {
        const user = await checkUser(user_id);

        const [inserted] = await sql`
            INSERT INTO comments (user_id, entity_id, entity_type, parent_comment_id, content)
            VALUES (${user.id}, ${entity_id}, ${entity_type}, ${parent_comment_id || null}, ${content})
            RETURNING id;
        `;

        const [comment] = await sql`
            SELECT
                c.id,
                c.content,
                c.created_at,
                c.updated_at,
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
                u.id AS user_id,
                u.username,
                u.avatar_image
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.entity_id = ${entity_id}
                AND c.entity_type = ${entity_type}
                AND c.parent_comment_id IS NULL
            ORDER BY c.created_at DESC
            LIMIT ${limit} OFFSET ${offset};
        `;

        const totalCountResult = await sql`
            SELECT COUNT(*)::int AS total
            FROM comments c
            WHERE c.entity_id = ${entity_id}
                AND c.entity_type = ${entity_type}
                AND c.parent_comment_id IS NULL;
        `;

        const totalCount = totalCountResult[0].total;
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            success: true,
            results: comments,
            totalPages,
            currentPage,
            hasNextPage: currentPage < totalPages
        });
    } catch (err) {
        console.error(err);
        const error = new Error("Failed to get comments.");
        return next(error);
    }
};