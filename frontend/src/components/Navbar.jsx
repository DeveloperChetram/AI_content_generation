import { useState, useEffect } from 'react';
import '../styles/Home.css';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  return (
    <div>
      <header className={`navbar ${animate ? 'animate-on-load' : ''}`}>
        <div className="nav-section nav-left">
          <Link to="/" className="nav-logo">StartupSprint</Link>
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
            {/* <Link href="#login" className="btn btn-secondary">Login</Link> */}
            <NavLink to="/login"   className={({isActive})=> isActive? 'btn btn-primary' : 'btn btn-secondary'}>Login</NavLink>
            <NavLink to="/register"  className={({isActive})=> isActive? 'btn btn-primary' : 'btn btn-secondary'}>Sign Up</NavLink>
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
  );
};

export default Navbar;