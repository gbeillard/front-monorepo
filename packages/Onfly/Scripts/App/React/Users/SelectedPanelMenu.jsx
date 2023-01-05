import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import _ from 'underscore';
import { withRouter } from '../../Utils/withRouter';
import toastr from 'toastr';
import FlexSearch from 'flexsearch';

import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';

// material ui icons
import GroupIcon from '@material-ui/icons/Group';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import * as UsersApi from '../../Api/UsersApi.js';
import store from '../../Store/Store';
import { API_URL } from '../../Api/constants';

import { fetchInvitations } from '../../Reducers/Users/Invitations/actions';

import ProfileMenu from './ProfileMenu';

let SelectedPanelMenu = createReactClass({
  getInitialState() {
    return {
      currentPanelMenu: '1',
      membersManageList: [],

      // generals
      currentUserspage: '1',
      searchBarValue: '',
      searchTimeoutId: null,
      anchorElButtonViewProfile: null,

      // members
      membersPage: 0,
      membersSizePage: 10,
      memberKeyWord: '',
      allMembersChecked: false,
      memberOrderBy: '',
      memberOrder: 'asc',

      showMemberAvatar: true,
      userToRevoke: '',
      showMemeberSelector: true,
      newfilterMemberInput: '',

      // pending
      pendingPage: 0,
      pendingSizePage: 10,
      pendingKeyWord: '',
      totalpendings: 0,
      allPendingsChecked: false,
      pendingOrderBy: '',
      pendingOrder: 'asc',
      pendingManageListChecked: [],

      // request
      accessRequestList: [],
      requestsManageListChecked: [],
      allRequestsChecked: false,
      requestEmail: '',
      requestFname: '',
      requestLname: '',
      requestJobTitle: '',
      requestCity: '',

      // Profile menu
      profileMenu: {
        anchor: null,
        profile: null,
      },
    };
  },

  componentDidMount() {
    this.loadCurrentsMembers(
      this.state.memberKeyWord,
      this.state.membersSizePage,
      this.state.membersPage
    );
  },

  changeUsersScreen(event) {
    const usersScreenid = event.target.dataset.id;
    this.setState({ currentUserspage: usersScreenid });
  },

  changePanelMenu(panelMenuId) {
    switch (panelMenuId) {
      case '1':
        this.loadCurrentsMembers('', 10, 0);
        break;
      case '2':
        this.refreshInvitationList();
        break;
      case '3':
        this.refreshRequestList();
        break;
    }

    this.setState({
      currentPanelMenu: panelMenuId,
      membersPage: 0,
      membersSizePage: 10,
      searchBarValue: '',
    });
  },

  // members /////////////////////////////////
  loadCurrentsMembers(memberkeyWord, membersSizePage, membersPage) {
    if (memberkeyWord != '') {
      membersSizePage = 1000;
      membersPage = 0;
      if (this.state.showMemeberSelector == true) {
        this.setState({ showMemeberSelector: false });
      }
    } else if (memberkeyWord == '' && this.state.showMemeberSelector == false) {
      this.setState({ showMemeberSelector: true });
    }

    if (this.props.params.groupId != null) {
      UsersApi.getGroupUsers(
        this.props.managementCloudId,
        this.props.params.groupId,
        this.props.TemporaryToken,
        memberkeyWord,
        membersSizePage,
        membersPage + 1
      );
    } else {
      UsersApi.getUsers(
        this.props.managementCloudId,
        this.props.TemporaryToken,
        memberkeyWord,
        membersSizePage,
        membersPage + 1
      );
    }
  },

  setAccessToRevoke(event, profile) {
    if (profile?.User?.Id == null) {
      return false;
    }

    this.setState(
      {
        userToRevoke: profile.User.Id,
        profileMenu: {
          anchor: null,
        },
      },
      () => {
        $('#confirm-revoke-user').modal('show');
      }
    );
  },

  revokeAccessUser(event) {
    const self = this;
    const userId = self.state.userToRevoke;

    const memberIndex = this.props.MembersList.findIndex((id) => id.UserId.toString() == userId);

    if (memberIndex > -1) {
      if (this.props.params.groupId == null) {
        const user = [userId];
        fetch(
          `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/users/remove?token=${this.props.TemporaryToken}`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
          }
        ).then((response) => {
          if (response.status == 200) {
            toastr.success(self.props.resources.UsersManagement.RemoveSuccess);
            $('#confirm-revoke-user').modal('hide');
            self.loadCurrentsMembers(
              self.state.memberKeyWord,
              self.state.membersSizePage,
              self.state.membersPage
            );
          } else {
            toastr.error(self.props.resources.UsersManagement.RemoveError);
          }
        });
      } else {
        fetch(
          `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/group/${this.props.params.groupId}/removeUser/${userId}?token=${this.props.TemporaryToken}`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        ).then((response) => {
          if (response.status == 200) {
            toastr.success(self.props.resources.UsersManagement.RemoveSuccess);
            $('#confirm-revoke-user').modal('hide');
            UsersApi.getGroupUsers(
              self.props.managementCloudId,
              self.props.params.groupId,
              self.props.TemporaryToken
            );
          } else {
            toastr.error(self.props.resources.UsersManagement.RemoveError);
          }
        });
      }
    }
  },

  clearSearchBar() {
    this.setState({
      searchBarValue: '',
    });

    if (this.state.currentPanelMenu === '1') {
      this.loadCurrentsMembers('', 10, 0);
    }
  },

  memberRoleChange(event) {
    const userId = event.target.value.split('#')[1];
    const userRole = event.target.value.split('#')[0];

    const memberIndex = this.props.MembersList.findIndex((id) => id.UserId.toString() == userId);

    if (memberIndex > -1 && this.props.MembersList[memberIndex].UserRoleId.toString() != userRole) {
      const user = [];
      user.push({ UserId: userId, UserRoleId: userRole });
      UsersApi.changeUsersRole(
        this.props.managementCloudId,
        user,
        this.props.TemporaryToken,
        '',
        this.state.membersSizePage,
        this.state.membersPage + 1,
        this.props.resources
      );
    }
  },

  showMemberCheckBox(event) {
    const userId = event.target.dataset.id;
    const avatarToHide = `#avatar_${userId}`;
    const checkboxToShow = `#checkbox_${userId}`;

    $(avatarToHide).removeClass().addClass(' hidden');
    $(checkboxToShow).removeClass();
  },

  hideMemberCheckBox(event) {
    this.setState({ showMemberAvatar: true });
  },

  handleSelectAllClickMember(event, checked) {
    if (checked) {
      const self = this;
      const selectedUserList = [];

      _.each(this.props.MembersList, (user, i) => {
        if (self.props.UserId != user.UserId) {
          selectedUserList.push(user.UserId);
        }
      });

      this.setState({ membersManageList: selectedUserList, allMembersChecked: true });
      return;
    }
    this.setState({ membersManageList: [], allMembersChecked: false });
  },

  // invitations /////////////////////////////////
  refreshInvitationList() {
    this.props.fetchInvitations();
  },

  changeRoleInvitation(event) {
    const self = this;
    const invitId = event.target.value.split('#')[1];
    const roleId = event.target.value.split('#')[0];

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/invitations/edit?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ InvitId: invitId, RoleId: roleId }]),
      }
    ).then((response) => {
      if (response.status == 200) {
        self.refreshInvitationList();
        toastr.success(self.props.resources.UsersManagement.InvitationUpdateSuccess);
      } else {
        toastr.error(self.props.resources.UsersManagement.InvitationUpdateError);
      }
    });
  },

  handleClickPending(event, id) {
    const selected = this.state.pendingManageListChecked;
    const selectedIndex = selected.findIndex((i) => i.Id == event.target.id);
    let newSelected = [];

    if (selectedIndex === -1) {
      const pendingToAdd = this.props.UsersInvitationsList.findIndex(
        (i) => i.Id == event.target.id
      );
      newSelected = newSelected.concat(selected, this.props.UsersInvitationsList[pendingToAdd]);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    let allchecked = false;
    if (newSelected.length.toString() == this.props.UsersInvitationsList.length.toString()) {
      allchecked = true;
    }

    this.setState({ pendingManageListChecked: newSelected, allPendingsChecked: allchecked });
  },

  handleSelectAllClickPending(event, checked) {
    if (checked) {
      this.setState({
        pendingManageListChecked: this.props.UsersInvitationsList.map((n) => n),
        allPendingsChecked: true,
      });
      return;
    }
    this.setState({ pendingManageListChecked: [], allPendingsChecked: false });
  },

  resendActivationMailButton(event) {
    const currentPendingList = this.props.UsersInvitationsList;
    const selectedIndex = currentPendingList.findIndex(
      (i) => i.Id == event.target.parentElement.dataset.id
    );
    if (selectedIndex > -1) {
      this.resendActivationMail(currentPendingList[selectedIndex]);
    }
  },

  unselectAllPendings() {
    this.setState({ pendingManageListChecked: [], allPendingsChecked: false });
  },

  resendActivationMail(typeSend) {
    let invitationsToResend = [];
    const self = this;

    // resend by button
    if (typeSend.Email != undefined) {
      invitationsToResend.push(typeSend);
    }
    // resend by list
    else {
      invitationsToResend = this.state.pendingManageListChecked;
    }

    store.dispatch({ type: 'LOADER', state: true });

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/invitation/resend/list?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invitationsToResend),
      }
    ).then((response) => {
      store.dispatch({ type: 'LOADER', state: false });

      if (response.status == 200) {
        toastr.success(self.props.resources.UsersManagement.InvitationResendSuccess);
        self.setState({ pendingManageListChecked: [], allPendingsChecked: false });
      } else {
        toastr.error(self.props.resources.UsersManagement.InvitationResendError);
      }
    });
  },

  removeActivationMail(event, invitation) {
    const self = this;
    let invitationsToRemove = this.state.pendingManageListChecked;
    store.dispatch({ type: 'LOADER', state: true });

    if (invitation) {
      invitationsToRemove = [invitation];
    }

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/invitation/remove/list?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invitationsToRemove),
      }
    ).then((response) => {
      store.dispatch({ type: 'LOADER', state: false });

      if (response.status == 200) {
        toastr.success(self.props.resources.UsersManagement.InvitationRemoveSuccess);
        self.setState({
          pendingManageListChecked: [],
          allPendingsChecked: false,
          profileMenu: {
            anchor: null,
            profile: null,
          },
        });
        self.refreshInvitationList();
      } else {
        toastr.error(self.props.resources.UsersManagement.InvitationRemoveError);
      }
    });
  },

  // requests ///////////////////////////////////
  refreshRequestList() {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/user/onflyaccessrequest/list?token=${this.props.TemporaryToken}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
        toastr.error(self.props.resources.UsersManagement.RequestListError);
      })
      .then((json) => {
        self.setState({ accessRequestList: json });
      });
  },

  handleClickRequest(event, id) {
    const selected = this.state.requestsManageListChecked;
    const selectedIndex = selected.findIndex(
      (i) => i.RequestId.toString() == event.target.id.toString()
    );
    let newSelected = [];

    if (selectedIndex === -1) {
      const requestToAdd = this.state.accessRequestList.findIndex(
        (i) => i.RequestId.toString() == event.target.id.toString()
      );
      newSelected = newSelected.concat(selected, this.state.accessRequestList[requestToAdd]);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    let allchecked = false;
    if (newSelected.length.toString() == this.state.accessRequestList.length.toString()) {
      allchecked = true;
    }

    this.setState({ requestsManageListChecked: newSelected, allRequestsChecked: allchecked });
  },

  handleSelectAllClickRequests(event, checked) {
    if (checked) {
      this.setState({
        requestsManageListChecked: this.state.accessRequestList.map((n) => n),
        allRequestsChecked: true,
      });
      return;
    }
    this.setState({ requestsManageListChecked: [], allRequestsChecked: false });
  },

  openProfileMenu(event, profile) {
    this.setState({
      profileMenu: {
        anchor: event?.currentTarget,
        profile,
      },
    });
  },

  closeProfileMenu() {
    this.openProfileMenu(null, null);
  },

  setDetailsProfile(event, request) {
    if (request == null) {
      return;
    }

    const profile = {
      Id: request.RequestId,
      Email: request.RequestEmail,
      User: {
        FirstName: request.RequestFirstName,
        LastName: request.RequestLastName,
        City: request.RequestCity,
        Job: request.RequestJob,
      },
    };

    this.openProfileMenu(event, profile);
  },

  unselectAllRequesters() {
    this.setState({ requestsManageListChecked: [], allRequestsChecked: false });
  },

  denyAccess(event, request) {
    const self = this;
    let requestsToDelete = [];
    const revokeByList = self.state.requestsManageListChecked;
    const requestId = request?.Id;

    if (requestId != undefined && requestId != '') {
      requestsToDelete = [requestId];
    } else {
      _.each(revokeByList, (revoke, i) => {
        requestsToDelete.push(revoke.RequestId);
      });
    }

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${self.props.managementCloudId}/user/onflyaccessrequest/reject?token=${self.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestsToDelete),
      }
    ).then((response) => {
      if (response.status == 200) {
        self.closeProfileMenu();
        self.refreshRequestList();
        toastr.success(self.props.resources.UsersManagement.RequestDeleteSuccess);
      } else {
        toastr.error(self.props.resources.UsersManagement.RequestDeleteError);
      }
    });
  },

  allowAccess(event, request) {
    const self = this;
    let requestsToAllow = [];
    const allowByList = self.state.requestsManageListChecked;
    const requestId = request?.Id;

    if (requestId != undefined && requestId != '') {
      requestsToAllow = [requestId];
    } else {
      _.each(allowByList, (allow, i) => {
        requestsToAllow.push(allow.RequestId);
      });
    }

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${self.props.managementCloudId}/user/onflyaccessrequest/accept?token=${self.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestsToAllow),
      }
    ).then((response) => {
      if (response.status == 200) {
        self.closeProfileMenu();
        self.refreshRequestList();
        toastr.success(self.props.resources.UsersManagement.RequestAllowedSuccess);
        return;
      }
      toastr.error(self.props.resources.UsersManagement.RequestAllowedError);
    });
  },

  handleMemberChangePage(event, page) {
    this.setState({ membersPage: page });
    this.loadCurrentsMembers(this.state.memberKeyWord, this.state.membersSizePage, page);
  },

  handleMemberChangeRowsPerPage(event, page) {
    this.setState({ membersSizePage: event.target.value });
    this.loadCurrentsMembers(this.state.memberKeyWord, event.target.value, this.state.membersPage);
  },

  handleOnchangeSearch(event) {
    const self = this;
    const { value } = event.currentTarget;

    this.setState({
      searchBarValue: value,
    });

    if (self.state.currentPanelMenu === '1') {
      if (this.state.searchTimeoutId !== null) {
        clearTimeout(this.state.searchTimeoutId);
      }

      this.state.searchTimeoutId = setTimeout(() => {
        self.loadCurrentsMembers(
          self.state.searchBarValue,
          self.state.membersSizePage,
          self.state.membersPage
        );
      }, 500);
    }
  },

  searchUsers(users, search, fieldId, fieldsName = []) {
    if (!search || search.trim() === '') {
      return users;
    }

    const index = new FlexSearch({
      encode: 'advanced',
      tokenize: 'full',
      doc: {
        id: fieldId,
        field: fieldsName,
      },
    });

    index.add(users);

    let searchItems = [];

    fieldsName?.forEach((fieldName) => {
      const searchItemsInField = search.split(/\s/).map((keyword) => ({
        bool: 'or',
        query: keyword,
        field: fieldName,
      }));

      searchItems = searchItems.concat(searchItemsInField);
    });

    return index.search(searchItems);
  },

  unselectAllMembers() {
    this.setState({ membersManageList: [], allMembersChecked: false });
    this.forceUpdate();
  },

  selectedMembersRoleChange(event) {
    const self = this;

    if (self.state.membersManageList.length < 1) {
      return;
    }

    const UserRoleId = event.target.value;
    const users = self.state.membersManageList.map((UserId) => ({ UserId, UserRoleId }));
    UsersApi.changeUsersRole(
      self.props.managementCloudId,
      users,
      self.props.TemporaryToken,
      '',
      10,
      1,
      self.props.resources
    );
    self.setState({ membersManageList: [], allMembersChecked: false });
  },

  handleClickMember(event, id) {
    const selected = this.state.membersManageList;
    const selectedIndex = selected.indexOf(event.target.id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, event.target.id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    let allchecked = false;
    if (newSelected.length.toString() == this.props.MembersList.length.toString()) {
      allchecked = true;
    }

    this.setState({ membersManageList: newSelected, allMembersChecked: allchecked });
  },

  render() {
    const self = this;

    let content;
    let toolBar;
    let searchInputField;
    const groupId = this.props.params.groupId != null ? this.props.params.groupId : 0;

    // Profile menu settings
    let profileMenuSettings = {
      title: self.props.resources.UsersManagement.Profile,
      primaryAction: {
        label: '',
        onClick: null,
      },
      secondaryAction: {
        label: self.props.resources.MetaResource.Close,
        onClick: self.closeProfileMenu,
      },
    };

    if (this.state.currentPanelMenu == '1') {
      // roles
      const membersRolesList = _.map(self.props.Roles, (objectRole, i) => (
        <MenuItem value={objectRole.RoleId} key={objectRole.RoleId}>
          {objectRole.RoleName}
        </MenuItem>
      ));

      // header title
      const memberHeaderTitle = (
        <h3 className="table-title">{self.props.resources.UsersManagement.MembersTitle}</h3>
      );

      // header toolbar
      const memberTableToolbar = (
        <Toolbar className="user-selected">
          <div className="user-selected-left">
            <Typography variant="h3">
              {self.props.resources.UsersManagement.MembersNumberSelected}{' '}
              {self.state.membersManageList.length}
            </Typography>
            <FormControl>
              <Select
                className="role-cell"
                value=""
                onChange={self.selectedMembersRoleChange}
                displayEmpty
                disableUnderline
              >
                <MenuItem value="" disabled>
                  {self.props.resources.UsersManagement.UsersChangeRole}
                </MenuItem>
                {membersRolesList}
              </Select>
            </FormControl>
          </div>
          <div className="revoke" style={{ cursor: 'pointer' }} onClick={self.unselectAllMembers} />
        </Toolbar>
      );

      // table header
      const columnData = [
        {
          id: 'MemberName',
          numeric: false,
          label: self.props.resources.UsersManagement.MembersName,
          sortable: true,
        },
        { id: 'ViewProfile', numeric: false, sortable: false },
        { id: 'RevokeAccess', numeric: false, sortable: false },
      ];

      if (groupId <= 0) {
        columnData.push({
          id: 'MemberRole',
          numeric: false,
          label: self.props.resources.UsersManagement.MembersRole,
          sortable: true,
        });
      }

      const membersTableHead = _.map(columnData, (column, i) => {
        const orderByState = self.state.memberOrderBy == column.id;

        return (
          <TableCell
            key={column.id}
            sortdirection={orderByState ? self.state.memberOrder : ''}
            className={column.classname}
          >
            <TableSortLabel data-id={column.id} hideSortIcon={!column.sortable}>
              <span className="ellipsis">{column.label}</span>
            </TableSortLabel>
          </TableCell>
        );
      });

      // table body
      const membersTableBody = _.map(self.props.MembersList, (object, i) => {
        const UserName = `${object.UserFirstName} ${object.UserLastName}`;
        const isChecked = self.state.membersManageList.indexOf(object.UserId) > -1;
        const avatarId = `avatar_${object.UserId}`;
        const checkBoxId = `checkbox_${object.UserId}`;
        const memberRoles = _.map(self.props.Roles, (objectRole, i) => (
          <MenuItem
            value={`${objectRole.RoleId}#${object.UserId}`}
            key={`${objectRole.RoleId}#${object.UserId}`}
          >
            {objectRole.RoleName}
          </MenuItem>
        ));

        let avatarClass = groupId == 0 ? 'user-avatar' : 'user-avatar-forced';
        let checkboxAvatar = 'user-checkbox';
        if (isChecked && groupId == 0) {
          avatarClass = 'user-avatar-checked';
          checkboxAvatar = 'user-checkbox-checked';
        }

        const profile = {
          Email: object.UserEmail,
          User: {
            Id: object.UserId,
            FirstName: object.UserFirstName,
            LastName: object.UserLastName,
            City: object.City,
            Job: object.Job,
          },
        };

        let suppressButton;
        if (self.props.UserId != object.UserId) {
          suppressButton = (
            <Button
              className="btn-second"
              style={{ width: '100%' }}
              onClick={(event) => self.setAccessToRevoke(event, profile)}
            >
              {self.props.resources.UsersManagement.MemberRevokeAccess}
            </Button>
          );
        }

        return (
          <TableRow id={i} key={i}>
            <TableCell padding="checkbox" style={{ width: '5%' }} data-id={object.UserId}>
              <div className="avatar-cell">
                <div id={avatarId} className={avatarClass}>
                  <Avatar src={`${object.UserAvatar}?width=30&height=30&scale=both`} />
                </div>
                <div id={checkBoxId} className={checkboxAvatar}>
                  {groupId == 0 ? (
                    <Checkbox
                      id={object.UserId.toString()}
                      checked={isChecked}
                      onChange={self.handleClickMember}
                      color="primary"
                      disabled={self.props.UserId == object.UserId}
                    />
                  ) : null}
                </div>
              </div>
            </TableCell>
            <TableCell
              className="col-name"
              title={object.RequestObjectDescription}
              style={{ width: '50%' }}
            >
              {' '}
              {UserName}{' '}
            </TableCell>
            <TableCell style={{ width: '15%' }}>
              {self.props.UserId != object.UserId && (
                <Button onClick={(event) => self.openProfileMenu(event, profile)}>
                  {self.props.resources.UsersManagement.AccessRequestSeeProfile}
                </Button>
              )}
            </TableCell>
            <TableCell className="col-access" style={{ width: '15%' }}>
              {suppressButton}
            </TableCell>
            {groupId == 0 ? (
              <TableCell className="col-role" style={{ width: '15%' }} data-userid={object.UserId}>
                <Select
                  id="memberRole"
                  className="role-cell"
                  value={`${object.UserRoleId}#${object.UserId}`}
                  onChange={self.memberRoleChange}
                  disableUnderline
                  disabled={self.props.UserId == object.UserId}
                >
                  {memberRoles}
                </Select>
              </TableCell>
            ) : null}
          </TableRow>
        );
      });

      let tablePaginationDisplay;

      const separatorResource = self.props.resources.UsersManagement.MemberPaginationSeparator;

      if (self.state.showMemeberSelector == true) {
        tablePaginationDisplay = (
          <TablePagination
            colSpan={6}
            count={self.props.MembersListCount}
            rowsPerPage={self.state.membersSizePage}
            labelRowsPerPage={self.props.resources.UsersManagement.UserListRowsLabel}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} ${separatorResource}  ${count}`
            }
            page={self.state.membersPage}
            backIconButtonProps={{ 'aria-label': 'Previous Page' }}
            nextIconButtonProps={{ 'aria-label': 'Next Page' }}
            onChangePage={self.handleMemberChangePage}
            onChangeRowsPerPage={self.handleMemberChangeRowsPerPage}
            className="users-pagination"
          />
        );
      }

      profileMenuSettings = {
        ...profileMenuSettings,
        primaryAction: {
          label: self.props.resources.UsersManagement.MemberRevokeAccess,
          onClick: self.setAccessToRevoke,
        },
      };

      toolBar = self.state.membersManageList.length > 0 ? memberTableToolbar : memberHeaderTitle;

      content = (
        <Table className="manageUsersTable">
          <TableHead style={{ width: '100%' }}>
            <TableRow>
              <TableCell padding="checkbox">
                {groupId == 0 ? (
                  <Checkbox
                    color="primary"
                    checked={self.state.allMembersChecked}
                    indeterminate={
                      !self.state.allMembersChecked && self.state.membersManageList?.length > 0
                    }
                    onChange={self.handleSelectAllClickMember}
                  />
                ) : null}
              </TableCell>
              {membersTableHead}
            </TableRow>
          </TableHead>
          <TableBody>{membersTableBody}</TableBody>
          <TableFooter>
            <TableRow>{tablePaginationDisplay}</TableRow>
          </TableFooter>
        </Table>
      );
    } else if (self.state.currentPanelMenu == '2') {
      // header title
      const pendingHeaderTitle = (
        <h3 className="table-title">
          {self.props.resources.UsersManagement.PendingInvitationsTitle}
        </h3>
      );

      // header toolbar
      const pendingTableToolbar = (
        <Toolbar className="user-selected">
          <div className="user-selected-left">
            <Typography variant="h3">
              {self.props.resources.UsersManagement.PendingInvitationsSelected}{' '}
              {self.state.pendingManageListChecked.length}
            </Typography>
            <div>
              <Button className="btn-flat" onClick={self.resendActivationMail}>
                {self.props.resources.UsersManagement.PendingInvitationsResendSelected}
              </Button>
              <Button className="btn-flat" onClick={self.removeActivationMail}>
                {self.props.resources.UsersManagement.PendingInvitationsRemoveSelected}
              </Button>
            </div>
          </div>
          <div
            className="revoke"
            style={{ cursor: 'pointer' }}
            onClick={self.unselectAllPendings}
          />
        </Toolbar>
      );

      // table header
      const columnData = [
        {
          id: 'MemberMail',
          numeric: false,
          label: self.props.resources.UsersManagement.PendingInvitationsEmail,
          sortable: true,
        },
        { id: 'ViewProfile', numeric: false, sortable: false },
        { id: 'ResendInvitation', numeric: false, sortable: false },
        {
          id: 'MemberRole',
          numeric: false,
          label: self.props.resources.UsersManagement.PendingInvitationsRole,
          sortable: true,
        },
      ];

      const pendingTableHead = _.map(columnData, (column, i) => {
        const orderByState = self.state.pendingOrderBy == column.id;

        return (
          <TableCell
            key={column.id}
            sortdirection={orderByState ? self.state.pendingOrder : ''}
            className={column.classname}
          >
            <TableSortLabel data-id={column.id} hideSortIcon={!column.sortable}>
              <span className="ellipsis">{column.label}</span>
            </TableSortLabel>
          </TableCell>
        );
      });

      // table body
      // Search fields
      const fieldsName = ['Email', 'User:FirstName', 'User:LastName'];

      const usersInvitationsListForSearch = self.props.UsersInvitationsList?.map(
        (userInvitation) => ({
          ...userInvitation,
          User: userInvitation?.User ?? {},
        })
      );

      const usersInvitationsList = self.searchUsers(
        usersInvitationsListForSearch,
        self.state.searchBarValue,
        'Id',
        fieldsName
      ); // Apply search

      const pendingTableBody = _.map(usersInvitationsList, (object, i) => {
        const pendingRoles = _.map(self.props.Roles, (objectRole, i) => (
          <MenuItem
            value={`${objectRole.RoleId}#${object.Id}`}
            key={`${objectRole.RoleId}#${object.Id}`}
          >
            {objectRole.RoleName}
          </MenuItem>
        ));

        const isChecked =
          self.state.pendingManageListChecked.findIndex((i) => i.Id == object.Id.toString()) > -1;
        const avatarId = `avatar_${object.Id}`;
        const checkBoxId = `checkbox_${object.Id}`;
        let avatarClass = 'user-avatar';
        let checkboxAvatar = 'user-checkbox';
        if (isChecked) {
          avatarClass = 'user-avatar-checked';
          checkboxAvatar = 'user-checkbox-checked';
        }

        if (object.User?.Avatar == null) {
          avatarClass = 'user-avatar-checked';
          checkboxAvatar = 'user-checkbox-checked';
        }

        const memberIdentification =
          object.User?.FirstName != null
            ? `${object.User.FirstName} ${object.User.LastName} : ${object.Email}`
            : object.Email;

        return (
          <TableRow key={i}>
            <TableCell padding="checkbox" style={{ width: '5%' }}>
              <div className="avatar-cell">
                <div id={avatarId} className={avatarClass}>
                  <Avatar src={`${object.User?.Avatar}?width=30&height=30&scale=both`} />
                </div>
                <div id={checkBoxId} className={checkboxAvatar}>
                  <Checkbox
                    color="primary"
                    id={object.Id.toString()}
                    checked={isChecked}
                    onChange={self.handleClickPending}
                  />
                </div>
              </div>
            </TableCell>
            <TableCell className="col-email" style={{ width: '50%' }}>
              {memberIdentification}
            </TableCell>
            <TableCell style={{ width: '15%' }}>
              <Button onClick={(event) => self.openProfileMenu(event, object)}>
                {self.props.resources.UsersManagement.AccessRequestSeeProfile}
              </Button>
            </TableCell>
            <TableCell className="col-resend" style={{ width: '15%' }}>
              <Button
                className="btn-second"
                style={{ width: '100%' }}
                data-id={object.Id}
                onClick={self.resendActivationMailButton}
              >
                {self.props.resources.UsersManagement.PendingInvitationResend}
              </Button>
            </TableCell>
            <TableCell className="col-role" style={{ width: '15%' }}>
              <Select
                className="role-cell"
                value={`${object.Role?.Id}#${object.Id}`}
                onChange={self.changeRoleInvitation}
                disableUnderline
              >
                {pendingRoles}
              </Select>
            </TableCell>
          </TableRow>
        );
      });

      profileMenuSettings = {
        ...profileMenuSettings,
        primaryAction: {
          label: self.props.resources.UsersManagement.DeleteInvitation,
          onClick: self.removeActivationMail,
        },
      };

      toolBar =
        self.state.pendingManageListChecked.length > 0 ? pendingTableToolbar : pendingHeaderTitle;

      content = (
        <Table className="pendingUsersTable">
          <TableHead style={{ width: '100%' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={self.state.allPendingsChecked}
                  indeterminate={
                    !self.state.allPendingsChecked &&
                    self.state.pendingManageListChecked?.length > 0
                  }
                  onChange={self.handleSelectAllClickPending}
                />
              </TableCell>
              {pendingTableHead}
            </TableRow>
          </TableHead>
          <TableBody>{pendingTableBody}</TableBody>
        </Table>
      );
    } else if (self.state.currentPanelMenu == '3') {
      // header title
      const requestHeaderTitle = (
        <h3 className="table-title">{self.props.resources.UsersManagement.AccessRequestTitle}</h3>
      );

      // header toolbar
      const requestTableToolbar = (
        <Toolbar className="user-selected">
          <div className="user-selected-left">
            <Typography variant="h3">
              {self.props.resources.UsersManagement.AccessRequestSelected}{' '}
              {self.state.requestsManageListChecked.length}
            </Typography>
            <div>
              <Button className="btn-flat" onClick={self.allowAccess}>
                {self.props.resources.UsersManagement.AccessRequestAcceptSelected}
              </Button>
              <Button className="btn-flat" onClick={self.denyAccess}>
                {self.props.resources.UsersManagement.AccessRequestRejectSelected}
              </Button>
            </div>
          </div>
          <div
            className="revoke"
            style={{ cursor: 'pointer' }}
            onClick={self.unselectAllRequesters}
          />
        </Toolbar>
      );

      // table header
      const columnData = [
        {
          id: 'RequestName',
          numeric: false,
          label: self.props.resources.UsersManagement.AccessRequestName,
        },
        { id: 'RequestDetails', numeric: false, sortable: false },
      ];

      const requestTableHead = _.map(columnData, (column, i) => (
        <TableCell key={column.id} className={column.classname}>
          <TableSortLabel data-id={column.id} hideSortIcon={!column.sortable}>
            <span className="ellipsis">{column.label}</span>
          </TableSortLabel>
        </TableCell>
      ));

      // table body
      // Search fields
      const fieldsName = ['RequestFirstName', 'RequestLastName'];

      const accessRequestList = self.searchUsers(
        self.state.accessRequestList,
        self.state.searchBarValue,
        'RequestId',
        fieldsName
      ); // Apply search

      const requestTableBody = _.map(accessRequestList, (object, i) => {
        const isChecked =
          self.state.requestsManageListChecked.findIndex(
            (i) => i.RequestId.toString() == object.RequestId.toString()
          ) > -1;
        const displayNameRequest = `${object.RequestFirstName} ${object.RequestLastName}`;

        return (
          <TableRow key={i}>
            <TableCell padding="checkbox" style={{ width: '5%' }}>
              <div className="avatar-cell">
                <div className="user-checkbox-checked">
                  <Checkbox
                    color="primary"
                    id={object.RequestId.toString()}
                    checked={isChecked}
                    onChange={self.handleClickRequest}
                  />
                </div>
              </div>
            </TableCell>

            <TableCell className="col-email" style={{ width: '75%' }}>
              {displayNameRequest}
            </TableCell>

            <TableCell className="col-role" style={{ width: '20%' }}>
              <Button onClick={(event) => self.setDetailsProfile(event, object)}>
                {self.props.resources.UsersManagement.AccessRequestSeeProfile}
              </Button>
            </TableCell>
          </TableRow>
        );
      });

      profileMenuSettings = {
        ...profileMenuSettings,
        title: self.props.resources.UsersManagement.AccessRequestBoardingPass,
        primaryAction: {
          label: self.props.resources.UsersManagement.AccessRequestAllow,
          onClick: self.allowAccess,
        },
        secondaryAction: {
          label: self.props.resources.UsersManagement.AccessRequestDeny,
          onClick: self.denyAccess,
        },
      };

      toolBar =
        self.state.requestsManageListChecked.length > 0 ? requestTableToolbar : requestHeaderTitle;

      content = (
        <Table className="requestUsersTable">
          <TableHead style={{ width: '100%' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={self.state.allRequestsChecked}
                  indeterminate={
                    !self.state.allRequestsChecked &&
                    self.state.requestsManageListChecked?.length > 0
                  }
                  onChange={self.handleSelectAllClickRequests}
                />
              </TableCell>
              {requestTableHead}
            </TableRow>
          </TableHead>
          <TableBody>{requestTableBody}</TableBody>
        </Table>
      );
    }

    let searchBarIcon = <SearchIcon />;

    if (self.state.searchBarValue !== '') {
      searchBarIcon = <CloseIcon onClick={self.clearSearchBar} />;
    }

    searchInputField = (
      <div className="member-search-div">
        <TextField
          placeholder={self.props.resources.UsersManagement.UsersSearch}
          id="filtermemberinput"
          value={self.state.searchBarValue}
          onChange={self.handleOnchangeSearch}
        />
        {searchBarIcon}
      </div>
    );

    return (
      <div className="panel members-menu">
        <div className="row">
          <nav className="navigation">
            <ul className="phases-tabs">
              <li className="tab-classif col-xs-6 active">
                <button
                  type="button"
                  data-toggle="tab"
                  aria-expanded="true"
                  onClick={() => self.changePanelMenu('1')}
                >
                  <GroupIcon className="user-tab active" />
                  <span>{self.props.resources.UsersManagement.PageMemberMenuMembers}</span>
                  <div className="border-color" />
                </button>
              </li>
              {groupId == 0 ? (
                <li className="tab-classif col-xs-6">
                  <button
                    type="button"
                    data-toggle="tab"
                    aria-expanded="true"
                    onClick={() => self.changePanelMenu('2')}
                  >
                    <QueryBuilderIcon className="user-tab" />
                    <span>
                      {self.props.resources.UsersManagement.PageMemberMenuPendingInvitations}
                    </span>
                    <div className="border-color" />
                  </button>
                </li>
              ) : null}
              {groupId == 0 ? (
                <li className="tab-classif col-xs-6">
                  <button
                    type="button"
                    data-toggle="tab"
                    aria-expanded="true"
                    onClick={() => self.changePanelMenu('3')}
                  >
                    <VerifiedUserIcon className="user-tab" />
                    <span>{self.props.resources.UsersManagement.PageMemberMenuAccessRequests}</span>
                    <div className="border-color" />
                  </button>
                </li>
              ) : null}
            </ul>
            <div id="member-search-container">{searchInputField}</div>
          </nav>
        </div>
        <div className="panel-table-head">{toolBar}</div>
        {content}
        <div
          className="modal fade"
          id="confirm-revoke-user"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {self.props.resources.UsersManagement.PageMemberRevokeAccessTitle}
                </h4>
                <CloseIcon className="close" data-toggle="modal" data-dismiss="modal" />
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <div className="row" />
                  <div className="row">
                    <div className="col-xs-11 text-center">
                      <a onClick={self.revokeAccessUser}>
                        <img
                          src="/Content/images/AccepterLaRequete.svg"
                          width="98"
                          height="98"
                          alt=""
                        />
                        <span>
                          {self.props.resources.UsersManagement.PageMemberRevokeAccessConfirm}
                        </span>
                      </a>
                    </div>
                    <div className="col-xs-11 col-xs-offset-1 text-center">
                      <a data-dismiss="modal" aria-label="Close">
                        <img
                          src="/Content/images/RejeterLaRequete.svg"
                          width="98"
                          height="98"
                          alt=""
                        />
                        <span>
                          {self.props.resources.UsersManagement.PageMemberRevokeAccessCancel}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ProfileMenu
          title={profileMenuSettings.title}
          profile={self.state.profileMenu.profile}
          anchorEl={self.state.profileMenu.anchor}
          primaryActionLabel={profileMenuSettings.primaryAction.label}
          secondaryActionLabel={profileMenuSettings.secondaryAction.label}
          onClose={self.closeProfileMenu}
          onClickPrimaryAction={profileMenuSettings.primaryAction.onClick}
          onClickSecondaryAction={profileMenuSettings.secondaryAction.onClick}
        />
      </div>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;
  const { usersState } = store;

  return {
    MembersList: usersState.MembersList,
    MembersListCount: usersState.MembersListCount,
    UsersInvitationsList: usersState.UsersInvitationsList,
    managementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    Roles: appState.Roles[appState.Language],
    UserId: appState.UserId,
    Language: appState.Language,
    resources: appState.Resources[appState.Language],
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchInvitations: () => dispatch(fetchInvitations()),
});

export default SelectedPanelMenu = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SelectedPanelMenu)
);