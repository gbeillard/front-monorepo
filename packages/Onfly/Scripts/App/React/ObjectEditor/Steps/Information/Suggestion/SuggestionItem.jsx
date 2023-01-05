import React from 'react';
import createReactClass from 'create-react-class';

const SuggestionItem = createReactClass({
  render() {
    const self = this;
    let classString = 'suggestion-item';
    if (this.props.index === this.props.selectedIndex) {
      classString += ' active';
    }

    if (self.props.itemType == 'tag') {
      classString += ' itemTag';
      if (this.props.item.Type == 'newtag') {
        classString += ' newtag';
        return (
          <li
            key={self.props.index}
            className={classString}
            onMouseOver={self.props.handleSuggestHover.bind(null, self.props.index)}
            onClick={self.props.handleSuggestClick}
          >
            <span className="new-tag-label">{self.props.resources.NewTag} : </span>
            {self.props.item.Name}
          </li>
        );
      }
      return (
        <li
          key={self.props.index}
          className={classString}
          onMouseOver={self.props.handleSuggestHover.bind(null, self.props.index)}
          onClick={self.props.handleSuggestClick}
        >
          {self.props.item.Name}
        </li>
      );
    }
    if (self.props.itemType == 'user') {
      classString += ' member';
      return (
        <li
          key={self.props.index}
          className={classString}
          onMouseOver={self.props.handleSuggestHover.bind(null, self.props.index)}
          onClick={self.props.handleSuggestClick}
        >
          <img
            src={
              self.props.item.Avatar != null
                ? self.props.item.Avatar
                : '/Content/images/default-avatar.png'
            }
            className="avatar"
          />
          <span className="name">
            {`${self.props.item.FirstName} ${self.props.item.LastName}`}
            <br />
            <span className="jobtitle">
              {self.props.item.JobTitle != '' ? self.props.item.JobTitle : '-'}
            </span>
          </span>
        </li>
      );
    }
    if (self.props.itemType == 'bimobject') {
      classString += ' bimobject';

      return (
        <li
          key={self.props.index}
          className={classString}
          onMouseOver={self.props.handleSuggestHover.bind(null, self.props.index)}
          onClick={self.props.handleSuggestClick}
        >
          <img src={`${self.props.item.Photo}?width=30&height=30`} className="suggestion-photo" />
          <span className="name">{self.props.item.Name}</span>
          <br />
        </li>
      );
    }
    if (self.props.itemType == 'user-bimobject') {
      classString += ' user-bimobject';

      return (
        <li
          key={self.props.index}
          className={classString}
          onMouseOver={self.props.handleSuggestHover.bind(null, self.props.index)}
          onClick={self.props.handleSuggestClick}
        >
          <img src={`${self.props.item.Photo}?width=30&height=30`} className="suggestion-photo" />
          <span className="name">{self.props.item.Name}</span>
          <br />
        </li>
      );
    }
    if (self.props.itemType == 'manufacturerTag') {
      classString += ' bimobject-manufacturer';
      if (this.props.item.Type == 'newManufacturerTag') {
        classString += ' newtag';
        return (
          <li
            key={self.props.index}
            className={classString}
            onMouseOver={self.props.handleSuggestHover.bind(null, self.props.index)}
            onClick={self.props.handleSuggestClick}
          >
            <span className="new-tag-label">
              {self.props.resources.TagSearch.NewManufacturerLabel} :{' '}
            </span>
            {self.props.item.Name}
          </li>
        );
      }
      return (
        <li
          key={self.props.index}
          className={classString}
          onMouseOver={self.props.handleSuggestHover.bind(null, self.props.index)}
          onClick={self.props.handleSuggestClick}
        >
          <span className="name">{self.props.item.Name}</span>
          <br />
        </li>
      );
    }
    if (self.props.itemType == 'bimobject-company') {
      classString += ' bimobject-company';

      return (
        <li
          key={self.props.index}
          className={classString}
          onMouseOver={self.props.handleSuggestHover.bind(null, self.props.index)}
          onClick={self.props.handleSuggestClick}
        >
          <span className="name">{self.props.item.Name}</span>
          <br />
        </li>
      );
    }
  },
});

export default SuggestionItem;