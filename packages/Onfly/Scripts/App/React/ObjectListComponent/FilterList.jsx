import React from 'react';
import createReactClass from 'create-react-class';

// material ui calls
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const FilterList = createReactClass({
  getInitialState() {
    return {
      valuesObjectType: [
        this.props.resources.SearchResults.ObjectTypeFilterUserContent,
        this.props.resources.SearchResults.ObjectTypeFilterGenericOfficial,
        this.props.resources.SearchResults.ObjectTypeFilterOfficial,
      ],
      menuAnchor: null,
    };
  },

  handleRemoveFilter(event) {
    this.props.handleRequest(event, true, true);
  },

  handleOpenMenu(event) {
    this.setState({ menuAnchor: event.currentTarget });
  },

  handleCloseMenu() {
    this.setState({ menuAnchor: null });
  },

  render() {
    const self = this;

    let pid = '';
    let ptype = '';

    const valuesSelected = [];

    const inputNodes = this.props.values.map((value, i) => {
      let valueProperty = value.Value;
      if (valueProperty == '' || valueProperty == undefined) {
        valueProperty = value.Name;
      }

      let valueDisplay = value.Name;
      if (self.props.listType == 'ObjectTypeManagementCloud') {
        valueDisplay = self.state.valuesObjectType[value.Name];
      }

      if (value.IsChecked) {
        valuesSelected.push(
          <div>
            <Chip
              className="tag xs blue"
              key={i}
              data-checked={!value.IsChecked}
              data-value={valueProperty}
              data-kind-filter="ValueContainerFilter"
              data-property={self.props.property}
              onDelete={self.handleRemoveFilter}
              label={valueDisplay}
            />
          </div>
        );
      }

      pid = value.PropertyId;
      ptype = value.Type;

      const localInputId = `inputchk-${self.props.property.toUpperCase()}-${valueProperty}`;

      return (
        <MenuItem
          key={localInputId}
          data-kind-filter="ValueContainerFilter"
          data-value={valueProperty}
          data-property={self.props.property}
          data-propertyid={value.PropertyId}
          data-checked={!value.IsChecked}
          data-dynamic={false}
          onClick={self.props.handleRequest}
        >
          <FormControlLabel
            control={<Checkbox checked={value.IsChecked} color="primary" />}
            label={`${valueDisplay} (${value.Count})`}
          />
        </MenuItem>
      );
    });

    return (
      <div className="col-md-3 col-xs-10 col-xs-offset-1 material-v1-element">
        <div className="filter-item">
          <button className="dropdown-toggle" data-toggle="dropdown" onClick={this.handleOpenMenu}>
            {this.props.title}
            <hr aria-hidden="true" />
          </button>
          <Menu
            id="materialv1menu"
            open={Boolean(this.state.menuAnchor)}
            anchorEl={this.state.menuAnchor}
            onClose={this.handleCloseMenu}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            {inputNodes}
          </Menu>

          <div className="filter-result">{valuesSelected}</div>
        </div>
      </div>
    );
  },
});

export default FilterList;