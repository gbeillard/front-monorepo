import React from 'react';
import createReactClass from 'create-react-class';

import { connect } from 'react-redux';

// material ui icons
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ViewHeadLineIcon from '@material-ui/icons/ViewHeadline';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import FilterListIcon from '@material-ui/icons/FilterList';
import { withRouter } from '../../Utils/withRouter';
import store from '../../Store/Store';

import * as SearchApi from '../../Api/SearchApi.js';

let SortMenu = createReactClass({
  shouldComponentUpdate(nextProps) {
    if (
      nextProps.sorting == this.props.sorting &&
      nextProps.sortOrder == this.props.sortOrder &&
      nextProps.layout == this.props.layout &&
      nextProps.Language == this.props.Language
    ) {
      return false;
    }
    return true;
  },

  _handleChangeSort(event) {
    const { value } = event.target.dataset;
    const newRequest = this.props.Request;
    newRequest.SearchSorting = { Name: value, Order: this.props.sortOrder };

    if (this.props.sorting != value && value == 'Name') {
      newRequest.SearchSorting = { Name: value, Order: 'asc' };
    } else if (this.props.sorting != value) {
      newRequest.SearchSorting = { Name: value, Order: 'desc' };
    } else {
      newRequest.SearchSorting = { Name: value, Order: this.props.sortOrder };
    }

    newRequest.SearchPaging.From = 0;
    newRequest.IgnoreFacets = true;
    newRequest.LanguageCode = this.props.Language;
    SearchApi.search(
      newRequest,
      this.props.contextRequest,
      this.props.managementCloudId,
      this.props.TemporaryToken
    );
  },

  _handleChangeLayout(event) {
    const { value } = event.currentTarget.dataset;

    store.dispatch({ type: 'CHANGE_LAYOUT', layout: value });
    store.dispatch({ type: 'CHANGE_LAYOUT_GROUP', layout: value });
  },

  selectSortOrder(e) {
    const newOrder = e.currentTarget.dataset.order;

    const newRequest = this.props.Request;
    newRequest.SearchSorting = { Name: this.props.sorting, Order: newOrder };
    newRequest.SearchPaging.From = 0;
    newRequest.IgnoreFacets = true;
    newRequest.LanguageCode = this.props.Language;
    SearchApi.search(
      newRequest,
      this.props.contextRequest,
      this.props.managementCloudId,
      this.props.TemporaryToken
    );
  },

  render() {
    return (
      <div className="count-and-sort-container" ref="searchTop">
        <div className="sorting">
          <div className="sorting-big">
            <ul className="sort-menu">
              <li>
                <a
                  onClick={this._handleChangeSort}
                  data-value="Name"
                  className={this.props.sorting == 'Name' ? 'active' : ''}
                >
                  {this.props.resources.SearchResults.SortNameAscLabel}
                </a>
              </li>
              <li className="border-left">
                <a
                  onClick={this._handleChangeSort}
                  data-value="CreatedAt"
                  className={this.props.sorting == 'CreatedAt' ? 'active' : ''}
                >
                  {this.props.resources.SearchResults.SortCreatedAsc}
                </a>
              </li>
              <li className="border-left">
                <a
                  onClick={this._handleChangeSort}
                  data-value="UpdatedAt"
                  className={this.props.sorting == 'UpdatedAt' ? 'active' : ''}
                >
                  {this.props.resources.SearchResults.SortLastModified}
                </a>
              </li>
              <li className="border-left">
                <a
                  onClick={this._handleChangeSort}
                  data-value=""
                  className={this.props.sorting == '' ? 'active' : ''}
                >
                  {this.props.resources.SearchResults.SortRelevance}
                </a>
              </li>
            </ul>
            <ul className="sort-menu sort-icons border-left">
              <li>
                <a
                  className={this.props.sortOrder == 'Asc' ? 'active' : ''}
                  data-order="Asc"
                  onClick={this.selectSortOrder}
                >
                  <KeyboardArrowUpIcon />
                </a>
              </li>
              <li>
                <a
                  className={this.props.sortOrder == 'Desc' ? 'active' : ''}
                  data-order="Desc"
                  onClick={this.selectSortOrder}
                >
                  <KeyboardArrowDownIcon />
                </a>
              </li>
            </ul>
            <ul className="sort-menu sort-icons border-left">
              <li>
                <a
                  onClick={this._handleChangeLayout}
                  className={this.props.layout == 'row' ? 'row-view active' : 'row-view'}
                  data-value="row"
                >
                  <ViewHeadLineIcon />
                </a>
              </li>
              <li>
                <a
                  onClick={this._handleChangeLayout}
                  className={this.props.layout == 'grid' ? 'grid-view active' : 'grid-view'}
                  data-value="grid"
                >
                  <ViewModuleIcon />
                </a>
              </li>
            </ul>
          </div>
          <div className="sorting-small">
            <FilterListIcon />
          </div>
        </div>
      </div>
    );
  },
});

const mapStateToProps = function (store, ownProps) {
  let currentSearchState;
  const { searchState } = store;
  const { searchGroupState } = store;
  const { appState } = store;
  const currentManageSearchState = store.manageSearchState;
  const isManage = ownProps.location.pathname == `/${appState.Language}/manage-objects`;

  if (ownProps.params.groupId > 0) {
    currentSearchState = searchGroupState;
  } else if (isManage == true) {
    currentSearchState = currentManageSearchState;
  } else {
    currentSearchState = searchState;
  }

  return {
    TemporaryToken: appState.TemporaryToken,
    managementCloudId: appState.ManagementCloudId,
    Request: currentSearchState.Request,
    contextRequest: currentSearchState.ContextRequest,
    sorting:
      currentSearchState.Request != null ? currentSearchState.Request.SearchSorting.Name : '',
    sortOrder:
      currentSearchState.Request != null ? currentSearchState.Request.SearchSorting.Order : '',
    layout: currentSearchState.Layout,
    resources: appState.Resources[appState.Language],
    ready: typeof appState.Resources[appState.Language] !== 'undefined',
    Language: appState.Language,
  };
};

export default SortMenu = withRouter(connect(mapStateToProps)(SortMenu));