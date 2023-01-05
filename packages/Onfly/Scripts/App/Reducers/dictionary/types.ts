import { Nature } from '../properties/constants';

export const FETCH_DICTIONARY = 'DICTIONARY/FETCH_DICTIONARY';
export const FETCH_DICTIONARY_SUCCESS = 'DICTIONARY/FETCH_DICTIONARY_SUCCESS';
export const FETCH_DICTIONARY_ERROR = 'DICTIONARY/FETCH_DICTIONARY_ERROR';
export const SET_FILTER = 'DICTIONARY/SET_FILTER';
export const SET_SORTBY = 'DICTIONARY/SET_SORTBY';
export const SET_SORTORDER = 'DICTIONARY/SET_SORTORDER';
export const INCREASE_VISIBLE_COUNT = 'DICTIONARY/INCREASE_VISIBLE_COUNT';
export const SELECT_ALL_PROPERTIES = 'DICTIONARY/SELECT_ALL_PROPERTIES';
export const SELECT_PROPERTY = 'DICTIONARY/SELECT_PROPERTY';

export const ADD_OFFICIAL_PROPERTIES = 'DICTIONARY/ADD_OFFICIAL_PROPERTIES';
export const ADD_OFFICIAL_PROPERTIES_SUCCESS = 'DICTIONARY/ADD_OFFICIAL_PROPERTIES_SUCCESS';
export const ADD_OFFICIAL_PROPERTIES_ERROR = 'DICTIONARY/ADD_OFFICIAL_PROPERTIES_ERROR';

export const DUPLICATE_PROPERTY = 'DICTIONARY/DUPLICATE_PROPERTY';
export const DUPLICATE_PROPERTY_SUCCESS = 'DICTIONARY/DUPLICATE_PROPERTY_SUCCESS';
export const DUPLICATE_PROPERTY_ERROR = 'DICTIONARY/DUPLICATE_PROPERTY_ERROR';

export type Property = {
  Id: number;
  Name: string;
  Description: string;
  DomainId: number;
  DomainCode: string;
  DomainName: string;
  DomainDescription: string;
  UnitName: string;
  EditTypeName: string;
  DataTypeName: string;
  IsDeleted: boolean;
  EditTypeId: number;
  DataTypeId: number;
  UnitId: number;
  ParameterTypeId: number;
  Nature: Nature;
  selected: boolean;
};

export type OfficialProperty = {
  propertyId: number;
  propertyLangs: OfficialPropertyLang[];
};

export type OfficialPropertyLang = {
  langCode: string;
  langName: string;
  isDefaultLang: boolean;
};

export type DuplicatedProperty = {
  PropertyId: number;
  PropertyDomainCode: number;
  PropertyUnitCode: number;
  PropertyDataTypeCode: number;
  PropertyEditTypeCode: number;
  PropertyParameterType: number;
  IsAuthorisedToEdit: boolean;
  RequestComment: string;
  RequestResponse: string;
  RequestState: string;
  MappedPropId?: number;
  Translations: DuplicatedPropertyTranslation[];
  Nature: Nature;
  IsBimAndCoProperty: boolean;
};

export type DuplicatedPropertyTranslation = {
  TranslationId: number;
  TranslationLangCode: string;
  PropertyName: string;
  PropertyDescription: string;
  PropertyInformations: string;
  IsDefaultTranslation: boolean;
  PropertyEditTypeValues: string;
};

export type FetchDictionaryAction = {
  type: typeof FETCH_DICTIONARY;
};

export type FetchDictionarySuccessAction = {
  type: typeof FETCH_DICTIONARY_SUCCESS;
  properties: Property[];
};

export type FetchDictionaryErrorAction = {
  type: typeof FETCH_DICTIONARY_ERROR;
  error: string;
};

export type SetFilterAction = {
  type: typeof SET_FILTER;
  filter: string;
};

export type SetSortByAction = {
  type: typeof SET_SORTBY;
  sortBy: string;
};

export type SetSortOrderAction = {
  type: typeof SET_SORTORDER;
  sortOrder: string;
};

export type IncreaseVisibleCountAction = {
  type: typeof INCREASE_VISIBLE_COUNT;
};

export type ToggleSelectAllPropertiesAction = {
  type: typeof SELECT_ALL_PROPERTIES;
  selected: boolean;
};

export type ToggleSelectPropertyAction = {
  type: typeof SELECT_PROPERTY;
  Id: number;
};

export type AddOfficialPropertiesAction = {
  type: typeof ADD_OFFICIAL_PROPERTIES;
  properties: Property[];
};

export type AddOfficialPropertiesSuccessAction = {
  type: typeof ADD_OFFICIAL_PROPERTIES_SUCCESS;
};

export type AddOfficialPropertiesErrorAction = {
  type: typeof ADD_OFFICIAL_PROPERTIES_ERROR;
  error: Error;
};

export type DuplicatePropertyAction = {
  type: typeof DUPLICATE_PROPERTY;
  property: DuplicatedProperty;
};

export type DuplicatePropertySuccessAction = {
  type: typeof DUPLICATE_PROPERTY_SUCCESS;
};

export type DuplicatePropertyErrorAction = {
  type: typeof DUPLICATE_PROPERTY_ERROR;
  error: Error;
};

export type DictionaryActions =
  | FetchDictionaryAction
  | FetchDictionarySuccessAction
  | FetchDictionaryErrorAction
  | SetFilterAction
  | SetSortByAction
  | SetSortOrderAction
  | IncreaseVisibleCountAction
  | ToggleSelectPropertyAction
  | ToggleSelectAllPropertiesAction
  | AddOfficialPropertiesAction
  | AddOfficialPropertiesSuccessAction
  | AddOfficialPropertiesErrorAction
  | DuplicatePropertyAction
  | DuplicatePropertySuccessAction
  | DuplicatePropertyErrorAction;