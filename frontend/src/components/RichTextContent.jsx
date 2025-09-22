import React, { useEffect } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import '../styles/RichTextContent.css';

const RichTextContent = ({ content, className = '' }) => {
  if (!content) return null;

  // Function to convert Markdown to HTML
  const convertMarkdownToHTML = (markdownContent) => {
    if (!markdownContent) return '';
    
    // Configure marked options for better compatibility
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: false,
      mangle: false,
      highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value;
          } catch (err) {
            console.error('Error highlighting code:', err);
          }
        }
        return hljs.highlightAuto(code).value;
      }
    });
    
    return marked(markdownContent);
  };

  const processedContent = convertMarkdownToHTML(content);

  // Apply syntax highlighting to any code blocks after rendering
  useEffect(() => {
    if (processedContent) {
      // Highlight any code blocks that weren't processed by marked
      const codeBlocks = document.querySelectorAll('.rich-text-content pre code');
      codeBlocks.forEach(block => {
        if (!block.classList.contains('hljs')) {
          hljs.highlightElement(block);
        }
      });
    }
  }, [processedContent]);

  return (
    <div 
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};

export default RichTextContent;
