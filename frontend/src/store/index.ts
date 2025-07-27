import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { animeApiQuery } from "../services/animeApiQuery";

export const store = configureStore({
    reducer: {
        [animeApiQuery.reducerPath]: animeApiQuery.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(
            animeApiQuery.middleware,
        )
    },
});

setupListeners(store.dispatch);