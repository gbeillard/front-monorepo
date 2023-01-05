import React from 'react';
import createReactClass from 'create-react-class';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import store from '../../Store/Store';
import { API_URL } from '../../Api/constants';

let AutocompleteTag = createReactClass({
  getInitialState() {
    return {
      value: '',
      suggestions: [],
      newKeyWord: '',
    };
  },

  updateAutoCompleteInputTag(value) {
    const self = this;

    let url = `${API_URL}/api/ws/v1/contentmanagement/${this.props.ManagementCloudId}/pin/list?token=${this.props.TemporaryToken}&search=${value}&size=10`;
    let method = 'GET';
    let body = null;

    if (this.props.SubDomain === 'community') {
      url = `${API_URL}/api/${this.props.Language}/tags/searchbyname`;
      method = 'POST';
      body = JSON.stringify({ Query: value });
    }

    fetch(url, {
      method,
      body,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(response => response.json()).then(json => {
      const tagsMappeds = [];
      const resultsList = json;
      for (let i = 0; i < resultsList.length; i++) {
        const current = resultsList[i];
        let line = { textKey: current.ContentmanagementPinName, valueKey: current.ContentmanagementPinId };
        if (self.props.SubDomain === 'community') {
          line = { textKey: current.Name_CI_AI, valueKey: current.Id };
        }
        tagsMappeds.push(line);
      }

      if (tagsMappeds.length > 0) {
        self.setState({ suggestions: tagsMappeds });
      } else {
        const proposeAddTag = [];

        if (self.props.RoleKey === 'admin') {
          const lineNewTag = { textKey: (`${self.props.resources.SearchResults.AddTagLabel} ${value}`), valueKey: 'addPin' };
          proposeAddTag.push(lineNewTag);
        }

        self.setState({ suggestions: proposeAddTag });
      }
    });
  },

  renderSuggestionsContainer(options) {
    const { containerProps, children } = options;

    return (
      <Paper {...containerProps} square>
        {children}
      </Paper>
    );
  },

  getSuggestionValue(suggestion) {
    return suggestion.textKey;
  },

  renderSuggestion(suggestion, { query, isHighlighted }) {
    const value = this.getSuggestionValue(suggestion);
    const matches = match(value, query);
    const parts = parse(value, matches);

    return (
      <MenuItem selected={isHighlighted} component="div">
        <div>
          {parts.map((part, index) => (part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          )))}
        </div>
      </MenuItem>
    );
  },

  renderInput(inputProps) {
    return (
      <TextField
        fullWidth
        {...inputProps}
      />
    );
  },

  handleChange(event, { method, newValue }) {
    event.preventDefault();
    event.stopPropagation();

    if (method === 'click') {
      this.state.value = newValue;
    } else {
      this.state.value = event.target.value;
    }
  },

  render() {
    const self = this;

    const handleSuggestionsFetchRequested = ({ value }) => {
      const self = this;
      self.setState({ newKeyWord: value });
      setTimeout(() => {
        if (self.state.newKeyWord === value) {
          self.updateAutoCompleteInputTag(value);
        }
      }, 500);
    };

    const handleSuggestionsClearRequested = () => {
      this.setState({ suggestions: [] });
    };

    const handleSuggestionSelected = (event, {
      suggestion, suggestionValue, suggestionIndex, sectionIndex, method,
    }) => {
      if (suggestion.valueKey === 'addPin') {
        this.props.selectTag({ TagId: '', Value: suggestion.textKey.substring((`${self.props.resources.SearchResults.AddTagLabel} `).length) });
        this.setState({ value: '', suggestions: [], newKeyWord: '' });
      } else {
        this.props.selectTag({ TagId: suggestion.valueKey, Value: suggestion.textKey });
        this.setState({ value: '', suggestions: [], newKeyWord: '' });
      }
    };

    const { value, suggestions } = this.state;
    const classes = self.props;

    return (
      <div className="autocomplete-container">
        <Autosuggest
          renderInputComponent={this.renderInput}
          onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={handleSuggestionsClearRequested}
          renderSuggestionsContainer={this.renderSuggestionsContainer}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          onSuggestionSelected={handleSuggestionSelected}
          suggestions={this.state.suggestions}
          inputProps={{
            placeholder: self.props.resources.SearchResults.TagsTitle,
            value: this.state.value,
            onChange: this.handleChange,
          }}
        />
      </div>
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
    SubDomain: appState.SubDomain,
    RoleKey: appState.RoleKey,
  };
};

export default AutocompleteTag = connect(mapStateToProps)(AutocompleteTag);