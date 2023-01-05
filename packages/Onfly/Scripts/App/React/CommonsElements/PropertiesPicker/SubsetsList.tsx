import React, { useState, useEffect, useContext, useCallback } from 'react';
import { connect } from 'react-redux';

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
} from '@bim-co/componentui-foundation';

import EmptyStateGlobal from '../../EmptyStates';
import SubsetRow from './SubsetRow';
import Loader from '../Loader';

/* Contexts */
import {
  PropertiesSelectContextDispatch,
  PropertiesSelectContextState,
} from './PropertiesPickerModal';

/* Types */
import { Set } from '../../../Reducers/properties-sets/types';
import { Subset } from '../../../Reducers/Sets/Subsets/types';

// subsets actions
import {
  fetchAllSubsets as fetchAllSubsetsAction,
  setFilterSet as setFilterSetAction,
  setFilterText as setFilterTextAction,
} from '../../../Reducers/Sets/Subsets/actions';

// Selectors
import {
  selectFilterSet,
  selectFilterText,
  selectAllSets,
  selectAllSubsetsForDisplayWithDefaultFilteredBySetAndText,
  selectFetchAllSubsetsIsPending,
} from '../../../Reducers/Sets/Subsets/selectors';
import {
  UPDATE_SUBSET,
  SELECT_SUBSET,
  SELECT_ALL_SUBSETS,
  ExistingElements,
} from './Reducers/types';

type Props = {
  resources: any;
  displayTypes: string[];
  existingElements?: ExistingElements;
  selectFetchAllSubsetsIsPending: boolean;
  fetchAllSubsets?: () => void;
  subsets?: Subset[];
  setsList?: Set[];
  filterSet?: Set;
  filterText?: string;
  isDense?: boolean;
  setFilterSet?: (set: Set) => void;
  setFilterText?: (search: string) => void;
};

const getSubsetsList = (state) => state?.subsets?.list;
const getSubsetsSelections = (state) => state?.subsets?.selections;

const isSubsetSelected = (subset, selections) => {
  if (!selections || !selections.length) {
    return false;
  }
  return selections.findIndex((selectedSubset) => selectedSubset?.Id === subset?.Id) >= 0;
};

const getSubsetsFiltersList = (setsList, resources) => {
  // Extract a list of unique sets
  const subsetFiltersList = setsList.map((set) => ({
    id: set?.Id,
    label: set?.Name,
    value: set?.Id,
    Set: set,
  }));

  return [
    {
      label: resources.ContentManagement.PopinPropertiesFilterSubsetsAllSets,
      value: null,
      Set: null,
    },
    ...subsetFiltersList,
  ];
};

/**
 * Search for the Set and returns its label
 * @param setsList : the list of Sets
 * @param filterSet : the Set to find
 */
const getSubsetFilterValue = (setsList, filterSet, resources) => {
  if (!setsList || !setsList.length) {
    return null;
  }
  const displaySetList = getSubsetsFiltersList(setsList, resources);
  if (!filterSet) {
    return displaySetList[0].label;
  }

  return displaySetList.find((set) => set.Set?.Id === filterSet?.Id)?.label;
};

let timeoutID = null;

const SubsetsList: React.FC<Props> = ({
  resources,
  displayTypes,
  existingElements,
  isDense,
  selectFetchAllSubsetsIsPending,
  subsets,
  setsList,
  filterSet,
  filterText, // mapStateToProps
  fetchAllSubsets,
  setFilterSet,
  setFilterText, // mapDispatchToProps
}) => {
  const propertiesSelectContextDispatch = useContext(PropertiesSelectContextDispatch);
  const propertiesSelectContextState = useContext(PropertiesSelectContextState);

  const [localFilter, setLocalFilter] = useState(filterText);

  useEffect(() => {
    // reset all filters
    setFilterText('');
    setFilterSet(null);
    if (!selectFetchAllSubsetsIsPending) {
      // Load all subsets
      fetchAllSubsets();
    }
  }, []);

  // Reset local filter when search string changes
  useEffect(() => {
    setLocalFilter(filterText);
  }, [filterText]);

  useEffect(() => {
    // Load all subsets
    let storedData = subsets?.map((subset) => ({ ...subset, type: 'subset' }));

    // Filter on existing subsets
    if (existingElements?.subsets) {
      storedData = storedData?.filter(
        (subset) => !(existingElements?.subsets?.findIndex((s) => s?.Id === subset?.Id) > -1)
      );
    }

    propertiesSelectContextDispatch({ type: UPDATE_SUBSET, payload: storedData });
  }, [subsets]);

  const renderSubsetsRows = useCallback(
    (columns) => {
      // Don't render subsets list when not asked
      if (!displayTypes || !displayTypes.length || displayTypes.indexOf('subsets') < 0) {
        return null;
      }

      const subsetsList = getSubsetsList(propertiesSelectContextState);
      return (subsetsList || []).map((subset) => (
        <SubsetRow key={subset.Id} subset={subset} columns={columns} />
      ));
    },
    [propertiesSelectContextState]
  );

  const getSubsetsListCols = () => [
    {
      id: 'name',
      label: resources.ContentManagementPropSetForm.FieldNameLabel,
      isSortable: true,
      isCheckAll: true,
      renderItem: (subset) => (
        <Checkbox
          checked={isSubsetSelected(subset, getSubsetsSelections(propertiesSelectContextState))}
          onClick={() => {
            propertiesSelectContextDispatch({ type: SELECT_SUBSET, payload: subset });
          }}
          label={subset?.displayName}
        />
      ),
    },
    {
      id: 'description',
      label: resources.ContentManagementPropSetForm.FieldDescriptionLabel,
      isSortable: true,
      renderItem: (subset) => subset.description,
    },
  ];

  const renderFilterSets = useCallback(() => {
    const filtersList = getSubsetsFiltersList(setsList, resources);
    return (
      <Menu
        items={filtersList}
        buttonText={getSubsetFilterValue(setsList, filterSet, resources)}
        onChange={(item) => {
          const setFound = (setsList || []).find((set) => set?.Id === item?.value) ?? null;
          setFilterSet(setFound);
        }}
        menuOptions={{ maxHeight: space[2000] }}
        size={isDense ? 'dense' : 'default'}
      />
    );
  }, [setsList, filterSet]);

  const handleFilterChange = (event) => {
    const text: string = event.target.value;
    setLocalFilter(text);
    if (timeoutID !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      clearTimeout(timeoutID);
    }
    timeoutID = setTimeout(() => setFilterText(text), 500);
  };

  /**
   * Renders the table
   * @param cols an objet representing the columns
   */
  const renderSubsetsTable = (cols) => {
    if (!getSubsetsList(propertiesSelectContextState)?.length) {
      if (localFilter || filterSet || !subsets?.length) {
        return <EmptyStateGlobal.NoSearchResults />;
      }

      return null;
    }

    return (
      <SubsetsTableContainer>
        <SubsetsTable>
          <TableHead>
            <TableRow>
              {cols.map((column) => {
                if (column.isCheckAll) {
                  return (
                    <TableCell key={column.id}>
                      <Checkbox
                        checked={
                          getSubsetsSelections(propertiesSelectContextState)?.length ===
                          getSubsetsList(propertiesSelectContextState)?.length
                        }
                        indeterminate={
                          getSubsetsSelections(propertiesSelectContextState)?.length > 0 &&
                          getSubsetsSelections(propertiesSelectContextState)?.length <
                          getSubsetsList(propertiesSelectContextState)?.length
                        }
                        onClick={() => {
                          propertiesSelectContextDispatch({
                            type: SELECT_ALL_SUBSETS,
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
          <TableBody>{renderSubsetsRows(cols)}</TableBody>
        </SubsetsTable>
      </SubsetsTableContainer>
    );
  };

  const renderSubsetsSection = () => {
    const cols = getSubsetsListCols();
    return (
      <>
        <SubsetsFilters>
          {renderFilterSets()}
          <InputContainer>
            <TextField
              size="dense"
              iconLeft="search"
              placeholder={resources.ContentManagement.PopinPropertiesSearchSubsetsPlaceholder}
              value={localFilter}
              onChange={handleFilterChange}
            />
          </InputContainer>
        </SubsetsFilters>
        {renderSubsetsTable(cols)}
      </>
    );
  };

  if (selectFetchAllSubsetsIsPending) {
    return <Loader />;
  }

  /**
   * Rendering
   */
  return renderSubsetsSection();
};

const mapStateToProps = createStructuredSelector({
  subsets: selectAllSubsetsForDisplayWithDefaultFilteredBySetAndText,
  setsList: selectAllSets,
  filterText: selectFilterText,
  filterSet: selectFilterSet,
  selectFetchAllSubsetsIsPending,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAllSubsets: () => dispatch(fetchAllSubsetsAction()),
  setFilterSet: (filter: Set) => dispatch(setFilterSetAction(filter)),
  setFilterText: (filter: string) => dispatch(setFilterTextAction(filter)),
});

const SubsetsTableContainer = styled.div`
  overflow: auto;
`;

const SubsetsTable = styled(Table)``;

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

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(SubsetsList));