import React, { useContext } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import AuthContext from "./AuthProvider";
function RequireAuth() {
  const { auth } = useContext(AuthContext);
  const location = useLocation();
  console.log(auth.mail);
  return auth?.mail ? (
    <Outlet />
  ) : (
    //navigate("/Login", { state: { from: location } }, { replace: true });
    <Navigate to="/Login" state={{ from: location }} replace />
  );
}

export default RequireAuth;
