import { ImmutableArray } from 'seamless-immutable';
import { IClassification, IClassificationNode } from '../classifications/types';
import { Country } from '../Country';
import { GroupType } from '../groups/constants';

export const INITIALIZE_SEARCH = 'OBJECTS/INITIALIZE_SEARCH';

export const SET_FILTER = 'OBJECTS/SET_FILTER';
export const INCREASE_PAGINATION = 'OBJECTS/INCREASE_PAGINATION';
export const SET_LIBRARIES = 'OBJECTS/SET_LIBRARIES';

export const SET_SOFTWARE_FILTERS = 'OBJECTS/SET_SOFTWARE_FILTERS';
export const SET_TAG_FILTERS = 'OBJECTS/SET_TAG_FILTERS';
export const SET_LOD_FILTERS = 'OBJECTS/SET_LOD_FILTERS';
export const SET_CLASSIFICATION_FILTERS = 'OBJECTS/SET_CLASSIFICATION_FILTERS';
export const SET_CLASSIFICATION_NODE_FILTERS = 'OBJECTS/SET_CLASSIFICATION_NODE_FILTERS';
export const SET_MANUFACTURER_FILTERS = 'OBJECTS/SET_MANUFACTURER_FILTERS';
export const SET_GROUP_FILTERS = 'OBJECTS/SET_GROUP_FILTERS';

export const ADD_PROPERTY_FILTER = 'OBJECTS/ADD_PROPERTY_FILTER';
export const REMOVE_PROPERTY_FILTER = 'OBJECTS/REMOVE_PROPERTY_FILTER';
export const SET_PROPERTY_FILTER = 'OBJECTS/SET_PROPERTY_FILTER';

export const SEARCH_OBJECTS = 'OBJECTS/SEARCH_OBJECTS';
export const SEARCH_OBJECTS_START = 'OBJECTS/SEARCH_OBJECTS_START';
export const SEARCH_OBJECTS_SUCCESS = 'OBJECTS/SEARCH_OBJECTS_SUCCESS';
export const SEARCH_OBJECTS_ERROR = 'OBJECTS/SEARCH_OBJECTS_ERROR';

export const SET_SELECTED_CLASSIFICATION = 'OBJECTS/SET_SELECTED_CLASSIFICATION';
export const SET_SELECTED_NODE = 'OBJECTS/SET_SELECTED_NODE';

export const RESET_SEARCH = 'OBJECTS/RESET_SEARCH';

export const FETCH_BIMOBJECT = 'BIMOBJECT/FETCH_BIMOBJECT';
export const FETCH_BIMOBJECT_SUCCESS = 'BIMOBJECT/FETCH_BIMOBJECT_SUCCESS';
export const FETCH_BIMOBJECT_ERROR = 'BIMOBJECT/FETCH_BIMOBJECT_ERROR';

export const FETCH_COUNTRIES = 'BIMOBJECT/FETCH_COUNTRIES';
export const FETCH_COUNTRIES_SUCCESS = 'BIMOBJECT/FETCH_COUNTRIES_SUCCESS';
export const FETCH_COUNTRIES_ERROR = 'BIMOBJECT/FETCH_COUNTRIES_ERROR';

export const SET_COUNTRIES_FILTER = 'OBJECTS/SET_COUNTRIES_FILTER';

export const TOGGLE_FILTERS_VISIBILITY = 'BIMOBJECT/TOGGLE_FILTERS_VISIBILITY';

export type InitializeSearchAction = {
  type: typeof INITIALIZE_SEARCH;
  libraries: ImmutableArray<ContentManagementLibrary>;
  group?: SearchObjectGroup;
};

export type SetFilterAction = {
  type: typeof SET_FILTER;
  filter: string;
};

export type IncreasePaginationAction = {
  type: typeof INCREASE_PAGINATION;
};

export type SetLibrariesAction = {
  type: typeof SET_LIBRARIES;
  libraries: ImmutableArray<ContentManagementLibrary>;
};

export type SetSofwareFiltersAction = {
  type: typeof SET_SOFTWARE_FILTERS;
  softwares: ImmutableArray<string>;
};

export type SetTagFiltersAction = {
  type: typeof SET_TAG_FILTERS;
  tags: ImmutableArray<string>;
};

export type SetLodFiltersAction = {
  type: typeof SET_LOD_FILTERS;
  lods: ImmutableArray<string>;
};

export type SetClassifiationFiltersAction = {
  type: typeof SET_CLASSIFICATION_FILTERS;
  classifications: ImmutableArray<string>;
};

export type SetClassifiationNodeFiltersAction = {
  type: typeof SET_CLASSIFICATION_NODE_FILTERS;
  nodes: ImmutableArray<string>;
};

export type SetManufacturerFiltersAction = {
  type: typeof SET_MANUFACTURER_FILTERS;
  manufacturers: ImmutableArray<string>;
};

export type SetGroupFiltersAction = {
  type: typeof SET_GROUP_FILTERS;
  groups: ImmutableArray<string>;
};

export type AddPropertyFilterAction = {
  type: typeof ADD_PROPERTY_FILTER;
  propertyId: string;
};

export type RemovePropertyFilterAction = {
  type: typeof REMOVE_PROPERTY_FILTER;
  propertyId: string;
};

export type SetPropertyFilterAction = {
  type: typeof SET_PROPERTY_FILTER;
  propertyId: string;
  values: ImmutableArray<string>;
};

export type SearchObjectsOptions = {
  withResults?: boolean;
  withFilters?: boolean;
};
export type SearchObjectsAction = {
  type: typeof SEARCH_OBJECTS;
  options?: SearchObjectsOptions;
};

export type SearchObjectsStartAction = {
  type: typeof SEARCH_OBJECTS_START;
  id: string;
};

export type SearchObjectsSuccessAction = {
  type: typeof SEARCH_OBJECTS_SUCCESS;
  response: SearchResponse;
  options?: SearchObjectsOptions;
};

export type SearchObjectsErrorAction = {
  type: typeof SEARCH_OBJECTS_ERROR;
  error: Error;
};

export type SetSelectedClassificationAction = {
  type: typeof SET_SELECTED_CLASSIFICATION;
  classification: IClassification;
};

export type SetSelectedNodeAction = {
  type: typeof SET_SELECTED_NODE;
  node: IClassificationNode;
};

export type ResetSearchAction = {
  type: typeof RESET_SEARCH;
};

export type FetchBimObjectAction = {
  type: typeof FETCH_BIMOBJECT;
  bimObjectId: number;
};

export type FetchBimObjectSuccessAction = {
  type: typeof FETCH_BIMOBJECT_SUCCESS;
  bimObject: BimObject;
};

export type FetchBimObjectErrorAction = {
  type: typeof FETCH_BIMOBJECT_ERROR;
  error: string;
};

export type FetchCountriesAction = {
  type: typeof FETCH_COUNTRIES;
};

export type FetchCountriesSuccessAction = {
  type: typeof FETCH_COUNTRIES_SUCCESS;
  countries: Country[];
};

export type FetchCountriesErrorAction = {
  type: typeof FETCH_COUNTRIES_ERROR;
  error: string;
};

export type SetCountriesFilter = {
  type: typeof SET_COUNTRIES_FILTER;
  countries: ImmutableArray<string>;
};

export type ToggleFiltersVisibilityAction = {
  type: typeof TOGGLE_FILTERS_VISIBILITY;
};

export type ObjectsActions =
  | InitializeSearchAction
  | SetFilterAction
  | IncreasePaginationAction
  | SetLibrariesAction
  | SetSofwareFiltersAction
  | SetTagFiltersAction
  | SetLodFiltersAction
  | SetClassifiationFiltersAction
  | SetClassifiationNodeFiltersAction
  | SetManufacturerFiltersAction
  | SetGroupFiltersAction
  | AddPropertyFilterAction
  | RemovePropertyFilterAction
  | SetPropertyFilterAction
  | SearchObjectsAction
  | SearchObjectsStartAction
  | SearchObjectsSuccessAction
  | SearchObjectsErrorAction
  | SetSelectedClassificationAction
  | SetSelectedNodeAction
  | ResetSearchAction
  | FetchBimObjectAction
  | FetchBimObjectSuccessAction
  | FetchBimObjectErrorAction
  | ToggleFiltersVisibilityAction
  | FetchCountriesAction
  | FetchCountriesSuccessAction
  | FetchCountriesErrorAction
  | SetCountriesFilter;

export enum SearchType {
  Object = 'bimobject',
}

export enum SearchSortingName {
  CreatedAt = 'CreatedAt',
  Relevance = '',
}
export enum SearchSortingOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export enum ContentManagementLibrary {
  Onfly = 'managementcloud-bimobject',
  User = 'personal-onfly',
  Platform = 'public-bimobject',
  Entity = 'entity-bimobject',
  Spaces = 'spaces',
}

export enum LanguageCode {
  French = 'fr',
  English = 'en',
  Deutch = 'de',
  Spanish = 'es',
  Italian = 'it',
  Portugese = 'pt',
}

export enum FilterProperty {
  Software = 'Softwares',
  Classification = 'Classifications.ClassificationId',
  ClassificationNode = 'Classifications.Id',
  Tag = 'Pins.Name_raw',
  Lod = 'Lod',
  Manufacturer = 'ManufacturerManagementCloud',
  Property = 'VariantProperties.Properties',
  Group = 'Groups',
  Countries = 'Countries',
}
export enum FilterAlias {
  Software = 'Softwares',
  Classification = 'Classifications',
  ClassificationNode = 'ClassificationsNodes',
  Tag = 'Pins',
  Lod = 'Lod',
  Manufacturer = 'Manufacturers',
  Property = 'Property',
  Group = 'Groups',
  Countries = 'Countries',
}

export enum ProcessResponseMode {
  Concat,
  Replace,
}

export type ValueContainerFilter = {
  Property: FilterProperty;
  PropertyId?: string;
  Alias: FilterAlias;
  Values: string[];
};
export type SearchContainerFilter = {
  ValueContainerFilter: ValueContainerFilter[];
};

export enum FilterKind {
  Value = 'Value',
}
export type SearchRequestStaticFilters = {
  [key: string]: SearchRequestStaticFilter;
};
export type SearchRequestStaticFilter = {
  Property: FilterProperty;
  PropertyId?: string;
  Kind: FilterKind;
};

export type SearchRequest = {
  Id: string;
  SearchType: SearchType;
  SearchValue: {
    Value: string;
  };
  SearchSorting: {
    Name: SearchSortingName;
    Order: SearchSortingOrder;
  };
  SearchPaging: {
    From: number;
    Size: number;
  };
  LanguageCode: LanguageCode;
  ContentManagementLibraries: ContentManagementLibrary[];
  SearchContainerFilter: SearchContainerFilter;
  StaticFilters: SearchRequestStaticFilters;
  IgnoreFacets?: boolean;
};

export type SearchResponseDocument = {
  Id: number;
  Name: string;
  BimScore: number;
  Description: string;
  CreatorName: string;
  Status?: string;
  GroupsList?: BimObjectGroup[];
};

export type BimObjectGroup = {
  Id: number;
  Name: string;
  IsFavorite: boolean;
  Type: GroupType;
};

export type StaticValueFilterItem = {
  Name: string;
  Value: string;
  Count: number;
  IsChecked: boolean;
};

export type StaticValueFilterGroupItem = StaticValueFilterItem & {
  IsFavorite: boolean;
  Type: GroupType;
};

export type StaticFilters = {
  Softwares?: StaticValueFilterItem[];
  Pins?: StaticValueFilterItem[];
  Lod?: StaticValueFilterItem[];
  Classifications?: StaticValueFilterItem[];
  Manufacturers?: StaticValueFilterItem[];
  Groups?: StaticValueFilterGroupItem[];
  Countries?: StaticValueFilterItem[];
  [key: string]: StaticValueFilterItem[];
};
export type SearchResponse = {
  Id: string;
  Total: number;
  Size: number;
  Documents: SearchResponseDocument[];
  StaticFilters: StaticFilters;
};

export type FormattedFilters = {
  Softwares: ImmutableArray<FormattedFilter>;
  Tags: ImmutableArray<FormattedFilter>;
  Lods: ImmutableArray<FormattedFilter>;
  Classifications: ImmutableArray<FormattedFilter>;
  ClassificationNodes: ImmutableArray<FormattedFilter>;
  Manufacturers: ImmutableArray<FormattedFilter>;
  Groups: ImmutableArray<FormattedGroupFilter>;
  Countries: ImmutableArray<FormattedFilter>;
};

export type FormattedFilter = {
  value: string;
  label: string;
  selected: boolean;
  count: number;
};

export type FormattedGroupFilter = FormattedFilter & {
  isFavorite: boolean;
  type: GroupType;
};

export type PropertyValue = {
  value: string;
  label: string;
  selected: boolean;
};
export type Property = {
  id: string;
  name: string;
  values: PropertyValue[];
  selected: boolean;
};

/* BimObject informations */
export type BimObject = {
  Id: number;
  CreatedAt: Date;
  UpdatedAt: Date;
  Name: string;
  Description: string;
  ObjectType: number;
  Status: string;
  StatusPC: typeof ObjectStatus;
  IsViewable: boolean;
  LanguagesAvaible: string[];
  ManufacturerTag?: ManufacturerTag;
  Manufacturer?: Manufacturer;
  ContentPartner?: ContentPartner;
};

type ManufacturerTag = {
  Id: number;
  Name: string;
};

type Manufacturer = {
  Id: number;
  Name: string;
  LogoPath: string;
};

type ContentPartner = {
  Id: number;
  Name: string;
  LogoPath: string;
};

export const ObjectStatus = {
  Published: 'published',
  Hidden: 'hidden',
  Deleted: 'deleted',
};

export type SearchObjectGroup = {
  id: number | null;
  type: GroupType;
  isFavorite: boolean;
};
