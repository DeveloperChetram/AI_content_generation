import { Link } from 'react-router-dom';
import  {useForm} from 'react-hook-form' 
import axios from '../api/axios'
import Background from '../components/Background';
import '../styles/Auth.css';
import '../styles/Home.css'; // For cta-input and cta-button styles

const Register = () => {

  const {handleSubmit, register, reset} = useForm()

  const submitHandler =async  (data)=>{
   try {
    const result = await axios.post('/api/auth/register', data)
    console.log (result)
   } catch (error) {
    console.log(error)
   }
   reset()

  }

  return (
    <div className="auth-page-container">
      <Background animationType="equalizer" />
      <div className="auth-form-container">
        <h1 className="auth-title">Create Account</h1>
        <form className="auth-form" onSubmit={handleSubmit(submitHandler)}>
          <input
          {...register('name')}
            type="text"
            placeholder="Enter Your Name"
            className="cta-input"
            aria-label="Name"
            required
          />
          <input
           {...register('email')}
            type="email"
            placeholder="Enter Your Email"
            className="cta-input"
            aria-label="Email for registration"
            required
          />
          <input
           {...register('password')}
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