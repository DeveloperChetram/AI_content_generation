import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    recentPost: null,
    allPosts: [],
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setRecentPost: (state, action) => {   
            state.recentPost = action.payload;
        },
     
    }
})

export const { setRecentPost } = postSlice.actions;
export default postSlice.reducer;
