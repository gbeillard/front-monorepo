import { combineReducers } from 'redux';

import { reducers as OCReducers } from '@bim-co/onfly-connect';

import pinsReducer from './pins-reducer';
import usersReducer from './users-reducer';
import pluginReducer from './plugin/reducer';
import searchReducer from './search-reducer';
import manageSearchReducer from './manage-search-reducer';
import searchDocReducer from './search-doc-reducer';
import appReducer from './app-reducer';
import propertiesGroupReducer from './properties-group-reducer';
import createPropertyReducer from './create-property-reducer';
import groupsReducer from './groups-reducer';
import groupsReducerV2 from './groups/reducer';
import searchGroupReducer from './search-group-reducer';
import classificationsReducer from './classifications-reducer';
import classificationsReducer2 from './classifications/reducer';
import classificationsPropertiesReducer from './classifications/properties/reducer';
import classificationsPropertiesSubsetsReducer from './classifications/properties/subsets/reducer';
import classificationsSubsetsReducer from './classifications/subsets/reducer';
import domainsReducer from './properties/reducer';
import propertiesSetsReducer from './properties-sets/reducer';
import dictionaryReducer from './dictionary/reducer';
import objectsReducer from './BimObject/reducer';
import documentsReducer from './BimObject/Documents/reducer';
import variantsReducer from './BimObject/Variants/reducer';
import setPropertiesReducer from './Sets/Properties/reducer';
import setSubsetsReducer from './Sets/Subsets/reducer';
import propertiesV10Reducer from './PropertiesV10/reducer';
import bimObjectUsersReducer from './BimObject/Users/reducer';
import bimObjectPropertiesReducer from './BimObject/Properties/reducer';
import bimObjectSubsetsReducer from './BimObject/Subsets/reducer';
import bimObjectPropertiesSubsetsReducer from './BimObject/Properties/Subsets/reducer';
import preferencesReducer from './preferences/reducer';
import collectionsReducer from './Collections/reducer';
import spacesReducer from './Spaces/reducer';
import authenticationReducer from './authentication/reducer';

// Combine Reducers
const reducers = combineReducers({
  pinsState: pinsReducer,
  searchState: searchReducer,
  manageSearchState: manageSearchReducer,
  searchDocState: searchDocReducer,
  usersState: usersReducer,
  plugin: pluginReducer,
  appState: appReducer,
  propertiesGroupState: propertiesGroupReducer,
  createPropertyState: createPropertyReducer,
  groupsState: groupsReducer,
  searchGroupState: searchGroupReducer,
  classificationsState: classificationsReducer,
  classifications: classificationsReducer2,
  classificationsProperties: classificationsPropertiesReducer,
  classificationsPropertiesSubsets: classificationsPropertiesSubsetsReducer,
  classificationsSubsets: classificationsSubsetsReducer,
  domains: domainsReducer,
  propertiesSets: propertiesSetsReducer,
  groups: groupsReducerV2,
  dictionary: dictionaryReducer,
  objects: objectsReducer,
  documents: documentsReducer,
  variants: variantsReducer,
  setPropertiesState: setPropertiesReducer,
  setSubsetsState: setSubsetsReducer,
  propertiesV10State: propertiesV10Reducer,
  bimObjectUsersState: bimObjectUsersReducer,
  bimObjectPropertiesState: bimObjectPropertiesReducer,
  bimObjectSubsetsState: bimObjectSubsetsReducer,
  bimObjectPropertiesSubsetsState: bimObjectPropertiesSubsetsReducer,
  preferences: preferencesReducer,
  collectionsState: collectionsReducer,
  spacesState: spacesReducer,
  authentication: authenticationReducer,
  ...OCReducers,
});

export default reducers;
