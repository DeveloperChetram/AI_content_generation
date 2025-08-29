import {  Routes, Route } from "react-router-dom";
import Profile from "../pages/Profile";
import Home from "../pages/Home"
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";

const MainRoutes = () => {
  return (

      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<Home/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        
      </Routes>
 
  )
}

export default MainRoutes
