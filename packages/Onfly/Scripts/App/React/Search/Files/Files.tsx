import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';

import { Files as OCSearch, initialize } from '@bim-co/onfly-connect';

import { InitializeOptions } from '@bim-co/onfly-connect/Global';

import { useNavigate } from 'react-router-dom';
import { setLoader as setLoaderAction } from '../../../Reducers/app/actions';
import { sendAnalytics as sendAnalyticsAction } from '../../../Reducers/analytics/actions';

import {
  selectEnableIfcSDL,
  selectLanguageCode,
  selectManagementCloudId,
  selectToken,
  selectTranslatedResources,
  selectEnableFileSearch,
  selectSoftwares,
  selectRole,
  selectIsBoostOffer,
  selectDisplayName,
} from '../../../Reducers/app/selectors';
import { selectPluginData } from '../../../Reducers/plugin/selectors';

import { LanguageCode } from '../../../Reducers/app/types';
import { AnalyticsEvent } from '../../../Reducers/analytics/types';
import { SearchObjectGroup } from '../../../Reducers/BimObject/types';

import { API_URL } from '../../../Api/constants';
import { GroupType } from '../../../Reducers/groups/constants';

import * as PluginUtils from '../../../Utils/pluginUtils';
import * as ContentUtils from '../../../Utils/contentUtils';
import { isFavorite } from '../../../Reducers/BimObject/utils';
import { createSearchResources, getCustomFilters, isButtonFavoriteVisible } from '../utils';
import { getDefaultLibraries, getLibrariesSettings } from '../../../Utils/librariesUtils';

declare const window: any;

type ModeProps = {
  isCollectionMode: boolean;
};

type Props = {
  onflyId: number;
  token: string;
  language: LanguageCode;
  resources: any;
  enableIfcSDL: boolean;
  pluginData: any;
  softwares: any;
  group?: SearchObjectGroup;
  role: any;
  entityName: string;
  initialize: (config: any) => void;
  sendAnalytics: (event: AnalyticsEvent) => void;
  setLoader: (value: boolean) => void;
  enableFileSearch: boolean;
  isBoostOffer: boolean;
};

const Files: React.FC<Props> = ({
  onflyId,
  token,
  language,
  resources,
  enableIfcSDL,
  pluginData,
  softwares,
  group,
  role,
  entityName,
  initialize,
  sendAnalytics,
  setLoader,
  enableFileSearch,
  isBoostOffer,
}) => {
  if (!enableFileSearch) {
    return (
      <div className="text-center">
        <h1 className="loadingtext">BIM&CO - ONFLY</h1>
        <p>Error 403 Access Denied</p>
      </div>
    );
  }

  const apiKey = localStorage.getItem('ApiKey');

  const mappedResources = useMemo(() => createSearchResources(resources, 'files'), [resources]);

  const customFilters = useMemo(
    () => getCustomFilters(window._isPlugin, pluginData, softwares),
    [pluginData, softwares]
  );

  const navigate = useNavigate();

  useEffect(() => {
    const config = {
      onflyId,
      apiKey,
      token,
      language,
      resources: mappedResources,
      apiUrl: API_URL,
      group,
      entityName,
    };

    initialize(config);

    return () => {
      initialize({
        ...config,
        group: null,
      });
    };
  }, [apiKey, entityName, group, initialize, language, mappedResources, onflyId, token]);

  const navigateToObject = (objectId) => {
    const path = `/${language}/bimobject/${objectId}/details`;
    if (!window?._isPlugin) {
      window.open(path, '_blank').focus();
    } else {
      navigate(path);
    }
  };

  const handleDownload = (content: any) => {
    setLoader(true);
    let contentPromise;
    if (window._isPlugin) {
      contentPromise = PluginUtils.downloadPluginContent(
        content,
        onflyId,
        enableIfcSDL,
        resources,
        language
      );
    } else {
      contentPromise = ContentUtils.downloadContent(content, onflyId, resources);
    }
    contentPromise.then(() => {
      setLoader(false);
      sendAnalytics(AnalyticsEvent.UserClickedContentDownloadContent);
    });
  };

  const isCollectionMode = group?.type === GroupType.Collection;

  const buttonFavoriteIsVisible = (file) => isButtonFavoriteVisible(file?.BimObject, role);

  const handleClickFavorite = (file) => {
    const isBimObjectFavorite = isFavorite(file?.BimObject);

    if (!isBimObjectFavorite) {
      sendAnalytics(AnalyticsEvent.UserAddedObjectToCollection);
    }
  };

  return (
    <SearchWrapper isCollectionMode={isCollectionMode}>
      <OCSearch
        onView={isBoostOffer ? undefined : (id) => navigateToObject(id)}
        onDownload={handleDownload}
        customFilters={customFilters}
        onClickFavorite={handleClickFavorite}
        buttonFavoriteIsVisible={buttonFavoriteIsVisible}
        defaultLibraries={getDefaultLibraries()}
        librariesSettings={getLibrariesSettings(role.key)}
      />
    </SearchWrapper>
  );
};

const mapStateToProps = createStructuredSelector({
  onflyId: selectManagementCloudId,
  token: selectToken,
  language: selectLanguageCode,
  resources: selectTranslatedResources,
  enableIfcSDL: selectEnableIfcSDL,
  enableFileSearch: selectEnableFileSearch,
  pluginData: selectPluginData,
  softwares: selectSoftwares,
  isBoostOffer: selectIsBoostOffer,
  role: selectRole,
  entityName: selectDisplayName,
});

const mapDispatchToProps = (dispatch) => ({
  initialize: (config: InitializeOptions) => dispatch(initialize(config)),
  sendAnalytics: (event: AnalyticsEvent) => dispatch(sendAnalyticsAction(event)),
  setLoader: (value) => dispatch(setLoaderAction(value)),
});

// Mix old styles with new layout
const SearchWrapper = styled.div<ModeProps>(
  ({ isCollectionMode }) => `
    margin: 0 ${isCollectionMode ? '-8' : '-15'}px;
    ${!isCollectionMode ? 'margin-top: -11px;' : ''}

    & > div:first-of-type {
        height: calc(100vh - ${isCollectionMode ? '167' : '59'}px);
    }
`
);

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Files));
