import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectTranslatedResources } from '../../../../Reducers/app/selectors';
import { Header as HeaderComponent } from '../../Components';

type Props = {
  resources: any;
};

const Header: React.FC<Props> = ({ resources }) => (
  <HeaderComponent
    title={resources.Preferences.GeneralTitle}
    description={resources.Preferences.HeaderGeneralDescription}
  />
);

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(Header);