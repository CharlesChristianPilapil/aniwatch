export const cleanPayload = <T extends object>(obj: T): Partial<T> =>
    Object.fromEntries(
        Object.entries(obj).filter(
            ([, value]) => value !== undefined && value !== ""
        )
    ) as Partial<T>;
