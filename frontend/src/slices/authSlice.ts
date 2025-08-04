import { createSlice } from "@reduxjs/toolkit";

export type UserInfo = {
    id: number;
    username: string;
    email: string;
    name: string;
    avatar_image: string | null;
    cover_image: string | null;
    city: string | null;
    website: string | null;
}

const userJson = localStorage.getItem("userInfo");
const initialState = {
    userInfo: userJson ? JSON.parse(userJson) as UserInfo : null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem("userInfo", JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem("userInfo");
        }
    }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;