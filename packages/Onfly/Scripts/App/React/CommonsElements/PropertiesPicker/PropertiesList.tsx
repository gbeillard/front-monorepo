import React, { useState, useEffect, useContext, useCallback } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Menu,
  space,
  TextField,
  SortDirection,
} from '@bim-co/componentui-foundation';

import EmptyStateGlobal from '../../EmptyStates';
import PropertyRow from './PropertyRow';
import Loader from '../Loader';

/* Contexts */
import {
  PropertiesSelectContextDispatch,
  PropertiesSelectContextState,
} from './PropertiesPickerModal';

/* Types */
import { Property, Domain } from '../../../Reducers/PropertiesV10/types';

// subsets actions
import {
  setFilterSort as setFilterSortAction,
  fetchAllProperties as fetchAllPropertiesAction,
  setFilterDomain as setFilterDomainAction,
  setFilterSearch as setFilterSearchAction,
} from '../../../Reducers/PropertiesV10/actions';

// Selectors
import {
  selectPropertiesFilteredByDomainAndText,
  selectDomains,
  selectFilterByDomain,
  selectFilterSearch,
  selectFetchPropertiesIsPending,
} from '../../../Reducers/PropertiesV10/selectors';

import { selectPluginData } from '../../../Reducers/plugin/selectors';

import {
  UPDATE_PROPERTIES,
  SELECT_PROPERTY,
  SELECT_ALL_PROPERTIES,
  ExistingElements,
} from './Reducers/types';

declare const window: any;

type Props = {
  resources: any;
  selectFetchPropertiesIsPending: boolean;
  displayTypes: string[];
  existingElements?: ExistingElements;
  properties?: Property[];
  domainsList?: Domain[];
  filterDomain?: Domain;
  filterSearch?: string;
  pluginData: any;
  isDense?: boolean;
  fetchAllProperties?: (
    mappingConfigurationId?: string,
    mappingConfigurationLanguage?: string,
    mappingDictionaryLanguage?: string
  ) => void;
  setFilterDomain?: (domain: Domain) => void;
  setFilterSearch?: (search: string) => void;
  setFilterSort?: (field: string, order: SortDirection) => void;
};

const getPropertiesList = (state) => state?.properties?.list ?? [];
const getPropertiesSelections = (state) => state?.properties?.selections ?? [];

const isPropertySelected = (property, selections) => {
  if (!selections || !selections.length) {
    return false;
  }
  return selections.findIndex((selectedProperty) => selectedProperty?.Id === property?.Id) >= 0;
};

/**
 * Converts a list of domains into displayable options
 * @param domainsList List of domains
 */
const getPropertiesFiltersDomainsList = (domainsList, resources) => {
  // Extract a list of unique sets
  const propertiesDomainsFiltersList = (domainsList ?? []).map((domain) => ({
    id: domain?.Id,
    label: domain?.Name,
    value: domain?.Id,
    Domain: domain,
  }));

  return [
    {
      label: resources.ContentManagement.PopinPropertiesFilterPropertiesAllDomains,
      value: null,
      Domain: null,
    },
    ...propertiesDomainsFiltersList,
  ];
};

const getPropertiesFiltersDomainsValue = (domainsList, filterDomain, resources) => {
  if (!domainsList || !domainsList.length) {
    return null;
  }
  const displayDomainList = getPropertiesFiltersDomainsList(domainsList, resources);
  if (!filterDomain) {
    return displayDomainList[0].label;
  }

  const domainFound = displayDomainList.find(
    (domain) => domain?.Domain && domain.Domain?.Id === filterDomain?.Id
  );
  return domainFound?.label;
};

let timeoutID = null;

const SCROLL_STEP = 100;

const PropertiesList: React.FC<Props> = ({
  displayTypes,
  resources,
  existingElements,
  isDense,
  selectFetchPropertiesIsPending,
  filterDomain,
  filterSearch,
  pluginData, // mapSelectToProps
  properties,
  domainsList,
  fetchAllProperties,
  setFilterDomain,
  setFilterSearch,
  setFilterSort, // mapDispatchToProps
}) => {
  const propertiesSelectContextDispatch = useContext(PropertiesSelectContextDispatch);
  const propertiesSelectContextState = useContext(PropertiesSelectContextState);
  const [localFilter, setLocalFilter] = useState(filterSearch);
  const [currentStep, setCurrentStep] = useState(SCROLL_STEP);

  /**
   * Initial call : Component mounted
   */
  useEffect(() => {
    // reset all fitlers and sort
    setFilterSort('Name', SortDirection.Asc);
    setFilterSearch('');
    setFilterDomain(null);
    if (!selectFetchPropertiesIsPending) {
      // Load all properties
      if (window._isPlugin) {
        fetchAllProperties(
          pluginData.configurationID as string,
          pluginData.configurationLanguage as string,
          pluginData.mappingDictionaryLanguage as string,
        );
      } else {
        fetchAllProperties();
      }
    }
  }, [pluginData]);

  // Reset local filter when search string changes
  useEffect(() => {
    setLocalFilter(filterSearch);
  }, [filterSearch]);

  useEffect(() => {
    // Load all properties
    let storedData = properties?.map((property) => ({ ...property, type: 'property' }));

    // Filter on existing properties
    if (existingElements?.properties) {
      storedData = storedData?.filter(
        (property) => !(existingElements?.properties?.findIndex((p) => p?.Id === property?.Id) > -1)
      );
    }

    propertiesSelectContextDispatch({ type: UPDATE_PROPERTIES, payload: storedData });
  }, [properties]);

  /**
        Increases the size of the currentStep that determines how many elements are visible
     */
  const handleLoadMore = useCallback(() => {
    setCurrentStep((value) => value + SCROLL_STEP);
  }, [currentStep, setCurrentStep]);

  /**
   * Renders a Menu for filtering by Domain
   */
  const renderDomainsFilter = useCallback(() => {
    const filtersList = getPropertiesFiltersDomainsList(domainsList, resources);
    return (
      <Menu
        items={filtersList}
        buttonText={getPropertiesFiltersDomainsValue(domainsList, filterDomain, resources)}
        onChange={(item) => {
          const domainFound = domainsList.find((domain) => domain.Id === item?.value) ?? null;
          setFilterDomain(domainFound);
          setCurrentStep(SCROLL_STEP);
        }}
        menuOptions={{ maxHeight: space[2000] }}
        size={isDense ? 'dense' : 'default'}
      />
    );
  }, [domainsList, filterDomain]);

  /**
   * Process filtering action
   * @param event : the triggered event
   */
  const handleFilterChange = (event) => {
    const text: string = event.target.value;
    setLocalFilter(text);
    if (timeoutID !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      clearTimeout(timeoutID);
    }
    timeoutID = setTimeout(() => setFilterSearch(text), 500);
  };

  /**
   * Renders the list of properties
   */
  const renderPropertiesRows = useCallback(
    (columns) => {
      // Don't render properties list when not asked
      if (!displayTypes || !displayTypes.length || displayTypes.indexOf('properties') < 0) {
        return null;
      }

      const propertiesList = getPropertiesList(propertiesSelectContextState);
      return (propertiesList || [])
        .slice(0, currentStep)
        .map(
          (property) =>
            property && <PropertyRow key={property.Id} property={property} columns={columns} />
        );
    },
    [propertiesSelectContextState, currentStep]
  );

  const getPropertiesListCols = () => [
    {
      id: 'name',
      label: resources.ContentManagement.PropertiesTitleName,
      isSortable: true,
      isCheckAll: true,
      renderItem: (property) => (
        <Checkbox
          checked={isPropertySelected(
            property,
            getPropertiesSelections(propertiesSelectContextState)
          )}
          onClick={() => {
            propertiesSelectContextDispatch({ type: SELECT_PROPERTY, payload: property });
          }}
          label={`${property.Name as string}`}
        />
      ),
    },
    {
      id: 'domain',
      label: resources.ContentManagement.PropertiesTitleDomain,
      isSortable: true,
      renderItem: (property) => property.Domain?.Name,
    },
    {
      id: 'unit',
      label: resources.ContentManagement.PropertiesTitleUnit,
      isSortable: true,
      renderItem: (property) => property.DefaultUnit?.Symbol,
    },
    {
      id: 'description',
      label: resources.ContentManagement.PropertiesTitleDescription,
      isSortable: true,
      renderItem: (property) => property.Description,
    },
  ];

  /**
   * Renders the table
   * @param cols an objet representing the columns
   */
  const renderPropertiesTable = (cols) => {
    if (!getPropertiesList(propertiesSelectContextState)?.length) {
      if (localFilter || filterDomain) {
        return <EmptyStateGlobal.NoSearchResults />;
      }

      return null;
    }

    return (
      <PropertiesTableContainer>
        <InfiniteScroll
          loadMore={handleLoadMore}
          useWindow={false}
          hasMore={currentStep < getPropertiesList(propertiesSelectContextState)?.length}
        >
          <Table size={isDense ? 'dense' : 'default'}>
            <TableHead>
              <TableRow>
                {cols.map((column) => {
                  if (column.isCheckAll) {
                    return (
                      <TableCell key={column.id}>
                        <Checkbox
                          checked={
                            getPropertiesSelections(propertiesSelectContextState).length ===
                            getPropertiesList(propertiesSelectContextState).length
                          }
                          indeterminate={
                            getPropertiesSelections(propertiesSelectContextState).length > 0 &&
                            getPropertiesSelections(propertiesSelectContextState).length <
                            getPropertiesList(propertiesSelectContextState).length
                          }
                          onClick={() => {
                            propertiesSelectContextDispatch({
                              type: SELECT_ALL_PROPERTIES,
                              payload: null,
                            });
                          }}
                          label={column.label}
                        />
                      </TableCell>
                    );
                  }
                  return <TableCell key={column.id}>{column.label}</TableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>{renderPropertiesRows(cols)}</TableBody>
          </Table>
        </InfiniteScroll>
      </PropertiesTableContainer>
    );
  };

  /**
   * Render the list with filters
   */
  const renderPropertiesList = () => {
    const cols = getPropertiesListCols() || [];
    return (
      <>
        <SubsetsFilters>
          {renderDomainsFilter()}
          <InputContainer>
            <TextField
              size="dense"
              iconLeft="search"
              placeholder={resources.ContentManagement.PopinPropertiesSearchPropertiesPlaceholder}
              value={localFilter}
              onChange={handleFilterChange}
            />
          </InputContainer>
        </SubsetsFilters>
        {renderPropertiesTable(cols)}
      </>
    );
  };

  if (selectFetchPropertiesIsPending) {
    return <Loader />;
  }

  /**
   * Rendering
   */
  return renderPropertiesList();
};

const mapStateToProps = createStructuredSelector({
  properties: selectPropertiesFilteredByDomainAndText,
  domainsList: selectDomains,
  filterDomain: selectFilterByDomain,
  filterSearch: selectFilterSearch,
  selectFetchPropertiesIsPending,
  pluginData: selectPluginData,
});

const mapDispatchToProps = (dispatch) => ({
  setFilterSort: (field: string, order: SortDirection) =>
    dispatch(setFilterSortAction(field, order)),
  fetchAllProperties: (mappingConfigurationId: string, mappingConfigurationLanguage: string, mappingDictionaryLanguage: string) =>
    dispatch(fetchAllPropertiesAction(mappingConfigurationId, mappingConfigurationLanguage, mappingDictionaryLanguage)),
  setFilterDomain: (filter: Domain) => dispatch(setFilterDomainAction(filter)),
  setFilterSearch: (filter: string) => dispatch(setFilterSearchAction(filter)),
});

const PropertiesTableContainer = styled.div`
  overflow: auto;
`;

const SubsetsFilters = styled.div`
  display: inline-flex;
  width: 100%;
  justify-content: space-between;
  padding-bottom: ${space[50]};
  padding-right: ${space[25]};
`;

const InputContainer = styled.div`
  display: inline-flex;
  align-items: center;
`;

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PropertiesList));