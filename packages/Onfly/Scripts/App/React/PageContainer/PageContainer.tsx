import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { defaultTheme } from '@bim-co/componentui-foundation';
import styled from '@emotion/styled';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { RoleKeyType } from '../../Reducers/Roles/types';
import Header from '../Header';
import SideBar from '../Sidebar';
import Loading from '../Loading';
import { createPageTitle } from './utils';
import { ErrorPageTitle, ErrorPageSubTitle } from '../../components/ErrorComponents';
import { selectIsPlugin } from '../../Reducers/plugin/selectors';
import { RoutePaths } from '../Sidebar/RoutePaths';

type PageContainerState = {
  Title: string;
  UserIsAuthenticated: boolean;
  ManagementCloudId: string | number;
  resources: any;
  Group: any;
  HasGroupsSubscription: boolean;
  SubDomain: string;
  RoleKey: RoleKeyType;
  Language: string;
  isPlugin?: boolean;
};

export type PageContainerProps = {
  roleAccess?: RoleKeyType[];
  titleZone?: string;
  titleKey?: string;
  isOld?: boolean;
  sideBar?: boolean;
  isStandAlone?: boolean;
  children: React.ReactNode;
};

const getAuthStateSelector = (store: any) => {
  const { appState } = store;
  return {
    Title: appState.Title,
    UserIsAuthenticated: appState.UserIsAuthenticated,
    ManagementCloudId: appState.ManagementCloudId,
    resources: appState.Resources[appState.Language],
    Group: appState.Group,
    HasGroupsSubscription: appState.HasGroupsSubscription,
    SubDomain: appState.SubDomain,
    RoleKey: appState.RoleKey,
    Language: appState.Language,
    isPlugin: selectIsPlugin(store),
  };
};

const PageContainer = ({
  roleAccess,
  titleZone,
  titleKey,
  isOld,
  isStandAlone,
  sideBar = true,
  children,
}: PageContainerProps) => {
  const {
    Title,
    UserIsAuthenticated,
    resources,
    Group,
    SubDomain,
    RoleKey,
    Language,
    isPlugin,
  }: PageContainerState = useSelector(getAuthStateSelector, shallowEqual);

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const isLoginPage = location.pathname === '/authentication' || location.pathname === `/${Language}/${RoutePaths.Unauthorized}`;
  const isOnflyCommunity = SubDomain === 'community';
  const hasSideBar = !isStandAlone && sideBar !== false && !isOnflyCommunity && !isPlugin;
  const hasTopBar = !isStandAlone;
  const isAccessDenied =
    UserIsAuthenticated &&
    Boolean(roleAccess) &&
    roleAccess.length > 0 &&
    roleAccess.findIndex((role) => role === RoleKey) === -1;

  // this add or remove legacy classnames to pages that need it
  useEffect(() => {
    if (isOld) {
      document.body.classList.add('old-styles');
    } else {
      document.body.classList.remove('old-styles');
    }
  }, [isOld]);

  useEffect(() => {
    if (
      isAccessDenied &&
      RoleKey === 'partner' &&
      window.location.pathname.lastIndexOf(`/${Language}`) === 0
    ) {
      navigate(`/${Language}/messages`);
    }
  }, [isAccessDenied]);

  const pageTitle = createPageTitle({
    resources,
    Group,
    titleZone,
    titleKey,
    params,
    Title,
  });

  let child;

  if (isAccessDenied) {
    child = (
      <div data-test-id="403-view">
        <ErrorPageTitle>BIM&CO - ONFLY</ErrorPageTitle>
        <ErrorPageSubTitle>Error 403 Access Denied</ErrorPageSubTitle>
      </div>
    );
  }

  return (
    <PageWrapper
      id="page-wrapper"
      hasSideBar={hasSideBar}
      hasTopBar={hasTopBar}
      isStandAlone={isStandAlone}
    >
      <Loading />
      {hasSideBar && <SideBar />}
      {!isOnflyCommunity && hasTopBar && (
        <Header hasSidebar={hasSideBar} isLoginPage={isLoginPage} pageTitle={pageTitle} />
      )}
      {child ?? children}
    </PageWrapper>
  );
};

const PageWrapper = styled.div(({ hasSideBar, hasTopBar, isStandAlone }: any) => ({
  backgroundColor: isStandAlone ? defaultTheme.backgroundColor : 'inherit',
  margin: `${hasTopBar ? '70px' : '0'} 0 0 ${hasSideBar ? '50px' : '0'}`,
  padding: '0 15px',
  '#new-filterbar': {
    '&.filter-scroll': {
      '#simple-filters-container': {
        left: hasSideBar ? '50px' : 0,
      },
    },
  },
}));

export default PageContainer;
