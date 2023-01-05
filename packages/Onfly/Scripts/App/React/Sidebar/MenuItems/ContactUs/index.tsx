import React from 'react';
import { connect } from 'react-redux';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import { createStructuredSelector } from 'reselect';
import { selectTranslatedResources, selectSettings } from '../../../../Reducers/app/selectors';
import MenuItem from '../index';

type Props = {
  resources: any;
};

const ContactUs: React.FC<Props> = ({ resources, children }) => (
  <MenuItem name={resources.BugTracker.MenuBugAndIdea} icon={<ContactSupportIcon />}>
    {children}
  </MenuItem>
);

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  settings: selectSettings,
});

export default connect(mapStateToProps)(ContactUs);