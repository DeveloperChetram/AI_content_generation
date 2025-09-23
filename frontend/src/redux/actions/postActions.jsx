import axios from "../../api/axios"
import { addAlert } from "../slices/alertSlice"
import { setRecentPost, setAllPosts, toggleLike, updatePostLikeCount, setLikingPost, setComments, addComment, updatePostCommentCount, setCommentingPost, removePost } from "../slices/postSlice"

export const generatePostAction = (prompt, type, title) => async (dispatch)=> {

    try {
        dispatch(addAlert(
            {
                type:"warning",
                content:"Generating post...",
                duration:false
            }
        ))
        const result = await axios.post('/api/posts/create-post', { prompt, type, title })
        console.log("result from generatePostAction", result);
        dispatch(setRecentPost(result.data))
        dispatch(addAlert(
            {
                type:"info",
                content:"Post generated successfully",
                duration:5000
            }
        ))
        return result;
    } catch (error) {
        console.log( "error from generatePostAction", error);
        dispatch(addAlert(
            {
                type:"error",
                content: error?.response?.data?.message || "Failed to generate post",
                duration:5000
            }
        ))
        return error;
    }
}

export const getPostsAction = () => async (dispatch)=> {
    try {
        const result = await axios.get('/api/posts/get-posts-by-user')
        console.log("result from getPostsAction", result.data);
       await dispatch(setAllPosts(result.data.posts))
       return result
    } catch (error) {
        return error
        console.log( "error from getPostsAction", error);
    }
}

export const likePostAction = (postId) => async (dispatch) => {
    try {
        dispatch(setLikingPost({ postId, isLiking: true }));
        
        const response = await axios.post('/api/posts/like-post', { postId });
        
        if (response.status === 200) {
            dispatch(toggleLike(postId));
            dispatch(updatePostLikeCount({
                postId: postId,
                likeCount: response.data.updatedPost.likeCount
            }));
            console.log('Like action successful:', response.data);
            return response;
        }
    } catch (error) {
        console.error('Error liking post:', error.response);
        dispatch(addAlert({
            type: "error",
            content: error?.response?.statusText == "Unauthorized" ? "Login to like a post" : error?.response?.data?.message || "Failed to like post",
            duration: 5000
        }));
        return error;
    } finally {
        dispatch(setLikingPost({ postId, isLiking: false }));
    }
}

export const getCommentsAction = (postId) => async (dispatch) => {
    try {
        const response = await axios.get(`/api/comments/get-comments/${postId}`);
        
        if (response.status === 200) {
            dispatch(setComments({ postId, comments: response.data.comments }));
            return response;
        }
    } catch (error) {
        dispatch(addAlert({
            type: "error",
            content: error?.response?.statusText === "Unauthorized" ? "Login to get comments" : error?.response?.data?.message || "Failed to get comments",
            duration: 5000
        }));
        console.error('Error getting comments:', error.response);
        return error;
    }
}

export const createCommentAction = (postId, content) => async (dispatch) => {
    try {
        dispatch(setCommentingPost({ postId, isCommenting: true }));
        
        const response = await axios.post('/api/comments/create-comment', { 
            postId, 
            content 
        });
        
        if (response.status === 201) {
            dispatch(addComment({ postId, comment: response.data.comment }));
            dispatch(updatePostCommentCount({ 
                postId: postId, 
                commentCount: response.data.comment.post.commentCount + 1 
            }));
            console.log('Comment created successfully:', response.data);
            dispatch(addAlert({
                type: "success",
                content: "Comment created successfully",
                duration: 5000
            }));
            return response;
        }
        
    } catch (error) {
        console.error('Error creating comment:', error.response);
        dispatch(addAlert({
            type: "error",
            content: error?.response?.statusText === "Unauthorized" ? "Login to comment on a post" : error?.response?.data?.message || "Failed to create comment",
            duration: 5000
        }));
        return error;
    } finally {
        dispatch(setCommentingPost({ postId, isCommenting: false }));
    }
}

export const deletePostAction = (postId) => async (dispatch) => {
    try {
        const response = await axios.delete(`/api/posts/delete-post/${postId}`);
        
        if (response.status === 200) {
            dispatch(removePost(postId));
            dispatch(addAlert({
                type: "success",
                content: "Post deleted successfully",
                duration: 5000
            }));
            console.log('Post deleted successfully:', response.data);
            return response;
        }
    } catch (error) {
        console.error('Error deleting post:', error.response);
        dispatch(addAlert({
            type: "error",
            content: error?.response?.data?.message || "Failed to delete post",
            duration: 5000
        }));
        return error;
    }
}


