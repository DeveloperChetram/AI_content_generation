import { useState, useRef } from 'react';
import { IoArrowUp, IoCloudUploadOutline } from 'react-icons/io5';
import '../styles/CoverImageUpload.css';
import axios from '../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPostPayload } from '../redux/slices/postSlice';

const CoverImageUpload = () => {
  const dispatch = useDispatch();
  const [imageData, setImageData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const postPayload = useSelector((state) => state.post.postPayload);
  const handleGenerateImage = async (e) => {
    e.preventDefault();
    console.log("prompt from handleGenerateImage", prompt)
    const response = await axios.post('/api/generate-image', { 
      prompt,
      aspectRatio: "16:9" // Send 16:9 aspect ratio to 
      
    })
   await setImageData(response.data.image);
   await setPreviewImage(response.data.image);
   await dispatch(setPostPayload({
      "title": postPayload.title,
        "type": postPayload.type,
        "postBody": {
            "content": postPayload.postBody.content,
            "prompt": postPayload.postBody.prompt,
            "image": {
                "prompt": imageData.prompt,
                "url": imageData.url
            }
        },
        "isPosted": false,
    }));
    // if (!prompt.trim()) return;
    console.log("response from handleGenerateImage", response)
    
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      // In real implementation, you would call your AI service here
      console.log('Generating image with prompt:', prompt);
    }, 2000);
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
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleConfirmAndPost = () => {
    if (previewImage) {
      console.log('Posting with cover image:', previewImage);
      // In real implementation, you would save the post with the cover image
    }
  };

  return (
    <div className="cover-upload-container">
      <div className="cover-upload-content">
        <header className="pg-header">
          <h1>Upload cover image</h1>
          <p>Generate or upload your cover image</p>
        </header>

        {/* Preview Card */}
        <div className="glass-card pg-preview-card">
          <div className="preview-area">
            {previewImage ? (
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

        {/* Separator */}
        <div className="pg-separator">
          <span className="pg-separator-text">or</span>
        </div>

        {/* Upload Card */}
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

        {/* Action Card */}
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
              disabled={!previewImage}
            >
              Confirm and Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverImageUpload;
