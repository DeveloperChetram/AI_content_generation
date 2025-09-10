import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AuthRoutes = ({children}) => {
    const user = useSelector((state) => state.user);
  return (
    user.isAuthenticated ? children : <Navigate to="/login" />
    
  )
}

export default AuthRoutes
