import React from 'react';

import { SortDirection } from '@bim-co/componentui-foundation';
import { Set } from '../../../Reducers/properties-sets/types';
import { Property, FilterSort } from '../../../Reducers/Sets/Properties/types';
import { Subset } from '../../../Reducers/Sets/Subsets/types';

import Header from './Header';
import Body from './Body';
import EmptyStateGlobal from '../../EmptyStates';
import EmptyStateSet from '../EmptyStates';
import Loader from '../../CommonsElements/Loader';

type Props = {
  resources: any;
  languageCode: string;
  set: Set;
  properties: Property[];
  subsets: Subset[];
  filteredProperties: Property[];
  filterSort: FilterSort;
  fetchPropertiesIsSuccess: boolean;
  fetchPropertiesIsPending: boolean;
  fetchPropertiesIsError: string;
  fetchSetIsPending: boolean;
  fetchSetIsError: string;
  setFilterSearch: (search: string) => void;
  setFilterSort: (field: string, order: SortDirection) => void;
  editProperties: (properties: Property[]) => void;
  createSubset: (setId: number, subset: Subset, properties?: Property[]) => void;
  addSubsets: (subsets: Subset[]) => void;
  updatePropertySubsets: (
    setId: number,
    propertyId: number,
    subsets: Subset[],
    keepPropertiesWithValue?: boolean
  ) => void;
  addSubsetProperties: (setId: number, subsetId: number, propertyIds: number[]) => void;
  deleteSubsetProperties: (
    setId: number,
    subsetId: number,
    propertyIds: number[],
    keepPropertiesWithValue?: boolean
  ) => void;
  deleteProperties: (
    setId: number,
    properties: Property[],
    keepPropertiesWithValue?: boolean
  ) => void;
  addProperties: (setId: number, properties: Property[]) => void;
};

const Component: React.FunctionComponent<Props> = ({
  resources,
  languageCode,
  set,
  properties,
  filteredProperties,
  filterSort,
  subsets,
  fetchPropertiesIsSuccess,
  fetchPropertiesIsPending,
  fetchPropertiesIsError,
  fetchSetIsPending,
  fetchSetIsError,
  setFilterSearch,
  setFilterSort,
  editProperties,
  createSubset,
  addSubsets,
  updatePropertySubsets,
  addSubsetProperties,
  deleteSubsetProperties,
  deleteProperties,
  addProperties,
}) => {
  if (fetchSetIsPending) {
    return <Loader />;
  }

  // Error when set is loading or set is public
  if (fetchSetIsError) {
    return <EmptyStateSet.SetDoesNotExist />;
  }

  // Error when properties list is loading
  if (fetchPropertiesIsError) {
    return <EmptyStateGlobal.Error />;
  }

  return (
    <>
      <Header
        resources={resources}
        languageCode={languageCode}
        set={set}
        properties={properties}
        setFilterSearch={setFilterSearch}
        addProperties={addProperties}
        fetchPropertiesIsSuccess={fetchPropertiesIsSuccess}
      />
      <Body
        resources={resources}
        set={set}
        properties={properties}
        subsets={subsets}
        filteredProperties={filteredProperties}
        filterSort={filterSort}
        setFilterSort={setFilterSort}
        fetchPropertiesIsSuccess={fetchPropertiesIsSuccess}
        fetchPropertiesIsPending={fetchPropertiesIsPending}
        editProperties={editProperties}
        createSubset={createSubset}
        addSubsets={addSubsets}
        updatePropertySubsets={updatePropertySubsets}
        addSubsetProperties={addSubsetProperties}
        deleteSubsetProperties={deleteSubsetProperties}
        deleteProperties={deleteProperties}
      />
    </>
  );
};

export default Component;