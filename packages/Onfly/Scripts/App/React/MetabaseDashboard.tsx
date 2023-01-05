import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { Button, H1, H2, P, Loader, space, defaultTheme } from '@bim-co/componentui-foundation';
import { createStructuredSelector } from 'reselect';
import {
  GetMetabaseDashboardData,
  GetMetabaseDashboardDataExport,
  GetUrl,
} from '../Api/MetabaseDashboardAPI';
import {
  selectTranslatedResources,
  selectSettings,
  selectManagementCloudId,
  selectLanguageCode,
} from '../Reducers/app/selectors';

import Page from './CommonsElements/PageContentContainer';

type Props = {
  Settings: any;
  Language: string;
  OnflyId: number;
  resources: any;
};

let MetabaseDashboard: React.FC<Props> = ({ Settings, Language, OnflyId, resources }) => {
  const [IframeUrl, setIframeUrl] = useState<string>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchState = async () => {
      const MetabaseData = await GetMetabaseDashboardData(OnflyId, Language);
      const IframeUrlResponse = GetUrl(MetabaseData);
      setIframeUrl(IframeUrlResponse);
    };
    fetchState();
  }, []);

  const handleDataExport = () => {
    GetMetabaseDashboardDataExport(OnflyId, Language, resources);
  };

  const onLoadIframe = () => {
    setIsLoading(false);
  };

  if (!Settings.EnableMetabaseDashboards) {
    return (
      <Page withNewBackgroundColor>
        <H1>BIM&CO - ONFLY</H1>
        <P>Error 403 Access Denied</P>
      </Page>
    );
  }

  return (
    <Page withNewBackgroundColor>
      <Header>
        <H2>{resources.Metabase.DashboardTitle}</H2>
        <Button icon="download" variant="secondary" onClick={handleDataExport}>
          {resources.Metabase.DataExport}
        </Button>
      </Header>
      <Body>
        {isLoading && (
          <LoaderContainer>
            <Loader />
          </LoaderContainer>
        )}
        <Iframe
          id="iframe-metabase"
          src={IframeUrl}
          className="metabase-dashboard"
          frameBorder="0"
          width="100%"
          allowFullScreen
          isLoading={isLoading}
          onLoad={onLoadIframe}
        />
      </Body>
    </Page>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${space[100]};
  padding-top: ${space[125]};
`;

const Body = styled.div`
  background-color: ${defaultTheme.backgroundColor};
  border-radius: ${defaultTheme.borderRadiusBig};
  overflow: hidden;
`;

const LoaderContainer = styled.div`
  padding-top: ${space[250]};
`;

const Iframe = styled.iframe<{ isLoading: boolean }>`
  ${({ isLoading }) => `  
  height: calc(100vh - ${isLoading ? '235' : '171'}px);
`}
`;

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  OnflyId: selectManagementCloudId,
  Language: selectLanguageCode,
  Settings: selectSettings,
});

export default MetabaseDashboard = connect(mapStateToProps)(MetabaseDashboard) as React.FC<{}>;
