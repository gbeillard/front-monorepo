import Immutable, { ImmutableObject, ImmutableArray } from 'seamless-immutable';
import { createSelector } from 'reselect';
import { initialState } from './reducer';
import {
  ValueContainerFilter,
  FormattedFilters,
  StaticFilters,
  FilterProperty,
  StaticValueFilterItem,
  Property,
  PropertyValue,
  StaticValueFilterGroupItem,
} from './types';
import { getGroupName } from '../groups/utils';
import { selectTranslatedResources } from '../app/selectors';

const selectRoot = (store): typeof initialState => store.objects;

export const selectRequest = createSelector(selectRoot, (state) => state.request);
export const selectFilter = createSelector(selectRequest, (request) => request.SearchValue.Value);
export const selectLibraries = createSelector(
  selectRequest,
  (request) => request.ContentManagementLibraries
);
export const selectGroupId = createSelector(selectRoot, (state) => state.group?.id);
export const selectGroup = createSelector(selectRoot, (state) => state.group);
export const selectResponse = createSelector(selectRoot, (state) => state.response);
export const selectObjects = createSelector(selectRoot, (state) => state.objects);

export const selectSelectedClassification = createSelector(
  selectRoot,
  (state) => state.selectedClassification
);
export const selectSelectedNode = createSelector(selectRoot, (state) => state.selectedNode);

const getFiltersCount = (valueContainerFilter: ImmutableArray<ValueContainerFilter>): number => {
  const hasDuplicateFilter =
    valueContainerFilter.some((filter) => filter.Property === FilterProperty.Classification) &&
    valueContainerFilter.some((filter) => filter.Property === FilterProperty.ClassificationNode);
  const filtersCount = valueContainerFilter.length;
  return hasDuplicateFilter ? filtersCount - 1 : filtersCount;
};

export const selectFiltersCount = createSelector(selectRequest, (request) =>
  getFiltersCount(request.SearchContainerFilter.ValueContainerFilter)
);

export const selectIsSearching = createSelector(selectRoot, (state) => state.api.search.pending);

export const selectHasMore = createSelector(
  selectIsSearching,
  selectObjects,
  selectResponse,
  (isSearching, objects, response) => !isSearching && objects.length < response.Total
);
export const selectObjectsCount = createSelector(selectResponse, (response) => response.Total);

export const selectFilters = createSelector(
  selectRequest,
  selectResponse,
  selectTranslatedResources,
  (request, response, resources) =>
    getFormattedFilters(
      request.SearchContainerFilter.ValueContainerFilter,
      response.StaticFilters,
      resources
    )
);
export const selectClassificationsResponseFilter = createSelector(
  selectResponse,
  (response) => response.StaticFilters.ClassificationNodes
);

export const selectSoftwaresFilter = createSelector(selectFilters, (filters) => filters.Softwares);
export const selectTagsFilter = createSelector(selectFilters, (filters) => filters.Tags);
export const selectLodsFilter = createSelector(selectFilters, (filters) => filters.Lods);
export const selectClassificationsFilter = createSelector(
  selectFilters,
  (filters) => filters.Classifications
);
export const selectClassificationNodesFilter = createSelector(
  selectFilters,
  (filters) => filters.ClassificationNodes
);
export const selectManufacturersFilter = createSelector(
  selectFilters,
  (filters) => filters.Manufacturers
);

export const selectCountries: any = createSelector(selectRoot, (state) => state.countries);

export const selectCountriesFetchState: any = createSelector(
  selectRoot,
  (state) => state.api.countries
);

export const selectCountriesFilter: any = createSelector(
  selectFilters,
  (filters) => filters.Countries
);

export const selectGroupsFilter: any = createSelector(selectFilters, (filters) => {
  // Move the favorite collection in first place of the list
  const groups = [...filters.Groups?.filter((g) => !g?.isFavorite)];

  const favoriteCollection = filters.Groups?.find((g) => g?.isFavorite);

  if (favoriteCollection) {
    groups?.unshift(favoriteCollection);
  }

  return Immutable(groups);
});

export const selectHasFavoriteGroupFilter = createSelector(selectGroupsFilter, (filters) =>
  filters?.some((g) => g?.isFavorite)
);

export const selectIsFilteredByFavorites = createSelector(selectGroupsFilter, (filters) =>
  filters?.some((g) => g?.isFavorite && g?.selected)
);

export const selectProperties = createSelector(selectRequest, selectResponse, (request, response) =>
  getFormattedProperties(request.SearchContainerFilter.ValueContainerFilter, response.StaticFilters)
);

export const selectFetchBimObjectIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.fetchBimObject.success
);
export const selectFetchBimObjectIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.fetchBimObject.pending
);
export const selectFetchBimObjectIsError = createSelector(
  selectRoot,
  (state): string => state.api.fetchBimObject.error
);
export const selectBimObject = createSelector(selectRoot, (state) => state.bimObject);

export const getFormattedFilters = (
  requestFilters: ImmutableArray<ValueContainerFilter>,
  responseFilters: ImmutableObject<StaticFilters>,
  resources?: any
): FormattedFilters => ({
  Softwares: getFormattedFilter(requestFilters, responseFilters.Softwares, FilterProperty.Software),
  Tags: getFormattedFilter(requestFilters, responseFilters.Pins, FilterProperty.Tag),
  Lods: getFormattedFilter(requestFilters, responseFilters.Lod, FilterProperty.Lod),
  Classifications: getFormattedFilter(
    requestFilters,
    responseFilters.Classifications,
    FilterProperty.Classification
  ),
  ClassificationNodes: getFormattedFilter(
    requestFilters,
    responseFilters.ClassificationNodes,
    FilterProperty.ClassificationNode
  ),
  Manufacturers: getFormattedFilter(
    requestFilters,
    responseFilters.Manufacturers,
    FilterProperty.Manufacturer
  ),
  Groups: getFormattedFilter(
    requestFilters,
    responseFilters.Groups,
    FilterProperty.Group,
    resources
  ),
  Countries: getFormattedFilter(
    requestFilters,
    responseFilters.Countries,
    FilterProperty.Countries
  ),
});

export const getFormattedFilter = (
  requestFilters: ImmutableArray<ValueContainerFilter>,
  responseFilter: ImmutableArray<StaticValueFilterItem | StaticValueFilterGroupItem>,
  property: FilterProperty,
  resources?: any
) => {
  if (!responseFilter) {
    return Immutable([]);
  }
  const requestFilter = requestFilters.find((filter) => filter.Property === property);
  const values = requestFilter && requestFilter.Values ? requestFilter.Values : [];
  const mappedAndSortedResponse = responseFilter
    .map((filter) => mapResponseFilter(filter, values, property, resources))
    .asMutable()
    .slice()
    .sort((a, b) => a.label.localeCompare(b.label));
  return Immutable(mappedAndSortedResponse);
};

const mapResponseFilter = (
  filter: StaticValueFilterItem | StaticValueFilterGroupItem,
  values: string[],
  property: FilterProperty,
  resources?: any
) => {
  const mappedFilter = mapFilter(filter, values);

  switch (property) {
    case FilterProperty.Group: {
      const { IsFavorite, Type, Name } = filter as StaticValueFilterGroupItem;

      return {
        ...mappedFilter,
        label: getGroupName(resources, Name, Type),
        isFavorite: IsFavorite,
        type: Type,
      };
    }
    default:
      return mappedFilter;
  }
};

const mapFilter = (filter: StaticValueFilterItem, values: string[]) => ({
  value: filter.Value,
  label: filter.Name,
  count: filter.Count,
  selected: values?.includes(filter.Value),
});

const getFormattedProperties = (
  requestFilters: ImmutableArray<ValueContainerFilter>,
  responseFilters: ImmutableObject<StaticFilters>
): ImmutableArray<Property> => {
  if (!responseFilters.PropertiesList) {
    return Immutable([]);
  }

  return responseFilters.PropertiesList.map((property) => ({
    id: property.Value,
    name: property.Name,
    values: getPropertyValues(property, requestFilters, responseFilters),
    selected: getPropertySelected(property, requestFilters),
  }));
};

const getPropertyValues = (
  property: StaticValueFilterItem,
  requestFilters: ImmutableArray<ValueContainerFilter>,
  responseFilters: ImmutableObject<StaticFilters>
): PropertyValue[] => {
  const index = `${FilterProperty.Property}-${property.Value}`;
  const entry = responseFilters.getIn([index]) as unknown as StaticValueFilterItem[];
  if (!entry) {
    return [];
  }
  return entry.map((value) => ({
    value: value.Value,
    label: value.Name,
    selected: getPropertyValueSelected(property.Value, value.Value, requestFilters),
  }));
};

const getPropertySelected = (
  property: StaticValueFilterItem,
  requestFilters: ImmutableArray<ValueContainerFilter>
) =>
  requestFilters.filter(
    (filter) => filter.Property === FilterProperty.Property && filter.PropertyId === property.Value
  ).length > 0;

const getPropertyValueSelected = (
  propertyId: string,
  value: string,
  requestFilters: ImmutableArray<ValueContainerFilter>
): boolean => {
  const entry = requestFilters.find(
    (filter) => filter.Property === FilterProperty.Property && filter.PropertyId === propertyId
  );
  if (!entry) {
    return false;
  }
  return entry.Values.includes(value);
};

export const selectShowFilters = createSelector(selectRoot, (state) => state.showFilters);