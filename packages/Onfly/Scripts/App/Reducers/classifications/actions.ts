import {
  SET_CLASSIFICATION,
  SET_CLASSIFICATIONS,
  SET_FILTER,
  FETCH_NODES,
  FETCH_NODES_SUCCESS,
  FETCH_NODES_ERROR,
  SET_NODES,
  UPDATE_NODE,
  UPDATE_NODE_SUCCESS,
  UPDATE_NODE_ERROR,
  SET_NODES_FILTER,
  SET_NODES_DISPLAY,
  SELECT_NODE,
  DEPRECATED_FETCH_CLASSIFICATIONS,
  DEPRECATED_FETCH_CLASSIFICATIONS_SUCCESS,
  DEPRECATED_FETCH_CLASSIFICATIONS_ERROR,
  SET_CLASSIFICATION_ID,
  SET_NODES_FILTER_SUCCESS,
  REMOVE_NODE_FROM_CLASSIFICATION,
  REMOVE_NODE_FROM_CLASSIFICATION_SUCCESS,
  REMOVE_NODE_FROM_CLASSIFICATION_ERROR,
  ADD_NODE_TO_CLASSIFICATION,
  ADD_NODE_TO_CLASSIFICATION_SUCCESS,
  ADD_NODE_TO_CLASSIFICATION_ERROR,
  MOVE_NODE,
  MOVE_NODE_SUCCESS,
  MOVE_NODE_ERROR,
  FETCH_CLASSIFICATION,
  IClassification,
  FETCH_CLASSIFICATION_SUCCESS,
  FETCH_CLASSIFICATION_ERROR,
  IClassificationNode,
  SET_LANGUAGE,
  UPDATE_CLASSIFICATION,
  UPDATE_CLASSIFICATION_SUCCESS,
  UPDATE_CLASSIFICATION_ERROR,
  DELETE_CLASSIFICATION,
  DELETE_CLASSIFICATION_SUCCESS,
  DELETE_CLASSIFICATION_ERROR,
  RESET_STATE,
  FetchClassificationsAction,
  FETCH_CLASSIFICATIONS,
  FETCH_CLASSIFICATIONS_SUCCESS,
  FetchClassificationsSuccessAction,
  FetchClassificationsErrorAction,
  FETCH_CLASSIFICATIONS_ERROR,
  ClassificationsSort,
  SetSortAction,
  SET_SORT,
} from './types';

export const setClassification = (classification) => ({
  type: SET_CLASSIFICATION,
  classification,
});

export const setClassifications = (classifications) => ({
  type: SET_CLASSIFICATIONS,
  classifications,
});
export const setSort = (sort: ClassificationsSort): SetSortAction => ({
  type: SET_SORT,
  sort,
});
export const setFilter = (filter) => ({
  type: SET_FILTER,
  filter,
});

export const deprecatedFetchClassifications = () => ({
  type: DEPRECATED_FETCH_CLASSIFICATIONS,
});

export const deprecatedFetchClassificationsSuccess = (classifications) => ({
  type: DEPRECATED_FETCH_CLASSIFICATIONS_SUCCESS,
  classifications,
});

export const deprecatedFetchClassificationsError = (error) => ({
  type: DEPRECATED_FETCH_CLASSIFICATIONS_ERROR,
  error,
});

export const fetchClassifications = (): FetchClassificationsAction => ({
  type: FETCH_CLASSIFICATIONS,
});
export const fetchClassificationsSuccess = (
  classifications: IClassification[]
): FetchClassificationsSuccessAction => ({
  type: FETCH_CLASSIFICATIONS_SUCCESS,
  classifications,
});
export const fetchClassificationsError = (error: string): FetchClassificationsErrorAction => ({
  type: FETCH_CLASSIFICATIONS_ERROR,
  error,
});

export const fetchClassification = (id: number) => ({
  type: FETCH_CLASSIFICATION,
  id,
});

export const fetchClassificationSuccess = (classification: IClassification) => ({
  type: FETCH_CLASSIFICATION_SUCCESS,
  classification,
});

export const fetchClassificationError = (error: string) => ({
  type: FETCH_CLASSIFICATION_ERROR,
  error,
});

export const updateClassification = (classification: IClassification) => ({
  type: UPDATE_CLASSIFICATION,
  classification,
});

export const updateClassificationSuccess = () => ({
  type: UPDATE_CLASSIFICATION_SUCCESS,
});

export const updateClassificationError = (error: string) => ({
  type: UPDATE_CLASSIFICATION_ERROR,
  error,
});

export const deleteClassification = (
  classification: IClassification,
  keepPropertiesWithValue: boolean
) => ({
  type: DELETE_CLASSIFICATION,
  classification,
  keepPropertiesWithValue,
});

export const deleteClassificationSuccess = () => ({
  type: DELETE_CLASSIFICATION_SUCCESS,
});

export const deleteClassificationError = (error: string) => ({
  type: DELETE_CLASSIFICATION_ERROR,
  error,
});

export const setClassificationId = (id) => ({
  type: SET_CLASSIFICATION_ID,
  id,
});

export const fetchNodes = (classificationId) => ({
  type: FETCH_NODES,
  classificationId,
});

export const fetchNodesSuccess = (classificationId, nodes) => ({
  type: FETCH_NODES_SUCCESS,
  classificationId,
  nodes,
});

export const fetchNodesError = (error) => ({
  type: FETCH_NODES_ERROR,
  error,
});

export const setNodes = (nodes) => ({
  type: SET_NODES,
  nodes,
});

export const setNodesFilter = (nodesFilter) => ({
  type: SET_NODES_FILTER,
  nodesFilter,
});

export const setNodesFilterSuccess = (nodesFilter) => ({
  type: SET_NODES_FILTER_SUCCESS,
  nodesFilter,
});

export const setNodesDisplay = (nodesDisplay) => ({
  type: SET_NODES_DISPLAY,
  nodesDisplay,
});

export const selectNode = (node) => ({
  type: SELECT_NODE,
  node,
});

export const removeNodeFromClassification = (classificationId, node, keepPropertiesWithValue) => ({
  type: REMOVE_NODE_FROM_CLASSIFICATION,
  classificationId,
  node,
  keepPropertiesWithValue,
});

export const removeNodeFromClassificationSuccess = () => ({
  type: REMOVE_NODE_FROM_CLASSIFICATION_SUCCESS,
});

export const removeNodeFromClassificationError = (error) => ({
  type: REMOVE_NODE_FROM_CLASSIFICATION_ERROR,
  error,
});

export const addNodeToClassification = (classificationId, nodeId, node) => ({
  type: ADD_NODE_TO_CLASSIFICATION,
  classificationId,
  nodeId,
  node,
});

export const addNodeToClassificationSuccess = () => ({
  type: ADD_NODE_TO_CLASSIFICATION_SUCCESS,
});

export const addNodeToClassificationError = (error) => ({
  type: ADD_NODE_TO_CLASSIFICATION_ERROR,
  error,
});

export const moveNode = (classificationId, target, node) => ({
  type: MOVE_NODE,
  classificationId,
  target,
  node,
});

export const moveNodeSuccess = () => ({
  type: MOVE_NODE_SUCCESS,
});

export const moveNodeError = (error) => ({
  type: MOVE_NODE_ERROR,
  error,
});

// update current node
export const updateNode = (classificationId: number, node: IClassificationNode) => ({
  type: UPDATE_NODE,
  classificationId,
  node,
});
export const updateNodeSuccess = () => ({
  type: UPDATE_NODE_SUCCESS,
});
export const updateNodeError = (error: string) => ({
  type: UPDATE_NODE_ERROR,
  error,
});
export const setLanguage = (language) => ({
  type: SET_LANGUAGE,
  language,
});

export const resetState = () => ({
  type: RESET_STATE,
});