import React from 'react';
import { Button } from '@bim-co/componentui-foundation';

const DeleteButton = ({ onClick }) => (
  <Button icon="delete" size="dense" variant="alternative" onClick={onClick} />
);

export default DeleteButton;