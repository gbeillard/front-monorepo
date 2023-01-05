// Requirements =>
// Need SelectedObjects as [] in case of multiselection
// Need Resources as object
// Need ManagementCloudId as int
// Need TemporaryToken as string
// Need Datas as object with datas of search result objects
// Need UpdateStatusCurrentList as function to update status of a list
// Need CurrentGroups as list of avalaibles groups
// Need UnselectAllObjects as function to unselect all objects
// Need HandleChangeAddProjects as function to add object list to a group
// Need PublishObjectInPrivateCloud as function to add object list to a private cloud (if option is avalaible)
// Need PublishObjectInBimAndCo as function to add object list to Bim&Co plateform
// Need DeleteCurrentList as function to delete object list
// Need Settings as object of current onfly setting
// Need RemoveGroupObjectList as function to remove object list from group
// Need UnpublishObjectListInBimAndCo as function to unpublish object list from BimAndCo
// Need UnpublishObjectListPrivateCloud as function to unpublish object list from private cloud

import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';

// Material UI
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';

// Material UI Icon
import CancelIcon from '@material-ui/icons/Cancel.js';
import DeviceHubIcon from '@material-ui/icons/DeviceHub.js';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff.js';
import VisibilityIcon from '@material-ui/icons/Visibility.js';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown.js';
import DeleteIcon from '@material-ui/icons/Delete.js';
import GroupIcon from '@material-ui/icons/Group.js';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import { Icon } from '@bim-co/componentui-foundation';
import SelectClassificationsModal from './SelectClassificationsModal.jsx';
import * as Utils from '../../Utils/utils.js';
import AutocompleteGroup from '../Autocomplete/AutocompleteGroup.jsx';

import { getGroupTypeLabel } from '../../Reducers/groups/utils';

const ManageObjectsUnderBand = createReactClass({
  getInitialState() {
    return {
      filterClassifActive: false,
      filterProjectActive: false,
      orderBy: 'CreatedAt',
      order: 'Desc',
      addProjectsPopInIsOpen: false,
      anchorAddProjectsPopIn: null,
      anchorMenuStatus: null,
    };
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

  showClassifier() {
    this.setState({ classificationsListSelectMulti: [], selectedObjectMono: null });
    $('#choose-classification').modal();
  },

  handleClickMenuStatus(event) {
    this.setState({ anchorMenuStatus: event.currentTarget });
  },

  handleCloseMenuStatus() {
    this.setState({ anchorMenuStatus: null });
  },

  render() {
    const self = this;
    let projectsButton;
    const projectFromSelectedObjects = [];

    const allSelectedObjectsAreOnOnfly =
      self.props.Datas?.filter(
        (data) =>
          !data?.IsOnManagementCloud && self.props.SelectedObjects?.some((o) => o === data?.Id)
      )?.length === 0;

    if (self.props.CurrentGroups.GroupsList != null && allSelectedObjectsAreOnOnfly) {
      projectsButton = (
        <li key="projectBtn">
          <Button onClick={self.showProjectsAssign}>
            <GroupIcon />
            {self.props.Resources.ManageObjects.BarActionsProjectAdd}
          </Button>
        </li>
      );
    }

    if (self.props.Datas !== undefined && self.props.Datas.length > 0) {
      const groupIdParsed = [];

      _.each(self.props.Datas, (data, i) => {
        if (
          self.state.addProjectsPopInIsOpen &&
          _.indexOf(self.props.SelectedObjects, data.Id.toString()) > -1
        ) {
          _.each(data?.GroupsList, (value, index) => {
            if (_.indexOf(groupIdParsed, value.Id) === -1) {
              const avatarClassName = `group-tag ${value?.GroupType}`;
              let avatarContent = value?.IsFavorite ? (
                <Icon icon="favorite" size="xs" />
              ) : (
                getGroupTypeLabel(self.props.Resources, value?.GroupType)
              );

              if (avatarContent && !value?.IsFavorite) {
                avatarContent = avatarContent?.substring(0, 1);
              }

              projectFromSelectedObjects.push(
                <Chip
                  key={`more-availability-${value.Id}`}
                  className="chip-availability group-tag more"
                  label={value.Name}
                  data-id={value.Id}
                  onDelete={self.props.RemoveGroupObjectList}
                  avatar={<Avatar className={avatarClassName}>{avatarContent}</Avatar>}
                />
              );

              groupIdParsed.push(value.Id);
            }

            if (data.IsOnManagementCloud && _.indexOf(groupIdParsed, 'onfly') === -1) {
              projectFromSelectedObjects.push(
                <Chip
                  key="more-availability-"
                  className="chip-availability group-tag more"
                  label="OnFly"
                />
              );
              groupIdParsed.push('onfly');
            }

            if (data.StatusPublic === 'published' && _.indexOf(groupIdParsed, 'bimandco') === -1) {
              projectFromSelectedObjects.push(
                <Chip
                  key="more-availability-"
                  className="chip-availability group-tag more"
                  label="BIM&CO"
                  data-id="bimanco"
                  onDelete={self.props.UnpublishObjectListInBimAndCo}
                />
              );
              groupIdParsed.push('bimandco');
            }

            if (
              self.props.Settings.HasPrivateSite &&
              (data.StatusPC === 'published' ||
                (data.StatusPC === '' && data.StatusPublic === 'published')) &&
              _.indexOf(groupIdParsed, 'privateCloud') === -1
            ) {
              projectFromSelectedObjects.push(
                <Chip
                  key="more-availability-"
                  className="chip-availability group-tag more"
                  label="Private Cloud"
                  data-id="privatecloud"
                  onDelete={self.props.UnpublishObjectListPrivateCloud}
                />
              );
              groupIdParsed.push('privateCloud');
            }
          });
        }
      });
    }

    return (
      <div id="underBand">
        <div id="underBandSelection" className="hidden mui-fixed">
          <div className="underBandSelection-padding">
            <span>
              {self.props.SelectedObjects.length}{' '}
              {self.props.Resources.ManageObjects.BarActionsObjectsSelected}
            </span>
            <Button onClick={self.props.UnselectAllObjects}>
              <CancelIcon />
            </Button>
          </div>
          <ul>
            {projectsButton}
            <li key="classifBtn">
              <Button onClick={self.showClassifier}>
                <DeviceHubIcon />
                {self.props.Resources.ManageObjects.BarActionsClassification}
              </Button>
            </li>
            <li key="statusBtn">
              <Button
                aria-owns={self.state.anchorMenuStatus ? 'menu-status-multi' : undefined}
                aria-haspopup="true"
                onClick={self.handleClickMenuStatus}
              >
                <VisibilityIcon />
                {self.props.Resources.ManageObjects.ResultColumnStatus}
                <ArrowDropDownIcon />
              </Button>
              <Menu
                id="menu-status-multi"
                anchorEl={self.state.anchorMenuStatus}
                open={Boolean(self.state.anchorMenuStatus != null)}
                onClose={self.handleCloseMenuStatus}
                style={{ zIndex: 3001 }}
              >
                <MenuItem onClick={self.props.UpdateStatusCurrentList} data-status="published">
                  <VisibilityIcon className="object-visible" />
                  {self.props.Resources.BimObjectStatus.Published}
                </MenuItem>
                <MenuItem onClick={self.props.UpdateStatusCurrentList} data-status="hidden">
                  <VisibilityOffIcon className="object-hidden" />
                  {self.props.Resources.BimObjectStatus.Hidden}
                </MenuItem>
              </Menu>
            </li>
            <li key="deleteBtn">
              <Button onClick={self.props.DeleteCurrentList}>
                <DeleteIcon />
                {self.props.Resources.ManageObjects.BarActionsObjectsDelete}
              </Button>
            </li>
          </ul>

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
            style={{ marginTop: '-70px' }}
          >
            <div className="add-project-pop">
              <div className="more-availability-list-autocomplete">
                <AutocompleteGroup
                  AddToPrivateCloud={self.props.PublishObjectInPrivateCloud}
                  AddToBimAndCo={self.props.PublishObjectInBimAndCo}
                  SelectedObjects={this.props.SelectedObjects}
                  WithCollection
                />
              </div>
              <div className="more-availability-list-popover">{projectFromSelectedObjects}</div>
            </div>
          </Popover>
        </div>

        <SelectClassificationsModal
          Resources={self.props.Resources}
          ManagementCloudId={self.props.ManagementCloudId}
          TemporaryToken={self.props.TemporaryToken}
          SelectedObjects={self.props.SelectedObjects}
        />
      </div>
    );
  },
});

export default ManageObjectsUnderBand;