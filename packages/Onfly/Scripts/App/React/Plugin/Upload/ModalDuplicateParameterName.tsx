import React from 'react';
import { Button, defaultTheme } from '@bim-co/componentui-foundation';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withStyles } from '@material-ui/core';
import reactStringReplace from 'react-string-replace';
import styled from '@emotion/styled';
import Dialog from '../../../components/dialogs/Dialog';
import DialogTitle from '../../../components/dialogs/DialogTitle';
import DialogContent from '../../../components/dialogs/DialogContent';
import DialogActions from '../../../components/dialogs/DialogActions';
import { selectTranslatedResources } from '../../../Reducers/app/selectors';

type Props = {
  resources: any;
  open: boolean;
  propertyName: string;
  parameterName: string;
  handleConfirm: () => void;
  handleCancel: () => void;
};

const CustomDialog = withStyles({
  root: {
    zIndex: '20000 !important' as unknown as number,
  },
})(Dialog);

const LabelPropertyName = styled.span({
  color: defaultTheme.textColorOnSecondary,
  fontWeight: defaultTheme.boldWeight,
});

// Get Text content of the popin and replace property name and parameter name on the resource
const GetTextDescription = (text: string, propertyName: string, parameterName: string) =>
  reactStringReplace(
    reactStringReplace(text, '[property_name]', () => (
      <LabelPropertyName>{propertyName}</LabelPropertyName>
    )),
    '[param_name]',
    () => <LabelPropertyName>{parameterName}</LabelPropertyName>
  );

const ModalDuplicateParameterName: React.FC<Props> = ({
  resources,
  open,
  propertyName,
  parameterName,
  handleCancel,
  handleConfirm,
}) => (
  <CustomDialog open={open} size="small">
    <DialogTitle>{resources.UploadObject.PropertyAlreadyMappedTitle}</DialogTitle>
    <DialogContent>
      {GetTextDescription(
        resources.UploadObject.PropertyAlreadyMappedDescription,
        propertyName,
        parameterName
      )}
    </DialogContent>
    <DialogActions>
      <Button variant="alternative" onClick={handleCancel}>
        {resources.MetaResource.Cancel}
      </Button>
      <Button variant="primary" onClick={handleConfirm}>
        {resources.MetaResource.Confirm}
      </Button>
    </DialogActions>
  </CustomDialog>
);

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(ModalDuplicateParameterName);