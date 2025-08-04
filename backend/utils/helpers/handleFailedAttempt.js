import sql from "../../config/pg-db.js";

const handleFailedAttempt = async (
    identifier,
    attemptRow,
    now,
    lockDuration
) => {
    const MAX_ATTEMPTS = 5;

    if (!attemptRow) {
        await sql`
            INSERT INTO login_attempts (identifier, attempts, last_attempt)
            VALUES (${identifier}, 1, ${now});
        `;
    } else {
        const newAttempts = attemptRow.attempts + 1;
        const lockedUntil =
            newAttempts >= MAX_ATTEMPTS
                ? new Date(now.getTime() + lockDuration)
                : null;

        await sql`
            UPDATE login_attempts
            SET attempts = ${newAttempts},
                last_attempt = ${now},
                locked_until = ${lockedUntil}
            WHERE identifier = ${identifier};
        `;
    }
};

export default handleFailedAttempt;
