import { createStructuredSelector } from 'reselect';

import { Filter, Property } from './types';

import {
  fetchProperties as fetchPropertiesAction,
  setFilter as setFilterAction,
  deleteProperty as deletePropertyAction,
  addProperties as addPropertiesAction,
} from './actions';

import {
  selectFetchPropertiesIsSuccess,
  selectFetchPropertiesIsPending,
  selectFetchPropertiesIsError,
  selectProperties,
  selectFilteredProperties,
  selectPropertiesDomains,
  selectSets,
  selectFilter,
  selectAddPropertiesIsError,
  selectDeletePropertyIsError,
} from './selectors';

/* Dispatchers */
const BimObjectPropertiesDispatcherActions = (dispatch) => ({
  fetchProperties: (bimObjectId: number) => dispatch(fetchPropertiesAction(bimObjectId)),
  setFilter: (filter: Filter) => dispatch(setFilterAction(filter)),
  deleteProperty: (bimObjectId: number, propertyId: number) =>
    dispatch(deletePropertyAction(bimObjectId, propertyId)),
  addProperties: (bimObjectId: number, properties: Property[]) =>
    dispatch(addPropertiesAction(bimObjectId, properties)),
});

export const BimObjectPropertiesDispatchers = (dispatch) => ({
  bimObjectPropertiesProps: BimObjectPropertiesDispatcherActions(dispatch),
});

/* Selectors */
const BimObjectPropertiesStructuredSelectors = createStructuredSelector({
  properties: selectProperties,
  filteredProperties: selectFilteredProperties,
  fetchPropertiesIsSuccess: selectFetchPropertiesIsSuccess,
  fetchPropertiesIsPending: selectFetchPropertiesIsPending,
  fetchPropertiesIsError: selectFetchPropertiesIsError,
  propertiesDomains: selectPropertiesDomains,
  sets: selectSets,
  filter: selectFilter,
  addPropertiesIsError: selectAddPropertiesIsError,
  deletePropertyIsError: selectDeletePropertyIsError,
});

export const BimObjectPropertiesSelectors = {
  bimObjectPropertiesProps: BimObjectPropertiesStructuredSelectors,
};

/* Props */
export type BimObjectPropertiesProps = {
  bimObjectPropertiesProps: ReturnType<typeof BimObjectPropertiesDispatcherActions> &
  ReturnType<typeof BimObjectPropertiesStructuredSelectors>;
};

/* Merge props */
export const BimObjectPropertiesMergeProps = (stateProps, dispatchProps) => ({
  bimObjectPropertiesProps: {
    ...stateProps.bimObjectPropertiesProps,
    ...dispatchProps.bimObjectPropertiesProps,
  },
});