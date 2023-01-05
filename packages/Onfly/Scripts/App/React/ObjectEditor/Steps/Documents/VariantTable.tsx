import React from 'react';
import { Variant, DocumentRead } from '../../../../Reducers/BimObject/Documents/types';
// Child component
import VariantLine from './VariantLine';

type Props = {
  variants: Variant[];
  onClickEdit: (document: DocumentRead) => void;
  onClickDelete: (document: DocumentRead) => void;
  onClickAddDocumentToReference: (variant: Variant) => void;
};

const VariantTable: React.FunctionComponent<Props> = ({
  variants,
  onClickEdit,
  onClickDelete,
  onClickAddDocumentToReference,
}) => {
  if (variants === null || variants === undefined) {
    return null;
  }

  const variantList = variants.map((variant) => (
    <VariantLine
      key={variant.Id}
      variant={variant}
      onClickEdit={onClickEdit}
      onClickDelete={onClickDelete}
      onClickAddDocumentToReference={onClickAddDocumentToReference}
    />
  ));

  return <div>{variantList}</div>;
};

export default VariantTable;