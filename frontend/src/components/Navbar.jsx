import { useState, useEffect, useRef } from 'react';
import '../styles/Home.css';
import { NavLink, useNavigate } from 'react-router-dom';
import DynamicIsland from './DynamicIsland';
import Profile from './Profile';
import { addAlert } from "../redux/slices/alertSlice";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUserAction } from '../redux/actions/userActions';
import { setIsPlaygroundOpen } from '../redux/slices/indexSlice';
import { FiUser, FiHome, FiPlus } from 'react-icons/fi';

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const isPlaygroundOpen = useSelector((state) => state.index.isPlaygroundOpen);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profilePosition, setProfilePosition] = useState({ top: 0, right: 0 });
  const [showLogin, setShowLogin] = useState(true);
  const profileButtonRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          setIsScrolled(scrollTop > 20);
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

  const toggleLoginSignup = () => {
    setShowLogin(!showLogin);
    if (showLogin) {
      navigate('/register');
    } else {
      navigate('/login');
    }
  };



  const logoutHandler = async () => {
    const result = await dispatch(logoutUserAction());
    if(result.status === 200){
      navigate('/login');
    }
  };

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

  const toggleProfile = () => {
    if (profileButtonRef.current) {
      const rect = profileButtonRef.current.getBoundingClientRect();
      setProfilePosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setIsProfileOpen(!isProfileOpen);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  return (
    <>
      <DynamicIsland className="floating-island" isScrolled={isScrolled} />
      <header className="navbar">
        <div className="nav-section nav-left">
          <DynamicIsland className={`navbar-island ${isScrolled ? 'hidden' : ''}`} />
        </div>
        
        <nav className="nav-section nav-center">
          <div className="nav-menu">
          <NavLink to="/feed">Feed</NavLink>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>
        <div className="nav-section nav-right">
          <div className="nav-buttons">
            {user.isAuthenticated ? (
             <>
              <NavLink
                to="/playground"
                onClick={() => playgroundHandler()}
                className={({ isActive }) =>
                  isActive ? 'btn btn-primary' : 'btn btn-secondary'
                }
              >
                Playground
              </NavLink>
              <div className="profile-container">
                <button 
                  ref={profileButtonRef}
                  className="profile-icon-btn" 
                  onClick={toggleProfile}
                  aria-label="Open profile"
                >
                  {user.user?.profilePicture ? (
                    <img 
                      src={user.user.profilePicture} 
                      alt="Profile" 
                      className="profile-picture"
                    />
                  ) : (
                    <FiUser className="profile-icon" />
                  )}
                </button>
                <Profile
                  isOpen={isProfileOpen}
                  onClose={closeProfile}
                />
              </div>
             </>
            ) : (
              <>
                  <NavLink to="/login" className={({isActive})=> isActive? 'btn btn-primary' : 'btn btn-secondary'}>Login</NavLink>
                <NavLink to="/register"  className={({isActive})=> isActive? 'btn btn-primary' : 'btn btn-secondary'}>Sign Up</NavLink>
              </>
            )}
          </div>

           <div className="mobile-nav-inline">
             <NavLink to="/feed" className="mobile-feed-btn">
               <FiHome className="feed-icon" />
             </NavLink>
             
             {user.isAuthenticated ? (
               <>
                 <NavLink to="/playground" className="mobile-playground-btn" onClick={playgroundHandler}>
                   <FiPlus className="plus-icon" />
                 </NavLink>
                 <div className="profile-container">
                   <button
                     ref={profileButtonRef}
                     className="mobile-profile-btn"
                     onClick={toggleProfile}
                     aria-label="Open profile"
                   >
                     {user.user?.profilePicture ? (
                       <img
                         src={user.user.profilePicture}
                         alt="Profile"
                         className="mobile-profile-picture"
                       />
                     ) : (
                       <FiUser className="mobile-profile-icon" />
                     )}
                   </button>
                   <Profile
                     isOpen={isProfileOpen}
                     onClose={closeProfile}
                   />
                 </div>
               </>
             ) : (
               <button
                 className="mobile-login-toggle-btn"
                 onClick={toggleLoginSignup}
               >
                 {showLogin ? 'Login' : 'Sign Up'}
               </button>
             )}
           </div>
        </div>
      </header>
 
     </>
   );
 };

export default Navbar;