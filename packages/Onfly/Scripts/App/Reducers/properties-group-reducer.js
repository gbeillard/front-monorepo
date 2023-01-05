import * as types from '../Actions/properties-group-actions';
import * as PropertiesGroupApi from '../Api/PropertiesGroupApi.js';

const initialState = {
  GroupsList: null,
};

const propertiesGroupReducer = function (state = initialState, action) {
  switch (action.type) {
    case types.GET_PROPERTIES_GROUP_LIST:
      if (state.GroupsList == null) {
        PropertiesGroupApi.getPropertiesGroup(action.token);
      }

      return state;
    case types.UPDATE_PROPERTIES_GROUP_LIST:
      return { ...state, GroupsList: action.data };
    default:
      return state;
  }
};

export default propertiesGroupReducer;
