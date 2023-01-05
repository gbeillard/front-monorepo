import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import SearchIcon from '@material-ui/icons/Search';
import { Input } from '@material-ui/core';
import eyeOn from '../../../../Content/images/eye-on.svg';
import eyeOff from '../../../../Content/images/eye-off.svg';
import COLORS from '../../Styles/colors.js';

const PropertiesModalFilter = ({
  propertyMappingToConnect,
  filter,
  onFilterChanged,
  label = '',
  showAllProperties,
  onToggleShowAllProperties,
  resources,
  compatibleProperties = true,
}) => {
  const inputEl = useRef(null);
  useEffect(() => {
    // todo: virer le timeout, passer aux Modal
    setTimeout(() => {
      inputEl.current.focus();
    }, 700);
  }, [propertyMappingToConnect.Name]);

  const onChangeHandler = (event) => {
    const updatedFilter = event.target.value;
    onFilterChanged(updatedFilter);
  };

  const eyeIcon = showAllProperties ? eyeOn : eyeOff;
  const labelText = showAllProperties
    ? resources.UploadObject.PropertiesShow
    : resources.UploadObject.PropertiesHide;

  return (
    <div id="search-filter-properties">
      <div className="search-container">
        <Input
          inputRef={inputEl}
          label={label}
          id="add-property-input-search"
          value={filter}
          onChange={onChangeHandler}
          endAdornment={<SearchIcon />}
        />
      </div>
      {compatibleProperties && (
        <Container onClick={onToggleShowAllProperties}>
          <Text showAllProperties={showAllProperties}>{labelText}</Text>
          <img src={eyeIcon} />
        </Container>
      )}
    </div>
  );
};

const Container = styled.div({
  display: 'flex',
  flexFlow: 'row-reverse nowrap',
  width: 'initial !important',
  alignItems: 'center',
  cursor: 'pointer',
});
const Text = styled.span(({ showAllProperties }) => ({
  marginLeft: '5px',
  color: showAllProperties ? COLORS.SUCCESS : COLORS.LIGHT_GREY_3,
  fontSize: '12px',
  fontWeight: 500,
}));

const mapStateToProps = (store) => ({
  resources: store.appState.Resources[store.appState.Language],
});

export default connect(mapStateToProps)(PropertiesModalFilter);