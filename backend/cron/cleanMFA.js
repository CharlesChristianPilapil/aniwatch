import cron from "node-cron";
import sql from "../config/pg-db.js";

cron.schedule("0 * * * *", async () => {
    try {
        const deleted = await sql`
            DELETE FROM email_code_mfa 
            WHERE expires_at < NOW() - interval '1 hour'
            RETURNING *;
        `;

        console.log(
            `MFA cleanup ran. Deleted ${deleted.length} expired entries.`
        );
    } catch (error) {
        console.error("Failed to clean up MFA records:", error);
    }
});
