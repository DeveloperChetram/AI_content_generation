// Home.jsx

import React, { useState, useEffect } from 'react';
// import './theme.css';
import '../styles/Home.css';

const Home = () => {
  const [animate, setAnimate] = useState(false);
  // State to manage the mobile menu's visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Toggles the mobile menu and locks/unlocks body scroll
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  return (
    <div className={`home-container ${animate ? 'animate-on-load' : ''}`}>
      {/* Animated background bars */}
      <div className="background-bars">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
         <div className="bar"></div>
          <div className="bar"></div>
           <div className="bar"></div>
            <div className="bar"></div>
             <div className="bar"></div>
      </div>

      {/* --- Navbar --- */}
      <header className="navbar">
        <div className="nav-section nav-left">
          <a href="/" className="nav-logo">StartupSprint</a>
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
            <a href="#login" className="btn btn-secondary">Login</a>
            <a href="#signup" className="btn btn-primary">Sign Up</a>
          </div>
          {/* Hamburger button for mobile */}
          <button className="hamburger-btn" onClick={toggleMenu} aria-label="Toggle menu">
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
        </div>
      </header>
      
      {/* Full-screen mobile navigation overlay */}
      <div className={`mobile-nav ${isMenuOpen ? 'is-open' : ''}`}>
        <button className="close-btn" onClick={toggleMenu} aria-label="Close menu">&times;</button>
        <nav className="mobile-nav-menu">
          <a href="#features" onClick={toggleMenu}>Features</a>
          <a href="#about" onClick={toggleMenu}>About</a>
          <a href="#newsletter" onClick={toggleMenu}>Newsletter</a>
          <a href="#contact" onClick={toggleMenu}>Contact</a>
        </nav>
      </div>

      {/* --- Hero Section --- */}
      <main className="hero-section">
        {/* ... content remains the same ... */}
        <h1 className="hero-headline">
        <span className='hero-headine-first'>Don't write</span> <br /> <span  className='hero-headine-second'>It's AI era</span>
        </h1>
        <p className="hero-subheading">
          Be the first to know when we launch.
          Join the waitlist and get exclusive early access.
        </p>
        <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter Your Email"
            className="cta-input"
            aria-label="Email for waitlist"
          />
          <button type="submit" className="cta-button">
            Join The Waitlist
          </button>
        </form>
        <div className="social-links">
          <a href="#" className="social-link" aria-label="Social Link 1">o</a>
          <a href="#" className="social-link" aria-label="Social Link 2">x</a>
          <a href="#" className="social-link" aria-label="Social Link 3">in</a>
        </div>
      </main>
    </div>
  );
};

export default Home;