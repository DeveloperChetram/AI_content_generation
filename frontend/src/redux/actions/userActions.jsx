import axios from "../../api/axios"

import { addAlert } from "../slices/alertSlice";
import { setUser,removeUser } from "../slices/userSlice";

export const registerUserAction  = (data)=> async (dispatch)=>{

try {
    dispatch(addAlert(
        {
            type:"warning",
            content:"Registering...",
            duration:5000
        }
    ))
    const result = await axios.post('/api/auth/register',data);
    // console.log("result from action", result)
    dispatch(setUser(result.data.user));
    localStorage.setItem('user',JSON.stringify(result.data.user));
    dispatch(addAlert(
        {
            type:"success",
            content:"Registered successfully",
            duration:5000
        }
    ))
    
    return result;

} catch (error) {
    console.log("error",error)
    dispatch(removeUser());
    dispatch(addAlert(
        {
            type:"error",
            content:error?.response?.data?.message || "Something went wrong",
            duration:5000
        }
        // {
        //     type:"info",
        //     content:"buy great iceCreames from here buy great iceCreames from herebuy great iceCreames from herebuy great iceCreames from here",
        //     duration:5000
        // }
    ))
    return error;

}
}

export const loginUserAction = (data)=> async (dispatch)=>{

try {
    dispatch(addAlert(
        {
            type:"warning",
            content:"Logging in...",
            duration:5000
        }
    ))
    const result = await axios.post('/api/auth/login',data);
    console.log("result from login action", result)
    dispatch(setUser(result.data.user));
    localStorage.setItem('user',JSON.stringify(result.data.user));
    dispatch(addAlert(
        {
            type:"success",
            content:"Logged in successfully",
            duration:5000
        }
    ))
    return result;

} catch (error) {
    console.log("error",error)
    dispatch(removeUser());
    dispatch(addAlert(
        {
            type:"error",
            content:error?.response?.data?.message || "Something went wrong",
            duration:5000   
        }
    ))
    return error;

}
}

export const logoutUserAction = ()=> async (dispatch)=>{

try {
    dispatch(addAlert(
        {
            type:"warning",
            content:"Logging out...",
            duration:false
        }
    ))
    const result = await axios.get('/api/auth/logout');
    console.log("result from logout action", result)
    dispatch(addAlert(
        {
            type:"success",
            content:"Logged out successfully",
            duration:5000
        }
    ))
    localStorage.removeItem('user');
    dispatch(removeUser());
   
    return result;
    
} catch (error) {
    console.log("error",error)
  
    localStorage.removeItem('user');
    dispatch(removeUser());
    dispatch(addAlert(
        {
            type:"error",
            content:error?.response?.data?.message || "Something went wrong",
            duration:5000
        }
    ))
    return error;
}
}

export const getCurrentUserAction = ()=> async (dispatch)=>{

try {
    const result = await axios.get('/api/verify');
    dispatch(setUser(result.data.user));
    localStorage.setItem('user',JSON.stringify(result.data.user));
    return result;
} catch (error) {
    console.log("error",error)
    dispatch(removeUser());
    localStorage.removeItem('user');
    return error;
}
}