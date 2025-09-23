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
    comments: {}, // Object with postId as key and comments array as value
    commentingPosts: [], // Array of post IDs currently being commented on
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
        setComments: (state, action) => {
            const { postId, comments } = action.payload;
            state.comments[postId] = comments;
        },
        addComment: (state, action) => {
            const { postId, comment } = action.payload;
            if (!state.comments[postId]) {
                state.comments[postId] = [];
            }
            state.comments[postId].unshift(comment);
        },
        updatePostCommentCount: (state, action) => {
            const { postId, commentCount } = action.payload;
            const post = state.allPosts.find(p => p._id === postId);
            if (post) {
                post.commentCount = commentCount;
            }
        },
        setCommentingPost: (state, action) => {
            const { postId, isCommenting } = action.payload;
            if (isCommenting) {
                if (!state.commentingPosts.includes(postId)) {
                    state.commentingPosts.push(postId);
                }
            } else {
                state.commentingPosts = state.commentingPosts.filter(id => id !== postId);
            }
        },
        removePost: (state, action) => {
            const postId = action.payload;
            state.allPosts = state.allPosts.filter(post => post._id !== postId);
            // Also remove from liked posts if it was liked
            state.likedPosts = state.likedPosts.filter(id => id !== postId);
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
    setLikingPost,
    setComments,
    addComment,
    updatePostCommentCount,
    setCommentingPost,
    removePost
} = postSlice.actions;
export default postSlice.reducer;
