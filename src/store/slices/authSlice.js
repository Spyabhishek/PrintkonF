// store/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null, // will hold { id, email, name, ... }
    status: "idle", // "idle" | "loading" | "authenticated" | "unauthenticated"
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.status = action.payload ? "authenticated" : "unauthenticated";
        },
        clearUser: (state) => {
            state.user = null;
            state.status = "unauthenticated";
        },
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
