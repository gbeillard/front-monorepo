import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import styled from '@emotion/styled';
import { TableHead } from '@material-ui/core';
import _ from 'underscore';
import NotificationSwitches from './NotificationSwitches';
import { SwitchNotif, GetNotif } from '../../Api/OnflyNotificationsApi';
import UserNavBar from './UserNavBar';

const Container = styled.div`
  padding: 3rem;
  background-color: #fff;
`;

const CategoryLabel = styled.p`
  color: '#676767';
  font-weight: bold;
`;

let UserNotifications = ({ resources, Language, ContentManagementId, TemporaryToken }) => {
  const [state, setState] = useState(null);
  // MAP OF TYPE TO NAME
  const dico = new Map();
  dico.set('NEW_USER', resources.UserAccount.NewUser);
  dico.set('CONTENT_REQUEST', resources.UserAccount.ContentRequest);
  dico.set('VALIDATION_REQUEST', resources.UserAccount.ValidationRequest);
  dico.set('CONTENT_PUBLICATION', resources.UserAccount.ContentPublication);
  dico.set('PROPERTY_MODIFICATION', resources.UserAccount.PropertyModification);
  dico.set('MOVED_CLASS', resources.UserAccount.MovedClass);
  dico.set('EXPORT_HAS_ENDED', resources.ContentManagement.ExportHasEnded);
  dico.set('EXPORT_HAS_STARTED', resources.ContentManagement.ExportHasStarted);

  console.log(resources.ContentManagement.ExportReadyForDownload);

  useEffect(() => {
    const fetchState = async () => {
      const jsonResponse = await GetNotif(TemporaryToken, ContentManagementId);
      setState(_.groupBy(jsonResponse, 'Category'));
    };
    fetchState();
  }, []);

  return (
    <div className="user-settings-panel" style={{ padding: '0px' }}>
      <UserNavBar />
      <div className="row">
        <h1>{resources.UserAccount.Notifications}</h1>
        <Container>
          <Table>
            {
              // USER CATEGORIE
              state != null ? (
                state.USER != undefined ? (
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <CategoryLabel>
                          {resources.SearchResults.ObjectTypeFilterUserContent}
                        </CategoryLabel>
                      </TableCell>
                      <TableCell>{resources.UserAccount.ByMessage}</TableCell>
                      <TableCell>{resources.UserAccount.ByMail}</TableCell>
                    </TableRow>
                  </TableHead>
                ) : null
              ) : null
            }

            {state != null ? (
              state.USER != undefined ? (
                <TableBody>
                  {state.USER.map((item) => {
                    item.Name = dico.get(item.Type);
                    return <NotificationSwitches notification={item} />;
                  })}
                </TableBody>
              ) : null
            ) : null}

            {
              // CONTENT CATEGORIE
              state != null ? (
                state.CONTENT != undefined ? (
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <CategoryLabel>{resources.UserAccount.Content}</CategoryLabel>
                      </TableCell>
                      <TableCell>
                        {state.USER == undefined ? resources.UserAccount.ByMessage : null}
                      </TableCell>
                      <TableCell>
                        {state.USER == undefined ? resources.UserAccount.ByMail : null}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                ) : null
              ) : null
            }

            {state != null ? (
              state.CONTENT != undefined ? (
                <TableBody>
                  {state.CONTENT.map((item) => {
                    item.Name = dico.get(item.Type);
                    return <NotificationSwitches notification={item} />;
                  })}
                </TableBody>
              ) : null
            ) : null}

            {
              // CLASSIFICATION CATEGORIE
              state != null ? (
                state.CLASSIFICATION != undefined ? (
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <CategoryLabel>
                          {resources.ContentManagement.CreateContentRequestClassificationLabel}
                        </CategoryLabel>
                      </TableCell>
                      <TableCell>
                        {state.USER == undefined && state.CONTENT == undefined
                          ? resources.UserAccount.ByMessage
                          : null}
                      </TableCell>
                      <TableCell>
                        {state.USER == undefined && state.CONTENT == undefined
                          ? resources.UserAccount.ByMail
                          : null}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                ) : null
              ) : null
            }

            {state != null ? (
              state.CLASSIFICATION != undefined ? (
                <TableBody>
                  {state.CLASSIFICATION.map((item) => {
                    item.Name = dico.get(item.Type);
                    return <NotificationSwitches notification={item} />;
                  })}
                </TableBody>
              ) : null
            ) : null}
          </Table>
        </Container>
      </div>
    </div>
  );
};

const mapStateToProps = ({ appState }) => ({
  ContentManagementId: appState.ManagementCloudId,
  TemporaryToken: appState.TemporaryToken,
  Language: appState.Language,
  resources:
    appState.Resources[appState.Language] != null ? appState.Resources[appState.Language] : [],
});

export default UserNotifications = connect(mapStateToProps)(UserNotifications);