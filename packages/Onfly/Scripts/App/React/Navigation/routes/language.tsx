import React from 'react';
import { RouteObject } from 'react-router-dom';
import SigninOidc from '../../Login/SigninOidc';
import PageContainer from '../../PageContainer';
import { auth } from './auth';
import Lang from '../Lang';
import { RoutePaths } from '../../Sidebar/RoutePaths';
import SsoUnauthorized from '../../Login/SsoUnauthorized';

export const language: RouteObject = {
  path: ':language',
  element: <Lang />,
  children: [
    {
      path: 'signin-oidc',
      element: (
        <PageContainer isOld>
          <SigninOidc />
        </PageContainer>
      ),
    },
    {
      path: RoutePaths.Unauthorized,
      element: (
        <PageContainer sideBar={false}>
          <SsoUnauthorized />
        </PageContainer>
      ),
    },
    auth,
  ],
};
