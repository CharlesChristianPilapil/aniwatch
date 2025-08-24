import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import baseUrl from "../utils/constants/baseApiUrl";
import { logout } from "../slices/authSlice";
import { sanitizePayload } from "../utils/helpers/sanitizeObject";

type ArgsWithEmptyKey = {
    allowEmpty?: string[];
} & FetchArgs;

const baseQuery = fetchBaseQuery({
    baseUrl,
    credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
    string | ArgsWithEmptyKey, 
    unknown, 
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let modifiedArgs = args;

    if (
        typeof args !== "string" && 
        args.body && 
        typeof args.body === "object" &&
        !(args.body instanceof FormData)
    ) {
        modifiedArgs = {
            ...args,
            body: sanitizePayload(args.body, args.allowEmpty || []),
        };
    };

    let result = await baseQuery(modifiedArgs, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const refetchResult = await baseQuery("/auth/refresh", api, extraOptions);

        if (refetchResult.data) {
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logout());
        }
    }

    return result;
}

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["bookmarkList", "isAnimeBookmarked", "session", "userProfile"],
    endpoints:() => ({}),
});