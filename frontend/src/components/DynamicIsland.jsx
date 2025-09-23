import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { hideAlert, clearAlert } from '../redux/slices/alertSlice';
import '../styles/DynamicIsland.css';

const defaultMessages = [
  // "AI-powered writing.",
  // "Smart Work.",
  // "Its free!"
];

const DynamicIsland = ({ className = '', isScrolled = false }) => {
  const dispatch = useDispatch();
  const alert = useSelector((state) => state.alert);

  const [animate, setAnimate] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState(defaultMessages[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [containerWidth, setContainerWidth] = useState(120); // Default width to fit only logo
  const [isCollapsing, setIsCollapsing] = useState(false); // Track if we're collapsing for smooth transition

  // Check if we should show the island
  const shouldShowIsland = () => {
    // For floating island, only show when:
    // 1. There's an active alert (not default state)
    // 2. AND the navbar is scrolled (not visible)
    if (className.includes('floating-island')) {
      return alert.show && alert.type && alert.type !== 'default' && isScrolled;
    }
    // For navbar island, always show (existing behavior)
    return true;
  };

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
    const padding = 27; // total horizontal padding (15px left + 12px right)
    
    const totalWidth = logoWidth + margin + textWidth + padding;
    
    // Clamp between min and max width (280px minimum for alerts)
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

    // Handle alert messages
    if (alert.show && alert.content && alert.type && alert.type !== 'default') {
      setIsAnimating(false);
      setIsCollapsing(false); // Not collapsing, expanding instantly
      setDisplayedMessage(alert.content);
      // Calculate width for alert message only
      const width = calculateTextWidth(alert.content);
      
      // Set width immediately - no delay for instant expansion
      setContainerWidth(width);
      
      return; // Don't start default animation when showing alert
    }

    // Handle default messages only when no alert is active
    if (!alert.show || alert.type === 'default' || !alert.content) {
      // Enable smooth transition for collapsing
      setIsCollapsing(true);
      
      // Reset mobile expanded state
      setIsMobileExpanded(false);
      
      // Reset to default width immediately for instant transition
      setContainerWidth(120);
      
      // Set default message immediately - no delay
      let currentMessageIndex = 0;
      setDisplayedMessage(defaultMessages[currentMessageIndex]);

      // Only start animation for navbar island (not floating island)
      if (!className.includes('floating-island')) {
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
    }

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [alert, className]);

  const getAnimationClass = () => {
    return isAnimating ? 'message-exit' : 'message-enter';
  };

  // Get the appropriate CSS class based on alert type
  const getVariantClass = () => {
    let classes = [];
    
    // Add alert-expanded class when there's an active alert
    if (alert.show && alert.type && alert.type !== 'default') {
      classes.push('alert-expanded');
      classes.push(alert.type); // success, error, warning, info
    }
    
    // Add mobile-expanded class when mobile is expanded
    if (isMobileExpanded) {
      classes.push('mobile-expanded');
    }
    
    // Add smooth transition class when collapsing
    if (isCollapsing) {
      classes.push('smooth-transition');
    }
    
    return classes.join(' ');
  };

  // Handle mobile click to expand/collapse
  const handleMobileClick = () => {
    // Only allow expansion on mobile when there's an active alert
    if (alert.show && alert.type && alert.type !== 'default') {
      setIsMobileExpanded(!isMobileExpanded);
    }
  };

  // Don't render anything if we shouldn't show the island
  if (!shouldShowIsland()) {
    return null;
  }

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
        className={`island-container ${className} ${isMobileExpanded ? 'mobile-expanded' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleMobileClick}
      >
        <div 
          className={`dynamic-island ${getVariantClass()} ${animate ? 'animate-on-load' : ''}`}
          style={{ '--island-width': `${containerWidth}px` }}
          data-message={alert.show && alert.content ? alert.content : ''}
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
