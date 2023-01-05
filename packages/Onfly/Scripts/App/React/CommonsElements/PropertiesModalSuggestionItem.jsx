import React from 'react';
import styled from '@emotion/styled';
import Tooltip from '@material-ui/core/Tooltip';
import COLORS from '../../Styles/colors';

const PropertiesModalSuggestionItem = ({ suggestion = {}, onSuggestionPicked }) => {
  const onClickHandler = () => {
    onSuggestionPicked(suggestion);
  };

  return (
    <Container onClick={onClickHandler} data-dismiss="modal">
      <Name>{suggestion.Name}</Name>
      <UnitName>{suggestion.UnitName}</UnitName>
      <Tooltip title={suggestion.Description} placement="top">
        <Description>{suggestion.Description}</Description>
      </Tooltip>
    </Container>
  );
};

const Container = styled.div({
  display: 'flex',
  flexFlow: 'row nowrap',
  padding: '5px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: COLORS.LIGHT_GREY_2,
  },
});

const Name = styled.span({
  fontWeight: 500,
  width: '33%',
  color: COLORS.DARK_GREY,
  fontSize: '12px !important',
});
const UnitName = styled.span({
  width: '33%',
  color: COLORS.DARK_GREY,
  fontSize: '12px !important',
});
const Description = styled.span({
  width: '33%',
  fontStyle: 'italic',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  color: COLORS.LIGHT_GREY,
  fontSize: '12px !important',
});

export default PropertiesModalSuggestionItem;