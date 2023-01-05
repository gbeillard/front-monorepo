import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { initialize as initializeAction, Inspector as InspectorFile } from '@bim-co/onfly-connect';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { Modal } from '@bim-co/componentui-foundation';
import moment from 'moment';
import { createSearchResources } from '../../../Search/utils';
import { fileAPI } from './fileApi';
import { API_URL } from '../../../../Api/constants';
import { LanguageCode } from '../../../../Reducers/app/types';

type Props = {
  Language: LanguageCode;
  Resources: any;
  OnflyId: number;
  TemporaryToken: string;
  initialize: (config: {}) => void;
};

const FileDetail = ({ Language, Resources, OnflyId, TemporaryToken, initialize }: Props) => {
  const { fileId } = useParams();
  const { mediaType } = useParams();
  const [file, setFile] = useState(null);
  const mappedResources = useMemo(() => createSearchResources(Resources, 'files'), [Resources]);
  const [isPreviewPopin, setIsPreviewPopin] = useState(false);
  const apiKey = localStorage.getItem('ApiKey');

  useEffect(() => {
    fileAPI(Language, OnflyId, fileId, mediaType).then((response) => {
      setFile(response[0]);
    });
  }, [fileId, Language, OnflyId]);

  useEffect(() => {
    const config = {
      apiUrl: API_URL,
      onflyId: OnflyId,
      apiKey,
      token: TemporaryToken,
      language: Language,
      entityName: 'files',
      resources: mappedResources,
    };

    initialize(config);
  }, [Language, Resources]);

  useEffect(() => {
    const formatDate = (dateToFormat: string) => moment(dateToFormat).format('YYYYMMDDhhmmss');

    if (file) {
      if (file.Url === null) {
        setFile({ ...file, Url: '' });
      }

      // @TODO: remove this when the API will be fixed
      if (
        formatDate(file.CreatedAt) !== 'Invalid date' ||
        formatDate(file.UpdatedAt) !== 'Invalid date'
      ) {
        setFile({
          ...file,
          CreatedAt: formatDate(file.CreatedAt),
          UpdatedAt: formatDate(file.UpdatedAt),
        });
      }
      // till here
    }
  }, [file]);

  if (!file) {
    return (
      <div id="loader-spinner" className="loader-page-empty full-page">
        <CircularProgress />
      </div>
    );
  }

  const handleClosePreview = () => {
    setIsPreviewPopin(false);
  };

  const getIFrameTemplateSrc = (src: string, width: number, height: number): string => {
    if (!src) {
      return '';
    }
    const [url, params] = src.split('?');
    if (!params) {
      return `${url}?width=${width}&height=${height}`;
    }
    return `${url}?${params}&width=${width}&height=${height}`;
  };

  return (
    <ContentWrapper>
      <InspectorFile
        document={file}
        onPreviewThumbnail={() => setIsPreviewPopin(true)}
        onClickPreviewModel={() => setIsPreviewPopin(true)}
      />
      <StyledModal active={isPreviewPopin} close={handleClosePreview}>
        <StyledIFrame
          src={getIFrameTemplateSrc(file?.BimObject?.Photo, 400, 400)}
          width="100%"
          height="100%"
          frameBorder="0"
          title="iframe"
        />
      </StyledModal>
    </ContentWrapper>
  );
};

const StyledModal = styled(Modal)`
  width: 100% !important;
  padding: 0;
`;

const StyledIFrame = styled.iframe`
  width: 100%;
  min-height: 50vh !important;
  border: none;
`;

const ContentWrapper = styled.div`
  & > div:first-of-type {
    height: 100vh;
  }
`;

const mapDispatchToProps = (dispatch) => ({
  initialize: (config) => dispatch(initializeAction(config)),
});

const mapStateToProps = ({ appState }) => ({
  Language: appState.Language,
  Resources: appState.Resources[appState.Language],
  OnflyId: appState.ManagementCloudId,
  TemporaryToken: appState.TemporaryToken,
});

export default connect(mapStateToProps, mapDispatchToProps)(FileDetail);
