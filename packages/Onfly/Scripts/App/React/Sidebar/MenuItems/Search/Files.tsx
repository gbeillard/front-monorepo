import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectLanguageCode, selectTranslatedResources } from '../../../../Reducers/app/selectors';
import MenuItem from '../index';

type Props = {
  languageCode: string;
  resources: any;
};

const Files: React.FC<Props> = ({ languageCode, resources }) => (
  <MenuItem link={`/${languageCode}/files`} name={resources.ContentManagement.MenuItemFiles} />
);

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(Files);