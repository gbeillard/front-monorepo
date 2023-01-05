import { Subset } from '../../Sets/Subsets/types';

export const FETCH_PROPERTIES = 'BIMOBJECT/PROPERTIES/FETCH_PROPERTIES';
export const FETCH_PROPERTIES_SUCCESS = 'BIMOBJECT/PROPERTIES/FETCH_PROPERTIES_SUCCESS';
export const FETCH_PROPERTIES_ERROR = 'BIMOBJECT/PROPERTIES/FETCH_PROPERTIES_ERROR';

export const SET_FILTER = 'BIMOBJECT/PROPERTIES/SET_FILTER';

export const DELETE_PROPERTY = 'BIMOBJECT/PROPERTIES/DELETE_PROPERTY';
export const DELETE_PROPERTY_SUCCESS = 'BIMOBJECT/PROPERTIES/DELETE_PROPERTY_SUCCESS';
export const DELETE_PROPERTY_ERROR = 'BIMOBJECT/PROPERTIES/DELETE_PROPERTY_ERROR';

export const ADD_PROPERTIES = 'BIMOBJECT/PROPERTIES/ADD_PROPERTIES';
export const ADD_PROPERTIES_SUCCESS = 'BIMOBJECT/PROPERTIES/ADD_PROPERTIES_SUCCESS';
export const ADD_PROPERTIES_ERROR = 'BIMOBJECT/PROPERTIES/ADD_PROPERTIES_ERROR';

export type Filter = {
  text: string;
  setId: number;
  domainId: number;
};

/* Models */

export type Property = {
  Id: number;
  Name: string;
  Description?: string;
  Domain?: Domain;
  DefaultUnit?: Unit;
  Subsets?: Subset[];
  CanBeDeleted: boolean;
};

export type Domain = {
  Id: number;
  Name: string;
};

export type Unit = {
  Id: number;
  Symbol: string;
};

/* Actions */
export type FetchPropertiesAction = {
  type: typeof FETCH_PROPERTIES;
  bimObjectId: number;
};

export type FetchPropertiesSuccessAction = {
  type: typeof FETCH_PROPERTIES_SUCCESS;
  properties: Property[];
};

export type FetchPropertiesErrorAction = {
  type: typeof FETCH_PROPERTIES_ERROR;
  error: string;
};

export type SetFilterAction = {
  type: typeof SET_FILTER;
  filter: Filter;
};

export type DeletePropertyAction = {
  type: typeof DELETE_PROPERTY;
  bimObjectId: number;
  propertyId: number;
};

export type DeletePropertySuccessAction = {
  type: typeof DELETE_PROPERTY_SUCCESS;
};

export type DeletePropertyErrorAction = {
  type: typeof DELETE_PROPERTY_ERROR;
  error: string;
};

export type AddPropertiesAction = {
  type: typeof ADD_PROPERTIES;
  bimObjectId: number;
  properties: Property[];
};

export type AddPropertiesSuccessAction = {
  type: typeof ADD_PROPERTIES_SUCCESS;
};

export type AddPropertiesErrorAction = {
  type: typeof ADD_PROPERTIES_ERROR;
  error: string;
};

export type PropertiesActions =
  | FetchPropertiesAction
  | FetchPropertiesSuccessAction
  | FetchPropertiesErrorAction
  | SetFilterAction
  | DeletePropertyAction
  | DeletePropertySuccessAction
  | DeletePropertyErrorAction
  | AddPropertiesAction
  | AddPropertiesSuccessAction
  | AddPropertiesErrorAction;