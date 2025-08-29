import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { hideAlert, clearAlert } from '../redux/slices/alertSlice';
import '../styles/DynamicIsland.css';

const defaultMessages = [
  "AI-powered writing.",
  "Smart Work.",
  "Its free!"
];

const DynamicIsland = () => {
  const dispatch = useDispatch();
  const alert = useSelector((state) => state.alert);

  const [animate, setAnimate] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState(defaultMessages[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [containerWidth, setContainerWidth] = useState(280);

  const animationIntervalRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const messageRef = useRef(null);
  const hiddenTextRef = useRef(null);

  // Calculate text width and set container width
  const calculateTextWidth = (text) => {
    if (!hiddenTextRef.current) return 280;
    
    // Set the text content to measure
    hiddenTextRef.current.textContent = text;
    
    // Get the measured width
    const textWidth = hiddenTextRef.current.offsetWidth;
    
    // Calculate total width: logo width + margin + text width + padding
    const logoWidth = 120; // Approximate logo width
    const margin = 15; // margin-left of message-container
    const padding = 30; // total horizontal padding (15px on each side)
    
    const totalWidth = logoWidth + margin + textWidth + padding;
    
    // Clamp between min and max width
    const clampedWidth = Math.max(280, Math.min(400, totalWidth));
    
    return clampedWidth;
  };

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle alert auto-hide based on duration
  useEffect(() => {
    if (alert.show && alert.duration && typeof alert.duration === 'number' && alert.duration > 0) {
      // Clear any existing timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      
      // Set new timeout to hide alert after duration
      hideTimeoutRef.current = setTimeout(() => {
        dispatch(hideAlert());
        // Clear alert completely after hiding
        setTimeout(() => dispatch(clearAlert()), 500);
      }, alert.duration);
    }

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [alert.show, alert.duration, dispatch]);

  useEffect(() => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }

    if (alert.show && alert.content && alert.type !== 'default') {
      setIsAnimating(false);
      setDisplayedMessage(alert.content);
      // Calculate width for alert message only
      const width = calculateTextWidth(alert.content);
      setContainerWidth(width);
    } else {
      let currentMessageIndex = 0;
      setDisplayedMessage(defaultMessages[currentMessageIndex]);
      // Keep default width for default messages
      setContainerWidth(280);

      animationIntervalRef.current = setInterval(() => {
        setIsAnimating(true);
        setTimeout(() => {
          currentMessageIndex = (currentMessageIndex + 1) % defaultMessages.length;
          const newMessage = defaultMessages[currentMessageIndex];
          setDisplayedMessage(newMessage);
          // Don't change width for default message changes
          setIsAnimating(false);
        }, 500);
      }, 3000);
    }

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [alert]);

  const getAnimationClass = () => {
    if (isHovered) {
      return isAnimating ? 'fade-out' : 'fade-in';
    }
    return isAnimating ? 'message-exit' : 'message-enter';
  };

  // Get the appropriate CSS class based on alert type
  const getVariantClass = () => {
    // If there's an alert with a specific type, use that for styling
    if (alert.show && alert.type && alert.type !== 'default') {
      return alert.type; // success, error, warning, info
    }
    
    // If type is 'default' or no alert, return empty string for normal styling
    if (alert.show && alert.type === 'default') {
      return '';
    }
    
    // Otherwise return empty string for normal styling
    return '';
  };

  // Handle mobile click to expand/collapse
  const handleMobileClick = () => {
    setIsMobileExpanded(!isMobileExpanded);
  };

  return (
    <>
      {/* Hidden element for text measurement */}
      <div className='hidden-text'
        ref={hiddenTextRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'nowrap',
          fontSize: '0.9rem',
          fontFamily: 'inherit',
          zIndex: -1
        }}
      />
      
      <div 
        className={`island-container ${isMobileExpanded ? 'mobile-expanded' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleMobileClick}
      >
        <div 
          className={`dynamic-island ${getVariantClass()} ${animate ? 'animate-on-load' : ''}`}
          style={{ width: `${containerWidth}px` }}
        >
          <Link to="/" className="nav-logo">wr<span className='logo-text'> AI </span>te.</Link>
          <div className="message-container">
             <div className={`message ${getAnimationClass()}`}>
               {displayedMessage}
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DynamicIsland;
