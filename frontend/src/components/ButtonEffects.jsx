import { useEffect } from 'react';

const ButtonEffects = () => {
  useEffect(() => {
    const addClickEffects = () => {
      const buttons = document.querySelectorAll('button, .btn, .cta-button, .icon-button, .close-btn, .hamburger-btn');
      
      buttons.forEach(button => {
        // Remove existing event listeners to prevent duplicates
        button.removeEventListener('mousedown', handleMouseDown);
        button.removeEventListener('mouseup', handleMouseUp);
        button.removeEventListener('mouseleave', handleMouseLeave);
        
        // Add new event listeners
        button.addEventListener('mousedown', handleMouseDown);
        button.addEventListener('mouseup', handleMouseUp);
        button.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    const handleMouseDown = (e) => {
      const button = e.target;
      button.style.transform = 'scale(0.95)';
      button.style.opacity = '0.8';
    };

    const handleMouseUp = (e) => {
      const button = e.target;
      button.style.transform = '';
      button.style.opacity = '';
    };

    const handleMouseLeave = (e) => {
      const button = e.target;
      button.style.transform = '';
      button.style.opacity = '';
    };

    // Initial setup
    addClickEffects();

    // Setup observer to handle dynamically added buttons
    const observer = new MutationObserver(() => {
      addClickEffects();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Cleanup
    return () => {
      observer.disconnect();
      const buttons = document.querySelectorAll('button, .btn, .cta-button, .icon-button, .close-btn, .hamburger-btn');
      buttons.forEach(button => {
        button.removeEventListener('mousedown', handleMouseDown);
        button.removeEventListener('mouseup', handleMouseUp);
        button.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return null; // This component doesn't render anything
};

export default ButtonEffects;
