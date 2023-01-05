/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import createReactClass from 'create-react-class';

// material ui calls
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Popper from '@material-ui/core/Popper';

const FilterSuggestionList = createReactClass({
  render() {
    const t = this;

    let suggestions = (
      <MenuItem>
        <span>{this.props.resources.MetaResource.NoResult}</span>
      </MenuItem>
    );

    if (this.props.values.length > 0) {
      const MAX_LENGTH_LABEL = 50;
      const isPins = this.props.property.toLowerCase() === 'pins';

      suggestions = this.props.values.map((item, i) => {
        let label = isPins ? `${item.Value}` : `${item.Value} (${item.Count})`;
        const labelValue = item.Value;
        const labelCount = ` (${item.Count})`;

        if (label != null && label.length > MAX_LENGTH_LABEL) {
          label = `${labelValue.substring(0, MAX_LENGTH_LABEL - labelCount.length - 3)}...`;
          label = isPins ? label : (label += labelCount);
        }

        return (
          <MenuItem
            key={`${t.props.property}-suggestion-${item.Name}-${i}`}
            data-value={item.Name}
            data-property={t.props.property}
            data-checked={!item.IsChecked}
          >
            <FormControlLabel
              id="listElement"
              className="control-label-element"
              data-value={item.Name}
              data-property={t.props.property}
              data-checked={!item.IsChecked}
              control={
                <Checkbox
                  checked={item.IsChecked}
                  className="filter-menu-item"
                  color="primary"
                  data-value={item.Name}
                  data-property={t.props.property}
                  data-checked={!item.IsChecked}
                />
              }
              label={label}
            />
          </MenuItem>
        );
      });
    }

    const anchor = document.getElementById(this.props.elementAnchorId);

    return (
      <Popper
        className="dropdown-menu dropdown-menu-material-ui"
        open
        anchorEl={anchor}
        transition
        placement="bottom-start"
      >
        <MenuList className="menu-list-suggest">{suggestions}</MenuList>
      </Popper>
    );
  },
});

export default FilterSuggestionList;