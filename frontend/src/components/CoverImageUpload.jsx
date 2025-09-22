import { useState, useRef } from 'react';
import { IoArrowUp, IoCloudUploadOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import '../styles/CoverImageUpload.css';
import axios from '../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPostPayload } from '../redux/slices/postSlice';
import { addAlert } from '../redux/slices/alertSlice';

const CoverImageUpload = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imageData, setImageData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [savedPost, setSavedPost] = useState(null);
  const fileInputRef = useRef(null);

  const postPayload = useSelector((state) => state.post.postPayload);
  const handleGenerateImage = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    console.log("prompt from handleGenerateImage", prompt);
    setIsGenerating(true);
    dispatch(addAlert({
      type: 'info',
      content: 'Generating image...',
      duration: false
    }));
    try {
      const response = await axios.post('/api/generate-image', { 
        prompt,
        aspectRatio: "16:9"
      });
      dispatch(addAlert({
        type: 'success',
        content: 'Image generated successfully',
        duration: 3000
      }));
      console.log("response from handleGenerateImage", response);
      
      // Set the image data and preview
      setImageData(response.data);
      setPreviewImage(response.data.image);
      
      // Update Redux state with AI generated image data
      dispatch(setPostPayload({
        "title": postPayload.title,
        "type": postPayload.type,
        "postBody": {
          "content": postPayload.postBody.content,
          "prompt": postPayload.postBody.prompt,
          "image": {
            "prompt": response.data.prompt,
            "url": "" // Will be set after ImageKit upload
          }
        },
        "isPosted": false,
      }));
      
    } catch (error) {
      console.error("Error generating image:", error);
      dispatch(addAlert({
        type: 'error',
        content: 'Error generating image',
        duration: 3000
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setIsUploading(false);
        dispatch(addAlert({
          type: 'success',
          content: 'Image uploaded successfully',
          duration: 3000
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
    console.log(fileInputRef.current.files[0])
  };

  const handleConfirmAndPost = async () => {
    try {
      let imageUrl = '';

      // Only process image if one exists
      if (imageData && imageData.image) {
        dispatch(addAlert({
          type: 'info',
          content: 'Uploading AI generated image to ImageKit...',
          duration: false
        }));

        const imageResponse = await axios.post('/api/posts/upload-image-for-link', {
          imageUrl: imageData.image
        });
        
        imageUrl = imageResponse.data.image.url;
        
        dispatch(addAlert({
          type: 'success',
          content: 'AI image uploaded to ImageKit successfully',
          duration: 3000
        }));
      }
      else if (uploadedFileName && fileInputRef.current.files[0]) {
        dispatch(addAlert({
          type: 'info',
          content: 'Uploading image to ImageKit...',
          duration: false
        }));

        const formData = new FormData();
        formData.append('file', fileInputRef.current.files[0]);
        
        const imageResponse = await axios.post('/api/posts/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        imageUrl = imageResponse.data.image.url;
        
        dispatch(addAlert({
          type: 'success',
          content: 'Image uploaded to ImageKit successfully',
          duration: 3000
        }));
      }

      // Save post with or without image
      const postResponse = await axios.post('/api/posts/save-post', {
        title: postPayload.title,
        type: postPayload.type,
        content: postPayload.postBody.content,
        prompt: postPayload.postBody.prompt,
        imagePrompt: postPayload.postBody.image.prompt || '',
        imageUrl: imageUrl || '', // Allow empty image URL
        userID: postPayload.userID
      });
      
      console.log('Post saved successfully:', postResponse.data);
      
      // Store the saved post data
      setSavedPost(postResponse.data);
      
      dispatch(addAlert({
        type: 'success',
        content: `Post "${postResponse.data.post.title}" saved successfully! Post ID: ${postResponse.data.postId}`,
        duration: 5000
      }));
      
      // Navigate to posts page or dashboard after successful creation
      setTimeout(() => {
        navigate('/feed'); 
      }, 2000);
      
    } catch (error) {
      console.error('Error saving post:', error);
      dispatch(addAlert({
        type: 'error',
        content: 'Error saving post',
        duration: 3000
      }));
    }
  };

  return (
    <div className="cover-upload-container">
      <div className="cover-upload-content">
        <header className="pg-header">
          <h1>Add cover image (optional)</h1>
          <p>Generate or upload a cover image, or continue without one</p>
        </header>

        {/* Preview Card */}
        <div className="glass-card pg-preview-card">
          <div className="preview-area">
            {isGenerating ? (
              <div className="preview-loading">
                <div className="loading-text">Generating Image</div>
                <div className="loading-dots">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                </div>
              </div>
            ) : previewImage ? (
              <img src={previewImage} alt="Preview" className="preview-image" />
            ) : (
              <div className="preview-placeholder">
                <div className="preview-text">Preview</div>
                <div className="preview-graphic">
                  <svg viewBox="0 0 100 20" className="preview-chart">
                    <path 
                      d="M0,15 Q25,5 50,10 T100,8" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Generate with AI Card */}
        <div className="glass-card pg-generate-card">
          <h3 className="pg-section-title">Generate with wrAIte</h3>
          <form onSubmit={handleGenerateImage} className="pg-generate-form">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="give your prompt to generate image"
              className="pg-input pg-prompt-input"
              disabled={isGenerating}
            />
            <button 
              onClick={handleGenerateImage}
              type="submit" 
              className="pg-submit-btn"
              disabled={isGenerating || !prompt.trim()}
            >
              <IoArrowUp />
            </button>
          </form>
        </div>

        {/* Separator - Only show if no AI image generated */}
        {!imageData && (
          <div className="pg-separator">
            <span className="pg-separator-text">or</span>
          </div>
        )}

        {/* Upload Card - Only show if no AI image generated */}
        {!imageData && (
          <div className="glass-card pg-upload-card">
            <h3 className="pg-section-title">Upload Local file</h3>
            <button 
              type="button" 
              className="pg-upload-btn"
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              <IoCloudUploadOutline className="pg-upload-icon" />
              <span className="pg-upload-text">upload manually</span>
            </button>
            {uploadedFileName && (
              <div className="pg-file-info">
                <span className="pg-file-name">{uploadedFileName}</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="pg-hidden-file-input"
            />
          </div>
        )}

   


        {/* Success Card - Show when post is saved */}
      

        {/* Action Card */}
        {!savedPost && (
          <div className="glass-card pg-action-card">
            <div className="pg-action-content">
              <div className="pg-content-warning">
                <p className="warning-text">
                  Please ensure your content is respectful and appropriate. 
                  No NSFW, offensive, or harmful content will be tolerated.
                </p>
              </div>
              <button 
                className="pg-save-btn"
                onClick={handleConfirmAndPost}
              >
                {previewImage ? 'Confirm and Post' : 'Post Without Image'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverImageUpload;
