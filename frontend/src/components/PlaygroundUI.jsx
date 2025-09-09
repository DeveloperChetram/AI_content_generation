import { useState, useRef, useEffect } from 'react';
import '../styles/PlaygroundUI.css';
import {
  IoChatbubbleEllipsesOutline,
  IoArrowUp,
  IoText,
  IoListOutline,
  IoLinkOutline,
  IoEye,
  IoCreate
} from 'react-icons/io5';
import { useForm } from 'react-hook-form';
import { generatePostAction } from '../redux/actions/postActions';
import { useDispatch, useSelector } from 'react-redux';
import { addAlert } from '../redux/slices/alertSlice';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

const PlaygroundUI = () => {
  const recentPost = useSelector((state) => state.post.recentPost);
  console.log("recentPost from PlaygroundUI", recentPost)
  const {register, handleSubmit, setValue, watch} = useForm();
  const dispatch = useDispatch();

  const [isGenerating, setIsGenerating] = useState(false);
  const [outputContent, setOutputContent] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const textareaRef = useRef(null);
  const hiddenPreviewRef = useRef(null);
  
  // Watch the output content for changes
  const watchedOutput = watch('outputContent', '');

  // Auto-resize textarea to match preview mode height
  const autoResize = () => {
    if (textareaRef.current && hiddenPreviewRef.current) {
      // Reset textarea height to auto
      textareaRef.current.style.height = 'auto';
      
      // Get the height of the hidden preview element
      const previewHeight = hiddenPreviewRef.current.offsetHeight;
      const minHeight = 200;
      
      // Use the preview height or minimum height, whichever is larger
      const finalHeight = Math.max(previewHeight, minHeight);
      textareaRef.current.style.height = finalHeight + 'px';
    }
  };

  // Update output content when recentPost changes
  useEffect(() => {
    if (recentPost && recentPost.content) {
      setValue('outputContent', recentPost.content);
      setOutputContent(recentPost.content);
    }
  }, [recentPost, setValue]);

  // Auto-resize when content changes
  useEffect(() => {
    autoResize();
  }, [outputContent]);

  // Maintain textarea height when switching modes
  useEffect(() => {
    if (!isPreviewMode && textareaRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        autoResize();
      }, 10);
    }
  }, [isPreviewMode]);

  // Rich text editor functions
  const insertMarkdown = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = watchedOutput || '';
    const selectedText = currentValue.substring(start, end);
    const newText = before + selectedText + after;
    
    const newValue = currentValue.substring(0, start) + newText + currentValue.substring(end);
    setValue('outputContent', newValue);
    setOutputContent(newValue);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const makeBold = () => insertMarkdown('**', '**');
  const makeItalic = () => insertMarkdown('*', '*');
  const makeList = () => insertMarkdown('- ');
  const makeLink = () => {
    const url = prompt('Enter URL:');
    if (url) insertMarkdown('[', `](${url})`);
  };

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const contentOptions = [
    { value: 'blog', label: 'Blog' },
    { value: 'tweet', label: 'Tweet' },
    { value: 'email', label: 'Email' },
    { value: 'article', label: 'Article' },
    { value: 'social', label: 'Social Media' },
    { value: 'newsletter', label: 'Newsletter' }
  ];

  const handleGenerate = async (data) => {
    console.log("data from handleGenerate", data)
    if (!data.prompt.trim() || !data.title.trim()) return;
    setIsGenerating(true);
    try {
      const result = await dispatch(generatePostAction(data.prompt, data.type, data.title));
      console.log("result from handleGenerate", result)
      if(result.status === 200){
       setIsGenerating(false);
      setTimeout(() => {
        dispatch(addAlert(
          {
            type:"info",
            content: `credits left ${result.data.creditLeft}`,
            duration:5000
          }
        ))
      }, 1000);
     }
     else{
      setIsGenerating(false);
     }
    } catch (error) {
      setIsGenerating(false);
      console.log("error from handleGenerate", error)
    }
  };


  return (
    <div className="playground-ui-container">
      <div className="playground-ui-content">
        <header className="pg-header">
          
          <h1>Hi, I'm wrAIte.</h1>
          <p>How can I help you today?</p>
        </header>

        <form onSubmit={handleSubmit(handleGenerate)}>
          <div className="pg-input-card glass-card">
            <textarea
              {...register('prompt')}
              className="pg-textarea"
              placeholder="Generate anything..."
             
             
            />
            <div className="pg-input-controls">
            
                <div className="pg-control-group">
                  <select
                    {...register('type')}
                    className="pg-input pg-dropdown-small"
                    placeholder="Select type"
                  >
                    <option value="" >Select type</option>
                    {contentOptions.map((option) => (
                      <option key={option.value} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    {...register('title')}
                    className="pg-input pg-input-expanded"
                    placeholder="Enter title"
                  />
                </div>
             
              <button type="submit" className="pg-submit-btn" aria-label="Generate content" disabled={isGenerating}>
                <IoArrowUp />
              </button>
            </div>
          </div>
        </form>

        <div className="pg-output-card glass-card">
          <div className="pg-output-toolbar">
            <button type="button" className="pg-toolbar-btn" onClick={makeBold} title="Bold">
              <IoText />
            </button>
            <button type="button" className="pg-toolbar-btn" onClick={makeItalic} title="Italic">
              <IoText />
            </button>
            <button type="button" className="pg-toolbar-btn" onClick={makeList} title="List">
              <IoListOutline />
            </button>
            <button type="button" className="pg-toolbar-btn" onClick={makeLink} title="Link">
              <IoLinkOutline />
            </button>
            <button 
              type="button" 
              className={`pg-toolbar-btn ${isPreviewMode ? 'active' : ''}`} 
              onClick={togglePreview} 
              title={isPreviewMode ? "Edit Mode" : "Preview Mode"}
            >
              {isPreviewMode ? <IoCreate /> : <IoEye />}
            </button>
          </div>
          
          {/* Hidden preview element for height measurement */}
          <div 
            ref={hiddenPreviewRef}
            className="markdown-content"
            style={{
              position: 'absolute',
              visibility: 'hidden',
              width: '100%',
              padding: '1rem',
              pointerEvents: 'none',
              zIndex: -1
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {outputContent || ''}
            </ReactMarkdown>
          </div>
          
          <div className="pg-output-content">
            {isGenerating && <p className="pg-output-placeholder">Generating...</p>}
            {!isGenerating && !outputContent && (
              <p className="pg-output-placeholder">output post</p>
            )}
            {!isGenerating && outputContent && !isPreviewMode && (
              <textarea
                ref={textareaRef}
                className="pg-output-textarea"
                placeholder="Generated content will appear here..."
                {...register('outputContent', {
                  value: outputContent,
                  onChange: (e) => {
                    setOutputContent(e.target.value);
                    autoResize();
                  }
                })}
              />
            )}
            {!isGenerating && outputContent && isPreviewMode && (
              <div className="markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <pre className="code-block">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code className="inline-code" {...props}>
                          {children}
                        </code>
                      );
                    },
                    pre({ children, ...props }) {
                      return <pre className="code-block" {...props}>{children}</pre>;
                    },
                    h1: ({ children }) => <h1 className="markdown-h1">{children}</h1>,
                    h2: ({ children }) => <h2 className="markdown-h2">{children}</h2>,
                    h3: ({ children }) => <h3 className="markdown-h3">{children}</h3>,
                    p: ({ children }) => <p className="markdown-p">{children}</p>,
                    ul: ({ children }) => <ul className="markdown-ul">{children}</ul>,
                    ol: ({ children }) => <ol className="markdown-ol">{children}</ol>,
                    li: ({ children }) => <li className="markdown-li">{children}</li>,
                    blockquote: ({ children }) => <blockquote className="markdown-blockquote">{children}</blockquote>,
                    strong: ({ children }) => <strong className="markdown-strong">{children}</strong>,
                    em: ({ children }) => <em className="markdown-em">{children}</em>,
                  }}
                >
                  {outputContent}
                </ReactMarkdown>
              </div>
            )}
          </div>
          <div className="pg-output-actions">
            {outputContent && !isGenerating && (
              <button type="button" className="pg-save-btn">
                Post
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundUI;