import Immutable from 'seamless-immutable';
import {
  setFilter,
  increasePagination,
  setLibraries,
  searchObjects,
  searchObjectsSuccess,
  searchObjectsError,
  setSoftwareFilters,
  setTagFilters,
  setLodFilters,
  setClassificationFilters,
  setManufacturerFilters,
  setPropertyFilter,
  addPropertyFilter,
  removePropertyFilter,
  resetSearch,
  setSelectedClassification,
  setSelectedNode,
  initializeSearch,
  setClassificationNodeFilters,
  searchObjectsStart,
} from './actions';
import {
  SET_FILTER,
  SEARCH_OBJECTS,
  SEARCH_OBJECTS_SUCCESS,
  SEARCH_OBJECTS_ERROR,
  SetFilterAction,
  SearchObjectsAction,
  SearchObjectsSuccessAction,
  SearchObjectsErrorAction,
  SearchResponse,
  IncreasePaginationAction,
  INCREASE_PAGINATION,
  ContentManagementLibrary,
  SET_LIBRARIES,
  SetLibrariesAction,
  SetSofwareFiltersAction,
  SET_SOFTWARE_FILTERS,
  SetTagFiltersAction,
  SET_TAG_FILTERS,
  SetLodFiltersAction,
  SET_LOD_FILTERS,
  SetClassifiationFiltersAction,
  SET_CLASSIFICATION_FILTERS,
  SetManufacturerFiltersAction,
  SET_MANUFACTURER_FILTERS,
  SetPropertyFilterAction,
  SET_PROPERTY_FILTER,
  ADD_PROPERTY_FILTER,
  REMOVE_PROPERTY_FILTER,
  AddPropertyFilterAction,
  RemovePropertyFilterAction,
  RESET_SEARCH,
  ResetSearchAction,
  SetSelectedClassificationAction,
  SET_SELECTED_CLASSIFICATION,
  SET_SELECTED_NODE,
  SetSelectedNodeAction,
  INITIALIZE_SEARCH,
  InitializeSearchAction,
  SET_CLASSIFICATION_NODE_FILTERS,
  SetClassifiationNodeFiltersAction,
  SearchObjectsStartAction,
  SEARCH_OBJECTS_START,
  SearchObjectGroup,
} from './types';
import { IClassification, IClassificationNode } from '../classifications/types';
import { GroupType } from '../groups/constants';

describe('objectsReducer - actions', () => {
  it('should have a initializeSearch action', () => {
    const libraries = Immutable([
      ContentManagementLibrary.Onfly,
      ContentManagementLibrary.Platform,
    ]);
    const group: SearchObjectGroup = {
      id: 3,
      type: GroupType.Project,
      isFavorite: false,
    };
    const result = initializeSearch(libraries, group);
    const expected: InitializeSearchAction = { type: INITIALIZE_SEARCH, libraries, group };
    expect(result).toEqual(expected);
  });
  it('should have a setFilter action', () => {
    const result = setFilter('abc');
    const expected: SetFilterAction = { type: SET_FILTER, filter: 'abc' };
    expect(result).toEqual(expected);
  });
  it('should have an increasePagination action', () => {
    const result = increasePagination();
    const expected: IncreasePaginationAction = { type: INCREASE_PAGINATION };
    expect(result).toEqual(expected);
  });
  it('should have a setLibraries action', () => {
    const libraries = Immutable([
      ContentManagementLibrary.Onfly,
      ContentManagementLibrary.Platform,
    ]);
    const result = setLibraries(libraries);
    const expected: SetLibrariesAction = { type: SET_LIBRARIES, libraries };
    expect(result).toEqual(expected);
  });
  describe('filters', () => {
    it('should have a setSoftwareFilters action', () => {
      const softwares = Immutable(['revit', 'sketchup', 'archicad']);
      const result = setSoftwareFilters(softwares);
      const expected: SetSofwareFiltersAction = { type: SET_SOFTWARE_FILTERS, softwares };
      expect(result).toEqual(expected);
    });
    it('should have a setTagFilters action', () => {
      const tags = Immutable(['hello', 'world']);
      const result = setTagFilters(tags);
      const expected: SetTagFiltersAction = { type: SET_TAG_FILTERS, tags };
      expect(result).toEqual(expected);
    });
    it('should have a setLodFilters action', () => {
      const lods = Immutable(['100', '400']);
      const result = setLodFilters(lods);
      const expected: SetLodFiltersAction = { type: SET_LOD_FILTERS, lods };
      expect(result).toEqual(expected);
    });
    it('should have a setClassificationFilters action', () => {
      const classifications = Immutable(['123', '124', '125']);
      const result = setClassificationFilters(classifications);
      const expected: SetClassifiationFiltersAction = {
        type: SET_CLASSIFICATION_FILTERS,
        classifications,
      };
      expect(result).toEqual(expected);
    });
    it('should have a setClassificationNodeFilters action', () => {
      const nodes = Immutable(['123', '124', '125']);
      const result = setClassificationNodeFilters(nodes);
      const expected: SetClassifiationNodeFiltersAction = {
        type: SET_CLASSIFICATION_NODE_FILTERS,
        nodes,
      };
      expect(result).toEqual(expected);
    });
    it('should have a setManufacturerFilters action', () => {
      const manufacturers = Immutable(['GA', 'Engie', 'Rexel']);
      const result = setManufacturerFilters(manufacturers);
      const expected: SetManufacturerFiltersAction = {
        type: SET_MANUFACTURER_FILTERS,
        manufacturers,
      };
      expect(result).toEqual(expected);
    });
    it('should have a addPropertyFilter action', () => {
      const propertyId = '3';
      const result = addPropertyFilter(propertyId);
      const expected: AddPropertyFilterAction = { type: ADD_PROPERTY_FILTER, propertyId };
      expect(result).toEqual(expected);
    });
    it('should have a removePropertyFilter action', () => {
      const propertyId = '3';
      const result = removePropertyFilter(propertyId);
      const expected: RemovePropertyFilterAction = { type: REMOVE_PROPERTY_FILTER, propertyId };
      expect(result).toEqual(expected);
    });
    it('should have a setPropertyFilter action', () => {
      const propertyId = '3';
      const values = Immutable(['100mm', '200mm', '300mm']);
      const result = setPropertyFilter(propertyId, values);
      const expected: SetPropertyFilterAction = { type: SET_PROPERTY_FILTER, propertyId, values };
      expect(result).toEqual(expected);
    });
  });
  it('should have a searchObjects action', () => {
    const result = searchObjects();
    const expected: SearchObjectsAction = { type: SEARCH_OBJECTS };
    expect(result).toEqual(expected);
  });
  it('should have a searchObjectsStart action', () => {
    const result = searchObjectsStart('abc123');
    const expected: SearchObjectsStartAction = { type: SEARCH_OBJECTS_START, id: 'abc123' };
    expect(result).toEqual(expected);
  });
  it('should have a searchObjectsSuccess action', () => {
    const response: SearchResponse = {
      Id: 'abc123',
      Total: 0,
      Size: 0,
      Documents: [],
      StaticFilters: {
        Softwares: [],
      },
    };
    const result = searchObjectsSuccess(response);
    const expected: SearchObjectsSuccessAction = { type: SEARCH_OBJECTS_SUCCESS, response };
    expect(result).toEqual(expected);
  });
  it('should have a searchObjectsError action', () => {
    const error = new Error('oops :(');
    const result = searchObjectsError(error);
    const expected: SearchObjectsErrorAction = { type: SEARCH_OBJECTS_ERROR, error };
    expect(result).toEqual(expected);
  });
  it('should have a setSelectedClassification action', () => {
    const classification: IClassification = {
      Id: 1,
      Name: 'abc',
      ColorCode: 'def',
      Description: '',
      IsPrivate: true,
      IsBimAndCo: true,
      IsMandatory: true,
      IsAutomaticTranslate: true,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
      NameProperty: null,
      CodeProperty: null,
      Statistics: null,
    };
    const result = setSelectedClassification(classification);
    const expected: SetSelectedClassificationAction = {
      type: SET_SELECTED_CLASSIFICATION,
      classification,
    };
    expect(result).toEqual(expected);
  });
  it('should have a setSelectedNode action', () => {
    const node: IClassificationNode = {
      Id: 1,
      Name: 'abc',
      Code: '',
      Description: '',
      Children: [],
      ParentId: -1,
      IfcExportAsId: null,
      IfcExportTypeId: null,
      CaoCategory: null,
    };
    const result = setSelectedNode(node);
    const expected: SetSelectedNodeAction = { type: SET_SELECTED_NODE, node };
    expect(result).toEqual(expected);
  });
  it('should have a resetSearch action', () => {
    const result = resetSearch();
    const expected: ResetSearchAction = { type: RESET_SEARCH };
    expect(result).toEqual(expected);
  });
});