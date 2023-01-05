import React from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import Typography from '@material-ui/core/Typography';
import COLORS from '../../../Styles/colors';
import mapSelectToTranslatedResources from '../../../Reducers/utils/mapSelectToTranslatedResources';

const DropzoneContent = ({ hasFile, resources }) => {
  if (hasFile) {
    return (
      <>
        <DoneIcon />
        <DoneTypography variant="subtitle1">
          {resources.ContentManagement.DropzoneCompleted}
        </DoneTypography>
      </>
    );
  }

  return (
    <>
      <UploadIcon />
      <Typography variant="subtitle1">{resources.ContentManagement.DropzoneTitle}</Typography>
      <Typography variant="subtitle2">{resources.ContentManagement.DropzoneSubtitle}</Typography>
    </>
  );
};

const iconStyles = {
  marginBottom: '5px',
  fontSize: '35px',
};
const UploadIcon = styled(CloudUploadIcon)(iconStyles);
const DoneIcon = styled(CloudDoneIcon)({
  ...iconStyles,
  color: COLORS.SUCCESS,
});
const DoneTypography = styled(Typography)({
  color: COLORS.SUCCESS,
});

export default connect(mapSelectToTranslatedResources)(DropzoneContent);