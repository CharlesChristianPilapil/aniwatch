import { logout, setCredentials } from "../slices/authSlice";
import type { UserInfoType } from "../utils/types/users.type";
import { api } from "./baseApiService";

const userService = api.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<{ info: UserInfoType, success: boolean }, void>({
            query: () => `/api/users/me`,
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials(data.info));
                } catch (error) {
                    console.error(error);
                    dispatch(logout());
                }
            }
        }),
        getUserInfo: builder.query<{ info: UserInfoType, success: boolean }, { username: string }>({
            query: ({ username }) => `/api/users/${username}`
        }),
    })
});

export const { 
    useGetMeQuery,
    useLazyGetMeQuery,
    useGetUserInfoQuery,
} = userService