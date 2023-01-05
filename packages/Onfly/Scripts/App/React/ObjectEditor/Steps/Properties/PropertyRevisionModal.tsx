import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  P,
  TextField,
} from '@bim-co/componentui-foundation';
import { useNavigate } from 'react-router-dom';
import { LanguageCode } from '../../../../Reducers/BimObject/types';
import * as revisionAPI from '../../../../Reducers/ObjectEditor/api';
import { retrieveUrl } from './utils/retrieveUrl';

type Props = {
  resources: any;
  bimObjectId: number;
  language: LanguageCode;
  redirectOption: string;
  temporaryToken: string;
  handleOpenRevisionModal: boolean;
  handleCloseRevisionModal: () => void;
};

export const PropertyRevisionModal = ({
  resources,
  bimObjectId,
  language,
  redirectOption,
  temporaryToken,
  handleOpenRevisionModal,
  handleCloseRevisionModal,
}: Props) => {
  const navigate = useNavigate();
  const [comment, setComment] = useState();

  const handleCloseModal = () => {
    navigate(retrieveUrl(redirectOption, language, bimObjectId));
    handleCloseRevisionModal();
  };

  const handleChangeText = (event) => setComment(event.target.value);

  const handleClick = () => {
    revisionAPI.addRevision(bimObjectId, comment, temporaryToken);
    navigate(retrieveUrl(redirectOption, language, bimObjectId));
    handleCloseModal();
  };

  return (
    <Dialog isOpen={handleOpenRevisionModal} onClose={handleCloseModal}>
      <DialogTitle>{resources?.EditionPages?.RevisionModalTitle}</DialogTitle>

      <DialogContent>
        <P>{resources?.EditionPages?.RevisionModalExplanation}</P>
        <TextField
          name="Revision"
          label={resources?.EditionPages?.RevisionModalModalLabel}
          placeholder={resources?.EditionPages?.RevisionModalModalPlaceholder}
          height="128px"
          maxLength={300}
          value={comment}
          onChange={handleChangeText}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseModal}>{resources?.EditionPage?.CloseBtnLabel}</Button>
        <Button variant="primary" onClick={handleClick}>
          {resources?.EditionPage?.SaveBtnLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PropertyRevisionModal;
