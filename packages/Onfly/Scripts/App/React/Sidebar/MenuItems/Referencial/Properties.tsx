import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectLanguageCode, selectTranslatedResources } from '../../../../Reducers/app/selectors';
import MenuItem from '../index';

type Props = {
  languageCode: string;
  resources: any;
};

const Properties: React.FC<Props> = ({ languageCode, resources }) => (
  <MenuItem
    link={`/${languageCode}/dictionary/properties`}
    name={resources.ContentManagement.DictionaryPropertiesMenuLabel}
  />
);

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(Properties);