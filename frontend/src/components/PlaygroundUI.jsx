import { useState, useRef, useEffect, useMemo } from 'react';
import '../styles/PlaygroundUI.css';
import {
  IoArrowUp,
  IoList,
  IoCode,
  IoText,
  IoEye,
  IoCreate,
  IoTrash
} from 'react-icons/io5';
import { useForm } from 'react-hook-form';
import { generatePostAction } from '../redux/actions/postActions';
import { useDispatch, useSelector } from 'react-redux';
import { addAlert } from '../redux/slices/alertSlice';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import { marked } from 'marked';
import { setPostPayload, setRecentPost } from '../redux/slices/postSlice';
import { useNavigate } from 'react-router-dom';

const PlaygroundUI = () => {
  const navigate = useNavigate();
  const recentPost = useSelector((state) => state.post.recentPost);
  const [contentForValidation, setContentForValidation] = useState('');
  const [isEditorEffectivelyEmpty, setIsEditorEffectivelyEmpty] = useState(true);

  console.log("recentPost from PlaygroundUI", recentPost)
  const {register, handleSubmit, setValue, watch} = useForm({
    defaultValues: {
      title: recentPost?.title || '',
      type: recentPost?.type || ''
    }
  });
  const watchedTitle = watch('title');
  const watchedType = watch('type');
  const dispatch = useDispatch();

  // Function to update recent post state with current title and content
  const updateRecentPostState = () => {
    if (!editor) return; // Guard against editor not being ready
    const updatedRecentPost = {
      title: watchedTitle,
      type: watchedType,
      content: editor.getHTML(),
    };
    dispatch(setRecentPost(updatedRecentPost));
  };

  // Memoize validation checks to prevent re-calculation on every render
  const isDefaultContent = useMemo(() => {
    if (!contentForValidation) return false;
    return contentForValidation.includes('Welcome to your output space') ||
            contentForValidation.includes('default-content') ||
            contentForValidation.includes('Start writing or generate content with');
  }, [contentForValidation]);

  const hasRealContent = useMemo(() => !isEditorEffectivelyEmpty && !isDefaultContent, [isEditorEffectivelyEmpty, isDefaultContent]);
  const hasTitle = useMemo(() => !!(watchedTitle && watchedTitle.trim()), [watchedTitle]);
  const hasType = useMemo(() => !!(watchedType && watchedType.trim()), [watchedType]);

  // Function to check if all required fields are provided
  const isContinueEnabled = () => {
    return hasTitle && hasType && hasRealContent && !isGenerating;
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isClearingContent, setIsClearingContent] = useState(false);

  // Configure lowlight with multiple languages
  const lowlight = createLowlight();
  lowlight.register('javascript', javascript);
  lowlight.register('python', python);
  lowlight.register('html', html);
  lowlight.register('css', css);
  lowlight.register('json', json);


  // Tiptap editor configuration
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
        paragraph: {
          HTMLAttributes: {
            class: 'paragraph',
          },
        },
      }),
      CodeBlockLowlight.configure({
        lowlight: lowlight,
        defaultLanguage: 'javascript',
      }),
    ],
    content: `
      <div class="default-content">
        <h1>Welcome to your output space! 🚀</h1>
        <p>Start writing or generate content with <em>wrAIte</em>.</p>
        
        <h2>Features:</h2>
        <p>Use <strong>bold</strong>, <em>italic</em>, and headings (H1, H2, H3).</p>
        <ul>
          <li>Bullet points</li>
          <li>Numbered lists</li>
        </ul>
        <blockquote>
          <p>"Quote your thoughts!"</p>
        </blockquote>
        <h3>Code Example:</h3>
        <pre><code class="language-javascript">// JS code
console.log("Hello!");</code></pre>
        <p>Ready to create? ✨</p>
      </div>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        spellcheck: 'false',
      },
    },
    onUpdate: ({ editor }) => {
      // Ensure editor updates are tracked
      setContentForValidation(editor.getHTML());
      // An editor is "effectively empty" if it's pristine empty OR only contains whitespace
      const isEmpty = editor.isEmpty || editor.getText().trim() === '';
      setIsEditorEffectivelyEmpty(isEmpty);
      console.log('Editor updated:', editor.getHTML());
    },
    onCreate: ({ editor }) => {
      // Focus the editor when it's created
      setContentForValidation(editor.getHTML());
      // An editor is "effectively empty" if it's pristine empty OR only contains whitespace
      const isEmpty = editor.isEmpty || editor.getText().trim() === '';
      setIsEditorEffectivelyEmpty(isEmpty);
      console.log('Editor created successfully');
      setTimeout(() => {
        editor.commands.focus();
      }, 100);
    },
    onDestroy: () => {
      console.log('Editor destroyed');
    },
  });

  // Function to convert Markdown to HTML
  const convertMarkdownToHTML = (markdownContent) => {
    if (!markdownContent) return '';
    
    // Configure marked options for better compatibility with Tiptap
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: false,
      mangle: false
    });
    
    return marked(markdownContent);
  };

  // Update editor content when recentPost changes
  useEffect(() => {
    if (recentPost && recentPost.content && editor) {
      const editorContent = editor.getHTML();
      
      // Check if content is Markdown (contains markdown syntax)
      const isMarkdown = /^#{1,6}\s|^\*\*|^\*[^*]|^```|^`[^`]|^\-\s|^\d+\.\s|^\>\s|^\[.*\]\(.*\)/m.test(recentPost.content);
      
      console.log('Content type detected:', isMarkdown ? 'Markdown' : 'HTML');
      console.log('Content preview:', recentPost.content.substring(0, 200) + '...');
      
      let newContent;
      if (isMarkdown) {
        // Convert Markdown to HTML
        newContent = convertMarkdownToHTML(recentPost.content);
        console.log('Converted HTML:', newContent.substring(0, 200) + '...');
      } else {
        // Use content as-is (already HTML)
        newContent = recentPost.content;
      }
      
      // Only update if the content has actually changed to avoid cursor jumps
      if (newContent !== editorContent) {
        editor.commands.setContent(newContent, { emitUpdate: true });
      }
    }
  }, [recentPost, editor]);

  // This single effect now handles syncing all form state to Redux
  useEffect(() => {
    if (editor) {
      // Sync state when dependencies change (e.g., title/type inputs)
      updateRecentPostState();

      // Also set up a listener for editor content changes
      const handleEditorUpdate = () => {
        updateRecentPostState();
      };

      editor.on('update', handleEditorUpdate);
      
      return () => {
        editor.off('update', handleEditorUpdate);
      };
    }
  }, [editor, watchedTitle, watchedType]); // Simplified dependencies

  // Toolbar functions
  const togglePreview = (e) => {
    e.preventDefault();
    setIsPreviewMode(!isPreviewMode);
  };

  const handleClearContent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (editor) {
      setIsClearingContent(true);
      setTimeout(() => {
        editor.commands.clearContent();
        editor.commands.insertContent('<p></p>'); // Insert empty paragraph
        setIsClearingContent(false);
      }, 300); // Animation duration - matches CSS
    }
  };

  const handleToolbarClick = (command, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (editor && command) {
      command.run();
      // Force a small delay to ensure the editor updates properly
      setTimeout(() => {
        editor.commands.focus();
      }, 10);
    }
  };

  // Function to get editor content as Markdown
  const getEditorContentAsMarkdown = () => {
    if (!editor) return '';
    
    // Get HTML content from editor
    const htmlContent = editor.getHTML();
    
    // Simple HTML to Markdown conversion for basic elements
    let markdown = htmlContent
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
      .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
      .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
      .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n')
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '> $1\n\n')
      .replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
        return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n';
      })
      .replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
        let counter = 1;
        return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1\n`) + '\n';
      })
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
      .replace(/\n{3,}/g, '\n\n') // Clean up excessive newlines
      .trim();
    
    return markdown;
  };

  const contentOptions = [
    { value: 'general-hit', label: 'General hit' },
    { value: 'bold-thoughts', label: 'Bold thoughts' },
    { value: 'ai-prompts', label: 'AI prompts' },
    { value: 'coding-meme', label: 'Coding meme' },
    { value: 'story-set', label: 'Story set' },
    { value: 'vibe-talk', label: 'Vibe talk' },
    { value: 'hot-quote', label: 'Hot quote' },
    { value: 'tips-tricks', label: 'Tips & Tricks' }
  ];

  const handleGenerate = async (data) => {
    console.log("data from handleGenerate", data)
    if (!data.title.trim()) return;
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

  const handleContinue = () => {
    console.log("editor content from handleContinue", contentForValidation)
    
    // Use the same validation as the button's enabled state for a final check
    if (!isContinueEnabled()) {
      dispatch(addAlert({
        type: "error",
        content: "Please complete all fields to continue.",
        duration: 3000
      }));
      return;
    }
    
    const postPayload = {
      title: watchedTitle || recentPost?.title || '',
      type: watchedType || recentPost?.type || '',
      postBody: {
        content: contentForValidation, // Use current editor content
        prompt: "",
        image: {
          prompt: "",
          url: ""
        }
      },
      isPosted: false
    }
    
    dispatch(setPostPayload(postPayload))
    
    // This check is now slightly redundant due to the guard clause above, but safe to keep
    if(postPayload.title && postPayload.type && postPayload.postBody.content){
      dispatch(addAlert(
        {
          type:"info",
          content: `Post saved with title: "${postPayload.title}" and type: "${postPayload.type} continue generating cover image "`,
          duration:5000
        }
      ))
      navigate("/create-cover-image")
    }
  }


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
                    {...register('title', { required: true })}
                    className="pg-input pg-input-expanded"
                    placeholder="Enter title"
                    required
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
            <button 
              type="button" 
              className={`pg-toolbar-btn ${editor?.isActive('heading', { level: 1 }) ? 'active' : ''}`}
              onClick={(e) => handleToolbarClick(editor?.chain().focus().toggleHeading({ level: 1 }), e)}
              title="Heading 1"
              disabled={!editor}
            >
              H1
            </button>
            <button 
              type="button" 
              className={`pg-toolbar-btn ${editor?.isActive('heading', { level: 2 }) ? 'active' : ''}`}
              onClick={(e) => handleToolbarClick(editor?.chain().focus().toggleHeading({ level: 2 }), e)}
              title="Heading 2"
              disabled={!editor}
            >
              H2
            </button>
            <button 
              type="button" 
              className={`pg-toolbar-btn ${editor?.isActive('heading', { level: 3 }) ? 'active' : ''}`}
              onClick={(e) => handleToolbarClick(editor?.chain().focus().toggleHeading({ level: 3 }), e)}
              title="Heading 3"
              disabled={!editor}
            >
              H3
            </button>
            <button 
              type="button" 
              className={`pg-toolbar-btn ${editor?.isActive('bold') ? 'active' : ''}`}
              onClick={(e) => handleToolbarClick(editor?.chain().focus().toggleBold(), e)}
              title="Bold"
              disabled={!editor}
            >
              <strong>B</strong>
            </button>
            <button 
              type="button" 
              className={`pg-toolbar-btn ${editor?.isActive('italic') ? 'active' : ''}`}
              onClick={(e) => handleToolbarClick(editor?.chain().focus().toggleItalic(), e)}
              title="Italic"
              disabled={!editor}
            >
              <em>I</em>
            </button>
            <button 
              type="button" 
              className={`pg-toolbar-btn ${editor?.isActive('bulletList') ? 'active' : ''}`}
              onClick={(e) => handleToolbarClick(editor?.chain().focus().toggleBulletList(), e)}
              title="Bullet List"
              disabled={!editor}
            >
              <IoList />
            </button>
            <button 
              type="button" 
              className={`pg-toolbar-btn ${editor?.isActive('orderedList') ? 'active' : ''}`}
              onClick={(e) => handleToolbarClick(editor?.chain().focus().toggleOrderedList(), e)}
              title="Numbered List"
              disabled={!editor}
            >
             123
            </button>
            <button 
              type="button" 
              className={`pg-toolbar-btn ${editor?.isActive('codeBlock') ? 'active' : ''}`}
              onClick={(e) => handleToolbarClick(editor?.chain().focus().toggleCodeBlock(), e)}
              title="Code Block"
              disabled={!editor}
            >
              <IoCode />
            </button>
            <button 
              type="button" 
              className={`pg-toolbar-btn ${editor?.isActive('blockquote') ? 'active' : ''}`}
              onClick={(e) => handleToolbarClick(editor?.chain().focus().toggleBlockquote(), e)}
              title="Quote"
              disabled={!editor}
            >
              <span style={{fontSize: '1.2rem', fontWeight: 'bold'}}>|' '</span>
            </button>
            <button 
              type="button" 
              className={`pg-toolbar-btn ${isPreviewMode ? 'active' : ''}`} 
              onClick={togglePreview} 
              title={isPreviewMode ? "Edit Mode" : "Preview Mode"}
            >
              {isPreviewMode ? <IoCreate /> : <IoEye />}
            </button>
            <button 
              type="button" 
              className="pg-toolbar-btn pg-clear-btn" 
              onClick={handleClearContent} 
              title="Clear Content"
            >
              <IoTrash />
            </button>
          </div>
          
          <div className="pg-output-content">
            {isGenerating && (
              <div className="pg-generating-message">
                <p>wrAIte is generating please wait...</p>
          </div>
            )}
            {!isGenerating && editor && (
              <div 
                className="tiptap-editor-container"
                onClick={() => {
                  console.log('Editor container clicked, focusing editor');
                  if (editor && !isPreviewMode) {
                    editor.commands.focus();
                  }
                }}
              >
                <EditorContent 
                  editor={editor} 
                  className={`tiptap-editor ${isPreviewMode ? 'preview-mode' : ''} ${isClearingContent ? 'woosh-animation' : ''}`}
                />
              </div>
            )}
            {!isGenerating && !editor && (
              <div className="pg-generating-message">
                <p>Loading editor...</p>
              </div>
            )}
          </div>
          <div className="pg-output-actions">
            {isContinueEnabled() ? (
              <button onClick={handleContinue} type="button" className="pg-save-btn">
                Continue
              </button>
            ) : (
              <div className="pg-continue-disabled">
                <span className="pg-disabled-text">
                  {!isGenerating && (
                    <>
                      Complete all fields to continue: 
                      {!hasTitle && <span className="missing-field"> Title</span>}
                      {!hasType && <span className="missing-field"> Type</span>}
                      {isEditorEffectivelyEmpty && !isDefaultContent && <span className="missing-field"> Content</span>}
                      {isDefaultContent && <span className="missing-field"> (Write your own content)</span>}
                    </>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundUI;