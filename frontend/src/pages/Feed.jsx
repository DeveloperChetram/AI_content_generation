// frontend/src/components/Feed.jsx

import React, { useEffect, useState } from 'react';
import { FiHeart, FiMessageCircle, FiSend, FiMoreHorizontal } from 'react-icons/fi';
import { 
  AiOutlineBulb,
  AiOutlineCode,
  AiOutlineMessage,
  AiOutlineThunderbolt,
  AiOutlineBook,
  AiOutlineCoffee,
  AiOutlineStar,
  AiOutlineRocket
} from 'react-icons/ai';
import '../styles/Feed.css'; // We will update this file next
import  Axios  from '../api/axios';
import RichTextContent from '../components/RichTextContent';
import { useSelector, useDispatch } from 'react-redux';
import { getPostsAction, likePostAction } from '../redux/actions/postActions';
import { setAllPosts, setLikedPosts } from '../redux/slices/postSlice';



// Function to get tag class for tag type
const getTagClass = (type) => {
  const classMap = {
    'Tips & Tricks': 'tag-tips',
    'Coding meme': 'tag-coding',
    'Hot quote': 'tag-quote',
    'General hit': 'tag-general',
    'Bold thoughts': 'tag-bold',
    'AI prompts': 'tag-ai',
    'Story set': 'tag-story',
    'Vibe talk': 'tag-vibe',
  };
  
  return classMap[type] || 'tag-default';
};

// Function to get card class for tag type
const getCardClass = (type) => {
  const classMap = {
    'Tips & Tricks': 'card-tips',
    'Coding meme': 'card-coding',
    'Hot quote': 'card-quote',
    'General hit': 'card-general',
    'Bold thoughts': 'card-bold',
    'AI prompts': 'card-ai',
    'Story set': 'card-story',
    'Vibe talk': 'card-vibe',
  };
  
  return classMap[type] || 'card-default';
};

// Function to get icon for tag type
const getTagIcon = (type) => {
  const iconMap = {
    'Tips & Tricks': AiOutlineBulb,
    'Coding meme': AiOutlineCode,
    'Hot quote': AiOutlineMessage,
    'General hit': AiOutlineThunderbolt,
    'Bold thoughts': AiOutlineRocket,
    'AI prompts': AiOutlineStar,
    'Story set': AiOutlineBook,
    'Vibe talk': AiOutlineCoffee,
  };
  
  const IconComponent = iconMap[type] || AiOutlineStar;
  return <IconComponent className="tag-icon" />;
};

// --- Sub-component for a single card ---

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


  const currentUser = {
    avatar: 'https://i.pravatar.cc/48?u=currentUser',
  };

  return (
    allPosts.length > 0 ? (
    <div className="feed-container">
      {allPosts.map((post) => (
        <FeedCard
          key={post._id}
          id={post._id}
          post={post}
          currentUser={currentUser}
          isLiked={likedPosts.includes(post._id)}
          isLiking={likingPosts.includes(post._id)}
          onLike={() => dispatch(likePostAction(post._id))}
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

const FeedCard = ({ post, currentUser, id, isLiked, isLiking, onLike }) => {
  const handleLike = () => {
    if (!isLiking) {
      onLike();
    }
  };
return(
  <div className={`feed-card ${getCardClass(post.type)}`} key={id} >
  {/* Card Header */}
  <div className="feed-header">
    {/* <img src={post.user.avatar} alt={`${post.user.name}'s avatar`} className="feed-avatar" /> */}
    <div className="feed-user-info">
      <h3 className="feed-username">{post.username}</h3>
      <p className="feed-timestamp">
        {post.createdAt
          ? new Date(post.createdAt).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            })
          : ''}
      </p>
    </div>
    <span className={`feed-type-tag tag-base ${getTagClass(post.type)}`}>
      {getTagIcon(post.type)}
      {post.type}
    </span>
  </div>

  {/* Card Content */}
  <div className="feed-content">
    <div className="feed-caption">
      <RichTextContent content={post.postBody.content} />
      {/* {post.hashtags.map((tag) => (
        <a href="#" key={tag} className="feed-hashtag"> {tag}</a>
      ))} */}
    </div>
    <div className="feed-image-container">
      {post?.postBody?.image?.url?  <img src={post?.postBody?.image?.url} alt='Post content' className="feed-image" /> :<></> }
     
    </div>
  </div>

  {/* Card Actions */}
  <div className="feed-actions">
    <div className="feed-action-group">
      <button 
        className="feed-action-btn" 
        aria-label="Like post" 
        onClick={handleLike}
        disabled={isLiking}
      >
        {isLiked ? (
          <FiHeart
            style={{
              color: 'var(--primary-btn-bg, #ff7600)',
              fill: 'var(--primary-btn-bg, #ff7600)',
              stroke: 'var(--primary-btn-bg, #ff7600)',
            }}
            className="feed-action-liked"
          />
        ) : (
          <FiHeart />
        )}
        <span className="like-count">{post.likeCount || 0}</span>
      </button>
      <button className="feed-action-btn" aria-label="View comments">
        <FiMessageCircle />
        {/* <span>{post.comments}</span> */}
      </button>
      <button className="feed-action-btn" aria-label="Share post">
        <FiSend />
        {/* <span>{post.shares}</span> */}
      </button>
    </div>
  </div>

  {/* Comment Section */}
  <div className="feed-comment-section">
    {/* <img src={currentUser.avatar} alt="Your avatar" className="comment-avatar" /> */}
    <div className="comment-input-wrapper">
      <input type="text" placeholder="Write your comment" className="comment-input" />
    </div>
  </div>
</div> 
)}


export default Feed;