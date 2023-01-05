import React from 'react';
import createReactClass from 'create-react-class';

import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import toastr from 'toastr';
import _ from 'underscore';

// material UI
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';
import store from '../Store/Store';
import { API_URL } from '../Api/constants';
import { history } from '../history';
import { withRouter } from '../Utils/withRouter';

let BugTrack = createReactClass({
  getInitialState() {
    return {
      bugname: '',
      bugdesc: '',
      responsemsg: '',
      priority: '',
      prioritysended: '',
      files: [],
      nomfichier: '',
      consult: false,
      count: 0,
    };
  },

  // eslint-disable-next-line react/no-deprecated
  componentWillMount() { },

  bugNameChange(event) {
    this.state.bugname = event.target.value;
  },

  bugDescChange(event) {
    this.state.bugdesc = event.target.value;
  },

  priorityChange(event) {
    this.setState({ priority: event.target.value });
    switch (event.target.value) {
      case 'Critical':
        this.state.prioritysended = 'Bloquant';
        break;
      case 'Important':
        this.state.prioritysended = 'Critique';
        break;
      case 'ModeratelySevere':
        this.state.prioritysended = 'Majeur';
        break;
      default:
        this.state.prioritysended = '';
    }
  },

  deleteFiles(event) {
    const newFilesArray = this.state.files;
    newFilesArray.splice(event.currentTarget.dataset.id, 1);
    this.setState({ files: newFilesArray });
  },

  onDocDrop(files) {
    const self = this;
    let addDoc = true;
    _.map(this.state.files, (item, i) => {
      _.map(files, (receiveFile, i) => {
        if (item.name === receiveFile.name) {
          addDoc = false;
        }
      });
    });
    if (addDoc) {
      this.setState({ files: this.state.files.concat(files) });
      toastr.success(self.props.Resources.BugTracker.BugFileUpload);
    }
  },

  BugTrackTalker() {
    const self = this;
    if (
      this.state.bugname === '' ||
      this.state.bugdesc === '' ||
      this.state.prioritysended === ''
    ) {
      toastr.error(this.props.Resources.BugTracker.BugFieldEmpty);
    } else {
      const self = this;
      let isOk = true;
      const { bugname } = this.state;
      const { bugdesc } = this.state;
      const { prioritysended } = this.state;
      const file = this.state.files;

      const data = new FormData();
      data.append('bugname', bugname);
      data.append('bugdesc', bugdesc);
      data.append('bugpriority', prioritysended);
      if (self.props.params.groupId !== undefined) {
        data.append('groupId', self.props.params.groupId);
      }

      store.dispatch({ type: 'LOADER', state: true });

      fetch(
        `${API_URL}/api/ws/v1/bugtrack/contentmanagement/${self.props.managementCloudId}/action?token=${self.props.TemporaryToken}`,
        {
          method: 'POST',
          body: data,
        }
      )
        .then((response) => {
          store.dispatch({ type: 'LOADER', state: false });
          if (response.status != 200) {
            isOk = false;
          }
          return response.json();
        })
        .then((lareponse) => {
          self.state.responsemsg = lareponse;

          if (isOk) {
            toastr.success(self.props.Resources.BugTracker.BugIssueSended);
            if (self.props.params.groupId !== undefined) {
              history.push(
                `/${self.props.Language}/group/${self.props.params.groupId}/bugtrack/view`
              );
            } else {
              history.push(`/${self.props.Language}/bugtrack/view`);
            }
          } else if (lareponse.Message == 'The size of the files are too big') {
            toastr.error(lareponse.Message);
          } else {
            toastr.error(self.props.Resources.BugTracker.BugIssueSendError);
          }
        });
    }
  },

  render() {
    const self = this;

    const displayFiles = _.map(this.state.files, (item, i) => {
      if (item.type === 'image/png' || item.type === 'image/jpeg') {
        return (
          <div className="row" key={i + item.name}>
            <img src={item.preview} width="150" />
            <span style={{ marginLeft: '20px' }}>{item.name} </span>
            <Button
              id="btnSuppr"
              onClick={self.deleteFiles}
              variant="contained"
              color="primary"
              data-id={i}
              style={{ marginLeft: '20px' }}
            >
              {self.props.Resources.BugTracker.BugDeleteScreen}
            </Button>
          </div>
        );
      }

      return (
        <div className="row" key={i + item.name}>
          <InsertDriveFile />
          <span style={{ marginLeft: '20px' }}>{item.name} </span>
          <Button
            id="btnSuppr"
            onClick={self.deleteFiles}
            variant="contained"
            color="primary"
            data-id={i}
            style={{ marginLeft: '20px' }}
          >
            {self.props.Resources.BugTracker.BugDeleteScreen}
          </Button>
        </div>
      );
    });
    if (this.props.Settings.EnableBugtrack === true) {
      return (
        <section id="section-bugtrack" className="item-report">
          <FormControl>
            <div className="row">
              <div className="col-sm-17 col-sm-offset-3">
                <div className="panel">
                  <h2>{this.props.Resources.BugTracker.MenuItemReport}</h2>

                  <h3>{self.props.Resources.BugTracker.CriticityTableTitle}</h3>
                  <Table className="table-priority">
                    <TableHead>
                      <TableRow>
                        <TableCell>{self.props.Resources.BugTracker.LevelOfGravity}</TableCell>
                        <TableCell>{self.props.Resources.BugTracker.CategCriticity}</TableCell>
                        <TableCell>{self.props.Resources.BugTracker.DescCriticity}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>{self.props.Resources.BugTracker.Critical}</TableCell>
                        <TableCell>{self.props.Resources.BugTracker.DescCritical}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2</TableCell>
                        <TableCell>{self.props.Resources.BugTracker.Important}</TableCell>
                        <TableCell>{self.props.Resources.BugTracker.DescImportant}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>3</TableCell>
                        <TableCell>{self.props.Resources.BugTracker.ModeratelySevere}</TableCell>
                        <TableCell>
                          {self.props.Resources.BugTracker.DescModeratelySevere}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <div className="row">
                    <TextField
                      defaultValue={self.state.bugname}
                      onChange={this.bugNameChange}
                      label={this.props.Resources.BugTracker.BugNameField}
                      inputProps={{
                        'data-cy': this.props.Resources.BugTracker.BugNameField,
                      }}
                      rows={1}
                      style={{ width: '50%' }}
                    />
                  </div>
                  <div className="row">
                    <TextField
                      select
                      data-cy={self.props.Resources.BugTracker.Criticity}
                      label={self.props.Resources.BugTracker.Criticity}
                      value={self.state.priority}
                      style={{ width: '50%' }}
                      onChange={this.priorityChange}
                      InputProps={{
                        className: 'disabled-input-readable',
                      }}
                    >
                      <MenuItem
                        data-cy={self.props.Resources.BugTracker.Critical}
                        value="Critical"
                        style={{ color: '#f44336' }}
                      >
                        {self.props.Resources.BugTracker.Critical}
                      </MenuItem>
                      <MenuItem
                        data-cy={self.props.Resources.BugTracker.Important}
                        value="Important"
                        style={{ color: '#ffa726' }}
                      >
                        {self.props.Resources.BugTracker.Important}
                      </MenuItem>
                      <MenuItem
                        data-cy={self.props.Resources.BugTracker.ModeratelySevere}
                        value="ModeratelySevere"
                        style={{ color: '#4caf50' }}
                      >
                        {self.props.Resources.BugTracker.ModeratelySevere}
                      </MenuItem>
                    </TextField>
                  </div>
                  <div className="row">
                    <TextField
                      id="desc"
                      label={this.props.Resources.BugTracker.BugDiscribe}
                      fullWidth
                      rows={5}
                      placeholder=""
                      defaultValue={self.state.bugdesc}
                      onChange={this.bugDescChange}
                      multiline
                      InputLabelProps={{
                        className: 'label-for-multiline',
                      }}
                      inputProps={{
                        'data-cy': this.props.Resources.BugTracker.BugDiscribe,
                      }}
                    />
                  </div>
                  <div className="row">
                    <Dropzone
                      multiple
                      onDrop={this.onDocDrop}
                      className="dropzone-area"
                      style={{ height: '120px' }}
                      data-cy={this.props.Resources.BimObjectDetailsDocuments.AddDocuments}
                    >
                      <p className="legende">
                        {this.props.Resources.BimObjectDetailsDocuments.AddDocuments}
                        <br />
                        {this.props.Resources.BugTracker.ClickToAdd}
                      </p>
                    </Dropzone>
                  </div>
                  {displayFiles}
                </div>
                <div className="btn-container text-right">
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={self.BugTrackTalker}
                    className="btnEnvoi"
                  >
                    {self.props.Resources.ContentManagement.SendInvitation}
                  </Button>
                  {this.state.reponsemsg}
                </div>
              </div>
            </div>
          </FormControl>
        </section>
      );
    }

    return (
      <div className="text-center">
        <h1 className="loadingtext">BIM&CO - ONFLY</h1>
        <p>Error 403 Access Denied</p>
      </div>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    Title: appState.Title,
    Language: appState.Language,
    Resources:
      appState.Resources[appState.Language] != null ? appState.Resources[appState.Language] : [],
    managementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    Settings: appState.Settings,
  };
};

export default BugTrack = withRouter(connect(mapStateToProps)(BugTrack));