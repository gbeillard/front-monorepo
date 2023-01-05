import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectLanguageCode, selectTranslatedResources } from '../../../../Reducers/app/selectors';
import MenuItem from '../index';
import { LanguageCode } from '../../../../Reducers/app/types';

type Props = {
  languageCode: LanguageCode;
  resources: any;
};

const DefaultMappingMenu: React.FC<Props> = ({ languageCode, resources }) => (
  <MenuItem
    link={`/${languageCode}/dictionary/default-mapping`}
    name={resources.ContentManagement.DefaultMappingMenuLabel}
  />
);

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(DefaultMappingMenu);
