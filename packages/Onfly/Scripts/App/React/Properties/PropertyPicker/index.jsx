import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';
import CircularProgress from '@material-ui/core/CircularProgress';
import { setDomains, setFilter, setApiState } from '../../../Reducers/properties/actions';
import {
  selectFilteredDomains,
  selectFilter,
  selectApiState,
} from '../../../Reducers/properties/selectors';
import {
  selectToken,
  selectManagementCloudId,
  selectLanguageCode,
  selectTranslatedResources,
} from '../../../Reducers/app/selectors';
import API from '../../../Api/PropertyApi';
import DomainList from './DomainList.jsx';
import Filter from './Filter';
import { DATA_TYPES } from './constants';

const DomainListWrapper = styled.div({
  maxHeight: '600px',
  overflowY: 'auto',
});
const CenterDiv = styled.div({
  width: '100%',
  display: 'flex',
  flexFlow: 'column nowrap',
  justifyContent: 'center',
  alignItems: 'center',
});

let timeoutID = null;

const PropertyPicker = ({
  onPropertyClicked, // parent
  domains,
  filter,
  apiState,
  token,
  managementCloudId,
  languageCode,
  resources, // mapStateToProps
  setDomains,
  setFilter,
  setApiState, // mapDispatchToProps
}) => {
  const [localFilter, setLocalFilter] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      const fetchedDomains = await API.fetchDomains(token, managementCloudId, languageCode);
      setDomains(fetchedDomains);
      const updatedApiState = apiState.setIn(['fetch', 'completed'], true);
      setApiState(updatedApiState);
    };
    setFilter({ text: '', dataTypes: [DATA_TYPES.TEXT, DATA_TYPES.STRING] });
    fetchData();
  }, []);

  const onChangeHandler = (text) => {
    setLocalFilter(text);
    if (timeoutID !== null) {
      clearTimeout(timeoutID);
    }
    timeoutID = setTimeout(() => setFilter({ ...filter, text }), 500);
  };

  const hasFetched = apiState.getIn(['fetch', 'completed']);
  if (!hasFetched) {
    return (
      <CenterDiv>
        <CircularProgress />
        {resources.MetaResource.Loading}
      </CenterDiv>
    );
  }

  return (
    <>
      <Filter value={localFilter} onChange={onChangeHandler} />
      <DomainListWrapper>
        <DomainList domains={domains} onPropertyClicked={onPropertyClicked} />
      </DomainListWrapper>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  domains: selectFilteredDomains,
  filter: selectFilter,
  apiState: selectApiState,
  token: selectToken,
  managementCloudId: selectManagementCloudId,
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
});
const mapDispatchToProps = (dispatch) => ({
  setDomains: (domains) => dispatch(setDomains(domains)),
  setFilter: (filter) => dispatch(setFilter(filter)),
  setApiState: (apiState) => dispatch(setApiState(apiState)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PropertyPicker);