import React from 'react';
import { v4 as uuid } from 'uuid';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import { OCAnalytics } from '@bim-co/onfly-connect';

import { SSO_URL } from '../../Api/constants';
import { selectTranslatedResources } from '../../Reducers/app/selectors';

type Props = {
  resources: any;
};

export const logout = (redirect_uri?: string) => {
  const state = uuid();
  const redirectUri = encodeURIComponent(redirect_uri ?? window.location.origin);
  const token = localStorage.getItem('Id_token');

  const url = `${SSO_URL}/api/connect/endsession?id_token_hint=${token}&post_logout_redirect_uri=${redirectUri}&state=${state}`;

  localStorage.removeItem('Id_token');
  localStorage.removeItem('Temporary_token');
  localStorage.removeItem('Refresh_token');

  OCAnalytics.reset();

  window.location.href = url;
};

const SsoLogout: React.FC<Props> = ({ resources }) => (
  <div onClick={() => logout()} data-test-id="Logout">
    {resources.AuthenticatedLayout.UserLogout}
  </div>
);

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(SsoLogout);
