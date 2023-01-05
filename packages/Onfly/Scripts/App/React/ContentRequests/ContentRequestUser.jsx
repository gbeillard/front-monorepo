import React from 'react';
import createReactClass from 'create-react-class';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import toastr from 'toastr';
import _ from 'underscore';

import moment from 'moment';

// material ui calls
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Avatar from '@material-ui/core/Avatar';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';

// material ui icons
import AddIcon from '@material-ui/icons/Add.js';
import NoteAddIcon from '@material-ui/icons/NoteAdd.js';
import ReplyIcon from '@material-ui/icons/Reply.js';
import MessageIcon from '@material-ui/icons/Message.js';
import CloseIcon from '@material-ui/icons/Close.js';
import PersonIcon from '@material-ui/icons/Person.js';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight.js';
import SendIcon from '@material-ui/icons/Send.js';
import ContentRequest from '../CommonsElements/ContentRequest.jsx';
import * as UtilitiesMessage from '../../Utils/utilitiesMessage.js';
import * as DisplayDesign from '../../Utils/displayDesign.js';
import store from '../../Store/Store';
import { API_URL } from '../../Api/constants';
import { RoleKey } from '../../Reducers/Roles/types';

import ContentRequestDetailPaper from './ContentRequestDetailPaper';

import { selectIsBoostOffer } from '../../Reducers/app/selectors.js';
import { history } from '../../history';

let ContentRequestUser = createReactClass({
  getInitialState() {
    return {
      allContentRequestsForUser: [].sort((a, b) => (a.id < b.id ? -1 : 1)),
      inProgressRequests: [],
      contentRequestDetails: [],
      actualConversation: 0,
      messages: [],
      talkUserId: '',
      talkUserName: '',
      talkSubject: '',
      heightRequestWindows: $(window).height() - 325,
      widthRequestWindows: $(window).width() - 50,
      disableReferenceField: true,
      classifications: [],
      dataSourceDisplay: [],
      dataSource: [],
      createdObject: 0,
      objectSearchResults: [],
      searchObjectRequest: {
        SearchType: 'bimobject',
        SearchValue: { Value: '' },
        SearchSorting: {
          Name: 'CreatedAt',
          Order: 'Desc',
        },
        SearchPaging: {
          From: 0,
          Size: -1,
        },
        LanguageCode: this.props.Language,
        ContentManagementLibraries: ['personal-onfly'],
      },
      requestToUpdate: '',
      orderBy: '',
      order: 'desc',
      currentRequestpage: 1,
      modalDetailsOpen: false,
      modalSelectmembersOpen: false,
      modalSelectSupplierOpen: false,
      objectAssociationSearch: '',
      contentRequestDatas: [],
    };
  },

  updateSize() {
    const newHeightRequestWindows = $(window).height() - 325;
    const newWidthRequestWindows = $(window).width() - 50;
    this.setState({
      heightRequestWindows: newHeightRequestWindows,
      widthRequestWindows: newWidthRequestWindows,
    });
  },

  redirectCreateRequest() {
    history.push(`/${this.props.Language}/create-content-request`);
  },

  componentWillMount() {
    store.dispatch({ type: 'APP/FETCH_DOCUMENT_TYPES' });

    const displayLoader = this.getUrlParameter('requestid') == '';

    this.getContentRequestsUserList(this.state.currentRequestpage, displayLoader);

    this.onPageLoad();
  },

  componentDidMount() {
    const self = this;
    window.addEventListener('resize', this.updateSize);
    $('#message-request-modal').on('shown.bs.modal', (e) => {
      self.scrollMessageToBottom();
    });

    $(document).on('change keyup keydown paste cut', '#message-content-text', function (e) {
      UtilitiesMessage.resizeWriteArea(
        e,
        this,
        '#chat-write-container',
        '#write-message-conversation',
        '#list-message-conversation'
      );
    });
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize);
  },

  onPageLoad() {
    const location = window.location.href;
    const parsedUrl = new URL(location);
    const searchElements = parsedUrl.search;

    const self = this;

    if (location.indexOf('?message=') !== -1) {
      const messageId = location.split('?message=')[1];
      const currentUrl = location.split('?message=')[0];

      const obj = {
        Title: self.props.Resources.ContentManagement.ContentRequestLabelTitle,
        Url: currentUrl,
      };
      history.push(obj.Url, obj);

      setTimeout(() => {
        // self.loadTalk(messageId, 1);
      }, 1000);
    }

    if (self.getUrlParameter('requestid') != '') {
      self.getContentRequestDetails(self.getUrlParameter('requestid'), true);
      history.push(parsedUrl.origin + parsedUrl.pathname);
    }
  },

  getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  },

  refreshPage() {
    this.getContentRequestsUserList(this.state.currentRequestpage);
  },

  changeRequestList(event) {
    const requestid = event.target.dataset.id;
    this.setState({ currentRequestpage: requestid });
    this.getContentRequestsUserList(requestid);
  },

  getContentRequestsUserList(requestType) {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/request/content/${self.props.ManagementCloudId}/state/${requestType}/user?token=${self.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        self.setState({ allContentRequestsForUser: json });
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
        ? this.state.allContentRequestsForUser.sort((a, b) =>
            b[property].toLowerCase() < a[property].toLowerCase() ? -1 : 1
          )
        : this.state.allContentRequestsForUser.sort((a, b) =>
            a[property].toLowerCase() < b[property].toLowerCase() ? -1 : 1
          );

    this.setState({ allContentRequestsForUser: data, order, orderBy: property });
  },

  getContentRequestDetails(requestid, switchRequestList = false) {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/request/content/${requestid}/details?token=${this.props.TemporaryToken}`,
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

        const jsonResponse = JSON.parse(response);
        toastr.error(jsonResponse.ModelState);
      })
      .then((json) => {
        if (json != 'error' && json != undefined) {
          self.setState({ contentRequestDatas: json, modalDetailsOpen: true });
        }
      });
  },

  switchContentRequestsTable(contentRequest) {
    let requestPage;
    if (contentRequest.OnflyPartnerId == this.props.UserId) {
      requestPage = 1; // Demandes reçues
    } else {
      requestPage = 2; // Demandes émises
    }

    this.setState({ currentRequestpage: requestPage });
    this.getContentRequestsUserList(requestPage);
  },

  createRequestObject(event) {
    const self = this;
    store.dispatch({ type: 'LOADER', state: true });
    const requestid = event.target.dataset.id;

    fetch(
      `${API_URL}/api/ws/v1/request/content/${this.props.ManagementCloudId}/object/create/${requestid}?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
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

        const jsonResponse = JSON.parse(response);
        toastr.error(jsonResponse.ModelState);
      })
      .then((json) => {
        if (json != 'error' && json != undefined) {
          store.dispatch({ type: 'LOADER', state: false });
          const objectId = json;
          history.push(`/${self.props.Language}/bimobject/${objectId}/edit/informations`);
        }
      });
  },

  colorStateByDate(date) {
    const dateParts = date.split('-');
    const convertedDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    const today = new Date();
    if (today >= convertedDate) {
      return 'Red';
    }

    return 'Green';
  },

  clickButtonMessage(event) {
    const messageid = event.currentTarget.dataset.id;
    this.openAndLoadConversation(messageid);
  },

  openAndLoadConversation(messageId) {
    if (messageId > 0) {
      this.setState({ actualConversation: messageId });
      $('#chat-write-container').css('opacity', 0);

      $('#message-request-modal').modal('show');
    }
  },

  openModalRequestObject(event) {
    const requestid = event.target.dataset.id;
    this.setState({ requestToUpdate: requestid });
    $('#select-request-object-assignement').modal('show');
  },

  createRequestObject(event) {
    const self = this;
    store.dispatch({ type: 'LOADER', state: true });
    const requestid = self.state.requestToUpdate;

    fetch(
      `${API_URL}/api/ws/v1/request/content/${this.props.ManagementCloudId}/object/create/${requestid}?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
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

        const jsonResponse = JSON.parse(response);
        toastr.error(jsonResponse.ModelState);
      })
      .then((json) => {
        if (json != 'error' && json != undefined) {
          store.dispatch({ type: 'LOADER', state: false });
          self.refreshPage();
          self.setState({ createdObject: json });
          $('#select-request-object-assignement').modal('hide');
          $('#confirm-object-create').modal('show');
        }
      });
  },

  redirectCreatedObject() {
    const objectId = this.state.createdObject;
    $('#confirm-object-create').modal('hide');
    history.push(`/${this.props.Language}/bimobject/${objectId}/details`);
  },

  searchUserLastObjects(requestInput) {
    const self = this;
    store.dispatch({ type: 'LOADER', state: true });

    const request = self.state.searchObjectRequest;

    if (requestInput.toString() != '[object Object]') {
      request.SearchValue.Value = requestInput.toString();
    }

    const stringifiedRequest = JSON.stringify(request);

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.ManagementCloudId}/search/results?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: stringifiedRequest,
      }
    )
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }

        toastr.error(response.statusText);
        store.dispatch({ type: 'LOADER', state: false });
      })
      .then((json) => {
        if (json != 'error' && json != undefined) {
          self.setState({ objectSearchResults: json });
        }
      })
      .then(() => {
        store.dispatch({ type: 'LOADER', state: false });
        $('#link-existing-object').modal('show');
        $('#select-request-object-assignement').modal('hide');
      });
  },

  getSearchObjectInput(event) {
    if (event.key === 'Enter') {
      const request = event.target.value;
      this.searchUserLastObjects(request);
    }
  },

  associateObjectToRequest(event) {
    store.dispatch({ type: 'LOADER', state: true });

    const objectId = event.target.dataset.id;
    const self = this;
    const requestid = self.state.requestToUpdate;

    fetch(
      `${API_URL}/api/ws/v1/request/${this.props.ManagementCloudId}/object/linkorupdate?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          RequestId: requestid,
          ObjectId: objectId,
        }),
      }
    ).then((response) => {
      if (response.status == 200) {
        self.refreshPage();
        $('#link-existing-object').modal('hide');
        store.dispatch({ type: 'LOADER', state: false });
        toastr.success(self.props.Resources.ContentManagement.ContentRequestUpdated);
      } else {
        store.dispatch({ type: 'LOADER', state: false });
        toastr.error(response.statusText);
      }
    });
  },

  openAndCloseDetails(event) {
    const { id } = event.target.dataset;
    const isMessageClick = event.target.dataset.message;
    if (!(isMessageClick != undefined) && !(isMessageClick == 'true')) {
      if ($(`#request-details-${id}`)[0].style.display == 'block') {
        var toClose = $("[id^='request-details-']");
        for (var i = 0; i < toClose.length; i++) {
          toClose[i].style.display = 'none';
        }
      } else {
        var toClose = $("[id^='request-details-']");
        for (var i = 0; i < toClose.length; i++) {
          toClose[i].style.display = 'none';
        }
        $(`#request-details-${id}`)[0].style.display = 'block';
      }
    }
  },

  showRequestDetails(event) {
    const request = event.target.parentElement.dataset.requestid;
    if (request != undefined) {
      const requestId = event.target.parentElement.dataset.requestid;
      this.getContentRequestDetails(requestId);
    }
  },

  downloadAssociatedDoc(event) {
    const docUrl = event.target.dataset.url;
    window.location = docUrl;
  },

  updateRequestStatus(event) {
    event.stopPropagation();
    const self = this;
    let isAuthorised = true;
    store.dispatch({ type: 'LOADER', state: true });
    const requestid = event.target.value.split('#')[1];
    const requestState = event.target.value.split('#')[0];
    let objectStateId;

    if (requestState == 'in_progress') {
      objectStateId = 4;
    } else if (requestState == 'completed') {
      objectStateId = 5;
    } else if (requestState == 'rejected') {
      objectStateId = 1;
    } else if (requestState == 'cancelled') {
      objectStateId = 3;
    } else {
      isAuthorised = false;
      store.dispatch({ type: 'LOADER', state: false });
      toastr.error(self.props.Resources.ContentManagement.ContentRequestErrorNotAuthorized);
    }

    if (isAuthorised) {
      fetch(
        `${API_URL}/api/ws/v1/request/content/${requestid}/state/add?token=${self.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            NewStateId: objectStateId,
          }),
        }
      ).then((response) => {
        if (response.status == 200) {
          store.dispatch({ type: 'LOADER', state: false });
          toastr.success(self.props.Resources.ContentManagement.ContentRequestUpdated);
          self.refreshPage();
        } else {
          store.dispatch({ type: 'LOADER', state: false });
          const jsonResponse = JSON.parse(response);
          toastr.error(jsonResponse.ModelState);
        }
      });
    }
  },

  scrollMessageToBottom() {
    const $chat = $('#list-message-conversation');
    const scrollHeightChat = $chat.prop('scrollHeight');

    if (scrollHeightChat > 0) {
      $chat.scrollTop(scrollHeightChat);
      $('#chat-write-container').fadeTo(100, 1);
    }
  },

  handleCloseModalDetails() {
    this.setState({ modalDetailsOpen: false });
  },

  render() {
    const self = this;

    let contentRequestCreateNewObject = '';
    const createObjectRoles = [RoleKey.admin, RoleKey.validator, RoleKey.object_creator];
    const isAuthorizedCreateObject = createObjectRoles.includes(self.props.RoleKey);

    if (!this.props.IsBoostOffer) {
      contentRequestCreateNewObject = (
        <div className="col-xs-11 text-center">
          <a data-toggle="modal" onClick={self.createRequestObject}>
            <img src="../../../Content/images/creerNouvelObjet.svg" width="98" height="98" alt="" />
            <span>{self.props.Resources.ContentManagement.ContentRequestCreateNewObject}</span>
          </a>
        </div>
      );
    }

    const searchResultTable = _.map(self.state.objectSearchResults.Documents, (object, i) => {
      const date = object.UpdatedAt.toString();
      const year = date.substr(0, 4);
      const month = date.substr(4, 2);
      const day = date.substr(6, 2);

      return (
        <TableRow key={i} data-requestid={object.Id}>
          <TableCell>
            <Avatar src={object.Photo} />
          </TableCell>
          <TableCell>{object.Name}</TableCell>
          <TableCell>{`${day}-${month}-${year}`}</TableCell>
          <TableCell style={{ textAlign: 'right' }}>
            <button
              type="button"
              className="btn-third btn-grey"
              data-id={object.Id}
              onClick={self.associateObjectToRequest}
            >
              Select
            </button>
          </TableCell>
        </TableRow>
      );
    });

    const awesomeContentRequestsUserRequests = _.map(
      self.state.allContentRequestsForUser,
      (object, i) => {
        const isReadOnly = !!(
          object.RequestedBimObjectId == null || object.RequestedBimObjectId == 0
        );
        let objectButton = null;
        if (object.RequestState == 'draft') {
          objectButton = (
            <Link>
              <NoteAddIcon style={{ transform: 'scaleX(-1)' }} />
            </Link>
          );
        } else if (object.RequestedBimObjectId != null && object.RequestedBimObjectId != 0) {
          objectButton = (
            <Link to={`/${self.props.Language}/bimobject/${object.RequestedBimObjectId}/details`}>
              <ReplyIcon style={{ color: DisplayDesign.acidBlue, transform: 'scaleX(-1)' }} />
            </Link>
          );
        } else if (isAuthorizedCreateObject) {
          objectButton = (
            <Link>
              <NoteAddIcon
                style={{ color: DisplayDesign.acidBlue, transform: 'scaleX(-1)' }}
                data-id={object.ContentRequestId}
                onClick={self.openModalRequestObject}
              />
            </Link>
          );
        }

        let isDisabled = false;
        if (
          object.RequestState == 'rejected' ||
          object.RequestState == 'cancelled' ||
          object.RequestState == 'validated' ||
          object.RequestState == 'draft'
        ) {
          isDisabled = true;
        }

        let messageLink;
        if (object.CurrentConversation != 0) {
          messageLink = (
            <MessageIcon
              style={{ color: DisplayDesign.acidBlue, cursor: 'pointer' }}
              data-id={object.CurrentConversation}
              data-message="true"
              onClick={self.clickButtonMessage}
            />
          );
        } else {
          messageLink = <MessageIcon style={{ color: 'grey', cursor: 'not-allowed' }} />;
        }

        let description = object.DescriptionAndComments;
        if (description != null && description.length > 50) {
          description = `${description.substring(0, 50)}...`;
        }

        const statutCellClassName = `statut-cell-${object.RequestState}`;

        // adaptative panel choices
        let adaptativeMenu;

        if (object.RequestState == 'draft') {
          adaptativeMenu = (
            <FormControl fullWidth>
              <Select
                displayEmpty
                className={statutCellClassName}
                value={`${object.RequestState}#${object.ContentRequestId}`}
                disabled={isDisabled}
                data-status={object.RequestState}
                onChange={self.updateRequestStatus}
                disableUnderline
              >
                <MenuItem
                  key={`draft#${object.ContentRequestId}`}
                  value={`draft#${object.ContentRequestId}`}
                >
                  <ListItemIcon>
                    <i className="cr-statut cr-draft" />
                  </ListItemIcon>
                  <ListItemText
                    inset
                    className="statut-name"
                    style={{ display: 'inline-block', color: '#a4a4a4' }}
                    disableTypography
                    primary={self.props.Resources.ContentManagement.ContentRequestStatutDraft}
                  />
                </MenuItem>
              </Select>
            </FormControl>
          );
        } else if (object.RequestState == 'sended') {
          adaptativeMenu = (
            <FormControl fullWidth>
              <Select
                displayEmpty
                className={statutCellClassName}
                value={`${object.RequestState}#${object.ContentRequestId}`}
                disabled={isDisabled}
                data-status={object.RequestState}
                onChange={self.updateRequestStatus}
                disableUnderline
              >
                <MenuItem
                  key={`sended#${object.ContentRequestId}`}
                  value={`sended#${object.ContentRequestId}`}
                >
                  <ListItemIcon>
                    <i className="cr-statut cr-envoye" />
                  </ListItemIcon>
                  <ListItemText
                    inset
                    className="statut-name"
                    style={{ display: 'inline-block', color: '#38baca' }}
                    disableTypography
                    primary={self.props.Resources.ContentManagement.ContentRequestStatutSended}
                  />
                </MenuItem>
                <MenuItem
                  key={`in_progress#${object.ContentRequestId}`}
                  value={`in_progress#${object.ContentRequestId}`}
                >
                  <ListItemIcon>
                    <i className="cr-statut cr-en-cours" />
                  </ListItemIcon>
                  <ListItemText
                    inset
                    className="statut-name"
                    style={{ display: 'inline-block', color: '#4e6de2' }}
                    disableTypography
                    primary={self.props.Resources.ContentManagement.ContentRequestStatutInProgress}
                  />
                </MenuItem>
                <MenuItem
                  key={`rejected#${object.ContentRequestId}`}
                  value={`rejected#${object.ContentRequestId}`}
                >
                  <ListItemIcon>
                    <i className="cr-statut cr-rejete" />
                  </ListItemIcon>
                  <ListItemText
                    inset
                    className="statut-name"
                    style={{ display: 'inline-block', color: '#eb4658' }}
                    disableTypography
                    primary={self.props.Resources.ContentManagement.ContentRequestStatutRejected}
                  />
                </MenuItem>
              </Select>
            </FormControl>
          );
        } else if (object.RequestState == 'in_progress') {
          adaptativeMenu = (
            <FormControl fullWidth>
              <Select
                displayEmpty
                className={statutCellClassName}
                value={`${object.RequestState}#${object.ContentRequestId}`}
                disabled={isDisabled}
                data-status={object.RequestState}
                onChange={self.updateRequestStatus}
                disableUnderline
              >
                <MenuItem
                  key={`in_progress#${object.ContentRequestId}`}
                  value={`in_progress#${object.ContentRequestId}`}
                >
                  <ListItemIcon>
                    <i className="cr-statut cr-en-cours" />
                  </ListItemIcon>
                  <ListItemText
                    inset
                    className="statut-name"
                    style={{ display: 'inline-block', color: '#4e6de2' }}
                    disableTypography
                    primary={self.props.Resources.ContentManagement.ContentRequestStatutInProgress}
                  />
                </MenuItem>
                <MenuItem
                  key={`completed#${object.ContentRequestId}`}
                  value={`completed#${object.ContentRequestId}`}
                >
                  <ListItemIcon>
                    <i className="cr-statut cr-complete" />
                  </ListItemIcon>
                  <ListItemText
                    inset
                    className="statut-name"
                    style={{ display: 'inline-block', color: '#c6e9da' }}
                    disableTypography
                    primary={self.props.Resources.ContentManagement.ContentRequestStatutComplete}
                  />
                </MenuItem>
                <MenuItem
                  key={`cancelled#${object.ContentRequestId}`}
                  value={`cancelled#${object.ContentRequestId}`}
                >
                  <ListItemIcon>
                    <i className="cr-statut cr-annule" />
                  </ListItemIcon>
                  <ListItemText
                    inset
                    className="statut-name"
                    style={{ display: 'inline-block', color: '#f6c533' }}
                    disableTypography
                    primary={self.props.Resources.ContentManagement.ContentRequestStatutCancelled}
                  />
                </MenuItem>
              </Select>
            </FormControl>
          );
        } else if (object.RequestState == 'completed') {
          adaptativeMenu = (
            <FormControl fullWidth>
              <Select
                displayEmpty
                className={statutCellClassName}
                value={`${object.RequestState}#${object.ContentRequestId}`}
                disabled={isDisabled}
                data-status={object.RequestState}
                onChange={self.updateRequestStatus}
                disableUnderline
              >
                <MenuItem
                  key={`in_progress#${object.ContentRequestId}`}
                  value={`in_progress#${object.ContentRequestId}`}
                >
                  <ListItemIcon>
                    <i className="cr-statut cr-en-cours" />
                  </ListItemIcon>
                  <ListItemText
                    inset
                    className="statut-name"
                    style={{ display: 'inline-block', color: '#4e6de2' }}
                    disableTypography
                    primary={self.props.Resources.ContentManagement.ContentRequestStatutInProgress}
                  />
                </MenuItem>
                <MenuItem
                  key={`completed#${object.ContentRequestId}`}
                  value={`completed#${object.ContentRequestId}`}
                >
                  <ListItemIcon>
                    <i className="cr-statut cr-complete" />
                  </ListItemIcon>
                  <ListItemText
                    inset
                    className="statut-name"
                    style={{ display: 'inline-block', color: '#c6e9da' }}
                    disableTypography
                    primary={self.props.Resources.ContentManagement.ContentRequestStatutComplete}
                  />
                </MenuItem>
                <MenuItem
                  key={`cancelled#${object.ContentRequestId}`}
                  value={`cancelled#${object.ContentRequestId}`}
                >
                  <ListItemIcon>
                    <i className="cr-statut cr-annule" />
                  </ListItemIcon>
                  <ListItemText
                    inset
                    className="statut-name"
                    style={{ display: 'inline-block', color: '#f6c533' }}
                    disableTypography
                    primary={self.props.Resources.ContentManagement.ContentRequestStatutCancelled}
                  />
                </MenuItem>
                <MenuItem
                  key={`validated#${object.ContentRequestId}`}
                  value={`validated#${object.ContentRequestId}`}
                >
                  <ListItemIcon>
                    <i className="cr-statut cr-termine" />
                  </ListItemIcon>
                  <ListItemText
                    inset
                    className="statut-name"
                    style={{ display: 'inline-block', color: '#22c985' }}
                    disableTypography
                    primary={self.props.Resources.ContentManagement.ContentRequestStatutValidated}
                  />
                </MenuItem>
              </Select>
            </FormControl>
          );
        }

        return (
          <TableRow
            key={`selectedContentRequests-${object.ContentRequestId}`}
            data-requestid={object.ContentRequestId}
            onClick={self.showRequestDetails}
            style={{ cursor: 'pointer' }}
          >
            <TableCell className="col-name">{object.ObjectName}</TableCell>
            <TableCell className="col-description" title={object.DescriptionAndComments}>
              {description}
            </TableCell>
            <TableCell className="col-type">{object.RequestType}</TableCell>
            <TableCell className="col-date">{object.EndDate}</TableCell>
            <TableCell className="col-from">{object.RequesterName}</TableCell>
            <TableCell className="col-message">{messageLink}</TableCell>
            <TableCell className="col-statut">{adaptativeMenu}</TableCell>
            <TableCell>{objectButton}</TableCell>
          </TableRow>
        );
      }
    );
    const columnData = [
      {
        id: 'ObjectName',
        numeric: false,
        label: self.props.Resources.ContentManagement.ContentRequestColumnName,
        sortable: true,
        classname: 'col-name',
      },
      {
        id: 'RequestObjectDescription',
        numeric: false,
        label: self.props.Resources.ContentManagement.ContentRequestColumnDescription,
        sortable: true,
        classname: 'col-description',
      },
      {
        id: 'ObjectType',
        numeric: false,
        label: self.props.Resources.ContentManagement.ContentRequestColumnType,
        sortable: true,
        classname: 'col-type',
      },
      {
        id: 'WantedDate',
        numeric: false,
        label: self.props.Resources.ContentManagement.ContentRequestColumnWantedDate,
        sortable: true,
        classname: 'col-date',
      },
      {
        id: 'RequesterName',
        numeric: false,
        label: self.props.Resources.ContentManagement.ContentRequestColumnFrom,
        sortable: true,
        classname: 'col-from',
      },
      {
        id: 'CurrentConversation',
        numeric: false,
        label: self.props.Resources.ContentManagement.ContentRequestColumnMessage,
        sortable: false,
        classname: 'col-message',
      },
      {
        id: 'RequestState',
        numeric: false,
        label: self.props.Resources.ContentManagement.ContentRequestColumnStatus,
        sortable: true,
        classname: 'col-statut',
      },
      {
        id: 'RequestedBimObjectId',
        numeric: false,
        label: self.props.Resources.ContentManagement.ContentRequestColumnObjectLink,
        sortable: false,
      },
    ];

    const awesomeTableHead = _.map(columnData, (column, i) => {
      const orderByState = self.state.orderBy == column.id;

      return (
        <TableCell
          key={column.id}
          sortdirection={orderByState ? self.state.order : ''}
          className={column.classname}
        >
          <Tooltip
            title={self.props.Resources.ContentManagement.TooltipOrderBy}
            placement={column.numeric ? 'bottom-end' : 'bottom-start'}
            enterDelay={300}
          >
            <TableSortLabel
              active={self.state.orderBy == column.id}
              direction={self.state.order}
              data-id={column.id}
              onClick={column.sortable ? self.createSortHandler : null}
            >
              <span className="ellipsis">{column.label}</span>
            </TableSortLabel>
          </Tooltip>
        </TableCell>
      );
    });

    return (
      <div className="container-fluid">
        <div className="cr-top mui-fixed">
          <div className="row bandeau-title bt-user">
            <h2>{self.props.Resources.ContentManagement.ContentRequestUserPresentationText}</h2>
            <Tooltip title={this.props.Resources.ContentManagement.TooltipCreateContentRequest}>
              <Fab size="small" onClick={this.redirectCreateRequest} id="add-content-request">
                <AddIcon />
              </Fab>
            </Tooltip>
          </div>

          <div className="row">
            <nav className="navigation">
              <ul className="phases-tabs">
                <li
                  className={`tab-classif col-xs-7 col-xs-offset-1 col-sm-5 col-sm-offset-4 col-md-4 col-md-offset-8${
                    this.state.currentRequestpage == 1 ? ' active' : ''
                  }`}
                >
                  <a
                    href=""
                    data-toggle="tab"
                    aria-expanded="true"
                    data-id="1"
                    onClick={self.changeRequestList}
                  >
                    {self.props.Resources.ContentManagement.ContentRequestUserListReceived}
                  </a>
                  <div className="border-color" />
                </li>
                <li
                  className={`tab-classif col-xs-7 col-sm-5 col-md-4${
                    this.state.currentRequestpage == 2 ? ' active' : ''
                  }`}
                >
                  <a
                    href=""
                    data-toggle="tab"
                    aria-expanded="true"
                    data-id="2"
                    onClick={self.changeRequestList}
                  >
                    {self.props.Resources.ContentManagement.ContentRequestUserListSended}
                  </a>
                  <div className="border-color" />
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <Paper className="row table-request tr-user">
          <h3 className="table-title">
            {self.props.Resources.ContentManagement.ContentRequestAdminReceivedRequests}
          </h3>

          <Table>
            <TableHead id="awesomeTableHeader">
              <TableRow>{awesomeTableHead}</TableRow>
            </TableHead>
            <TableBody>{awesomeContentRequestsUserRequests}</TableBody>
          </Table>
        </Paper>

        <div
          className="modal fade"
          id="message-request-modal"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <MessageDetail
              Resources={self.props.Resources}
              language={self.props.Language}
              senderId={self.props.UserId}
              messageId={self.state.actualConversation}
              height={600}
              scrollMessageToBottom={self.scrollMessageToBottom}
              entityId={self.props.EntityId}
              entityType={self.props.EntityType}
              temporaryToken={self.props.TemporaryToken}
            />
          </div>
        </div>

        <div
          className="modal fade"
          id="select-request-object-assignement"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <CloseIcon data-toggle="modal" data-dismiss="modal" />
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <div className="row">
                    {contentRequestCreateNewObject}
                    <div className="col-xs-11 col-xs-offset-1 text-center">
                      <a data-toggle="modal" onClick={self.searchUserLastObjects}>
                        <img
                          src="../../../Content/images/LierObjetExistant.svg"
                          width="98"
                          height="98"
                          alt=""
                        />
                        <span>
                          {self.props.Resources.ContentManagement.ContentRequestLinkToExisting}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="confirm-object-create"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <CloseIcon className="close" data-toggle="modal" data-dismiss="modal" />
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <div className="row">
                    {
                      self.props.Resources.ContentManagement
                        .ContentRequestCongratulationsObjectCreated
                    }
                  </div>
                  <div className="row">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={self.redirectCreatedObject}
                    >
                      {self.props.Resources.ContentManagement.ContentRequestGoToObjectCreated}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="link-existing-object"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content" style={{ margin: '0', padding: '0' }}>
              <div className="modal-header">
                <CloseIcon className="close" data-toggle="modal" data-dismiss="modal" />
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <div className="row">
                    <TextField
                      id="objectSearchField"
                      placeholder={
                        self.props.Resources.ContentManagement.ContentRequestSearchObject
                      }
                      fullWidth
                      onKeyPress={self.getSearchObjectInput}
                    />
                  </div>
                  <div className="row">
                    <Table>
                      <TableBody>{searchResultTable}</TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Dialog
          open={this.state.modalDetailsOpen}
          onClose={this.handleCloseModalDetails}
          id="content-request-details"
          scroll="body"
          PaperComponent={ContentRequestDetailPaper}
        >
          <div className="row">
            <h4 className="modal-title" id="myModalLabel">
              {this.props.Resources.ContentManagement.CreateContentRequestResumeRequest}
            </h4>
            <button type="button" className="close" onClick={this.handleCloseModalDetails}>
              <CloseIcon />
            </button>
          </div>

          <ContentRequest
            TemporaryToken={this.props.TemporaryToken}
            ManagementCloudId={this.props.ManagementCloudId}
            Resources={this.props.Resources}
            Language={this.props.Language}
            Softwares={this.props.Softwares}
            DocumentTypes={this.props.DocumentTypes}
            RequestCondition="Edit"
            UserName=""
            UserLevel="User"
            ContentRequestDatas={this.state.contentRequestDatas}
          />
        </Dialog>
      </div>
    );
  },
});

const MessageDetail = createReactClass({
  getInitialState() {
    return {
      messagesList: [],
      scrollMessageIsActive: true,
      currentPage: 1,
      talkIsLoad: false,
      talkUserType: '',
      subject: '',
      usersTalkList: [],
      prevScrollHeight: 0,
    };
  },

  componentWillReceiveProps(newProps) {
    if (newProps.messageId > 0 && newProps.messageId !== this.props.messageId) {
      this.resetMessageText();

      $('#all-users-talk-list').hide();
      $('#talk-with-title i.arrow-roll').removeClass('rotate');

      // Init state
      this.setState({
        messagesList: [],
        scrollMessageIsActive: true,
        currentPage: 1,
        talkIsLoad: false,
        talkUserType: '',
        subject: '',
        usersTalkList: [],
      });

      this.loadUsersTalk(newProps.messageId); // Chargement des utilisateurs participant a la conversation
      this.loadTalk(newProps.messageId, 1, false); // Chargement de la conversation
    }
  },

  handleKeyPress(e) {
    if (e.key == 'Enter' && e.shiftKey) {
      e.preventDefault();
    } else if (e.key === 'Enter') {
      this.sendReply();
      e.preventDefault();
    }
  },

  sendReply() {
    const self = this;
    const inputMessageValue = document.getElementById('message-content-text').value.trim();

    if (inputMessageValue != '') {
      self.replyTalk(self.props.messageId, inputMessageValue, self.state.talkUserType);
      self.resetMessageText();
    }
  },

  resetMessageText() {
    document.getElementById('message-content-text').value = '';

    $('#write-message-conversation').removeAttr('style');
    $('#list-message-conversation').removeAttr('style');
  },

  loadTalk(id, page, isloadScroll) {
    const self = this;
    const conversationId = parseInt(id);

    if ((page == 1 && self.state.messagesList.length > 0) || !isloadScroll) {
      // Lecture des messages
      $.ajax({
        type: 'POST',
        dataType: 'json',
        url: `${API_URL}/api/ws/v1/en/messages/${id}/readLastMessage?token=${self.props.temporaryToken}`,
        contentType: 'application/json; charset=utf-8',
        async: false,
      });
    }

    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: `${API_URL}/api/ws/v1/en/messages/${conversationId}/list/${page}?token=${self.props.temporaryToken}`,
      contentType: 'application/json; charset=utf-8',
      async: true,
      success(data) {
        if (data.length > 0) {
          let newMessagesList = [];

          if (page == 1 && self.state.messagesList.length > 0) {
            newMessagesList = self.state.messagesList;

            _.each(data.reverse(), (message, i) => {
              if (_.findIndex(self.state.messagesList, { Id: message.Id }) == -1) {
                newMessagesList.push(message);
              }
            });
          } else {
            _.each(data.reverse(), (message, i) => {
              if (_.findIndex(self.state.messagesList, { Id: message.Id }) == -1) {
                newMessagesList.push(message);
              }
            });

            newMessagesList.push.apply(newMessagesList, self.state.messagesList);
          }

          if (!isloadScroll) {
            let userType = '';

            const indiceMax = data.length - 1;
            const object = data[indiceMax];
            const subject = object.Subject;

            let sender = object.Sender;
            let receiver = object.Receiver;

            if (object.SenderUser != null) {
              sender = object.SenderUser;
            } else if (object.Sender.EntityType == 'user') {
              sender = object.Sender;
            }

            if (object.ReceiverUser != null) {
              receiver = object.ReceiverUser;
            } else if (object.Receiver.EntityType == 'user') {
              receiver = object.Receiver;
            }

            if (sender != null && sender.Id != self.props.senderId) {
              userType = object.Sender.EntityType;
            } else if (receiver != null) {
              userType = object.Receiver.EntityType;
            }

            self.setState({ messagesList: newMessagesList, talkUserType: userType, subject });
          } else {
            const $chat = $('#list-message-conversation');
            const scrollTopChat = $chat.scrollTop();

            self.setState({ messagesList: newMessagesList, scrollMessageIsActive: true });

            const currentScrollHeight = $chat.prop('scrollHeight');

            const scrollPosition =
              currentScrollHeight - self.state.prevScrollHeight + scrollTopChat;

            $chat.scrollTop(scrollPosition);

            if (page == 1 && self.state.messagesList.length > 0) {
              self.props.scrollMessageToBottom();
            }
          }
        } else {
          self.setState({ talkIsLoad: true });
        }
      },
    });
  },

  scrollLoadMessages() {
    const $chat = $('#list-message-conversation');
    const conversationId = $chat.attr('data-id');

    if (conversationId > 0) {
      const scrollConteneurListTop = $chat.scrollTop();
      const heightConteneurList = $chat.height();
      const totalConteneurListHeight = heightConteneurList * 2;

      if (
        ((scrollConteneurListTop + heightConteneurList <= totalConteneurListHeight &&
          this.state.scrollMessageIsActive) ||
          scrollConteneurListTop == 0) &&
        !this.state.talkIsLoad
      ) {
        const newPage = this.state.currentPage + 1;

        const scrollHeight = $chat.prop('scrollHeight');
        this.setState({
          currentPage: newPage,
          scrollMessageIsActive: false,
          prevScrollHeight: scrollHeight,
        });

        this.loadTalk(conversationId, newPage, true);

        if (scrollConteneurListTop == 0 && !this.state.talkIsLoad) {
          $chat.scrollTop(1);
        }
      }
    }
  },

  replyTalk(id, content, userType) {
    const self = this;

    // reply
    if (id > 0) {
      let ReplyViewModel = {
        MessageId: id,
        Content: content,
      };

      if (userType == 'user') {
        ReplyViewModel.SenderEntityId = self.props.senderId;
        ReplyViewModel.SenderEntityType = userType;
        ReplyViewModel.IsGroupConversation = false;
      } else {
        ReplyViewModel.SenderEntityId = self.props.entityId;
        ReplyViewModel.SenderEntityType = self.props.entityType;
        ReplyViewModel.IsGroupConversation = true;
      }

      ReplyViewModel = JSON.stringify(ReplyViewModel);

      $.ajax({
        type: 'POST',
        dataType: 'json',
        url: `${API_URL}/api/ws/v1/message/reply` + `?token=${self.props.temporaryToken}`,
        data: ReplyViewModel,
        contentType: 'application/json; charset=utf-8',
        async: true,
        success(data) {
          self.loadUsersTalk(id);
          self.loadTalk(id, 1, true);
        },
      });
    }
  },

  loadUsersTalk(conversationId) {
    const self = this;

    $.ajax({
      type: 'POST',
      dataType: 'json',
      url:
        `${API_URL}/api/ws/v1/en/messages/${conversationId}/listUserTalk` +
        `?token=${self.props.temporaryToken}`,
      contentType: 'application/json; charset=utf-8',
      async: true,
      success(apiMessageUserVMList) {
        if (apiMessageUserVMList.length > 0) {
          const usersList = [];

          _.each(apiMessageUserVMList, (user, i) => {
            if (user.Id != self.props.senderId && _.findIndex(usersList, { Id: user.Id }) == -1) {
              usersList.push(user);
            }
          });

          self.setState({ usersTalkList: usersList });
        }
      },
    });
  },

  rollUserTalkList(e) {
    $('#all-users-talk-list').slideToggle(350);
    $('#talk-with-title i.arrow-roll').toggleClass('rotate');
  },

  render() {
    const self = this;

    let talkWithUsers;

    if (self.state.usersTalkList.length > 0) {
      const AVATAR_SIZE = 32; // Taille de l'icon avatar en px

      const userTalkList = [];

      // range la liste
      _.each(self.state.usersTalkList, (userTalk, i) => {
        let entity = userTalk.EntityType;

        if (userTalk.EntityType != 'user') {
          entity += `-${userTalk.EntityId}`;
        }

        if (userTalkList[entity] == undefined) {
          userTalkList[entity] = [];
        }

        userTalkList[entity].push(userTalk);
      });

      const entityList = Object.keys(userTalkList).map((entityTalk, i) => (
        <UserTalk key={`entityTalk-${entityTalk}`} entityTalk={userTalkList[entityTalk]} />
      ));

      talkWithUsers = (
        <div id="modal-message-subtitle">
          <p id="talk-with-title" onClick={self.rollUserTalkList}>
            {self.props.Resources.AnalyticsMails.TalkWithLabel}
            <span className="number-talk-user">{self.state.usersTalkList.length}</span>
            <PersonIcon />
            <KeyboardArrowRightIcon className="arrow-roll" />
          </p>
          <div id="all-users-talk-list">{entityList}</div>
        </div>
      );
    }

    const messages = self.state.messagesList.map((object, i) => (
      <Message
        language={self.props.language}
        key={`message-${object.Id}`}
        senderId={self.props.senderId}
        object={object}
        entityId={self.props.entityId}
        Resources={self.props.Resources}
      />
    ));

    const messageDetailId = `message-detail-${self.props.messageId}`;

    return (
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title" id="modal-message-title">
            {self.state.subject}
          </h4>
          {talkWithUsers}
          <CloseIcon className="close" data-toggle="modal" data-dismiss="modal" />
        </div>
        <div className="modal-body">
          <div
            id="textingBox"
            className="middle"
            style={{ width: '100%', backgroundColor: 'rgba(250, 250, 250, 0.00)' }}
          >
            <div className="messages-container">
              <div id="chat-write-container" className="message-detail">
                <div
                  id="list-message-conversation"
                  className="chat"
                  onScroll={self.scrollLoadMessages}
                  data-id={self.props.messageId}
                >
                  {messages}
                </div>

                <div id="write-message-conversation" className="write">
                  <div id="write-textarea-container">
                    <textarea
                      placeholder={this.props.Resources.AnalyticsMails.PlaceHolderText}
                      id="message-content-text"
                      type="text"
                      autoFocus
                    />
                  </div>
                  <div className="write-link" onClick={self.sendReply}>
                    <button className="write-link send btn-raised">
                      <SendIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

const Message = createReactClass({
  render() {
    const self = this;
    const { language } = self.props;

    const content = this.props.object.Content;
    const date = moment(new Date(this.props.object.CreatedAt));

    let classname = '';
    const classNameDate = '';
    const AVATAR_SIZE = 50; // Taille de l'icon avatar en px
    const AVATAR_READER_SIZE = 20;

    if (self.props.entityId == this.props.object.Sender.Id) {
      classname = 'me';
    } else {
      classname = 'you';
    }

    let dateFormat = date.format('Do, MMM YYYY');
    if (date.isSame(moment(), 'day')) {
      dateFormat = date.format('LT');
    }

    let senderUserAvatar = '';
    let senderUserName = '';

    if (this.props.object.SenderUser != null) {
      senderUserAvatar = `${this.props.object.SenderUser.Avatar}?width=${AVATAR_SIZE}&height=${AVATAR_SIZE}`;
      senderUserName = this.props.object.SenderUser.DisplayName;

      if (this.props.senderId == this.props.object.SenderUser.Id) {
        classname = 'me-user';
      }
    }

    const userReaderList = _.map(this.props.object.MessageReadList, (messageRead, i) => {
      const userReader = $(`#user-reader-${messageRead.User.Id}`);

      if (userReader.length > 0 && userReader.attr('data-message') != self.props.object.Id) {
        userReader.fadeOut(500, function () {
          $(this).remove();
        });
      }

      if (self.props.object.SenderUser != null) {
        if (
          messageRead.User.Id != self.props.object.SenderUser.Id &&
          messageRead.User.Id != self.props.senderId
        ) {
          const readAt = moment(new Date(messageRead.ReadAt));
          const dateRead = readAt.format('Do, MMM YYYY');
          const timeRead = readAt.format('LT');

          let tooltip = self.props.Resources.UserMessageDetails.ReadMessage;

          if (tooltip != null) {
            tooltip = tooltip
              .replace('[UserName]', messageRead.User.DisplayName)
              .replace('[Date]', dateRead)
              .replace('[Time]', timeRead);
          } else {
            tooltip = `${messageRead.User.DisplayName} - ${dateRead} ${timeRead}`;
          }

          return (
            <li
              id={`user-reader-${messageRead.User.Id}`}
              data-message={self.props.object.Id}
              key={`user-reader-${messageRead.User.Id}-message-${self.props.object.Id}`}
            >
              <img
                className="user-avatar reader"
                title={tooltip}
                src={`${messageRead.User.Avatar}?width=${AVATAR_READER_SIZE}&height=${AVATAR_READER_SIZE}`}
              />
            </li>
          );
        }
      }
    });

    return (
      <div className="bubble-line">
        <img className={`user-avatar ${classname}`} src={senderUserAvatar} />
        <div className={`bubble ${classname}`}>
          <div className="bubble-content">
            <h4 className="user-name">{senderUserName}</h4>
            <div
              dangerouslySetInnerHTML={{ __html: $.trim(content, '\n').split('\n').join('<br/>') }}
            />
          </div>
          <div>
            <div className="bubble-date">{dateFormat}</div>
            <ul className="reader-users-list">{userReaderList}</ul>
          </div>
        </div>
      </div>
    );
  },
});

const UserTalk = createReactClass({
  render() {
    const self = this;

    const AVATAR_SIZE = '32'; // Taille de l'icon avatar en px

    const { entityTalk } = self.props;

    if (entityTalk.length > 0) {
      // let entityId = entityTalk[0].EntityId;
      const entityType = entityTalk[0].EntityType;
      const entityName = entityTalk[0].EntityName;

      const usersTalk = entityTalk.map((user, i) => {
        const userAvatar = (
          <Avatar
            size={AVATAR_SIZE}
            src={`${user.Avatar}?width=${AVATAR_SIZE}&height=${AVATAR_SIZE}`}
          />
        );

        return <Chip key={`usertalk-${user.Id}`} avatar={userAvatar} label={user.DisplayName} />;
      });

      let entityTalkTitle;

      if (entityType != 'user') {
        const avatar = entityTalk[0].EntityAvatar;
        const entityAvatar = `${avatar}?width=${AVATAR_SIZE}&height=${AVATAR_SIZE}`;

        entityTalkTitle = (
          <h4 className={`talk-users-title ${entityType}`}>
            <img className="user-avatar" src={entityAvatar} />
            <span>{entityName}</span>
          </h4>
        );
      }

      return (
        <div>
          {entityTalkTitle}
          <div className={`talk-users-list ${entityType}`}>{usersTalk}</div>
        </div>
      );
    }

    return '';
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    Language: appState.Language,
    UserId: appState.UserId,
    RoleKey: appState.RoleKey,
    RoleName: appState.RoleName,
    ManagementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    Language: appState.Language,
    Resources: appState.Resources[appState.Language],
    Softwares: appState.Softwares,
    DocumentTypes: appState.DocumentTypes,
    EntityId: appState.EntityId,
    EntityType: appState.EntityType,
    IsBoostOffer: selectIsBoostOffer(store),
  };
};

export default ContentRequestUser = connect(mapStateToProps)(ContentRequestUser);
