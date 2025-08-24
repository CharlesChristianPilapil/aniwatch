import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type LockoutState = {
    key: string,
    timeLeft: number;
    cooldownInSeconds: number;
}

const initialState: LockoutState = {
    key: "",
    timeLeft: 0,
    cooldownInSeconds: 0,
}

const lockoutSlice = createSlice({
    name: "lockout",
    initialState,
    reducers: {
        startLockout: (
            state, 
            action: PayloadAction<{ key: string; cooldownInSeconds: number }>
        ) => {
            state.key = action.payload.key;
            state.cooldownInSeconds = action.payload.cooldownInSeconds;

            const last = localStorage.getItem(action.payload.key);

            if (last) {
                const diff = Math.floor((Date.now() - +last) / 1000);
                state.timeLeft = Math.max(action.payload.cooldownInSeconds - diff, 0);
            } else {
                state.timeLeft = action.payload.cooldownInSeconds;
                localStorage.setItem(action.payload.key, Date.now().toString());
            }
        },
        tick: (state) => {
            if (state.timeLeft > 0) {
                state.timeLeft -= 1;
            }
        },
        resetLockout: (state) => {
            localStorage.setItem(state.key, Date.now().toString());
            state.timeLeft = state.cooldownInSeconds;
        },
        rehydrateLockout: (state, action: PayloadAction<{ key: string }>) => {
            const stored = localStorage.getItem(action.payload.key);
            if (stored) {
                const cooldown = state.cooldownInSeconds || 90; // default if needed
                const diff = Math.floor((Date.now() - +stored) / 1000);
                state.timeLeft = Math.max(cooldown - diff, 0);
                state.key = action.payload.key;
            } else {
                state.timeLeft = 0;
                state.key = "";
            }
        },
    },
});

export const { startLockout, tick, resetLockout, rehydrateLockout } = lockoutSlice.actions;
export default lockoutSlice.reducer;