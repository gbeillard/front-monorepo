import { SortDirection } from '@bim-co/componentui-foundation';
import Immutable from 'seamless-immutable';
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
  NODES_DISPLAY,
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
  FETCH_CLASSIFICATION_SUCCESS,
  FETCH_CLASSIFICATION_ERROR,
  SET_LANGUAGE,
  UPDATE_CLASSIFICATION,
  DELETE_CLASSIFICATION,
  RESET_STATE,
  FETCH_CLASSIFICATIONS,
  FETCH_CLASSIFICATIONS_SUCCESS,
  FETCH_CLASSIFICATIONS_ERROR,
  SortOrderBy,
  SET_SORT,
  IClassification,
  IClassificationNode,
} from './types';

import {
  appendNodesToClassification,
  addNode,
  updateNode,
  moveNode,
  removeNode,
  updateSelectedNode,
  replaceClassification,
  removeClassification,
  TreeNode,
} from './utils';

const initialState = Immutable({
  api: {
    fetchClassifications: {
      payload: null,
      pending: false,
      error: null,
    },
    fetchClassification: {
      pending: false,
      error: null,
    },
    fetchNodes: {
      pending: false,
      error: null,
    },
    addNodeToClassification: {
      pending: false,
      error: null,
    },
    removeNodeFromClassification: {
      pending: false,
      error: null,
    },
    moveNode: {
      pending: false,
      error: null,
    },
  },
  classifications: [],
  classification: {},
  filter: '',
  sort: {
    orderBy: SortOrderBy.Name,
    direction: SortDirection.Asc,
  },
  nodesFilter: {
    displayed: '',
    debounced: '',
  },
  nodesDisplay: NODES_DISPLAY.EDIT,
  selectedNode: null,
  language: null,
});

const classificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CLASSIFICATION: {
      const index = state.classifications.findIndex(
        (existingClassification) => existingClassification.Id === action.classification.Id
      );
      return state.setIn(['classifications', index], action.classification);
    }

    case SET_CLASSIFICATIONS:
      return state.set('classifications', action.classifications);

    case SET_FILTER:
      return state.set('filter', action.filter);

    case SET_SORT:
      return state.set('sort', action.sort);

    case FETCH_CLASSIFICATIONS:
    case DEPRECATED_FETCH_CLASSIFICATIONS:
      return state
        .setIn(['api', 'fetchClassifications', 'payload'], action.payload)
        .setIn(['api', 'fetchClassifications', 'pending'], true)
        .setIn(['api', 'fetchClassifications', 'error'], null);

    case FETCH_CLASSIFICATIONS_SUCCESS:
    case DEPRECATED_FETCH_CLASSIFICATIONS_SUCCESS:
      return state
        .set('classifications', action.classifications)
        .setIn(['api', 'fetchClassifications', 'pending'], false)
        .setIn(['api', 'fetchClassifications', 'error'], null);

    case FETCH_CLASSIFICATIONS_ERROR:
    case DEPRECATED_FETCH_CLASSIFICATIONS_ERROR:
      return state
        .setIn(['api', 'fetchClassifications', 'pending'], false)
        .setIn(['api', 'fetchClassifications', 'error'], action.error);

    case FETCH_CLASSIFICATION:
      return state
        .setIn(['api', 'fetchClassification', 'pending'], true)
        .setIn(['api', 'fetchClassification', 'error'], null);

    case FETCH_CLASSIFICATION_SUCCESS:
      return state
        .set('classification', action.classification)
        .setIn(['api', 'fetchClassification', 'pending'], false)
        .setIn(['api', 'fetchClassification', 'error'], null);

    case FETCH_CLASSIFICATION_ERROR:
      return state
        .setIn(['api', 'fetchClassification', 'pending'], false)
        .setIn(['api', 'fetchClassification', 'error'], action.error);

    case UPDATE_CLASSIFICATION:
      return state
        .update('classifications', (classifications: IClassification[]) =>
          replaceClassification(classifications, action.classification as IClassification)
        )
        .set('classification', action.classification);

    case DELETE_CLASSIFICATION:
      return state
        .update('classifications', (classifications: IClassification[]) =>
          removeClassification(classifications, action.classification as IClassification)
        )
        .set('classification', null);

    case SET_CLASSIFICATION_ID:
      return state.setIn(['classification', 'id'], action.id);

    case FETCH_NODES:
      return state.setIn(['api', 'fetchNodes', 'pending'], true);

    case FETCH_NODES_SUCCESS:
      return state
        .update('classifications', (classifications: IClassification[]) =>
          appendNodesToClassification(
            classifications,
            action.nodes as TreeNode[],
            action.classificationId as number
          )
        )
        .update('selectedNode', (selectedNode: IClassificationNode) =>
          updateSelectedNode(selectedNode, action.nodes as IClassificationNode[])
        )
        .setIn(['classification', 'nodes'], action.nodes)
        .setIn(['api', 'fetchNodes', 'pending'], false);

    case FETCH_NODES_ERROR:
      return state
        .setIn(['api', 'fetchNodes', 'error'], action.error)
        .setIn(['api', 'fetchNodes', 'pending'], false);

    case SET_NODES:
      return state.setIn(['classification', 'nodes'], action.nodes);

    case UPDATE_NODE:
      return state
        .updateIn(['classification', 'nodes'], (nodes: IClassificationNode[]) =>
          updateNode(nodes, action.node as IClassificationNode)
        )
        .set('selectedNode', action.node)
        .setIn(['api', 'fetchNodes', 'pending'], true);

    case UPDATE_NODE_SUCCESS:
      return state
        .setIn(['api', 'fetchNodes', 'error'], null)
        .setIn(['api', 'fetchNodes', 'pending'], false);

    case UPDATE_NODE_ERROR:
      return state
        .setIn(['api', 'fetchNodes', 'error'], action.error)
        .setIn(['api', 'fetchNodes', 'pending'], false);

    case SET_NODES_FILTER:
      return state.setIn(['nodesFilter', 'displayed'], action.nodesFilter);

    case SET_NODES_FILTER_SUCCESS:
      return state
        .setIn(['nodesFilter', 'debounced'], action.nodesFilter)
        .set('nodesDisplay', NODES_DISPLAY.FILTER);

    case SET_NODES_DISPLAY:
      return state.set('nodesDisplay', action.nodesDisplay);

    case SELECT_NODE:
      return state
        .set('selectedNode', action.node)
        .setIn(['nodesFilter', 'displayed'], '')
        .setIn(['nodesFilter', 'debounced'], '')
        .set('nodesDisplay', NODES_DISPLAY.EDIT);

    case ADD_NODE_TO_CLASSIFICATION:
      return state
        .updateIn(['classification', 'nodes'], (nodes: IClassificationNode[]) =>
          addNode(nodes, action.nodeId as number, action.node as IClassificationNode)
        )
        .setIn(['api', 'addNodeToClassification', 'pending'], true);

    case ADD_NODE_TO_CLASSIFICATION_SUCCESS:
      return state.setIn(['api', 'addNodeToClassification', 'pending'], false);

    case ADD_NODE_TO_CLASSIFICATION_ERROR:
      return state
        .setIn(['api', 'addNodeToClassification', 'error'], action.error)
        .setIn(['api', 'addNodeToClassification', 'pending'], false);

    case REMOVE_NODE_FROM_CLASSIFICATION:
      return state
        .updateIn(['classification', 'nodes'], (nodes: IClassificationNode[]) =>
          removeNode(nodes, action.node as IClassificationNode)
        )
        .setIn(['api', 'removeNodeFromClassification', 'pending'], true)
        .update('selectedNode', (selectedNode) =>
          selectedNode.Id === action.node.Id ? null : selectedNode
        );

    case REMOVE_NODE_FROM_CLASSIFICATION_SUCCESS:
      return state.setIn(['api', 'removeNodeFromClassification', 'pending'], false);

    case REMOVE_NODE_FROM_CLASSIFICATION_ERROR:
      return state
        .setIn(['api', 'removeNodeFromClassification', 'error'], action.error)
        .setIn(['api', 'removeNodeFromClassification', 'pending'], false);

    case MOVE_NODE:
      return state
        .updateIn(['classification', 'nodes'], (nodes: IClassificationNode[]) =>
          moveNode(nodes, action.target as IClassificationNode, action.node as IClassificationNode)
        )
        .setIn(['api', 'moveNode', 'pending'], true);

    case MOVE_NODE_SUCCESS:
      return state.setIn(['api', 'moveNode', 'pending'], false);

    case MOVE_NODE_ERROR:
      return state
        .setIn(['api', 'moveNode', 'error'], action.error)
        .setIn(['api', 'moveNode', 'pending'], false);

    case SET_LANGUAGE:
      return state.set('language', action.language);

    case RESET_STATE:
      return initialState;

    default:
      return state;
  }
};

export default classificationsReducer;