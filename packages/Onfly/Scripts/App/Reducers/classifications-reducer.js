import _ from 'underscore';
import Immutable from 'seamless-immutable';
import * as types from '../Actions/classifications-actions.js';
import * as ClassificationApi from '../Api/ClassificationsApi.js';
import { DEPRECATED_FETCH_CLASSIFICATIONS_SUCCESS } from './classifications/types';

const initialState = Immutable({
  ClassificationsList: [],
  ClassificationNodes: [],
});

const classificationsReducer = function (state = initialState, action) {
  switch (action.type) {
    case types.GET_CLASSIFICATIONS_LIST:
      if (typeof state.ClassificationsList[action.language] === 'undefined') {
        ClassificationApi.getClassificationsList(
          action.token,
          action.managementcloudId,
          action.language,
          action.subDomain
        );
      }

      return state;

    case types.UPDATE_CLASSIFICATIONS_LIST: {
      return state.setIn(
        ['ClassificationsList', action.language],
        _.sortBy(action.data, 'Classification')
      );
    }
    case types.GET_CLASSIFICATION_NODES: {
      if (
        typeof state.ClassificationNodes[action.classificationId] === 'undefined' ||
        typeof state.ClassificationNodes[action.classificationId][action.language] === 'undefined'
      ) {
        ClassificationApi.getClassificationNodesList(
          action.token,
          action.classificationId,
          action.language
        );
      }

      return state;
    }
    case types.UPDATE_CLASSIFICATION_NODES: {
      return state.setIn(
        ['ClassificationNodes', action.classificationId, action.language],
        buildTreeView(action.data)
      );
    }
    case DEPRECATED_FETCH_CLASSIFICATIONS_SUCCESS: {
      const sortedClassifications = action.classifications
        .slice()
        .sort((a, b) => a.Classification < b.Classification);
      return state.setIn(['ClassificationsList', action.languageCode], sortedClassifications);
    }
    default:
      return state;
  }
};

function buildTreeView(list) {
  const map = {};
  let node;
  const roots = [];
  let i;
  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i; // initialize the map
    list[i].children = []; // initialize the children
  }
  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.parentid !== '-1') {
      // if you have dangling branches check that map[node.parentId] exists
      list[map[node.parentid]].children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export default classificationsReducer;
