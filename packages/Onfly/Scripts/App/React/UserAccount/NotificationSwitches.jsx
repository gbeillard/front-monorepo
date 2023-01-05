import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Switch from '@material-ui/core/Switch';
import { SwitchNotif } from '../../Api/OnflyNotificationsApi';

let NotificationSwitches = ({ notification, ContentManagementId, TemporaryToken }) => {
  const [state, setState] = useState(notification);

  const handleChange = async (event) => {
    const newState = {
      ...state,
      [event.target.name]: event.target.checked,
    };
    setState(newState);
    const response = await SwitchNotif(TemporaryToken, ContentManagementId, state.Type, newState);
    if (!response.ok) setState(state);
  };

  return (
    <TableRow>
      <TableCell>{state.Name}</TableCell>
      <TableCell>
        <Switch
          checked={state.IsMessage}
          onChange={handleChange}
          name="IsMessage"
          color="primary"
        />
      </TableCell>
      <TableCell>
        <Switch checked={state.IsMail} onChange={handleChange} name="IsMail" color="primary" />
      </TableCell>
    </TableRow>
  );
};

const mapStateToProps = ({ appState }) => ({
  ContentManagementId: appState.ManagementCloudId,
  TemporaryToken: appState.TemporaryToken,
});

export default NotificationSwitches = connect(mapStateToProps)(NotificationSwitches);