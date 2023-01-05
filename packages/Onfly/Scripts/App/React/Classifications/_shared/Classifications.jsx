import React from 'react';
import { connect } from 'react-redux';
import { Select, MenuItem } from '@material-ui/core';
import { selectClassifications } from '../../../Reducers/classifications/selectors';
import { selectTranslatedResources } from '../../../Reducers/app/selectors';

const PLACEHOLDER_VALUE = -1;
const Classifications = ({
  selectedClassificationId = PLACEHOLDER_VALUE,
  onChange,
  classifications = [],
  resources,
  className,
}) => {
  const onChangeHandler = (event) => {
    const id = event.target.value;
    onChange(id);
  };

  const optionList = classifications.map((classification) => (
    <MenuItem key={classification.Id} value={classification.Id}>
      {classification.Name}
    </MenuItem>
  ));

  return (
    <Select value={selectedClassificationId} onChange={onChangeHandler} className={className}>
      <MenuItem value={PLACEHOLDER_VALUE} disabled>
        {resources.ContentManagement.ClassificationsSelectPlaceholder}
      </MenuItem>
      {optionList}
    </Select>
  );
};

const mapStateToProps = (store) => ({
  classifications: selectClassifications(store),
  resources: selectTranslatedResources(store),
});

export default connect(mapStateToProps)(Classifications);