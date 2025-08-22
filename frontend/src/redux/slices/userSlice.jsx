import { createSlice } from "@reduxjs/toolkit";
import { registerUserAction } from "../actions/userActions";

const initialState = 
    {
        
    }

export const userSlice = createSlice({
    name:"user",
    initialState:initialState,
    reducers:{
        registerUser:registerUserAction,
        // addDataByAction:userAction,
       
    }

})

export const {registerUser} = userSlice.actions;
export default userSlice.reducer;