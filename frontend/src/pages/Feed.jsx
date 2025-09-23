// frontend/src/pages/Feed.jsx

import React, { useEffect, useState } from 'react';
import '../styles/Feed.css';
import Axios from '../api/axios';
import { useSelector, useDispatch } from 'react-redux';
import { getPostsAction, likePostAction, createCommentAction } from '../redux/actions/postActions';
import { setAllPosts, setLikedPosts } from '../redux/slices/postSlice';
import FeedCard from '../components/FeedCard';



// --- Main Feed Component ---
  const Feed = () => {
    const[isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const allPosts = useSelector((state) => state.post.allPosts);
    const likedPosts = useSelector((state) => state.post.likedPosts);
    const likingPosts = useSelector((state) => state.post.likingPosts);
    const user = useSelector((state) => state.user);
    
    const getPostsHandler = async () => {
      try {
        setIsLoading(true);
        let posts;
       if(user.isAuthenticated){
        posts = await Axios.get('/api/posts/get-posts');
        if(posts.status === 200){
          setIsLoading(false);
        }
       }else{
        posts = await Axios.get('/api/posts/get-all-posts');
        if(posts.status === 200){
          setIsLoading(false);
        }
       }
        console.log(posts.data.likedPosts);
        
        // Update Redux state with posts and liked posts
        dispatch(setAllPosts(posts.data.posts));
        dispatch(setLikedPosts(posts.data.likedPosts || []));
        
      } catch (error) {
        setIsLoading(false);
        console.log(isLoading)
        console.error('Error fetching posts:', error);
      }
    };
    
    useEffect(() => {
      getPostsHandler();
    }, []);
  // Dummy data array for multiple posts. In a real app, this would come from an API.


  const currentUser = user.user ? {
    avatar: user.user.profilePicture || 'https://i.pravatar.cc/48?u=currentUser',
    name: user.user.name || user.user.username,
    username: user.user.username
  } : {
    avatar: 'https://i.pravatar.cc/48?u=currentUser',
    name: 'Guest',
    username: 'guest'
  };

  return (
    allPosts.length > 0 ? (
    <div className="feed-container">
      {allPosts.map((post) => (
        <FeedCard
          key={post._id}
          post={post}
          currentUser={currentUser}
          isLiked={likedPosts.includes(post._id)}
          isLiking={likingPosts.includes(post._id)}
          onLike={() => dispatch(likePostAction(post._id))}
          onComment={(postId, content) => dispatch(createCommentAction(postId, content))}
          showCommentSection={true}
        />
      ))}
     
      </div>
    ) : (
      isLoading ? (
      <div className="feed-loading-container">
        <div className="feed-loading-content">
          <div className="feed-loading-spinner"></div>
          <h2 className="feed-loading-title">Loading Posts</h2>
          <p className="feed-loading-subtitle">Fetching the latest content for you...</p>
        </div>
      </div>
      ) : (
        <div className="feed-loading-container">
          <div className="feed-loading-content">
            <h2 className="feed-loading-title">No Posts Found</h2>
            <p className="feed-loading-subtitle">May be the server error or something went wrong!</p>
          </div>
        </div>
      )
    )
  );
};

export default Feed;