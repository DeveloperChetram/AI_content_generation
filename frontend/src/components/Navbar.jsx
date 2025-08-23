import { useState, useEffect } from 'react';
import '../styles/Home.css';
import { Link, NavLink } from 'react-router-dom';

const messages = [
  "Welcome to wrAIte",
  "Create content with our powerful AI",
  "Generate stunning images from text prompts",
  "wrAIte is your new AI writing assistant",
  "Unleash your creative potential today"
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
         setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
         setIsAnimating(false);
      }, 500); // Duration of the animation
    }, 3000); 

    return () => clearInterval(intervalId);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  const getAnimationClass = () => {
    if (isHovered) {
      return isAnimating ? 'fade-out' : 'fade-in';
    }
    return isAnimating ? 'message-exit' : 'message-enter';
  };

  return (
    <div>
      <header className={`navbar ${animate ? 'animate-on-load' : ''}`}>
        <div className="nav-section nav-left">
          <div 
            className="dynamic-island"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Link to="/" className="nav-logo">wr<span className='logo-text'> AI </span>te.</Link>
            <div className="message-container">
               <div className={`message ${getAnimationClass()}`}>
                {messages[currentMessageIndex]}
              </div>
            </div>
          </div>
        </div>
        <nav className="nav-section nav-center">
          <div className="nav-menu">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#newsletter">Newsletter</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>
        <div className="nav-section nav-right">
          <div className="nav-buttons">
            <NavLink to="/login" className={({isActive})=> isActive? 'btn btn-primary' : 'btn btn-secondary'}>Login</NavLink>
            <NavLink to="/register"  className={({isActive})=> isActive? 'btn btn-primary' : 'btn btn-secondary'}>Sign Up</NavLink>
          </div>
          <button className="hamburger-btn" onClick={toggleMenu} aria-label="Toggle menu">
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
        </div>
      </header>
      <div className={`mobile-nav ${isMenuOpen ? 'is-open' : ''}`}>
        <button className="close-btn" onClick={toggleMenu} aria-label="Close menu">&times;</button>
        <nav className="mobile-nav-menu">
          <a href="#features" onClick={toggleMenu}>Features</a>
          <a href="#about" onClick={toggleMenu}>About</a>
          <a href="#newsletter" onClick={toggleMenu}>Newsletter</a>
          <a href="#contact" onClick={toggleMenu}>Contact</a>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;