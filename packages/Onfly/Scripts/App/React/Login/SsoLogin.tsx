import React, { useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Button } from '@bim-co/componentui-foundation';
import { useLocation } from 'react-router-dom';
import { SSO_URL } from '../../Api/constants';
import {
  selectLanguageCode,
  selectManagementCloudId,
  selectTranslatedResources,
} from '../../Reducers/app/selectors';
import { getLocationFrom } from '../../Utils/location';

type Props = {
  onflyId: number;
  languageCode: string;
  resources: any;
};

const SsoLogin: React.FC<Props> = ({ onflyId, languageCode, resources }) => {
  const location = useLocation();

  const handleClick = useCallback(() => {
    const nonce = uuid();
    const state = uuid();

    const redirectUri = encodeURIComponent(`${window.location.origin}/${languageCode}/signin-oidc`);
    const scope = 'openid bim.api.onfly offline_access';
    const responseType = 'code id_token';
    const onflyClientId = localStorage.getItem('OnflyClientId');

    const url = `${SSO_URL}/api/connect/authorize?client_id=${onflyClientId}&scope=${scope}&redirect_uri=${redirectUri}&response_type=${responseType}&state=${state}&nonce=${nonce}&onflyId=${onflyId}`;
    
    const pathname = getLocationFrom(location) || '/';
    localStorage.setItem('lastLoginLocation', pathname);
    window.location.href = url;
  }, [window.location.href]);

  return (
    <Button variant="button-link" onClick={handleClick}>
      {resources.SessionLogin.SignBt}
    </Button>
  );
};

const mapStateToProps = createStructuredSelector({
  onflyId: selectManagementCloudId,
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(SsoLogin);
