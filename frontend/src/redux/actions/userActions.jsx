import axios from "../../api/axios"
import { registerUser } from "../slices/userSlice";

export const registerUserAction  = (data)=> async (dispatch, getState)=>{

 const result = await axios.post('/api/auth/register',data);
 dispatch(registerUser())
 console.log(result)

}
