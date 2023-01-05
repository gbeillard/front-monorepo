import Immutable from 'seamless-immutable';

import {
  SubsetsActions,
  Subset,
  CreateSubsetSuccess,
  FETCH_SUBSETS,
  FETCH_SUBSETS_SUCCESS,
  FETCH_SUBSETS_ERROR,
  FETCH_ALL_SUBSETS,
  FETCH_ALL_SUBSETS_SUCCESS,
  FETCH_ALL_SUBSETS_ERROR,
  CREATE_SUBSET,
  CREATE_SUBSET_SUCCESS,
  CREATE_SUBSET_ERROR,
  ADD_SUBSET_PROPERTIES,
  ADD_SUBSET_PROPERTIES_SUCCESS,
  ADD_SUBSET_PROPERTIES_ERROR,
  DELETE_SUBSET_PROPERTIES,
  DELETE_SUBSET_PROPERTIES_SUCCESS,
  DELETE_SUBSET_PROPERTIES_ERROR,
  EDIT_SUBSETS,
  ADD_SUBSETS,
  SET_FILTER_SET,
  SET_FILTER_TEXT,
  UPDATE_SUBSET_TWO_D_MODEL_REFERENCE,
  UPDATE_SUBSET_TWO_D_MODEL_REFERENCE_SUCCESS,
  UPDATE_SUBSET_TWO_D_MODEL_REFERENCE_ERROR,
  UPDATE_SUBSET_THREE_D_MODEL_REFERENCE,
  UPDATE_SUBSET_THREE_D_MODEL_REFERENCE_SUCCESS,
  UPDATE_SUBSET_THREE_D_MODEL_REFERENCE_ERROR,
} from './types';

import { Set } from '../../properties-sets/types';

import { addSubsets, editSubsets } from './utils';

export const baseState = {
  api: {
    fetchSubsets: {
      pending: false,
      success: false,
      error: undefined,
    },
    fetchAllSubsets: {
      pending: false,
      success: false,
      error: undefined,
    },
    createSubset: {
      pending: false,
      success: undefined as CreateSubsetSuccess,
      error: undefined,
    },
    addSubsetProperties: {
      pending: false,
      success: false,
      error: undefined,
    },
    deleteSubsetProperties: {
      pending: false,
      success: false,
      error: undefined,
    },
    updateSubsetTwoDModelReference: {
      pending: false,
      success: false,
      error: undefined,
    },
    updateSubsetThreeDModelReference: {
      pending: false,
      success: false,
      error: undefined,
    },
  },
  subsets: [] as Subset[],
  allSubsets: [] as Subset[],
  filter: {
    propertySet: null as Set,
    text: '',
  },
};

export const initialState = Immutable(baseState);

const setSubsetsReducer = (state = initialState, action: SubsetsActions) => {
  switch (action.type) {
    case FETCH_SUBSETS:
      return state
        .setIn(['api', 'fetchSubsets', 'pending'], true)
        .setIn(['api', 'fetchSubsets', 'success'], false)
        .setIn(['api', 'fetchSubsets', 'error'], undefined);
    case FETCH_ALL_SUBSETS:
      return state
        .setIn(['api', 'fetchAllSubsets', 'pending'], true)
        .setIn(['api', 'fetchAllSubsets', 'success'], false)
        .setIn(['api', 'fetchAllSubsets', 'error'], undefined);
    case FETCH_SUBSETS_SUCCESS:
      return state
        .setIn(['api', 'fetchSubsets', 'pending'], false)
        .setIn(['api', 'fetchSubsets', 'success'], true)
        .setIn(['api', 'fetchSubsets', 'error'], undefined)
        .setIn(['subsets'], action.subsets);
    case FETCH_ALL_SUBSETS_SUCCESS:
      return state
        .setIn(['api', 'fetchAllSubsets', 'pending'], false)
        .setIn(['api', 'fetchAllSubsets', 'success'], true)
        .setIn(['api', 'fetchAllSubsets', 'error'], undefined)
        .setIn(['allSubsets'], action.subsets);
    case FETCH_SUBSETS_ERROR:
      return state
        .setIn(['api', 'fetchSubsets', 'pending'], false)
        .setIn(['api', 'fetchSubsets', 'success'], false)
        .setIn(['api', 'fetchSubsets', 'error'], action.error);
    case FETCH_ALL_SUBSETS_ERROR:
      return state
        .setIn(['api', 'fetchAllSubsets', 'pending'], false)
        .setIn(['api', 'fetchAllSubsets', 'success'], false)
        .setIn(['api', 'fetchAllSubsets', 'error'], action.error);
    case CREATE_SUBSET:
      return state
        .setIn(['api', 'createSubset', 'pending'], true)
        .setIn(['api', 'createSubset', 'success'], undefined)
        .setIn(['api', 'createSubset', 'error'], undefined);
    case CREATE_SUBSET_SUCCESS: {
      const subsetCreated: CreateSubsetSuccess = {
        subset: action.subset,
        properties: action.properties,
      };
      return state
        .setIn(['api', 'createSubset', 'pending'], false)
        .setIn(['api', 'createSubset', 'success'], subsetCreated)
        .setIn(['api', 'createSubset', 'error'], undefined);
    }
    case CREATE_SUBSET_ERROR:
      return state
        .setIn(['api', 'createSubset', 'pending'], false)
        .setIn(['api', 'createSubset', 'success'], false)
        .setIn(['api', 'createSubset', 'error'], action.error);
    case ADD_SUBSETS:
      return state.setIn(['subsets'], addSubsets(state.subsets, action.subsets));
    case EDIT_SUBSETS:
      return state.setIn(['subsets'], editSubsets(state.subsets, action.subsets));
    case SET_FILTER_SET:
      return state.setIn(['filter', 'propertySet'], action.set);
    case SET_FILTER_TEXT:
      return state.setIn(['filter', 'text'], action.text);
    case ADD_SUBSET_PROPERTIES:
      return state
        .setIn(['api', 'addSubsetProperties', 'pending'], true)
        .setIn(['api', 'addSubsetProperties', 'success'], false)
        .setIn(['api', 'addSubsetProperties', 'error'], undefined);
    case ADD_SUBSET_PROPERTIES_SUCCESS:
      return state
        .setIn(['api', 'addSubsetProperties', 'pending'], false)
        .setIn(['api', 'addSubsetProperties', 'success'], true)
        .setIn(['api', 'addSubsetProperties', 'error'], undefined);
    case ADD_SUBSET_PROPERTIES_ERROR:
      return state
        .setIn(['api', 'addSubsetProperties', 'pending'], false)
        .setIn(['api', 'addSubsetProperties', 'success'], false)
        .setIn(['api', 'addSubsetProperties', 'error'], action.error);
    case DELETE_SUBSET_PROPERTIES:
      return state
        .setIn(['api', 'deleteSubsetProperties', 'pending'], true)
        .setIn(['api', 'deleteSubsetProperties', 'success'], false)
        .setIn(['api', 'deleteSubsetProperties', 'error'], undefined);
    case DELETE_SUBSET_PROPERTIES_SUCCESS:
      return state
        .setIn(['api', 'deleteSubsetProperties', 'pending'], false)
        .setIn(['api', 'deleteSubsetProperties', 'success'], true)
        .setIn(['api', 'deleteSubsetProperties', 'error'], undefined);
    case DELETE_SUBSET_PROPERTIES_ERROR:
      return state
        .setIn(['api', 'deleteSubsetProperties', 'pending'], false)
        .setIn(['api', 'deleteSubsetProperties', 'success'], false)
        .setIn(['api', 'deleteSubsetProperties', 'error'], action.error);

    // models reference =>
    case UPDATE_SUBSET_TWO_D_MODEL_REFERENCE:
      return state
        .setIn(['api', 'updateSubsetTwoDModelReference', 'pending'], true)
        .setIn(['api', 'updateSubsetTwoDModelReference', 'success'], false)
        .setIn(['api', 'updateSubsetTwoDModelReference', 'error'], undefined);
    case UPDATE_SUBSET_TWO_D_MODEL_REFERENCE_SUCCESS:
      return state
        .setIn(['api', 'updateSubsetTwoDModelReference', 'pending'], false)
        .setIn(['api', 'updateSubsetTwoDModelReference', 'success'], true)
        .setIn(['api', 'updateSubsetTwoDModelReference', 'error'], undefined);
    case UPDATE_SUBSET_TWO_D_MODEL_REFERENCE_ERROR:
      return state
        .setIn(['api', 'updateSubsetTwoDModelReference', 'pending'], false)
        .setIn(['api', 'updateSubsetTwoDModelReference', 'success'], false)
        .setIn(['api', 'updateSubsetTwoDModelReference', 'error'], action.error);

    case UPDATE_SUBSET_THREE_D_MODEL_REFERENCE:
      return state
        .setIn(['api', 'updateSubsetThreeDModelReference', 'pending'], true)
        .setIn(['api', 'updateSubsetThreeDModelReference', 'success'], false)
        .setIn(['api', 'updateSubsetThreeDModelReference', 'error'], undefined);
    case UPDATE_SUBSET_THREE_D_MODEL_REFERENCE_SUCCESS:
      return state
        .setIn(['api', 'updateSubsetThreeDModelReference', 'pending'], false)
        .setIn(['api', 'updateSubsetThreeDModelReference', 'success'], true)
        .setIn(['api', 'updateSubsetThreeDModelReference', 'error'], undefined);
    case UPDATE_SUBSET_THREE_D_MODEL_REFERENCE_ERROR:
      return state
        .setIn(['api', 'updateSubsetThreeDModelReference', 'pending'], false)
        .setIn(['api', 'updateSubsetThreeDModelReference', 'success'], false)
        .setIn(['api', 'updateSubsetThreeDModelReference', 'error'], action.error);

    default:
      return state;
  }
};

export default setSubsetsReducer;