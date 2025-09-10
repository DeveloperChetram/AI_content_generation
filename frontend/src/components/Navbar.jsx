import { useState, useEffect } from 'react';
import '../styles/Home.css';
import { NavLink, useNavigate } from 'react-router-dom';
import DynamicIsland from './DynamicIsland';
import { addAlert } from "../redux/slices/alertSlice";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUserAction } from '../redux/actions/userActions';
import { setIsPlaygroundOpen } from '../redux/slices/indexSlice';

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const isPlaygroundOpen = useSelector((state) => state.index.isPlaygroundOpen);
  // console.log("user in navbar", user)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Scroll detection with smooth transition
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          setIsScrolled(scrollTop > 20); // Much lower threshold for navbar to disappear quickly
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
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

  const logoutHandler = async () => {
    const result = await dispatch(logoutUserAction());
    // console.log("result from logout handler", result)
    // console.log("result.status", result?.status)
    if(result.status === 200){
      navigate('/login');
    }
  }

  const dashboardHandler = () => {
    dispatch(addAlert(
      {
        type:"info",
        content:"Redirecting to dashboard...",
        duration:5000
      }
    ))
    dispatch(setIsPlaygroundOpen(false));
    navigate('/dashboard');
    dispatch(addAlert(
      {
        type:"success",
        content:"Redirected to dashboard...",
        duration:5000
      }
    ))
  }

  const playgroundHandler = () => {
    dispatch(addAlert(
      {
        type:"info",
        content:"Redirecting to playground...",
        duration:5000
      }
    ))
    dispatch(setIsPlaygroundOpen(true));
    navigate('/playground');
    dispatch(addAlert(
      {
        type:"success",
        content:"Redirected to playground...",
        duration:5000
      }
    ))
  }

  return (
    <>
      <DynamicIsland className="floating-island" isScrolled={isScrolled} />
      <header className="navbar">
        <div className="nav-section nav-left">
          <DynamicIsland className={`navbar-island ${isScrolled ? 'hidden' : ''}`} />
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
             <>
              {isPlaygroundOpen? <NavLink to="/dashboard" onClick={()=>dashboardHandler()} className={({isActive})=> isActive? 'btn btn-primary' : 'btn btn-secondary'}>Dashboard</NavLink> : <NavLink to="/playground" onClick={()=>playgroundHandler()} className={({isActive})=> isActive? 'btn btn-primary' : 'btn btn-secondary'}>Playground</NavLink>}
              <NavLink onClick={()=>logoutHandler()} className={({isActive})=> isActive? 'btn btn-primary' : 'btn btn-secondary'}>Logout</NavLink>
             </>
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
    </>
  );
};

export default Navbar;