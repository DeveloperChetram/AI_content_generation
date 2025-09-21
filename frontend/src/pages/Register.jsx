import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../api/axios";
import Background from "../components/Background";
import "../styles/Auth.css";
import "../styles/Home.css"; // For cta-input and cta-button styles
import { useEffect, useState } from "react";
import { registerUserAction } from "../redux/actions/userActions";
import { useDispatch } from "react-redux";
import { addAlert, defaultAlert } from "../redux/slices/alertSlice";

const Register = () => {
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  const { handleSubmit, register, reset } = useForm();
  const navigate = useNavigate();
  const submitHandler = async (data) => {
      
    setloading(true)
  
    const result = await dispatch(registerUserAction(data));
    
    
    // console.log("result.payload.success", result.payload.success)
    if(result.status === 200){
      navigate('/profile');
    }
    reset()
    setloading(false)

 
  };
// useEffect(()=>{
//   if(loading){
  
//   }
//   else{
//     dispatch(addAlert([
//       {
//         type:"",
//         content:"normal"
//       }
//     ]))
//   }
  
  
// },[loading, dispatch])
  return (
    <div className="auth-page-container">
      <Background animationType="equalizer" />
      <div className="auth-form-container">
        <h1 className="auth-title">Create Account</h1>
        <form className="auth-form" onSubmit={handleSubmit(submitHandler)}>
          <input
            {...register("name")}
            type="text"
            placeholder="Enter Your Name"
            className="cta-input"
            aria-label="Name"
            required
          />
          <input
            {...register("email")}
            type="email"
            placeholder="Enter Your Email"
            className="cta-input"
            aria-label="Email for registration"
            required
          />
          <input
            {...register("password")}
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
