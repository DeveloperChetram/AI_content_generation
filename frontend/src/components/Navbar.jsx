import { useState } from 'react';
import '../styles/Home.css';
import { NavLink } from 'react-router-dom';
import DynamicIsland from './DynamicIsland';
import { addAlert } from "../redux/slices/alertSlice";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUserAction } from '../redux/actions/userActions';

const Navbar = () => {
  const user = useSelector((state) => state.user);
  // console.log("user in navbar", user)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  const featuresHandler = () => {
    toggleMenu();
    // window.location.href = '#features';
    setIsMenuOpen(false);
    dispatch(addAlert({
      type: 'info',
      content: 'This is the demo of the dynamic island and it is showing features of this page',
      duration: 5000
    }));
  }

  return (
    <div>
      <header className="navbar">
        <div className="nav-section nav-left">
          {/* You can change the variant here: 'normal', 'success', 'error', 'warning', 'info' */}
          <DynamicIsland  />
        </div>
        
        <nav className="nav-section nav-center">
          <div className="nav-menu">
          <a href="#features" onClick={featuresHandler}>Features</a>
            <a href="#about">About</a>
            <a href="#newsletter">Newsletter</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>
        <div className="nav-section nav-right">
          <div className="nav-buttons">
            {user.isAuthenticated ? (
              <NavLink to="/logout" onClick={()=>dispatch(logoutUserAction())} className={({isActive})=> isActive? 'btn btn-primary' : 'btn btn-secondary'}>Logout</NavLink>
            ) : (
              <>
                  <NavLink to="/login" className={({isActive})=> isActive? 'btn btn-primary' : 'btn btn-secondary'}>Login</NavLink>
                <NavLink to="/register"  className={({isActive})=> isActive? 'btn btn-primary' : 'btn btn-secondary'}>Sign Up</NavLink>
              </>
            )}
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
          <a href="#features" onClick={featuresHandler}>Features</a>
          <a href="#about" >About</a>
          <a href="#newsletter" >Newsletter</a>
          <a href="#contact" >Contact</a>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;