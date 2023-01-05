import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';

// material ui calls
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import ExpandMore from '@material-ui/icons/ExpandMore.js';
import FilterSuggestionList from './FilterSuggestionList.jsx';
import * as Utils from '../../Utils/utils.js';

const FilterSuggest = createReactClass({
  getInitialState() {
    return {
      suggestions: [],
      query: '',
      menuIsOpen: false,
      property: this.props.property == 'Pins.Name_raw' ? 'Pins' : this.props.property,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.reset) {
      this.setState({ query: '' });
    }
  },

  handleChange(e) {
    const newQuery = e.target.value;

    if (!this.state.menuIsOpen) {
      this.rotateArrow();
    }

    const suggestions = this.props.staticFilters.filter((item) => {
      if (item.Name !== '') {
        if (newQuery !== '') {
          if (
            Utils.removeDiacritics(item.Name)
              .toLowerCase()
              .search(Utils.removeDiacritics(newQuery).toLowerCase()) === 0
          ) {
            return item;
          }
        } else {
          return item;
        }
      }
    });

    this.setState({ suggestions, query: newQuery, menuIsOpen: true });
  },

  changeCheck(value, checked) {
    const suggestions = this.props.staticFilters.map((item) => {
      if (item.Name === value) {
        item.IsChecked = checked === 'true';
      }
      return item;
    });
    this.setState({ suggestions });
  },

  handleLostFocus(event) {
    const self = this;
    const { relatedTarget } = event;

    let targetDataSet;

    if (relatedTarget != null && relatedTarget.dataset.property == this.state.property) {
      targetDataSet = relatedTarget.dataset;
    } else if (
      relatedTarget != null &&
      relatedTarget.offsetParent != null &&
      relatedTarget.offsetParent.dataset.property == this.state.property
    ) {
      targetDataSet = relatedTarget.offsetParent.dataset;
    }

    if (targetDataSet != null) {
      setTimeout(() => {
        document.getElementById(`searchInput${self.state.property}`).focus();
      }, 0);
      const item = {
        currentTarget: {
          dataset: {
            property: this.state.property,
            value: targetDataSet.value,
            checked: targetDataSet.checked,
          },
        },
      };
      this.changeCheck(targetDataSet.value, targetDataSet.checked);
      this.props.handleRequest(item);
      return false;
    }

    if (
      relatedTarget != null &&
      relatedTarget.offsetParent != null &&
      $(relatedTarget.offsetParent).hasClass('menu-list-suggest')
    ) {
      setTimeout(() => {
        document.getElementById(`searchInput${self.state.property}`).focus();
      }, 0); // Pour Firefox
    } else if (
      relatedTarget != null &&
      relatedTarget.id == `button-arrow-expand-${this.state.property}`
    ) {
      event.preventDefault();
    } else {
      this.rotateArrow();
      this.setState({ menuIsOpen: false });
    }
  },

  handleRemoveFilter(event) {
    this.props.handleRequest(event, true, true);
  },

  handleClickArrow(event) {
    if (!this.state.menuIsOpen) {
      document.getElementById(event.currentTarget.name).focus();
    } else {
      this.rotateArrow();
      this.setState({ menuIsOpen: false });
    }
  },

  rotateArrow() {
    $(`#button-arrow-expand-${this.state.property}`).toggleClass('rotate');
  },

  render() {
    const { state } = this;
    const self = this;

    const SEARCH_INPUT_PROPS = {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            id={`button-arrow-expand-${self.state.property}`}
            className="arrow-button-search-input"
            name={`searchInput${self.state.property}`}
            onClick={this.handleClickArrow}
          >
            <ExpandMore />
          </IconButton>
        </InputAdornment>
      ),
    };

    if (self.props.property != 'Pins.Name_raw') {
      // Les inputs selectionnés (ou non) sont rendus à partir de la réponse de la requêtes
      // ce sont les static filters, indépendants de la selection des suggestions
      const checkedInputs = _.where(self.props.staticFilters, { IsChecked: true });

      var inputNodes = checkedInputs.map((input, i) => {
        const name = input.Name;
        const label = input.Name;

        return (
          <div key={i}>
            <Chip
              className="tag xs blue"
              data-checked={!input.IsChecked}
              data-value={name}
              data-kind-filter="ValueContainerFilter"
              data-property={self.props.property}
              onDelete={self.handleRemoveFilter}
              label={label}
            />
          </div>
        );
      });
    }

    let noResult = false;
    if (self.state.query !== '' && self.state.suggestions.length == 0) {
      noResult = true;
    }

    let classFilter = 'search-component full-width';
    if (this.state.menuIsOpen) {
      classFilter += ' open';
    }

    if (self.props.property == 'Pins.Name_raw') {
      const id = 'searchInputPins';

      return (
        <div>
          <div className="filter-item">
            <TextField
              type="text"
              id={id}
              className={classFilter}
              placeholder={this.props.title}
              value={this.state.query}
              onChange={this.handleChange}
              onFocus={this.handleChange}
              onBlur={this.handleLostFocus}
              InputProps={SEARCH_INPUT_PROPS}
            />

            {this.state.menuIsOpen ? (
              <FilterSuggestionList
                values={self.state.suggestions}
                property="Pins"
                noResult={noResult}
                resources={self.props.resources}
                elementAnchorId={id}
              />
            ) : null}
          </div>
        </div>
      );
    }

    const id = `searchInput${self.props.property}`;

    return (
      <div className="col-lg-2 col-md-3 col-xs-10 col-xs-offset-1">
        <div className="filter-item">
          <TextField
            type="text"
            id={id}
            className={classFilter}
            placeholder={this.props.title}
            value={this.state.query}
            onChange={this.handleChange}
            onFocus={this.handleChange}
            onBlur={this.handleLostFocus}
            InputProps={SEARCH_INPUT_PROPS}
          />

          {this.state.menuIsOpen ? (
            <FilterSuggestionList
              values={self.state.suggestions}
              property={self.props.property}
              noResult={noResult}
              resources={self.props.resources}
              elementAnchorId={id}
            />
          ) : null}

          <div className="filter-result">{inputNodes}</div>
        </div>
      </div>
    );
  },
});

export default FilterSuggest;