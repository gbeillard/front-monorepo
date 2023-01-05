import React from 'react';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore.js';
import PropertyList from './PropertyList.jsx';

const Domain = ({ domain, onPropertyClicked }) => (
  <ExpansionPanel TransitionProps={{ unmountOnExit: true }}>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>{domain.Domain}</ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <PropertyList propertyList={domain.Properties} onPropertyClicked={onPropertyClicked} />
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

export default Domain;