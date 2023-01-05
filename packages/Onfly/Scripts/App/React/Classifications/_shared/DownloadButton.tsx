import React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { createStructuredSelector } from 'reselect';
import { selectTranslatedResources } from '../../../Reducers/app/selectors';

const StyledButton = styled(Button)({ marginTop: '20px' });
const Icon = styled(CloudDownloadIcon)({ marginRight: '5px' });

type Props = {
  onDownload: React.MouseEventHandler<HTMLButtonElement>;
  resources: any;
  disableCriticalFeatures?: boolean;
};

const DownloadButton: React.FC<Props> = ({ onDownload, resources, disableCriticalFeatures }) => (
  <StyledButton
    variant="contained"
    color="primary"
    fullWidth
    onClick={onDownload}
    disabled={disableCriticalFeatures}
  >
    <Icon />
    {resources.ContentManagement.DownloadModel}
  </StyledButton>
);

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(DownloadButton);