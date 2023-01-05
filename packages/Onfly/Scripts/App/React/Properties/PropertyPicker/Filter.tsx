import React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { TextField } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { selectTranslatedResources } from '../../../Reducers/app/selectors';

const Wrapper = styled.div({ padding: '10px 20px', width: '100%' });

type Props = {
  value: string;
  onChange: (v: string) => void;
  resources: any;
};

const Filter: React.FunctionComponent<Props> = ({ value, onChange, resources }) => {
  const onChangeHandler = (event) => {
    onChange(event.target.value);
  };

  return (
    <Wrapper>
      <TextField
        value={value}
        onChange={onChangeHandler}
        placeholder={resources.EditClassificationsPage.Filter}
      />
    </Wrapper>
  );
};

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(Filter);