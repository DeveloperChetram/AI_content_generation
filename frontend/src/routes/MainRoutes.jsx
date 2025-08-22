import {  Routes, Route } from "react-router-dom";
import Profile from "../pages/Profile";
import Home from "../pages/Home"
import Login from "../pages/Login";
import Register from "../pages/Register";

const MainRoutes = () => {
  return (

      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<Home/>} />
        <Route path="/profile" element={<Profile/>} />
        
      </Routes>
 
  )
}

export default MainRoutes
