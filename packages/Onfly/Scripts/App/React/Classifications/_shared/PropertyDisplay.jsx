import React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import COLORS from '../../../Styles/colors';
import mapSelectToTranslatedResources from '../../../Reducers/utils/mapSelectToTranslatedResources';

const PropertyDisplay = ({
  text,
  value,
  onPick,
  onDelete,
  resources,
  disableCriticalFeatures = false,
}) => {
  const hasValue = Boolean(value && value.Name);
  if (hasValue) {
    return (
      <Wrapper>
        <span>{text}</span>
        <PropertyName>{value.Name}</PropertyName>
        {!disableCriticalFeatures && <Icon onClick={onDelete} />}
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <span>{text}</span>
      <PropertyName
        onClick={disableCriticalFeatures ? undefined : onPick}
        clickable={!disableCriticalFeatures}
      >
        {resources.ContentManagement.ClassificationPickValue}
      </PropertyName>
    </Wrapper>
  );
};

const Wrapper = styled.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  margin: '10px 0',
});

const PropertyName = styled.span(({ clickable }) => ({
  cursor: clickable ? 'pointer' : 'initial',
  marginLeft: '10px',
  backgroundColor: COLORS.ACID_BLUE,
  padding: '4px 20px',
  border: `1px solid ${COLORS.ACID_BLUE}`,
  borderRadius: '4px',
}));

const Icon = styled(CancelRoundedIcon)({
  cursor: 'pointer',
});

export default connect(mapSelectToTranslatedResources)(PropertyDisplay);