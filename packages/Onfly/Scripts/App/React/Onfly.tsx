import React, { useEffect, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { GlobalStyle } from '@bim-co/componentui-foundation';
import { Navigate, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { usePrevious, useUpdateEffect } from 'ahooks';
import { OCAnalytics } from '@bim-co/onfly-connect';
import * as QWebChannelUtils from '../Utils/qwebchannelUtils';
import ModalCreateProperty from './ModalCreateProperty';
import * as OnflyMuiThemeV1 from '../Utils/onflyMuiThemeV1';
import * as GroupApi from '../Api/GroupsApi';
import * as MessageApi from '../Api/MessageApi';
import * as GeneralApi from '../Api/GeneralApi';
import { LANGUAGE_MANAGED, removeHTMLIndexLoader } from '../Utils/utils';
import { checkAuthentication } from '../Reducers/authentication/actions';
import { fetchLanguages } from '../Reducers/app/actions';
import GoTop from './GoTop';
import useMount from '../Utils/useMount';
import { useFocusEffect } from '../Utils/useFocusEffect';
import useLocationEffect from './Navigation/useLocationEffect';
import AppSkeleton from './AppSkeleton';
import { selectIsPlugin, selectPluginData } from '../Reducers/plugin/selectors';
import { EnvironmentType } from '../Reducers/types';

const UNREAD_MESSAGE_DELAY = 30000;

declare const window: any;

const Onfly = (props) => {
  const {
    Language,
    EntityName,
    resources,
    AuthenticationLoading,
    AuthenticationSuccess,
    AuthenticationError,
    ManagementCloudId,
    UserIsAuthenticated,
    SubDomain,
    TemporaryToken,
    HasGroupsSubscription,
    Group,
    Languages,
    isPlugin,
    pluginData,
  } = props;
  const naviguate = useNavigate();
  const dispatch = useDispatch();
  const { language, groupId } = useParams<{ language: string; groupId: string }>();
  const location = useLocation();
  const prevProps = usePrevious(props);
  const isOnflyCommunity = SubDomain === 'community';

  const messageInterval = useRef<NodeJS.Timer>();

  const token = localStorage.getItem('Temporary_token');

  useMount(() => {
    const url = window.location.host;
    const parts = url.split('.');
    const subDomain = parts[0];
    void GeneralApi.getContentManagementInformations(subDomain);
    dispatch(fetchLanguages());
    void GeneralApi.getSoftwares();

    OCAnalytics.init();

    OCAnalytics.properties({
      product: 'onfly',
      source: isPlugin ? 'plugin' : 'navigator',
      environment: process.env.TARGET_ENV as EnvironmentType,
    });
  });

  useUpdateEffect(() => {
    if (isPlugin) {
      const { pluginVersion, software, softwareVersion } = pluginData;
      OCAnalytics.properties({ source: 'plugin', pluginVersion, software, softwareVersion });
    }
  }, [isPlugin]);

  useUpdateEffect(() => {
    if (token && !prevProps.ManagementCloudId && ManagementCloudId) {
      dispatch(checkAuthentication());
    }

    if (ManagementCloudId > 0 && UserIsAuthenticated && groupId != null) {
      if (resources != null || groupId !== Group.GroupId) {
        // Chargement des informations du groupe
        GroupApi.getGroupDetails(ManagementCloudId, groupId, TemporaryToken, Language, resources);
      }
    }

    if (UserIsAuthenticated && Language && ManagementCloudId > 0) {
      dispatch({ type: 'SET_ROLE', language: Language, onflyId: ManagementCloudId });
    }
  }, [ManagementCloudId, Language, UserIsAuthenticated, groupId, resources, AuthenticationSuccess]);

  useEffect(() => {
    removeHTMLIndexLoader();
  });

  // this fetch unread messages when tab is visible and user is PageContainer
  useFocusEffect((visibilityState) => {
    if (visibilityState === 'visible') {
      messageInterval.current = setInterval(() => {
        if (UserIsAuthenticated && SubDomain !== 'community') {
          MessageApi.getUnreadMessages(ManagementCloudId, TemporaryToken);
        }
      }, UNREAD_MESSAGE_DELAY);
    }

    if (visibilityState === 'hidden' && messageInterval.current) {
      clearInterval(messageInterval.current);
    }

    return () => {
      if (messageInterval.current) {
        clearInterval(messageInterval.current);
      }
    };
  });

  useLocationEffect(() => {
    const elements = document.getElementsByClassName('modal-backdrop');

    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }

    const bodyElem = document.getElementsByTagName('body');

    if (bodyElem != null && bodyElem.length > 0) {
      bodyElem[0].classList.remove('panel-selected');
    }

    // send information page loaded
    QWebChannelUtils.sendMessage({ Category: 'WebPageLoaded', Action: 'set', Data: true });
  });

  useEffect(() => {
    moment.locale(Language as string);
    if (language !== Language) {
      if (language && !LANGUAGE_MANAGED.includes(language)) {
        naviguate('/');
      }
      // reload resources
      dispatch({ type: 'SET_LANGUAGE', language });
    }
  }, [Language, language, Languages]);

  const authenticationIsNotCompleted =
    token && AuthenticationSuccess === false && AuthenticationError === undefined;

  if (
    (EntityName === '' ||
      !resources ||
      AuthenticationLoading !== false ||
      authenticationIsNotCompleted) &&
    ManagementCloudId !== -1
  ) {
    // if plugin
    return (
      <AppSkeleton hasSideBar={!isPlugin} isOnflyCommunity={isOnflyCommunity} isLoginPage={false} />
    );
  }

  if (
    !ManagementCloudId ||
    ManagementCloudId === -1 ||
    (location.pathname.includes('group') && !HasGroupsSubscription)
  ) {
    return <Navigate to="/404" />;
  }

  return (
    <MuiThemeProvider theme={OnflyMuiThemeV1.theme}>
      <MuiPickersUtilsProvider utils={MomentUtils} locale={Language}>
        <Outlet />
        <ModalCreateProperty />
        <GoTop />
      </MuiPickersUtilsProvider>
      <GlobalStyle />
    </MuiThemeProvider>
  );
};

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    Languages: appState.Languages,
    Language: appState.Language,
    EntityName: appState.EntityName,
    UserIsAuthenticated: appState.UserIsAuthenticated,
    ManagementCloudId: appState.ManagementCloudId,
    resources: appState.Resources[appState.Language],
    TemporaryToken: appState.TemporaryToken,
    Group: appState.Group,
    HasGroupsSubscription: appState.HasGroupsSubscription,
    AuthenticationLoading: appState.AuthenticationLoading,
    AuthenticationSuccess: appState.AuthenticationSuccess,
    AuthenticationError: appState.AuthenticationError,
    SubDomain: appState.SubDomain,
    isPlugin: selectIsPlugin(store),
    pluginData: selectPluginData(store),
  };
};

export default connect(mapStateToProps)(Onfly);
