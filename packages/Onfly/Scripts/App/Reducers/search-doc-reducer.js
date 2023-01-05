import * as types from '../Actions/search-doc-actions';
import * as SearchApi from '../Api/SearchApi.js';

const initialState = {
  Request: null,
  Documents: [],
  Total: 0,
  StaticFilters: [],
  AvailableFilters: [],
  BuilderFilters: [],
  DynamicFilters: [],
  SearchValue: '',
  staticOrderedFilters: '',
  Page: 0,
  Size: 16,
  ContextRequest: 'directory',
  DirectoryId: 0,
};

const searchDocReducer = function (state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }

  switch (action.type) {
    case types.SEARCH_DOC_SUCCESS: {
      let docs = [];
      let page = state.Page;
      if (action.addToDocData) {
        docs = state.Documents.concat(action.Documents);
        page += 1;
      } else {
        docs = action.Documents;
        page = 0;
      }

      return {
        ...state,
        Documents: docs,
        Total: action.Total,
        StaticFilters: action.StaticFilters,
        AvailableFilters: action.AvailableFilters,
        BuilderFilters: action.BuilderFilters,
        DynamicFilters: action.DynamicFilters,
        SearchValue: action.SearchValue,
        Request: action.request,
        Page: page,
        ContextRequest: action.contextRequest,
        DirectoryId: action.directoryId,
      };
    }
    case types.REFRESH_DOC_REQUEST: {
      const newRequest = state.Request;
      newRequest.SearchPaging = { From: 0, Size: state.Size };
      SearchApi.searchDoc(newRequest, state.ContextRequest, action.managementcloudId, action.token);
      return state;
    }
    case types.LOAD_MORE_DOC:
      return { ...state, Documents: state.Documents.push(action.Documents) };
    default:
      return state;
  }
};

export default searchDocReducer;
