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
    likedPosts: [], // Array of post IDs that the current user has liked
    likingPosts: [], // Array of post IDs currently being liked/unliked
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
        setAllPosts: (state, action) => {
            state.allPosts = action.payload;
        },
        emptyAllPosts: (state) => {
            state.allPosts = [];
        },
        setLikedPosts: (state, action) => {
            state.likedPosts = action.payload;
        },
        toggleLike: (state, action) => {
            const postId = action.payload;
            const index = state.likedPosts.indexOf(postId);
            if (index > -1) {
                // Remove from liked posts (unlike)
                state.likedPosts.splice(index, 1);
            } else {
                // Add to liked posts (like)
                state.likedPosts.push(postId);
            }
        },
        updatePostLikeCount: (state, action) => {
            const { postId, likeCount } = action.payload;
            const post = state.allPosts.find(p => p._id === postId);
            if (post) {
                post.likeCount = likeCount;
            }
        },
        setLikingPost: (state, action) => {
            const { postId, isLiking } = action.payload;
            if (isLiking) {
                // Add to liking posts if not already there
                if (!state.likingPosts.includes(postId)) {
                    state.likingPosts.push(postId);
                }
            } else {
                // Remove from liking posts
                state.likingPosts = state.likingPosts.filter(id => id !== postId);
            }
        },
    }
})

export const { 
    setRecentPost, 
    setPostPayload, 
    setAllPosts, 
    emptyAllPosts, 
    setLikedPosts, 
    toggleLike, 
    updatePostLikeCount, 
    setLikingPost 
} = postSlice.actions;
export default postSlice.reducer;
