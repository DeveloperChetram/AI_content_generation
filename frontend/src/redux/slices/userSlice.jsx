import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated:false,
    user:null,
}

export const userSlice = createSlice({
    name:"user",
    initialState:initialState,
    reducers:{
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        removeUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
        
    }

})

export const {setUser,removeUser} = userSlice.actions;
export default userSlice.reducer;