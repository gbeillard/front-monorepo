import { IClassificationColor, SortDirection } from '@bim-co/componentui-foundation';

export const SET_CLASSIFICATION = 'CLASSIFICATIONS/SET_CLASSIFICATION';
export const SET_CLASSIFICATIONS = 'CLASSIFICATIONS/SET_CLASSIFICATIONS';

export const SET_SORT = 'CLASSIFICATIONS/SET_SORT';
export const SET_FILTER = 'CLASSIFICATIONS/SET_FILTER';

export const FETCH_CLASSIFICATION = 'CLASSIFICATIONS/FETCH_CLASSIFICATION';
export const FETCH_CLASSIFICATION_SUCCESS = 'CLASSIFICATIONS/FETCH_CLASSIFICATION_SUCCESS';
export const FETCH_CLASSIFICATION_ERROR = 'CLASSIFICATIONS/FETCH_CLASSIFICATION_ERROR';

export const DEPRECATED_FETCH_CLASSIFICATIONS = 'CLASSIFICATIONS/DEPRECATED_FETCH_CLASSIFICATIONS';
export const DEPRECATED_FETCH_CLASSIFICATIONS_SUCCESS =
  'CLASSIFICATIONS/DEPRECATED_FETCH_CLASSIFICATIONS_SUCCESS';
export const DEPRECATED_FETCH_CLASSIFICATIONS_ERROR =
  'CLASSIFICATIONS/DEPRECATED_FETCH_CLASSIFICATIONS_ERROR';

export const FETCH_CLASSIFICATIONS = 'CLASSIFICATIONS/FETCH_CLASSIFICATIONS';
export const FETCH_CLASSIFICATIONS_SUCCESS = 'CLASSIFICATIONS/FETCH_CLASSIFICATIONS_SUCCESS';
export const FETCH_CLASSIFICATIONS_ERROR = 'CLASSIFICATIONS/FETCH_CLASSIFICATIONS_ERROR';

export const CREATE_CLASSIFICATION = 'CLASSIFICATIONS/CREATE_CLASSIFICATION';
export const CREATE_CLASSIFICATION_SUCCESS = 'CLASSIFICATIONS/CREATE_CLASSIFICATION_SUCCESS';
export const CREATE_CLASSIFICATION_ERROR = 'CLASSIFICATIONS/CREATE_CLASSIFICATION_ERROR';

export const UPDATE_CLASSIFICATION = 'CLASSIFICATIONS/UPDATE_CLASSIFICATION';
export const UPDATE_CLASSIFICATION_SUCCESS = 'CLASSIFICATIONS/UPDATE_CLASSIFICATION_SUCCESS';
export const UPDATE_CLASSIFICATION_ERROR = 'CLASSIFICATIONS/UPDATE_CLASSIFICATION_ERROR';

export const DELETE_CLASSIFICATION = 'CLASSIFICATIONS/DELETE_CLASSIFICATION';
export const DELETE_CLASSIFICATION_SUCCESS = 'CLASSIFICATIONS/DELETE_CLASSIFICATION_SUCCESS';
export const DELETE_CLASSIFICATION_ERROR = 'CLASSIFICATIONS/DELETE_CLASSIFICATION_ERROR';

export const SET_CLASSIFICATION_ID = 'CLASSIFICATIONS/SET_CLASSIFICATION_ID';
export const FETCH_NODES = 'CLASSIFICATIONS/FETCH_NODES';
export const FETCH_NODES_SUCCESS = 'CLASSIFICATIONS/FETCH_NODES_SUCCESS';
export const FETCH_NODES_ERROR = 'CLASSIFICATIONS/FETCH_NODES_ERROR';

export const SET_NODES = 'CLASSIFICATIONS/SET_NODES';
export const SET_NODES_FILTER = 'CLASSIFICATIONS/SET_NODES_FILTER';
export const SET_NODES_FILTER_SUCCESS = 'CLASSIFICATIONS/SET_NODES_FILTER_SUCCESS';
export const SET_NODES_DISPLAY = 'CLASSIFICATIONS/SET_NODES_DISPLAY';
export const SELECT_NODE = 'CLASSIFICATIONS/SELECT_NODE';

export const ADD_NODE_TO_CLASSIFICATION = 'CLASSIFICATIONS/ADD_NODE_TO_CLASSIFICATION';
export const ADD_NODE_TO_CLASSIFICATION_SUCCESS =
  'CLASSIFICATIONS/ADD_NODE_TO_CLASSIFICATION_SUCCESS';
export const ADD_NODE_TO_CLASSIFICATION_ERROR = 'CLASSIFICATIONS/ADD_NODE_TO_CLASSIFICATION_ERROR';

export const REMOVE_NODE_FROM_CLASSIFICATION = 'CLASSIFICATIONS/REMOVE_NODE_FROM_CLASSIFICATION';
export const REMOVE_NODE_FROM_CLASSIFICATION_SUCCESS =
  'CLASSIFICATIONS/REMOVE_NODE_FROM_CLASSIFICATION_SUCCESS';
export const REMOVE_NODE_FROM_CLASSIFICATION_ERROR =
  'CLASSIFICATIONS/REMOVE_NODE_FROM_CLASSIFICATION_ERROR';

export const MOVE_NODE = 'CLASSIFICATIONS/MOVE_NODE';
export const MOVE_NODE_SUCCESS = 'CLASSIFICATIONS/MOVE_NODE_SUCCESS';
export const MOVE_NODE_ERROR = 'CLASSIFICATIONS/MOVE_NODE_ERROR';

export const UPDATE_NODE = 'CLASSIFICATIONS/UPDATE_NODE';
export const UPDATE_NODE_SUCCESS = 'CLASSIFICATIONS/UPDATE_NODE_SUCCESS';
export const UPDATE_NODE_ERROR = 'CLASSIFICATIONS/UPDATE_NODE_ERROR';

export const SET_LANGUAGE = 'CLASSIFICATIONS/SET_LANGUAGE';

export const RESET_STATE = 'CLASSIFICATIONS/RESET_STATE';

export const NODES_DISPLAY = {
  EDIT: 'NODES_DISPLAY/EDIT',
  FILTER: 'NODES_DISPLAY/FILTER',
};

export enum SortOrderBy {
  Name,
  Origin,
  Version,
  SortedObjects,
  Visibility,
}
export type ClassificationsSort = {
  orderBy: SortOrderBy;
  direction: SortDirection;
};
export type SetSortAction = {
  type: typeof SET_SORT;
  sort: ClassificationsSort;
};

export type FetchClassificationsAction = {
  type: typeof FETCH_CLASSIFICATIONS;
};
export type FetchClassificationsSuccessAction = {
  type: typeof FETCH_CLASSIFICATIONS_SUCCESS;
  classifications: IClassification[];
};
export type FetchClassificationsErrorAction = {
  type: typeof FETCH_CLASSIFICATIONS_ERROR;
  error: string;
};

export type Deprecated_IClassification = {
  Classification: number;
  ColorCode?: string;
  IsPrivate?: boolean;
  Name: string;
};

export type Deprecated_IClassificationNode = {
  Id: string;
  Name: string;
  Children: Deprecated_IClassificationNode[];
  color?: IClassificationColor;
  hasResults?: boolean;
};

export type IClassificationPropertyPostExisting = {
  Id: number;
};

export type IClassificationPropertyPostNew = {
  Name: string;
  Description: string;
};

export type IClassificationPropertyPost =
  | IClassificationPropertyPostExisting
  | IClassificationPropertyPostNew;

export type IClassificationPost = {
  Name: string;
  Description: string;
  Version: string;
  ColorCode: string;
  IsMandatory: boolean;
  NameProperty: IClassificationPropertyPost;
  CodeProperty: IClassificationPropertyPost;
};

export type IClassificationProperty = {
  Id: number;
  Name: string;
  Description: string;
};

export type IClassification = {
  Id: number;
  Name: string;
  Description: string;
  IsAutomaticTranslate: boolean;
  Version?: string;
  ColorCode?: string;
  IsBimAndCo: boolean;
  IsPrivate: boolean;
  IsMandatory: boolean;
  IsEnabled?: boolean;
  Statistics: {
    ObjectsAssignedPercentage: number;
  };
  CreatedAt: Date;
  UpdatedAt: Date;
  NameProperty: IClassificationProperty;
  CodeProperty: IClassificationProperty;
};

export type IClassificationNode = {
  Id: number;
  Code: string;
  Name: string;
  Description: string;
  ParentId: number;
  IfcExportAsId: null;
  IfcExportTypeId: null;
  CaoCategory: null;
  Children: IClassificationNode[];
  selected?: boolean;
  hasResults?: boolean;
};