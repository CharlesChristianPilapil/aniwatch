import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { animeApiQuery } from "../services/animeApiQuery";
import authReducer from "../slices/authSlice";
import { bookmarkService } from "../services/bookmarkService";
import { authService } from "../services/authService";

export const store = configureStore({
    reducer: {
        [animeApiQuery.reducerPath]: animeApiQuery.reducer,
        [bookmarkService.reducerPath]: bookmarkService.reducer,
        [authService.reducerPath]: authService.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(
            animeApiQuery.middleware,
            bookmarkService.middleware,
            authService.middleware
        );
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
