import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiArrowLeft, FiSave, FiUpload, FiCamera } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import '../styles/EditProfile.css';
import axios from '../api/axios';
import { setUser } from '../redux/slices/userSlice';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  // For image preview
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
    clearErrors
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      bio: '',
      profilePicture: '',
      aiCredits: 0,
      aiImageCredits: 0,
      password: ''
    } 
  });
const updateProfileHandler = async (data) => {
  setLoading(true);
  setSubmitError('');
  // try {
  //   // TODO: Implement API call to update user profile
  //   // For now, just log and simulate delay
  //   console.log('Updating profile with:', data);

  //   // await new Promise((resolve) => setTimeout(resolve, 1000));

  //   // Navigate back to profile page
  //   navigate('/profile');
  // } catch (error) {
  //   setSubmitError('Failed to update profile. Please try again.');
  // } finally {
  //   setLoading(false);
  // }
  // Create FormData for file upload
  const formData = new FormData();
  formData.append('username', data.name);
  formData.append('email', data.email);
  formData.append('bio', data.bio);
  formData.append('password', data.password);
  
  // Only append file if it's a File object (new upload)
  if (data.profilePicture && data.profilePicture instanceof File) {
    formData.append('profilePicture', data.profilePicture);
    console.log("Appending file:", data.profilePicture.name, data.profilePicture.size);
  }
  
  console.log("formData entries:");
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }
  
  const response = await axios.patch(`/api/user/update-user`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  if(response.status === 201){
    setLoading(false);
    dispatch(setUser(response.data.updatedUser));
    navigate('/profile');
  }
  else{
    setLoading(false);
    setSubmitError(response.data.message);
  }
  console.log("response", response);
}
  // Watch bio for character count
  const bioValue = watch('bio', '');

  useEffect(() => {
    if (user?.user) {
      reset({
        name: user.user.name || '',
        email: user.user.email || '',
        bio: user.user.bio || "Hey dude, I'm user of wrAIte",
        profilePicture: user.user.profilePicture || user.user.avatar || 'https://via.placeholder.com/150',
        aiCredits: user.user.aiCredits || 0,
        aiImageCredits: user.user.aiImageCredits || 0
      });
      setImagePreview(
        user.user.profilePicture ||
          user.user.avatar ||
          'https://via.placeholder.com/150'
      );
    }
    // eslint-disable-next-line
  }, [user, reset]);

  // Handle image upload and preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Store the actual file object for upload
      setValue('profilePicture', file, { shouldValidate: true });
      clearErrors('profilePicture');
    }
  };



  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        {/* Header */}
        <div className="edit-profile-header">
          <button className="back-button" onClick={handleCancel}>
            <FiArrowLeft className="back-icon" />
            Back to Profile
          </button>
          <h1 className="edit-profile-title">Edit Profile</h1>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit(updateProfileHandler)} className="edit-profile-form" noValidate>
          {/* Profile Picture Section */}
          <div className="profile-picture-section">
            <div className="profile-picture-container">
              <img
                src={imagePreview}
                alt="Profile"
                className="profile-picture-preview"
              />
              <div className="profile-picture-overlay">
                <FiCamera className="camera-icon" />
              </div>
            </div>
            <div className="profile-picture-actions">
              <label className="upload-button">
                <FiUpload className="upload-icon" />
                Upload New Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
              <p className="upload-hint">JPG, PNG or GIF. Max size 2MB.</p>
              {errors.profilePicture && (
                <span className="error-message">{errors.profilePicture.message}</span>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <FiUser className="label-icon" />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }
                })}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter your full name"
                autoComplete="off"
              />
              {errors.name && <span className="error-message">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <FiMail className="label-icon" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Email is invalid'
                  }
                })}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email address"
                autoComplete="off"
              />
              {errors.email && <span className="error-message">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="bio" className="form-label">
                Bio
              </label>
              <textarea
                id="bio"
                {...register('bio', {
                  maxLength: {
                    value: 500,
                    message: 'Bio must be less than 500 characters'
                  }
                })}
                className={`form-textarea ${errors.bio ? 'error' : ''}`}
                placeholder="Tell us about yourself..."
                rows="3"
                maxLength="100"
              />
              <div className="character-count">
                {bioValue ? bioValue.length : 0}/100 characters
              </div>
              {errors.bio && <span className="error-message">{errors.bio.message}</span>}
            </div>
          </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register('password', {
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter new password (leave blank to keep current)"
                autoComplete="new-password"
              />
              {errors.password && <span className="error-message">{errors.password.message}</span>}
            </div>


          {/* Error Message */}
          {submitError && (
            <div className="submit-error">
              {submitError}
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="save-icon" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
