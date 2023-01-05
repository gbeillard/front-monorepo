import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

const Auth = () => {
  const location = useLocation();
  const isAuth = useSelector((store: any) => store.appState.UserIsAuthenticated);
  const isLoading = useSelector((store: any) => store.appState.AuthenticationLoading);

  if (!isAuth && isLoading === false) {
    return <Navigate to="/authentication" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default Auth;