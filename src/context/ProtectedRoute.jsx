import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./context/UserContext";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated } = useContext(UserContext);

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
