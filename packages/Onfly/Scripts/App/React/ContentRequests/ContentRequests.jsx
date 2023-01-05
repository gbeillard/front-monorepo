import React from 'react';
import createReactClass from 'create-react-class';

import { connect } from 'react-redux';
import ContentRequestAdmin from './ContentRequestAdmin.jsx';
import ContentRequestUser from './ContentRequestUser.jsx';

let ContentRequests = createReactClass({
  render() {
    let content = '';
    if (this.props.RoleKey === 'admin' || this.props.RoleKey === 'validator') {
      content = <ContentRequestAdmin />;
    } else {
      content = <ContentRequestUser />;
    }

    return <div className="content-request-container">{content}</div>;
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    RoleKey: appState.RoleKey,
    RoleName: appState.RoleName,
    Language: appState.Language,
    resources: appState.Resources[appState.Language],
  };
};

export default ContentRequests = connect(mapStateToProps)(ContentRequests);