// NOTE: this is the same suppression modal than the old but i have removed every bootstrap element
// Please, use that one now.

import React from 'react';
import { Button } from '@bim-co/componentui-foundation';
import Dialog from '../../components/dialogs/Dialog';
import DialogTitle from '../../components/dialogs/DialogTitle';
import DialogContent from '../../components/dialogs/DialogContent';
import DialogActions from '../../components/dialogs/DialogActions';

type Props = {
  open: boolean;
  title: string;
  content: string;
  close: string;
  confirm: string;
  onClose: () => void;
  onConfirm: () => void;
};
const DeleteModal: React.FC<Props> = ({
  open,
  title,
  content,
  close,
  confirm,
  onClose,
  onConfirm,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{content}</DialogContent>
    <DialogActions>
      <Button onClick={onClose}>{close}</Button>
      <Button variant="danger" onClick={onConfirm}>
        {confirm}
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteModal;