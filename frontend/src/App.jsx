import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"
// import ReduxSample from "./components/ReduxSample"

import Login from "./pages/Login"

import MainRoutes from "./routes/MainRoutes"
import { useDispatch } from "react-redux";
import { getCurrentUserAction } from "./redux/actions/userActions";
import { useEffect } from "react";




const App = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getCurrentUserAction());
  },[]);


  return (
    <div>
      <Navbar />
      {/* <DurationExample /> */}
      {/* <AlertUsageExample /> */}
      <MainRoutes />
    
      {/* <DynamicIsland /> */}
      {/* <Login/> */}
      {/* <ReduxSample /> */}
      {/* <Dashboard /> */}
       
    </div>
  )
}

export default App
