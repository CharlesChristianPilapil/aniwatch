export const sanitizeObject = (obj) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value != null && String(value).trim() !== "")
    );
};