import React from 'react';
import createReactClass from 'create-react-class';

const SuggestionList = createReactClass({
  render() {
    const self = this;

    if (self.props.itemsList.length > 0) {
      return (
        <div className="suggestion-container">
          <ul className="suggestion-list">{self.props.itemsList}</ul>
        </div>
      );
    }
    return false;
  },
});

export default SuggestionList;