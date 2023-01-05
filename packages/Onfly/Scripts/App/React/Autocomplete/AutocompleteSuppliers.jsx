import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';
import Autosuggest from 'react-autosuggest';

// material ui imports
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { API_URL } from '../../Api/constants';

const AutocompleteSuppliers = createReactClass({
  getInitialState() {
    return {
      suggestions: [],
      newQuery: '',
      selectedSupplierId: 0,
      value: '',
    };
  },

  componentDidMount() {
    const alreadySettedSupplier = this.props.SettedSupplierId;
    if (
      alreadySettedSupplier != null &&
      alreadySettedSupplier != undefined &&
      alreadySettedSupplier != 0
    ) {
      this.setDefaultSupplier(alreadySettedSupplier);
    } else if (this.props.SettedSupplierName != null && this.props.SettedSupplierName != '') {
      this.setState({ value: this.props.SettedSupplierName });
    }
  },

  setDefaultSupplier(supplierId) {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${self.props.ManagementCloudId}/supplier/search?token=${self.props.TemporaryToken}&supplierId=${supplierId}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ SupplierSearchContent: '' }),
      }
    )
      .then((response) => response.json())
      .then((json) => {
        if (json != null && json.length > 0) {
          self.setState({
            suggestions: json,
            value: json[0].SupplierName,
            selectedSupplierId: json[0].SupplierId,
          });
        }
      });
  },

  handleChange(event, { method, newValue }) {
    event.preventDefault();
    event.stopPropagation();

    if (method === 'click') {
      this.setState({ value: '' });
      if (this.props.OnChangeAutoCompleteSupplier != null) {
        this.props.OnChangeAutoCompleteSupplier('');
      }
    } else {
      this.props.SelectSupplier(0);
      this.setState({ value: newValue, selectedSupplierId: 0 });

      if (this.props.OnChangeAutoCompleteSupplier != null) {
        this.props.OnChangeAutoCompleteSupplier(newValue);
      }
    }
  },

  handleSuggestionSelected(
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) {
    this.props.SelectSupplier(suggestion);
    this.setState({
      suggestions: [],
      newQuery: '',
      value: this.getSuggestionValue(suggestion),
      selectedSupplierId: suggestion.SupplierId,
    });
  },

  renderInput(inputProps) {
    const self = this;
    const IsSelectedSupplier = self.state.selectedSupplierId != 0;

    return (
      <TextField
        className="inputAutocompleteSuppliers inputautocomplete"
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        label={self.props.Resources.ContentManagement.CreateContentRequestSupplier}
        margin="none"
        inputRef={(input) => (self.searchSupplier = input)}
        {...inputProps}
        disabled={this.props.Disabled != null ? this.props.Disabled : false}
      />
    );
  },

  handleSuggestionsFetchRequested({ value }) {
    const self = this;
    const query = value;

    this.state.newQuery = query;

    setTimeout(
      () => {
        if (self.state.newQuery === query) {
          fetch(
            `${API_URL}/api/ws/v1/contentmanagement/${self.props.ManagementCloudId}/supplier/search?token=${self.props.TemporaryToken}&size=200`,
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ SupplierSearchContent: query }),
            }
          )
            .then((response) => response.json())
            .then((json) => {
              self.setState({
                suggestions: json,
                value: query,
                selectedSupplierId: 0,
              });
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
        style={{ position: 'absolute', zIndex: 20, width: '100%' }}
      >
        {children}
      </Paper>
    );
  },

  getSuggestionValue(suggestion) {
    return suggestion.SupplierName;
  },

  renderSuggestion(suggestion, { query, isHighlighted }) {
    const value = this.getSuggestionValue(suggestion);

    return (
      <MenuItem selected={isHighlighted} component="div">
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
          id="autocompleteSuppliers"
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

export default AutocompleteSuppliers;