const parseAsUTC = (value) => {
    if (!value) return null;

    if (value instanceof Date) {
        return new Date(value.toISOString());
    }

    const str = String(value).trim();

    // If already ends with 'Z' or has timezone offset, return as-is
    const hasTimezone = /[zZ]|[+-]\d{2}:\d{2}$/.test(str);
    return hasTimezone ? new Date(str) : new Date(str + 'Z');
}

export default parseAsUTC;