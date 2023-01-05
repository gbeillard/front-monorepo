import React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { Typography } from '@material-ui/core';
import CommonProps from '../_shared/CommonProps';
import Classifications from '../_shared/Classifications';
import mapSelectToTranslatedResources from '../../../Reducers/utils/mapSelectToTranslatedResources';

const Copy = ({ classification, onClassificationChanged, resources }) => {
  const onChangeHandler = (copyFrom) => {
    onClassificationChanged({ ...classification, CopyFrom: copyFrom });
  };
  return (
    <>
      <CommonProps
        classification={classification}
        onClassificationChanged={onClassificationChanged}
      />
      <Wrapper>
        <Typography>{resources.ContentManagement.ClassificationsSelectLeft}</Typography>
        <LongClassifications
          selectedClassificationId={classification.CopyFrom}
          onChange={onChangeHandler}
        />
        <Typography>{resources.ContentManagement.ClassificationsSelectRight}</Typography>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div({
  display: 'flex',
  width: '100%',
  marginTop: '20px',
  justifyContent: 'space-evenly',
  alignItems: 'baseline',
});

const LongClassifications = styled(Classifications)({
  flexGrow: 1,
  marginLeft: '10px',
  marginRight: '10px',
});

export default connect(mapSelectToTranslatedResources)(Copy);