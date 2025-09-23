import React, { useState } from 'react';
import { FiHeart, FiMessageCircle, FiSend } from 'react-icons/fi';
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
import RichTextContent from './RichTextContent';
import '../styles/Feed.css';

const FeedCard = ({ 
  post, 
  currentUser, 
  isLiked = false, 
  isLiking = false, 
  onLike, 
  onComment,
  showCommentSection = true,
  className = ''
}) => {
  const [commentText, setCommentText] = useState('');

  const handleLike = async () => {
    if (isLiking || !onLike) return;
    await onLike(post._id);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !onComment) return;
    
    try {
      await onComment(post._id, commentText.trim());
      setCommentText('');
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${post._id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${post.username || post.user?.name || 'Anonymous'}`,
          text: post?.postBody?.content || post?.content || 'Check out this post!',
          url: postUrl,
        });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(postUrl);
        console.log('Post URL copied to clipboard:', postUrl);
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        window.open(postUrl, '_blank');
      }
    }
  };

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
      'blog': 'tag-blog',
      'social': 'tag-social',
      'news': 'tag-news',
    };
    
    return classMap[type] || 'tag-default';
  };

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
      'blog': 'blog-card',
      'social': 'social-card',
      'news': 'news-card',
    };
    
    return classMap[type] || 'card-default';
  };

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
      'blog': '📝',
      'social': '👥',
      'news': '📰',
    };
    
    const IconComponent = iconMap[type];
    
    if (typeof IconComponent === 'string') {
      return IconComponent;
    }
    return IconComponent ? <IconComponent className="tag-icon" /> : <AiOutlineStar className="tag-icon" />;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className={`feed-card ${getCardClass(post?.type)} ${className}`} key={post._id}>
      <div className="feed-header">
        <div className="feed-user-info">
          {post?.user?.profilePicture ? (
            <img 
              src={post.user.profilePicture} 
              alt={`${post.user.name || post.username}'s profile`} 
              className="feed-profile-icon" 
            />
          ) : (
            <div className="feed-profile-initials">
              {getInitials(post?.user?.name || post.username || 'User')}
            </div>
          )}
          <div className="feed-user-details">
            <h3 className="feed-username">{post.username || post.user?.name || 'Anonymous'}</h3>
            <p className="feed-timestamp">
              {post.createdAt
                ? new Date(post.createdAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
                : ''}
            </p>
          </div>
        </div>
        <span className={`feed-type-tag tag-base ${getTagClass(post?.type)}`}>
          {getTagIcon(post?.type)}
          {post?.type}
        </span>
      </div>
    
      <div className="feed-content">
        <div className="feed-caption">
          <RichTextContent content={post?.postBody?.content || post?.content || ''} />
          {post?.hashtags && post.hashtags.length > 0 && (
            <div className="feed-hashtags">
              {post.hashtags.map((tag, index) => (
                <a href="#" key={index} className="feed-hashtag">#{tag}</a>
              ))}
            </div>
          )}
        </div>
        <div className="feed-image-container">
          {post?.postBody?.image?.url && (
            <img 
              src={post.postBody.image.url} 
              alt='Post content' 
              className="feed-image" 
            />
          )}
        </div>
      </div>
    
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
            <span className="like-count">{post?.likeCount || 0}</span>
          </button>
          <button 
            className="feed-action-btn" 
            aria-label="Share post"
            onClick={handleShare}
          >
            <FiSend />
            <span>{post?.shareCount || 0}</span>
          </button>
        </div>
      </div>
    
      {showCommentSection && (
        <div className="feed-comment-section">
          {currentUser?.avatar && (
            <img 
              src={currentUser.avatar} 
              alt="Your avatar" 
              className="comment-avatar" 
            />
          )}
          <form className="comment-input-wrapper" onSubmit={handleComment}>
            <input 
              type="text" 
              placeholder="Write your comment..." 
              className="comment-input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            {onComment && (
              <button 
                type="submit" 
                className="comment-submit-btn"
                disabled={!commentText.trim()}
              >
                Post
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default FeedCard;
