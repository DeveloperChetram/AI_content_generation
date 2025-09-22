import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    postPayload: {
        "title": "",
        "type": "",
        "postBody": {
            "content": "",
            "prompt": "",
            "image": {
                "prompt": "",
                "url": ""
            }
        },
        "isPosted": false,
    },
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
        setPostPayload: (state, action) => {
            state.postPayload = action.payload;
        },
    }
})

export const { setRecentPost, setPostPayload } = postSlice.actions;
export default postSlice.reducer;
