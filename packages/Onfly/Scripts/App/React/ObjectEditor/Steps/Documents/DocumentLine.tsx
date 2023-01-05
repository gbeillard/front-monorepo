import React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { Paragraph } from '@bim-co/componentui-foundation';
import { createStructuredSelector } from 'reselect';
import MuiTableRow from '@material-ui/core/TableRow';
import MuiTableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import {
  selectDocumentTypes,
  selectTranslatedResources,
  selectLanguages,
  selectLanguageCode,
} from '../../../../Reducers/app/selectors';

import { DocumentRead, DocumentType } from '../../../../Reducers/BimObject/Documents/types';
// Design system component
import COLORS from '../../../../components/colors';
import { Icon, StartIcon } from '../../../../components/Icons';
// Design system icon
import { getFileIcon } from '../../../../../../Content/Icons/Files';
import LinkIcon from '../../../../../../Content/Icons/Link.svg';
import EditIcon from '../../../../../../Content/Icons/Edit.svg';
import TrashIcon from '../../../../../../Content/Icons/Trash.svg';
import DownloadIcon from '../../../../../../Content/Icons/Download.svg';
import ArrowUpRightIcon from '../../../../../../Content/Icons/Arrows/UpRight.svg';
import EyeIcon from '../../../../../../Content/Icons/Eye.svg';
// Material-UI component

const TableRow = styled(MuiTableRow)({
  '&:hover': {
    backgroundColor: `${COLORS.N20} !important`,

    '.document-action-button': {
      visibility: 'visible',
    },
  },
});

const TableCell = styled(MuiTableCell)({
  borderColor: `${COLORS.P10}`,
});

const GridActionsButton = styled(Grid)({
  visibility: 'hidden',
});

const getLanguageName = (
  resources: any,
  languages: any,
  languageCode: string,
  documentLanguageCode: string
) => {
  // Récupère la langue par rapport à la langue du document
  const language = languages.find((language) => language.LanguageCode === documentLanguageCode);

  let languageName;

  // Récupère le nom de la langue en fonction de la langue en cours
  if (
    language !== null &&
    language !== undefined &&
    language.Translations !== null &&
    language.Translations !== undefined
  ) {
    languageName = language.Translations[languageCode];
  }

  // Si aucune n'a été trouvée on met "Multilingue"
  if (languageName === null || languageName === undefined) {
    languageName = resources.MetaResource.Multilingual;
  }

  return languageName;
};
const getDocumentTypeName = (
  documentTypes: any,
  languageCode: string,
  documentType: DocumentType
) => {
  if (
    documentType === null ||
    documentType === undefined ||
    documentTypes === null ||
    documentTypes === undefined ||
    (documentTypes !== null && documentTypes !== undefined && documentTypes.length === 0)
  ) {
    return '';
  }

  let documentTypeName;

  // Récupère le type du document par rapport à la clé
  const bimObjectDocumentType = documentTypes.find((docType) => docType.Key === documentType.Key);

  if (
    bimObjectDocumentType !== null &&
    bimObjectDocumentType !== undefined &&
    bimObjectDocumentType.BimObjectDocumentTypeLangList !== null &&
    bimObjectDocumentType.BimObjectDocumentTypeLangList !== undefined
  ) {
    // Récupère la traduction du type du document en fonction de la langue en cours
    const bimObjectDocumentTypeLang = bimObjectDocumentType.BimObjectDocumentTypeLangList.find(
      (docTypeLang) => docTypeLang.LanguageCode === languageCode
    );

    if (bimObjectDocumentTypeLang !== null && bimObjectDocumentTypeLang !== undefined) {
      documentTypeName = bimObjectDocumentTypeLang.Name;
    }
  }

  if (documentTypeName === null || documentTypeName === undefined || documentTypeName === '') {
    if (bimObjectDocumentType !== null && bimObjectDocumentType !== undefined) {
      documentTypeName = bimObjectDocumentType.TypeName;
    } else {
      documentTypeName = documentType.Key;
    }
  }

  return documentTypeName;
};
const isAvailableToView = (document: DocumentRead) => {
  const AVAILABLE_EXTENSION_TO_VIEW = {
    pdf: true,
    // Image
    bmp: true,
    gif: true,
    jpeg: true,
    jpg: true,
    png: true,
    // Vidéo
    mp4: true,
    avi: true,
  };

  let isAvailable = false;

  if (
    document !== null &&
    document !== undefined &&
    document.Extension !== null &&
    document.Extension !== undefined
  ) {
    const formatedExtension = document.Extension.replace('.', '').toLowerCase();
    isAvailable = AVAILABLE_EXTENSION_TO_VIEW[formatedExtension] === true;
  }

  return isAvailable;
};

type Props = {
  resources: any;
  languageCode: string;
  documentTypes: any;
  document: DocumentRead;
  showLinkButton?: boolean;
  onClickEdit?: (document: DocumentRead) => void;
  onClickDelete?: (document: DocumentRead) => void;
  onClickDownload?: (document: DocumentRead) => void;
  onClickView?: (document: DocumentRead) => void;
};

const DocumentLine: React.FunctionComponent<Props> = ({
  resources,
  languageCode,
  documentTypes,
  document,
  showLinkButton,
  onClickEdit,
  onClickDelete,
  onClickDownload,
  onClickView,
}) => {
  if (document === null || document === undefined) {
    return null;
  }

  const documentType = getDocumentTypeName(documentTypes, languageCode, document.Type);
  const documentIcon = document.IsInternal ? getFileIcon(document.Extension) : LinkIcon;

  return (
    <TableRow hover>
      <TableCell>
        <Grid container direction="row" alignItems="center" wrap="nowrap">
          <Grid item>
            <StartIcon svg={documentIcon} size="large" />
          </Grid>
          <Grid item zeroMinWidth>
            <Tooltip title={document.Name}>
              <Paragraph nowrap>{document.Name}</Paragraph>
            </Tooltip>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>
        <Grid container>
          <Tooltip title={documentType}>
            <Paragraph nowrap>{documentType}</Paragraph>
          </Tooltip>
        </Grid>
      </TableCell>
      <TableCell />
      <TableCell>
        <GridActionsButton
          container
          direction="row"
          alignItems="center"
          justify="flex-end"
          className="document-action-button"
          spacing={1}
        >
          {document.IsInternal && isAvailableToView(document) && onClickView && (
            <Grid item>
              <Tooltip title={resources.MetaResource.See}>
                <IconButton size="small" onClick={() => onClickView(document)}>
                  <Icon svg={EyeIcon} />
                </IconButton>
              </Tooltip>
            </Grid>
          )}
          {!document.IsInternal && showLinkButton && (
            <Grid item>
              <Tooltip title={resources.ContentManagement.OpenLink}>
                <IconButton size="small" href={document.FileName} target="_blank">
                  <Icon svg={ArrowUpRightIcon} />
                </IconButton>
              </Tooltip>
            </Grid>
          )}
          {document.IsInternal && onClickDownload && (
            <Grid item>
              <Tooltip title={resources.ContentManagement.DocumentActionDownload}>
                <IconButton size="small" onClick={() => onClickDownload(document)}>
                  <Icon svg={DownloadIcon} />
                </IconButton>
              </Tooltip>
            </Grid>
          )}
          {onClickEdit && (
            <Grid item>
              <Tooltip title={resources.EditDocumentsPage.Edit}>
                <IconButton size="small" onClick={() => onClickEdit(document)}>
                  <Icon svg={EditIcon} />
                </IconButton>
              </Tooltip>
            </Grid>
          )}
          {onClickDelete && (
            <Grid item>
              <Tooltip title={resources.MetaResource.Delete}>
                <IconButton size="small" onClick={() => onClickDelete(document)}>
                  <Icon svg={TrashIcon} />
                </IconButton>
              </Tooltip>
            </Grid>
          )}
        </GridActionsButton>
      </TableCell>
    </TableRow>
  );
};

const mapSelectToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  languageCode: selectLanguageCode,
  documentTypes: selectDocumentTypes,
});

export default connect(mapSelectToProps)(DocumentLine);