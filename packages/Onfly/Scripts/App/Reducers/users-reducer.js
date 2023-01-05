import * as types from '../Actions/users-actions';

import { FETCH_INVITATIONS_SUCCESS } from './Users/Invitations/types';

const initialState = {
  MembersList: [],
  MembersListCount: 0,
  UsersInvitationsList: [],
  Page: 0,
};

const usersReducer = function (state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_USERS_LIST: {
      let docs = [];
      let page = state.Page;

      if (action.addToDocData) {
        docs = state.MembersList.concat(action.data.Results);
        page += 1;
      } else {
        docs = action.data.Results;
        page = 0;
      }

      return {
        ...state,
        MembersListCount: action.data.Count,
        MembersList: docs,
        Page: page,
      };
    }
    case FETCH_INVITATIONS_SUCCESS:
      return { ...state, UsersInvitationsList: action.invitations };
    default:
      return state;
  }
};

export default usersReducer;
