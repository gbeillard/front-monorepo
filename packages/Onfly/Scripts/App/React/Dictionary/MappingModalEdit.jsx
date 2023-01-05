/* eslint-disable react/prefer-es6-class */
import React from 'react';
import createReactClass from 'create-react-class';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import _ from 'underscore';
import Dropzone from 'react-dropzone';

// Material UI
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import LinearProgress from '@material-ui/core/LinearProgress';
import Fab from '@material-ui/core/Fab';

// Material UI Icon
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import ReplayIcon from '@material-ui/icons/Replay';
import CloseIcon from '@material-ui/icons/Close';
import { Toggle } from '@bim-co/componentui-foundation';
import { API_URL } from '../../Api/constants';

let MappingModalEdit = createReactClass({
  getInitialState() {
    return {
      Id: this.props.Id,
      Name: this.props.Name,
      Language: this.props.Language,
      ShowButtonsEditName: false,
      ErrorConfigurationName: false,
      UpdateCompleted: false,
      LanguageList: [],
      IsPluginDefault: this.props.IsPluginDefault,
    };
  },

  componentDidMount() {
    const self = this;

    $('body').on('hide.bs.modal', '#mapping-modal-edit', () => {
      if (self.state.UpdateCompleted == true) {
        self.refreshDropzone();
      }
    });
  },

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(newProps) {
    this.setState({
      Id: newProps.Id,
      Name: newProps.Name,
      Language: newProps.ConfigurationLanguage,
      ShowButtonsEditName: false,
      ErrorConfigurationName: false,
      UpdateCompleted: false,
      IsPluginDefault: newProps.IsPluginDefault,
    });
    this.getLanguageList(newProps.Language, newProps.Id);
  },

  handleChangeConfigurationName(event) {
    const name = event.target.value;

    this.setState({
      Name: name,
      ShowButtonsEditName: name.trim() !== this.props.Name,
      IsPluginDefault: this.props.IsPluginDefault,
    });
  },

  handleSelectConfigurationLanguage(event) {
    const languageCode = event.target.value;

    if (this.state.Language !== languageCode) {
      this.setState({ Language: languageCode, UpdateCompleted: false });
    }
  },

  handleClickSaveEditName() {
    const self = this;
    const urlWS = `/api/ws/v1/${this.props.Language}/contentmanagement/${this.props.ManagementCloudId}/dictionary/mapping/edit?token=${this.props.TemporaryToken}`;

    fetch(API_URL + urlWS, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Id: self.state.Id,
        Name: self.state.Name,
        IsPluginDefault: self.state.IsPluginDefault,
      }),
    })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
      })
      .then((configuration) => {
        if (configuration != null) {
          if (configuration.Id > 0) {
            self.setState({ ShowButtonsEditName: false, ErrorConfigurationName: false });
            self.props.HandleClickSaveName(self.state.Id, self.state.Name, self.state.IsPluginDefault);
          } else {
            // Configuration already exist
            self.setState({ ErrorConfigurationName: true });
          }
        }
      });
  },

  updateDone() {
    this.setState({ UpdateCompleted: true });
    this.getLanguageList(this.props.Language, this.state.Id);
  },

  refreshDropzone() {
    this.setState({ UpdateCompleted: false });
  },

  getLanguageList(language, configurationId) {
    const self = this;
    const urlWS = `/api/ws/v1/${language}/contentmanagement/${this.props.ManagementCloudId}/dictionary/mapping/${configurationId}/language/list?token=${this.props.TemporaryToken}`;

    if (configurationId != null && configurationId > 0) {
      fetch(API_URL + urlWS, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          }
        })
        .then((languageList) => {
          if (languageList != null) {
            self.setLanguageList(languageList);
          }
        });
    }
  },

  setLanguageList(languageList) {
    this.setState({ LanguageList: languageList });
  },

  handleClickDeleteConfiguration() {
    this.state.UpdateCompleted = false; // Refresh la dropzone
    this.props.DeleteConfiguration(this.state.Id, this.state.Language, this.setLanguageList);
  },

  handlePluginDefault() {
    this.setState({ IsPluginDefault: !this.state.IsPluginDefault, ShowButtonsEditName: true });
  },

  render() {
    const self = this;

    const ITEM_HEIGHT = 46;
    const MENU_PROPS = {
      disableEnforceFocus: true,
      disableAutoFocus: true,
      getContentAnchorEl: null,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
      style: {
        zIndex: 2100,
      },
    };

    const languageExist = _.indexOf(this.state.LanguageList, this.state.Language) > -1;

    const languagesList = _.map(this.props.Languages, (lang, i) => {
      const keys = _.keys(lang.Translations);
      let language_trad = '';
      if (_.contains(keys, self.props.Language)) {
        language_trad = lang.Translations[self.props.Language];
      } else {
        language_trad = lang.DefaultName;
      }

      if (lang.IsInterface) {
        return (
          <MenuItem
            key={`lang-${lang.LanguageCode}`}
            className="menu-item-language"
            value={lang.LanguageCode}
          >
            <ListItemIcon>
              <span className={`language-icon lang-${lang.LanguageCode}`} />
            </ListItemIcon>
            <ListItemText inset primary={language_trad} className="lang-name manage-item" />
          </MenuItem>
        );
      }
    });

    let dropzoneContent;

    if (this.state.UpdateCompleted) {
      dropzoneContent = (
        <div>
          <div className="dropzone-icon-container">
            <CloudDoneIcon className="dropzone-icon-done" />
          </div>
          <Typography className="dropzone-title" variant="h6" gutterBottom>
            {this.props.Resources.ContentManagementDictionary.UpdateCompleted}
          </Typography>
          <Fab size="small" aria-label="Refresh" onClick={this.refreshDropzone}>
            <ReplayIcon />
          </Fab>
        </div>
      );
    } else {
      dropzoneContent = (
        <div>
          <div className="dropzone-icon-container">
            <CloudUploadIcon className="dropzone-icon" />
          </div>
          <Typography className="dropzone-title" variant="h6" gutterBottom>
            {this.props.Resources.ContentManagementDictionary.UploadSharedParametersFile}
          </Typography>
          <Typography className="dropzone-subtitle legende" variant="subtitle1" gutterBottom>
            {this.props.Resources.ContentManagementDictionary.SupportedSharedParametersFiles}
          </Typography>
        </div>
      );
    }

    return (
      <div
        className="modal fade"
        id="mapping-modal-edit"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <Typography variant="h6">
                {this.props.Resources.ContentManagementDictionary.EditConfiguration}
              </Typography>
              <CloseIcon className="close" data-toggle="modal" data-dismiss="modal" />
            </div>
            <div className="modal-body">
              <div id="edit-name-container">
                <TextField
                  id="configuration-name"
                  className="form-control-configuration-name"
                  InputProps={{ className: 'input-configuration-name' }}
                  label={this.props.Resources.ContentManagementDictionary.ConfigurationName}
                  value={this.state.Name}
                  onChange={this.handleChangeConfigurationName}
                  error={this.state.ErrorConfigurationName}
                  helperText={
                    this.state.ErrorConfigurationName
                      ? this.props.Resources.ContentManagementDictionary.ConfigurationAlreadyExist
                      : ''
                  }
                />
                <div id="toggle">
                  <Toggle
                    label={this.props.Resources.ContentManagementDictionary.IsPluginDefault}
                    onChange={this.handlePluginDefault}
                    checked={this.state.IsPluginDefault}
                  />
                  <p>{this.props.Resources.ContentManagementDictionary.IsPluginDefaultExplanation}</p>
                </div>
                <div id="buttons-container">
                  {this.state.ShowButtonsEditName ? (
                    <div>
                      <Button
                        className="btn-raised btn-save-name"
                        variant="contained"
                        size="small"
                        onClick={this.handleClickSaveEditName}
                      >
                        {this.props.Resources.MetaResource.Save}
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
              <div id="update-configuration-container">
                <Typography variant="h6" gutterBottom>
                  {this.props.Resources.ContentManagementDictionary.ConfigurationTitle}
                </Typography>

                <div id="mapping-configuration-language-container">
                  <FormControl id="mapping-configuration-language">
                    <Select
                      name="Language"
                      value={this.state.Language}
                      className="select-configuration-language"
                      onChange={this.handleSelectConfigurationLanguage}
                      input={<Input id="input-select-configuration-language" disableUnderline />}
                      disabled
                      MenuProps={MENU_PROPS}
                    >
                      {languagesList}
                    </Select>
                  </FormControl>
                </div>

                <Typography variant="subtitle1" className="subtitle" gutterBottom>
                  {languageExist
                    ? this.props.Resources.ContentManagementDictionary.UpdateConfiguration
                    : this.props.Resources.ContentManagementDictionary.NewConfiguration}
                </Typography>

                <div id="dropzone-container">
                  <Dropzone
                    multiple={false}
                    onDropAccepted={(file, event) =>
                      this.props.OnSharedParametersFileDrop(
                        file,
                        this.state.Language,
                        this.updateDone
                      )
                    }
                    onDropRejected={this.props.OnFileRejected}
                    onDragEnter={this.props.OnDropzoneDragEnter}
                    onDragLeave={this.props.OnDropzoneDragLeave}
                    accept=".txt"
                    maxSize={31457280}
                    className={`dropzone-upload-file dropzone-area${this.state.UpdateCompleted ? ' disabled' : ''
                      }`}
                    disabled={this.state.UpdateCompleted}
                  >
                    {dropzoneContent}
                    <LinearProgress className="dropzone-progress-bar hidden" />
                  </Dropzone>
                </div>

                <div id="delete-configuration-container">
                  {languageExist ||
                    (this.state.LanguageList != null && this.state.LanguageList.length == 0) ? (
                    <Button
                      id="btn-delete-configuration"
                      variant="outlined"
                      size="small"
                      onClick={this.handleClickDeleteConfiguration}
                    >
                      {this.props.Resources.ContentManagementDictionary.DeleteConfiguration}
                      {languageExist && (
                        <span className={`language-icon lang-${this.state.Language}`} />
                      )}
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button data-toggle="modal" data-dismiss="modal">
                {this.props.Resources.MetaResource.Close}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    ManagementCloudId: appState.ManagementCloudId,
    Language: appState.Language,
    Resources: appState.Resources[appState.Language],
    TemporaryToken: appState.TemporaryToken,
    Languages: appState.Languages,
  };
};

export default MappingModalEdit = connect(mapStateToProps)(MappingModalEdit);