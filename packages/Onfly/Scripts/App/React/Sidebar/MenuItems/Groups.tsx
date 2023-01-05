import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import GroupIcon from '@material-ui/icons/Group';
import { selectLanguageCode, selectTranslatedResources } from '../../../Reducers/app/selectors';
import MenuItem from './index';

type Props = {
  languageCode: string;
  resources: any;
};

const Groups: React.FC<Props> = ({ languageCode, resources }) => (
  <MenuItem
    link={`/${languageCode}/groups`}
    name={resources.ContentManagement.MenuItemGroups}
    icon={<GroupIcon />}
  />
);

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(Groups);