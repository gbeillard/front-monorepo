import React from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { Button, Paragraph, shadow } from '@bim-co/componentui-foundation';
import { createStructuredSelector } from 'reselect';
// Reducer
// Design system component
// Design system icon
// Material-UI component
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import ChevronDownIcon from '../../../../../../Content/Icons/ChevronDown.svg';
import CreateIcon from '../../../../../../Content/Icons/Create.svg';
import Divider from '../../../../components/layout/Divider';
import { Icon } from '../../../../components/Icons';
import { selectTranslatedResources } from '../../../../Reducers/app/selectors';
import { DocumentRead, Variant } from '../../../../Reducers/BimObject/Documents/types';
// Child component
import DocumentTable from './DocumentTable';

type Props = {
  resources: any;
  variant: Variant;
  onClickEdit: (document: DocumentRead) => void;
  onClickDelete: (document: DocumentRead) => void;
  onClickAddDocumentToReference: (variant: Variant) => void;
};

const VariantLine: React.FunctionComponent<Props> = ({
  resources,
  variant,
  onClickEdit,
  onClickDelete,
  onClickAddDocumentToReference,
}) => {
  if (variant == null || variant == undefined) {
    return null;
  }

  let secondaryTitle = resources.EditDocumentsPage.NumberOfDocument;

  if (
    secondaryTitle !== null &&
    secondaryTitle !== undefined &&
    variant.Documents !== null &&
    variant.Documents !== undefined
  ) {
    secondaryTitle = secondaryTitle.replace('[NbDocuments]', variant.Documents.length);
  }

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<Icon svg={ChevronDownIcon} size="dense" />}>
        <Grid container direction="row" alignItems="center" wrap="nowrap" spacing={2}>
          <Grid item xs={4}>
            <Tooltip title={variant.Name}>
              <VariantNameContainer>
                <Paragraph medium nowrap>
                  {variant.Name}
                </Paragraph>
              </VariantNameContainer>
            </Tooltip>
          </Grid>
          <Grid item xs={8}>
            <Paragraph nowrap>{secondaryTitle}</Paragraph>
          </Grid>
        </Grid>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <DocumentTable
          documents={variant.Documents}
          onClickEdit={onClickEdit}
          onClickDelete={onClickDelete}
        />
      </ExpansionPanelDetails>
      <Divider />
      <ExpansionPanelActions>
        <Button
          variant="secondary"
          icon={CreateIcon}
          onClick={() => onClickAddDocumentToReference(variant)}
        >
          {resources.EditDocumentsPage.AddDocumentToReference}
        </Button>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};

const ExpansionPanel = styled(MuiExpansionPanel)({
  boxShadow: shadow[10],
});

const ExpansionPanelSummary = withStyles({
  content: {
    width: 'calc(100% - 48px)',
  },
})(MuiExpansionPanelSummary);

const VariantNameContainer = styled.div({
  display: 'inline-flex',
});

const mapSelectToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});
export default connect(mapSelectToProps)(VariantLine);