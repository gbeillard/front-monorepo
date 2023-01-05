import React from 'react';
import createReactClass from 'create-react-class';

import { connect } from 'react-redux';

import _ from 'underscore';

import BimObjectGrid from './ObjectListComponent/BimObjectGrid.jsx';
import { API_URL } from '../Api/constants';

let DashBoard = createReactClass({
  getInitialState() {
    return {
      lastObjectAdded: [],
    };
  },

  componentDidMount() {
    this.getLastObjectAdded();
  },

  getLastObjectAdded() {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.ManagementCloudId}/bimobject/lastadded/${this.props.Language}?token=${this.props.TemporaryToken}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        self.setState({ lastObjectAdded: json.Documents });
      });
  },

  render() {
    const self = this;

    const lastObjectList = _.map(this.state.lastObjectAdded, (object, i) => (
      <BimObjectGrid
        bimobject={object}
        key={i}
        language={self.props.Language}
        resources={self.props.resources}
      />
    ));

    return (
      <div className="dashboard-items">
        <h3>{this.props.resources.ContentManagement.ObjectsRecentlyAdded}</h3>
        <div className="list-container">
          <div className="results-list-container">
            <div className="flex-list items-list">{lastObjectList}</div>
          </div>
        </div>
      </div>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    Language: appState.Language,
    UserId: appState.UserId,
    RoleKey: appState.RoleKey,
    RoleName: appState.RoleName,
    ManagementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    Language: appState.Language,
    resources: appState.Resources[appState.Language],
  };
};

export default DashBoard = connect(mapStateToProps)(DashBoard);