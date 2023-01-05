import React from 'react';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import SelectNature from '../../Properties/SelectNature';

const Property = ({ value, handleSelectProperty, changePropertyNature, isSelected }) => {
  const onchangePropertyNatureHandler = (nature) => {
    changePropertyNature(value, nature);
  };

  return (
    <ExpansionPanelDetails key={`domaindetail${value.Id}`} className="expansion-panel-detail">
      <div style={{ flexBasis: '10%' }}>
        <FormControlLabel
          className="domain-list-checkbox"
          control={
            <Checkbox
              disabled={false}
              color="primary"
              value={value.Id.toString()}
              checked={isSelected}
              onChange={(event) => handleSelectProperty(event, value)}
            />
          }
        />
      </div>

      <div style={{ flexBasis: '30%' }}>{value.Name}</div>
      <div style={{ flexBasis: '50%' }}>{value.Description}</div>
      <div style={{ flexBasis: '20%' }}>
        <SelectNature
          value={value.Nature}
          onChange={onchangePropertyNatureHandler}
          variant="outlined"
        />
      </div>
    </ExpansionPanelDetails>
  );
};

export default Property;