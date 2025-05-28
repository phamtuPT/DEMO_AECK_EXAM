import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RouteComponent = ({ isLogin, isAuth, Component, redirectPath }) => {
  const userLogin = useSelector((state) => state.authReducer.isLogin);
  if (isLogin) {
    return userLogin ? <Component /> : <Navigate to={redirectPath} />;
  }
  if (isAuth) {
    return !userLogin ? <Component /> : <Navigate to={redirectPath} />;
  }

  return <Component></Component>;
};

export default RouteComponent;
