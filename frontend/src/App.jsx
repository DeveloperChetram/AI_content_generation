import Navbar from "./components/Navbar"
// import Dashboard from "./pages/Dashboard"
// import ReduxSample from "./components/ReduxSample"

// import Login from "./pages/Login"

import MainRoutes from "./routes/MainRoutes"
import { useDispatch } from "react-redux";
import { getCurrentUserAction } from "./redux/actions/userActions";
import { useEffect } from "react";
import ButtonEffects from "./components/ButtonEffects";
import CoverImageUpload from "./components/CoverImageUpload";
// import PlaygroundUI from "./components/PlaygroundUI";




const App = () => {
  const dispatch = useDispatch();
  // const isPlaygroundOpen = useSelector((state) => state.index.isPlaygroundOpen);
  useEffect(()=>{
    dispatch(getCurrentUserAction());
  },[]);


  return (
    <div className="app-container">
      <ButtonEffects />
      <Navbar />
      {/* <DurationExample /> */}
      {/* <AlertUsageExample /> */}
      <MainRoutes />
      {/* <PlaygroundUI /> */}
      {/* <DynamicIsland /> */}
      {/* <Login/> */}
      {/* <ReduxSample /> */}
      {/* <Dashboard /> */}
      {/* <CoverImageUpload /> */}
       
    </div>
  )
}

export default App
