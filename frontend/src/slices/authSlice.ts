import { createSlice } from "@reduxjs/toolkit";
import type { UserInfoType } from "../utils/types/users.type";

const user_info = "anistream_user_info";

const userJson = localStorage.getItem(user_info);
const initialState = {
    userInfo: userJson ? JSON.parse(userJson) as UserInfoType : null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem(user_info, JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem(user_info);
        }
    }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;