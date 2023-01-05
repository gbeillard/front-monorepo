import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import _ from 'underscore';
import toastr from 'toastr';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { withRouter } from '../../Utils/withRouter';
import * as UsersApi from '../../Api/UsersApi.js';
import * as Utils from '../../Utils/utils.js';
import SetupDomains from './SetupDomains.jsx';
import SelectedPanelMenu from './SelectedPanelMenu.jsx';
import AutocompleteUser from './AutocompleteUser.jsx';
import { API_URL } from '../../Api/constants';
import UsersInvitationsAPI from '../../Reducers/Users/Invitations/api';
// material ui calls

// material ui icons
import store from '../../Store/Store';

import { fetchInvitations } from '../../Reducers/Users/Invitations/actions';

let ManageUsers = createReactClass({
  getInitialState() {
    return {
      // invite mails
      mailListToAdd: [],
      isOkSendMail: false,
    };
  },

  componentDidMount() {
    const self = this;
    window.addEventListener(
      'keyup',
      (e) => {
        if (e.keyCode == 27) {
          self.closeInviteScreen();
          self.closeDomainsScreen();
        }
      },
      false
    );
  },

  componentWillUnmount() {
    $('.modal-backdrop').remove();
    window.removeEventListener(
      'keyup',
      (e) => {
        if (e.keyCode == 27) {
          self.closeInviteScreen();
          self.closeDomainsScreen();
        }
      },
      false
    );
  },

  // invite new member screen ///////////////////////////////////
  splashScreenInvitation() {
    const screenClass = 'modal fade smallSideMenu';
    $('#InviteScreen').removeClass().addClass(screenClass);
    $('#InviteFirstStep').removeClass('hidden');
    $('#InviteScreen').modal('show');
  },

  closeInviteScreen() {
    // clear mails list && restore default values
    this.setState({ mailListToAdd: [] });
    this.singleEmailInvite.value = '';
    this.props.fetchInvitations();
    $('#InviteScreen').modal('hide');
    $('.modal-backdrop').remove();
    $('#InviteScreenClosing').removeClass().addClass('hidden');
    this.forceUpdate();
  },

  closeDomainsScreen() {
    // clear domain input
    this.domainNameToAdd.value = '';
    $('#SetupDomains').modal('hide');
  },

  popsuccessfullScreen() {
    $('#InviteFirstStep').addClass('hidden');

    $('#InviteScreenClosing')
      .removeClass()
      .addClass('invitation-body zoomIn animated')
      .one(
        'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
        function () {
          $(this).removeClass('zoomIn animated');
        }
      );
  },

  addMailToMailListToAdd(event) {
    const self = this;
    const inputValue = this.singleEmailInvite.value.replace(/\s/g, '');

    if (inputValue != '') {
      const mailsListToAdd = inputValue.split(';');
      const actualMailList = this.state.mailListToAdd;
      const self = this;

      if (mailsListToAdd[0] != '') {
        _.each(mailsListToAdd, (mail, i) => {
          // check mail validity
          if (!Utils.validateEmail(mail)) {
            toastr.error(`${self.props.resources.UsersManagement.AddMailInvalid} ${mail}`);
            return;
          }

          // check if already in maillist
          const checkMailInList = actualMailList.findIndex((m) => m.UserMail == mail);
          if (checkMailInList > -1) {
            toastr.error(`${self.props.resources.UsersManagement.AddMailAlreadyInList} ${mail}`);
            return;
          }

          const mailToPush = { UserMail: mail };
          actualMailList.push(mailToPush);
          self.setState({ mailListToAdd: actualMailList });
          self.singleEmailInvite.value = '';
        });
        self.setMailsRequestDetails();
      }
    }

    self.singleEmailInvite.focus();
  },

  setMailsRequestDetails() {
    const self = this;
    const mailListToImprove = this.state.mailListToAdd;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/users/mails/details?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mailListToImprove),
      }
    )
      .then((response) => response.json())
      .then((json) => {
        _.each(mailListToImprove, (mail, i) => {
          const userInfo = json.find((m) => m.UserMail == mail.UserMail);
          if (userInfo != null && userInfo.IsAlreadyMember === true) {
            self.state.isOkSendMail = false;
            toastr.error(
              `${self.props.resources.UsersManagement.AddUserAlreadyMember} ${mail.UserMail}`
            );
          }
        });
        self.setState({ mailListToAdd: json });
      });
  },

  handleKeyPressInviteMail(e) {
    if (e.key == 'Enter') {
      this.addMailToMailListToAdd();
    }
  },

  handleDeleteMail(event) {
    const mailToDelete = event.currentTarget.parentElement.dataset.mail;
    const actualMailList = this.state.mailListToAdd;
    const checkMailInList = actualMailList.findIndex((m) => m.UserMail == mailToDelete);

    if (checkMailInList > -1) {
      const newMailList = this.state.mailListToAdd;
      newMailList.splice(checkMailInList, 1);
      this.setState({ mailListToAdd: newMailList });
    }
  },

  sendEmailInvitations() {
    const mailList = this.state.mailListToAdd;
    const self = this;

    // send mail list
    const inputValue = self.singleEmailInvite.value.replace(/\s/g, '');

    if (inputValue != '' || mailList.length > 0) {
      const mailsListToAdd = inputValue.split(';');
      const actualMailList = this.state.mailListToAdd;
      const self = this;
      self.state.isOkSendMail = true;

      store.dispatch({ type: 'LOADER', state: true });

      _.each(mailsListToAdd, (mail, i) => {
        if (mail != '') {
          // check mail validity
          if (!Utils.validateEmail(mail)) {
            toastr.error(`${self.props.resources.UsersManagement.AddMailInvalid} ${mail}`);
            self.state.isOkSendMail = false;
            store.dispatch({ type: 'LOADER', state: false });
            return;
          }

          // check sended list
          if (actualMailList.findIndex((m) => m.UserMail == mail) > -1) {
            toastr.error(`${self.props.resources.UsersManagement.AddMailAlreadyInList} ${mail}`);
            self.state.isOkSendMail = false;
            store.dispatch({ type: 'LOADER', state: false });
            return;
          }

          const mailToPush = { UserMail: mail };
          actualMailList.push(mailToPush);
        }
      });

      self.state.mailListToAdd = actualMailList;
      self.setMailsRequestDetails();

      // send mails
      setTimeout(() => {
        if (self.state.isOkSendMail && mailList.length > 0) {
          const newInvitations = mailList?.map((invitation) => ({
            Email: invitation?.UserMail,
          }));

          UsersInvitationsAPI.send(
            self.props.Language,
            self.props.managementCloudId,
            newInvitations
          );
          self.popsuccessfullScreen();
          store.dispatch({ type: 'LOADER', state: false });
        } else {
          self.singleEmailInvite.value = '';
          store.dispatch({ type: 'LOADER', state: false });
        }
      }, 750);
    }
  },

  addUser(userId) {
    const self = this;
    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/group/${this.props.params.groupId}/addUser/${userId}?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    ).then((response) => {
      UsersApi.getGroupUsers(
        self.props.managementCloudId,
        self.props.params.groupId,
        self.props.TemporaryToken
      );
    });
  },

  // render ///////////////////////////////////
  render() {
    const self = this;

    const mailListToAdd = self.state.mailListToAdd.map((mail, i) => {
      const avatarPath =
        mail.UserAvatarPath != null ? mail.UserAvatarPath : mail.UserMail.substring(0, 1);
      const label =
        mail.UserFirstName != null ? `${mail.UserFirstName} ${mail.UserLastName}` : mail.UserMail;
      const adaptatedAvatar =
        mail.UserAvatarPath != null ? (
          <Avatar src={`${avatarPath}?width=30&height=30&scale=both`} />
        ) : (
          <Avatar>{avatarPath}</Avatar>
        );

      return (
        <Chip
          key={mail.UserMail}
          data-mail={mail.UserMail}
          avatar={adaptatedAvatar}
          label={label}
          onDelete={self.handleDeleteMail}
        />
      );
    });

    const groupId = this.props.params.groupId != null ? this.props.params.groupId : 0;

    return (
      <div className="manage-users">
        <div id="PrincipalScreen">
          <div className="row">
            <div className="cr-top">
              <nav className="navigation">
                <ul className="phases-tabs">
                  <li className="tab-classif active">
                    <button
                      type="button"
                      data-toggle="tab"
                      aria-expanded="true"
                      data-id="1"
                      onClick={self.changeUsersScreen}
                    >
                      {self.props.resources.UsersManagement.PageTitleMembers}
                    </button>
                    <div className="border-color" />
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <div className="col-sm-17 col-sm-offset-3">
            <div className="panel member-head">
              <div className="row">
                {groupId == 0 ? (
                  <div className="col-xs-11 text-center invitations">
                    <img height="100" src="/Content/images/AvionSimple.svg" />
                    <div className="text-details">
                      <h2 className="title">
                        {self.props.resources.UsersManagement.PageMemberInvitationsTitle}
                      </h2>
                      <p>{self.props.resources.UsersManagement.PageMemberInvitationsSpeech}</p>
                    </div>
                    <Button
                      variant="contained"
                      className="btn-raised member-buttons"
                      onClick={self.splashScreenInvitation}
                    >
                      {self.props.resources.UsersManagement.PageMemberInvitationsInviteButton}
                    </Button>
                  </div>
                ) : (
                  <div className="col-xs-11 text-center invitations">
                    <div className="text-details">
                      <h2 className="title">
                        {self.props.resources.UsersManagement.GroupAddPartner}
                      </h2>
                      <p>{self.props.resources.UsersManagement.PageMemberGroupAddSpeech}</p>
                    </div>
                    <AutocompleteUser addUser={this.addUser} />
                  </div>
                )}
                {groupId == 0 ? <SetupDomains /> : null}
              </div>
            </div>
            <SelectedPanelMenu />
          </div>
        </div>

        <div
          className="modal fade"
          id="InviteScreen"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <a data-toggle="modal" onClick={self.closeInviteScreen} className="close-invite">
            <img src="/Content/images/Croix.svg" />
          </a>
          <div id="basicMailInvitation" style={{ marginBottom: 0 }}>
            <div id="InviteFirstStep" className="invitation-body">
              <img src="/Content/images/AvionsMultiples.svg" />
              <div className="text-details text-center">
                <h2 className="title">
                  {self.props.resources.UsersManagement.ModalInvitationMainTitle}
                </h2>
                <div className="email-field">
                  <MailOutlineIcon />
                  <TextField
                    id="inviteSingleEmail"
                    placeholder={self.props.resources.UsersManagement.ModalInvitationInputText}
                    inputRef={(input) => {
                      self.singleEmailInvite = input;
                    }}
                    onKeyPress={self.handleKeyPressInviteMail}
                  />
                  <Button
                    color="primary"
                    className="btn-flat blue btn-reset"
                    onClick={self.addMailToMailListToAdd}
                  >
                    {self.props.resources.UsersManagement.ModalInvitationAddButton}
                  </Button>
                </div>
              </div>
              <div className="mails-chips">{mailListToAdd}</div>
              <div className="invite-send">
                <Button
                  variant="contained"
                  className="btn-raised grey"
                  onClick={self.sendEmailInvitations}
                >
                  {self.props.resources.UsersManagement.ModalInvitationSendButton}
                </Button>
              </div>
            </div>

            <div id="InviteScreenClosing" className="invitation-body hidden">
              <div id="cloudAnimationSaveInvitations">
                <img src="/Content/images/SuccessCloud.svg" />
                <div className="text-details">
                  <h2 className="title">
                    {self.props.resources.UsersManagement.ModalInvitationSuccessScreenTitle}
                  </h2>
                  <p>{self.props.resources.UsersManagement.ModalInvitationSuccessScreenSpeech}</p>
                </div>
                <div className="row success-button">
                  <Button
                    variant="contained"
                    className="btn-raised"
                    onClick={self.closeInviteScreen}
                  >
                    {self.props.resources.UsersManagement.ModalInvitationSuccessScreenOkButton}
                  </Button>
                </div>
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

  return {
    managementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    UserId: appState.UserId,
    Language: appState.Language,
    resources: appState.Resources[appState.Language],
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchInvitations: () => dispatch(fetchInvitations()),
});

export default ManageUsers = withRouter(connect(mapStateToProps, mapDispatchToProps)(ManageUsers));