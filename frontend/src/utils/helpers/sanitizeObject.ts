export const sanitizePayload = <T extends object>(
    obj: T,
    allowEmpty: (keyof T)[] = []
): Partial<T> => {
    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => {
            if (value === undefined || value === null) return false;
            if (value === "" && !allowEmpty.includes(key as keyof T)) return false;
            return true;
        })
    ) as Partial<T>;
};