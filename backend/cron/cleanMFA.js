import cron from "node-cron";
import sql from "../config/pg-db.js";

cron.schedule("0 * * * *", async () => {
    try {
        const deleted = await sql`
            DELETE FROM user_code_mfa 
            WHERE expires_at < NOW() - interval '1 hour' OR is_used = true
            RETURNING *;
        `;

        console.log(`Deleted ${deleted.length} MFA codes.`);
    } catch (error) {
        console.error("Failed to clean up MFA records:", error);
    }
});