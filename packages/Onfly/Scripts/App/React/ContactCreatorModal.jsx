import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import toastr from 'toastr';
import styled from '@emotion/styled';
import { TextField, Button, space } from '@bim-co/componentui-foundation';

import {
  selectTranslatedResources,
  selectToken,
  selectManagementCloudId,
  selectUser,
} from '../Reducers/app/selectors';

import { API_URL } from '../Api/constants';

import Dialog from '../components/dialogs/Dialog';
import DialogTitle from '../components/dialogs/DialogTitle';
import DialogContent from '../components/dialogs/DialogContent';
import DialogActions from '../components/dialogs/DialogActions';

const ContactCreatorModal = ({
  token,
  managementCloudId,
  user,
  resources,
  contactCreatorMessage,
  handleCloseModalContactCreator,
}) => {
  useEffect(() => {
    setSubject(contactCreatorMessage ? contactCreatorMessage.subject : '');
    setContent('');
  }, [contactCreatorMessage]);

  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const onSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const onContentChange = (event) => {
    setContent(event.target.value);
  };

  // todo: REWRITE
  const sendMessageToAuthor = () => {
    if (subject !== '' && content !== '') {
      const receiver = {
        ReceiverId: contactCreatorMessage.receiverId,
        ReceiverType: contactCreatorMessage.receiverType,
      };

      fetch(
        `${API_URL}/api/ws/v1/message/new?token=${token}&contentManagementId=${managementCloudId}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Subject: subject,
            Content: content,
            SenderId: user.id,
            SenderType: 'user',
            BimObjectId: null, // todo: fix this
            Receivers: [receiver],
          }),
        }
      )
        .then((response) => {
          handleCloseModalContactCreator();

          return response.json();
        })
        .then((json) => {
          if (json != null && json.length > 0 && json[0].MessageId > 0) {
            // Lecture des messages
            $.ajax({
              type: 'POST',
              dataType: 'json',
              url: `${API_URL}/api/ws/v1/en/messages/${json[0].MessageId}/readLastMessage?token=${token}`,
              contentType: 'application/json; charset=utf-8',
              async: true,
            });

            toastr.success(resources.MetaResource.SendSuccess);
          }
        });
    }
  };

  return (
    <Dialog open={!!contactCreatorMessage} onClose={handleCloseModalContactCreator} fullWidth>
      <DialogTitle>{resources.BimObjectDetails.ContactCreatorLabel}</DialogTitle>
      <StyledDialogContent>
        <TextField label={resources.FormLabel.Subject} value={subject} onChange={onSubjectChange} />
        <TextField
          id="contact-creator-message"
          label={resources.FormLabel.Message}
          isMultiline
          rows={10}
          variant="outlined"
          value={content}
          onChange={onContentChange}
        />
      </StyledDialogContent>
      <DialogActions>
        <Button onClick={handleCloseModalContactCreator}>{resources.MetaResource.Cancel}</Button>
        <Button variant="primary" onClick={sendMessageToAuthor}>
          {resources.MetaResource.Send}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapSelectToProps = createStructuredSelector({
  token: selectToken,
  managementCloudId: selectManagementCloudId,
  user: selectUser,
  resources: selectTranslatedResources,
});

const StyledDialogContent = styled(DialogContent)`
  > * + * {
    margin-top: ${space[100]};
  }
`;

export default connect(mapSelectToProps)(ContactCreatorModal);