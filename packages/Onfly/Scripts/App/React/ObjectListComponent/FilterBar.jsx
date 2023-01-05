import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import _ from 'underscore';
import FilterList from './FilterList.jsx';
import FilterSuggest from './FilterSuggest.jsx';
import FilterRange from './FilterRange.jsx';
import { withRouter } from '../../Utils/withRouter';

let FilterBar = createReactClass({
  chooseComponent(componentName, i) {
    const self = this;
    const staticFilter = this.props.staticFilters[componentName];

    switch (componentName) {
      case 'ObjectType':
        return (
          <FilterList
            key={i}
            property="ObjectTypeManagementCloud"
            values={staticFilter}
            handleRequest={this.props.handleRequest}
            listType="ObjectTypeManagementCloud"
            title={this.props.resources.SearchResults.ObjectTypeFilterTitle}
            resources={this.props.resources}
          />
        );

      case 'Status':
        return (
          <FilterList
            key={i}
            property="ManagementClouds.Status"
            values={staticFilter}
            handleRequest={this.props.handleRequest}
            listType="Status"
            title={this.props.resources.SearchResults.StatusFilterTitle}
            resources={this.props.resources}
          />
        );

      case 'Manufacturers':
        return (
          <FilterSuggest
            key={i}
            property="ManufacturerManagementCloud"
            staticFilters={staticFilter}
            handleRequest={this.props.handleRequest}
            title={this.props.resources.SearchResults.ManufacturersFilterTitle}
            resources={this.props.resources}
            reset={this.props.reset}
          />
        );

      case 'Companies':
        return (
          <FilterSuggest
            key={i}
            property="Company.Name"
            staticFilters={staticFilter}
            handleRequest={this.props.handleRequest}
            title={this.props.resources.SearchResults.CompaniesFilterTitle}
            resources={this.props.resources}
            reset={this.props.reset}
          />
        );

      case 'Pins.Name_raw':
        return (
          <FilterSuggest
            key={i}
            property="Pins.Name_raw"
            staticFilters={staticFilter}
            handleRequest={this.props.handleRequest}
            title="Tags"
            resources={this.props.resources}
            reset={this.props.reset}
          />
        );

      case 'Softwares':
        return (
          <FilterSuggest
            key={i}
            property="Softwares"
            staticFilters={staticFilter}
            handleRequest={this.props.handleRequest}
            title={this.props.resources.SearchResults.SoftwareFilterTitle}
            resources={this.props.resources}
            reset={this.props.reset}
          />
        );

      case 'Extensions':
        return (
          <FilterSuggest
            key={i}
            property="Extensions"
            staticFilters={staticFilter}
            handleRequest={this.props.handleRequest}
            title={this.props.resources.SearchResults.ExtensionsFilterTitle}
            resources={this.props.resources}
            reset={this.props.reset}
          />
        );

      case 'Lod':
        return (
          <FilterRange
            key={i}
            property="Lod"
            values={staticFilter}
            handleRequest={this.props.handleRequest}
            title={this.props.resources.SearchResults.LodFilterTitle}
            resources={this.props.resources}
            kindFilter="RangeContainerFilter"
          />
        );

      case 'Classifications':
        // FORCE HIDE CLASSIFICATIONS
        return '';
    }
  },
  render() {
    const self = this;
    const filters = [];
    let i = 0;
    for (const component in this.props.staticFilters) {
      filters[i] = self.chooseComponent(component, i);
      i++;
    }

    return (
      <div className="filters-container">
        <div className="filters">{filters}</div>
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
    resources: appState.Resources[appState.Language],
    ready: typeof appState.Resources[appState.Language] !== 'undefined',
    staticFilters: currentSearchState.StaticFilters,
    Language: appState.Language,
    context: currentSearchState.Request.Context,
    nbResults: currentSearchState.Documents.length,
    page: currentSearchState.Page,
  };
};

export default FilterBar = withRouter(connect(mapStateToProps)(FilterBar));