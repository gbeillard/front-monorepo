import * as types from '../Actions/groups-actions';

const initialState = {
  GroupsList: null,
};

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_GROUPS_LIST:
      return { ...state, GroupsList: action.data };
    case types.UPDATE_GROUP:
      if (state.GroupsList == null) {
        return state;
      }

      return {
        ...state,
        GroupsList: state.GroupsList.filter((x) => action.data.Id !== x.Id)
          .concat(action.data)
          .sort((a, b) => a.Name.toLowerCase().localeCompare(b.Name.toLowerCase())),
      };
    case types.ADD_GROUP:
      return {
        ...state,
        GroupsList: state.GroupsList.concat(action.groupAdded).sort((a, b) =>
          a.Name.toLowerCase().localeCompare(b.Name.toLowerCase())
        ),
      };
    case types.DELETE_GROUP:
      return { ...state, GroupsList: state.GroupsList.filter((x) => action.groupId !== x.Id) };
    default:
      return state;
  }
};

export default groupsReducer;
