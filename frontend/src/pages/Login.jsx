import { Link } from 'react-router-dom';
import Background from '../components/Background';
import '../styles/Auth.css';
import '../styles/Home.css'; // For cta-input and cta-button styles
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { loginUserAction } from '../redux/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { addAlert } from '../redux/slices/alertSlice';
const Login = () => {
  const user = useSelector((state) => state.user);
  const { handleSubmit, register, reset } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    const result = await dispatch(loginUserAction(data));

    console.log("user", user)
    console.log("result", result)
    if(user.isAuthenticated){
      navigate('/dashboard');
      dispatch(addAlert(
        {
          type:"success",
          content:` ${user.user.name} Logged in successfully`,
          duration:10000
        }
      ))
    }
    reset();
  }
  return (
    <div className="auth-page-container">
      <Background animationType="equalizer" />
      <div className="auth-form-container">
        <h1 className="auth-title">Welcome Back</h1>
        <form className="auth-form" onSubmit={handleSubmit(submitHandler)}>
          <input
            {...register("email")}
            type="email"
            placeholder="Enter Your Email"
            className="cta-input"
            aria-label="Email for login"
            required
          />
          <input
            {...register("password")}
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