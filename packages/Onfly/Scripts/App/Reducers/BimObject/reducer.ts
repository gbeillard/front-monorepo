import Immutable, { ImmutableArray, ImmutableObject } from 'seamless-immutable';
import {
  SearchRequest,
  SearchType,
  SearchSortingOrder,
  SearchSortingName,
  LanguageCode,
  SET_FILTER,
  ObjectsActions,
  SearchResponse,
  SEARCH_OBJECTS_SUCCESS,
  SEARCH_OBJECTS_ERROR,
  INCREASE_PAGINATION,
  SET_LIBRARIES,
  ContentManagementLibrary,
  SearchResponseDocument,
  SET_SOFTWARE_FILTERS,
  ProcessResponseMode,
  SET_TAG_FILTERS,
  FilterProperty,
  FilterAlias,
  SET_LOD_FILTERS,
  SET_CLASSIFICATION_FILTERS,
  SET_MANUFACTURER_FILTERS,
  SET_GROUP_FILTERS,
  FilterKind,
  SET_PROPERTY_FILTER,
  SearchRequestStaticFilters,
  ADD_PROPERTY_FILTER,
  REMOVE_PROPERTY_FILTER,
  RESET_SEARCH,
  SET_SELECTED_CLASSIFICATION,
  SET_SELECTED_NODE,
  INITIALIZE_SEARCH,
  SET_CLASSIFICATION_NODE_FILTERS,
  SEARCH_OBJECTS_START,
  BimObject,
  FETCH_BIMOBJECT,
  FETCH_BIMOBJECT_SUCCESS,
  FETCH_BIMOBJECT_ERROR,
  TOGGLE_FILTERS_VISIBILITY,
  SearchObjectGroup,
  FormattedGroupFilter,
  FETCH_COUNTRIES,
  FETCH_COUNTRIES_SUCCESS,
  FETCH_COUNTRIES_ERROR,
  SET_COUNTRIES_FILTER,
} from './types';
import {
  setValueFilter,
  setStaticFilter,
  addPropertyFilter,
  setPropertyFilter,
  removePropertyFilter,
  updateObjects,
  updateResponse,
  updateFavoritesObjects,
} from './utils';
import { IClassification, IClassificationNode } from '../classifications/types';
import { SET_LANGUAGE } from '../../Actions/app-actions';
import { UPDATE_COLLECTION_BIMOBJECTS } from '../Collections/constants';
import { UpdateCollectionBimObjectsAction } from '../Collections/types';
import { getFormattedFilter } from './selectors';

export const PAGINATION_STEP = 16;

const request: SearchRequest = {
  Id: '',
  SearchType: SearchType.Object,
  SearchValue: {
    Value: '',
  },
  SearchSorting: {
    Name: SearchSortingName.CreatedAt,
    Order: SearchSortingOrder.Desc,
  },
  SearchPaging: {
    From: 0,
    Size: PAGINATION_STEP,
  },
  LanguageCode: LanguageCode.English,
  ContentManagementLibraries: [ContentManagementLibrary.Onfly],
  SearchContainerFilter: {
    ValueContainerFilter: [],
  },
  StaticFilters: {
    Softwares: { Property: FilterProperty.Software, Kind: FilterKind.Value },
    Pins: { Property: FilterProperty.Tag, Kind: FilterKind.Value },
    Lod: { Property: FilterProperty.Lod, Kind: FilterKind.Value },
    Classifications: { Property: FilterProperty.Classification, Kind: FilterKind.Value },
    ClassificationNodes: { Property: FilterProperty.ClassificationNode, Kind: FilterKind.Value },
    Manufacturers: { Property: FilterProperty.Manufacturer, Kind: FilterKind.Value },
    PropertiesList: { Property: FilterProperty.Property, Kind: FilterKind.Value },
    Groups: { Property: FilterProperty.Group, Kind: FilterKind.Value },
    Countries: { Property: FilterProperty.Countries, Kind: FilterKind.Value },
  },
};
const selectedClassification: IClassification = null;
const selectedNode: IClassificationNode = null;
const searchId: string = null;

const response: SearchResponse = {
  Id: '',
  Total: 0,
  Size: 0,
  Documents: [],
  StaticFilters: {
    Softwares: [],
  },
};
const objects: SearchResponseDocument[] = [];
export const initialState = Immutable({
  request,
  response,
  objects,
  api: {
    search: {
      pending: false,
      success: false,
      error: undefined,
    },
    fetchBimObject: {
      pending: false,
      success: false,
      error: undefined,
    },
    countries: {
      pending: false,
      success: false,
      error: undefined,
    },
  },
  processResponseMode: ProcessResponseMode.Concat,
  selectedClassification,
  selectedNode,
  group: null as SearchObjectGroup,
  searchId,
  bimObject: null as BimObject,
  showFilters: false,
  countries: [],
});

const objectsReducer = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state = initialState,
  action: ObjectsActions | { type: typeof SET_LANGUAGE } | UpdateCollectionBimObjectsAction
) => {
  switch (action.type) {
    case INITIALIZE_SEARCH:
      return initialState
        .setIn(['request', 'ContentManagementLibraries'], action.libraries)
        .set('processResponseMode', ProcessResponseMode.Replace)
        .set('group', action.group);
    case SET_FILTER:
      return state
        .setIn(['request', 'SearchValue', 'Value'], action.filter)
        .setIn(
          ['request', 'SearchSorting', 'Name'],
          action.filter !== null && action.filter !== ''
            ? SearchSortingName.Relevance
            : SearchSortingName.CreatedAt
        )
        .setIn(['request', 'SearchPaging', 'From'], 0)
        .set('processResponseMode', ProcessResponseMode.Replace);
    case INCREASE_PAGINATION:
      return state
        .updateIn(['request', 'SearchPaging', 'From'], (from) => from + PAGINATION_STEP)
        .set('processResponseMode', ProcessResponseMode.Concat);
    case SET_LIBRARIES:
      return state
        .setIn(['request', 'ContentManagementLibraries'], action.libraries)
        .setIn(['request', 'SearchPaging', 'From'], 0)
        .set('processResponseMode', ProcessResponseMode.Replace);
    case SET_SOFTWARE_FILTERS:
      return state
        .updateIn(['request', 'SearchContainerFilter', 'ValueContainerFilter'], (filters) =>
          setValueFilter(filters, action.softwares, FilterProperty.Software, FilterAlias.Software)
        )
        .setIn(['request', 'SearchPaging', 'From'], 0)
        .set('processResponseMode', ProcessResponseMode.Replace);
    case SET_TAG_FILTERS:
      return state
        .updateIn(['request', 'SearchContainerFilter', 'ValueContainerFilter'], (filters) =>
          setValueFilter(filters, action.tags, FilterProperty.Tag, FilterAlias.Tag)
        )
        .setIn(['request', 'SearchPaging', 'From'], 0)
        .set('processResponseMode', ProcessResponseMode.Replace);
    case SET_LOD_FILTERS:
      return state
        .updateIn(['request', 'SearchContainerFilter', 'ValueContainerFilter'], (filters) =>
          setValueFilter(filters, action.lods, FilterProperty.Lod, FilterAlias.Lod)
        )
        .setIn(['request', 'SearchPaging', 'From'], 0)
        .set('processResponseMode', ProcessResponseMode.Replace);
    case SET_CLASSIFICATION_FILTERS:
      return state
        .updateIn(['request', 'SearchContainerFilter', 'ValueContainerFilter'], (filters) =>
          setValueFilter(
            filters,
            action.classifications,
            FilterProperty.Classification,
            FilterAlias.Classification
          )
        )
        .setIn(['request', 'SearchPaging', 'From'], 0)
        .set('processResponseMode', ProcessResponseMode.Replace);
    case SET_CLASSIFICATION_NODE_FILTERS:
      return state
        .updateIn(['request', 'SearchContainerFilter', 'ValueContainerFilter'], (filters) =>
          setValueFilter(
            filters,
            action.nodes,
            FilterProperty.ClassificationNode,
            FilterAlias.ClassificationNode
          )
        )
        .setIn(['request', 'SearchPaging', 'From'], 0)
        .set('processResponseMode', ProcessResponseMode.Replace);
    case SET_MANUFACTURER_FILTERS:
      return state
        .updateIn(['request', 'SearchContainerFilter', 'ValueContainerFilter'], (filters) =>
          setValueFilter(
            filters,
            action.manufacturers,
            FilterProperty.Manufacturer,
            FilterAlias.Manufacturer
          )
        )
        .setIn(['request', 'SearchPaging', 'From'], 0)
        .set('processResponseMode', ProcessResponseMode.Replace);
    case SET_COUNTRIES_FILTER:
      return state
        .updateIn(['request', 'SearchContainerFilter', 'ValueContainerFilter'], (filters) =>
          setValueFilter(filters, action.countries, FilterProperty.Countries, FilterAlias.Countries)
        )
        .setIn(['request', 'SearchPaging', 'From'], 0)
        .set('processResponseMode', ProcessResponseMode.Replace);
    case SET_GROUP_FILTERS:
      return state
        .updateIn(['request', 'SearchContainerFilter', 'ValueContainerFilter'], (filters) =>
          setValueFilter(filters, action.groups, FilterProperty.Group, FilterAlias.Group)
        )
        .setIn(['request', 'SearchPaging', 'From'], 0)
        .set('processResponseMode', ProcessResponseMode.Replace);
    case ADD_PROPERTY_FILTER:
      return state
        .updateIn(['request', 'SearchContainerFilter', 'ValueContainerFilter'], (filters) =>
          addPropertyFilter(filters, action.propertyId)
        )
        .updateIn(
          ['request', 'StaticFilters'],
          (filters: ImmutableObject<SearchRequestStaticFilters>) =>
            setStaticFilter(filters, action.propertyId)
        )
        .setIn(['request', 'SearchPaging', 'From'], 0)
        .set('processResponseMode', ProcessResponseMode.Replace);
    case SET_PROPERTY_FILTER:
      return state
        .updateIn(['request', 'SearchContainerFilter', 'ValueContainerFilter'], (filters) =>
          setPropertyFilter(filters, action.propertyId, action.values)
        )
        .setIn(['request', 'SearchPaging', 'From'], 0)
        .set('processResponseMode', ProcessResponseMode.Replace);
    case REMOVE_PROPERTY_FILTER:
      return state
        .updateIn(['request', 'SearchContainerFilter', 'ValueContainerFilter'], (filters) =>
          removePropertyFilter(filters, action.propertyId)
        )
        .setIn(['request', 'SearchPaging', 'From'], 0)
        .set('processResponseMode', ProcessResponseMode.Replace);
    case SEARCH_OBJECTS_START:
      return state
        .set('searchId', action.id)
        .setIn(['api', 'search', 'pending'], true)
        .setIn(['api', 'search', 'success'], false)
        .setIn(['api', 'search', 'error'], undefined);
    case SEARCH_OBJECTS_SUCCESS:
      if (action.response.Id !== state.searchId) {
        return state;
      }
      return state
        .setIn(['api', 'search', 'pending'], false)
        .setIn(['api', 'search', 'success'], true)
        .setIn(['api', 'search', 'error'], undefined)
        .update('response', (response) => updateResponse(response, action.response, action.options))
        .update('objects', (objects) =>
          updateObjects(
            objects,
            action.response.Documents,
            state.processResponseMode,
            action.options
          )
        );
    case SEARCH_OBJECTS_ERROR:
      return state
        .setIn(['api', 'search', 'pending'], false)
        .setIn(['api', 'search', 'success'], false)
        .setIn(['api', 'search', 'error'], action.error);
    case SET_SELECTED_CLASSIFICATION:
      return state.set('selectedClassification', action.classification);
    case SET_SELECTED_NODE:
      return state.set('selectedNode', action.node);
    case RESET_SEARCH:
      const libraries = state.getIn(['request', 'ContentManagementLibraries']);
      const { group } = state;
      return initialState
        .setIn(['request', 'ContentManagementLibraries'], libraries)
        .set('group', group);
    case FETCH_BIMOBJECT:
      return state
        .setIn(['api', 'fetchBimObject', 'pending'], true)
        .setIn(['api', 'fetchBimObject', 'success'], false)
        .setIn(['api', 'fetchBimObject', 'error'], undefined);
    case FETCH_BIMOBJECT_SUCCESS:
      return state
        .setIn(['api', 'fetchBimObject', 'pending'], false)
        .setIn(['api', 'fetchBimObject', 'success'], true)
        .setIn(['api', 'fetchBimObject', 'error'], undefined)
        .setIn(['bimObject'], action.bimObject);
    case FETCH_BIMOBJECT_ERROR:
      return state
        .setIn(['api', 'fetchBimObject', 'pending'], false)
        .setIn(['api', 'fetchBimObject', 'success'], false)
        .setIn(['api', 'fetchBimObject', 'error'], action.error);
    case FETCH_COUNTRIES:
      return state
        .setIn(['api', 'countries', 'pending'], true)
        .setIn(['api', 'countries', 'success'], false)
        .setIn(['api', 'countries', 'error'], undefined);
    case FETCH_COUNTRIES_SUCCESS: {
      const { countries } = action;
      return state
        .setIn(['api', 'countries', 'pending'], false)
        .setIn(['api', 'countries', 'success'], true)
        .setIn(['api', 'countries', 'error'], undefined)
        .setIn(['countries'], countries);
    }
    case FETCH_COUNTRIES_ERROR: {
      const { error } = action;
      return state
        .setIn(['api', 'countries', 'pending'], false)
        .setIn(['api', 'countries', 'success'], false)
        .setIn(['api', 'countries', 'error'], error);
    }

    case TOGGLE_FILTERS_VISIBILITY:
      return state.update('showFilters', (showFilters) => !showFilters);
    case SET_LANGUAGE:
      return state
        .setIn(['request', 'SearchPaging', 'From'], 0)
        .set('processResponseMode', ProcessResponseMode.Replace);
    case UPDATE_COLLECTION_BIMOBJECTS:
      // Get selected group filters
      const selectedGroupFilters = getFormattedFilter(
        state.request.SearchContainerFilter.ValueContainerFilter,
        state.response.StaticFilters.Groups,
        FilterProperty.Group
      ).filter((g) => g.selected) as ImmutableArray<FormattedGroupFilter>;

      // Determines if the filter "My favorites" is selected
      const isFilteredByFavorites = selectedGroupFilters?.some((g) => g?.isFavorite);
      // We are in the collection "My favorites"
      const isFromFavorites = state.group?.isFavorite;

      return state.update('objects', (objects) => {
        if (isFilteredByFavorites) {
          // Get favorites bim objects removed and they have only the favorite collection filter
          const favoritesBimObjectsRemoved = action.bimObjects.filter(
            (b) =>
              !b.IsFavorite &&
              (objects
                .find((object) => object.Id === b.Id)
                ?.GroupsList.filter(
                  (g) =>
                    g.IsFavorite ||
                    selectedGroupFilters?.some(
                      (selectedGroup) => parseInt(selectedGroup.value, 10) === g.Id
                    )
                )?.length === 1 ??
                false)
          );

          const favoritesBimObjectsUpdated = action.bimObjects.filter(
            (bimObjectUpdated) =>
              !favoritesBimObjectsRemoved.some(
                (bimObjectRemoved) => bimObjectRemoved.Id === bimObjectUpdated.Id
              )
          );

          let newObjects = updateFavoritesObjects(objects, favoritesBimObjectsUpdated);
          newObjects = updateFavoritesObjects(newObjects, favoritesBimObjectsRemoved, true);

          return newObjects;
        }

        return updateFavoritesObjects(objects, action.bimObjects, isFromFavorites);
      });
    default:
      return state;
  }
};

export default objectsReducer;