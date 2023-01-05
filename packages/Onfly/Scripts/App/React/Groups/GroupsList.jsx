/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React from 'react';
import createReactClass from 'create-react-class';

import { connect } from 'react-redux';
import _ from 'underscore';
import toastr from 'toastr';

// material ui calls
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';

// material ui icons
import AddIcon from '@material-ui/icons/Add.js';
import CloseIcon from '@material-ui/icons/Close.js';
import WarningIcon from '@material-ui/icons/Warning.js';

import styled from '@emotion/styled';
import GroupGrid from './GroupGrid.jsx';
import SuppressionModal from '../CommonsElements/SuppressionModal.jsx';
import * as GroupApi from '../../Api/GroupsApi.js';
import { API_URL } from '../../Api/constants';
import { setLoader } from '../../Reducers/app/actions.js';

const WarningMessageWrapper = styled.p({
  position: 'relative',
  paddingLeft: '3em',
  marginTop: '20px',
});

const StyledWarningIcon = styled(WarningIcon)({
  margin: '5px',
  marginTop: '15px',
  position: 'absolute',
  left: 0,
});

let GroupsList = createReactClass({
  getInitialState() {
    return {
      modalGroupTitle: '',
      modalGroupSaveButton: '',
      isModalAddGroupOpen: false,
      groupName: '',
      groupDescription: '',
      deleteModalObjectsIds: [],
      deleteModalGroupId: 0,
      bimObjectAddMode: 1,
    };
  },

  componentDidMount() {
    GroupApi.getGroups(this.props.TemporaryToken, this.props.ManagementCloudId);
    window.addEventListener('resize', this.updateSize);
  },

  updateSize() {
    const newHeightRequestWindows = $(window).height() - 282;
    const newWidthRequestWindows = $(window).width() - 50;
    this.setState({
      heightRequestWindows: newHeightRequestWindows,
      widthRequestWindows: newWidthRequestWindows,
    });
  },

  createSortHandler(event) {
    const columId = event.target.parentElement.dataset.id;
    this.handleRequestSort(columId);
  },

  handleRequestSort(property) {
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.props.GroupsList.sort((a, b) =>
          b[property].toLowerCase() < a[property].toLowerCase() ? -1 : 1
        )
        : this.props.GroupsList.sort((a, b) =>
          a[property].toLowerCase() < b[property].toLowerCase() ? -1 : 1
        );

    this.setState({ groups: data, order, orderBy: property });
  },

  openModalAddGroup() {
    this.setState({
      isModalAddGroupOpen: true,
      groupName: '',
      groupDescription: '',
      modalGroupTitle: this.props.resources.ContentManagement.CreateGroupButton,
      modalGroupSaveButton: this.props.resources.ContentManagement.CreateGroupButton,
    });
  },

  closeModalAddGroup() {
    this.setState({ isModalAddGroupOpen: false });
  },

  groupName(event) {
    this.setState({ groupName: event.target.value });
  },

  createGroupDesc(event) {
    this.setState({ groupDescription: event.target.value });
  },

  updateGroupsList(group) {
    this.props.addGroup(group);
  },

  saveGroup() {
    const name = this.state.groupName;
    const description = this.state.groupDescription;
    const { bimObjectAddMode } = this.state;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.ManagementCloudId}/group/addorupdate?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BimObjectAddMode: bimObjectAddMode,
          Name: name,
          Description: description,
        }),
      }
    )
      .then((response) => response.json())
      .then((json) => {
        this.closeModalAddGroup();
        this.updateGroupsList(json);
      });
  },

  deleteGroup() {
    Promise.all([
      GroupApi.deleteGroupBimObjects(
        this.props.ManagementCloudId,
        this.state.deleteModalObjectsIds,
        this.props.TemporaryToken,
        this.props.Language,
        this.props.resources
      ),
      GroupApi.deleteGroup(
        this.props.ManagementCloudId,
        this.state.deleteModalGroupId,
        this.props.TemporaryToken,
        this.props.Language,
        this.props.resources
      ),
    ])
      .then(() => {
        toastr.success(this.props.resources.ContentManagement.DeleteGroupToastrSuccess);
        this.props.deleteGroup(this.state.deleteModalGroupId);
        $('#confirm-deletion-modal').modal('hide');
      })
      .catch(() => {
        this.props.setLoader(false);
      });
  },

  check(e, groupId) {
    e.preventDefault();
    this.props.setLoader(true);
    GroupApi.checkGroupForDelete(
      this.props.ManagementCloudId,
      groupId,
      this.props.TemporaryToken,
      this.props.Language,
      this.props.resources
    )
      .then((ObjectsIds) => {
        this.props.setLoader(false);
        this.setState({
          deleteModalObjectsIds: ObjectsIds,
          deleteModalGroupId: groupId,
        });
        $('#confirm-deletion-modal').modal('show');
      })
      .catch(() => {
        this.props.setLoader(false);
        this.setState({
          deleteModalObjectsIds: [],
          deleteModalGroupId: groupId,
        });
        $('#confirm-deletion-modal').modal('hide');
      });
  },

  render() {
    const self = this;

    const sectionClass = 'flex-list';
    let resultNodes;
    let messageNoGroup;
    if (this.props.GroupsList != null) {
      resultNodes = this.props.GroupsList.map((group, i) => (
        <GroupGrid check={(e, groupId) => this.check(e, groupId)} key={i} group={group} />
      ));

      if (resultNodes.length === 0 && this.props.RoleKey === 'admin') {
        messageNoGroup = this.props.resources.ContentManagement.NoGroupAdmin;
      } else if (resultNodes.length === 0) {
        messageNoGroup = this.props.resources.ContentManagement.NoGroup;
      }
    }

    const contentString =
      this.state.deleteModalObjectsIds.length !== 0
        ? this.props.resources.ContentManagement.CheckGroupModalLabel +
        this.state.deleteModalObjectsIds.length +
        this.props.resources.ContentManagement.CheckGroupModalLabel2
        : '';

    return (
      <div className="group-container">
        <SuppressionModal
          headerTitle={this.props.resources.ContentManagement.DeleteGroupModalTitle}
          bodyContent={contentString}
          abortButtonTitle={this.props.resources.ContentManagement.DeleteGroupModalAbortButton}
          abortButtonAction={() => $('#confirm-deletion-modal').modal('hide')}
          confirmButtonTitle={this.props.resources.ContentManagement.DeleteGroupModalConfirmButton}
          confirmButtonAction={() => this.deleteGroup()}
        />
        <div className="row list-container">
          <div className="col-sm-17 col-sm-offset-3">
            <div className="panel">
              {this.props.RoleKey === 'admin' && (
                <Tooltip title={this.props.resources.ContentManagement.CreateGroupButton}>
                  <Fab
                    size="small"
                    onClick={this.openModalAddGroup}
                    id="create-group-btn"
                    data-cy="creer un projet"
                  >
                    <AddIcon />
                  </Fab>
                </Tooltip>
              )}
              <div className="text-center">{messageNoGroup}</div>
              <div className={sectionClass}>{resultNodes}</div>
              <Modal
                disableEnforceFocus
                open={this.state.isModalAddGroupOpen}
                onClose={this.closeModalAddGroup}
                onBackdropClick={this.closeModalAddGroup}
              >
                <div className="modal-dialog modal-add-group">
                  <div className="modal-content">
                    <div className="modal-header">
                      <CloseIcon
                        data-cy="bouton de fermeture"
                        className="modalCloseIcon"
                        onClick={this.closeModalAddGroup}
                      />
                      <Typography variant="h5" id="myModalLabel">
                        {this.state.modalGroupTitle}
                      </Typography>
                    </div>
                    <div className="modal-body">
                      <div className="container-fluid">
                        <div className="row">
                          <div className="col-xs-11">
                            <TextField
                              fullWidth
                              label={this.props.resources.ContentManagement.GroupName}
                              className="field-group-name"
                              inputProps={{
                                'data-cy': 'nom du projet',
                              }}
                              onChange={self.groupName}
                              value={self.state.groupName}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xs-23">
                            <TextField
                              label={this.props.resources.ContentManagement.GroupDescription}
                              className="label-for-multiline"
                              // InputLabelProps={{}}
                              inputProps={{
                                'data-cy': 'description',
                              }}
                              rows={2}
                              fullWidth
                              value={self.state.groupDescription}
                              onChange={self.createGroupDesc}
                            />
                          </div>
                        </div>

                        <WarningMessageWrapper>
                          <StyledWarningIcon />
                          {this.props.resources.ContentManagement.GroupAddAlertMessage}
                        </WarningMessageWrapper>

                        {/* <div style={{ marginTop: '20px' }}>
                          <BimObjectAddMode bimObjectAddMode={this.state.bimObjectAddMode} setBimObjectAddMode={(bimObjectAddMode) => this.setState({ bimObjectAddMode })} />
                        </div> */}
                      </div>
                    </div>
                    <div className="modal-footer">
                      <Button
                        className="btn-flat"
                        data-cy="cancel"
                        onClick={this.closeModalAddGroup}
                      >
                        {this.props.resources.MetaResource.Cancel}
                      </Button>
                      <Button
                        className="btn-flat blue"
                        onClick={this.saveGroup}
                        data-cy="creer un projet"
                      >
                        {this.state.modalGroupSaveButton}
                      </Button>
                    </div>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;
  const { groupsState } = store;

  return {
    Language: appState.Language,
    UserId: appState.UserId,
    RoleKey: appState.RoleKey,
    RoleName: appState.RoleName,
    ManagementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    GroupsList: groupsState.GroupsList,
    resources: appState.Resources[appState.Language],
    Settings: appState.Settings,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setLoader: (value) => dispatch(setLoader(value)),
  addGroup: (groupAdded) => dispatch({ type: 'ADD_GROUP', groupAdded }),
  deleteGroup: (groupId) => dispatch({ type: 'DELETE_GROUP', groupId }),
});

export default GroupsList = connect(mapStateToProps, mapDispatchToProps)(GroupsList);