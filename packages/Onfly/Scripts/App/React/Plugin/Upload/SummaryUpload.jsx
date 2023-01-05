import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { initialize, Contents as OCContent } from '@bim-co/onfly-connect';
import styled from '@emotion/styled';
import { default as OCResources } from '../../ContentManager/resources';
import { OCMappedResources } from '../../ContentManager/mappedResources';

const SummaryUpload = ({ SummaryUploadDetailsList, Language, Resources }) => {
  const [finishLoading, setFinishLoading] = useState(false);
  const [finishHandleLoad, setFinishHandleLoad] = useState(false);

  useEffect(() => {
    const config = {
      language: Language,
      entityName: 'object',
      resources: OCMappedResources(Resources, OCResources),
    };
    initialize(config);
  }, [Language, Resources]);

  useEffect(() => {
    if (SummaryUploadDetailsList?.length > 0 && !finishLoading) {
      setFinishLoading(true);
      if (finishLoading === true && finishHandleLoad === false) {
        setFinishHandleLoad(true);
      }
    }
  }, [SummaryUploadDetailsList, finishHandleLoad, finishLoading]);

  if (!SummaryUploadDetailsList?.length > 0) {
    return (
      <div id="loader-spinner" className="loader-page-empty full-page">
        <CircularProgress />
      </div>
    );
  }

  return (
    <ContentWrapper>
      <OCContent isViewOnly defaultLibraries={[]} dataToDisplay={SummaryUploadDetailsList} />
    </ContentWrapper>
  );
};

const ContentWrapper = styled.div`
  & > div:first-of-type {
    height: 100vh;
  }
`;

const mapStateToProps = (store) => {
  const { appState } = store;

  return {
    Language: appState.Language,
    Resources: appState.Resources[appState.Language],
    SummaryUploadDetailsList: appState.SummaryUploadDetailsList,
  };
};

export default connect(mapStateToProps)(SummaryUpload);
