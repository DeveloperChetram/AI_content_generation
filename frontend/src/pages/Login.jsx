import { Link } from 'react-router-dom';
import Background from '../components/Background';
import '../styles/Auth.css';
import '../styles/Home.css'; // For cta-input and cta-button styles

const Login = () => {
  return (
    <div className="auth-page-container">
      <Background animationType="equalizer" />
      <div className="auth-form-container">
        <h1 className="auth-title">Welcome Back</h1>
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter Your Email"
            className="cta-input"
            aria-label="Email for login"
            required
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            className="cta-input"
            aria-label="Password for login"
            required
          />
          <button type="submit" className="cta-button">
            Login
          </button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;