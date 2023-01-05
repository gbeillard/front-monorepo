import React, { useState, useEffect } from 'react';
import * as UtilsFilter from '../../Utils/utilsFilter.js';
import Domain from './Domain.jsx';

const shouldDisplayDomain = (showAllProperties, domain, compatibleProperties) =>
  showAllProperties || domain.IsSelectable || !compatibleProperties;

const PropertiesDomainsLayout = ({ children }) => <div className="bim-properties">{children}</div>;

const PropertiesDomains = ({
  disableCheckBoxSelected = false,
  searchText,
  currentSelectedProperties,
  selectProperty,
  domains,
  propertyMappingIdToConnect,
  propertyMappingIsToConnectLater,
  connectProperty,
  disconnectProperty,
  multiSelection,
  showAllProperties,
  filterList,
  compatibleProperties = true,
}) => {
  const [propertyIdConnected, setPropertyIdConnected] = useState(0);

  const resetValue = () => {
    setPropertyIdConnected(0);
  };

  const getFilterValues = (type) => UtilsFilter.getFilterValues(filterList, type);

  useEffect(() => {
    $('body').on('hidden.bs.modal', resetValue);

    return () => $('body').off('hidden.bs.modal', resetValue);
  }, []);

  if (!Array.isArray(domains)) {
    return <PropertiesDomainsLayout />;
  }

  const filterValues = UtilsFilter.getFilterValues(filterList, UtilsFilter.type.DOMAIN);

  const domainsDisplayed = domains
    .filter(
      (domain) =>
        UtilsFilter.checkFilter(filterValues, domain.Id) &&
        shouldDisplayDomain(showAllProperties, domain, compatibleProperties)
    )
    .map((domain) => (
      <Domain
        showAllProperties={showAllProperties}
        value={domain}
        key={domain.Id}
        propKeyWord={searchText}
        currentSelectedProperties={currentSelectedProperties}
        selectProperty={selectProperty}
        disableCheckBoxSelected={disableCheckBoxSelected}
        defaultExpand={domains.length === 1}
        propertyIdConnected={propertyIdConnected}
        setPropertyIdConnected={setPropertyIdConnected}
        propertyMappingIdToConnect={propertyMappingIdToConnect}
        propertyMappingIsToConnectLater={propertyMappingIsToConnectLater}
        connectProperty={connectProperty}
        disconnectProperty={disconnectProperty}
        MultiSelection={multiSelection}
        getFilterValues={getFilterValues}
        CompatibleProperties={compatibleProperties}
      />
    ));

  return <PropertiesDomainsLayout>{domainsDisplayed}</PropertiesDomainsLayout>;
};

export default PropertiesDomains;