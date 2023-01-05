import { ImmutableArray } from 'seamless-immutable';
import {
  SET_FILTER,
  SetFilterAction,
  SearchObjectsAction,
  SEARCH_OBJECTS,
  SearchObjectsSuccessAction,
  SearchResponse,
  SEARCH_OBJECTS_SUCCESS,
  SearchObjectsErrorAction,
  SEARCH_OBJECTS_ERROR,
  IncreasePaginationAction,
  INCREASE_PAGINATION,
  ContentManagementLibrary,
  SetLibrariesAction,
  SET_LIBRARIES,
  SetSofwareFiltersAction,
  SET_SOFTWARE_FILTERS,
  SetTagFiltersAction,
  SET_TAG_FILTERS,
  SetLodFiltersAction,
  SET_LOD_FILTERS,
  SetClassifiationFiltersAction,
  SET_CLASSIFICATION_FILTERS,
  SetManufacturerFiltersAction,
  SET_MANUFACTURER_FILTERS,
  SetPropertyFilterAction,
  SET_PROPERTY_FILTER,
  AddPropertyFilterAction,
  RemovePropertyFilterAction,
  ADD_PROPERTY_FILTER,
  REMOVE_PROPERTY_FILTER,
  ResetSearchAction,
  RESET_SEARCH,
  SetSelectedClassificationAction,
  SET_SELECTED_CLASSIFICATION,
  SetSelectedNodeAction,
  SET_SELECTED_NODE,
  InitializeSearchAction,
  INITIALIZE_SEARCH,
  SET_CLASSIFICATION_NODE_FILTERS,
  SetClassifiationNodeFiltersAction,
  SearchObjectsStartAction,
  SEARCH_OBJECTS_START,
  BimObject,
  FETCH_BIMOBJECT,
  FetchBimObjectAction,
  FETCH_BIMOBJECT_SUCCESS,
  FetchBimObjectSuccessAction,
  FETCH_BIMOBJECT_ERROR,
  FetchBimObjectErrorAction,
  SearchObjectsOptions,
  ToggleFiltersVisibilityAction,
  TOGGLE_FILTERS_VISIBILITY,
  SearchObjectGroup,
  SET_GROUP_FILTERS,
  SetGroupFiltersAction,
  FETCH_COUNTRIES,
  FETCH_COUNTRIES_SUCCESS,
  FETCH_COUNTRIES_ERROR,
  SetCountriesFilter,
  SET_COUNTRIES_FILTER,
} from './types';
import { IClassification, IClassificationNode } from '../classifications/types';
import { Country } from '../Country';

export const initializeSearch = (
  libraries: ImmutableArray<ContentManagementLibrary>,
  group?: SearchObjectGroup
): InitializeSearchAction => ({
  type: INITIALIZE_SEARCH,
  libraries,
  group,
});

export const setFilter = (filter: string): SetFilterAction => ({
  type: SET_FILTER,
  filter,
});

export const increasePagination = (): IncreasePaginationAction => ({
  type: INCREASE_PAGINATION,
});

export const setLibraries = (
  libraries: ImmutableArray<ContentManagementLibrary>
): SetLibrariesAction => ({
  type: SET_LIBRARIES,
  libraries,
});

export const setSoftwareFilters = (softwares: ImmutableArray<string>): SetSofwareFiltersAction => ({
  type: SET_SOFTWARE_FILTERS,
  softwares,
});

export const setTagFilters = (tags: ImmutableArray<string>): SetTagFiltersAction => ({
  type: SET_TAG_FILTERS,
  tags,
});

export const setLodFilters = (lods: ImmutableArray<string>): SetLodFiltersAction => ({
  type: SET_LOD_FILTERS,
  lods,
});

export const setClassificationFilters = (
  classifications: ImmutableArray<string>
): SetClassifiationFiltersAction => ({
  type: SET_CLASSIFICATION_FILTERS,
  classifications,
});

export const setClassificationNodeFilters = (
  nodes: ImmutableArray<string>
): SetClassifiationNodeFiltersAction => ({
  type: SET_CLASSIFICATION_NODE_FILTERS,
  nodes,
});

export const setManufacturerFilters = (
  manufacturers: ImmutableArray<string>
): SetManufacturerFiltersAction => ({
  type: SET_MANUFACTURER_FILTERS,
  manufacturers,
});

export const setGroupFilters = (groups: ImmutableArray<string>): SetGroupFiltersAction => ({
  type: SET_GROUP_FILTERS,
  groups,
});

export const addPropertyFilter = (propertyId: string): AddPropertyFilterAction => ({
  type: ADD_PROPERTY_FILTER,
  propertyId,
});

export const removePropertyFilter = (propertyId: string): RemovePropertyFilterAction => ({
  type: REMOVE_PROPERTY_FILTER,
  propertyId,
});

export const setPropertyFilter = (
  propertyId: string,
  values: ImmutableArray<string>
): SetPropertyFilterAction => ({
  type: SET_PROPERTY_FILTER,
  propertyId,
  values,
});

export const searchObjects = (options?: SearchObjectsOptions): SearchObjectsAction => ({
  type: SEARCH_OBJECTS,
  options,
});

export const searchObjectsStart = (id: string): SearchObjectsStartAction => ({
  type: SEARCH_OBJECTS_START,
  id,
});

export const searchObjectsSuccess = (
  response: SearchResponse,
  options?: SearchObjectsOptions
): SearchObjectsSuccessAction => ({
  type: SEARCH_OBJECTS_SUCCESS,
  response,
  options,
});

export const searchObjectsError = (error: Error): SearchObjectsErrorAction => ({
  type: SEARCH_OBJECTS_ERROR,
  error,
});

export const setSelectedClassification = (
  classification: IClassification
): SetSelectedClassificationAction => ({
  type: SET_SELECTED_CLASSIFICATION,
  classification,
});

export const setSelectedNode = (node: IClassificationNode): SetSelectedNodeAction => ({
  type: SET_SELECTED_NODE,
  node,
});

export const resetSearch = (): ResetSearchAction => ({
  type: RESET_SEARCH,
});

export const fetchBimObject = (bimObjectId: number): FetchBimObjectAction => ({
  type: FETCH_BIMOBJECT,
  bimObjectId,
});

export const fetchBimObjectSuccess = (bimObject: BimObject): FetchBimObjectSuccessAction => ({
  type: FETCH_BIMOBJECT_SUCCESS,
  bimObject,
});

export const fetchBimObjectError = (error: string): FetchBimObjectErrorAction => ({
  type: FETCH_BIMOBJECT_ERROR,
  error,
});

export const fetchCountries = () => ({
  type: FETCH_COUNTRIES,
});

export const fetchCountriesSuccess = (countries: Country[]) => ({
  type: FETCH_COUNTRIES_SUCCESS,
  countries,
});

export const fetchCountriesError = (error: string) => ({
  type: FETCH_COUNTRIES_ERROR,
  error,
});

export const setCountriesFilter = (countries: ImmutableArray<string>): SetCountriesFilter => ({
  type: SET_COUNTRIES_FILTER,
  countries,
});

export const toggleFiltersVisibility = (): ToggleFiltersVisibilityAction => ({
  type: TOGGLE_FILTERS_VISIBILITY,
});