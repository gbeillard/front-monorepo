import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {
  selectLanguageCode,
  selectToken,
  selectPlatformUrl,
} from '../../../../Reducers/app/selectors';
import MenuItem from '../index';

type Props = {
  languageCode: string;
  token: string;
  platformUrl: string;
};

const ApiDoc: React.FC<Props> = ({ languageCode, token, platformUrl }) => (
  <MenuItem
    link={`${platformUrl}/${languageCode}/onflyconnect?token=${token}&returnUrl=/${languageCode}/doc-webservices`}
    name="API DOC"
    isExternalLink
  />
);

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  token: selectToken,
  platformUrl: selectPlatformUrl,
});

export default connect(mapStateToProps)(ApiDoc);