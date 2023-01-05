import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
// Views
import Onfly from '../../Onfly';
import Page404 from '../../ErrorPage/Page404';
import PageContainer from '../../PageContainer/PageContainer';
import { language } from './language';
import Login from '../../Login';
import { getDefaultLanguage } from '../../../Utils/utils';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Onfly />,
    children: [
      {
        index: true,
        element: <Navigate to={`/${getDefaultLanguage()}/bimobjects`} replace />,
      },
      {
        path: 'authentication',
        element: (
          <PageContainer sideBar={false}>
            <Login />
          </PageContainer>
        ),
      },
      language,
    ],
  },
  {
    path: '*',
    element: <Navigate to="404" />,
  },
  {
    path: '/404',
    element: <Page404 />,
  },
];
