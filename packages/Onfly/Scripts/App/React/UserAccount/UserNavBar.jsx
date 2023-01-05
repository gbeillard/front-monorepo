import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from '../../Utils/withRouter';

import { selectRole } from '../../Reducers/app/selectors';

let UserNavBar = ({ resources, Language, roleKey }) => (
  <div className="left-panel">
    <div id="lp-nav-container">
      <List component="nav" className="lp-nav">
        <ListItemLink to={`/${Language}/user-account`} id={1}>
          <ListItemText primary={resources.UserAccount.PersonalInformation} />
        </ListItemLink>
        {roleKey !== 'public_creator' &&
          <ListItemLink to={`/${Language}/user-notifications`} id={2}>
            <ListItemText primary={resources.UserAccount.Notifications} />
          </ListItemLink>}
      </List>
    </div>
  </div>
);

const ListItemLink = withRouter(({ location, to, children }) => (
  <Link to={to}>
    <ListItem button selected={location.pathname == to}>
      {children}
    </ListItem>
  </Link>
));

const mapStateToProps = ({ appState }) => ({
  Language: appState.Language,
  resources: appState.Resources[appState.Language] != null ? appState.Resources[appState.Language] : [],
  roleKey: appState.RoleKey
});

export default UserNavBar = connect(mapStateToProps)(UserNavBar);