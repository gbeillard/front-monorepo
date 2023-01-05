import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { Nature } from '../../Reducers/properties/constants';
import { selectTranslatedResources } from '../../Reducers/app/selectors';

type Props = {
  value: Nature;
  onChange: (nature: Nature) => void;
  variant: 'standard' | 'outlined';
  margin: 'none' | 'dense' | 'normal';
  resources: any;
};

const SelectNature: React.FunctionComponent<Props> = ({
  value,
  onChange,
  variant = 'standard',
  margin = 'none',
  resources,
}) => {
  const ITEM_HEIGHT = 48;
  const MENU_PROPS = {
    disableEnforceFocus: true,
    disableAutoFocus: true,
    BackdropProps: {
      invisible: true,
    },
    style: {
      zIndex: 2100,
      maxHeight: ITEM_HEIGHT * 6.5 + 96,
    },
  };

  return (
    <FormControl fullWidth margin={margin}>
      <InputLabel id="property-nature-label">
        {variant !== 'outlined' ? resources.DownloadProperties.PropertyNatureLabel : ''}
      </InputLabel>
      <Select
        labelId="property-nature-label"
        value={value}
        onChange={(event) => onChange(event.target.value as Nature)}
        variant={variant}
        MenuProps={MENU_PROPS}
      >
        <MenuItem value={Nature.TYPE}>{resources.DownloadProperties.NatureTypeLabel}</MenuItem>
        <MenuItem value={Nature.INSTANCE}>
          {resources.DownloadProperties.NatureInstanceLabel}
        </MenuItem>
      </Select>
    </FormControl>
  );
};

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(SelectNature);