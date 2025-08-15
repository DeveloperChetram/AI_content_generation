import { useState } from 'react'
import '../styles/Home.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
      const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  return (
    <div>
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
  )
}

export default Navbar
