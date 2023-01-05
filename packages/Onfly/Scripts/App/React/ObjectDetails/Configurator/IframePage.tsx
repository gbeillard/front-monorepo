import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';

// Reducers
import { selectTranslatedResources, selectLanguageCode } from '../../../Reducers/app/selectors';
import { VariantConfigurator } from './types';

type Props = {
  languageCode: string;
  url: string;
  handleConfiguratorSubmit: (data: any) => void;
  variant?: VariantConfigurator;
  linkedVariants?: VariantConfigurator[];
};

const SIGNAL_CONFIGURATION_OK = 'PAGE_PushState';
const SIGNAL_CONFIGURATOR_READY = 'PAGE_LoadingStatus';
const SIGNAL_HOST_INIT_FORM = 'HOST_InitForm';
const MESSAGE_HOST_READY = { MessageId: 'HOST_PostMessageReady', Values: {} };
// const URL_IFRAME = 'https://edifycad.preprod.page.dev/smart-page/public/1bcd2c96-f681-4f5a-b24c-ae1b00c8c7fe';

const IframePage: React.FC<Props> = ({
  url,
  handleConfiguratorSubmit,
  variant,
  linkedVariants,
  languageCode,
}) => {
  const iframeRef = React.useRef(null);

  const interval = setInterval(() => {
    if (iframeRef) {
      iframeRef.current.contentWindow.postMessage(MESSAGE_HOST_READY, '*');
    }
  }, 300);

  const handleMessage = (event) => {
    try {
      const jsonData = JSON.parse(event.data);
      console.log(jsonData);
      switch (jsonData.MessageId) {
        case SIGNAL_CONFIGURATOR_READY:
          if (jsonData.Values?.Status === true) {
            // validate handshake
            clearInterval(interval);
            // send variantId if present to Page or just init empty
            iframeRef.current.contentWindow.postMessage(
              JSON.stringify({
                MessageId: SIGNAL_HOST_INIT_FORM,
                Values: {
                  UiLanguage: languageCode,
                  BuildingObj: variant ?? {},
                  ArticleObjs: linkedVariants ?? [],
                },
              }),
              '*'
            );
          }
          break;
        case SIGNAL_CONFIGURATION_OK:
          handleConfiguratorSubmit(jsonData.Values?.data);
          break;
        default:
          break;
      }
    } catch (e) {
      console.error('error when reading message from Page', e.message);
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, []);

  return (
    <SmartPageContainer>
      <IframeCustom src={url} ref={iframeRef} data-test-id='modal-configurator-page' />
    </SmartPageContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  languageCode: selectLanguageCode,
});

const SmartPageContainer = styled.div`
  min-height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const IframeCustom = styled.iframe`
  width: 100%;
  height: calc(100vh - 15rem);
  border: none;
`;

export default connect(mapStateToProps)(React.memo(IframePage));