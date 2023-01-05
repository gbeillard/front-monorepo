import React from 'react';
import { Button } from '@bim-co/componentui-foundation';

const AddButton = ({ onClick }) => (
  <Button icon="add" onClick={onClick} variant="alternative" size="dense" />
);

export default AddButton;