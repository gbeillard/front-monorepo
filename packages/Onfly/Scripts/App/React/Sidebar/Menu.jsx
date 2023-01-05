import React from 'react';
import createReactClass from 'create-react-class';
import { withRouter } from '../../Utils/withRouter';
import { connect } from 'react-redux';
import _ from 'underscore';

// material ui icons
import store from '../../Store/Store';
import * as SearchApi from '../../Api/SearchApi.js';
import ModularMenu from './ModularMenu';

let Menu = createReactClass({
  handleReset() {
    const parsedActualUrl = new URL(window.location.href);
    if (
      this.props.params.groupId != null &&
      parsedActualUrl.pathname ===
      `/${this.props.Language}/group/${this.props.params.groupId}/bimobjects`
    ) {
      // reset inputs
      $('#searchglobal input').val('');
      $('#simple-filters-container input').val('');

      // reset requeset
      const newRequest = this.props.initialRequest;
      newRequest.SearchValue = { Value: '' };
      newRequest.SearchContainerDynamicFilter = [];
      newRequest.SearchContainerFilter = {};
      newRequest.LanguageCode = this.props.Language;
      newRequest.GroupId = this.props.params.groupId;

      store.dispatch({ type: 'OPEN_OBJECT_CARD_GROUP', data: 0 });
      window.scrollTo(0, 0);
      SearchApi.search(
        newRequest,
        this.props.contextRequest,
        this.props.managementCloudId,
        this.props.TemporaryToken
      );
    } else {
      // reset inputs
      $('#searchglobal input').val('');
      $('#simple-filters-container input').val('');

      // reset requeset
      const newRequest = this.props.initialRequest;
      newRequest.SearchValue = { Value: '' };
      newRequest.SearchContainerDynamicFilter = [];
      newRequest.SearchContainerFilter = {};
      newRequest.LanguageCode = this.props.Language;

      store.dispatch({ type: 'OPEN_OBJECT_CARD', data: 0 });
      window.scrollTo(0, 0);
      SearchApi.search(
        newRequest,
        this.props.contextRequest,
        this.props.managementCloudId,
        this.props.TemporaryToken
      );
    }
  },

  render() {
    const groupId = this.props.params.groupId != null ? this.props.params.groupId : 0;

    if (!this.props.UserIsAuthenticated) {
      return null;
    }

    return (
      <ModularMenu
        groupId={groupId}
        roleKey={this.props.RoleKey}
        IsBimAndCoAdmin={this.props.isBimAndCoAdmin}
        handleReset={this.handleReset}
      />
    );
  },
});

const mapStateToProps = function (store, ownProps) {
  let currentSearchState;
  const { searchState } = store;
  const { searchGroupState } = store;
  const { appState } = store;

  if (ownProps.params.groupId > 0) {
    currentSearchState = searchGroupState;
  } else {
    currentSearchState = searchState;
  }

  return {
    Language: appState.Language,
    UserIsAuthenticated: appState.UserIsAuthenticated,
    UserId: appState.UserId,
    RoleKey: appState.RoleKey,
    RoleName: appState.RoleName,
    UnreadMessagesCount: appState.UnreadMessagesCount,
    Resources: appState.Resources[appState.Language],
    PlatformUrl: appState.PlatformUrl,
    TemporaryToken: appState.TemporaryToken,
    initialRequest: currentSearchState.InitialRequest,
    contextRequest: currentSearchState.ContextRequest,
    managementCloudId: appState.ManagementCloudId,
    Settings: appState.Settings,
    isBimAndCoAdmin: appState.IsBimAndCoAdmin,
  };
};

export default Menu = withRouter(connect(mapStateToProps)(Menu));