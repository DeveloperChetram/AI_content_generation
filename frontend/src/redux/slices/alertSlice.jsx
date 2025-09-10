import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    type: "default",
    content: "Welcome",
    duration: false, // false = stay until defaultAlert, number = auto-hide after X ms
    show: true
}

export const alertSlice = createSlice({
    name: 'alert',
    initialState: initialState,
    reducers: {
        addAlert: (state, action) => {
            const { type, content, duration = false } = action.payload;
            state.type = type;
            state.content = content;
            state.duration = duration;
            state.show = true;
        },

        defaultAlert: (state, action) => {
            state.type = 'default';
            state.content = "Welcome";
            state.duration = false;
            state.show = true;
        },

        hideAlert: (state) => {
            state.show = false;
        },

        clearAlert: (state) => {
            state.type = 'default';
            state.content = '';
            state.duration = false;
            state.show = false;
        }
    }
})

export default alertSlice.reducer;
export const { addAlert, defaultAlert, hideAlert, clearAlert } = alertSlice.actions;