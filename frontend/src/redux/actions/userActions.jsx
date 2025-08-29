import axios from "../../api/axios"

import { addAlert } from "../slices/alertSlice";

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
    dispatch(addAlert(
        {
            type:"error",
            content:error.response.data.message || "Something went wrong",
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