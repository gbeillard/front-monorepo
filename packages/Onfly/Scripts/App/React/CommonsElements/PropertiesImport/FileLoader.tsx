import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Button } from '@bim-co/componentui-foundation';
import styled from '@emotion/styled';
import CircularProgress from '@material-ui/core/CircularProgress';
import COLORS from '../../../components/colors';
import { selectTranslatedResources } from '../../../Reducers/app/selectors';

const Wrapper = styled.div({
  display: 'flex',
  flexFlow: 'column nowrap',
  justifyContent: 'center',
  alignItems: 'center',
  height: 'inherit',
});
const MainText = styled.span({
  fontWeight: 500,
  fontSize: '20px',
  color: COLORS.N70,
  marginTop: '30px',
});
const SubText = styled.span({
  fontWeight: 'normal',
  fontSize: '14px',
  color: COLORS.N70,
  marginTop: '4px',
});
export const CancelButton = styled(Button)({
  color: COLORS.SECONDARY,
  marginTop: '10px',
});
type Props = {
  resources: any;
  onCancel: () => void;
};
export const FileLoader: React.FC<Props> = ({ resources, onCancel }) => (
  <Wrapper>
    <CircularProgress />
    <MainText>{resources.MetaResource.FileImport}</MainText>
    <SubText>{resources.MetaResource.Wait}</SubText>
    <CancelButton onClick={onCancel}>{resources.MetaResource.Cancel}</CancelButton>
  </Wrapper>
);

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(FileLoader);