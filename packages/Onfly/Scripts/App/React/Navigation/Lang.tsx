import React from 'react';
import { Outlet, Navigate, useLocation, useParams } from 'react-router-dom';
import { LANGUAGE_MANAGED, getDefaultLanguage } from '../../Utils/utils';

const Lang = () => {
  const location = useLocation();
  const { language } = useParams();

  if (!LANGUAGE_MANAGED.includes(language)) {
    return <Navigate to={`/${getDefaultLanguage()}`} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default Lang;