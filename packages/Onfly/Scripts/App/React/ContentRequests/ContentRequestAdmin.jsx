import React from 'react';
import createReactClass from 'create-react-class';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import toastr from 'toastr';
import _ from 'underscore';

import moment from 'moment';

// material ui calls
import FormControl from '@material-ui/core/FormControl';
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
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';

// material ui icons
import NoteAddIcon from '@material-ui/icons/NoteAdd.js';
import ReplyIcon from '@material-ui/icons/Reply.js';
import MessageIcon from '@material-ui/icons/Message.js';
import CancelIcon from '@material-ui/icons/Cancel.js';
import CheckCircleIcon from '@material-ui/icons/CheckCircle.js';
import RefreshIcon from '@material-ui/icons/Refresh.js';
import AddIcon from '@material-ui/icons/Add.js';
import CloseIcon from '@material-ui/icons/Close.js';
import SearchIcon from '@material-ui/icons/Search.js';
import SendIcon from '@material-ui/icons/Send.js';
import PersonIcon from '@material-ui/icons/Person.js';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline.js';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked.js';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked.js';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight.js';
import AutocompleteSuppliers from '../Autocomplete/AutocompleteSuppliers.jsx';
import ContentRequest from '../CommonsElements/ContentRequest.jsx';
import AutocompleteMember from '../Autocomplete/AutocompleteMember.jsx';
import * as Utils from '../../Utils/utils.js';
import * as UtilitiesMessage from '../../Utils/utilitiesMessage.js';
import store from '../../Store/Store';
import * as DisplayDesign from '../../Utils/displayDesign.js';
import { API_URL } from '../../Api/constants';

import ContentRequestDetailPaper from './ContentRequestDetailPaper';
import { selectIsBoostOffer } from '../../Reducers/app/selectors.js';
import { history } from '../../history';

let ContentRequestAdmin = createReactClass({
  getInitialState() {
    return {
      teamMemberList: [],
      suppliersListItem: [],
      contentRequestDetails: [],
      supplierContactsList: [],
      draft: '',
      inProgress: '',
      completed: '',
      requestToUpdate: '',
      teamMemberPlanning: [],
      isUserRequest: false,
      actualConversation: 0,
      selectedContentRequests: [].sort((a, b) => (a.id < b.id ? -1 : 1)),
      currentRequestpage: 1,
      requestSelectedTeamMemberId: '',
      requestSelectedSupplier: null,
      defaultAvatar: `${API_URL}/content/images/default-avatar-man.png`,
      currentUserAvatar: '',
      teamPlanningModal: 'hidden',
      teamPlanningButton: 'hidden',
      showSupplierContact: 'hidden',
      supplierButtons: 'hidden',
      planningArrow: '<KeyboardArrowDownIcon />',
      isSupplierManufacturer: false,
      checkSupplier: true,
      checkContact: false,
      supplierIndexSelected: '',
      supplierValidation: 'hidden',
      supplierManufMemberId: '',
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
          Size: 16,
        },
        LanguageCode: this.props.Language,
        ContentManagementLibraries: ['personal-onfly', 'managementcloud-bimobject'],
      },
      order: 'asc',
      orderBy: '',
      checkClosingRequestModal: false,
      resultListHeaderLabel: '',
      objectAssociationSearch: '',
      modalDetailsOpen: false,
      modalSelectmembersOpen: false,
      modalSelectSupplierOpen: false,
      objectAssociationSearch: '',
      commentsContentRequestTeam: '',
      commentsContentRequestSupplier: '',
      contentRequestDatas: [],
    };
  },

  // TODO ADAPT TO NEW CONTENT REQUEST!!!!!!!!!!!!!!!!!!
  onPageLoad() {
    const location = window.location.href;
    const parsedUrl = new URL(location);
    const self = this;
    if (location.indexOf('?message=') !== -1) {
      const messageId = location.split('?message=')[1];
      const currentUrl = location.split('?message=')[0];

      const obj = {
        Title: this.props.Resources.ContentManagement.ContentRequestLabelTitle,
        Url: currentUrl,
      };
      history.push(obj.Url, obj);

      setTimeout(() => {
        self.openAndLoadConversation(messageId);
      }, 1000);
    }

    if (self.getUrlParameter('requestid') != '') {
      self.getContentRequestDetails(
        self.getUrlParameter('requestid'),
        'content-request-details',
        true
      );

      history.push(parsedUrl.origin + parsedUrl.pathname);
    }
  },

  componentWillMount() {
    store.dispatch({ type: 'APP/FETCH_DOCUMENT_TYPES' });
    this.getContentRequestStates();
    this.getMembersList();
    this.getSuppliersList();

    const displayLoader = this.getUrlParameter('requestid') == '';

    this.getCurrentContentRequestList(this.state.currentRequestpage, displayLoader);

    this.onPageLoad();
  },

  componentDidMount() {
    const self = this;

    $('body').on('shown.bs.modal', '#content-request-details', () => {
      self.forceUpdate();
    });
    $('body').on('hide.bs.modal', '#content-request-details', () => {
      if (self.state.checkClosingRequestModal == true) {
        self.confirmCloseModal();
      }
    });
    $('body').on('change.bs.modal', '#content-request-details', () => {
      if (self.state.checkClosingRequestModal == false) {
        self.setState({ checkClosingRequestModal: true });
      }
    });

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
    $('body').off('shown.bs.modal', '#content-request-details');
    $('body').off('hide.bs.modal', '#content-request-details');
    $('body').off('change.bs.modal', '#content-request-details');
  },

  // API calls
  getContentRequestDetails(requestid, context, switchRequestList = false) {
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

        toastr.error(response.statusText);
      })
      .then((json) => {
        if (json != 'error' && json != undefined) {
          self.setState({
            contentRequestDatas: json,
            requestToUpdate: requestid,
            modalDetailsOpen: context == 'content-request-details',
            requestSelectedSupplier: null,
          });

          // Mise à jour du supplier de la content request
          if (json.RequestedBimObjectSupplierId > 0) {
            const requestSelectedSupplier = {
              SupplierId: json.RequestedBimObjectSupplierId,
              ManufacturerId: json.RequestedBimObjectSupplierManufacturerId,
            };

            self.updateRequestSupplierAssigned(requestSelectedSupplier);
          }
        }
      });
  },

  getContentRequestStates() {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/request/content/${this.props.ManagementCloudId}/informations/admin?token=${this.props.TemporaryToken}`,
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
        self.setState({ draft: json[0], inProgress: json[1], completed: json[2] });
      });
  },

  getCurrentContentRequestList(requestType, displayLoader = true) {
    const self = this;

    if (displayLoader) {
      store.dispatch({ type: 'LOADER', state: true });
    }

    fetch(
      `${API_URL}/api/ws/v1/request/content/${this.props.ManagementCloudId}/admin/state/${requestType}/admin?token=${this.props.TemporaryToken}`,
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
        switch (requestType.toString()) {
          case '1':
            self.setState({
              resultListHeaderLabel:
                self.props.Resources.ContentManagement.ContentRequestAdminRequestsToBeProcessed,
            });
            break;
          case '2':
            self.setState({
              resultListHeaderLabel:
                self.props.Resources.ContentManagement.ContentRequestAdminReceivedRequests,
            });
            break;
          case '3':
            self.setState({
              resultListHeaderLabel:
                self.props.Resources.ContentManagement.ContentRequestAdminProcessedRequests,
            });
            break;
        }

        self.setState({ selectedContentRequests: json });

        if (displayLoader) {
          store.dispatch({ type: 'LOADER', state: false });
        }
      });
  },

  getMembersList() {
    const self = this;
    const wantedRoles = ['admin', 'object_creator'];

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.ManagementCloudId}/users/byroles?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          RolesKeys: wantedRoles,
        }),
      }
    )
      .then((response) => response.json())
      .then((json) => {
        self.setState({ teamMemberList: json });
      });
  },

  getSuppliersList() {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/request/content/${this.props.ManagementCloudId}/supplier/list?token=${this.props.TemporaryToken}`,
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
        self.setState({ suppliersListItem: json });
      });
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

  rejectContentRequest() {
    const self = this;
    const comments = self.commentsRejectContentRequest.value;
    let isOk = true;

    if (comments == '' || comments == undefined) {
      isOk = false;
      toastr.error(
        self.props.Resources.ContentManagement.ContentRequestRequestRejectMessageRequired
      );
    }

    if (isOk) {
      fetch(
        `${API_URL}/api/ws/v1/request/content/${this.props.ManagementCloudId}/reject/${this.state.requestToUpdate}?token=${this.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            RejectComments: comments,
          }),
        }
      ).then((response) => {
        if (response.status == 200) {
          toastr.success(self.props.Resources.ContentManagement.ContentRequestUpdated);
          $('#confirm-reject-request').modal('hide');
          self.refreshPage();
        } else {
          const jsonResponse = JSON.parse(response);
          toastr.error(jsonResponse.ModelState);
        }
      });
    }
  },

  validateRequestTeamMember() {
    const self = this;
    const currentMemberId = self.state.requestSelectedTeamMemberId;
    const currentRequest = self.state.requestToUpdate;
    const commentComments = self.state.commentsContentRequestTeam;

    fetch(
      `${API_URL}/api/ws/v1/request/content/${self.props.ManagementCloudId}/assign/${currentRequest}?token=${self.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SupplierType: 'onflypartner',
          SupplierId: currentMemberId,
          AssignComments: commentComments,
        }),
      }
    ).then((response) => {
      if (response.status == 200) {
        const currentAssignedTeamMemberIndex = self.state.teamMemberList.findIndex(
          (id) => id.UserId.toString() == currentMemberId.toString()
        );
        const currentUrl = window.location.href;
        const contenRequestShorcut = `${currentUrl}?openrequestdetails=true&requestid=${currentRequest}`;

        const data = self.state.contentRequestDatas;
        const subject = `${self.props.Resources.ContentRequestMessage.ProjectLabel} ${data.ProjectName} ${self.props.Resources.ContentRequestMessage.AboutLabel} ${data.ObjectName}`;

        let messageHeader = self.props.Resources.ContentRequestMessage.AssignMessageHeaderV2;

        if (messageHeader != null) {
          messageHeader = messageHeader.replace('[ObjectName]', data.ObjectName);
          // messageHeader = messageHeader.replace('[ObjectDescription]', data.DescriptionAndComments);
          // messageHeader = messageHeader.replace('[Comments]', data.Comments);
        }

        let messageLink = self.props.Resources.ContentRequestMessage.AssignMessageLinkV2;

        if (messageLink != null) {
          messageLink = messageLink.replace('[ContentRequestLink]', contenRequestShorcut);
        }

        const content = messageHeader + messageLink;

        self.createNewConversationRequest(
          subject,
          content,
          self.props.UserId,
          currentMemberId,
          currentRequest,
          currentMemberId,
          'user',
          'user',
          commentComments
        );
        toastr.success(self.props.Resources.ContentManagement.ContentRequestUpdated);
        self.refreshPage();

        self.setState({ modalSelectmembersOpen: false });
        $('#message-request-modal').modal('show');
      } else {
        const jsonResponse = JSON.parse(response);
        toastr.error(jsonResponse.ModelState);
      }
    });
  },

  getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  },

  redirectCreateRequest() {
    history.push(`/${this.props.Language}/create-content-request`);
  },

  redirectCreatedObject() {
    const objectId = this.state.createdObject;
    $('#confirm-object-create').modal('hide');
    history.push(`/${this.props.Language}/bimobject/${objectId}/details`);
  },

  refreshPage() {
    const currentPage = this.state.currentRequestpage;
    this.getCurrentContentRequestList(currentPage);
    this.getContentRequestStates();
    this.getSuppliersList();
    this.getContentRequestStates();
    this.setState({
      requestSelectedTeamMemberId: '',
      defaultAvatar: `${API_URL}/content/images/default-avatar-man.png`,
      currentUserAvatar: '',
      teamPlanningModal: 'hidden',
      teamPlanningButton: 'hidden',
      planningArrow: '<KeyboardArrowDownIcon />',
    });
  },

  changeRequestList(event) {
    const requestid = event.target.dataset.id;
    this.setState({ currentRequestpage: requestid });
    this.getCurrentContentRequestList(requestid);
  },

  handleUpdateInputObjectAssociationSearch(event) {
    const self = this;
    const request = event.target.value;
    this.setState({ objectAssociationSearch: request });

    setTimeout(() => {
      if (self.state.objectAssociationSearch == request) {
        self.searchUserLastObjects(request);
      }
    }, 500);
  },

  switchContentRequestsTable(contentRequest) {
    let requestPage;
    if (contentRequest.RequestState == 'draft') {
      requestPage = 1; // Demandes à traiter
    } else if (contentRequest.OnflyPartnerId == this.props.UserId) {
      requestPage = 2; // Demandes reçues
    } else {
      requestPage = 3; // Demandes en cours
    }

    this.setState({ currentRequestpage: requestPage });
    this.getCurrentContentRequestList(requestPage, false);
  },

  validateRequestSupplier() {
    const self = this;
    let isOk = true;
    const { isSupplierManufacturer } = self.state;
    const supplierArray = self.state.suppliersListItem;
    const requestComment = self.state.commentsContentRequestSupplier;
    const currentRequest = self.state.requestToUpdate;
    let supplierType;
    let supplierId;
    let supplierManufacturerId;
    let supplierContactEmailChecked;
    let supplierTrueId;
    let supplierName;
    let continueAfterRequest = true;

    // case supplier "manufacturer" =>
    if (isSupplierManufacturer) {
      var isSupplierMember = self.state.checkSupplier;
      let currentsupplierId = self.state.requestSelectedSupplier.ManufacturerId;
      currentsupplierId = parseInt(currentsupplierId, 10);
      const supplierIndex = _.findIndex(supplierArray, { ManufacturerId: currentsupplierId });

      const manufacturerDetails = supplierArray[supplierIndex];
      supplierManufacturerId = manufacturerDetails.ManufacturerId;
      supplierName = manufacturerDetails.SupplierName;

      // case supplier member =>
      if (isSupplierMember) {
        const supplierMember = self.state.supplierManufMemberId;

        if (supplierMember == '') {
          isOk = false;
          toastr.error(
            self.props.Resources.ContentManagement.ContentRequestErrorMissingManufacturerMember
          );
        } else {
          const index = _.findIndex(self.state.supplierContactsList, {
            SupplierManufId: supplierMember,
          });

          supplierTrueId = self.state.supplierContactsList[index].SupplierTrueId;

          supplierType = 'supplierManuf';
          supplierId = supplierMember;
        }
      }
      // case new supplier contact, only email =>
      else {
        supplierContactEmailChecked = self.refs.supplierContactEmail.value;
        // mail control validateEmail
        if (Utils.validateEmail(supplierContactEmailChecked) == false) {
          isOk = false;
          toastr.error(
            self.props.Resources.ContentManagement.ContentRequestErrorIncorrectMailAdress
          );
        } else {
          supplierType = 'supplierManufExternal';
        }
      }
    }
    // case supplier "independant" =>
    else {
      var isSupplierMember = self.state.checkSupplier;
      supplierId = self.state.requestSelectedSupplier.SupplierId;
      supplierType = 'supplierAlone';
    }

    if (isOk) {
      fetch(
        `${API_URL}/api/ws/v1/request/content/${self.props.ManagementCloudId}/assign/${currentRequest}?token=${self.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            SupplierType: supplierType,
            SupplierId: supplierId,
            SupplierManufacturerId: supplierManufacturerId,
            SupplierContactEmail: supplierContactEmailChecked,
            AssignComments: requestComment,
          }),
        }
      )
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          }

          continueAfterRequest = false;
          const jsonResponse = JSON.parse(response);
          toastr.error(jsonResponse.ModelState);
        })
        .then((json) => {
          if (continueAfterRequest) {
            // in all cases, we have to send information to supplier:
            const supplierIdToSend = json;
            fetch(
              `${API_URL}/api/ws/v1/request/content/${currentRequest}/supplier/${supplierIdToSend}/invit?token=${self.props.TemporaryToken}`,
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
              }
            );

            if (
              supplierType != 'supplierManufExternal' &&
              supplierManufacturerId != null &&
              supplierManufacturerId > 0
            ) {
              const data = self.state.contentRequestDatas;

              const currentUrl = window.location.href;
              let contenRequestShorcut = `${currentUrl}?openrequestdetails=true&requestid=${currentRequest}`;

              if (isSupplierManufacturer) {
                // Link to platform for manufacturer supplier
                let manufacturer = Utils.removeDiacritics(supplierName).toLowerCase();
                manufacturer = manufacturer.trim().replace(' ', '-');
                const urlManufacturerCR = `${self.props.PlatformUrl}/${self.props.Language}/manufacturers/${supplierManufacturerId}-${manufacturer}/edit/contentrequests`;
                contenRequestShorcut = `${urlManufacturerCR}?contentRequest=${currentRequest}`;
              }

              const subject = `${self.props.Resources.ContentRequestMessage.ProjectLabel} ${data.ProjectName} ${self.props.Resources.ContentRequestMessage.AboutLabel} ${data.ObjectName}`;

              let messageHeader = self.props.Resources.ContentRequestMessage.AssignMessageHeaderV2;

              if (messageHeader != null) {
                messageHeader = messageHeader.replace('[ObjectName]', data.ObjectName);
                messageHeader = messageHeader.replace(
                  '[ObjectDescription]',
                  data.DescriptionAndComments
                );
                messageHeader = messageHeader.replace('[Comments]', data.Comments);
              }

              let messageLink = self.props.Resources.ContentRequestMessage.AssignMessageLinkV2;

              if (messageLink != null) {
                messageLink = messageLink.replace('[ContentRequestLink]', contenRequestShorcut);
              }

              const content = messageHeader + messageLink;

              // send informations to supplier following
              if (supplierType == 'supplierManuf') {
                supplierId = supplierTrueId;
              }
              self.createNewConversationRequest(
                subject,
                content,
                self.props.EntityId,
                supplierId,
                currentRequest,
                supplierManufacturerId,
                'manufacturer',
                self.props.EntityType,
                requestComment
              );

              toastr.success(self.props.Resources.ContentManagement.ContentRequestUpdated);
              self.refreshPage();
              self.handleCloseModalSelectSupplier();
            } else {
              toastr.success(self.props.Resources.ContentManagement.ContentRequestUpdated);
              self.refreshPage();
              self.handleCloseModalSelectSupplier();
            }
          }
        });
    }
  },

  createNewConversationRequest(
    subject,
    content,
    senderId,
    partnerId,
    requestId,
    receiverId,
    receiverType,
    senderType,
    optionalMessage
  ) {
    const self = this;
    // create conversation
    fetch(
      `${API_URL}/api/ws/v1/message/new?token=${self.props.TemporaryToken}&contentManagementId=${self.props.ManagementCloudId}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Subject: subject,
          Content: content,
          SenderId: senderId,
          SenderType: senderType,
          Receivers: [{ ReceiverId: receiverId, ReceiverType: receiverType }],
          CreateNewConversation: true,
        }),
      }
    )
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }

        toastr.error(response.statusText);
      })
      .then((json) => {
        if (json != 'error' && json != undefined) {
          self.setState({ actualConversation: json[0].MessageId });

          // add conversation to content request
          fetch(
            `${API_URL}/api/ws/v1/request/content/${self.props.ManagementCloudId}/edit/${requestId}?token=${self.props.TemporaryToken}`,
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                CurrentConversation: json[0].MessageId,
              }),
            }
          );

          // Envoie du message optionel de l'administrateur
          if (optionalMessage.trim() != '') {
            const ReplyViewModel = {
              MessageId: json[0].MessageId,
              Content: optionalMessage,
              SenderEntityId: senderId,
              SenderEntityType: senderType,
              IsGroupConversation: senderType != 'user',
            };

            fetch(`${API_URL}/api/ws/v1/message/reply` + `?token=${self.props.TemporaryToken}`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(ReplyViewModel),
            }).then((response) => {
              self.openAndLoadConversation(self.state.actualConversation);
            });
          } else {
            self.openAndLoadConversation(self.state.actualConversation);
          }
        }
      });
  },

  clickButtonMessage(event) {
    const messageid = event.currentTarget.dataset.id;
    this.openAndLoadConversation(messageid);
  },

  openAndLoadConversation(messageId) {
    if (messageId > 0) {
      this.setState({ actualConversation: messageId });
      $('#message-request-modal').modal('show');
    }
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

  getTeamMemberPlanningDetails(memberId) {
    const self = this;
    fetch(
      `${API_URL}/api/ws/v1/request/content/${this.props.ManagementCloudId}/queues/${memberId}?token=${this.props.TemporaryToken}`,
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
          self.setState({ teamMemberPlanning: json });
        }
      });
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
    } else if (requestState == 'validated') {
      objectStateId = 6;
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

  updateRequestUserAssigned(value) {
    const self = this;
    if (value != undefined && value != null && value != 0) {
      const userArray = this.state.teamMemberList;
      const userIndex = _.findIndex(userArray, { UserId: value });

      self.setState({
        currentUserAvatar: userArray[userIndex].UserAvatar,
        requestSelectedTeamMemberId: value,
        teamPlanningButton: '',
      });
      this.getTeamMemberPlanningDetails(value);
    }
  },

  updateRequestSupplierAssigned(supplier) {
    const self = this;

    const supplierArray = this.state.suppliersListItem;
    const isManufacturer = supplier.ManufacturerId != null;

    let supplierId = isManufacturer ? supplier.ManufacturerId : supplier.SupplierId;
    supplierId = parseInt(supplierId, 10);
    const supplierIndex = _.findIndex(supplierArray, { ManufacturerId: supplierId });

    // if he has some manufacturer id, he is a manufacturer, else, he his just a supplier
    self.setState({
      requestSelectedSupplier: supplier,
      isSupplierManufacturer: isManufacturer,
      supplierValidation: supplier == 0 ? 'hidden' : '',
    });
    self.setSupplierContactValues(supplierIndex);
  },

  changeSupplierContact(event, index, value) {
    const self = this;
    const targetBox = event.target.id;
    const targetCheck = event.target.checked;

    if (targetBox == 'supplier') {
      if (targetCheck == true) {
        self.setState({ checkSupplier: true, checkContact: false, showSupplierContact: 'hidden' });
      } else {
        self.setState({ checkSupplier: false, checkContact: true, showSupplierContact: '' });
      }
    } else if (targetBox == 'contact') {
      if (targetCheck == true) {
        self.setState({ checkSupplier: false, checkContact: true, showSupplierContact: '' });
      } else {
        self.setState({ checkSupplier: true, checkContact: false, showSupplierContact: 'hidden' });
      }
    }
  },

  setSupplierContactValues(sIndex) {
    if (sIndex != -1) {
      const contactList = this.state.suppliersListItem[sIndex];
      this.setState({
        supplierContactsList: contactList.SupplierManufacturerDetailsList,
        supplierButtons: '',
      });
    } else {
      this.setState({ supplierButtons: 'hidden' });
    }
  },

  updateSupplierManufMember(event) {
    this.setState({ supplierManufMemberId: event.target.value });
  },

  confirmAcceptRequest() {
    const self = this;
    store.dispatch({ type: 'LOADER', state: true });
    const commentsAccept = self.refs.commentsAcceptContentRequest.value;

    fetch(
      `${API_URL}/api/ws/v1/request/content/${this.props.ManagementCloudId}/user/accept/${self.state.requestToUpdate}?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          AssignComments: commentsAccept,
        }),
      }
    ).then((response) => {
      if (response.status == 200) {
        store.dispatch({ type: 'LOADER', state: false });
        $('#accept-request-details').modal('hide');
        self.refreshPage();
      } else {
        store.dispatch({ type: 'LOADER', state: false });
        const jsonResponse = JSON.parse(response);
        toastr.error(jsonResponse.ModelState);
      }
    });
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

  openChooseRequestIssue(event) {
    event.preventDefault();
    const requestid = event.currentTarget.dataset.id;
    this.setState({ requestToUpdate: requestid });
    this.getContentRequestDetails(requestid, 'request-accept-reject');
    $('#select-request-accept-reject').modal('show');
  },

  CloseAndOpen(event) {
    $('#select-request-accept-reject').modal('hide');
    $('#select-request-user-manufacturer').modal('show');
  },

  CloseAndOpen2(requestType) {
    $('#select-request-user-manufacturer').modal('hide');
    if (requestType == 'team') {
      this.setState({
        requestSelectedTeamMemberId: '',
        commentsContentRequestTeam: '',
        modalSelectmembersOpen: true,
      });
    } else if (requestType == 'suppliers') {
      this.setState({
        commentsContentRequestSupplier: '',
        modalSelectSupplierOpen: true,
        supplierButtons: this.state.requestSelectedSupplier != null ? '' : 'hidden',
        supplierValidation: this.state.requestSelectedSupplier != null ? '' : 'hidden',
        supplierManufMemberId: '',
      });
    }
  },

  ConfirmToReject(event) {
    $('#select-request-accept-reject').modal('hide');
    $('#confirm-reject-request #commentsRejectContentRequest').val('');
    $('#confirm-reject-request').modal('show');
  },

  confirmCloseModal(event) {
    $('#confirm-close-modal').modal({ backdrop: 'static', keyboard: false });
  },

  closeEditionModal(event) {
    $('#confirm-close-modal').modal('hide');
  },

  closeConfirmClose(event) {
    $('#confirm-close-modal').modal('hide');
    $('#content-request-details').modal();
  },

  openModalRequestObject(event, requestid) {
    this.setState({ requestToUpdate: requestid });
    $('#select-request-object-assignement').modal('show');
  },

  showHidePlanning() {
    if (this.state.teamPlanningModal == 'hidden') {
      this.setState({ teamPlanningModal: '', planningArrow: '<KeyboardArrowUpIcon />' });
    } else {
      this.setState({ teamPlanningModal: 'hidden', planningArrow: '<KeyboardArrowDownIcon />' });
    }
  },

  showRequestDetails(event, index, values) {
    const requestId = event.currentTarget.dataset.requestid;
    if (requestId != undefined) {
      this.getContentRequestDetails(requestId, 'content-request-details');
    }
  },

  saveAndUpdateRequest(contentRequestDatas) {
    const self = this;

    let referenceIsEmpty;
    let referenceIsDuplicate = false;

    if (contentRequestDatas.VariantList.length > 0) {
      const variantList = contentRequestDatas.VariantList;

      _.each(variantList, (variant, i) => {
        if (variant.Reference.trim() == '') {
          referenceIsEmpty = true;
        }

        if (!referenceIsEmpty) {
          const duplicateVariant = _.filter(
            variantList,
            (v) => v.Reference.trim() == variant.Reference.trim()
          );

          if (duplicateVariant != null && duplicateVariant.length > 1) {
            referenceIsDuplicate = true;
          }
        }
      });
    }

    // request name
    if (contentRequestDatas.ProjectName.value == '') {
      toastr.error(this.props.Resources.ContentManagement.CreateContentRequestErrorProjectName);
    }
    // request date
    else if (
      contentRequestDatas.EndDate == null ||
      contentRequestDatas.EndDate == undefined ||
      contentRequestDatas.EndDate == ''
    ) {
      toastr.error(this.props.Resources.ContentManagement.CreateContentRequestErrorEndDate);
    }
    // object name
    else if (contentRequestDatas.ObjectName.value == '') {
      toastr.error(this.props.Resources.ContentManagement.CreateContentRequestErrorObjectName);
    }
    // description
    else if (contentRequestDatas.Description == '') {
      toastr.error(this.props.Resources.ContentManagement.CreateContentRequestErrorDescription);
    }
    // Variants
    else if (referenceIsEmpty) {
      toastr.error(this.props.Resources.ContentManagement.CreateContentRequestErrorReference);
    } else if (referenceIsDuplicate) {
      // Référence de variant en double
      toastr.error(this.props.Resources.ContentManagement.CreateContentRequestDuplicateReference);
    }
    // softwares
    else if (contentRequestDatas.SoftwaresListRequired.length < 1) {
      toastr.error(this.props.Resources.ContentManagement.CreateContentRequestErrorSoftwares);
    }
    // documents types
    else if (
      contentRequestDatas.DocumentsWanted.indexOf('Other') > -1 &&
      contentRequestDatas.OtherDocumentName.value == ''
    ) {
      toastr.error(this.props.Resources.ContentManagement.CreateContentRequestErrorOtherDocName);
    }
    // levels of details
    else if (contentRequestDatas.RequestLods.length < 1) {
      toastr.error(this.props.Resources.ContentManagement.CreateContentRequestErrorLod);
    }
    // classifications
    else if (contentRequestDatas.ObjectClassifications.length < 1) {
      toastr.error(this.props.Resources.ContentManagement.CreateContentRequestErrorClassifications);
    }
    // if good, build object and send it to webservice
    else {
      store.dispatch({ type: 'LOADER', state: true });
      const token = self.props.TemporaryToken;

      const tagsList = [];
      _.map(contentRequestDatas.TagsList, (tag, i) => {
        const tagId = tag.split('#')[0];
        tagsList.push(tagId);
      });

      const classifsList = [];
      _.map(contentRequestDatas.ObjectClassifications, (classif, i) => {
        const classifNodeId = classif.split('#')[1];
        classifsList.push(classifNodeId);
      });

      fetch(`${API_URL}/api/ws/v1/request/content/update?token=${token}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          RequestId: self.state.requestToUpdate,
          OnFlyId: self.props.ManagementCloudId,
          Description: contentRequestDatas.Description,
          CommentsModeler: contentRequestDatas.CommentsModeler,
          ProjectName: contentRequestDatas.ProjectName.value,
          EndDate: contentRequestDatas.EndDate,
          ObjectType: contentRequestDatas.ObjectType,
          ObjectName: contentRequestDatas.ObjectName.value,
          SoftwaresListRequired: contentRequestDatas.SoftwaresListRequired,
          RequestLods: contentRequestDatas.RequestLods,
          DocumentsWanted: contentRequestDatas.DocumentsWanted,
          OtherDocumentName: contentRequestDatas.OtherDocumentName.value,
          ObjectClassifications: classifsList,
          RequestUnit: contentRequestDatas.RequestUnit,
          TagsList: tagsList,
          SupplierId: contentRequestDatas.SupplierId,
          ContentRequestVariantList: contentRequestDatas.VariantList,
          SupplierName: contentRequestDatas.SupplierName,
        }),
      })
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          }
          store.dispatch({ type: 'LOADER', state: false });
          const jsonResponse = JSON.parse(response.text);
          toastr.error(jsonResponse.ModelState);
        })
        .then((json) => {
          // if some documents deleted
          if (contentRequestDatas.LinkedDocumentsToRemove.length > 0) {
            fetch(
              `${API_URL}/api/ws/v1/request/content/${self.state.requestToUpdate}/additionaldocument/remove?token=${token}`,
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Documents: contentRequestDatas.LinkedDocumentsToRemove }),
              }
            );
          }
        })
        .then((json) => {
          // if some documents, we upload them after updating request
          if (contentRequestDatas.LinkedDocuments.length > 0) {
            // addeds doc
            const data = new FormData();
            const addedDocs = [];

            // get only added docs
            _.each(contentRequestDatas.LinkedDocuments, (doc, i) => {
              if (doc.type != undefined) {
                addedDocs.push(doc);
              }
            });

            if (addedDocs.length > 0) {
              _.each(addedDocs, (doc, i) => {
                if (doc.type != undefined) {
                  data.append(`file${[i]}`, doc);
                }
              });

              $.ajax({
                type: 'POST',
                url: `${API_URL}/api/ws/v1/request/content/${self.state.requestToUpdate}/additionaldocument?token=${token}`,
                data,
                processData: false,
                contentType: false,
                async: true,
              });
            }
          }
        })
        .then((json) => {
          store.dispatch({ type: 'LOADER', state: false });
          toastr.success(self.props.Resources.ContentManagement.ContentRequestSendedMessage);
          self.setState({ checkClosingRequestModal: false, modalDetailsOpen: false });
          $('#confirm-close-modal').modal('hide');
          self.refreshPage();
        });
    }
  },

  changeActualAssignedObject(event) {
    this.searchUserLastObjects('');
    $('#link-existing-object').modal('show');
    $('#content-request-details').modal('hide');
  },

  createSortHandler(event) {
    const columId = event.target.parentElement.dataset.id;
    this.handleRequestSort(columId);
  },

  handleRequestSort(property) {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    let data;

    if (property === 'DueDate') {
      data =
        order === 'desc'
          ? this.state.selectedContentRequests.sort((a, b) => {
              a = a.DueDate.split('-').reverse().join('');
              b = b.DueDate.split('-').reverse().join('');
              return a > b ? 1 : a < b ? -1 : 0;
            })
          : this.state.selectedContentRequests.sort((a, b) => {
              a = a.DueDate.split('-').reverse().join('');
              b = b.DueDate.split('-').reverse().join('');
              return a < b ? 1 : a > b ? -1 : 0;
            });
    } else {
      data =
        order === 'desc'
          ? this.state.selectedContentRequests.sort((a, b) =>
              b[orderBy].toLowerCase() < a[orderBy].toLowerCase() ? -1 : 1
            )
          : this.state.selectedContentRequests.sort((a, b) =>
              a[orderBy].toLowerCase() < b[orderBy].toLowerCase() ? -1 : 1
            );
    }

    this.setState({ selectedContentRequests: data, order, orderBy });
  },

  scrollMessageToBottom() {
    const $chat = $('#list-message-conversation');
    const scrollHeightChat = $chat.prop('scrollHeight');

    if (scrollHeightChat > 0) {
      $chat.scrollTop(scrollHeightChat);
    }
  },

  handleCloseModalDetails() {
    this.setState({ modalDetailsOpen: false });
  },

  handleCloseModalSelectmembers() {
    this.setState({ modalSelectmembersOpen: false });
  },

  commentsContentRequestSupplier(event) {
    this.setState({ commentsContentRequestSupplier: event.target.value });
  },

  commentsContentRequestTeam(event) {
    this.setState({ commentsContentRequestTeam: event.target.value });
  },

  handleCloseModalSelectSupplier() {
    this.setState({ modalSelectSupplierOpen: false });
  },

  render() {
    const self = this;

    let supplierButton = '';
    let contentRequestCreateNewObject = '';
    if (!this.props.IsBoostOffer) {
      supplierButton = (
        <div className="col-xs-11 col-xs-offset-1 text-center">
          <a data-toggle="modal" onClick={() => self.CloseAndOpen2('suppliers')}>
            <PersonOutlineIcon aria-hidden="true" />
            <span>{self.props.Resources.ContentManagement.ContentRequestAssignSupplier}</span>
          </a>
        </div>
      );

      contentRequestCreateNewObject = (
        <div className="col-xs-11 text-center">
          <a data-toggle="modal" onClick={self.createRequestObject}>
            <img src="../../../Content/images/creerNouvelObjet.svg" width="98" height="98" alt="" />
            <span>{self.props.Resources.ContentManagement.ContentRequestCreateNewObject}</span>
          </a>
        </div>
      );
    }

    const suppliersList = _.map(self.state.suppliersListItem, (object, i) => (
      <MenuItem
        key={`suppliersItem-${object.SupplierId}`}
        value={`${object.ManufacturerId}#${object.SupplierId}`}
      >
        <ListItemIcon className="statut-img">
          <Avatar src={self.state.defaultAvatar} />
        </ListItemIcon>
        <ListItemText className="statut-name" primary={object.SupplierName} />
      </MenuItem>
    ));

    const ContactsList = _.map(self.state.supplierContactsList, (object, i) => (
      <MenuItem key={`supplierContacts-${object.SupplierManufId}`} value={object.SupplierManufId}>
        <ListItemIcon className="statut-img">
          <Avatar src={self.state.defaultAvatar} />
        </ListItemIcon>
        <ListItemText inset className="statut-name" primary={object.SupplierManufName} />
      </MenuItem>
    ));

    const teamMemberToDoList = _.map(self.state.teamMemberPlanning, (object, i) => {
      let requestStateLogo;
      if (object.RequestState == 'draft') {
        requestStateLogo = (
          <span style={{ color: '#a4a4a4' }}>
            <img src="../Content/images/icon-draft.svg" />{' '}
            {self.props.Resources.ContentManagement.ContentRequestStatutDraft}
          </span>
        );
      } else if (object.RequestState == 'rejected') {
        requestStateLogo = (
          <span style={{ color: '#eb4658' }}>
            <img src="../Content/images/icon-rejete.svg" />{' '}
            {self.props.Resources.ContentManagement.ContentRequestStatutRejected}
          </span>
        );
      } else if (object.RequestState == 'sended') {
        requestStateLogo = (
          <span style={{ color: '#38baca' }}>
            <img src="../Content/images/icon-envoye.svg" />{' '}
            {self.props.Resources.ContentManagement.ContentRequestStatutSended}
          </span>
        );
      } else if (object.RequestState == 'cancelled') {
        requestStateLogo = (
          <span style={{ color: '#f6c533' }}>
            <img src="../Content/images/icon-annule.svg" />{' '}
            {self.props.Resources.ContentManagement.ContentRequestStatutCancelled}
          </span>
        );
      } else if (object.RequestState == 'in_progress') {
        requestStateLogo = (
          <span style={{ color: '#4e6de2' }}>
            <img src="../Content/images/icon-en-cours.svg" />{' '}
            {self.props.Resources.ContentManagement.ContentRequestStatutInProgress}
          </span>
        );
      } else if (object.RequestState == 'completed') {
        requestStateLogo = (
          <span style={{ color: '#22c985' }}>
            <img src="../Content/images/icon-termine.svg" />{' '}
            {self.props.Resources.ContentManagement.ContentRequestStatutComplete}
          </span>
        );
      } else if (object.RequestState == 'validated') {
        requestStateLogo = (
          <span style={{ color: '#22c985' }}>
            <img src="../Content/images/icon-termine.svg" />{' '}
            {self.props.Resources.ContentManagement.ContentRequestStatutValidated}
          </span>
        );
      }

      return (
        <TableRow key={`teamMemberPlanning-${object.RequestId}`} id={object.RequestId}>
          <TableCell>{object.ObjectName}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{object.LastUpdate}</TableCell>
          <TableCell style={{ textAlign: 'right' }}>{requestStateLogo}</TableCell>
        </TableRow>
      );
    });

    const columnData = [
      {
        id: 'RequestObjectName',
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
        id: 'RequestType',
        numeric: false,
        label: self.props.Resources.ContentManagement.ContentRequestColumnType,
        sortable: true,
        classname: 'col-type',
      },
      {
        id: 'DueDate',
        numeric: false,
        label: self.props.Resources.ContentManagement.ContentRequestColumnWantedDate,
        sortable: true,
        classname: 'col-date',
      },
      {
        id: 'RequestFrom',
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
      {
        id: 'acceptReject',
        numeric: false,
        label: self.props.Resources.ContentManagement.ContentRequestColumnObjectAcceptReject,
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

    const awesomeContentRequestsUserRequests = _.map(
      self.state.selectedContentRequests,
      (object, i) => {
        let objectButton = null;
        if (object.RequestedBimObjectId != null && object.RequestedBimObjectId != 0) {
          objectButton = (
            <Link to={`/${self.props.Language}/bimobject/${object.RequestedBimObjectId}/details`}>
              <ReplyIcon style={{ color: DisplayDesign.acidBlue, transform: 'scaleX(-1)' }} />
            </Link>
          );
        } else if (
          object.RequestState == 'draft' ||
          object.RequestState == 'cancelled' ||
          object.RequestState == 'rejected'
        ) {
          objectButton = <NoteAddIcon style={{ color: '#a4a4a4', transform: 'scaleX(-1)' }} />;
        } else {
          objectButton = (
            <NoteAddIcon
              style={{ color: DisplayDesign.acidBlue, transform: 'scaleX(-1)' }}
              data-id={object.RequestId}
              onClick={(event) => self.openModalRequestObject(event, object.RequestId)}
            />
          );
        }

        let messageLink = null;

        if (object.CurrentConversation == 0 || object.CurrentConversation == undefined) {
          messageLink = (
            <MessageIcon
              style={{ color: '#a4a4a4' }}
              data-id={object.CurrentConversation}
              data-message="true"
            />
          );
        } else {
          messageLink = (
            <MessageIcon
              style={{ color: DisplayDesign.acidBlue, cursor: 'pointer' }}
              data-id={object.CurrentConversation}
              data-message="true"
              onClick={self.clickButtonMessage}
            />
          );
        }

        let acceptRejectButton = null;
        if (object.RequestState == 'rejected' || object.RequestState == 'cancelled') {
          acceptRejectButton = <CancelIcon style={{ color: '#f6c533' }} />;
        } else if (object.RequestState == 'draft') {
          acceptRejectButton = (
            <Button
              variant="contained"
              style={{ borderRadius: '12px' }}
              data-id={object.RequestId}
              onClick={self.openChooseRequestIssue}
            >
              {self.props.Resources.ContentManagement.ContentRequestButtonRule}
            </Button>
          );
        } else {
          acceptRejectButton = <CheckCircleIcon style={{ color: '#22c985' }} />;
        }

        let description = object.RequestObjectDescription;
        if (description != null && description.length > 25) {
          description = `${description.substring(0, 25)}...`;
        }

        const statutCellClassName = `statut-cell-${object.RequestState}`;

        // adaptative panel choices
        let adaptativeMenu;

        // if (object.RequestState == 'draft') {
        adaptativeMenu = (
          <FormControl fullWidth>
            <Select
              displayEmpty
              className={statutCellClassName}
              value={`${object.RequestState}#${object.RequestId}`}
              data-status={object.RequestState}
              onChange={self.updateRequestStatus}
              disableUnderline
            >
              <MenuItem key={`draft#${object.RequestId}`} value={`draft#${object.RequestId}`}>
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

              <MenuItem key={`sended#${object.RequestId}`} value={`sended#${object.RequestId}`}>
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
                key={`in_progress#${object.RequestId}`}
                value={`in_progress#${object.RequestId}`}
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

              <MenuItem key={`rejected#${object.RequestId}`} value={`rejected#${object.RequestId}`}>
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

              <MenuItem
                key={`cancelled#${object.RequestId}`}
                value={`cancelled#${object.RequestId}`}
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
                key={`completed#${object.RequestId}`}
                value={`completed#${object.RequestId}`}
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
                key={`validated#${object.RequestId}`}
                value={`validated#${object.RequestId}`}
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

        return (
          <TableRow key={`selectedContentRequests-${object.RequestId}`}>
            <TableCell
              className="col-name"
              data-requestid={object.RequestId}
              onClick={self.showRequestDetails}
              style={{ cursor: 'pointer' }}
            >
              {object.RequestObjectName}
            </TableCell>
            <TableCell
              className="col-description"
              title={object.RequestObjectDescription}
              data-requestid={object.RequestId}
              onClick={self.showRequestDetails}
              style={{ cursor: 'pointer' }}
            >
              {' '}
              {description}{' '}
            </TableCell>
            <TableCell
              className="col-type"
              data-requestid={object.RequestId}
              onClick={self.showRequestDetails}
              style={{ cursor: 'pointer' }}
            >
              {object.RequestType}
            </TableCell>
            <TableCell
              className="col-date"
              data-requestid={object.RequestId}
              onClick={self.showRequestDetails}
              style={{ cursor: 'pointer' }}
            >
              {object.DueDate}
            </TableCell>
            <TableCell
              className="col-from"
              data-requestid={object.RequestId}
              onClick={self.showRequestDetails}
              style={{ cursor: 'pointer' }}
            >
              {object.RequestFrom}
            </TableCell>
            <TableCell className="col-message">{messageLink}</TableCell>
            <TableCell className="col-statut">{adaptativeMenu}</TableCell>
            <TableCell>{objectButton}</TableCell>
            <TableCell className="col-validation">{acceptRejectButton}</TableCell>
          </TableRow>
        );
      }
    );

    const searchResultTable = _.map(self.state.objectSearchResults.Documents, (object, i) => {
      const date = object.UpdatedAt.toString();
      const year = date.substr(0, 4);
      const month = date.substr(4, 2);
      const day = date.substr(6, 2);

      return (
        <TableRow key={`objectSearchResultsDocuments-${object.Id}`} data-requestid={object.Id}>
          <TableCell>
            <Avatar src={object.Photo} />
          </TableCell>
          <TableCell>{object.Name}</TableCell>
          <TableCell>{`${day}-${month}-${year}`}</TableCell>
          <TableCell>
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

    let changeAssignedObject;
    const currentRequestDetailsObject = self.state.contentRequestDetails.RequestedBimObjectId;
    if (
      currentRequestDetailsObject != null &&
      currentRequestDetailsObject != null &&
      currentRequestDetailsObject != 0 &&
      self.state.contentRequestDetails.RequestState != 'draft' &&
      self.state.contentRequestDetails.RequestState != 'cancelled' &&
      self.state.contentRequestDetails.RequestState != 'rejected' &&
      self.state.contentRequestDetails.RequestState != 'validated'
    ) {
      changeAssignedObject = (
        <div id="refresh-object-assigned" className="row">
          <h5 className="modal-title" id="myModalLabel">
            {self.props.Resources.ContentManagement.ContentRequestChangeAssignedObject}
          </h5>
          <Fab size="small" onClick={self.changeActualAssignedObject}>
            <RefreshIcon />
          </Fab>
        </div>
      );
    }

    return (
      <div className="container-fluid">
        <div className="cr-top mui-fixed">
          <div className="row bandeau-title bt-admin">
            <div className="col-stat-request col-md-4 col-md-offset-5 col-xs-offset-5 text-center">
              <div className="round-number">{self.state.draft}</div>
            </div>
            <div className="col-stat-request col-sm-5 col-md-2 col-xs-offset-1 text-center">
              <div className="round-number">{self.state.inProgress}</div>
            </div>
            <div className="col-stat-request col-sm-4 col-md-4 col-xs-offset-1 text-center">
              <div className="round-number">{self.state.completed}</div>
            </div>
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
                  className={`tab-classif col-xs-7 col-xs-offset-1 col-sm-5 col-sm-offset-4 col-md-4 col-md-offset-5${
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
                    {
                      self.props.Resources.ContentManagement
                        .ContentRequestAdminRequestsToBeProcessed
                    }
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
                    {self.props.Resources.ContentManagement.ContentRequestAdminReceivedRequests}
                  </a>
                  <div className="border-color" />
                </li>
                <li
                  className={`tab-classif col-xs-7 col-sm-5 col-md-4${
                    this.state.currentRequestpage == 3 ? ' active' : ''
                  }`}
                >
                  <a
                    href=""
                    data-toggle="tab"
                    aria-expanded="true"
                    data-id="3"
                    onClick={self.changeRequestList}
                  >
                    {self.props.Resources.ContentManagement.ContentRequestAdminProcessedRequests}
                  </a>
                  <div className="border-color" />
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <Paper className="row table-request tr-admin">
          <h3 className="table-title">{self.state.resultListHeaderLabel}</h3>
          <Table>
            <TableHead id="awesomeTableHeader" style={{ width: '100%' }}>
              <TableRow>{awesomeTableHead}</TableRow>
            </TableHead>
            <TableBody>{awesomeContentRequestsUserRequests}</TableBody>
          </Table>
        </Paper>

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
                <CloseIcon className="close" data-toggle="modal" data-dismiss="modal" />
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
          id="link-existing-object"
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
                    <SearchIcon
                      style={{
                        position: 'absolute',
                        top: 32,
                        width: 20,
                        height: 20,
                      }}
                    />
                    <TextField
                      id="linkObjectSearch"
                      placeholder={
                        self.props.Resources.ContentManagement.ContentRequestSearchObject
                      }
                      onChange={self.handleUpdateInputObjectAssociationSearch}
                      fullWidth
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
                      fullWidth
                      onClick={self.redirectCreatedObject}
                      className="redirect-content-request-created-object"
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
          id="select-request-accept-reject"
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
                    <div className="col-xs-11 text-center">
                      <a data-toggle="modal" onClick={self.CloseAndOpen}>
                        <img
                          src="../../../Content/images/AccepterLaRequete.svg"
                          width="98"
                          height="98"
                          alt=""
                        />
                        <span>
                          {self.props.Resources.ContentManagement.ContentRequestRequestAccept}
                        </span>
                      </a>
                    </div>
                    <div className="col-xs-11 col-xs-offset-1 text-center">
                      <a data-toggle="modal" onClick={self.ConfirmToReject}>
                        <img
                          src="../../../Content/images/RejeterLaRequete.svg"
                          width="98"
                          height="98"
                          alt=""
                        />
                        <span>
                          {self.props.Resources.ContentManagement.ContentRequestRequestReject}
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
          id="select-request-user-manufacturer"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" id="myModalLabel">
                  {self.props.Resources.ContentManagement.ContentRequestAssignChoice}
                </h4>
                <CloseIcon className="close" data-toggle="modal" data-dismiss="modal" />
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-11 text-center">
                      <a data-toggle="modal" onClick={() => self.CloseAndOpen2('team')}>
                        <PersonIcon aria-hidden="true" />
                        <span>
                          {self.props.Resources.ContentManagement.ContentRequestAssignTeam}
                        </span>
                      </a>
                    </div>
                    {supplierButton}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="confirm-reject-request"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" id="myModalLabel">
                  {self.props.Resources.ContentManagement.ContentRequestRejectTitle}
                </h4>
                <CloseIcon className="close" data-toggle="modal" data-dismiss="modal" />
              </div>
              <div className="modal-body">
                {this.props.Resources.ContentManagement.ContentRequestRejectText}
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-23">
                      <TextField
                        id="commentsRejectContentRequest"
                        inputRef={(ref) => (self.commentsRejectContentRequest = ref)}
                        style={{ width: '100%' }}
                        fullWidth
                        rows={4}
                        placeholder={
                          this.props.Resources.ContentManagement.ContentRequestMessageMandatory
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Button className="btn-flat" data-dismiss="modal">
                  {self.props.Resources.MetaResource.Cancel}
                </Button>
                <Button
                  onClick={self.rejectContentRequest}
                  id="confirm-deletion-button"
                  className="btn-raised red"
                >
                  {self.props.Resources.MetaResource.Confirm}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Modal
          open={this.state.modalSelectmembersOpen}
          onClose={this.handleCloseModalSelectmembers}
          id="accept-request-select-team-member"
          style={{ overflowY: 'auto' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" id="myModalLabel">
                  {self.props.Resources.ContentManagement.ContentRequestAssignRequestTo}
                </h4>
                <button
                  type="button"
                  className="close"
                  onClick={this.handleCloseModalSelectmembers}
                >
                  <CloseIcon aria-hidden="true" />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <div className="row">
                    <AutocompleteMember
                      TemporaryToken={self.props.TemporaryToken}
                      ManagementCloudId={self.props.ManagementCloudId}
                      SelectMember={self.updateRequestUserAssigned}
                      Resources={self.props.Resources}
                    />
                  </div>

                  <div className="row">
                    <div className={self.state.teamPlanningModal}>
                      <Table maxheight={300}>
                        <TableBody>{teamMemberToDoList}</TableBody>
                      </Table>
                    </div>
                    <div className={self.state.teamPlanningButton}>
                      <Button
                        fullWidth
                        onClick={self.showHidePlanning}
                        className="see-planning-button"
                      >
                        {self.props.Resources.ContentManagement.ContentRequestAssignTeamSeePlanning}
                        {self.state.planningArrow}
                      </Button>
                      <Button
                        fullWidth
                        onClick={self.validateRequestTeamMember}
                        className="assign-content-request-button"
                      >
                        {self.props.Resources.ContentManagement.ContentRequestAssignSendRequest}
                      </Button>
                      <TextField
                        id="commentsContentRequestTeam"
                        style={{ width: '100%' }}
                        fullWidth
                        rows={4}
                        placeholder={
                          this.props.Resources.ContentManagement.ContentRequestMessageOptional
                        }
                        multiline
                        InputLabelProps={{
                          className: 'label-for-multiline',
                        }}
                        value={self.state.commentsContentRequestTeam}
                        onChange={self.commentsContentRequestTeam}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        <Modal
          open={this.state.modalSelectSupplierOpen}
          onClose={this.handleCloseModalSelectSupplier}
          id="accept-request-select-supplier"
          style={{ overflowY: 'auto' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" id="myModalLabel">
                  {self.props.Resources.ContentManagement.ContentRequestAssignRequestTo}
                </h4>
                <button
                  type="button"
                  className="close"
                  onClick={self.handleCloseModalSelectSupplier}
                >
                  <CloseIcon aria-hidden="true" />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group" id="supplier-selector">
                  <div className="row">
                    <AutocompleteSuppliers
                      TemporaryToken={self.props.TemporaryToken}
                      ManagementCloudId={self.props.ManagementCloudId}
                      SelectSupplier={self.updateRequestSupplierAssigned}
                      Resources={self.props.Resources}
                      SettedSupplierId={
                        self.state.requestSelectedSupplier != null
                          ? self.state.requestSelectedSupplier.SupplierId
                          : null
                      }
                    />
                  </div>

                  <div className="row">
                    <div className={self.state.supplierButtons}>
                      <div className="col-xs-11 choose-member">
                        <FormControlLabel
                          style={{ display: 'inline-flex' }}
                          control={
                            <Checkbox
                              value="supplier"
                              id="supplier"
                              checked={self.state.checkSupplier}
                              onChange={self.changeSupplierContact}
                              checkedIcon={
                                <RadioButtonCheckedIcon style={{ color: DisplayDesign.acidBlue }} />
                              }
                              icon={<RadioButtonUncheckedIcon />}
                            />
                          }
                        />
                        <TextField
                          id="manufSupplierSelected"
                          style={{ display: 'inline-flex' }}
                          select
                          fullWidth
                          label={
                            self.props.Resources.ContentManagement.ContentRequestAssignChooseMember
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                          value={self.state.supplierManufMemberId}
                          onChange={self.updateSupplierManufMember}
                        >
                          {ContactsList}
                        </TextField>
                      </div>
                      <div className="col-xs-11 col-xs-offset-1 supplier-contact">
                        <FormControlLabel
                          style={{ display: 'inline-flex' }}
                          control={
                            <Checkbox
                              value="contact"
                              id="contact"
                              checked={self.state.checkContact}
                              onChange={self.changeSupplierContact}
                              checkedIcon={
                                <RadioButtonCheckedIcon style={{ color: DisplayDesign.acidBlue }} />
                              }
                              icon={<RadioButtonUncheckedIcon />}
                            />
                          }
                          label={
                            self.props.Resources.ContentManagement
                              .ContentRequestAssignSupplierContact
                          }
                          labelPlacement="end"
                        />
                      </div>

                      <div
                        className={`${self.state.showSupplierContact} col-xs-21 col-xs-offset-1 email-contact`}
                      >
                        <TextField
                          id="ContentRequestSupplierEmail"
                          fullWidth
                          placeholder={
                            self.props.Resources.ContentManagement
                              .ContentRequestAssignSupplierContactEmail
                          }
                          ref="supplierContactEmail"
                        />
                      </div>
                    </div>

                    <div className={self.state.supplierValidation}>
                      <Button
                        fullWidth
                        onClick={self.validateRequestSupplier}
                        className="assign-content-request-button"
                      >
                        {self.props.Resources.ContentManagement.ContentRequestAssignSendRequest}
                      </Button>
                      <TextField
                        id="commentsContentRequestSupplier"
                        fullWidth
                        rows={4}
                        placeholder={
                          self.props.Resources.ContentManagement.ContentRequestMessageOptional
                        }
                        value={self.state.commentsContentRequestSupplier}
                        onChange={self.commentsContentRequestSupplier}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>

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
              <CloseIcon aria-hidden="true" />
            </button>
          </div>
          {changeAssignedObject}

          <ContentRequest
            TemporaryToken={this.props.TemporaryToken}
            ManagementCloudId={this.props.ManagementCloudId}
            Resources={this.props.Resources}
            Language={this.props.Language}
            Softwares={this.props.Softwares}
            DocumentTypes={this.props.DocumentTypes}
            RequestCondition="Edit"
            UserName=""
            UserLevel="Admin"
            ContentRequestDatas={this.state.contentRequestDatas}
            CancelButtonAction={self.handleCloseModalDetails}
            CancelButtonClass="btn-raised red btn-reset"
            CancelButtonLabel={this.props.Resources.ContentManagement.QuitWithoutSaving}
            ValidButtonAction={self.saveAndUpdateRequest}
            ValidButtonClass="btn-raised btn-send"
            ValidButtonLabel={this.props.Resources.ContentManagement.SaveAndExit}
          />
        </Dialog>

        <div
          className="modal fade"
          id="confirm-close-modal"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" id="myModalLabel">
                  {this.props.Resources.ContentManagement.ContentRequestAdminEditQuitWithoutSaving}
                </h4>
                <CloseIcon className="close" data-toggle="modal" data-dismiss="modal" />
              </div>
              <div className="modal-footer">
                <Button
                  variant="contained"
                  className="btn-raised red btn-reset"
                  onClick={self.handleCloseModalDetails}
                >
                  {this.props.Resources.ContentManagement.QuitWithoutSaving}
                </Button>
                <Button
                  variant="contained"
                  className="btn-raised btn-send"
                  onClick={self.saveAndUpdateRequest}
                >
                  {this.props.Resources.ContentManagement.SaveAndExit}
                </Button>
              </div>
            </div>
          </div>
        </div>

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

    return (
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title" id="modal-message-title">
            {self.state.subject}
          </h4>
          {talkWithUsers}
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <CloseIcon aria-hidden="true" />
          </button>
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
    const content = this.props.object.Content;
    const date = moment(new Date(this.props.object.CreatedAt));
    let classname = '';
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
      const entityType = entityTalk[0].EntityType;
      const entityName = entityTalk[0].EntityName;

      const usersTalk = entityTalk.map((user, i) => {
        const userAvatar = (
          <Avatar
            sizes={AVATAR_SIZE}
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
    PlatformUrl: appState.PlatformUrl,
    IsBoostOffer: selectIsBoostOffer(store),
  };
};

export default ContentRequestAdmin = connect(mapStateToProps)(ContentRequestAdmin);
