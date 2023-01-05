import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import Popover from '@material-ui/core/Popover';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import Fab from '@material-ui/core/Fab';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';

// material ui icons
import LibraryAddIcon from '@material-ui/icons/LibraryAdd.js';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff.js';
import VisibilityIcon from '@material-ui/icons/Visibility.js';
import FileCopyIcon from '@material-ui/icons/FileCopy.js';
import CreateIcon from '@material-ui/icons/Create.js';
import DeleteIcon from '@material-ui/icons/Delete.js';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown.js';
import InfoIcon from '@material-ui/icons/Info.js';
import CollectionsIcon from '@material-ui/icons/Collections.js';
import ShareIcon from '@material-ui/icons/Share.js';
import AssignmentIcon from '@material-ui/icons/Assignment.js';
import PhotoFilterIcon from '@material-ui/icons/PhotoFilter.js';
import DescriptionIcon from '@material-ui/icons/Description.js';
import PublishIcon from '@material-ui/icons/Publish.js';
import GroupAddIcon from '@material-ui/icons/GroupAdd.js';
import { Icon } from '@bim-co/componentui-foundation';

import { connect } from 'react-redux';
import moment from 'moment';
import { Router } from 'react-router-dom';
import AutocompleteGroup from '../Autocomplete/AutocompleteGroup.jsx';
import store from '../../Store/Store';
import * as Utils from '../../Utils/utils.js';
import * as LibraryApi from '../../Api/LibraryApi.js';
import { API_URL } from '../../Api/constants';

import { getGroupTypeLabel } from '../../Reducers/groups/utils';

let BimObjectRowManageObject = createReactClass({
  getInitialState() {
    return {
      currentOpenedClassif: null,
      editionMenuAnchor: null,
      anchorMenuStatus: null,
      anchorPopoverAvailability: null,
      anchorPopperAvailability: null,
      currentOpenedClassifWidth: null,
      currentCaseId: null,
      isClassifTooltipOpen: false,
      currentOpenedProjectWidth: null,
      isProjectTooltipOpen: false,
      showMoreAvailabilityButton: false,
    };
  },

  shouldComponentUpdate(nextProps, nextState) {
    const bimobject = this.props.data;

    const bool =
      bimobject.UpdatedAt !== nextProps.data.UpdatedAt ||
      bimobject.Id !== nextProps.data.Id ||
      bimobject.Status != nextProps.data.Status ||
      nextProps.data.IsOnManagementCloud != this.props.IsOnManagementCloud ||
      nextProps.data.Name != bimobject.Name ||
      nextProps.checked != this.props.checked ||
      nextProps.Language != this.props.Language ||
      this.state.editionMenuAnchor != nextState.editionMenuAnchor ||
      this.state.anchorMenuStatus != nextState.anchorMenuStatus ||
      this.state.currentOpenedClassif != nextState.currentOpenedClassif ||
      this.state.anchorPopoverAvailability != nextState.anchorPopoverAvailability ||
      this.state.showMoreAvailabilityButton != nextState.showMoreAvailabilityButton;

    return bool;
  },

  duplicateCurrentObject(event) {
    event.stopPropagation();
    LibraryApi.duplicateBimObjects(
      this.props.ManagementCloudId,
      this.props.data.Id,
      this.props.TemporaryToken,
      this.props.Language,
      this.props.resources,
      this.props.handleDuplicate
    );
  },

  overObjectLine() {
    document.getElementById(`mobject-row-buttons-${this.props.data.Id}`).classList.remove('hidden');
  },

  outObjectLine() {
    document.getElementById(`mobject-row-buttons-${this.props.data.Id}`).classList.add('hidden');
  },

  openClassifList(event) {
    const currentPopover = event.currentTarget;
    const currentWidth = currentPopover.offsetWidth;
    const currentCaseId = currentPopover.id;
    if (currentPopover != null) {
      this.setState({
        currentOpenedClassif: currentPopover,
        currentOpenedClassifWidth: currentWidth,
        currentCaseId,
      });
    }
  },

  closeClassifList() {
    this.setState({
      currentOpenedClassif: null,
      currentCaseId: null,
    });
  },

  handleOpenEditionMenu(event) {
    event.stopPropagation();
    this.setState({ editionMenuAnchor: event.currentTarget });
  },

  handleCloseEditionMenu(event) {
    event.stopPropagation();
    this.setState({ editionMenuAnchor: null });
  },

  handleClickOptionMenu(event) {
    event.preventDefault();
    event.stopPropagation();

    const context = event.target.dataset.value;

    switch (context) {
      case 'groupadd':
        break;
      default:
        Router.push(`/${this.props.Language}/bimobject/${this.props.data.Id}/edit/${context}`);
        break;
    }
  },

  handleSelectObjectRow() {
    // si aucun menu n'est affiché
    if (
      this.state.anchorPopoverAvailability == null &&
      this.state.currentOpenedClassif == null &&
      this.state.editionMenuAnchor == null &&
      this.state.anchorMenuStatus == null
    ) {
      let shiftPressed = false;
      if (event.shiftKey) {
        shiftPressed = true;
      }
      this.props.handleSelectObjectRow(this.props.data.Id, this.props.data.Status, shiftPressed);
    }
  },

  deleteCurrentObject(event) {
    event.stopPropagation();
    this.props.confirmRemoveBimObjectFromLibrary(this.props.data.Id, 'manufacturer');
  },

  handleClickMenuStatus(event) {
    event.stopPropagation();
    this.setState({ anchorMenuStatus: event.currentTarget });
  },

  handleCloseMenuStatus(event) {
    event.stopPropagation();
    this.setState({ anchorMenuStatus: null });
  },

  handlePublish(event) {
    event.stopPropagation();
    this.state.anchorMenuStatus = null;
    LibraryApi.publishBimObjects(
      this.props.ManagementCloudId,
      [this.props.data.Id.toString()],
      this.props.TemporaryToken,
      this.props.resources
    );
  },

  handleUnPublish(event) {
    event.stopPropagation();
    this.state.anchorMenuStatus = null;
    LibraryApi.unpublishBimObjects(
      this.props.ManagementCloudId,
      [this.props.data.Id.toString()],
      this.props.TemporaryToken,
      this.props.resources
    );
  },

  openAvailabilityPopover(event) {
    event.stopPropagation();
    const currentPopover = event.currentTarget;

    if (currentPopover != null) {
      this.setState({
        anchorPopoverAvailability: currentPopover,
        anchorPopperAvailability: null,
      });
    }
  },

  openAvailabilityPopper(event) {
    const currentPopover = event.currentTarget;
    const currentWidth = currentPopover.offsetWidth;
    const currentCaseId = currentPopover.id;

    if (
      currentPopover != null &&
      this.props.CurrentGroups.GroupsList != null &&
      !this.state.anchorPopoverAvailability
    ) {
      this.setState({
        anchorPopperAvailability: currentPopover,
        currentOpenedProjectWidth: currentWidth,
        currentCaseId,
        showMoreAvailabilityButton: true,
      });
    }
  },

  closePopperAvailability() {
    if (!this.state.anchorPopoverAvailability) {
      this.setState({
        anchorPopperAvailability: null,
        currentCaseId: null,
        showMoreAvailabilityButton: false,
      });
    }
  },

  removeGroup(event) {
    event.stopPropagation();
    const groupId = event.currentTarget.parentElement.dataset.id;
    const self = this;
    const url = `${API_URL}/api/ws/v1/contentmanagement/${this.props.ManagementCloudId}/group/${groupId}/dissociateBimObject/${this.props.data.Id}?token=${this.props.TemporaryToken}`;

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(() => {
      store.dispatch({
        type: 'REFRESH_REQUEST_MANAGE',
        managementcloudId: self.props.ManagementCloudId,
        token: self.props.TemporaryToken,
      });
      store.dispatch({
        type: 'DELETE_OBJECTS_FROM_GROUP',
        objectIds: [self.props.data.Id.toString()],
        groupId,
      });
    });
  },

  publishObjectInPrivateCloud() {
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
        body: JSON.stringify({ ObjectsIds: [self.props.data.Id] }),
      }
    )
      .then(() => {
        store.dispatch({ type: 'LOADER', state: false });
        store.dispatch({
          type: 'REFRESH_REQUEST_MANAGE',
          managementcloudId: self.props.ManagementCloudId,
          token: self.props.TemporaryToken,
        });
      })
      .catch(() => {
        // catch
        store.dispatch({ type: 'LOADER', state: false });
      });
  },

  unpublishObjectInPrivateCloud() {
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
        body: JSON.stringify({ ObjectsIds: [self.props.data.Id] }),
      }
    )
      .then(() => {
        store.dispatch({ type: 'LOADER', state: false });
        store.dispatch({
          type: 'REFRESH_REQUEST_MANAGE',
          managementcloudId: self.props.ManagementCloudId,
          token: self.props.TemporaryToken,
        });
      })
      .catch((error) => {
        // catch
        store.dispatch({ type: 'LOADER', state: false });
      });
  },

  publishObjectInBimAndCo() {
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
        body: JSON.stringify({ ObjectsIds: [self.props.data.Id] }),
      }
    )
      .then(() => {
        store.dispatch({ type: 'LOADER', state: false });
        store.dispatch({
          type: 'REFRESH_REQUEST_MANAGE',
          managementcloudId: self.props.ManagementCloudId,
          token: self.props.TemporaryToken,
        });
      })
      .catch((error) => {
        // catch
        store.dispatch({ type: 'LOADER', state: false });
      });
  },

  unpublishObjectInBimAndCo() {
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
        body: JSON.stringify({ ObjectsIds: [self.props.data.Id] }),
      }
    )
      .then(() => {
        store.dispatch({ type: 'LOADER', state: false });
        store.dispatch({
          type: 'REFRESH_REQUEST_MANAGE',
          managementcloudId: self.props.ManagementCloudId,
          token: self.props.TemporaryToken,
        });
      })
      .catch((error) => {
        // catch
        store.dispatch({ type: 'LOADER', state: false });
      });
  },

  addGroup(group) {
    const self = this;
    const url = `${API_URL}/api/ws/v1/contentmanagement/${self.props.ManagementCloudId}/group/${group.Id}/associateBimObject/${self.props.data.Id}?token=${self.props.TemporaryToken}`;

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(() => {
      const action = {
        type: 'REFRESH_REQUEST_MANAGE',
        managementcloudId: self.props.ManagementCloudId,
        token: self.props.TemporaryToken,
      };
      store.dispatch(action);
    });
  },

  editClassification() {
    this.props.editClassificationForObject(this.props.data.Id);
  },

  overAddClassif() {
    this.setState({ isClassifTooltipOpen: true });
  },

  outAddClassif() {
    this.setState({ isClassifTooltipOpen: false });
  },

  overAddProjects() {
    this.setState({ isProjectTooltipOpen: true });
  },

  outAddProjects() {
    this.setState({ isProjectTooltipOpen: false });
  },

  closePopoverManageClassif() {
    this.setState({ anchorPopoverAvailability: null, showMoreAvailabilityButton: false });
  },

  render() {
    const self = this;

    if (
      this.props.data.Status == 'deleted' &&
      this.props.data.CreatedFromContentManagement == true
    ) {
      return null;
    }

    const POPOVER_ANCHOR_ORIGIN = {
      vertical: 'top',
      horizontal: 'center',
    };

    const POPOVER_TRANSFORM_ORIGIN = {
      vertical: 'bottom',
      horizontal: 'center',
    };

    const { data } = this.props;
    let currentClassifications = [];
    const supplementClassif = (
      <Tooltip
        title={self.props.resources.ContentManagement.TooltipEdit}
        placement="right"
        enterDelay={300}
        open={self.state.isClassifTooltipOpen}
      >
        <div className="more-classif-btn">
          <Button
            size="small"
            onClick={this.editClassification}
            onMouseEnter={this.overAddClassif}
            onMouseLeave={this.outAddClassif}
          >
            <span />
          </Button>
        </div>
      </Tooltip>
    );

    let supplementClassifList = null;
    const previewId = `preview_${data.Id}`;

    if (data.Classifications != null) {
      for (const i in data.Classifications) {
        const color = `classif ${Utils.getClassificationColor(
          data.Classifications[i].ClassificationId
        )}`;
        currentClassifications.push(
          <span className={color} key={data.Classifications[i].ClassificationId}>
            {data.Classifications[i].LeafName}
          </span>
        );
      }
    }

    const size = currentClassifications.length;
    if (size > 2) {
      supplementClassifList = currentClassifications;
      currentClassifications = currentClassifications.slice(0, 2);
    }

    let avatarClass = 'preview-avatar';
    let checkboxAvatar = 'preview-checkbox';
    if (this.props.checked) {
      avatarClass = 'preview-avatar-checked';
      checkboxAvatar = 'preview-checkbox-checked';
    }

    // Availability list
    let availabilityList = [];
    const moreAvailability = (
      <Tooltip
        title={self.props.resources.ContentManagement.TooltipEdit}
        placement="right"
        enterDelay={300}
        open={self.state.isProjectTooltipOpen}
      >
        <div className="more-classif-btn">
          <Button
            size="small"
            onClick={this.openAvailabilityPopover}
            onMouseEnter={this.overAddProjects}
            onMouseLeave={this.outAddProjects}
          >
            <span />
          </Button>
        </div>
      </Tooltip>
    );
    const moreAvailabilityList = [];
    const editAvailabilityList = [];
    let cptAvailability = 0;
    if (this.props.data.IsOnManagementCloud) {
      moreAvailabilityList.push(
        <Chip
          key={`default-availavility-${cptAvailability}`}
          className="chip-availability"
          label="OnFly"
        />
      );
      editAvailabilityList.push(
        <Chip
          key={`default-availavility-${cptAvailability}`}
          className="chip-availability"
          label="OnFly"
        />
      );
      cptAvailability++;
    }

    if (this.props.data.StatusPublic == 'published') {
      moreAvailabilityList.push(
        <Chip
          key={`default-availavility-${cptAvailability}`}
          className="chip-availability"
          label="BIM&CO"
        />
      );
      editAvailabilityList.push(
        <Chip
          key={`default-availavility-${cptAvailability}`}
          className="chip-availability"
          label="BIM&CO"
          onDelete={self.unpublishObjectInBimAndCo}
        />
      );
      cptAvailability++;
    }

    if (
      this.props.Settings.HasPrivateSite &&
      (this.props.data.StatusPC == 'published' ||
        (this.props.data.StatusPC == '' && this.props.data.StatusPublic == 'published'))
    ) {
      moreAvailabilityList.push(
        <Chip
          key={`default-availavility-${cptAvailability}`}
          className="chip-availability"
          label="Private Cloud"
        />
      );
      editAvailabilityList.push(
        <Chip
          key={`default-availavility-${cptAvailability}`}
          className="chip-availability"
          label="Private Cloud"
          onDelete={self.unpublishObjectInPrivateCloud}
        />
      );
      cptAvailability++;
    }

    if (self.props.CurrentGroups.GroupsList != null) {
      if (this.props.data.GroupsList != null && this.props.data.GroupsList.length > 0) {
        _.each(this.props.data.GroupsList, (group) => {
          const avatarClassName = `group-tag ${group?.GroupType}`;
          let avatarContent = group?.IsFavorite ? (
            <Icon icon="favorite" size="xs" />
          ) : (
            getGroupTypeLabel(self.props.resources, group?.GroupType)
          );

          if (avatarContent && !group?.IsFavorite) {
            avatarContent = avatarContent?.substring(0, 1);
          }

          const chipProps = {
            key: `more-availability-${group.Id}`,
            className: 'chip-availability group-tag more',
            label: group.Name,
            'data-id': group.Id,
            avatar: <Avatar className={avatarClassName}>{avatarContent}</Avatar>,
          };

          moreAvailabilityList.push(<Chip {...chipProps} />);
          editAvailabilityList.push(<Chip {...chipProps} onDelete={self.removeGroup} />);
        });
      }
    }

    let moreAvailabilityListPreview = [];
    if (moreAvailabilityList.length > 2) {
      moreAvailabilityListPreview = moreAvailabilityList;
    }

    availabilityList = moreAvailabilityList.slice(0, 2);

    return (
      <TableRow
        key={`mobject-row${data.Id}`}
        onClick={this.handleSelectObjectRow}
        onMouseEnter={this.overObjectLine}
        onMouseLeave={this.outObjectLine}
      >
        <TableCell className="mobject-row-select" style={{ cursor: 'pointer' }}>
          <div className="preview-cell">
            <div id={previewId} className={avatarClass}>
              <Avatar src={`${data.Photo}?width=30&height=30&scale=both`} />
            </div>
            <div className={checkboxAvatar}>
              <Checkbox checked={this.props.checked} tabIndex={-1} color="primary" />
            </div>
          </div>
        </TableCell>

        <TableCell className="mobject-row-name">
          <Tooltip title={data.Name} placement="top-start">
            <span>{data.Name}</span>
          </Tooltip>
        </TableCell>

        <TableCell className="mobject-row-author">
          {data.Manufacturer != null && data.Manufacturer.Id != 0 ? (
            <img
              src={`${data.Manufacturer.LogoPath}?width=100&height=30`}
              className="creator-img-manufacturer"
            />
          ) : (
            <Chip
              avatar={
                <Avatar className="creator-img-default">
                  {data.CreatorName != null ? data.CreatorName.trim()[0] : ''}
                </Avatar>
              }
              label={data.CreatorName}
            />
          )}
        </TableCell>

        <TableCell className="mobject-row-last-modif">
          {moment(data.UpdatedAt, 'YYYYMMDDhhmmss').format('L LTS')}
        </TableCell>

        <TableCell className="mobject-row-classif" id={data.Id}>
          <div
            id={`classifElement-${data.Id}`}
            onMouseEnter={this.openClassifList}
            onMouseLeave={this.closeClassifList}
            className={
              currentClassifications.length > 0 ? 'hover-container' : 'hover-container empty'
            }
          >
            {currentClassifications}
            {this.state.currentOpenedClassif != null && supplementClassif}
          </div>

          {supplementClassifList != null && supplementClassifList.length > 0 && (
            <Popper
              placement="top"
              open={Boolean(this.state.currentOpenedClassif != null)}
              anchorEl={this.state.currentOpenedClassif}
              disablePortal
              style={{ minWidth: this.state.currentOpenedClassifWidth, zIndex: 3000 }}
              onMouseEnter={this.closeClassifList}
              className="hover-tooltip"
              transition
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps} timeout={100}>
                  <Paper>
                    <div className="classif-list-popper">{supplementClassifList}</div>
                  </Paper>
                </Grow>
              )}
            </Popper>
          )}
        </TableCell>

        <TableCell
          className="mobject-row-availability"
          id={data.Id}
          onMouseEnter={this.openAvailabilityPopper}
          onMouseLeave={this.closePopperAvailability}
        >
          <div id={`projectElement-${data.Id}`} className="hover-container">
            {availabilityList}
            {this.state.showMoreAvailabilityButton && data.IsOnManagementCloud && moreAvailability}
          </div>
          {moreAvailabilityListPreview.length > 0 && (
            <Popper
              placement="top"
              open={
                Boolean(this.state.anchorPopperAvailability != null) &&
                !this.state.anchorPopoverAvailability
              }
              anchorEl={this.state.anchorPopperAvailability}
              disablePortal
              style={{ minWidth: this.state.currentOpenedProjectWidth }}
              className="hover-tooltip"
              transition
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps} timeout={100}>
                  <Paper>
                    <div className="classif-list-popper">{moreAvailabilityListPreview}</div>
                  </Paper>
                </Grow>
              )}
            </Popper>
          )}
          <Popover
            open={Boolean(this.state.anchorPopoverAvailability != null)}
            anchorEl={this.state.anchorPopoverAvailability}
            disablePortal
            anchorOrigin={POPOVER_ANCHOR_ORIGIN}
            transformOrigin={POPOVER_TRANSFORM_ORIGIN}
            onClose={this.closePopoverManageClassif}
            className="popover-availability"
          >
            <div className="more-availability-list-autocomplete">
              <AutocompleteGroup
                SelectGroup={this.addGroup}
                RenderPopup
                AddToPrivateCloud={this.publishObjectInPrivateCloud}
                AddToBimAndCo={this.publishObjectInBimAndCo}
                SelectedObjects={[this.props.data.Id]}
                WithCollection
              />
            </div>
            <div className="more-availability-list-popover">{editAvailabilityList}</div>
          </Popover>
        </TableCell>

        <TableCell className="mobject-row-status">
          {this.props.data.IsOnManagementCloud && this.props.data.CreatedFromContentManagement ? (
            <div>
              <Button
                aria-owns={this.state.anchorMenuStatus ? 'simple-menu' : undefined}
                aria-haspopup="true"
                onClick={this.handleClickMenuStatus}
              >
                {data.Status == 'published' ? (
                  <VisibilityIcon className="object-visible" />
                ) : (
                  <VisibilityOffIcon className="object-hidden" />
                )}
                {data.Status == 'published'
                  ? this.props.resources.BimObjectStatus.Published
                  : this.props.resources.BimObjectStatus.Hidden}
                <ArrowDropDownIcon />
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={this.state.anchorMenuStatus}
                open={Boolean(this.state.anchorMenuStatus != null)}
                onClose={this.handleCloseMenuStatus}
              >
                <MenuItem onClick={this.handlePublish}>
                  <VisibilityIcon className="object-visible" />
                  {this.props.resources.BimObjectStatus.Published}
                </MenuItem>
                <MenuItem onClick={this.handleUnPublish}>
                  <VisibilityOffIcon className="object-hidden" />
                  {this.props.resources.BimObjectStatus.Hidden}
                </MenuItem>
              </Menu>
            </div>
          ) : this.props.data.IsOnManagementCloud &&
            !this.props.data.CreatedFromContentManagement ? (
            <div className="published-status">
              <VisibilityIcon className="object-visible" />
              {this.props.resources.BimObjectStatus.Published}
            </div>
          ) : (
            <Tooltip title={this.props.resources.BimObjectDetails.AddBimObjectToolTip}>
              <Button onClick={this.handlePublish} className="add-icon">
                <LibraryAddIcon />
              </Button>
            </Tooltip>
          )}
        </TableCell>

        <TableCell className="mobject-row-options-buttons">
          <div id={`mobject-row-buttons-${data.Id}`} className="hidden">
            <Tooltip
              title={self.props.resources.ContentManagement.TooltipDuplicate}
              placement="bottom-start"
              enterDelay={300}
            >
              <Fab size="small" id="mobject-duplicate" onClick={this.duplicateCurrentObject}>
                <FileCopyIcon />
              </Fab>
            </Tooltip>

            {this.props.data.CanEdit ? (
              <Tooltip
                title={self.props.resources.ContentManagement.TooltipEdit}
                placement="bottom-start"
                enterDelay={300}
              >
                <Fab size="small" id="mobject-edit" onClick={this.handleOpenEditionMenu}>
                  <CreateIcon />
                </Fab>
              </Tooltip>
            ) : null}

            {this.props.data.IsOnManagementCloud ? (
              <Tooltip
                title={self.props.resources.ContentManagement.TooltipDelete}
                placement="bottom-start"
                enterDelay={300}
              >
                <Fab size="small" id="mobject-delete" onClick={this.deleteCurrentObject}>
                  <DeleteIcon />
                </Fab>
              </Tooltip>
            ) : null}
          </div>
          <Menu
            open={this.state.editionMenuAnchor != null}
            anchorEl={this.state.editionMenuAnchor}
            onClose={this.handleCloseEditionMenu}
            className="edit-object-menu"
          >
            <MenuItem data-value="informations" onMouseDown={this.handleClickOptionMenu}>
              <InfoIcon />
              {this.props.resources.ManageObjects.ObjectMenuInfos}
            </MenuItem>
            <MenuItem data-value="photos" onMouseDown={this.handleClickOptionMenu}>
              <CollectionsIcon />
              {this.props.resources.ManageObjects.ObjectMenuPictures}
            </MenuItem>
            <MenuItem data-value="classifications" onMouseDown={this.handleClickOptionMenu}>
              <ShareIcon />
              {this.props.resources.ManageObjects.ObjectMenuClassif}
            </MenuItem>
            <MenuItem data-value="properties" onMouseDown={this.handleClickOptionMenu}>
              <AssignmentIcon />
              {this.props.resources.ManageObjects.ObjectMenuProps}
            </MenuItem>
            <MenuItem data-value="models" onMouseDown={this.handleClickOptionMenu}>
              <PhotoFilterIcon />
              {this.props.resources.ManageObjects.ObjectMenuModels}
            </MenuItem>
            <MenuItem data-value="documents" onMouseDown={this.handleClickOptionMenu}>
              <DescriptionIcon />
              {this.props.resources.ManageObjects.ObjectMenuDocs}
            </MenuItem>
            <MenuItem data-value="publication" onMouseDown={this.handleClickOptionMenu}>
              <PublishIcon />
              {this.props.resources.ManageObjects.ObjectMenuPublish}
            </MenuItem>
            {this.props.CurrentGroups.GroupsList != null && (
              <MenuItem data-value="publication" onMouseDown={this.handleClickOptionMenu}>
                <GroupAddIcon />
                {this.props.resources.ManageObjects.ObjectMenuGroup}
              </MenuItem>
            )}
          </Menu>
        </TableCell>
      </TableRow>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    resources: appState.Resources[appState.Language],
    Language: appState.Language,
    TemporaryToken: appState.TemporaryToken,
    ManagementCloudId: appState.ManagementCloudId,
    CurrentGroups: store.groupsState,
    Settings: appState.Settings,
  };
};

export default BimObjectRowManageObject = connect(mapStateToProps)(BimObjectRowManageObject);