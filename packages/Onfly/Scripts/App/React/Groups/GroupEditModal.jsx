import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import { connect } from 'react-redux';

// material ui calls
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// material ui icons
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';

import styled from '@emotion/styled';
import { API_URL } from '../../Api/constants';
import store from '../../Store/Store';

const WarningMessageWrapper = styled.p({
  position: 'relative',
  paddingLeft: '3em',
  marginTop: '20px',
});

const StyledWarningIcon = styled(WarningIcon)({
  margin: '5px',
  marginTop: '15px',
  position: 'absolute',
  left: 0,
});

let GroupEditModal = ({
  isOpenModal,
  setOpenModal,
  group,
  resources,
  TemporaryToken,
  ManagementCloudId,
}) => {
  const [groupName, setGroupName] = useState(group.Name);
  const [groupDescription, setGroupDescription] = useState(group.Description);
  const [addMode, setAddMode] = useState(group.BimObjectAddMode);

  const saveGroup = () =>
    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${ManagementCloudId}/group/addorupdate?token=${TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          GroupId: group.Id,
          BimObjectAddMode: addMode,
          Name: groupName,
          Description: groupDescription,
        }),
      }
    )
      .then((response) => response.json())
      .then((json) => {
        setOpenModal(false);
        store.dispatch({ type: 'UPDATE_GROUP', data: json });
      });
  return (
    <Modal disableEnforceFocus open={isOpenModal}>
      <div className="modal-dialog modal-add-group">
        <div className="modal-content">
          <div className="modal-header">
            <CloseIcon
              data-cy="bouton de fermeture"
              className="modalCloseIcon"
              onClick={() => setOpenModal(false)}
            />
            <Typography variant="h5" id="myModalLabel">
              {resources.ContentManagement.EditGroup}
            </Typography>
          </div>
          <div className="modal-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-xs-11">
                  <TextField
                    fullWidth
                    label={resources.ContentManagement.GroupName}
                    className="field-group-name"
                    data-cy="nom du projet"
                    onChange={(e) => setGroupName(e.target.value)}
                    value={groupName}
                    inputProps={{
                      'data-cy': 'nom du projet',
                    }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-23">
                  <TextField
                    label={resources.ContentManagement.GroupDescription}
                    className="label-for-multiline"
                    data-cy="description"
                    rows={2}
                    fullWidth
                    value={groupDescription}
                    inputProps={{
                      'data-cy': 'description',
                    }}
                    onChange={(e) => setGroupDescription(e.target.value)}
                  />
                </div>
              </div>

              <WarningMessageWrapper>
                <StyledWarningIcon />
                {resources.ContentManagement.GroupAddAlertMessage}
              </WarningMessageWrapper>
            </div>
          </div>
          <div className="modal-footer">
            <Button data-cy="cancel" className="btn-flat" onClick={() => setOpenModal(false)}>
              {resources.MetaResource.Cancel}
            </Button>
            <Button data-cy="editer un projet" className="btn-flat blue" onClick={saveGroup}>
              {resources.ContentManagement.EditGroup}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const mapStateToProps = ({ appState }) => ({
  resources: appState.Resources[appState.Language],
  TemporaryToken: appState.TemporaryToken,
  ManagementCloudId: appState.ManagementCloudId,
});

export default GroupEditModal = connect(mapStateToProps)(GroupEditModal);