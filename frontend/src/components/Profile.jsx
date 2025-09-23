import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiSettings, FiLogOut, FiEdit3, FiMail, FiCalendar, FiCreditCard, FiX } from 'react-icons/fi';
import { logoutUserAction } from '../redux/actions/userActions';
import { addAlert } from '../redux/slices/alertSlice';
import '../styles/Profile.css';

const Profile = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  // console.log(user.user.createdAt);
  // Temporarily disable outside click to test button functionality
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     // Check if the click is on a button or inside the profile card
  //     if (profileRef.current && 
  //         !profileRef.current.contains(event.target) &&
  //         !event.target.closest('.profile-action-btn')) {
  //       onClose();
  //     }
  //   };

  //   if (isOpen) {
  //     // Use a slight delay to ensure button clicks are processed first
  //     const timeoutId = setTimeout(() => {
  //       document.addEventListener('mousedown', handleClickOutside);
  //     }, 50);
      
  //     return () => {
  //       clearTimeout(timeoutId);
  //       document.removeEventListener('mousedown', handleClickOutside);
  //     };
  //   }
  // }, [isOpen, onClose]);

  const handleLogout = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Logout button clicked');
    try {
      const result = await dispatch(logoutUserAction());
      if (result.status === 200) {
        dispatch(addAlert({
          type: 'success',
          content: 'Logged out successfully',
          duration: 3000
        }));
        navigate('/login');
        onClose();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleEditProfile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Edit profile button clicked');
    navigate('/profile/edit');
    onClose();
  };

  const handleSettings = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Settings button clicked');
    dispatch(addAlert({
      type: 'info',
      content: 'Settings functionality coming soon!',
      duration: 3000
    }));
    onClose();
  };

  const handleViewProfile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('View profile button clicked');
    navigate('/profile');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={profileRef}
      className="profile-dropdown"
    >
      {/* Close Button */}
      <button 
        className="profile-close-btn"
        onClick={onClose}
        aria-label="Close profile"
      >
        <FiX />
      </button>
      
      {/* Profile Header */}
      <div className="profile-header">
          <div className="profile-avatar">
            <img 
              src={user?.user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.user?.name}&background=ff7600&color=fff`} 
              alt="Profile" 
            />
          </div>
          <div className="profile-info">
            <h3 className="profile-name">{user?.user?.name}</h3>
            <p className="profile-email">{user?.user?.email}</p>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-label">AI Credits</span>
            <span className="stat-value">{user?.user?.aiCredits || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Image Credits</span>
            <span className="stat-value">{user?.user?.aiImageCredits || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Posts</span>
            <span className="stat-value">{user?.user?.posts?.length || 0}</span>
          </div>
        </div>

        {/* Profile Actions */}
        <div className="profile-actions">
          <button className="profile-action-btn" onClick={handleViewProfile}>
            <FiUser className="action-icon" />
            <span>View Profile</span>
          </button>
          
          <button className="profile-action-btn" onClick={handleEditProfile}>
            <FiEdit3 className="action-icon" />
            <span>Edit Profile</span>
          </button>
          
          <button className="profile-action-btn" onClick={handleSettings}>
            <FiSettings className="action-icon" />
            <span>Settings</span>
          </button>
          
          <button className="profile-action-btn" onClick={handleLogout}>
            <FiLogOut className="action-icon" />
            <span>Logout</span>
          </button>
        </div>

        {/* Account Info */}
        <div className="profile-footer">
          <div className="account-info">
            <div className="info-item">
              <FiMail className="info-icon" />
              <span>{user?.user?.email}</span>
            </div>
            <div className="info-item">
              <FiCalendar className="info-icon" />
              <span>Member since {new Date(user?.user?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Profile;
