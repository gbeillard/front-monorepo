import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import _ from 'underscore';
import SearchIcon from '@material-ui/icons/Search';

// material ui calls
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withRouter } from '../../Utils/withRouter';

import { selectDisplayName } from '../../Reducers/app/selectors';

let SearchBox = createReactClass({
  getInitialState() {
    return {
      menuAnchor: null,
    };
  },

  changeContextRequest(event) {
    this.props.changeContextRequest(event);
  },

  handleOpenMenu(event) {
    this.setState({ menuAnchor: event.currentTarget });
  },

  handleCloseMenu() {
    this.setState({ menuAnchor: null });
  },

  render() {
    const self = this;

    let filterLibraries;
    let separatorFilterLibraries;

    if (self.props.params.groupId == null) {
      separatorFilterLibraries = (
        <div className="separator col-md-offset-0 col-xs-2 col-xs-offset-1">
          {self.props.resources.ContentManagement.IntoSearch}
        </div>
      );

      filterLibraries = (
        <div className="col-md-9 col-xs-19">
          <div id="btn-group-libraries">
            <button
              data-toggle="dropdown"
              className="dropdown-toggle"
              onClick={this.handleOpenMenu}
            >
              {`${self.props.resources.ContentManagement.SelectLibraries} (${self.props.contextRequest != undefined ? self.props.contextRequest.length : ''
                })`}
              <hr aria-hidden="true" />
            </button>
            <Menu
              id="materialv1menu"
              open={Boolean(this.state.menuAnchor)}
              anchorEl={this.state.menuAnchor}
              onClose={this.handleCloseMenu}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <MenuItem
                data-value="all"
                data-checked={
                  !(
                    _.indexOf(self.props.contextRequest, 'library') !== -1 &&
                    _.indexOf(self.props.contextRequest, 'public') !== -1 &&
                    _.indexOf(self.props.contextRequest, 'personal') !== -1 &&
                    (_.indexOf(self.props.contextRequest, 'entity') !== -1 ||
                      !this.props.Settings.HasPrivateSite)
                  )
                }
                onMouseDown={self.changeContextRequest}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        _.indexOf(self.props.contextRequest, 'library') !== -1 &&
                        _.indexOf(self.props.contextRequest, 'public') !== -1 &&
                        _.indexOf(self.props.contextRequest, 'personal') !== -1 &&
                        (_.indexOf(self.props.contextRequest, 'entity') !== -1 ||
                          !this.props.Settings.HasPrivateSite)
                      }
                      color="primary"
                    />
                  }
                  label={self.props.resources.ContentManagement.AllLibrary}
                />
              </MenuItem>
              <MenuItem
                data-value="personal"
                data-checked={!_.indexOf(self.props.contextRequest, 'personal') !== -1}
                onMouseDown={self.changeContextRequest}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={_.indexOf(self.props.contextRequest, 'personal') !== -1}
                      color="primary"
                    />
                  }
                  label={self.props.resources.ContentManagement.MyLibrary}
                />
              </MenuItem>
              <MenuItem
                data-value="public"
                data-checked={!_.indexOf(self.props.contextRequest, 'public') !== -1}
                onMouseDown={self.changeContextRequest}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={_.indexOf(self.props.contextRequest, 'public') !== -1}
                      color="primary"
                    />
                  }
                  label={self.props.resources.ContentManagement.BimAndCoLibrary}
                />
              </MenuItem>
              <MenuItem
                data-value="library"
                data-checked={!_.indexOf(self.props.contextRequest, 'library') !== -1}
                onMouseDown={self.changeContextRequest}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={_.indexOf(self.props.contextRequest, 'library') !== -1}
                      color="primary"
                    />
                  }
                  label={self.props.resources.ContentManagement.MyOnflyLibrary.replace(
                    '[CompanyName]',
                    self.props.EntityName
                  )}
                />
              </MenuItem>
              {this.props.Settings.HasPrivateSite && (
                <MenuItem
                  data-value="library"
                  data-checked={!_.indexOf(self.props.contextRequest, 'entity') !== -1}
                  onMouseDown={self.changeContextRequest}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={_.indexOf(self.props.contextRequest, 'entity') !== -1}
                        color="primary"
                      />
                    }
                    label={self.props.resources.ContentManagement.MyEntityLibrary.replace(
                      '[CompanyName]',
                      self.props.EntityName
                    )}
                  />
                </MenuItem>
              )}
            </Menu>
          </div>
        </div>
      );
    }

    return (
      <div className="row searchwrapper">
        <div className="col-md-10 col-xs-21 col-xs-offset-1">
          <div id="searchglobal">
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <SearchIcon
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 13,
                  width: 20,
                  height: 20,
                }}
              />
              <TextField
                type="text"
                id="inputsearchglobal"
                placeholder={self.props.resources.ContentManagement.SearchForPlaceHolder}
                onChange={self.props.changeKeyword}
                fullWidth
                inputProps={{ style: { textIndent: '30px' } }}
              />
            </div>
          </div>
        </div>
        {separatorFilterLibraries}
        {filterLibraries}
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
    Request: currentSearchState.Request,
    // contextRequest: currentSearchState.ContextRequest,
    managementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    resources: appState.Resources[appState.Language],
    Language: appState.Language,
    EntityName: selectDisplayName(store),
    Settings: appState.Settings,
  };
};

export default SearchBox = withRouter(connect(mapStateToProps)(SearchBox));