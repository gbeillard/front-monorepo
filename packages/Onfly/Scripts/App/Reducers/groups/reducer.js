import Immutable from 'seamless-immutable';
import {
  SET_GROUPS,
  SET_GROUP,
  SET_FILTER,
  REPLACE_GROUPS,
  SET_PLATFORM_UPLOAD,
  SET_ONFLY_UPLOAD,
} from './constants';

const initialState = Immutable({
  groups: [],
  filter: '',
  onflyUpload: false,
  platformUpload: false,
});

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GROUPS:
      return state.set('groups', action.groups);

    case SET_GROUP: {
      const index = state.groups.findIndex((group) => group.Id === action.group.Id);
      return state.setIn(['groups', index], action.group);
    }

    case REPLACE_GROUPS: {
      const updatedGroups = replaceGroups(state.groups, action.groups);
      return state.set('groups', updatedGroups);
    }

    case SET_FILTER:
      return state.set('filter', action.filter);

    case SET_ONFLY_UPLOAD:
      return state.set('onflyUpload', action.onflyUpload);

    case SET_PLATFORM_UPLOAD:
      return state.set('platformUpload', action.platformUpload);

    default:
      return state;
  }
};

const replaceGroups = (existingGroups, updatedGroups) =>
  existingGroups.map((existingGroup) => {
    const updatedGroup = updatedGroups.find((group) => group.Id === existingGroup.Id);
    return updatedGroup || existingGroup;
  });

export default groupsReducer;
