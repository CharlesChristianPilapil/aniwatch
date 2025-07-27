import cron from 'node-cron';
import pool from "../config/db.js";

cron.schedule("* * * * *", async () => {
    try {
        const [result] = await pool.query(`
            DELETE FROM user_mfa
            WHERE expires_at < NOW()
        `);
        console.log(`MFA cleanup ran. Deleted ${result.affectedRows} expired/used entries.`);
    } catch (error) {
        console.error("Failed to clean up MFA records:", error);
    }
});