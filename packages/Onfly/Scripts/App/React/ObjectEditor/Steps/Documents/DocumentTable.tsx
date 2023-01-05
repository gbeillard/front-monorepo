import React from 'react';
import styled from '@emotion/styled';
// Material-UI component
import MuiTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { DocumentRead } from '../../../../Reducers/BimObject/Documents/types';
// Child component
import DocumentLine from './DocumentLine';

const Table = styled(MuiTable)({
  tableLayout: 'fixed',
});

type Props = {
  documents: DocumentRead[];
  showLinkButton?: boolean;
  onClickEdit?: (document: DocumentRead) => void;
  onClickDelete?: (document: DocumentRead) => void;
  onClickDownload?: (document: DocumentRead) => void;
  onClickView?: (document: DocumentRead) => void;
};

const DocumentTable: React.FunctionComponent<Props> = ({
  documents,
  showLinkButton,
  onClickEdit,
  onClickDelete,
  onClickDownload,
  onClickView,
}) => {
  if (documents === null || documents === undefined) {
    return null;
  }

  const documentList = documents.map((document) => (
    <DocumentLine
      key={document.Id}
      document={document}
      showLinkButton={showLinkButton}
      onClickView={onClickView}
      onClickDownload={onClickDownload}
      onClickEdit={onClickEdit}
      onClickDelete={onClickDelete}
    />
  ));

  return (
    <Table>
      <TableBody>{documentList}</TableBody>
    </Table>
  );
};

export default DocumentTable;