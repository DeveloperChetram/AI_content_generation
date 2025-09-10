import { useState, useRef, useEffect } from 'react';
import '../styles/PlaygroundUI.css';
import {
  IoArrowUp,
  IoList,
  IoCode,
  IoText,
  IoEye,
  IoCreate
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

const PlaygroundUI = () => {
  const recentPost = useSelector((state) => state.post.recentPost);
  console.log("recentPost from PlaygroundUI", recentPost)
  const {register, handleSubmit, setValue, watch} = useForm();
  const dispatch = useDispatch();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

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
      }),
      CodeBlockLowlight.configure({
        lowlight: lowlight,
        defaultLanguage: 'javascript',
      }),
    ],
    content: `
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
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
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
      // Check if content is Markdown (contains markdown syntax)
      const isMarkdown = /^#{1,6}\s|^\*\*|^\*[^*]|^```|^`[^`]|^\-\s|^\d+\.\s|^\>\s|^\[.*\]\(.*\)/m.test(recentPost.content);
      
      console.log('Content type detected:', isMarkdown ? 'Markdown' : 'HTML');
      console.log('Content preview:', recentPost.content.substring(0, 200) + '...');
      
      if (isMarkdown) {
        // Convert Markdown to HTML
        const htmlContent = convertMarkdownToHTML(recentPost.content);
        console.log('Converted HTML:', htmlContent.substring(0, 200) + '...');
        editor.commands.setContent(htmlContent);
      } else {
        // Use content as-is (already HTML)
        editor.commands.setContent(recentPost.content);
      }
    }
  }, [recentPost, editor]);

  // Toolbar functions
  const togglePreview = (e) => {
    e.preventDefault();
    setIsPreviewMode(!isPreviewMode);
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
          </div>
          
          <div className="pg-output-content">
            {isGenerating && (
              <div className="pg-generating-message">
                <p>wrAIte is generating please wait...</p>
          </div>
            )}
            {!isGenerating && editor && (
              <div className="tiptap-editor-container">
                <EditorContent 
                  editor={editor} 
                  className={`tiptap-editor ${isPreviewMode ? 'preview-mode' : ''}`}
                />
              </div>
            )}
          </div>
          <div className="pg-output-actions">
            {editor?.getHTML() && !isGenerating && (
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