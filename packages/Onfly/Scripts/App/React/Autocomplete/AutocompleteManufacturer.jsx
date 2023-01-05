import React from 'react';
import createReactClass from 'create-react-class';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import { API_URL } from '../../Api/constants';

let AutocompleteManufacturer = createReactClass({
  getInitialState() {
    return {
      value: '',
      manufacturersSupplierList: [],
      newKeyWord: '',
    };
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
          {parts.map((part, index) =>
            part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
              </span>
            ) : (
              <strong key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </strong>
            )
          )}
        </div>
      </MenuItem>
    );
  },

  renderInput(inputProps) {
    return (
      <TextField
        fullWidth
        label={this.props.resources.ContentManagement.SupplierDetailsName}
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
      this.state.value = newValue;
    } else {
      this.state.value = event.target.value;
      this.props.selectManuf({ ManufId: '', CustomValue: event.target.value });
    }
  },

  updateAutoCompleteInputManufacturer(value) {
    const self = this;

    const request = {
      ManufacturerSearch: value,
    };

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.ManagementCloudId}/manufacturer/search/?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    )
      .then((response) => response.json())
      .then((json) => {
        const manufsMappeds = [];
        const resultsList = json;
        for (let i = 0; i < resultsList.length; i++) {
          const current = resultsList[i];
          const line = { textKey: current.Name, valueKey: current.Id };
          manufsMappeds.push(line);
        }

        if (manufsMappeds.length > 0) {
          self.setState({ manufacturersSupplierList: manufsMappeds });
        } else {
          self.setState({ manufacturersSupplierList: [], selectedManufacturer: '' });
        }
      });
  },

  render() {
    const self = this;

    const handleSuggestionsFetchRequested = ({ value }) => {
      const self = this;
      self.setState({ newKeyWord: value });
      setTimeout(() => {
        if (self.state.newKeyWord === value) {
          self.updateAutoCompleteInputManufacturer(value);
        }
      }, 500);
    };

    const handleSuggestionsClearRequested = () => {
      this.setState({ manufacturersSupplierList: [] });
    };

    const handleSuggestionSelected = (
      event,
      { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
    ) => {
      this.props.selectManuf({ ManufId: suggestion.valueKey, CustomValue: '' });
    };

    const { value, manufacturersSupplierList } = this.state;

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
          suggestions={this.state.manufacturersSupplierList}
          inputProps={{
            placeholder: self.props.resources.ContentManagement.SupplierDetailsName,
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
  };
};

export default AutocompleteManufacturer = connect(mapStateToProps)(AutocompleteManufacturer);