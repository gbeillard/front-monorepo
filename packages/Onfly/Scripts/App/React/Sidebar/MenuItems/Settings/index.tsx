import React from 'react';
import { connect } from 'react-redux';
import SettingsIcon from '@material-ui/icons/Settings';
import { createStructuredSelector } from 'reselect';
import { selectTranslatedResources } from '../../../../Reducers/app/selectors';
import MenuItem from '../index';

type Props = {
  resources: any;
};
const Settings: React.FC<Props> = ({ resources, children }) => (
  <MenuItem name={resources.ContentManagement.MenuItemAdministration} icon={<SettingsIcon />}>
    {children}
  </MenuItem>
);

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(Settings);