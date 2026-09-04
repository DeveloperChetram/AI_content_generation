import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import FeedCard from './FeedCard';
import Axios from '../api/axios';
import { likePostAction, createCommentAction, deletePostAction } from '../redux/actions/postActions';
import { updatePostLikeCount, setLikedPosts } from '../redux/slices/postSlice';

const SinglePost = ({ currentUser: propCurrentUser, onLike: propOnLike, onComment: propOnComment }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const likedPosts = useSelector((state) => state.post.likedPosts);
  const likingPosts = useSelector((state) => state.post.likingPosts);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const currentUser = propCurrentUser || (user.user ? {
    avatar: user.user.profilePicture || 'https://i.pravatar.cc/48?u=currentUser',
    name: user.user.name || user.user.username,
    username: user.user.username
  } : {
    avatar: 'https://i.pravatar.cc/48?u=currentUser',
    name: 'Guest',
    username: 'guest'
  });

  const isLikedFromRedux = likedPosts.includes(id);
  const isLiking = likingPosts.includes(id);

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
        setError(null);
      } else {
        setError('Post not found');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError(error?.response?.data?.message || 'The post you are looking for does not exist.');
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
    if (propOnLike) {
      return propOnLike(postId);
    }

    if (isLiking || !user.isAuthenticated) return;
    
    try {
      const result = await dispatch(likePostAction(postId));
      
      if (result && result.status === 200 && result.data && result.data.updatedPost) {
        const updatedLikeCount = result.data.updatedPost.likeCount;
        setPost(prevPost => ({
          ...prevPost,
          likeCount: updatedLikeCount
        }));
      }
    } catch (error) {
      console.error('Error in handleLike:', error);
    }
  };

  const handleComment = async (postId, content) => {
    if (propOnComment) {
      return propOnComment(postId, content);
    }

    const res = await dispatch(createCommentAction(postId, content));
    if (res && res.status === 201) {
      if (res.data?.commentCount !== undefined) {
        setPost(prev => prev ? ({ ...prev, commentCount: res.data.commentCount }) : prev);
      }
    }
    return res;
  };

  const handleDelete = async (postId) => {
    const res = await dispatch(deletePostAction(postId));
    if (res && res.status === 200) {
      navigate('/feed');
    }
  };

  const isOwnPost = Boolean(
    user.isAuthenticated && 
    user.user?._id && 
    (post?.user?._id === user.user._id || post?.user === user.user._id)
  );

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
        onComment={handleComment}
        onDelete={handleDelete}
        showCommentSection={true}
        isOwnPost={isOwnPost}
      />
    </div>
  );
};

export default SinglePost;