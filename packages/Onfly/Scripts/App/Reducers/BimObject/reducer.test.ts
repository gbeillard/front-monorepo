import Immutable from 'seamless-immutable';
import objectsReducer, { initialState, PAGINATION_STEP } from './reducer';
import {
  setFilter,
  searchObjectsSuccess,
  searchObjectsError,
  increasePagination,
  setLibraries,
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
  // setManufacturerFilters,
} from './actions';
import {
  SearchResponse,
  ContentManagementLibrary,
  SearchResponseDocument,
  ValueContainerFilter,
  FilterProperty,
  FilterAlias,
  ProcessResponseMode,
  FilterKind,
  SearchObjectGroup,
} from './types';
import { IClassification, IClassificationNode } from '../classifications/types';
import { GroupType } from '../groups/constants';

describe('objectsReducer', () => {
  describe('initializeSearch action', () => {
    const existingFilters: ValueContainerFilter[] = [
      {
        Property: FilterProperty.Classification,
        Alias: FilterAlias.Classification,
        Values: ['ETIM V7'],
      },
      { Property: FilterProperty.Software, Alias: FilterAlias.Software, Values: ['revit'] },
    ];
    const state = initialState.setIn(
      ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
      existingFilters
    );
    const libraries = Immutable([ContentManagementLibrary.Onfly]);
    const group: SearchObjectGroup = {
      id: 3,
      type: GroupType.Project,
      isFavorite: false,
    };
    const action = initializeSearch(libraries, group);
    const stateAfterOnce = objectsReducer(state, action);
    it('should set the state back to initial state besides libraries and group', () => {
      const expected = initialState
        .set('processResponseMode', ProcessResponseMode.Replace)
        .setIn(['request', 'ContentManagementLibraries'], libraries)
        .set('group', group);
      expect(stateAfterOnce).toEqual(expected);
    });
  });
  describe('setFilter action', () => {
    const state = initialState.set('processResponseMode', ProcessResponseMode.Concat);
    const action = setFilter('abc');
    const stateAfterOnce = objectsReducer(state, action);
    it('should set the search value', () => {
      expect(stateAfterOnce.request.SearchValue.Value).toBe('abc');
    });
    it('should replace the existing objects', () => {
      expect(stateAfterOnce.processResponseMode).toBe(ProcessResponseMode.Replace);
    });
  });
  describe('increasePagination action', () => {
    const state = initialState.set('processResponseMode', ProcessResponseMode.Replace);
    const action = increasePagination();
    const stateAfterOnce = objectsReducer(state, action);
    const stateAfterTwice = objectsReducer(stateAfterOnce, action);

    const pageInitial = state.request.SearchPaging.From;
    const pageAfterOnce = stateAfterOnce.request.SearchPaging.From;
    const pageAfterTwice = stateAfterTwice.request.SearchPaging.From;

    const sizeInitial = state.request.SearchPaging.Size;
    const sizeAfterOnce = stateAfterOnce.request.SearchPaging.Size;
    const sizeAfterTwice = stateAfterTwice.request.SearchPaging.Size;
    it('should increase the From property', () => {
      expect(pageInitial).toBe(0);
      expect(pageAfterOnce).toBe(PAGINATION_STEP);
      expect(pageAfterTwice).toBe(2 * PAGINATION_STEP);
    });
    it('should keep the Page property at the same value', () => {
      expect(sizeInitial).toBe(PAGINATION_STEP);
      expect(sizeAfterOnce).toBe(PAGINATION_STEP);
      expect(sizeAfterTwice).toBe(PAGINATION_STEP);
    });
    it('should concat the results', () => {
      expect(state.processResponseMode).toBe(ProcessResponseMode.Replace);
      expect(stateAfterOnce.processResponseMode).toBe(ProcessResponseMode.Concat);
      expect(stateAfterTwice.processResponseMode).toBe(ProcessResponseMode.Concat);
    });
  });
  describe('setLibraries action', () => {
    const state = initialState.set('processResponseMode', ProcessResponseMode.Concat);
    const libraries = Immutable([
      ContentManagementLibrary.Platform,
      ContentManagementLibrary.Onfly,
    ]);
    const action = setLibraries(libraries);
    const stateAfterOnce = objectsReducer(state, action);
    it('should set the libraries in the search', () => {
      expect(stateAfterOnce.request.ContentManagementLibraries).toEqual(libraries);
    });
    it('should replace the existing objects', () => {
      expect(stateAfterOnce.processResponseMode).toBe(ProcessResponseMode.Replace);
    });
  });
  describe('setSoftwareFilters action', () => {
    it('should replace the filters with new ones', () => {
      const existingFilters: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['ETIM V7'],
        },
        { Property: FilterProperty.Software, Alias: FilterAlias.Software, Values: ['revit'] },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const action = setSoftwareFilters(Immutable(['sketchup', 'archicad']));

      const stateAfterOnce = objectsReducer(state, action);

      const expected: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['ETIM V7'],
        },
        {
          Property: FilterProperty.Software,
          Alias: FilterAlias.Software,
          Values: ['sketchup', 'archicad'],
        },
      ];
      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(expected);
    });
    it('should create the software entry if it does not exist', () => {
      const existingFilters: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['ETIM V7'],
        },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const action = setSoftwareFilters(Immutable(['sketchup', 'archicad']));

      const stateAfterOnce = objectsReducer(state, action);

      const expected: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['ETIM V7'],
        },
        {
          Property: FilterProperty.Software,
          Alias: FilterAlias.Software,
          Values: ['sketchup', 'archicad'],
        },
      ];
      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(expected);
    });
    it('should delete the software entry if it becomes empty', () => {
      const existingFilters: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['ETIM V7'],
        },
        {
          Property: FilterProperty.Software,
          Alias: FilterAlias.Software,
          Values: ['sketchup', 'archicad'],
        },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const action = setSoftwareFilters(Immutable([]));

      const stateAfterOnce = objectsReducer(state, action);

      const expected: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['ETIM V7'],
        },
      ];
      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(expected);
    });
    it('should replace the existing objects', () => {
      const state = initialState.set('processResponseMode', ProcessResponseMode.Concat);
      const action = setSoftwareFilters(Immutable([]));

      const stateAfterOnce = objectsReducer(state, action);

      expect(stateAfterOnce.processResponseMode).toBe(ProcessResponseMode.Replace);
    });
  });
  describe('setTagFilters action', () => {
    it('should replace the filters with new ones', () => {
      const existingFilters: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['ETIM V7'],
        },
        { Property: FilterProperty.Tag, Alias: FilterAlias.Tag, Values: ['elec'] },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const action = setTagFilters(Immutable(['ND1', 'ND2']));

      const stateAfterOnce = objectsReducer(state, action);

      const expected: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['ETIM V7'],
        },
        { Property: FilterProperty.Tag, Alias: FilterAlias.Tag, Values: ['ND1', 'ND2'] },
      ];
      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(expected);
    });
    it('should create the tags entry if it does not exist', () => {
      const existingFilters: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['ETIM V7'],
        },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const action = setTagFilters(Immutable(['ND1', 'ND2']));

      const stateAfterOnce = objectsReducer(state, action);

      const expected: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['ETIM V7'],
        },
        { Property: FilterProperty.Tag, Alias: FilterAlias.Tag, Values: ['ND1', 'ND2'] },
      ];
      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(expected);
    });
    it('should delete the tags entry if it becomes empty', () => {
      const existingFilters: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['ETIM V7'],
        },
        { Property: FilterProperty.Tag, Alias: FilterAlias.Tag, Values: ['ND1', 'ND2'] },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const action = setTagFilters(Immutable([]));

      const stateAfterOnce = objectsReducer(state, action);

      const expected: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['ETIM V7'],
        },
      ];
      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(expected);
    });
    it('should replace the existing objects', () => {
      const state = initialState.set('processResponseMode', ProcessResponseMode.Concat);
      const action = setTagFilters(Immutable([]));

      const stateAfterOnce = objectsReducer(state, action);

      expect(stateAfterOnce.processResponseMode).toBe(ProcessResponseMode.Replace);
    });
  });
  describe('setLodFilters action', () => {
    it('should replace the filters with new ones', () => {
      const existingFilters: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['ETIM V7'],
        },
        { Property: FilterProperty.Lod, Alias: FilterAlias.Lod, Values: ['200', '300'] },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const action = setLodFilters(Immutable(['100', '500']));

      const stateAfterOnce = objectsReducer(state, action);

      const expected: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['ETIM V7'],
        },
        { Property: FilterProperty.Lod, Alias: FilterAlias.Lod, Values: ['100', '500'] },
      ];
      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(expected);
    });
    it('should create the lods entry if it does not exist', () => {
      const existingFilters: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['ETIM V7'],
        },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const action = setLodFilters(Immutable(['100', '500']));

      const stateAfterOnce = objectsReducer(state, action);

      const expected: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['ETIM V7'],
        },
        { Property: FilterProperty.Lod, Alias: FilterAlias.Lod, Values: ['100', '500'] },
      ];
      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(expected);
    });
    it('should delete the lods entry if it becomes empty', () => {
      const existingFilters: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['ETIM V7'],
        },
        { Property: FilterProperty.Lod, Alias: FilterAlias.Lod, Values: ['200', '300'] },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const action = setLodFilters(Immutable([]));

      const stateAfterOnce = objectsReducer(state, action);

      const expected: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['ETIM V7'],
        },
      ];
      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(expected);
    });
    it('should replace the existing objects', () => {
      const state = initialState.set('processResponseMode', ProcessResponseMode.Concat);
      const action = setLodFilters(Immutable([]));

      const stateAfterOnce = objectsReducer(state, action);

      expect(stateAfterOnce.processResponseMode).toBe(ProcessResponseMode.Replace);
    });
  });
  describe('setClassificationFilters action', () => {
    it('should replace the filters with new ones', () => {
      const existingFilters: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['123', '124', '125'],
        },
        { Property: FilterProperty.Lod, Alias: FilterAlias.Lod, Values: ['200', '300'] },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const action = setClassificationFilters(Immutable(['234', '235', '236']));

      const stateAfterOnce = objectsReducer(state, action);

      const expected: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['234', '235', '236'],
        },
        { Property: FilterProperty.Lod, Alias: FilterAlias.Lod, Values: ['200', '300'] },
      ];
      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(expected);
    });
    it('should create the classifications entry if it does not exist', () => {
      const existingFilters: ValueContainerFilter[] = [
        { Property: FilterProperty.Lod, Alias: FilterAlias.Lod, Values: ['100', '200'] },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const action = setClassificationFilters(Immutable(['123', '124', '125']));

      const stateAfterOnce = objectsReducer(state, action);

      const expected: ValueContainerFilter[] = [
        { Property: FilterProperty.Lod, Alias: FilterAlias.Lod, Values: ['100', '200'] },
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['123', '124', '125'],
        },
      ];
      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(expected);
    });
    it('should delete the classifications entry if it becomes empty', () => {
      const existingFilters: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['ETIM V7'],
        },
        { Property: FilterProperty.Lod, Alias: FilterAlias.Lod, Values: ['200', '300'] },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const action = setClassificationFilters(Immutable([]));

      const stateAfterOnce = objectsReducer(state, action);

      const expected: ValueContainerFilter[] = [
        { Property: FilterProperty.Lod, Alias: FilterAlias.Lod, Values: ['200', '300'] },
      ];
      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(expected);
    });
    it('should replace the existing objects', () => {
      const state = initialState.set('processResponseMode', ProcessResponseMode.Concat);
      const action = setClassificationFilters(Immutable([]));

      const stateAfterOnce = objectsReducer(state, action);

      expect(stateAfterOnce.processResponseMode).toBe(ProcessResponseMode.Replace);
    });
  });
  describe('setClassificationNodeFilters action', () => {
    it('should replace the filters with new ones', () => {
      const existingFilters: ValueContainerFilter[] = [
        {
          Property: FilterProperty.ClassificationNode,
          Alias: FilterAlias.ClassificationNode,
          Values: ['123', '124', '125'],
        },
        { Property: FilterProperty.Lod, Alias: FilterAlias.Lod, Values: ['200', '300'] },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const action = setClassificationNodeFilters(Immutable(['234', '235', '236']));

      const stateAfterOnce = objectsReducer(state, action);

      const expected: ValueContainerFilter[] = [
        {
          Property: FilterProperty.ClassificationNode,
          Alias: FilterAlias.ClassificationNode,
          Values: ['234', '235', '236'],
        },
        { Property: FilterProperty.Lod, Alias: FilterAlias.Lod, Values: ['200', '300'] },
      ];
      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(expected);
    });
    it('should create the classifications entry if it does not exist', () => {
      const existingFilters: ValueContainerFilter[] = [
        { Property: FilterProperty.Lod, Alias: FilterAlias.Lod, Values: ['100', '200'] },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const action = setClassificationNodeFilters(Immutable(['123', '124', '125']));

      const stateAfterOnce = objectsReducer(state, action);

      const expected: ValueContainerFilter[] = [
        { Property: FilterProperty.Lod, Alias: FilterAlias.Lod, Values: ['100', '200'] },
        {
          Property: FilterProperty.ClassificationNode,
          Alias: FilterAlias.ClassificationNode,
          Values: ['123', '124', '125'],
        },
      ];
      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(expected);
    });
    it('should delete the classifications entry if it becomes empty', () => {
      const existingFilters: ValueContainerFilter[] = [
        {
          Property: FilterProperty.ClassificationNode,
          Alias: FilterAlias.ClassificationNode,
          Values: ['ETIM V7'],
        },
        { Property: FilterProperty.Lod, Alias: FilterAlias.Lod, Values: ['200', '300'] },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const action = setClassificationNodeFilters(Immutable([]));

      const stateAfterOnce = objectsReducer(state, action);

      const expected: ValueContainerFilter[] = [
        { Property: FilterProperty.Lod, Alias: FilterAlias.Lod, Values: ['200', '300'] },
      ];
      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(expected);
    });
    it('should replace the existing objects', () => {
      const state = initialState.set('processResponseMode', ProcessResponseMode.Concat);
      const action = setClassificationNodeFilters(Immutable([]));

      const stateAfterOnce = objectsReducer(state, action);

      expect(stateAfterOnce.processResponseMode).toBe(ProcessResponseMode.Replace);
    });
  });
  describe('setManufacturerFilters action', () => {
    it('should replace the filters with new ones', () => {
      const existingFilters: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['123', '124', '125'],
        },
        {
          Property: FilterProperty.Manufacturer,
          Alias: FilterAlias.Manufacturer,
          Values: ['Bosch', 'Kiloutou'],
        },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const action = setManufacturerFilters(Immutable(['Rexel']));

      const stateAfterOnce = objectsReducer(state, action);

      const expected: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['123', '124', '125'],
        },
        {
          Property: FilterProperty.Manufacturer,
          Alias: FilterAlias.Manufacturer,
          Values: ['Rexel'],
        },
      ];
      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(expected);
    });
    it('should create the manufacturers entry if it does not exist', () => {
      const existingFilters: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['123', '124', '125'],
        },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const action = setManufacturerFilters(Immutable(['Rexel']));

      const stateAfterOnce = objectsReducer(state, action);

      const expected: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['123', '124', '125'],
        },
        {
          Property: FilterProperty.Manufacturer,
          Alias: FilterAlias.Manufacturer,
          Values: ['Rexel'],
        },
      ];
      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(expected);
    });
    it('should delete the lods entry if it becomes empty', () => {
      const existingFilters: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['123', '124', '125'],
        },
        {
          Property: FilterProperty.Manufacturer,
          Alias: FilterAlias.Manufacturer,
          Values: ['Rexel'],
        },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const action = setManufacturerFilters(Immutable([]));

      const stateAfterOnce = objectsReducer(state, action);

      const expected: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Classification,
          Alias: FilterAlias.Classification,
          Values: ['123', '124', '125'],
        },
      ];
      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(expected);
    });
    it('should replace the existing objects', () => {
      const state = initialState.set('processResponseMode', ProcessResponseMode.Concat);
      const action = setManufacturerFilters(Immutable([]));

      const stateAfterOnce = objectsReducer(state, action);

      expect(stateAfterOnce.processResponseMode).toBe(ProcessResponseMode.Replace);
    });
  });
  describe('addPropertyFilter action', () => {
    it('should add the property to the request filters', () => {
      const existingFilters: ValueContainerFilter[] = [
        { Property: FilterProperty.Lod, Alias: FilterAlias.Lod, Values: ['100', '200'] },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const propertyId = '3';
      const action = addPropertyFilter(propertyId);

      const stateAfterOnce = objectsReducer(state, action);

      const expected: ValueContainerFilter[] = [
        { Property: FilterProperty.Lod, Alias: FilterAlias.Lod, Values: ['100', '200'] },
        {
          Property: FilterProperty.Property,
          Alias: FilterAlias.Property,
          PropertyId: propertyId,
          Values: [],
        },
      ];

      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(expected);
    });
    it('should add a new static entry', () => {
      const existingStaticFilters = Immutable({
        Softwares: { Property: FilterProperty.Software, Kind: FilterKind.Value },
        Pins: { Property: FilterProperty.Tag, Kind: FilterKind.Value },
        Lod: { Property: FilterProperty.Lod, Kind: FilterKind.Value },
        Classifications: { Property: FilterProperty.Classification, Kind: FilterKind.Value },
        Manufacturers: { Property: FilterProperty.Manufacturer, Kind: FilterKind.Value },
      });
      const state = initialState.setIn(['request', 'StaticFilters'], existingStaticFilters);
      const propertyId = '3';
      const action = addPropertyFilter(propertyId);

      const stateAfterOnce = objectsReducer(state, action);

      const index = `${FilterProperty.Property}-${propertyId}`;
      const filter = {
        Property: FilterProperty.Property,
        Kind: FilterKind.Value,
        PropertyId: propertyId,
      };
      const expected = existingStaticFilters.setIn([index], filter);

      expect(stateAfterOnce.request.StaticFilters).toEqual(expected);
    });
    it('should replace the existing objects', () => {
      const state = initialState.set('processResponseMode', ProcessResponseMode.Concat);
      const action = addPropertyFilter('1');

      const stateAfterOnce = objectsReducer(state, action);

      expect(stateAfterOnce.processResponseMode).toBe(ProcessResponseMode.Replace);
    });
  });
  describe('setPropertyFilter action', () => {
    it('should update the existing entry', () => {
      const existingFilters: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Property,
          Alias: FilterAlias.Property,
          PropertyId: '1',
          Values: ['100mm', '200mm'],
        },
        {
          Property: FilterProperty.Property,
          Alias: FilterAlias.Property,
          PropertyId: '2',
          Values: ['100mm', '200mm'],
        },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const propertyId = '2';
      const values = Immutable(['100mm', '200mm', '300mm']);
      const action = setPropertyFilter(propertyId, values);

      const stateAfterOnce = objectsReducer(state, action);

      const expected: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Property,
          Alias: FilterAlias.Property,
          PropertyId: '1',
          Values: ['100mm', '200mm'],
        },
        {
          Property: FilterProperty.Property,
          Alias: FilterAlias.Property,
          PropertyId: '2',
          Values: ['100mm', '200mm', '300mm'],
        },
      ];
      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(expected);
    });
    it('should not alter the filters if the property cannot be found', () => {
      const existingFilters: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Property,
          Alias: FilterAlias.Property,
          PropertyId: '1',
          Values: ['100mm', '200mm'],
        },
        {
          Property: FilterProperty.Property,
          Alias: FilterAlias.Property,
          PropertyId: '2',
          Values: ['100mm', '200mm'],
        },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const propertyId = '3';
      const values = Immutable(['100mm', '200mm', '300mm']);
      const action = setPropertyFilter(propertyId, values);

      const stateAfterOnce = objectsReducer(state, action);

      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(
        existingFilters
      );
    });
    it('should replace the existing objects', () => {
      const state = initialState.set('processResponseMode', ProcessResponseMode.Concat);
      const action = setPropertyFilter('1', Immutable([]));

      const stateAfterOnce = objectsReducer(state, action);

      expect(stateAfterOnce.processResponseMode).toBe(ProcessResponseMode.Replace);
    });
  });
  describe('removePropertyFilter action', () => {
    it('should remove the existing entry', () => {
      const existingFilters: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Property,
          Alias: FilterAlias.Property,
          PropertyId: '1',
          Values: ['100mm', '200mm'],
        },
        {
          Property: FilterProperty.Property,
          Alias: FilterAlias.Property,
          PropertyId: '2',
          Values: ['100mm', '200mm'],
        },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const propertyId = '2';
      const action = removePropertyFilter(propertyId);

      const stateAfterOnce = objectsReducer(state, action);

      const expected: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Property,
          Alias: FilterAlias.Property,
          PropertyId: '1',
          Values: ['100mm', '200mm'],
        },
      ];
      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(expected);
    });
    it('should not alter the filters if the property cannot be found', () => {
      const existingFilters: ValueContainerFilter[] = [
        {
          Property: FilterProperty.Property,
          Alias: FilterAlias.Property,
          PropertyId: '1',
          Values: ['100mm', '200mm'],
        },
        {
          Property: FilterProperty.Property,
          Alias: FilterAlias.Property,
          PropertyId: '2',
          Values: ['100mm', '200mm'],
        },
      ];
      const state = initialState.setIn(
        ['request', 'SearchContainerFilter', 'ValueContainerFilter'],
        existingFilters
      );
      const propertyId = '3';
      const action = removePropertyFilter(propertyId);

      const stateAfterOnce = objectsReducer(state, action);

      expect(stateAfterOnce.request.SearchContainerFilter.ValueContainerFilter).toEqual(
        existingFilters
      );
    });
    it('should replace the existing objects', () => {
      const state = initialState.set('processResponseMode', ProcessResponseMode.Concat);
      const action = removePropertyFilter('1');

      const stateAfterOnce = objectsReducer(state, action);

      expect(stateAfterOnce.processResponseMode).toBe(ProcessResponseMode.Replace);
    });
  });
  it('should handle a searchObjectsStart action', () => {
    const action = searchObjectsStart('abc123');
    const state = objectsReducer(undefined, action);
    expect(state.searchId).toBe('abc123');
    expect(state.api.search).toEqual({ pending: true, success: false, error: undefined });
  });
  describe('searchObjectsSuccess action', () => {
    const initialObjects: SearchResponseDocument[] = [
      {
        Id: 1,
        Name: 'Object',
        BimScore: 100,
        Description: 'This is a test object',
        CreatorName: 'Florian',
      },
    ];
    const state = initialState.set('objects', initialObjects).set('searchId', 'abc123');
    const response: SearchResponse = {
      Id: 'abc123',
      Size: 3,
      Total: 10,
      Documents: [
        {
          Id: 2,
          Name: 'New Object',
          BimScore: 100,
          Description: 'This is a test object',
          CreatorName: 'Florian',
        },
      ],
      StaticFilters: {
        Softwares: [],
      },
    };
    const action = searchObjectsSuccess(response, { withResults: true, withFilters: true });
    const stateAfterOnce = objectsReducer(state, action);
    it('should set the right flags in the api', () => {
      expect(stateAfterOnce.api.search).toEqual({
        pending: false,
        success: true,
        error: undefined,
      });
    });
    it('should store the whole response', () => {
      expect(stateAfterOnce.response).toEqual(response);
    });
    it('should concat the objects', () => {
      const concatState = state.set('processResponseMode', ProcessResponseMode.Concat);
      const stateAfter = objectsReducer(concatState, action);
      expect(stateAfter.objects).toEqual(initialObjects.concat(response.Documents));
    });
    it('should replace the objects', () => {
      const replaceState = state.set('processResponseMode', ProcessResponseMode.Replace);
      const stateAfter = objectsReducer(replaceState, action);
      expect(stateAfter.objects).toEqual(response.Documents);
    });
  });
  it('should handle a searchObjectsError action', () => {
    const error = new Error('oopsie!');
    const action = searchObjectsError(error);
    const state = objectsReducer(undefined, action);
    expect(state.api.search).toEqual({ pending: false, success: false, error });
  });
  it('should handle a setSelectedClassification action', () => {
    const classification: IClassification = {
      Id: 1,
      Name: 'abc',
      ColorCode: 'def',
      Description: '',
      IsBimAndCo: true,
      IsPrivate: true,
      IsMandatory: true,
      IsAutomaticTranslate: true,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
      NameProperty: null,
      CodeProperty: null,
      Statistics: null,
    };
    const action = setSelectedClassification(classification);
    const state = objectsReducer(undefined, action);
    expect(state.selectedClassification).toEqual(classification);
  });
  it('should handle a setSelectedNode action', () => {
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
    const action = setSelectedNode(node);
    const state = objectsReducer(undefined, action);
    expect(state.selectedNode).toEqual(node);
  });
  it('should handle a resetSearch action', () => {
    const action = resetSearch();
    const state = objectsReducer(undefined, action);
    expect(state).toEqual(initialState);
  });
});