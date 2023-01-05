import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';
import { removeDiacritics, replaceSymbolsWithSpaces } from '../../Utils/utils.js';
import PropertiesDomains from './PropertiesDomains.jsx';
import PropertiesModalSuggestions from './PropertiesModalSuggestions.jsx';
import PropertiesModalFilter from './PropertiesModalFilter.jsx';
import Modal from './Modal.jsx';
import COLORS from '../../Styles/colors.js';

const PropertyName = styled.h3({
  fontSize: '14px',
  color: COLORS.BLACK,
});
const ParameterName = styled.p({
  fontSize: '12px',
  color: COLORS.DARK_GREY_2,
  marginBottom: '-10px',
});

let timeoutID = null;
const DIACRITICS_DEBOUNCE_TIMER = 500;

const getKeyword = (str = '') => replaceSymbolsWithSpaces(removeDiacritics(str)).toLowerCase();

const PropertiesModal = ({
  resources,
  properties,
  currentSelectedProperties,
  selectProperty,
  propertyMappingIdToConnect,
  propertyMappingIsToConnectLater,
  connectProperty,
  disconnectProperty,
  multiSelection,
  handleClickBtnAdd,
  disableCheckBoxSelected,
  propertyMappingToConnect = {},
  compatibleProperties = true,
}) => {
  if (propertyMappingToConnect === null) {
    return null;
  }

  const [filter, setFilter] = useState(propertyMappingToConnect.Name);
  const initialKeyword = getKeyword(filter);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [showAllProperties, setShowAllProperties] = useState(false);
  const [propertyIdConnected, setPropertyIdConnected] = useState(0);

  useEffect(() => {
    setFilter('');
    setKeyword('');
    setShowAllProperties(false);
  }, [propertyMappingToConnect.Name]);

  const updateFilterAndRemoveDiacritics = (updatedFilter) => {
    setFilter(updatedFilter);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    timeoutID && clearTimeout(timeoutID);

    // debounce permettant de delayer la fonction remove diacritics
    // intervient au bout de 500 millisecondes d'inactivité
    timeoutID = setTimeout(() => {
      const updatedKeyword = getKeyword(updatedFilter);
      setKeyword(updatedKeyword);
    }, DIACRITICS_DEBOUNCE_TIMER);
  };

  const onSuggestionPickedHandler = (suggestion) => {
    connectProperty(null, suggestion);
  };

  const onToggleShowAllPropertiesHandler = () => {
    setShowAllProperties(!showAllProperties);
  };

  const handleClickBtnAddClean = () => {
    setFilter('');
    setKeyword('');
    handleClickBtnAdd();
  };

  const handleClickBtnClose = () => {
    setFilter('');
    setKeyword('');
  };

  const suggestions = propertyMappingToConnect.Suggestions;
  const hasSuggestions = Boolean(suggestions && suggestions.length);

  return (
    <Modal
      header={
        <>
          <h2 className="modal-title" id="myModalLabel">
            {resources.ContentManagementClassif.OnFlyPropertiesTitle}
          </h2>
          {propertyMappingToConnect.Name && (
            <PropertyName>{propertyMappingToConnect.Name}</PropertyName>
          )}
          {propertyMappingToConnect.CAD_ParameterTypeName && (
            <ParameterName>{propertyMappingToConnect.CAD_ParameterTypeName}</ParameterName>
          )}
        </>
      }
      body={
        <>
          {hasSuggestions && (
            <PropertiesModalSuggestions
              suggestions={suggestions}
              onSuggestionPicked={onSuggestionPickedHandler}
            />
          )}
          <PropertiesModalFilter
            propertyMappingToConnect={propertyMappingToConnect}
            label={resources.ContentManagementClassif.OnFlyPropertiesSearchInput}
            filter={filter}
            onFilterChanged={updateFilterAndRemoveDiacritics}
            showAllProperties={showAllProperties}
            onToggleShowAllProperties={onToggleShowAllPropertiesHandler}
            compatibleProperties={compatibleProperties}
          />
          <PropertiesDomains
            showAllProperties={showAllProperties}
            resources={resources}
            domains={properties}
            currentSelectedProperties={currentSelectedProperties}
            searchText={keyword}
            filterList={[]}
            selectProperty={selectProperty}
            propertyIdConnected={propertyIdConnected}
            setPropertyIdConnected={setPropertyIdConnected}
            propertyMappingIdToConnect={propertyMappingIdToConnect}
            propertyMappingIsToConnectLater={propertyMappingIsToConnectLater}
            connectProperty={connectProperty}
            disconnectProperty={disconnectProperty}
            disableCheckBoxSelected={disableCheckBoxSelected}
            multiSelection={multiSelection}
            compatibleProperties={compatibleProperties}
          />
        </>
      }
      footer={
        <>
          <Button
            data-toggle="modal"
            data-dismiss="modal"
            variant="text"
            onClick={handleClickBtnClose}
          >
            {resources.MetaResource.Cancel}
          </Button>
          {multiSelection && (
            <Button
              data-toggle="modal"
              data-dismiss="modal"
              variant="contained"
              className="btn-raised"
              onClick={handleClickBtnAddClean}
            >
              {resources.MetaResource.Add}
            </Button>
          )}
        </>
      }
    />
  );
};

const mapStateToProps = (store) => ({
  resources: store.appState.Resources[store.appState.Language],
});

const mapDispatchToProps = (dispatch) => ({
  openModalCreateProperty: () => dispatch({ type: 'OPEN_MODAL_CREATE_PROPERTY' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PropertiesModal);