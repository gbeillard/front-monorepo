import { Subset } from '../../Sets/Subsets/types';

export type NodeProperty = {
  Id: number;
  Name: string;
  Domain: PropertyDomain;
  DefaultUnit?: Unit;
  Subsets: Subset[];
  IsMandatoryGeneric: boolean;
  IsMandatoryManufacturer: boolean;
};
export type PropertyDomain = {
  Id: number;
  Name: string;
};
export type Filter = {
  text: string;
  setId: number;
  domainId: number;
};
export type Unit = {
  Id: number;
  Name: string;
  Symbol: string;
};

export type FetchPropertiesAction = {
  type: typeof FETCH_PROPERTIES;
  classificationId: number;
  nodeId: number;
};
export type FetchPropertiesSuccessAction = {
  type: typeof FETCH_PROPERTIES_SUCCESS;
  properties: NodeProperty[];
};
export type FetchPropertiesErrorAction = {
  type: typeof FETCH_PROPERTIES_ERROR;
  error: string;
};

export type AddPropertiesAction = {
  type: typeof ADD_PROPERTIES;
  classificationId: number;
  nodeId: number;
  properties: NodeProperty[];
};

export type AddPropertiesSuccessAction = {
  type: typeof ADD_PROPERTIES_SUCCESS;
};

export type AddPropertiesErrorAction = {
  type: typeof ADD_PROPERTIES_ERROR;
  error: string;
};

export type UpdatePropertyAction = {
  type: typeof UPDATE_PROPERTY;
  classificationId: number;
  nodeId: number;
  property: NodeProperty;
};

export type UpdatePropertySuccessAction = {
  type: typeof UPDATE_PROPERTY_SUCCESS;
};

export type UpdatePropertyErrorAction = {
  type: typeof UPDATE_PROPERTY_ERROR;
  error: string;
};

export type DeletePropertyAction = {
  type: typeof DELETE_PROPERTY;
  classificationId: number;
  nodeId: number;
  property: NodeProperty;
  keepPropertiesWithValue: boolean;
};

export type DeletePropertySuccessAction = {
  type: typeof DELETE_PROPERTY_SUCCESS;
};

export type DeletePropertyErrorAction = {
  type: typeof DELETE_PROPERTY_ERROR;
  error: string;
};

export type SetFilterAction = {
  type: typeof SET_FILTER;
  filter: Filter;
};

export type NodePropertyActions =
  | FetchPropertiesAction
  | FetchPropertiesSuccessAction
  | FetchPropertiesErrorAction
  | AddPropertiesAction
  | AddPropertiesSuccessAction
  | AddPropertiesErrorAction
  | UpdatePropertyAction
  | UpdatePropertySuccessAction
  | UpdatePropertyErrorAction
  | DeletePropertyAction
  | DeletePropertySuccessAction
  | DeletePropertyErrorAction
  | SetFilterAction;

// get properties details
export const FETCH_PROPERTIES = 'CLASSIFICATIONS/PROPERTIES/FETCH_PROPERTIES';
export const FETCH_PROPERTIES_SUCCESS = 'CLASSIFICATIONS/PROPERTIES/FETCH_PROPERTIES_SUCCESS';
export const FETCH_PROPERTIES_ERROR = 'CLASSIFICATIONS/PROPERTIES/FETCH_PROPERTIES_ERROR';

export const ADD_PROPERTIES = 'CLASSIFICATIONS/PROPERTIES/ADD_PROPERTIES';
export const ADD_PROPERTIES_SUCCESS = 'CLASSIFICATIONS/PROPERTIES/ADD_PROPERTIES_SUCCESS';
export const ADD_PROPERTIES_ERROR = 'CLASSIFICATIONS/PROPERTIES/ADD_PROPERTIES_ERROR';

export const UPDATE_PROPERTY = 'CLASSIFICATIONS/PROPERTIES/UPDATE_PROPERTY';
export const UPDATE_PROPERTY_SUCCESS = 'CLASSIFICATIONS/PROPERTIES/UPDATE_PROPERTY_SUCCESS';
export const UPDATE_PROPERTY_ERROR = 'CLASSIFICATIONS/PROPERTIES/UPDATE_PROPERTY_ERROR';

// delete current property
export const DELETE_PROPERTY = 'CLASSIFICATIONS/PROPERTIES/DELETE_PROPERTY';
export const DELETE_PROPERTY_SUCCESS = 'CLASSIFICATIONS/PROPERTIES/DELETE_PROPERTY_SUCCESS';
export const DELETE_PROPERTY_ERROR = 'CLASSIFICATIONS/PROPERTIES/DELETE_PROPERTY_ERROR';

// update current node properties
export const UPDATE_PROPERTIES = 'CLASSIFICATIONS/PROPERTIES/UPDATE_PROPERTIES';
export const UPDATE_PROPERTIES_SUCCESS = 'CLASSIFICATIONS/PROPERTIES/UPDATE_PROPERTIES_SUCCESS';
export const UPDATE_PROPERTIES_ERROR = 'CLASSIFICATIONS/PROPERTIES/UPDATE_PROPERTIES_ERROR';

export const SET_FILTER = 'CLASSIFICATIONS/PROPERTIES/SET_FILTER';