import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';

// Material UI
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

// Material UI Icon
import CheckIcon from '@material-ui/icons/Check.js';
import ClearIcon from '@material-ui/icons/Clear.js';
import CustomTooltip from '../CommonsElements/CustomTooltip.jsx';

let MappingPropertyConnectedLine = createReactClass({
  render() {
    const MAX_CHARACTERS = 24;

    const propertyMapping = this.props.PropertyMapping;
    const propertyConnected = this.props.PropertyConnected;

    const tooltipText = `${propertyMapping.Name} <-> ${propertyConnected.Name}`;
    return (
      <Tooltip enterDelay={500} title={tooltipText} placement="top">
        <div className="connected-property-line">
          <div className="property-cell">
            <Typography variant="subtitle1" className="property-text">
              <CustomTooltip Text={propertyMapping.Name} MaxCharacters={MAX_CHARACTERS} />
            </Typography>
          </div>
          <div className="property-cell">
            <Typography variant="subtitle1" className="property-text">
              <CustomTooltip
                Text={propertyMapping.DataTypeName}
                MaxCharacters={
                  propertyMapping.CAD_DisplayValue != null && propertyMapping.CAD_DisplayValue != ''
                    ? MAX_CHARACTERS - 14
                    : MAX_CHARACTERS
                }
              />
            </Typography>
            {propertyMapping.CAD_DisplayValue != null && propertyMapping.CAD_DisplayValue !== '' ? (
              <Typography variant="subtitle1" className="property-text cao-value">
                <CustomTooltip
                  Text={propertyMapping.CAD_DisplayValue}
                  MaxCharacters={MAX_CHARACTERS - 14}
                />
              </Typography>
            ) : null}
          </div>
          <div className="icon-container">
            <CheckIcon className="icon-check" />
            <IconButton
              className="icon-button-delete"
              onClick={() => this.props.DisconnectProperty(propertyMapping.Id, propertyMapping)}
            >
              <Tooltip
                title={this.props.Resources.ContentManagementDictionary.Disconnect}
                placement="top"
              >
                <ClearIcon className="icon-delete" />
              </Tooltip>
            </IconButton>
          </div>
          <div className="property-cell text-right">
            <Typography variant="subtitle1" className="property-text">
              {this.props.Resources.ContentManagementDictionary.ConvertsTo}
            </Typography>
          </div>
          <div className="property-cell text-right">
            <Typography variant="subtitle1" className="property-text">
              {propertyConnected.UnitName != null ? propertyConnected.UnitName : ''}
            </Typography>
          </div>
          <div className="property-cell text-right">
            <Typography variant="subtitle1" className="property-text">
              <CustomTooltip
                Text={propertyConnected.Name}
                MaxCharacters={MAX_CHARACTERS}
                placement="left"
              />
            </Typography>
          </div>
        </div>
      </Tooltip>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    Language: appState.Language,
    Resources: appState.Resources[appState.Language],
  };
};

export default MappingPropertyConnectedLine = connect(mapStateToProps)(
  MappingPropertyConnectedLine
);