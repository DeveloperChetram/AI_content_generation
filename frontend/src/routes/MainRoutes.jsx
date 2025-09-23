import {  Routes, Route } from "react-router-dom";
import ProfilePage from "../pages/ProfilePage";
import EditProfilePage from "../pages/EditProfilePage";
import Home from "../pages/Home"
import Login from "../pages/Login";
import Register from "../pages/Register";
// import Dashboard from "../pages/Dashboard";
import AuthRoutes from "./AuthRoutes";
// import Playground from "../components/Playground";
import PlaygroundUI from "../components/PlaygroundUI";
import CoverImageUpload from "../components/CoverImageUpload";
import Feed from "../pages/Feed";
import SinglePost from "../components/SinglePost";

const MainRoutes = () => {
  return (

      <Routes >
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<Home/>} />
        <Route path="/profile" element={<AuthRoutes><ProfilePage/></AuthRoutes>} />
        <Route path="/profile/edit" element={<AuthRoutes><EditProfilePage/></AuthRoutes>} />
        {/* <Route path="/dashboard" element={<AuthRoutes><Dashboard/></AuthRoutes>} /> */}
        <Route path="/playground" element={<AuthRoutes><PlaygroundUI/></AuthRoutes>} />
        {/* <Route path="/dashboard" element={<Dashboard/>} /> */}
        <Route path="/create-cover-image" element={<AuthRoutes><CoverImageUpload/></AuthRoutes>} />
        <Route path="/feed" element={<Feed/>} /> 
        <Route path="/post/:id" element={<SinglePost/>} />
        
      </Routes>
 
  )
}

export default MainRoutes
