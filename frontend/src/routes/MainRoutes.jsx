import {  Routes, Route } from "react-router-dom";
import Profile from "../pages/Profile";
import Home from "../pages/Home"
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import AuthRoutes from "./AuthRoutes";
// import Playground from "../components/Playground";
import PlaygroundUI from "../components/PlaygroundUI";
import CoverImageUpload from "../components/CoverImageUpload";
import Feed from "../pages/Feed";

const MainRoutes = () => {
  return (

      <Routes >
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<Home/>} />
        <Route path="/profile" element={<AuthRoutes><Profile/></AuthRoutes>} />
        <Route path="/dashboard" element={<AuthRoutes><Dashboard/></AuthRoutes>} />
        <Route path="/playground" element={<AuthRoutes><PlaygroundUI/></AuthRoutes>} />
        {/* <Route path="/dashboard" element={<Dashboard/>} /> */}
        <Route path="/create-cover-image" element={<AuthRoutes><CoverImageUpload/></AuthRoutes>} />
        <Route path="/feed" element={<Feed/>} /> 
        
      </Routes>
 
  )
}

export default MainRoutes
