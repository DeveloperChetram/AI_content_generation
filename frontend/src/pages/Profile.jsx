
import React from 'react';
import { useSelector } from 'react-redux';
import { FiUser, FiMail, FiCalendar, FiCreditCard, FiEdit3, FiSettings } from 'react-icons/fi';
import '../styles/Profile.css';

const Profile = () => {
  const user = useSelector((state) => state.user);

  return (
    <div className="profile-page">
      <div className="profile-page-container">
        {/* Profile Header */}
        <div className="profile-page-header">
          <div className="profile-page-avatar">
            <img 
              src={user?.user?.avatar || `https://ui-avatars.com/api/?name=${user?.user?.name}&background=ff7600&color=fff`} 
              alt="Profile" 
            />
          </div>
          <div className="profile-page-info">
            <h1 className="profile-page-name">{user?.user?.name}</h1>
            <p className="profile-page-email">{user?.user?.email}</p>
            <p className="profile-page-join-date">
              Member since {new Date(user?.user?.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button className="profile-page-edit-btn">
            <FiEdit3 className="edit-icon" />
            Edit Profile
          </button>
        </div>

        {/* Profile Stats */}
        <div className="profile-page-stats">
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
        </div>

        {/* Profile Details */}
        <div className="profile-page-details">
          <div className="detail-section">
            <h2>Account Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <FiMail className="detail-icon" />
                <div className="detail-content">
                  <label>Email Address</label>
                  <p>{user?.user?.email}</p>
                </div>
              </div>
              
              <div className="detail-item">
                <FiCalendar className="detail-icon" />
                <div className="detail-content">
                  <label>Member Since</label>
                  <p>{new Date(user?.user?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="detail-item">
                <FiUser className="detail-icon" />
                <div className="detail-content">
                  <label>Account Type</label>
                  <p>Free Account</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Posts */}
          <div className="detail-section">
            <h2>Recent Posts</h2>
            <div className="posts-list">
              {user?.user?.posts?.length > 0 ? (
                user.user.posts.slice(0, 5).map((post, index) => (
                  <div key={post._id || index} className="post-item">
                    <div className="post-content">
                      <h4 className="post-title">{post.title}</h4>
                      <p className="post-excerpt">{post.content?.substring(0, 100)}...</p>
                    </div>
                    <div className="post-meta">
                      <span className="post-date">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-posts">
                  <p>No posts created yet</p>
                  <button className="create-post-btn">Create Your First Post</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
