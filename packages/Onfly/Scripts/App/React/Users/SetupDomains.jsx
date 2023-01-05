import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import toastr from 'toastr';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

// material ui icons
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail.js';
import * as Utils from '../../Utils/utils.js';
import { API_URL } from '../../Api/constants';

let SetupDomains = createReactClass({
  getInitialState() {
    return {
      allowedDomainNamesList: [],
      allowedDomainNamesListHasChanged: false,
    };
  },

  loadCurrentDomainsList() {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/domains/list?token=${this.props.TemporaryToken}`,
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
        self.setState({ allowedDomainNamesList: json });
      });
  },

  checkAndUpdateDomains() {
    const self = this;
    const domainToAdd = this.domainNameToAdd.value.replace(/\s/g, '');
    const actualDomainsList = this.state.allowedDomainNamesList;

    if (domainToAdd != '') {
      // check domain validity
      if (!Utils.checkIsValidDomain(domainToAdd)) {
        toastr.error(`${self.props.resources.UsersManagement.DomainsAddInvalid} ${domainToAdd}`);
        return;
      }

      // check if already in domain list
      const checkDomainInList = actualDomainsList.findIndex(
        (d) => d.ContentmanagementDomainName == domainToAdd
      );
      if (checkDomainInList > -1) {
        toastr.error(
          `${self.props.resources.UsersManagement.DomainsAddAlreadyInList} ${domainToAdd}`
        );
        return;
      }

      actualDomainsList.push({ ContentmanagementDomainName: domainToAdd });
      self.setState({
        allowedDomainNamesList: actualDomainsList,
        allowedDomainNamesListHasChanged: true,
      });
      self.domainNameToAdd.value = '';
    }

    self.updateCurrentDomainsList();
  },

  updateCurrentDomainsList() {
    const self = this;
    const currentDomiainList = this.state.allowedDomainNamesList;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/domains/update?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentDomiainList),
      }
    ).then((response) => {
      if (response.status == 200) {
        toastr.success(self.props.resources.UsersManagement.DomainsUpdateSuccess);
        self.closeDomainsScreen();
      } else {
        toastr.error(self.props.resources.UsersManagement.DomainsUpdateError);
      }
    });
  },

  handleKeyPressAddDomain(e) {
    if (e.key == 'Enter') {
      this.addDomainToDomainList();
    }
  },

  splashScreenDomains() {
    this.loadCurrentDomainsList();
    const screenClass = 'modal fade smallSideMenu';
    $('#SetupDomains').removeClass().addClass(screenClass);
    $('#SetupDomains').modal('show');
  },

  closeDomainsScreen() {
    // clear domain input
    this.domainNameToAdd.value = '';
    $('#SetupDomains').modal('hide');
  },

  addDomainToDomainList() {
    const domainToAdd = this.domainNameToAdd.value.replace(/\s/g, '');
    const actualDomainsList = this.state.allowedDomainNamesList;
    const self = this;

    if (domainToAdd != '') {
      // check domain validity
      if (!Utils.checkIsValidDomain(domainToAdd)) {
        toastr.error(`${self.props.resources.UsersManagement.DomainsAddInvalid} ${domainToAdd}`);
        return;
      }

      // check if already in domain list
      const checkDomainInList = actualDomainsList.findIndex(
        (d) => d.ContentmanagementDomainName == domainToAdd
      );
      if (checkDomainInList > -1) {
        toastr.error(
          `${self.props.resources.UsersManagement.DomainsAddAlreadyInList} ${domainToAdd}`
        );
        return;
      }

      actualDomainsList.push({ ContentmanagementDomainName: domainToAdd });
      self.setState({
        allowedDomainNamesList: actualDomainsList,
        allowedDomainNamesListHasChanged: true,
      });
      self.domainNameToAdd.value = '';
    }
  },

  handleDeleteDomain(event) {
    const domainToDelete = event.currentTarget.parentElement.dataset.domain;
    const actualDomainsList = this.state.allowedDomainNamesList;

    const checkDomainsList = actualDomainsList.findIndex(
      (d) => d.ContentmanagementDomainName == domainToDelete
    );

    if (checkDomainsList > -1) {
      let newDomainList = [];
      newDomainList = newDomainList.concat(
        actualDomainsList.slice(0, checkDomainsList),
        actualDomainsList.slice(checkDomainsList + 1)
      );
      this.setState({ allowedDomainNamesList: newDomainList });
    }
  },

  render() {
    const self = this;

    const allowedDomainNames = self.state.allowedDomainNamesList.map((domain, i) => {
      const avatar = domain.ContentmanagementDomainName.substring(0, 1).toUpperCase();
      const adaptatedAvatar = <Avatar>{avatar}</Avatar>;
      const formatedomainName = `@${domain.ContentmanagementDomainName}`;
      return (
        <Chip
          key={i}
          data-domain={domain.ContentmanagementDomainName}
          avatar={adaptatedAvatar}
          label={formatedomainName}
          onDelete={self.handleDeleteDomain}
        />
      );
    });

    return (
      <div className="col-xs-11 text-center access">
        <img height="100" src="/Content/images/AutorizeAccess.svg" />
        <div className="text-details">
          <h2 className="title">{self.props.resources.UsersManagement.PageMemberAccessTitle}</h2>
          <p>{self.props.resources.UsersManagement.PageMemberAccessSpeech}</p>
        </div>
        <Button
          variant="contained"
          className="btn-raised member-buttons"
          onClick={self.splashScreenDomains}
        >
          {self.props.resources.UsersManagement.PageMemberAccessSetupButton}
        </Button>

        <div
          className="modal fade"
          id="SetupDomains"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <a data-toggle="modal" onClick={self.closeDomainsScreen} className="close-setup">
            <img src="/Content/images/Croix.svg" />
          </a>
          <div id="basicMailInvitation" style={{ marginBottom: 0 }}>
            <div className="domainsScreen-body">
              <img src="/Content/images/DomainAccess_big.svg" />
              <div className="text-details">
                <h2 className="title">{self.props.resources.UsersManagement.ModalDomainTitle}</h2>
                <div className="domains-input">
                  <AlternateEmailIcon />
                  <TextField
                    id="addSingleDomain"
                    placeholder={self.props.resources.UsersManagement.ModalDomainInputText}
                    inputRef={(input) => {
                      self.domainNameToAdd = input;
                    }}
                    onKeyPress={self.handleKeyPressAddDomain}
                  />
                  <Button
                    color="primary"
                    className="btn-flat blue btn-reset"
                    onClick={self.addDomainToDomainList}
                  >
                    {self.props.resources.UsersManagement.ModalDomainAddButton}
                  </Button>
                </div>
              </div>
              <div className="domains-chips">{allowedDomainNames}</div>
              <div className="domains-save">
                <Button
                  variant="contained"
                  className="btn-raised grey"
                  onClick={self.checkAndUpdateDomains}
                >
                  {self.props.resources.UsersManagement.ModalDomainSaveButton}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;
  const { usersState } = store;

  return {
    managementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    Language: appState.Language,
    resources: appState.Resources[appState.Language],
  };
};

export default SetupDomains = connect(mapStateToProps)(SetupDomains);