import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRouteComponent = ({ Component, redirectPath = "/admin/login" }) => {
  const isLogin = useSelector((state) => state.authReducer.isLogin);
  const userRole = useSelector((state) => state.authReducer.userRole);

  // Check if user is logged in and has admin role
  if (!isLogin) {
    return <Navigate to={redirectPath} />;
  }

  if (userRole !== "admin") {
    return <Navigate to="/dang-nhap" />;
  }

  return <Component />;
};

export default AdminRouteComponent;
