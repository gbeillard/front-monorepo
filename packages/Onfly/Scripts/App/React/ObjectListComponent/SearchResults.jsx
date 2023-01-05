import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import _ from 'underscore';
import toastr from 'toastr';
import SortMenu from './SortMenu.jsx';
import ResultsList from './ResultsList.jsx';
import SearchHeader from './SearchHeader.jsx';
import store from '../../Store/Store';
import * as SearchApi from '../../Api/SearchApi.js';
import { withRouter } from '../../Utils/withRouter';
import { history } from '../../history';

let SearchResults = createReactClass({
  getInitialState() {
    return {
      selectionMode: false,
      newKeyWord: '',
      startedQuery: false,
    };
  },

  componentDidMount() {
    const { location } = this.props;

    if (location?.state?.message) {
      toastr.success(location?.state?.message);
      browserHistory.replace(location.pathname, null); // Clear location state
    }
  },

  componentWillMount() {
    const url = new URL(window.location);
    const requestParam = url.searchParams.get('request');
    let request = this.props.Request;
    const groupId = this.props.params.groupId != null ? this.props.params.groupId : 0;
    const parsedActualUrl = url.pathname;
    const self = this;

    if (requestParam != null && this.props.dataLength == 0) {
      store.dispatch({ type: 'LOADER', state: true });
      SearchApi.searchEncrypted(
        requestParam,
        ['library', 'public'],
        self.props.managementCloudId,
        self.props.TemporaryToken
      );
    } else if (parsedActualUrl === `/${this.props.Language}/manage-objects`) {
      store.dispatch({ type: 'UPDATE_REQUEST_MANAGE' });

      const { contextRequest } = this.props;
      request.LanguageCode = this.props.Language;
      SearchApi.search(
        request,
        contextRequest,
        this.props.managementCloudId,
        this.props.TemporaryToken
      );
    } else if (
      this.props.dataLength == 0 ||
      (groupId > 0 && groupId != this.props.Request.GroupId)
    ) {
      let contextRequest;
      const resetFilter = groupId > 0 && groupId != this.props.Request.GroupId;

      store.dispatch({ type: 'UPDATE_REQUEST_GROUP_ID', groupId });

      request = this.prepareRequest(this.props.Request);
      contextRequest = this.props.contextRequest;
      request.LanguageCode = this.props.Language;

      if (resetFilter) {
        // Reset des filtres s'il on change de groupe
        request.SearchValue = { Value: '' };
        request.SearchContainerDynamicFilter = [];
        request.SearchContainerFilter = {};
      }

      this.state.startedQuery = true;

      SearchApi.search(
        request,
        contextRequest,
        this.props.managementCloudId,
        this.props.TemporaryToken
      );
    } else if (groupId > 0) {
      store.dispatch({
        type: 'REFRESH_REQUEST_GROUP',
        managementcloudId: this.props.managementCloudId,
        token: this.props.TemporaryToken,
      });
    }
  },

  componentWillUnmount() {
    $('body').removeClass('modal-open');
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.Language != this.props.Language) {
      const request = this.props.Request;
      request.SearchPaging.Size = request.SearchPaging.From + this.props.size;
      request.SearchPaging.From = 0;
      request.LanguageCode = nextProps.Language;
      SearchApi.search(
        request,
        this.props.contextRequest,
        this.props.managementCloudId,
        this.props.TemporaryToken,
        false
      );
    } else if (
      nextProps.dataLength == 0 &&
      (nextProps.searchMode != this.props.searchMode ||
        (nextProps.searchMode == 'group' && this.props.params.groupId != nextProps.params.groupId))
    ) {
      const request = nextProps.Request;
      request.LanguageCode = nextProps.Language;

      SearchApi.search(
        request,
        nextProps.contextRequest,
        this.props.managementCloudId,
        this.props.TemporaryToken,
        false
      );
    }
  },

  closeSearchPanel(event) {
    const filterBar = document.getElementById('new-filterbar');
    let targetElement = event.target;

    do {
      // This is a click inside.
      if (
        targetElement == filterBar ||
        targetElement.id == 'materialv1menu' ||
        targetElement.id == 'loader-spinner'
      ) {
        return;
      }
      targetElement = targetElement.parentNode;
    } while (targetElement);

    // This is a click outside.
    this.hideFilter();
  },
  prepareRequest(request) {
    return request;
  },

  filterInArray(arr, property) {
    if (arr !== undefined) {
      const s = _.find(arr, (i) => i.PropertyId === property);
      return s !== undefined;
    }
    return false;
  },

  refreshCardOpacity() {
    const cards = $('.results-list-container .panel-object-std');
    const cards_not_opened = cards.has('.opened');
    if (cards_not_opened.length == 0) {
      cards.removeClass('filter-opacity');
    } else {
      cards.not('.opened').addClass('filter-opacity');
    }
  },

  render() {
    if (!this.props.ready) {
      return null;
    }

    switch (this.props.searchMode) {
      case 'group':
        return (
          <div className="container-fluid">
            <SearchHeader refreshCardOpacity={this.refreshCardOpacity} />
            <div className="searchbar">
              <SortMenu />
            </div>
            <div id="container-result">
              <ResultsList
                confirmRemoveBimObjectFromLibrary={this.confirmRemoveBimObjectFromLibrary}
                refreshCardOpacity={this.refreshCardOpacity}
                startedQuery={this.state.startedQuery}
              />
            </div>
          </div>
        );
      case 'manage':
        return (
          <div className="manage-objects">
            <div className="mo-top">
              <SearchHeader refreshCardOpacity={null} />
            </div>
            <ResultsList
              confirmRemoveBimObjectFromLibrary={this.confirmRemoveBimObjectFromLibrary}
              refreshCardOpacity={null}
              startedQuery={this.state.startedQuery}
            />
          </div>
        );
      default:
        return (
          <div className="container-fluid">
            <SearchHeader refreshCardOpacity={this.refreshCardOpacity} />
            <div className="searchbar">
              <SortMenu />
            </div>
            <div id="container-result">
              <ResultsList
                confirmRemoveBimObjectFromLibrary={this.confirmRemoveBimObjectFromLibrary}
                refreshCardOpacity={this.refreshCardOpacity}
                startedQuery={this.state.startedQuery}
              />
            </div>
          </div>
        );
    }
  },
});

const mapStateToProps = function (store, ownProps) {
  let currentSearchState;
  const { searchState } = store;
  const { searchGroupState } = store;
  const currentManageSearchState = store.manageSearchState;
  const { appState } = store;
  const isManage = ownProps.location.pathname == `/${appState.Language}/manage-objects`;

  if (ownProps.params.groupId > 0) {
    currentSearchState = searchGroupState;
  } else if (isManage) {
    currentSearchState = currentManageSearchState;
  } else {
    currentSearchState = searchState;
  }

  return {
    Request: currentSearchState.Request,
    initialRequest: currentSearchState.InitialRequest,
    dataLength: currentSearchState.DocumentsLength,
    staticFilters: currentSearchState.StaticFilters,
    contextRequest: currentSearchState.ContextRequest,
    size: currentSearchState.Size,
    resources: appState.Resources[appState.Language],
    ready: appState.Ready,
    managementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    Language: appState.Language,
  };
};

export default SearchResults = withRouter(connect(mapStateToProps)(SearchResults));