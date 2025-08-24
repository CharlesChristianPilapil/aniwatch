import cron from "node-cron";
import sql from "../config/pg-db.js";

cron.schedule("0 * * * *", async () => {
    try {
        const deleted = await sql`
            DELETE FROM login_attempts 
            WHERE last_attempt < NOW() - interval '1 hour'
            RETURNING *;
        `;

        console.log(`Login attempt records cleanup ran. Deleted ${deleted.length} expired entries.`);
    } catch (error) {
        console.error("Failed to clean up login attempt records:", error);
    }
});
