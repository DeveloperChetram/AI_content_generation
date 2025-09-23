import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import FeedCard from './FeedCard';
import Axios from '../api/axios';
import { likePostAction } from '../redux/actions/postActions';
import { updatePostLikeCount, setLikedPosts } from '../redux/slices/postSlice';

const SinglePost = ({ currentUser, onLike, onComment }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const likedPosts = useSelector((state) => state.post.likedPosts);
  const likingPosts = useSelector((state) => state.post.likingPosts);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const isLikedFromRedux = likedPosts.includes(id);
  const isLiking = likingPosts.includes(id);
  const likeCount = post?.likeCount || 0;

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
        dispatch(setLikedPosts(likedPostsIds));
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
    
    const newLikeStatus = !isLiked;
    setIsLiked(newLikeStatus);
    
    try {
      const result = await dispatch(likePostAction(postId));
      
      if (result && result.status === 200 && result.data && result.data.updatedPost) {
        const updatedLikeCount = result.data.updatedPost.likeCount;
        setPost(prevPost => ({
          ...prevPost,
          likeCount: updatedLikeCount
        }));
      } else {
        setIsLiked(!newLikeStatus);
      }
    } catch (error) {
      console.error('Error in handleLike:', error);
      setIsLiked(!newLikeStatus);
    }
  };

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