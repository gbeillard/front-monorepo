import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import _ from 'underscore';

// api

// material ui elements
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

// material ui icons
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PanoramaFishEyeIcon from '@material-ui/icons/PanoramaFishEye';
import ContactCreatorModal from '../ContactCreatorModal';

import * as ClassificationsApi from '../../Api/ClassificationsApi.js';
import * as LibraryApi from '../../Api/LibraryApi.js';
import * as SearchApi from '../../Api/SearchApi.js';
import ManageObjectsUnderBand from '../CommonsElements/ManageObjectsUnderBand.jsx';
import ManageObjectsTableHeader from '../CommonsElements/ManageObjectsTableHeader.jsx';
import * as Utils from '../../Utils/utils.js';
import AutocompleteGroup from '../Autocomplete/AutocompleteGroup.jsx';
import ClassificationsComponent from '../CommonsElements/ClassificationsComponent.jsx';
import * as DisplayDesign from '../../Utils/displayDesign.js';
import BimObjectRowManageObject from './BimObjectRowManageObject.jsx';
import store from '../../Store/Store';
import SuppressionModal from '../CommonsElements/SuppressionModal.jsx';
import BimObjectRow from './BimObjectRow.jsx';
import { API_URL } from '../../Api/constants';
import * as GroupsApi from '../../Api/GroupsApi.js';
import { history } from '../../history';
import { withRouter } from '../../Utils/withRouter';

let ResultsList = createReactClass({
  getInitialState() {
    return {
      nbColumn: $(window).width() >= 992 ? 2 : 1,
      page: 0,
      selectedObjectToRemove: [],
      headerTitle: null,
      bodyContent: null,
      abortButtonTitle: null,
      abortButtonAction: null,
      confirmButtonTitle: null,
      confirmButtonAction: null,
      urlImage: null,
      selectedObjects: [],
      disableSelection: false,
      anchorMenuStatus: null,
      orderBy: this.props.InitialRequest.SearchSorting.Name,
      order: this.props.InitialRequest.SearchSorting.Order,
      filterColumnId: '',
      sortClassifPopInIsOpen: false,
      anchorSortClassifPopIn: null,
      sortAvailabilityPopInIsOpen: false,
      anchorAvailabilitySortPopIn: null,
      inputclassifSearch: '',
      classificationsList: [],
      classificationsListSelect: [],
      projectsListSelect: [],
      classificationsListSelectMulti: [],
      switchSelectCheckedClassifs: true,
      switchSelectCheckedProjects: true,
      selectedObjectMono: null,
      classifInputSearch: '',
      filterClassifActive: false,
      filterProjectActive: false,
      addProjectsPopInIsOpen: false,
      anchorAddProjectsPopIn: null,
      selectedObjectMulti: -1,
      contactCreatorMessage: null,
    };
  },

  componentWillReceiveProps(nextProps) {
    if ((nextProps.page === 0 || nextProps.Page === 0) && this.state.page > 0) {
      this.state.page = 0;
    }
  },

  componentDidMount() {
    if (this.props.refreshCardOpacity != null) {
      window.addEventListener('resize', this.updateNbColumn);
      document.addEventListener('click', this.closeCurrentCard);
    }

    window.addEventListener('scroll', this.scrollAction);

    if (this.props.ScrollPosition != 0 && this.props.ScrollPosition != window.scrollY) {
      window.scroll(0, this.props.ScrollPosition);
    }

    if (
      this.props.CurrentGroups.GroupsList == null ||
      this.props.CurrentGroups.GroupsList == undefined
    ) {
      GroupsApi.getGroups(this.props.TemporaryToken, this.props.ManagementCloudId);
    }
  },

  componentDidUpdate() {
    if (this.props.refreshCardOpacity != null) {
      this.props.refreshCardOpacity();
    }
  },

  componentWillUnmount() {
    if (this.props.refreshCardOpacity != null) {
      window.removeEventListener('resize', this.updateNbColumn);
      document.removeEventListener('click', this.closeCurrentCard);
    }

    // save scroll position
    store.dispatch({
      type: `SAVE_SCROLL_POSITION${this.props.SearchContextAction}`,
      scrollPosition: window.scrollY,
    });
    // remove event scroll listener
    window.removeEventListener('scroll', this.scrollAction);
  },

  // START API CALLS
  removeBimObjectFromLibrary() {
    const values = this.state.selectedObjectToRemove;
    LibraryApi.removeBimObjects(
      this.props.ManagementCloudId,
      values,
      this.props.TemporaryToken,
      this.props.UserId,
      this.props.Resources
    );
    this.closeCurrentModal();
  },

  unpublishBimObjectFromLibrary() {
    const value = this.state.selectedObjectToRemove;
    LibraryApi.unpublishBimObjects(
      this.props.ManagementCloudId,
      value,
      this.props.TemporaryToken,
      this.props.Resources
    );
    this.closeCurrentModal();
  },

  publishBimObjectFromLibrary() {
    const value = this.state.selectedObjectToRemove;
    LibraryApi.publishBimObjects(
      this.props.ManagementCloudId,
      value,
      this.props.TemporaryToken,
      this.props.Resources
    );
    this.closeCurrentModal();
  },

  addBimObjectToLibrary(id) {
    const values = [id];

    LibraryApi.addBimObjects(
      this.props.ManagementCloudId,
      values,
      this.props.TemporaryToken,
      this.props.Resources
    );
  },

  loadMore() {
    if (
      (this.props.Page + 1) * this.props.Size == this.props.Data.length &&
      this.state.page == this.props.Page
    ) {
      const fakePage = this.props.Page + 1;
      const size = this.props.Size;

      const newRequest = this.props.Request;
      newRequest.LanguageCode = this.props.Language;
      newRequest.SearchPaging = { From: fakePage * size, Size: size };
      newRequest.IgnoreFacets = true;

      this.setState({ page: fakePage });

      SearchApi.search(
        newRequest,
        this.props.ContextRequest,
        this.props.ManagementCloudId,
        this.props.TemporaryToken,
        true
      );
    }
  },

  // handleChangeAddProjects: function (group) {
  //     return GroupsApi.addObjectsToGroup(this.props.ManagementCloudId, group.Id, this.state.selectedObjects, this.props.TemporaryToken , this.props.Resources, false);
  // },

  // handleCopyObjectToGroup: function (group) {
  //     return GroupsApi.addObjectsToGroup(this.props.ManagementCloudId, group.Id, this.state.selectedObjects, this.props.TemporaryToken , this.props.Resources, true);
  // },

  publishObjectInPrivateCloud(group) {
    const self = this;
    store.dispatch({ type: 'LOADER', state: true });

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${self.props.ManagementCloudId}/privatecloud/associateBimObjectList?token=${self.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ObjectsIds: self.state.selectedObjects }),
      }
    ).then((response) => {
      store.dispatch({ type: 'LOADER', state: false });
      store.dispatch({
        type: 'REFRESH_REQUEST_MANAGE',
        managementcloudId: self.props.ManagementCloudId,
        token: self.props.TemporaryToken,
      });
    });
  },

  publishObjectInBimAndCo(group) {
    const self = this;
    store.dispatch({ type: 'LOADER', state: true });

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${self.props.ManagementCloudId}/bimandco/associateBimObjectList?token=${self.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ObjectsIds: self.state.selectedObjects }),
      }
    ).then((response) => {
      store.dispatch({ type: 'LOADER', state: false });
      store.dispatch({
        type: 'REFRESH_REQUEST_MANAGE',
        managementcloudId: self.props.ManagementCloudId,
        token: self.props.TemporaryToken,
      });
    });
  },

  handleChangeRemoveProjects(event) {
    const self = this;
    const groupId = event.currentTarget.parentElement.dataset.id;
    const url = `${API_URL}/api/ws/v1/contentmanagement/${self.props.ManagementCloudId}/group/${groupId}/dissociateBimObjectList?token=${self.props.TemporaryToken}`;
    store.dispatch({ type: 'LOADER', state: true });

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ObjectsIds: self.state.selectedObjects }),
    }).then((response) => {
      store.dispatch({
        type: 'REFRESH_REQUEST_MANAGE',
        managementcloudId: self.props.ManagementCloudId,
        token: self.props.TemporaryToken,
      });
      store.dispatch({
        type: 'DELETE_OBJECTS_FROM_GROUP',
        objectIds: self.state.selectedObjects,
        groupId,
      });
      store.dispatch({ type: 'LOADER', state: false });
    });
  },

  unpublishObjectListInBimAndCo() {
    const self = this;
    store.dispatch({ type: 'LOADER', state: true });

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${self.props.ManagementCloudId}/bimandco/dissociateBimObjectList?token=${self.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ObjectsIds: self.state.selectedObjects }),
      }
    ).then((response) => {
      store.dispatch({
        type: 'REFRESH_REQUEST_MANAGE',
        managementcloudId: self.props.ManagementCloudId,
        token: self.props.TemporaryToken,
      });
      store.dispatch({ type: 'LOADER', state: false });
    });
  },

  unpublishObjectListPrivateCloud() {
    const self = this;
    store.dispatch({ type: 'LOADER', state: true });

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${self.props.ManagementCloudId}/privatecloud/dissociateBimObjectList?token=${self.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ObjectsIds: self.state.selectedObjects }),
      }
    ).then((response) => {
      store.dispatch({
        type: 'REFRESH_REQUEST_MANAGE',
        managementcloudId: self.props.ManagementCloudId,
        token: self.props.TemporaryToken,
      });
      store.dispatch({ type: 'LOADER', state: false });
    });
  },

  addNodesToObjects() {
    const self = this;
    let data;

    const nodeListId = _.map(self.state.classificationsListSelectMulti, (node) => node.Id);

    if (this.state.selectedObjectMono != null) {
      data = [{ BimObjectId: this.state.selectedObjectMono, NodeListId: nodeListId }];
    } else {
      data = _.map(this.state.selectedObjects, (item) => ({
        BimObjectId: item,
        NodeListId: nodeListId,
      }));
    }

    store.dispatch({ type: 'LOADER', state: true });

    ClassificationsApi.setClassificationNodeForObjectList(
      this.props.TemporaryToken,
      this.props.ManagementCloudId,
      data,
      this.props.Resources
    );
  },

  sortUpdateRequest(sortBy, sort) {
    const wantedSortBy = sortBy;
    const wantedSort = sort;

    const newRequest = this.props.Request;
    const newOrder = {
      Name: wantedSortBy,
      Order: wantedSort,
    };
    const newPaging = {
      From: 0,
      Size: 16,
    };

    newRequest.SearchSorting = newOrder;
    newRequest.SearchPaging = newPaging;
    newRequest.IgnoreFacets = true;

    SearchApi.search(
      newRequest,
      this.props.ContextRequest,
      this.props.ManagementCloudId,
      this.props.TemporaryToken,
      false
    );
  },

  classificationsChangeRefresh(currentClassif, switchState) {
    const self = this;

    // must contain
    if (switchState == true) {
      const newRequest = this.props.Request;
      const wantedClassif = {
        Alias: 'Classifications.ClassificationId',
        Property: 'Classifications.ClassificationId',
        Values: currentClassif,
      };

      if (newRequest.SearchContainerFilter.ValueContainerFilter == undefined) {
        newRequest.SearchContainerFilter.ValueContainerFilter = [];
        newRequest.SearchContainerFilter.ValueContainerFilter.push(wantedClassif);
      } else if (
        newRequest.SearchContainerFilter.ValueContainerFilter.findIndex(
          (id) => id.Alias === 'Classifications.ClassificationId'
        ) > -1
      ) {
        newRequest.SearchContainerFilter.ValueContainerFilter.splice(
          newRequest.SearchContainerFilter.ValueContainerFilter.findIndex(
            (id) => id.Alias === 'Classifications.ClassificationId'
          ),
          1
        );
        newRequest.SearchContainerFilter.ValueContainerFilter.push(wantedClassif);
      } else {
        newRequest.SearchContainerFilter.ValueContainerFilter.push(wantedClassif);
      }

      if (
        newRequest.SearchContainerFilter.MustNotValueContainerFilter != undefined &&
        newRequest.SearchContainerFilter.MustNotValueContainerFilter.findIndex(
          (id) => id.Alias === 'Classifications.ClassificationId'
        ) > -1
      ) {
        newRequest.SearchContainerFilter.MustNotValueContainerFilter.splice(
          newRequest.SearchContainerFilter.ValueContainerFilter.findIndex(
            (id) => id.Alias === 'Classifications.ClassificationId'
          ),
          1
        );
      }
      newRequest.IsManage = true;

      SearchApi.search(
        newRequest,
        this.props.ContextRequest,
        this.props.ManagementCloudId,
        this.props.TemporaryToken,
        false
      );
    }
    // must not contain
    else {
      const newRequest = this.props.Request;
      const doNotWantedClassif = {
        Alias: 'Classifications.ClassificationId',
        Property: 'Classifications.ClassificationId',
        Values: currentClassif,
      };

      if (newRequest.SearchContainerFilter.MustNotValueContainerFilter == undefined) {
        newRequest.SearchContainerFilter.MustNotValueContainerFilter = [];
        newRequest.SearchContainerFilter.MustNotValueContainerFilter.push(doNotWantedClassif);
      } else if (
        newRequest.SearchContainerFilter.MustNotValueContainerFilter.findIndex(
          (id) => id.Alias === 'Classifications.ClassificationId'
        ) > -1
      ) {
        newRequest.SearchContainerFilter.MustNotValueContainerFilter.splice(
          newRequest.SearchContainerFilter.MustNotValueContainerFilter.findIndex(
            (id) => id.Alias === 'Classifications.ClassificationId'
          ),
          1
        );
        newRequest.SearchContainerFilter.MustNotValueContainerFilter.push(doNotWantedClassif);
      } else {
        newRequest.SearchContainerFilter.MustNotValueContainerFilter.push(doNotWantedClassif);
      }

      if (
        newRequest.SearchContainerFilter.ValueContainerFilter != undefined &&
        newRequest.SearchContainerFilter.ValueContainerFilter.findIndex(
          (id) => id.Alias === 'Classifications.ClassificationId'
        ) > -1
      ) {
        newRequest.SearchContainerFilter.ValueContainerFilter.splice(
          newRequest.SearchContainerFilter.ValueContainerFilter.findIndex(
            (id) => id.Alias === 'Classifications.ClassificationId'
          ),
          1
        );
      }

      newRequest.IsManage = true;
      SearchApi.search(
        newRequest,
        this.props.ContextRequest,
        this.props.ManagementCloudId,
        this.props.TemporaryToken,
        false
      );
    }
  },

  unselectCurrentClassifs() {
    this.setState({
      classificationsListSelect: [],
      switchSelectCheckedClassifs: true,
      filterClassifActive: false,
    });
    const newRequest = this.props.Request;
    newRequest.IsManage = true;
    newRequest.SearchPaging = {
      From: 0,
      Size: 16,
    };

    const indexMust =
      newRequest.SearchContainerFilter.ValueContainerFilter != undefined
        ? newRequest.SearchContainerFilter.ValueContainerFilter.findIndex(
          (id) => id.Alias === 'Classifications.ClassificationId'
        )
        : -1;
    if (indexMust > -1) {
      newRequest.SearchContainerFilter.ValueContainerFilter.splice(indexMust, 1);
    }
    const indexMustNot =
      newRequest.SearchContainerFilter.MustNotValueContainerFilter != undefined
        ? newRequest.SearchContainerFilter.MustNotValueContainerFilter.findIndex(
          (id) => id.Alias === 'Classifications.ClassificationId'
        )
        : -1;
    if (indexMustNot > -1) {
      newRequest.SearchContainerFilter.MustNotValueContainerFilter.splice(indexMustNot, 1);
    }
    this.setClassificationsList();
    this.resetClassifInput();

    SearchApi.search(
      newRequest,
      this.props.ContextRequest,
      this.props.ManagementCloudId,
      this.props.TemporaryToken,
      false
    );
  },

  unselectCurrentProjects() {
    this.setState({
      projectsListSelect: [],
      switchSelectCheckedProjects: true,
      filterProjectActive: false,
    });

    const newRequest = this.props.Request;
    newRequest.IsManage = true;
    newRequest.SearchPaging = {
      From: 0,
      Size: 16,
    };

    const indexMust =
      newRequest.SearchContainerFilter.ValueContainerFilter != undefined
        ? newRequest.SearchContainerFilter.ValueContainerFilter.findIndex(
          (id) => id.Alias === 'Groups'
        )
        : -1;
    if (indexMust > -1) {
      newRequest.SearchContainerFilter.ValueContainerFilter.splice(indexMust, 1);
    }
    const indexMustNot =
      newRequest.SearchContainerFilter.MustNotValueContainerFilter != undefined
        ? newRequest.SearchContainerFilter.MustNotValueContainerFilter.findIndex(
          (id) => id.Alias === 'Groups'
        )
        : -1;
    if (indexMustNot > -1) {
      newRequest.SearchContainerFilter.MustNotValueContainerFilter.splice(indexMustNot, 1);
    }

    SearchApi.search(
      newRequest,
      this.props.ContextRequest,
      this.props.ManagementCloudId,
      this.props.TemporaryToken,
      false
    );
  },

  projectChangeRefresh(currentProjects, switchState) {
    const self = this;
    const parsedProjectsIds = currentProjects.map(Number);

    // must contain
    if (switchState == true) {
      const newRequest = this.props.Request;
      newRequest.IsManage = true;
      newRequest.SearchPaging = {
        From: 0,
        Size: 16,
      };

      const wantedProject = {
        Alias: 'Groups',
        Property: 'Groups',
        Values: parsedProjectsIds,
      };

      if (newRequest.SearchContainerFilter.ValueContainerFilter == undefined) {
        newRequest.SearchContainerFilter.ValueContainerFilter = [];
        newRequest.SearchContainerFilter.ValueContainerFilter.push(wantedProject);
      } else if (
        newRequest.SearchContainerFilter.ValueContainerFilter.findIndex(
          (id) => id.Alias === 'Groups'
        ) > -1
      ) {
        newRequest.SearchContainerFilter.ValueContainerFilter.splice(
          newRequest.SearchContainerFilter.ValueContainerFilter.findIndex(
            (id) => id.Alias === 'Groups'
          ),
          1
        );
        newRequest.SearchContainerFilter.ValueContainerFilter.push(wantedProject);
      } else {
        newRequest.SearchContainerFilter.ValueContainerFilter.push(wantedProject);
      }

      if (
        newRequest.SearchContainerFilter.MustNotValueContainerFilter != undefined &&
        newRequest.SearchContainerFilter.MustNotValueContainerFilter.findIndex(
          (id) => id.Alias === 'Groups'
        ) > -1
      ) {
        newRequest.SearchContainerFilter.MustNotValueContainerFilter.splice(
          newRequest.SearchContainerFilter.ValueContainerFilter.findIndex(
            (id) => id.Alias === 'Groups'
          ),
          1
        );
      }

      SearchApi.search(
        newRequest,
        this.props.ContextRequest,
        this.props.ManagementCloudId,
        this.props.TemporaryToken,
        false
      );
    }
    // must not contain
    else {
      const newRequest = this.props.Request;
      const doNotWantedProject = {
        Alias: 'Groups',
        Property: 'Groups',
        Values: parsedProjectsIds,
      };

      if (newRequest.SearchContainerFilter.MustNotValueContainerFilter == undefined) {
        newRequest.SearchContainerFilter.MustNotValueContainerFilter = [];
        newRequest.SearchContainerFilter.MustNotValueContainerFilter.push(doNotWantedProject);
      } else if (
        newRequest.SearchContainerFilter.MustNotValueContainerFilter.findIndex(
          (id) => id.Alias === 'Groups'
        ) > -1
      ) {
        newRequest.SearchContainerFilter.MustNotValueContainerFilter.splice(
          newRequest.SearchContainerFilter.MustNotValueContainerFilter.findIndex(
            (id) => id.Alias === 'Groups'
          ),
          1
        );
        newRequest.SearchContainerFilter.MustNotValueContainerFilter.push(doNotWantedProject);
      } else {
        newRequest.SearchContainerFilter.MustNotValueContainerFilter.push(doNotWantedProject);
      }

      if (
        newRequest.SearchContainerFilter.ValueContainerFilter != undefined &&
        newRequest.SearchContainerFilter.ValueContainerFilter.findIndex(
          (id) => id.Alias === 'Groups'
        ) > -1
      ) {
        newRequest.SearchContainerFilter.ValueContainerFilter.splice(
          newRequest.SearchContainerFilter.ValueContainerFilter.findIndex(
            (id) => id.Alias === 'Groups'
          ),
          1
        );
      }

      newRequest.IsManage = true;
      SearchApi.search(
        newRequest,
        this.props.ContextRequest,
        this.props.ManagementCloudId,
        this.props.TemporaryToken,
        false
      );
    }
  },

  // END API CALLS

  resetSelectMulti(event) {
    if (event.keyCode == 65) {
      this.state.selectedObjectMulti = -1;
    }
  },

  setClassificationsList() {
    if (this.state.classificationsList.length == 0) {
      const result = _.sortBy(this.props.Classifications, (object) => object.Official !== true);

      this.setState({
        classificationsList: result,
      });
    }
  },

  closeCurrentCard(event) {
    const filterBar = document.getElementsByClassName('opened panel-object');

    // if one panel is deployed
    if (filterBar.length > 0) {
      let targetElement = event.target;

      // If the target has an id and is no longer in the DOM
      if (event.target.id != '' && document.getElementById(event.target.id) == null) {
        return;
      }

      // If closing viewer, do not close the card
      if (event.target.classList.contains('viewer-closing-button')) {
        return;
      }

      do {
        const targetClasses =
          targetElement.classList != null && targetElement.classList != undefined
            ? Array.from(targetElement.classList)
            : null;
        const jqxElement =
          targetClasses != null ? targetClasses.filter((jqx) => jqx.startsWith('jqx')) : null;
        const noDeployCardElements =
          targetClasses != null
            ? targetClasses.filter((jqx) => jqx.startsWith('no-deploy-card'))
            : null;

        // This is a click inside.
        if (
          targetElement == filterBar[0] ||
          (targetElement.classList != null && jqxElement != null && jqxElement.length > 0) ||
          (targetElement.classList != null &&
            noDeployCardElements != null &&
            noDeployCardElements.length > 0)
        ) {
          return;
        }
        targetElement = targetElement.parentNode;
      } while (targetElement);

      // This is a click outside.
      store.dispatch({ type: `OPEN_OBJECT_CARD${this.props.SearchContextAction}`, data: 0 });
    }
  },

  scrollAction() {
    if (($(window).scrollTop() + $(window).height()) / $(document).height() > 0.8) {
      this.loadMore();
    }

    if ($(window).scrollTop() >= 260) {
      $('#new-filterbar').addClass('filter-scroll');
      $('#simple-filters-container').addClass('mui-fixed mui-fixed-no-full');
      $('.count-and-sort-container').addClass('sort-scroll');
      $('.sorting').addClass('mui-fixed mui-fixed-no-full');
    } else {
      $('#new-filterbar').removeClass('filter-scroll');
      $('#simple-filters-container').removeClass('mui-fixed mui-fixed-no-full');
      $('.count-and-sort-container').removeClass('sort-scroll');
      $('.sorting').removeClass('mui-fixed mui-fixed-no-full');
    }
  },

  updateNbColumn() {
    const nbColumn = $(window).width() >= 992 ? 2 : 1;
    this.setState({ nbColumn });
  },

  confirmRemoveBimObjectFromLibrary(id, objectType) {
    if (id != null && objectType != null) {
      this.state.selectedObjectToRemove = [id.toString()];

      // manuf
      if (objectType == 'manufacturer') {
        this.setState({
          headerTitle: this.props.Resources.BimObjectDelete.Title,
          bodyContent: this.props.Resources.ContentManagement.RemoveBimObjectConfirmText.replace(
            '[NameOfTheOnfly]',
            this.props.SubDomain
          ),
          abortButtonTitle: this.props.Resources.MetaResource.Cancel,
          abortButtonAction: this.closeCurrentModalAbort,
          confirmButtonTitle: this.props.Resources.BimObjectDelete.ButtonDelete,
          confirmButtonAction: this.removeBimObjectFromLibrary,
          urlImage: '/Content/images/illu-supprimer.svg',
        });
      }
      // generic
      else if (objectType == 'generic') {
        this.setState({
          headerTitle: this.props.Resources.BimObjectUnpublish.Title,
          bodyContent: this.props.Resources.BimObjectUnpublish.Body.replace(
            '[NameOfTheOnfly]',
            this.props.SubDomain
          ),
          abortButtonTitle: this.props.Resources.MetaResource.Cancel,
          abortButtonAction: this.closeCurrentModalAbort,
          confirmButtonTitle: this.props.Resources.BimObjectUnpublish.UnpublishButton,
          confirmButtonAction: this.unpublishBimObjectFromLibrary,
        });
      }
      $('#confirm-deletion-modal').modal();
    }
  },

  closeCurrentModal() {
    this.setState({
      headerTitle: null,
      bodyContent: null,
      abortButtonTitle: null,
      abortButtonAction: null,
      confirmButtonTitle: null,
      confirmButtonAction: null,
      urlImage: null,
      selectedObjects: [],
    });
    $('#confirm-deletion-modal').modal('hide');
    document.getElementById('underBandSelection').classList.add('hidden');
    document.body.classList.remove('toolbar-open');
  },

  closeCurrentModalAbort() {
    this.setState({
      headerTitle: null,
      bodyContent: null,
      abortButtonTitle: null,
      abortButtonAction: null,
      confirmButtonTitle: null,
      confirmButtonAction: null,
      urlImage: null,
    });
    $('#confirm-deletion-modal').modal('hide');
  },

  handleSelectObjectRow(id, status, shiftPressed = false) {
    if (this.state.disableSelection == true) {
      return;
    }

    const currentObjectList = this.state.selectedObjects;
    let objectIndex = currentObjectList.indexOf(id.toString());

    // set object list
    if (objectIndex > -1) {
      currentObjectList.splice(objectIndex, 1);
    } else {
      currentObjectList.push(id.toString());
    }

    if (shiftPressed) {
      if (this.state.selectedObjectMulti != -1 && this.state.selectedObjectMulti != id) {
        const self = this;
        let indice1 = -1;
        let indice2 = -1;
        _.some(this.props.Data, (item, i) => {
          if (item.Id.toString() == id.toString()) {
            indice1 = i;
          } else if (item.Id.toString() == self.state.selectedObjectMulti.toString()) {
            indice2 = i;
          }

          if (indice1 != -1 && indice2 != -1) {
            if (indice1 > indice2) {
              const indiceTmp = indice2;
              indice2 = indice1;
              indice1 = indiceTmp;
            }
            return true;
          }
        });

        if (indice1 != -1 && indice2 != -1) {
          for (let i = indice1; i <= indice2; i++) {
            objectIndex = currentObjectList.indexOf(this.props.Data[i].Id.toString());

            // set object list
            if (objectIndex == -1) {
              currentObjectList.push(this.props.Data[i].Id.toString());
            }
          }
        }
        this.state.selectedObjectMulti = -1;
      }
    }

    this.state.selectedObjectMulti = id;

    if (currentObjectList.length > 0) {
      document.getElementById('underBandSelection').classList.remove('hidden');
      document.body.classList.add('toolbar-open');
      document.getElementsByClassName('crisp-client')[0].classList.add('hidden');
    } else {
      document.getElementById('underBandSelection').classList.add('hidden');
      document.body.classList.remove('toolbar-open');
      document.getElementsByClassName('crisp-client')[0].classList.remove('hidden');
    }

    this.setState({ selectedObjects: currentObjectList });
  },

  updateStatusCurrentList(event) {
    event.stopPropagation();
    const { status } = event.currentTarget.dataset;
    if (status == 'hidden') {
      // unpublish
      this.setState({
        headerTitle: this.props.Resources.BimObjectUnpublish.Title,
        bodyContent: this.props.Resources.BimObjectUnpublish.Body.replace(
          '[NameOfTheOnfly]',
          this.props.SubDomain
        ),
        abortButtonTitle: this.props.Resources.MetaResource.Cancel,
        abortButtonAction: this.closeCurrentModalAbort,
        confirmButtonTitle: this.props.Resources.BimObjectUnpublish.UnpublishButton,
        confirmButtonAction: this.unpublishBimObjectFromLibrary,
        confirmButtonStyle: 'btn-second btn-red',
        selectedObjectToRemove: this.state.selectedObjects,
        anchorMenuStatus: null,
      });

      $('#confirm-deletion-modal').modal();
    } else {
      // publish
      this.setState({
        headerTitle: this.props.Resources.ManageObjects.PublishModalTitle,
        bodyContent: this.props.Resources.ManageObjects.PublishModalBody,
        abortButtonTitle: this.props.Resources.MetaResource.Cancel,
        abortButtonAction: this.closeCurrentModalAbort,
        confirmButtonTitle: this.props.Resources.ManageObjects.PublishModalConfirm,
        confirmButtonAction: this.publishBimObjectFromLibrary,
        confirmButtonStyle: 'btn-second btn-blue',
        selectedObjectToRemove: this.state.selectedObjects,
        anchorMenuStatus: null,
      });

      $('#confirm-deletion-modal').modal();
    }
  },

  duplicateCurrentList(event) {
    event.stopPropagation();
  },

  deleteCurrentList(event) {
    event.stopPropagation();

    this.setState({
      headerTitle: this.props.Resources.BimObjectDelete.Title,
      bodyContent: this.props.Resources.ContentManagement.RemoveBimObjectConfirmText.replace(
        '[NameOfTheOnfly]',
        this.props.SubDomain
      ),
      abortButtonTitle: this.props.Resources.MetaResource.Cancel,
      abortButtonAction: this.closeCurrentModalAbort,
      confirmButtonTitle: this.props.Resources.BimObjectDelete.ButtonDelete,
      confirmButtonAction: this.removeBimObjectFromLibrary,
      urlImage: '/Content/images/illu-supprimer.svg',
      selectedObjectToRemove: this.state.selectedObjects,
    });
    $('#confirm-deletion-modal').modal();
  },

  unselectAllObjects(event) {
    this.setState({ selectedObjects: [], selectedObjectMulti: -1 });
    document.getElementById('underBandSelection').classList.add('hidden');
    document.body.classList.remove('toolbar-open');
  },

  selectAllObjects(event) {
    let selectedObjects = [];
    if (this.state.selectedObjects.length < this.props.Data.length) {
      selectedObjects = _.map(this.props.Data, (item) => item.Id.toString());
    }
    this.setState({ selectedObjects });
    if (selectedObjects.length > 0) {
      document.getElementById('underBandSelection').classList.remove('hidden');
      document.body.classList.add('toolbar-open');
    } else {
      document.getElementById('underBandSelection').classList.add('hidden');
      document.body.classList.remove('toolbar-open');
    }
  },

  handleClickMenuStatus(event) {
    this.setState({ anchorMenuStatus: event.currentTarget });
  },

  handleCloseMenuStatus(event) {
    this.setState({ anchorMenuStatus: null });
  },

  handleDuplicate(bimobject) {
    const self = this;
    store.dispatch({
      type: 'ADD_BIMOBJECT',
      documents: self.props.Data,
      bimobjectAdded: bimobject,
    });
  },

  handleOpenClassifPopIn(event) {
    if (this.state.classificationsList.length == 0) {
      this.setClassificationsList();
    }

    this.setState({
      sortClassifPopInIsOpen: true,
      anchorSortClassifPopIn: event.currentTarget,
    });
  },

  handleOpenAvailabilityPopIn(event) {
    this.setState({
      sortAvailabilityPopInIsOpen: true,
      anchorAvailabilitySortPopIn: event.currentTarget,
    });
  },

  handleCloseSortPopIn(event) {
    this.setState({
      sortClassifPopInIsOpen: false,
      anchorSortClassifPopIn: null,
      sortAvailabilityPopInIsOpen: false,
      anchorAvailabilitySortPopIn: null,
    });
  },

  handleChangeClassifsSelected(event) {
    const self = this;
    const currentValue = event.target.id;
    const currentClassif = self.state.classificationsListSelect;
    const indexValue = currentClassif.indexOf(currentValue);

    if (indexValue > -1) {
      currentClassif.splice(indexValue, 1);
    } else {
      currentClassif.push(currentValue);
    }
    self.setState({
      classificationsListSelect: currentClassif,
      filterClassifActive: true,
    });
    self.classificationsChangeRefresh(currentClassif, self.state.switchSelectCheckedClassifs);
  },

  handleChangeProjectsSelected(event) {
    const self = this;
    const currentValue = event.target.id;
    const currentProjects = self.state.projectsListSelect;
    const indexValue = currentProjects.indexOf(currentValue);

    if (indexValue > -1) {
      currentProjects.splice(indexValue, 1);
    } else {
      currentProjects.push(currentValue);
    }

    self.setState({
      projectsListSelect: currentProjects,
      filterProjectActive: true,
    });

    self.projectChangeRefresh(currentProjects, self.state.switchSelectCheckedProjects);
  },

  handleswitchSelectCheckedClassifs(event) {
    const enableSwitch = event.currentTarget.checked;
    this.setState({
      switchSelectCheckedClassifs: enableSwitch,
      filterClassifActive: true,
    });

    this.classificationsChangeRefresh(this.state.classificationsListSelect, enableSwitch);
  },

  handleswitchSelectCheckedProjects(event) {
    const enableSwitch = event.currentTarget.checked;
    this.setState({ switchSelectCheckedProjects: enableSwitch, filterProjectActive: true });
    this.projectChangeRefresh(this.state.projectsListSelect, enableSwitch);
  },

  showClassifier() {
    this.setState({ classificationsListSelectMulti: [], selectedObjectMono: null });
    $('#choose-classification-main').modal();
  },

  addClassification() {
    $('#choose-classification-main').modal('hide');
  },

  selectNode(node) {
    const listNode = this.state.classificationsListSelectMulti;
    const match = _.find(listNode, (item) => item.ClassificationId == node.ClassificationId);
    if (match != null) {
      const index = _.indexOf(listNode, match);
      listNode.splice(index, 1, node);
    } else {
      listNode.push(node);
    }
    this.setState({ classificationsListSelectMulti: listNode.splice(0) });
  },

  removeNode(node) {
    const listNode = _.filter(
      this.state.classificationsListSelectMulti,
      (item) => item.Id.toString() != node.Id.toString()
    );
    this.setState({ classificationsListSelectMulti: listNode });
  },

  showClassifierForObject(id) {
    this.setState({ classificationsListSelectMulti: [], selectedObjectMono: id });
    $('#choose-classification-main').modal();
  },

  updateClassifsResult(event) {
    const self = this;
    const currentInput = event.currentTarget.value;
    this.state.classifInputSearch = currentInput;

    setTimeout(() => {
      if (self.state.classifInputSearch == currentInput) {
        self.reloadClassifList(currentInput);
      }
    }, 500);
  },

  reloadClassifList(data) {
    const currentInput = data;
    const classifs = _.sortBy(this.props.Classifications, (object) => object.Official !== true);
    const newClassifList = [];

    if (currentInput == '') {
      this.setState({ classificationsList: classifs });
    } else {
      _.each(classifs, (classif, i) => {
        if (classif.Name.toLowerCase().includes(currentInput.toLowerCase())) {
          newClassifList.push(classif);
        }
      });
      this.setState({ classificationsList: newClassifList });
    }
  },

  resetClassifInput() {
    this.state.classifInputSearch = '';
    this.reloadClassifList('');
    document.getElementById('manage-classif-search').value = '';
  },

  showProjectsAssign(event) {
    this.setState({
      addProjectsPopInIsOpen: true,
      anchorAddProjectsPopIn: event.currentTarget,
    });
  },

  handleCloseAddProjectsPopIn(event) {
    this.setState({
      addProjectsPopInIsOpen: false,
      anchorAddProjectsPopIn: null,
    });
  },

  redirectCreateRequest() {
    history.push({
      pathname: `/${this.props.Language}/create-content-request`,
      state: { origin: 'OBJECT_LIST' },
    });
  },

  handleOpenModalContactCreator(contactCreatorMessage) {
    this.setState({
      contactCreatorMessage,
    });
  },

  handleCloseModalContactCreator() {
    this.setState({
      contactCreatorMessage: null,
    });
  },

  render() {
    const self = this;
    let resultNodesLeft = [];
    const resultNodesRight = [];
    const searchSuccessAction = `SEARCH_SUCCESS${this.props.SearchContextAction}`;
    const classificationsComponentId = 'choose-classification-main';

    // no result
    let results;

    // manage object
    if (this.props.refreshCardOpacity == null) {
      const classificationsList = self.state.classificationsList.map((classification, i) => {
        const isChecked =
          self.state.classificationsListSelect.indexOf(classification.Classification.toString()) >
          -1;

        return (
          <li key={classification.Classification}>
            <FormControlLabel
              control={
                <Checkbox
                  value={classification.Name}
                  id={classification.Classification}
                  checked={isChecked}
                  onChange={self.handleChangeClassifsSelected}
                  checkedIcon={<CheckCircleIcon style={{ color: DisplayDesign.acidBlue }} />}
                  icon={<PanoramaFishEyeIcon style={{ color: DisplayDesign.acidBlue }} />}
                />
              }
              label={classification.Name}
              labelPlacement="end"
            />
          </li>
        );
      });

      const projectsList =
        self.props.CurrentGroups.GroupsList != null
          ? self.props.CurrentGroups.GroupsList.map((project, i) => {
            const isChecked = self.state.projectsListSelect.indexOf(project.Id.toString()) > -1;

            return (
              <li key={project.Id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id={project.Id}
                      checked={isChecked}
                      onChange={self.handleChangeProjectsSelected}
                      checkedIcon={<CheckCircleIcon style={{ color: DisplayDesign.acidBlue }} />}
                      icon={<PanoramaFishEyeIcon style={{ color: DisplayDesign.acidBlue }} />}
                    />
                  }
                  label={project.Name}
                  labelPlacement="end"
                />
              </li>
            );
          })
          : null;

      const projectFromSelectedObjects = [];

      if (this.props.Data.length > 0) {
        const groupIdParsed = [];

        _.each(this.props.Data, (data, i) => {
          resultNodesLeft.push(
            <BimObjectRowManageObject
              key={data.Id}
              data={data}
              selectedObjects={self.state.selectedObjects}
              handleSelectObjectRow={self.handleSelectObjectRow}
              confirmRemoveBimObjectFromLibrary={self.confirmRemoveBimObjectFromLibrary}
              checked={self.state.selectedObjects.indexOf(data.Id.toString()) != -1}
              handleDuplicate={self.handleDuplicate}
              editClassificationForObject={self.showClassifierForObject}
            />
          );

          if (
            self.state.addProjectsPopInIsOpen &&
            _.indexOf(self.state.selectedObjects, data.Id.toString()) > -1
          ) {
            _.each(data.GroupsList, (value, index) => {
              if (_.indexOf(groupIdParsed, value.Id) === -1) {
                projectFromSelectedObjects.push(
                  <Chip
                    key={`more-availability-${value.Id}`}
                    className="chip-availability group-tag more"
                    label={value.Name}
                    data-id={value.Id}
                    onDelete={self.handleChangeRemoveProjects}
                    avatar={
                      <Avatar className="group-tag">{Utils.getGroupMiniLabel(value.Name)}</Avatar>
                    }
                  />
                );

                groupIdParsed.push(value.Id);
              }
            });
          }
        });
      }
      // no result
      else if (this.props.Type == searchSuccessAction) {
        resultNodesLeft = (
          <div className="no-results-list">
            <img src="/Content/images/rocket.svg" className="no-results-img" />
            <p className="no-results-message">{self.props.Resources.ContentManagement.NoResults}</p>
          </div>
        );
      }

      const tableHeader = (
        <ManageObjectsTableHeader
          Resources={this.props.Resources}
          Datas={this.props.Data}
          CurrentGroups={this.props.CurrentGroups}
          SelectedObjects={this.state.selectedObjects}
          UnselectAllObjects={this.unselectAllObjects}
          SelectAllObjects={this.selectAllObjects}
          SortUpdateRequest={this.sortUpdateRequest}
        />
      );

      const underBand = (
        <ManageObjectsUnderBand
          UpdateStatusCurrentList={this.updateStatusCurrentList}
          Resources={this.props.Resources}
          CurrentGroups={this.props.CurrentGroups}
          SelectedObjects={this.state.selectedObjects}
          UnselectAllObjects={this.unselectAllObjects}
          Datas={this.props.Data}
          HandleChangeAddProjects={this.handleChangeAddProjects}
          HandleCopyObjectToGroup={this.handleCopyObjectToGroup}
          PublishObjectInPrivateCloud={this.publishObjectInPrivateCloud}
          PublishObjectInBimAndCo={this.publishObjectInBimAndCo}
          ManagementCloudId={self.props.ManagementCloudId}
          TemporaryToken={self.props.TemporaryToken}
          DeleteCurrentList={this.deleteCurrentList}
          Settings={this.props.Settings}
          RemoveGroupObjectList={this.handleChangeRemoveProjects}
          UnpublishObjectListInBimAndCo={this.unpublishObjectListInBimAndCo}
          UnpublishObjectListPrivateCloud={this.unpublishObjectListPrivateCloud}
        />
      );

      return (
        <div className="row mo-body">
          <Paper className="table-manage-object">
            <h3 className="table-title">{this.props.Resources.ManageObjects.ResultHeader}</h3>
            <Table id="table-manage-object-result" key="table-manage-object-result">
              <TableHead
                id="manageObjectsTableHeader"
                key="manageObjectsTableHeader"
                style={{ width: '100%' }}
              >
                {tableHeader}
              </TableHead>
              <TableBody key="manageObjectsTableBody">{resultNodesLeft}</TableBody>
            </Table>
          </Paper>

          {underBand}

          <SuppressionModal
            headerTitle={this.state.headerTitle}
            bodyContent={this.state.bodyContent}
            abortButtonTitle={this.state.abortButtonTitle}
            abortButtonAction={this.state.abortButtonAction}
            confirmButtonTitle={this.state.confirmButtonTitle}
            confirmButtonAction={this.state.confirmButtonAction}
            confirmButtonStyle={this.state.confirmButtonStyle}
            urlImage={this.state.urlImage}
          />

          <div
            className="modal fade"
            id={classificationsComponentId}
            tabIndex="-1"
            role="dialog"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-large">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title" id="myModalLabel">
                    {self.props.Resources.ContentManagement.ChooseClassificationsForObjects}
                  </h2>
                  <CloseIcon className="close" data-toggle="modal" data-dismiss="modal" />
                </div>
                <div className="modal-body">
                  <ClassificationsComponent
                    id={classificationsComponentId}
                    selectNode={this.selectNode}
                    removeSelectedNode={this.removeNode}
                    selectedNodes={this.state.classificationsListSelectMulti}
                  />
                </div>
                <div className="modal-footer">
                  <div className="flex-container">
                    <div className="flex-container-left">
                      <p>
                        {
                          this.props.Resources.ContentManagement
                            .UselessPropertiesWillBeRemoveWarning
                        }
                      </p>
                    </div>
                    <div className="flex-container-right">
                      <Button
                        variant="text"
                        className="btn-flat"
                        data-toggle="modal"
                        data-dismiss="modal"
                      >
                        <span>{this.props.Resources.MetaResource.Cancel}</span>
                      </Button>
                      <Button
                        variant="contained"
                        className="btn-raised"
                        data-toggle="modal"
                        data-dismiss="modal"
                        onClick={this.addNodesToObjects}
                      >
                        <span>{this.props.Resources.MetaResource.Confirm}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Popover
            id="popSortClassif"
            open={self.state.sortClassifPopInIsOpen}
            anchorEl={self.state.anchorSortClassifPopIn}
            onClose={self.handleCloseSortPopIn}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <div className="popover-manage">
              <div id="manage-classif-search-container" className="row">
                <TextField
                  fullWidth
                  id="manage-classif-search"
                  margin="normal"
                  variant="outlined"
                  placeholder={self.props.Resources.ContentManagement.SearchForPlaceHolder}
                  inputRef={(input) => {
                    self.state.inputclassifSearch = input;
                  }}
                  onChange={self.updateClassifsResult}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={self.resetClassifInput}>
                          <CloseIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div className="row">
                <Button fullWidth variant="contained" onClick={self.unselectCurrentClassifs}>
                  {self.props.Resources.ManageObjects.UnselectButtonLabel}
                </Button>
              </div>

              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch
                      checked={self.state.switchSelectCheckedClassifs}
                      onChange={self.handleswitchSelectCheckedClassifs}
                      color="primary"
                    />
                  }
                  label={
                    self.state.switchSelectCheckedClassifs == true
                      ? self.props.Resources.ManageObjects.ContainClassifSwitchLabel
                      : self.props.Resources.ManageObjects.ContainNotClassifSwitchLabel
                  }
                />
              </FormGroup>

              <div id="classifListDetails-container" className="row">
                <ul id="classifListDetails">{classificationsList}</ul>
              </div>
            </div>
          </Popover>

          <Popover
            id="popSortAvailability"
            open={self.state.sortAvailabilityPopInIsOpen}
            anchorEl={self.state.anchorAvailabilitySortPopIn}
            onClose={self.handleCloseSortPopIn}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <div className="popover-manage">
              <Button fullWidth variant="contained" onClick={self.unselectCurrentProjects}>
                {self.props.Resources.ManageObjects.UnselectButtonLabel}
              </Button>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch
                      checked={self.state.switchSelectCheckedProjects}
                      onChange={self.handleswitchSelectCheckedProjects}
                      color="primary"
                    />
                  }
                  label={
                    self.state.switchSelectCheckedProjects == true
                      ? self.props.Resources.ManageObjects.IncludeSwitchLabel
                      : self.props.Resources.ManageObjects.ExcludeSwitchLabel
                  }
                />
              </FormGroup>
              <div id="projectsListDetails-container" className="row">
                <ul id="projectsListDetails">{projectsList}</ul>
              </div>
            </div>
          </Popover>

          <Popover
            id="popAddProjects"
            open={self.state.addProjectsPopInIsOpen}
            anchorEl={self.state.anchorAddProjectsPopIn}
            onClose={self.handleCloseAddProjectsPopIn}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <div className="add-project-pop">
              <div className="more-availability-list-autocomplete">
                <AutocompleteGroup
                  SelectGroup={self.handleChangeAddProjects}
                  AddToPrivateCloud={self.publishObjectInPrivateCloud}
                  RenderPopup
                  SelectedObjects={this.state.selectedObjects}
                />
              </div>
              <div className="more-availability-list-popover">{projectFromSelectedObjects}</div>
            </div>
          </Popover>
        </div>
      );
    }
    // object list

    let panelContentRequest;

    // Si tous les objets ont �t� charg�s
    if (
      this.props.Data != null &&
      this.props.Data.length == this.props.Total &&
      this.props.Type == searchSuccessAction
    ) {
      let animationClass = '';

      if (this.props.Data != null && this.props.Data.length <= 8 && self.props.Page == 0) {
        animationClass = 'animated slideInLeft';

        if (this.state.nbColumn == 2 && this.props.Layout == 'grid') {
          if (this.props.Data.length % 2 != 0) {
            animationClass = 'animated slideInRight';
          }
        }
      }

      // Si l'on n'est pas dans un groupe
      if (this.props.params != null && this.props.params.groupId == null) {
        panelContentRequest = (
          <div
            id="panel-content-request"
            className={`panel-object-std ${animationClass}`}
            key="panel-content-request"
          >
            <div className="panel-object-content">
              <table>
                <tbody>
                  <tr>
                    <td className="bimobject-photo">
                      <div className="image-container">
                        <img src="/Content/images/rocket.svg" />
                      </div>
                    </td>
                    <td className="bimobject-info">
                      <Typography variant="h6" gutterBottom>
                        {self.props.Resources.SearchResults.AskContentTitle}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        {self.props.Resources.SearchResults.AskContentMessage}
                      </Typography>
                      <div className="btn-container">
                        <Button
                          className="btn-raised btn-ask-content"
                          variant="contained"
                          onClick={this.redirectCreateRequest}
                        >
                          {self.props.Resources.SearchResults.AskContentLabel}
                        </Button>
                      </div>
                    </td>
                    <td className="bimobject-actions" />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      }
    }

    if (this.state.nbColumn == 2 && this.props.Layout == 'grid') {
      results = [];

      _.each(this.props.Data, (bimobject, i) => {
        if (i % 2 == 0) {
          resultNodesLeft.push(
            <BimObjectRow
              key={bimobject.Id}
              bimobject={bimobject}
              addBimObjectToLibrary={self.addBimObjectToLibrary}
              confirmRemoveBimObjectFromLibrary={self.confirmRemoveBimObjectFromLibrary}
              animateDirection={i < 8 && self.props.Page == 0 ? 'left' : 'none'}
              openModalContactCreator={self.handleOpenModalContactCreator}
            />
          );
        } else {
          resultNodesRight.push(
            <BimObjectRow
              key={bimobject.Id}
              bimobject={bimobject}
              addBimObjectToLibrary={self.addBimObjectToLibrary}
              confirmRemoveBimObjectFromLibrary={self.confirmRemoveBimObjectFromLibrary}
              animateDirection={i < 8 && self.props.Page == 0 ? 'right' : 'none'}
              openModalContactCreator={self.handleOpenModalContactCreator}
            />
          );
        }
      });

      if (this.props.Data.length % 2 == 0) {
        resultNodesLeft.push(panelContentRequest);
      } else {
        resultNodesRight.push(panelContentRequest);
      }

      results.push(
        <div className="results-list-left" key="res-left">
          {resultNodesLeft}
        </div>
      );
      results.push(
        <div className="results-list-right" key="res-right">
          {resultNodesRight}
        </div>
      );
    } else {
      _.each(this.props.Data, (bimobject, i) => {
        resultNodesLeft.push(
          <BimObjectRow
            key={bimobject.Id}
            indice={i}
            bimobject={bimobject}
            addBimObjectToLibrary={self.addBimObjectToLibrary}
            confirmRemoveBimObjectFromLibrary={self.confirmRemoveBimObjectFromLibrary}
            animateDirection={i <= 8 && self.props.Page == 0 ? 'left' : 'none'}
            openModalContactCreator={self.handleOpenModalContactCreator}
          />
        );
      });

      resultNodesLeft.push(panelContentRequest);

      results = <div className="container-fluid">{resultNodesLeft}</div>;
    }

    // No result
    if (
      this.props.Type == searchSuccessAction &&
      this.props.Data != null &&
      this.props.Data.length == this.props.Total &&
      this.props.Data.length == 0 &&
      panelContentRequest == null
    ) {
      results = (
        <div className="no-results-list">
          <img src="/Content/images/rocket.svg" className="no-results-img" />
          <p className="no-results-message">{self.props.Resources.ContentManagement.NoResults}</p>
        </div>
      );
    }

    return (
      <div className="results-list-container object-view-line">
        {results}
        <SuppressionModal
          headerTitle={this.state.headerTitle}
          bodyContent={this.state.bodyContent}
          abortButtonTitle={this.state.abortButtonTitle}
          abortButtonAction={this.state.abortButtonAction}
          confirmButtonTitle={this.state.confirmButtonTitle}
          confirmButtonAction={this.state.confirmButtonAction}
          confirmButtonStyle={this.state.confirmButtonStyle}
          urlImage={this.state.urlImage}
        />
        <ContactCreatorModal
          contactCreatorMessage={self.state.contactCreatorMessage}
          handleCloseModalContactCreator={self.handleCloseModalContactCreator}
        />
      </div>
    );
  },
});

const mapStateToProps = function (store, ownProps) {
  let currentSearchState;
  const currentManageSearchState = store.manageSearchState;
  const { searchState } = store;
  const { searchGroupState } = store;
  const { appState } = store;
  const isManage = ownProps.location.pathname == `/${appState.Language}/manage-objects`;

  if (ownProps.params.groupId > 0) {
    currentSearchState = searchGroupState;
  } else if (isManage == true) {
    currentSearchState = currentManageSearchState;
  } else {
    currentSearchState = searchState;
  }

  return {
    ManagementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    Language: appState.Language,
    Resources: appState.Resources[appState.Language],
    SubDomain: appState.SubDomain,
    InitialRequest: currentSearchState.InitialRequest,
    Layout: currentSearchState.Layout,
    Type: currentSearchState.Type,
    SearchContextAction: currentSearchState.SearchContextAction,
    ContextRequest: currentSearchState.ContextRequest,
    Request: currentSearchState.Request,
    Data: currentSearchState.Documents,
    Page: currentSearchState.Page,
    Size: currentSearchState.Size,
    Total: currentSearchState.Total,
    ScrollPosition: currentSearchState.ScrollPosition,
    Classifications: store.classificationsState.ClassificationsList[appState.Language],
    CurrentGroups: store.groupsState,
    Settings: appState.Settings,
    UserId: appState.UserId,
  };
};

export default ResultsList = withRouter(connect(mapStateToProps)(ResultsList));