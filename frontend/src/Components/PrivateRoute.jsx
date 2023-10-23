import React, { Children } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const { isAuth } = useSelector((state) => state.auth);
  if (!isAuth) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}

export default PrivateRoute;
