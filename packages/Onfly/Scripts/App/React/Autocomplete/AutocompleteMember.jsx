import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';
import Autosuggest from 'react-autosuggest';

// material ui imports
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import ArrowDropdownIcon from '@material-ui/icons/ArrowDropDown';
import InputAdornment from '@material-ui/core/InputAdornment';
import { API_URL } from '../../Api/constants';

const AutocompleteMember = createReactClass({
  getInitialState() {
    return {
      defaultAvatar: `${API_URL}/content/images/default-avatar-man.png`,
      userAvatarUrl: '',
      suggestions: [],
      newQuery: '',
      selectedUserId: 0,
      value: '',
    };
  },

  componentDidMount() { },

  handleChange(event, { method, newValue }) {
    event.preventDefault();
    event.stopPropagation();

    if (method === 'click') {
      this.setState({ value: '' });
    } else {
      this.setState({ value: event.target.value });
    }
  },

  handleSuggestionSelected(
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) {
    this.props.SelectMember(suggestion.UserId);
    this.setState({
      suggestions: [],
      newQuery: '',
      value: this.getSuggestionValue(suggestion),
      selectedUserId: suggestion.UserId,
      userAvatarUrl: suggestion.UserAvatar,
    });
  },

  renderInput(inputProps) {
    const self = this;
    const IsSelectedUser = self.state.selectedUserId !== 0;
    let currentAvatar = self.state.defaultAvatar;

    if (IsSelectedUser) {
      currentAvatar = self.state.userAvatarUrl;
    }

    return (
      <TextField
        className="inputautocompletemember inputautocomplete"
        fullWidth
        label={self.props.Resources.ContentManagement.ContentRequestAssignChooseMember}
        margin="none"
        inputRef={(input) => (self.searchUser = input)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Avatar src={currentAvatar} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <ArrowDropdownIcon className="arrow_drop_down" />
            </InputAdornment>
          ),
        }}
        InputLabelProps={{
          className: 'label-for-multiline',
          shrink: true,
        }}
        {...inputProps}
      />
    );
  },

  handleSuggestionsFetchRequested({ value }) {
    const self = this;
    let query = '';

    if (this.state.selectedUserId === 0) {
      query = value;
    } else {
      this.props.SelectMember(0);
    }

    this.setState({ newQuery: query });

    setTimeout(
      () => {
        if (self.state.newQuery == query) {
          fetch(
            `${API_URL}/api/ws/v1/contentmanagement/${self.props.ManagementCloudId
            }/users/list?search=${query}&token=${self.props.TemporaryToken}&size=${200}&page=${1}`,
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
              self.setState({ suggestions: json.Results, value: query, selectedUserId: 0 });
            });
        }
      },
      query === '' && self.state.suggestions.length === 0 ? 0 : 500
    );
  },

  handleSuggestionsClearRequested() {
    this.setState({ suggestions: [] });
  },

  renderSuggestionsContainer(options) {
    const { containerProps, children } = options;

    return (
      <Paper
        {...containerProps}
        square
        className="dropdownautocomplete"
        style={{ position: 'absolute' }}
      >
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

  shouldRenderSuggestions() {
    return true;
  },

  render() {
    const self = this;

    const theme = {
      suggestionsContainer: {
        display: 'none',
      },
      inputFocused: {
        outline: 'none',
      },
    };

    return (
      <div className="autocomplete-container">
        <Autosuggest
          id="autocompletemember"
          renderInputComponent={self.renderInput}
          onSuggestionsFetchRequested={self.handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={self.handleSuggestionsClearRequested}
          renderSuggestionsContainer={self.renderSuggestionsContainer}
          getSuggestionValue={self.getSuggestionValue}
          renderSuggestion={self.renderSuggestion}
          onSuggestionSelected={self.handleSuggestionSelected}
          focusInputOnSuggestionClick={false}
          shouldRenderSuggestions={self.shouldRenderSuggestions}
          suggestions={self.state.suggestions}
          inputProps={{
            value: self.state.value,
            onChange: self.handleChange,
          }}
          theme={theme}
        />
      </div>
    );
  },
});

// ====
// Helper Method pour supprimer les accents d'une chaine de charactères
// ====

String.prototype.sansAccent = () => {
  const accent = [
    /[\300-\306]/g,
    /[\340-\346]/g, // A, a
    /[\310-\313]/g,
    /[\350-\353]/g, // E, e
    /[\314-\317]/g,
    /[\354-\357]/g, // I, i
    /[\322-\330]/g,
    /[\362-\370]/g, // O, o
    /[\331-\334]/g,
    /[\371-\374]/g, // U, u
    /[\321]/g,
    /[\361]/g, // N, n
    /[\307]/g,
    /[\347]/g, // C, c
  ];
  const noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];

  let str = this;
  for (let i = 0; i < accent.length; i++) {
    str = str.replace(accent[i], noaccent[i]);
  }

  return str;
};

export default AutocompleteMember;