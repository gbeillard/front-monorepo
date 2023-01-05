import React, { useState } from 'react';
import { connect } from 'react-redux';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore.js';

import FlexSearch from 'flexsearch';
import Property from './Property.jsx';
import mapSelectToTranslatedResources from '../../../Reducers/utils/mapSelectToTranslatedResources';

const Domain = ({
  propKeyWord,
  expand,
  value,
  selectProperty,
  changePropertyNature,
  currentSelectedProperties,
  resources,
}) => {
  const [expanded, setExpanded] = useState(expand);

  const onChange = () => {
    setExpanded(!expanded);
  };

  const handleSelectProperty = (event, property) => {
    const { checked } = event.target;
    selectProperty(property.Id, checked, property);
  };

  const isSelectedProps = (prop) => {
    if (currentSelectedProperties != null) {
      return currentSelectedProperties.findIndex((l) => l.Id === prop.Id) > -1;
    }
  };

  let properties = value.Properties;

  if (propKeyWord != null && propKeyWord !== '') {
    const index = new FlexSearch({
      encode: 'advanced',
      tokenize: 'reverse',
      doc: {
        id: 'Id',
        field: 'Name',
      },
    });

    index.add(properties);
    const searchItems = propKeyWord.split(/\s/).map((keyword) => ({
      bool: 'or',
      query: keyword,
      field: 'Name',
    }));

    properties = index.search(searchItems);
  }

  let propertiesDomain = [];
  if (expanded) {
    propertiesDomain = properties.map((prop) => {
      const isSelected = isSelectedProps(prop);
      return (
        <Property
          key={prop.Id}
          value={prop}
          isSelected={isSelected}
          handleSelectProperty={handleSelectProperty}
          changePropertyNature={changePropertyNature}
        />
      );
    });
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <ExpansionPanel key={`domain${value.Id}`} onChange={onChange} defaultExpanded={expand}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <div className="domain-name">{value.Domain}</div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <div style={{ flexBasis: '10%' }} />
        <div style={{ flexBasis: '30%' }}>
          <Typography variant="caption" display="block">
            {resources.DownloadProperties.PropertyNameLabel}
          </Typography>
        </div>
        <div style={{ flexBasis: '50%' }}>
          <Typography variant="caption" display="block">
            {resources.DownloadProperties.PropertyDescriptionLabel}
          </Typography>
        </div>
        <div style={{ flexBasis: '20%' }}>
          <Typography variant="caption" display="block">
            {resources.DownloadProperties.PropertyNatureLabel}
          </Typography>
        </div>
      </ExpansionPanelDetails>
      {propertiesDomain}
    </ExpansionPanel>
  );
};

export default connect(mapSelectToTranslatedResources)(Domain);