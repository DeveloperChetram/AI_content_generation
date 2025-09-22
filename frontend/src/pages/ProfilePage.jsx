
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiCalendar, FiCreditCard, FiEdit3, FiSettings, FiSearch, FiFilter, FiTrendingUp, FiClock, FiHeart, FiMessageCircle, FiSend, FiMoreHorizontal, FiPlus } from 'react-icons/fi';
import '../styles/Profile.css';
import { getPostsAction, likePostAction } from '../redux/actions/postActions';
import { emptyAllPosts } from '../redux/slices/postSlice';
import RichTextContent from '../components/RichTextContent';
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

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user);
  const allPosts = useSelector((state) => state.post.allPosts);
  const likedPosts = useSelector((state) => state.post.likedPosts);
  const likingPosts = useSelector((state) => state.post.likingPosts);
  const [isRecentPostLoading, setisRecentPostLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  
  useEffect(() => {
    console.log("allPosts", allPosts)
    console.log("user", user)
  }, [allPosts])

  const fetchRecentPost = async () => {
    setisRecentPostLoading(true)
    const result = await dispatch(getPostsAction())
    if (result.status === 200) {
      {
        // dispatch(addAlert({
        //   type: "success",
        //   message: "Recent posts fetched successfully"
        // })  )
        setisRecentPostLoading(false)

      }
      setisRecentPostLoading(false)
    }

  }
  
  useEffect(() => {
    fetchRecentPost()

    // console.log("allPosts", allPosts)
    return () => {
      dispatch(emptyAllPosts())
      console.log("allPosts", allPosts)
    }
  }, [])

  // Filter and sort posts
  const filteredAndSortedPosts = allPosts
    .filter(post => {
      const matchesSearch = searchQuery === '' || 
        post.postBody?.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.username?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesFilter = filterType === 'all' || post.type === filterType
      
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'likes':
          return (b.likeCount || 0) - (a.likeCount || 0)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

  return (
    <div className="profile-page">
      <div className="profile-page-container">
        {/* Instagram-style Profile Header */}
        <div className="profile-page-header">
          {/* Profile Avatar Section */}
          <div className="profile-avatar-section">
            <div className="profile-page-avatar">
              <img
                src={user?.user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.user?.name}&background=ff7600&color=fff`}
                alt="Profile"
              />
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="profile-info-section">
            {/* Username and Edit Button Row */}
            <div className="profile-name-row">
              <h1 className="profile-page-name">{user?.user?.name}</h1>
              <button
                className="profile-page-edit-btn"
                onClick={() => navigate('/profile/edit')}
              >
                <FiEdit3 className="edit-icon" />
                Edit Profile
              </button>
              <button
                className="create-post-cta-btn"
                onClick={() => navigate('/playground')}
              >
                <FiPlus className="create-icon" />
                Create Post
              </button>
            </div>

            {/* Stats Row */}
            <div className="profile-stats-row">
              <div className="stat-item">
                <span className="stat-number">{user?.user?.posts?.length || allPosts?.length || 0}</span>
                <span className="stat-label">posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{user?.user?.aiCredits || 0}</span>
                <span className="stat-label">text credits</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{user?.user?.aiImageCredits || 0}</span>
                <span className="stat-label">image credits</span>
              </div>
            </div>

            {/* Bio Section */}
            <div className="profile-bio-section">
              <h2 className="profile-display-name">{user?.user?.name}</h2>
              <p className="profile-bio-text">{user?.user?.bio}</p>
              <div className="profile-links">
                <a href={`mailto:${user?.user?.email}`} className="profile-link">
                  <FiMail className="link-icon" />
                  {user?.user?.email}
                </a>
              </div>
              <p className="profile-join-date">
                Joined {new Date(user?.user?.createdAt).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        {/* <div className="profile-page-stats">
          <div className="profile-stat-card">
            <div className="stat-icon">
              <FiCreditCard />
            </div>
            <div className="stat-content">
              <h3>AI Text Credits</h3>
              <p className="stat-number">{user?.user?.aiCredits || 0}</p>
              <span className="stat-label">credits remaining</span>
            </div>
          </div>

          <div className="profile-stat-card">
            <div className="stat-icon">
              <FiCreditCard />
            </div>
            <div className="stat-content">
              <h3>AI Image Credits</h3>
              <p className="stat-number">{user?.user?.aiImageCredits || 0}</p>
              <span className="stat-label">credits remaining</span>
            </div>
          </div>

          <div className="profile-stat-card">
            <div className="stat-icon">
              <FiUser />
            </div>
            <div className="stat-content">
              <h3>Total Posts</h3>
              <p className="stat-number">{user?.user?.posts?.length || 0}</p>
              <span className="stat-label">posts created</span>
            </div>
          </div>
        </div> */}

        {/* Profile Details */}
        <div className="profile-page-details">
          <div className="detail-section">
            <h2>Account Information</h2>
            <div className="detail-grid detail-grid-single-row">
              <div className="detail-item">
                <FiMail className="detail-icon" />
                <div className="detail-content">
                  <label>EMAIL ADDRESS</label>
                  <p>{user?.user?.email}</p>
                </div>
              </div>

              <div className="detail-item">
                <FiCalendar className="detail-icon" />
                <div className="detail-content">
                  <label>MEMBER SINCE</label>
                  <p>{new Date(user?.user?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="detail-item">
                <FiUser className="detail-icon" />
                <div className="detail-content">
                  <label>ACCOUNT TYPE</label>
                  <p>Free Account</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Posts Section with Search */}
          <div className="posts-section">
            <div className="posts-header">
              <h2>Your Posts</h2>
              <div className="posts-stats">
                <span className="posts-count">{filteredAndSortedPosts.length} posts</span>
              </div>
            </div>
            
            <div className="posts-content-container">
              {/* Mobile Filter Dropdown */}
              <div className="mobile-filter-dropdown">
                <button 
                  className={`mobile-filter-toggle ${isMobileFilterOpen ? 'active' : ''}`}
                  onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                >
                  <span>Search & Filter Posts</span>
                  <FiMoreHorizontal className={`filter-arrow ${isMobileFilterOpen ? 'rotated' : ''}`} />
                </button>
                
                <div className={`mobile-filter-content ${isMobileFilterOpen ? 'active' : ''}`}>
                  <div className="mobile-filter-row">
                    <div className="mobile-search-wrapper">
                      <FiSearch className="mobile-search-icon" />
                      <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mobile-search-input"
                      />
                    </div>
                  </div>
                  
                  <div className="mobile-filter-row">
                    <div className="mobile-filter-buttons">
                      <button 
                        className={`mobile-filter-btn ${filterType === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterType('all')}
                      >
                        All Posts
                      </button>
                      <button 
                        className={`mobile-filter-btn ${filterType === 'Tips & Tricks' ? 'active' : ''}`}
                        onClick={() => setFilterType('Tips & Tricks')}
                      >
                        Tips & Tricks
                      </button>
                      <button 
                        className={`mobile-filter-btn ${filterType === 'Coding meme' ? 'active' : ''}`}
                        onClick={() => setFilterType('Coding meme')}
                      >
                        Coding Memes
                      </button>
                      <button 
                        className={`mobile-filter-btn ${filterType === 'Hot quote' ? 'active' : ''}`}
                        onClick={() => setFilterType('Hot quote')}
                      >
                        Hot Quotes
                      </button>
                      <button 
                        className={`mobile-filter-btn ${filterType === 'AI prompts' ? 'active' : ''}`}
                        onClick={() => setFilterType('AI prompts')}
                      >
                        AI Prompts
                      </button>
                    </div>
                  </div>
                  
                  <div className="mobile-filter-row">
                    <div className="mobile-sort-buttons">
                      <button 
                        className={`mobile-sort-btn ${sortBy === 'recent' ? 'active' : ''}`}
                        onClick={() => setSortBy('recent')}
                      >
                        <FiClock className="mobile-sort-btn-icon" />
                        Recent
                      </button>
                      <button 
                        className={`mobile-sort-btn ${sortBy === 'likes' ? 'active' : ''}`}
                        onClick={() => setSortBy('likes')}
                      >
                        <FiHeart className="mobile-sort-btn-icon" />
                        Liked
                      </button>
                      <button 
                        className={`mobile-sort-btn ${sortBy === 'oldest' ? 'active' : ''}`}
                        onClick={() => setSortBy('oldest')}
                      >
                        <FiClock className="mobile-sort-btn-icon" />
                        Oldest
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filter Sidebar */}
              <div className="search-sidebar">
                <div className="search-container">
                  <div className="search-input-wrapper">
                    <FiSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input"
                    />
                  </div>
                </div>

                <div className="filter-section">
                  <h3 className="filter-title">
                    <FiFilter className="filter-icon" />
                    Filter by Type
                  </h3>
                  <div className="filter-options">
                    <button 
                      className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                      onClick={() => setFilterType('all')}
                    >
                      All Posts
                    </button>
                    <button 
                      className={`filter-btn ${filterType === 'Tips & Tricks' ? 'active' : ''}`}
                      onClick={() => setFilterType('Tips & Tricks')}
                    >
                      Tips & Tricks
                    </button>
                    <button 
                      className={`filter-btn ${filterType === 'Coding meme' ? 'active' : ''}`}
                      onClick={() => setFilterType('Coding meme')}
                    >
                      Coding Memes
                    </button>
                    <button 
                      className={`filter-btn ${filterType === 'Hot quote' ? 'active' : ''}`}
                      onClick={() => setFilterType('Hot quote')}
                    >
                      Hot Quotes
                    </button>
                    <button 
                      className={`filter-btn ${filterType === 'AI prompts' ? 'active' : ''}`}
                      onClick={() => setFilterType('AI prompts')}
                    >
                      AI Prompts
                    </button>
                  </div>
                </div>

                <div className="sort-section">
                  <h3 className="sort-title">
                    <FiTrendingUp className="sort-icon" />
                    Sort By
                  </h3>
                  <div className="sort-options">
                    <button 
                      className={`sort-btn ${sortBy === 'recent' ? 'active' : ''}`}
                      onClick={() => setSortBy('recent')}
                    >
                      <FiClock className="sort-btn-icon" />
                      Most Recent
                    </button>
                    <button 
                      className={`sort-btn ${sortBy === 'likes' ? 'active' : ''}`}
                      onClick={() => setSortBy('likes')}
                    >
                      <FiHeart className="sort-btn-icon" />
                      Most Liked
                    </button>
                    <button 
                      className={`sort-btn ${sortBy === 'oldest' ? 'active' : ''}`}
                      onClick={() => setSortBy('oldest')}
                    >
                      <FiClock className="sort-btn-icon" />
                      Oldest First
                    </button>
                  </div>
                </div>
              </div>

              {/* Posts List */}
              <div className="posts-main-content">
                <div className="posts-list">
                  {isRecentPostLoading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>Loading posts...</p>
                    </div>
                  ) : filteredAndSortedPosts.length > 0 ? (
                    filteredAndSortedPosts.map((post) => 
                      <RecentPosts 
                        key={post._id}
                        post={post} 
                        isLiked={likedPosts.includes(post._id)}
                        isLiking={likingPosts.includes(post._id)}
                        onLike={() => dispatch(likePostAction(post._id))}
                      /> 
                    )
                  ) : (
                    <div className="no-posts">
                      <div className="no-posts-content">
                        <h3>No posts found</h3>
                        <p>
                          {searchQuery || filterType !== 'all' 
                            ? "Try adjusting your search or filters" 
                            : "No posts created yet"}
                        </p>
                        {!searchQuery && filterType === 'all' && (
                          <button className="create-post-btn" onClick={() => navigate('/playground')}>
                            Create Your First Post
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


const RecentPosts = ({ post, isLiked, isLiking, onLike }) => {
  const handleLike = () => {
    if (!isLiking) {
      onLike();
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
    };

    return classMap[type] || 'tag-default';
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
    };

    const IconComponent = iconMap[type] || AiOutlineStar;
    return <IconComponent className="tag-icon" />;
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
    };

    return classMap[type] || 'card-default';
  };
  return (
    <>
      <div className={`feed-card ${getCardClass(post.type)}`}>
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
            {post?.postBody?.image?.url ? <img src={post?.postBody?.image?.url} alt='Post content' className="feed-image" /> : <></>}

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
    </>




  )
}