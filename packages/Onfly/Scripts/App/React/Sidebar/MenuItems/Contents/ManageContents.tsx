import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectLanguageCode, selectTranslatedResources } from '../../../../Reducers/app/selectors';
import { RoutePaths } from '../../RoutePaths';
import MenuItem from '../index';

type Props = {
  languageCode: string;
  resources: any;
};

const ManageContents: React.FC<Props> = ({ languageCode, resources }) => (
  <MenuItem
    link={`/${languageCode}/${RoutePaths.ManageContents}`}
    name={resources.ContentManagement.MenuItemManageContents}
  />
);

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(ManageContents);