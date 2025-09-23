import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import FeedCard from './FeedCard';
import Axios from '../api/axios';
import { likePostAction } from '../redux/actions/postActions';
import { updatePostLikeCount, setLikedPosts } from '../redux/slices/postSlice';

const SinglePost = ({ currentUser, onLike, onComment }) => {
  const { id } = useParams(); // Get post ID from URL params
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const likedPosts = useSelector((state) => state.post.likedPosts);
  const likingPosts = useSelector((state) => state.post.likingPosts);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  // Get like status from Redux state and local state
  const isLikedFromRedux = likedPosts.includes(id);
  const isLiking = likingPosts.includes(id);
  const likeCount = post?.likeCount || 0;

  // Update local like state when Redux state changes
  useEffect(() => {
    setIsLiked(isLikedFromRedux);
  }, [isLikedFromRedux]);

  const fetchPost = async () => {
    if (!id) {
      setError('No post ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await Axios.get(`/api/posts/get-post-by-id/${id}`);
      if (response.status === 200) {
        const postData = response.data.post;
        setPost(postData);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLikedPosts = async () => {
    if (!user.isAuthenticated) return;
    
    try {
      const response = await Axios.get('/api/posts/get-posts');
      if (response.status === 200) {
        const likedPostsIds = response.data.likedPosts || [];
        // Update Redux state with liked posts
        dispatch(setLikedPosts(likedPostsIds));
        // Check if current post is liked by user
        const isPostLiked = likedPostsIds.includes(id);
        setIsLiked(isPostLiked);
      }
    } catch (error) {
      console.error('Error fetching liked posts:', error);
    }
  };

  useEffect(() => { 
    fetchPost();
    fetchUserLikedPosts();
  }, [id, user.isAuthenticated]);
  const handleLike = async (postId) => {
    if (isLiking || !user.isAuthenticated) return;
    
    // Optimistically update the like state
    const newLikeStatus = !isLiked;
    setIsLiked(newLikeStatus);
    
    try {
      // Use Redux action to like/unlike the post
      const result = await dispatch(likePostAction(postId));
      
      // If the API call was successful, update the local post state
      if (result && result.status === 200 && result.data && result.data.updatedPost) {
        const updatedLikeCount = result.data.updatedPost.likeCount;
        setPost(prevPost => ({
          ...prevPost,
          likeCount: updatedLikeCount
        }));
      } else {
        // If the API call failed, revert the like state
        setIsLiked(!newLikeStatus);
      }
    } catch (error) {
      console.error('Error in handleLike:', error);
      // Revert the like state on error
      setIsLiked(!newLikeStatus);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="single-post-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="single-post-container">
        <div className="error-container">
          <h2>Post Not Found</h2>
          <p>{error || 'The post you are looking for does not exist.'}</p>
        </div>
      </div>
    );
  }

  // Success state - render the post
  return (
    <div className="single-post-container">
      <FeedCard
        post={post}
        currentUser={currentUser}
        isLiked={isLiked}
        isLiking={isLiking}
        onLike={handleLike}
        onComment={onComment}
        showCommentSection={true}
      />
    </div>
  );
};

export default SinglePost