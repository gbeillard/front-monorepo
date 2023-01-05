import React from 'react';
import createReactClass from 'create-react-class';
import Autosuggest from 'react-autosuggest';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import { connect } from 'react-redux';
import { API_URL } from '../../Api/constants';

let AutocompleteUser = createReactClass({
  getInitialState() {
    return {
      value: '',
      suggestions: [],
      newKeyWord: '',
    };
  },

  renderSuggestionsContainer(options) {
    const { containerProps, children } = options;

    return (
      <Paper {...containerProps} square style={{ position: 'absolute', zIndex: 20, width: '100%' }}>
        {children}
      </Paper>
    );
  },

  getSuggestionValue(suggestion) {
    return `${suggestion.UserFirstName} ${suggestion.UserLastName}`;
  },

  renderSuggestion(suggestion, { query, isHighlighted }) {
    const value = this.getSuggestionValue(suggestion);

    return (
      <MenuItem selected={isHighlighted} component="div">
        <Avatar src={`${suggestion.UserAvatar}?height=40&width=40`} />
        <div>
          <strong style={{ fontWeight: 300, marginLeft: '10px' }}>{value}</strong>
        </div>
      </MenuItem>
    );
  },

  renderInput(inputProps) {
    return (
      <TextField
        fullWidth
        label={this.props.resources.ContentManagement.SearchUserAddTitle}
        InputLabelProps={{
          shrink: true,
        }}
        {...inputProps}
      />
    );
  },

  handleChange(event, { method, newValue }) {
    event.preventDefault();
    event.stopPropagation();

    if (method === 'click') {
      this.state.value = '';
    } else {
      this.state.value = event.target.value;
    }
  },

  updateAutoCompleteInputManufacturer(value) {
    const query = value != null ? value : '';
    const self = this;
    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.ManagementCloudId
      }/users/list?search=${query}&token=${this.props.TemporaryToken
      }&size=${10}&page=${1}&roleKey=partner`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        self.setState({ suggestions: json.Results, query });
      });
  },

  shouldRenderSuggestions() {
    return true;
  },

  render() {
    const self = this;

    const handleSuggestionsFetchRequested = ({ value }) => {
      self.setState({ newKeyWord: value });
      setTimeout(
        () => {
          if (self.state.newKeyWord == value) {
            self.updateAutoCompleteInputManufacturer(value);
          }
        },
        value == '' && self.state.suggestions.length == 0 ? 0 : 500
      );
    };

    const handleSuggestionsClearRequested = () => {
      this.setState({ suggestions: [] });
    };

    const handleSuggestionSelected = (
      event,
      { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
    ) => {
      this.props.addUser(suggestion.UserId);
    };

    const { value, suggestions } = this.state;

    return (
      <Autosuggest
        renderInputComponent={this.renderInput}
        onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={handleSuggestionsClearRequested}
        renderSuggestionsContainer={this.renderSuggestionsContainer}
        focusInputOnSuggestionClick={false}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        onSuggestionSelected={handleSuggestionSelected}
        suggestions={this.state.suggestions}
        inputProps={{
          placeholder: self.props.resources.ContentManagement.SearchUserAddPlaceHolder,
          value: this.state.value,
          onChange: this.handleChange,
        }}
      />
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    platformUrl: appState.platform_url,
    Language: appState.Language,
    resources: appState.Resources[appState.Language],
    TemporaryToken: appState.TemporaryToken,
    ManagementCloudId: appState.ManagementCloudId,
  };
};

export default AutocompleteUser = connect(mapStateToProps)(AutocompleteUser);