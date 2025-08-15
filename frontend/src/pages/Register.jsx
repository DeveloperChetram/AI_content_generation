import { Link } from 'react-router-dom';
import Background from '../components/Background';
import '../styles/Auth.css';
import '../styles/Home.css'; // For cta-input and cta-button styles

const Register = () => {
  return (
    <div className="auth-page-container">
      <Background />
      <div className="auth-form-container">
        <h1 className="auth-title">Create Account</h1>
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Enter Your Name"
            className="cta-input"
            aria-label="Name"
            required
          />
          <input
            type="email"
            placeholder="Enter Your Email"
            className="cta-input"
            aria-label="Email for registration"
            required
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            className="cta-input"
            aria-label="Password for registration"
            required
          />
          <button type="submit" className="cta-button">
            Sign Up
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;