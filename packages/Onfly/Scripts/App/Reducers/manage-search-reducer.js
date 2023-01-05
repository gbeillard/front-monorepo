import _ from 'underscore';
import * as types from '../Actions/manage-search-actions';
import * as SearchApi from '../Api/SearchApi.js';
import * as Utils from '../Utils/utils.js';

const initialRequest = {
  SearchType: 'bimobject',
  SearchValue: { Value: '' },
  SearchSorting: {
    Name: 'CreatedAt',
    Order: 'Desc',
  },
  SearchPaging: {
    From: 0,
    Size: 16,
  },
  SearchContainerFilter: {},
  SearchContainerDynamicFilter: [],
  LanguageCode: 'en',
  Context: 'onfly',
  IgnoreFacets: false,
  IsManage: true,
};

const searchLayout = Utils.getCookie('searchLayout');
const libraries = Utils.getCookie('libraries');

const initialState = {
  Documents: [],
  Total: 0,
  StaticFilters: [],
  AvailableFilters: [],
  BuilderFilters: [],
  DynamicFilters: [],
  SearchValue: '',
  staticOrderedFilters:
    'ObjectType,Classifications,Manufacturers,Softwares,Tags,Countries,Lod,Companies',
  Page: 0,
  Size: 16,
  ContextRequest: libraries != '' ? libraries.split(',') : ['library'],
  SelectedBimObjects: [],
  ScrollPosition: 0,
  Layout: searchLayout === 'grid' || searchLayout === 'row' ? searchLayout : 'grid',
  ObjectIdOpened: 0,
  InitialRequest: initialRequest,
  Request: JSON.parse(JSON.stringify(initialRequest)),
  DocumentsLength: 0,
  Type: '',
  SearchContextAction: '_MANAGE',
  ClassificationListSelected: [],
};

const searchReducer = function (state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }

  switch (action.type) {
    case types.MANAGE_SEARCH_SUCCESS:
      let docs = [];
      let page = state.Page;
      if (action.addToDocData) {
        docs = state.Documents.concat(action.Documents);
        page += 1;
      } else {
        docs = action.Documents;
        if (action.request.SearchPaging.Size == state.Size) {
          page = 0;
        }
      }

      const requestTmp = action.request;

      if (requestTmp.IgnoreFacets) {
        requestTmp.IgnoreFacets = false;
        return {
          ...state,
          Documents: docs,
          Request: requestTmp,
          Page: page,
          DocumentsLength: docs !== undefined ? docs.length : 0,
          Type: action.type,
        };
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
        Request: requestTmp,
        Page: page,
        ContextRequest: action.contextRequest,
        DocumentsLength: docs !== undefined ? docs.length : 0,
        Type: action.type,
      };

    case types.REFRESH_REQUEST_MANAGE: {
      const newRequest = state.Request;
      newRequest.SearchPaging = { From: 0, Size: newRequest.SearchPaging.Size * (state.Page + 1) };
      SearchApi.search(newRequest, state.ContextRequest, action.managementcloudId, action.token);
      return state;
    }

    case types.UPDATE_REQUEST_MANAGE: {
      const request = state.Request;
      request.IsManage = true;
      return { ...state, Request: request };
    }

    case types.DELETE_OBJECTS_FROM_RESULTS: {
      const docsList = [];
      _.each(state.Documents, (item) => {
        if (action.objectIds.indexOf(item.Id.toString()) !== -1) {
          if (item.CreatedFromContentManagement === true) {
            docsList.push({ ...item, Status: action.actionType });
          } else if (action.actionType === 'hidden' && !item.CreatedFromContentManagement) {
            docsList.push({ ...item, Status: 'published', IsOnManagementCloud: false });
          } else if (action.actionType === 'hidden') {
            docsList.push({ ...item, Status: 'hidden', IsOnManagementCloud: true });
          } else if (action.actionType === 'published') {
            docsList.push({ ...item, Status: 'published', IsOnManagementCloud: true });
          } else if (
            action.actionType === 'deleted' &&
            (state.ContextRequest.length > 1 ||
              (state.ContextRequest.length === 1 &&
                (state.ContextRequest.indexOf('library') === -1 ||
                  state.ContextRequest.indexOf('personal') === -1)))
          ) {
            if (action.userId === item.CreatorId) {
              docsList.push({ ...item, Status: 'deleted', IsOnManagementCloud: false });
            } else {
              docsList.push({ ...item, Status: 'published', IsOnManagementCloud: false });
            }
          }
        } else {
          docsList.push(item);
        }
      });

      return { ...state, Documents: docsList };
    }

    case types.ADD_BIMOBJECT: {
      const documents = action.documents
        .concat(action.bimobjectAdded)
        .sort((a, b) => new Date(b.UpdatedAt) - new Date(a.UpdatedAt));
      return { ...state, Documents: documents };
    }
    default:
      return state;
  }
};

export default searchReducer;
