import Immutable, { ImmutableArray } from 'seamless-immutable';
import { initialState } from './reducer';
import { initialState as initialAppState } from '../app-reducer';
import {
  selectFilter,
  selectObjects,
  selectLibraries,
  selectSoftwaresFilter,
  selectTagsFilter,
  selectLodsFilter,
  selectClassificationsFilter,
  selectManufacturersFilter,
  selectProperties,
  selectSelectedClassification,
  selectSelectedNode,
  selectGroupId,
} from './selectors';
import {
  SearchResponseDocument,
  ContentManagementLibrary,
  ValueContainerFilter,
  FilterProperty,
  FilterAlias,
  StaticFilters,
  FormattedFilter,
  PropertyValue,
  Property,
} from './types';

import {
  Deprecated_IClassification,
  Deprecated_IClassificationNode,
} from '../classifications/types';

describe('objectsReducer - selectors', () => {
  it('should have a selectFilter selector', () => {
    // selectors grab data from the whole store so we need to create a store objects like the one in reducers/index.js for the tests to work
    const state = initialState.setIn(['request', 'SearchValue', 'Value'], 'abc');
    const store = { objects: state };

    // we pass the store to our selector
    const result = selectFilter(store as never);

    // we check that it grabs the expected value
    expect(result).toEqual('abc');
  });
  it('should have a selectLibraries selector', () => {
    const libraries = [ContentManagementLibrary.Platform, ContentManagementLibrary.Entity];
    const state = initialState.setIn(['request', 'ContentManagementLibraries'], libraries);
    const store = { objects: state };

    const result = selectLibraries(store as never);

    expect(result).toEqual(libraries);
  });
  it('should have a selectObjects selector', () => {
    const objects: SearchResponseDocument[] = [
      { Id: 1, Name: 'ABC', CreatorName: 'DEF', Description: 'GHI', BimScore: 100 },
    ];
    const state = initialState.set('objects', objects);
    const store = { objects: state };

    const result = selectObjects(store as never);

    expect(result).toEqual(objects);
  });
  it('should have a selectSoftwaresFilter selector', () => {
    const requestFilters: ValueContainerFilter[] = [
      {
        Property: FilterProperty.Software,
        Alias: FilterAlias.Software,
        Values: ['revit-2019', 'revit-2021'],
      },
    ];
    const responseFilters: StaticFilters = {
      Softwares: [
        { Name: 'Sketchup', Value: 'sketchup', Count: 12, IsChecked: false },
        { Name: 'Revit 2019', Value: 'revit-2019', Count: 3, IsChecked: false },
        { Name: 'Revit 2020', Value: 'revit-2020', Count: 5, IsChecked: false },
        { Name: 'Revit 2021', Value: 'revit-2021', Count: 6, IsChecked: false },
      ],
    };

    const state = initialState
      .setIn(['request', 'SearchContainerFilter', 'ValueContainerFilter'], requestFilters)
      .setIn(['response', 'StaticFilters'], responseFilters);
    const store = {
      objects: state,
      appState: initialAppState,
    };

    const result = selectSoftwaresFilter(store as never);

    const expected: ImmutableArray<FormattedFilter> = Immutable([
      { label: 'Revit 2019', value: 'revit-2019', count: 3, selected: true },
      { label: 'Revit 2020', value: 'revit-2020', count: 5, selected: false },
      { label: 'Revit 2021', value: 'revit-2021', count: 6, selected: true },
      { label: 'Sketchup', value: 'sketchup', count: 12, selected: false },
    ]);
    expect(result).toEqual(expected);
  });
  it('should have a selectTagsFilter selector', () => {
    const requestFilters: ValueContainerFilter[] = [
      { Property: FilterProperty.Tag, Alias: FilterAlias.Tag, Values: ['nd1', 'nd3'] },
    ];
    const responseFilters: StaticFilters = {
      Pins: [
        { Name: 'ND1', Value: 'nd1', Count: 12, IsChecked: false },
        { Name: 'ND2', Value: 'nd2', Count: 3, IsChecked: false },
        { Name: 'ND3', Value: 'nd3', Count: 5, IsChecked: false },
        { Name: 'ND4', Value: 'nd4', Count: 6, IsChecked: false },
      ],
    };
    const state = initialState
      .setIn(['request', 'SearchContainerFilter', 'ValueContainerFilter'], requestFilters)
      .setIn(['response', 'StaticFilters'], responseFilters);
    const store = {
      objects: state,
      appState: initialAppState,
    };

    const result = selectTagsFilter(store as never);

    const expected: ImmutableArray<FormattedFilter> = Immutable([
      { label: 'ND1', value: 'nd1', count: 12, selected: true },
      { label: 'ND2', value: 'nd2', count: 3, selected: false },
      { label: 'ND3', value: 'nd3', count: 5, selected: true },
      { label: 'ND4', value: 'nd4', count: 6, selected: false },
    ]);
    expect(result).toEqual(expected);
  });
  it('should have a selectLodsFilter selector', () => {
    const requestFilters: ValueContainerFilter[] = [
      { Property: FilterProperty.Lod, Alias: FilterAlias.Lod, Values: ['200', '300'] },
    ];
    const responseFilters: StaticFilters = {
      Lod: [
        { Name: '100', Value: '100', Count: 12, IsChecked: false },
        { Name: '200', Value: '200', Count: 3, IsChecked: false },
        { Name: '300', Value: '300', Count: 5, IsChecked: false },
        { Name: '400', Value: '400', Count: 6, IsChecked: false },
      ],
    };
    const state = initialState
      .setIn(['request', 'SearchContainerFilter', 'ValueContainerFilter'], requestFilters)
      .setIn(['response', 'StaticFilters'], responseFilters);
    const store = {
      objects: state,
      appState: initialAppState,
    };

    const result = selectLodsFilter(store as never);

    const expected: ImmutableArray<FormattedFilter> = Immutable([
      { label: '100', value: '100', count: 12, selected: false },
      { label: '200', value: '200', count: 3, selected: true },
      { label: '300', value: '300', count: 5, selected: true },
      { label: '400', value: '400', count: 6, selected: false },
    ]);
    expect(result).toEqual(expected);
  });
  it('should have a selectClassificationsFilter selector', () => {
    const requestFilters: ValueContainerFilter[] = [
      {
        Property: FilterProperty.Classification,
        Alias: FilterAlias.Classification,
        Values: ['1', '3'],
      },
    ];
    const responseFilters: StaticFilters = {
      Classifications: [
        { Name: 'Etim V7', Value: '1', Count: 12, IsChecked: false },
        { Name: 'BIM & CO', Value: '2', Count: 12, IsChecked: false },
        { Name: 'Omniclass', Value: '3', Count: 12, IsChecked: false },
        { Name: 'Axima', Value: '4', Count: 12, IsChecked: false },
      ],
    };
    const state = initialState
      .setIn(['request', 'SearchContainerFilter', 'ValueContainerFilter'], requestFilters)
      .setIn(['response', 'StaticFilters'], responseFilters);
    const store = {
      objects: state,
      appState: initialAppState,
    };

    const result = selectClassificationsFilter(store as never);

    const expected: ImmutableArray<FormattedFilter> = Immutable([
      { label: 'Axima', value: '4', count: 12, selected: false },
      { label: 'BIM & CO', value: '2', count: 12, selected: false },
      { label: 'Etim V7', value: '1', count: 12, selected: true },
      { label: 'Omniclass', value: '3', count: 12, selected: true },
    ]);
    expect(result).toEqual(expected);
  });
  it.skip('should have a selectClassificationNodesFilter selector', () => {
    const requestFilters: ValueContainerFilter[] = [
      {
        Property: FilterProperty.ClassificationNode,
        Alias: FilterAlias.ClassificationNode,
        Values: ['100', '101', '200', '201', '202'],
      },
    ];
    const responseFilters: StaticFilters = {
      Classifications: [
        { Name: 'Elec parent 0', Value: '100', Count: 12, IsChecked: false },
        { Name: 'Elec child 1', Value: '101', Count: 12, IsChecked: false },
        { Name: 'Elec child 2', Value: '102', Count: 12, IsChecked: false },
        { Name: 'Elec child 3', Value: '103', Count: 12, IsChecked: false },
        { Name: 'Plumbery parent 0', Value: '200', Count: 3, IsChecked: false },
        { Name: 'Plumbery child 1', Value: '201', Count: 3, IsChecked: false },
        { Name: 'Plumbery child 2', Value: '202', Count: 3, IsChecked: false },
        { Name: 'Plumbery child 3', Value: '203', Count: 3, IsChecked: false },
      ],
    };
    const state = initialState
      .setIn(['request', 'SearchContainerFilter', 'ValueContainerFilter'], requestFilters)
      .setIn(['response', 'StaticFilters'], responseFilters);
    const store = {
      objects: state,
      appState: initialAppState,
    };

    const result = selectClassificationsFilter(store as never);

    const expected: ImmutableArray<FormattedFilter> = Immutable([
      { label: 'Elec child 1', value: '101', count: 12, selected: true },
      { label: 'Elec child 2', value: '102', count: 12, selected: false },
      { label: 'Elec child 3', value: '103', count: 12, selected: false },
      { label: 'Elec parent 0', value: '100', count: 12, selected: true },
      { label: 'Plumbery child 1', value: '201', count: 3, selected: true },
      { label: 'Plumbery child 2', value: '202', count: 3, selected: true },
      { label: 'Plumbery child 3', value: '203', count: 3, selected: false },
      { label: 'Plumbery parent 0', value: '200', count: 3, selected: true },
    ]);
    expect(result).toEqual(expected);
  });
  it('should have a selectManufacturersFilter selector', () => {
    const requestFilters: ValueContainerFilter[] = [
      {
        Property: FilterProperty.Manufacturer,
        Alias: FilterAlias.Manufacturer,
        Values: ['bosch', 'rexel'],
      },
    ];
    const responseFilters: StaticFilters = {
      Manufacturers: [
        { Name: 'Bosch', Value: 'bosch', Count: 12, IsChecked: false },
        { Name: 'Engie', Value: 'engie', Count: 3, IsChecked: false },
        { Name: 'Rexel', Value: 'rexel', Count: 5, IsChecked: false },
        { Name: 'GA', Value: 'ga', Count: 6, IsChecked: false },
      ],
    };
    const state = initialState
      .setIn(['request', 'SearchContainerFilter', 'ValueContainerFilter'], requestFilters)
      .setIn(['response', 'StaticFilters'], responseFilters);
    const store = {
      objects: state,
      appState: initialAppState,
    };

    const result = selectManufacturersFilter(store as never);

    const expected: ImmutableArray<FormattedFilter> = Immutable([
      { label: 'Bosch', value: 'bosch', count: 12, selected: true },
      { label: 'Engie', value: 'engie', count: 3, selected: false },
      { label: 'GA', value: 'ga', count: 6, selected: false },
      { label: 'Rexel', value: 'rexel', count: 5, selected: true },
    ]);
    expect(result).toEqual(expected);
  });
  it('should have a selectProperties filter', () => {
    const requestFilters: ValueContainerFilter[] = [
      {
        Property: FilterProperty.Property,
        Alias: FilterAlias.Property,
        PropertyId: '3',
        Values: ['200', '300'],
      },
    ];
    const responseFilters: StaticFilters = {
      PropertiesList: [
        { Name: 'Width', Value: '1', Count: 12, IsChecked: false },
        { Name: 'Height', Value: '2', Count: 3, IsChecked: false },
        { Name: 'Depth', Value: '3', Count: 5, IsChecked: false },
        { Name: 'Weight', Value: '4', Count: 6, IsChecked: false },
      ],
      'VariantProperties.Properties-3': [
        { Name: '100mm', Value: '100', Count: 1, IsChecked: false },
        { Name: '200mm', Value: '200', Count: 2, IsChecked: false },
        { Name: '300mm', Value: '300', Count: 3, IsChecked: false },
        { Name: '400mm', Value: '400', Count: 4, IsChecked: false },
      ],
    };
    const state = initialState
      .setIn(['request', 'SearchContainerFilter', 'ValueContainerFilter'], requestFilters)
      .setIn(['response', 'StaticFilters'], responseFilters);
    const store = { objects: state };

    const result = selectProperties(store as never);

    const expectedValues: PropertyValue[] = [
      { label: '100mm', value: '100', selected: false },
      { label: '200mm', value: '200', selected: true },
      { label: '300mm', value: '300', selected: true },
      { label: '400mm', value: '400', selected: false },
    ];
    const expected: ImmutableArray<Property> = Immutable([
      { id: '1', name: 'Width', values: [], selected: false },
      { id: '2', name: 'Height', values: [], selected: false },
      { id: '3', name: 'Depth', values: expectedValues, selected: true },
      { id: '4', name: 'Weight', values: [], selected: false },
    ]);
    expect(result).toEqual(expected);
  });
  it('should have a selectSelectedClassification selector', () => {
    const classification: Deprecated_IClassification = {
      Classification: 1,
      Name: 'abc',
      ColorCode: 'def',
    };

    const state = initialState.set('selectedClassification', classification);
    const store = { objects: state };

    const result = selectSelectedClassification(store as never);

    expect(result).toEqual(classification);
  });
  it('should have a selectSelectedClassification selector', () => {
    const node: Deprecated_IClassificationNode = {
      Id: '1',
      Name: 'abc',
      Children: [],
      color: 'azure',
    };

    const state = initialState.set('selectedNode', node);
    const store = { objects: state };

    const result = selectSelectedNode(store as never);

    expect(result).toEqual(node);
  });
  it('should have a selectGroupId selector', () => {
    const group = {
      id: 3,
    };
    const state = initialState.set('group', group);
    const store = { objects: state };

    const result = selectGroupId(store as never);

    expect(result).toEqual(group.id);
  });
});