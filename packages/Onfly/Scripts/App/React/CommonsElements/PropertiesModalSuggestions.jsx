import React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';

import PropertiesModalSuggestionItem from './PropertiesModalSuggestionItem.jsx';
import COLORS from '../../Styles/colors.js';

const Title = styled.h4({
  color: COLORS.ACID_BLUE,
  marginBottom: '5px',
});
const SuggestionsContainer = styled.div({
  display: 'flex',
  flexFlow: 'column nowrap',
});

const PropertiesModalSuggestions = ({ suggestions = [], onSuggestionPicked, resources }) => {
  const suggestionList = suggestions
    .slice(0, 6)
    .map((suggestion) => (
      <PropertiesModalSuggestionItem
        key={suggestion.Name}
        suggestion={suggestion}
        onSuggestionPicked={onSuggestionPicked}
      />
    ));

  return (
    <div>
      <Title>{resources.UploadObject.ChiefSuggestions}</Title>
      <SuggestionsContainer>{suggestionList}</SuggestionsContainer>
    </div>
  );
};

const mapStateToProps = (store) => ({
  resources: store.appState.Resources[store.appState.Language],
});

export default connect(mapStateToProps)(PropertiesModalSuggestions);