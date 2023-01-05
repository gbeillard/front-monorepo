import _ from 'underscore';
import * as types from '../Actions/search-actions';
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
  IsManage: false,
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
  ContextRequest: libraries !== '' ? libraries.split(',') : ['library'],
  SelectedBimObjects: [],
  ScrollPosition: 0,
  Layout: searchLayout === 'grid' || searchLayout === 'row' ? searchLayout : 'grid',
  ObjectIdOpened: 0,
  InitialRequest: initialRequest,
  Request: JSON.parse(JSON.stringify(initialRequest)),
  DocumentsLength: 0,
  Type: '',
  SearchContextAction: '',
};

const searchReducer = function (state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }

  switch (action.type) {
    case types.SEARCH_SUCCESS: {
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
          DocumentsLength: docs.length,
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
        DocumentsLength: docs.length,
        Type: action.type,
      };
    }

    case types.REFRESH_REQUEST: {
      const newRequest = state.Request;
      newRequest.SearchPaging = { From: 0, Size: state.Size };
      SearchApi.search(newRequest, state.ContextRequest, action.managementcloudId, action.token);
      return state;
    }
    case types.LOAD_MORE:
      return { ...state, Documents: state.Documents.push(action.Documents) };

    case types.SELECT_BIMOBJECT: {
      const newSelectedObjects = state.SelectedBimObjects;
      const index = newSelectedObjects.indexOf(action.objectId);
      if (index === -1) {
        newSelectedObjects.push(action.objectId);
      } else {
        newSelectedObjects.splice(index, 1);
      }
      return { ...state, SelectedBimObjects: newSelectedObjects };
    }
    case types.SAVE_SCROLL_POSITION:
      return { ...state, ScrollPosition: action.scrollPosition };

    case types.CHANGE_LAYOUT:
      Utils.setCookie('searchLayout', action.layout, 3650);
      return { ...state, Layout: action.layout };

    case types.OPEN_OBJECT_CARD: {
      if (action.data !== 0) {
        return { ...state, ObjectIdOpened: action.data };
      }

      const resetPaging = initialRequest;
      resetPaging.SearchPaging = { From: 0, Size: 16 };
      return {
        ...state,
        ObjectIdOpened: action.data,
        Page: 0,
        InitialRequest: resetPaging,
      };
    }
    case types.DELETE_OBJECTS_FROM_RESULTS: {
      const docsList = [];
      _.each(state.Documents, (item, index) => {
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
              (state.ContextRequest.length == 1 &&
                (state.ContextRequest.indexOf('library') == -1 ||
                  state.ContextRequest.indexOf('personal') == -1)))
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
    default:
      return state;
  }
};

export default searchReducer;
