import React from 'react';
import { connect } from 'react-redux';
import createReactClass from 'create-react-class';
import toastr from 'toastr';
import _ from 'underscore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore.js';

import FlexSearch from 'flexsearch';
import * as UtilsFilter from '../../Utils/utilsFilter.js';

const shouldDisplayProperty = (showAllProperties, property, compatibleProperties) =>
  showAllProperties || property.IsSelectable || !compatibleProperties;

const Domain = createReactClass({
  getInitialState() {
    return {
      expand: this.props.defaultExpand,
    };
  },

  onChange() {
    this.setState({ expand: !this.state.expand });
  },

  selectProperty(event, property, compatibleProperties) {
    if (!property.IsSelectable && compatibleProperties) {
      toastr.error(this.props.resources.UploadObject.PropertyNotCompatible);
      return;
    }

    if (!this.props.MultiSelection) {
      if (
        this.props.propertyMappingIdToConnect != null &&
        this.props.propertyMappingIdToConnect > 0
      ) {
        if (property.Id !== this.props.propertyIdConnected) {
          this.props.connectProperty(
            this.props.propertyMappingIdToConnect,
            property,
            this.props.setPropertyIdConnected(property.Id)
          );
        } else {
          this.props.disconnectProperty(
            this.props.propertyMappingIdToConnect,
            this.props.propertyMappingIsToConnectLater,
            this.props.setPropertyIdConnected(0)
          );
        }
      } else {
        this.props.selectProperty(property.Id, true, property);
      }
      $('#AddPropertyScreen').modal('hide');
    } else {
      const { checked } = event.target;
      this.props.selectProperty(property.Id, checked, property);
    }
  },

  render() {
    const properties_domain = [];
    const { value } = this.props;
    const self = this;

    let nbPropertiesRendered = 0;

    const filterPropertiesValues = this.props.getFilterValues(UtilsFilter.type.PROPERTIES);
    const filterDictionaryValues = this.props.getFilterValues(UtilsFilter.type.DICTIONARY);
    const filterPropertiesGroupValues = this.props.getFilterValues(
      UtilsFilter.type.PROPERTIES_GROUP
    );
    const filterIFCProperty = this.props.getFilterValues(UtilsFilter.type.IFC_PROPERTY);

    let properties = value.Properties;

    const compatibleProperties =
      this.props.CompatibleProperties != null ? this.props.CompatibleProperties : true;

    if (self.props.propKeyWord != null && self.props.propKeyWord !== '') {
      const index = new FlexSearch({
        encode: 'advanced',
        tokenize: 'reverse',
        doc: {
          id: 'Id',
          field: 'Name',
        },
      });

      index.add(value.Properties);
      const searchItems = self.props.propKeyWord.split(/\s/).map((keyword) => ({
        bool: 'or',
        query: keyword,
        field: 'Name',
      }));

      properties = index.search(searchItems);
    }

    _.each(properties, (prop) => {
      if (
        shouldDisplayProperty(this.props.showAllProperties, prop, compatibleProperties) &&
        UtilsFilter.checkFilter(filterPropertiesValues, prop.Id) &&
        UtilsFilter.checkFilter(filterDictionaryValues, prop.PropertiesGroupIdList) &&
        UtilsFilter.checkFilter(filterPropertiesGroupValues, prop.PropertiesGroupFilterList) &&
        UtilsFilter.checkFilter(
          filterIFCProperty,
          prop.IFCPropertyName,
          UtilsFilter.type.IFC_PROPERTY
        )
      ) {
        nbPropertiesRendered++;

        if (self.state.expand) {
          let isSelectedProp = false;

          if (self.props.currentSelectedProperties != null) {
            isSelectedProp =
              self.props.currentSelectedProperties.findIndex(
                (l) => l.Id === prop.Id || l.PropertyId === prop.Id
              ) > -1;
          } else if (
            self.props.propertyMappingIdToConnect != null &&
            self.props.propertyMappingIdToConnect > 0
          ) {
            isSelectedProp = self.props.propertyIdConnected === prop.Id;
          }

          let expansionPanelDetails;

          if (self.props.MultiSelection) {
            expansionPanelDetails = (
              <ExpansionPanelDetails
                key={`domaindetail${prop.Id}`}
                className="expansion-panel-detail"
              >
                <div style={{ flexBasis: '10%' }}>
                  {!prop.IsAdded ? (
                    <FormControlLabel
                      className="domain-list-checkbox"
                      control={
                        <Checkbox
                          disabled={
                            (self.props.disableCheckBoxSelected && isSelectedProp) ||
                            !prop.CanBeAddedToObject
                          }
                          color="primary"
                          value={prop.Id.toString()}
                          checked={isSelectedProp}
                          onChange={(event) =>
                            self.selectProperty(event, prop, compatibleProperties)
                          }
                        />
                      }
                    />
                  ) : null}
                </div>
                <div style={{ flexBasis: '30%' }} data-cy="property-name">
                  {prop.Name}
                </div>
                <div style={{ flexBasis: '10%' }}>{prop.UnitName}</div>
                <div style={{ flexBasis: '50%' }}>{prop.Description}</div>
              </ExpansionPanelDetails>
            );
          } else {
            expansionPanelDetails = (
              <ExpansionPanelDetails
                key={`domaindetail${prop.Id}`}
                className="expansion-panel-detail single-selection"
                onClick={(event) => self.selectProperty(event, prop, compatibleProperties)}
              >
                <div style={{ flexBasis: '40%' }} data-cy="property-name">
                  {prop.Name}
                </div>
                <div style={{ flexBasis: '10%' }}>{prop.UnitName}</div>
                <div style={{ flexBasis: '50%' }}>{prop.Description}</div>
              </ExpansionPanelDetails>
            );
          }

          properties_domain.push(expansionPanelDetails);
        }
      }
    });

    if (nbPropertiesRendered === 0) {
      return null;
    }

    return (
      <ExpansionPanel
        key={`domain${value.Id}`}
        onChange={self.onChange}
        defaultExpanded={this.state.expand}
        data-cy="panneau"
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div className="domain-name">{value.Domain}</div>
        </ExpansionPanelSummary>
        {properties_domain}
      </ExpansionPanel>
    );
  },
});

const mapStateToProps = (store) => ({
  resources: store.appState.Resources[store.appState.Language],
});

export default connect(mapStateToProps)(Domain);