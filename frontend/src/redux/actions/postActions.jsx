import axios from "../../api/axios"
import { addAlert } from "../slices/alertSlice"
import { setRecentPost } from "../slices/postSlice"

export const generatePostAction = (prompt, type, title) => async (dispatch)=> {

    try {
        dispatch(addAlert(
            {
                type:"warning",
                content:"Generating post...",
                duration:false
            }
        ))
        const result = await axios.post('/api/posts/create-post', { prompt, type, title })
        console.log("result from generatePostAction", result)
        dispatch(setRecentPost(result.data))
        dispatch(addAlert(
            {
                type:"info",
                content:"Post generated successfully",
                duration:5000
            }
        ))
        return result;
    } catch (error) {
        console.log( "error from generatePostAction", error)
        dispatch(addAlert(
            {
                type:"error",
                content: error?.response?.data?.message || "Failed to generate post",
                duration:5000
            }
        ))
        return error;
    }
}


