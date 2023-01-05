import React from 'react';
import createReactClass from 'create-react-class';
import ReactDOM from 'react-dom';
import _ from 'underscore';

import SuggestionList from './Suggestion/SuggestionList.jsx';
import SuggestionItem from './Suggestion/SuggestionItem.jsx';

const ElementSearchKeys = {
  ENTER: 13,
  TAB: 9,
  BACKSPACE: 8,
  UP_ARROW: 38,
  DOWN_ARROW: 40,
  ESCAPE: 27,
};

const ElementSearch = createReactClass({
  getInitialState() {
    return {
      suggestions: [],
      query: '',
      selectionMode: false,
      selectedIndex: -1,
      isOpen: false,
    };
  },

  clickDocument(e) {
    const component = ReactDOM.findDOMNode(this.refs.component);
    if (e.target == component || $(component).has(e.target).length) {
      this.setState({
        isOpen: true,
      });
    } else {
      this.setState({
        isOpen: false,
      });
    }
  },
  componentDidMount() {
    $(document).bind('click', this.clickDocument);
  },
  componentWillUnmount() {
    $(document).unbind('click', this.clickDocument);
  },

  handleChange(event) {
    const self = this;
    const query = event.target.value;

    // Réinitialisation de la liste de suggestions
    self.setState({ suggestions: [], query });

    if (query != '') {
      if (this.props.itemType == 'bimobject') {
        const request = {
          Query: query,
          LanguageCode: this.props.languageCode,
        };

        $.ajax({
          type: 'POST',
          url: self.props.queryUrl,
          dataType: 'json',
          data: JSON.stringify(request),
          contentType: 'application/json; charset=utf-8',
          async: true,
          success(data) {
            if (self.props.itemType == 'tag') {
              let elementNames = _.pluck(data, 'Name');
              elementNames = elementNames.map((n) => n.toLowerCase().sansAccent());
              if (!_.contains(elementNames, query.toLowerCase().sansAccent())) {
                data.push({ Name: query, Type: 'newtag' });
              }
            }
            self.setState({ suggestions: data.Documents, selectedIndex: 0, selectionMode: true });
          },
        });
      } else {
        $.ajax({
          type: 'POST',
          url: self.props.queryUrl,
          data: JSON.stringify({
            Query: query,
          }),
          dataType: 'json',
          contentType: 'application/json; charset=utf-8',
          async: true,
          success(data) {
            if (self.props.itemType == 'manufacturerTag') {
              var elementNames = _.pluck(data, 'Name_CI_AI');
              elementNames = elementNames.map((n) => n.toLowerCase().sansAccent());
              if (!_.contains(elementNames, query.toLowerCase().sansAccent())) {
                data.push({ Name: query, Type: 'newManufacturerTag', Id: -1 });
              }
            } else if (self.props.itemType == 'tag') {
              var elementNames = _.pluck(data, 'Name_CI_AI');
              elementNames = elementNames.map((n) => n.toLowerCase().sansAccent());
              if (!_.contains(elementNames, query.toLowerCase().sansAccent())) {
                data.push({ Name: query, Type: 'newtag' });
              }
            }

            self.setState({ suggestions: data, selectedIndex: 0, selectionMode: true });
          },
        });
      }
    }
  },

  handleKeyDown(e) {
    var { query, selectedIndex, suggestions } = this.state;

    // hide suggestions on ESC
    if (e.keyCode === ElementSearchKeys.ESCAPE) {
      e.preventDefault();
      this.setState({
        selectedIndex: -1,
        selectionMode: false,
        suggestions: [],
        query: '',
      });
    }

    // when ENTER or TAB, add suggestion to inputs
    if (
      (e.keyCode === ElementSearchKeys.ENTER || e.keyCode === ElementSearchKeys.TAB) &&
      query != ''
    ) {
      e.preventDefault();
      const self = this;
      if (self.state.selectionMode) {
        const element = this.state.suggestions[this.state.selectedIndex];
        self.props.addElement(element);
        self.setState({ suggestions: [], query: '' });
      }
    }

    // // UP ARROW
    if (e.keyCode === ElementSearchKeys.UP_ARROW) {
      e.preventDefault();
      var { selectedIndex } = this.state;

      // Last item, cycle to the top
      if (selectedIndex <= 0) {
        this.setState({
          selectedIndex: this.state.suggestions.length - 1,
          selectionMode: true,
        });
      } else {
        this.setState({
          selectedIndex: selectedIndex - 1,
          selectionMode: true,
        });
      }
    }

    // DOWN ARROW
    if (e.keyCode === ElementSearchKeys.DOWN_ARROW) {
      e.preventDefault();
      this.setState({
        selectedIndex: (this.state.selectedIndex + 1) % this.state.suggestions.length,
        selectionMode: true,
      });
    }
  },

  handleSuggestHover(i, e) {
    this.setState({
      selectedIndex: i,
      selectionMode: true,
    });
  },

  handleSuggestClick(e) {
    const self = this;
    if (this.state.selectionMode) {
      const element = self.state.suggestions[self.state.selectedIndex];
      self.props.addElement(element);
      self.setState({ suggestions: [], query: '' });
    }
  },

  handleMouseDown(e) {
    this.setState({
      isOpen: true,
    });
  },

  render() {
    const self = this;
    let suggestions = [];
    if (self.state.isOpen) {
      suggestions = self.state.suggestions
        .slice(0, 20)
        .map((item, i) => (
          <SuggestionItem
            key={i}
            index={i}
            item={item}
            itemType={self.props.itemType}
            selectedIndex={self.state.selectedIndex}
            resources={self.props.resources}
            handleSuggestHover={self.handleSuggestHover}
            handleSuggestClick={self.handleSuggestClick}
          />
        ));
    }

    return (
      <div ref="component">
        <input
          value={self.state.query}
          type="text"
          onKeyDown={self.handleKeyDown}
          onChange={self.handleChange}
          onMouseDown={self.handleMouseDown}
          placeholder={this.props.searchPlaceholder}
        />

        <SuggestionList
          itemsList={suggestions}
          resources={self.props.resources}
          selectedIndex={self.state.selectedIndex}
        />
      </div>
    );
  },
});

// ====
// Helper Method pour suprimer les accents d'une chaine de charactères
// ====

String.prototype.sansAccent = function () {
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

export default ElementSearch;