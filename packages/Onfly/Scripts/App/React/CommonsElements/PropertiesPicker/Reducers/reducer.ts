import {
  UPDATE_SUBSET,
  UPDATE_PROPERTIES,
  SELECT_SUBSET,
  SELECT_PROPERTY,
  SELECT_ALL_SUBSETS,
  SELECT_ALL_PROPERTIES,
  UNSELECT_ALL_SUBSETS,
  UNSELECT_ALL_PROPERTIES,
  REMOVE_SELECTED_SUBSET,
  REMOVE_SELECTED_PROPERTY,
  UNSELECT_ALL,
} from './types';

/**
 * Reducer to manage menu global states
 * @param state
 * @param action
 */

export const modalReducer = ({ subsets, properties }, action) => {
  let newSubsetList = [...subsets.list];
  let newPropertiesList = [...properties.list];
  let newSubsetSelections = [...subsets.selections];
  let newPropertiesSelections = [...properties.selections];
  switch (action.type) {
    case UPDATE_SUBSET: {
      newSubsetList = action?.payload;
      break;
    }
    case UPDATE_PROPERTIES: {
      newPropertiesList = action?.payload;
      break;
    }
    case SELECT_SUBSET: {
      const itemChanged = action?.payload;
      const indexOfItem = newSubsetSelections.findIndex((item) => item?.Id === itemChanged?.Id);
      if (indexOfItem >= 0) {
        newSubsetSelections = newSubsetSelections.filter((item) => item?.Id !== itemChanged?.Id);
      } else {
        newSubsetSelections.push(itemChanged);
      }
      break;
    }
    case SELECT_PROPERTY: {
      const itemChanged = action?.payload;
      const indexOfItem = newPropertiesSelections.findIndex((item) => item?.Id === itemChanged?.Id);
      if (indexOfItem >= 0) {
        newPropertiesSelections = newPropertiesSelections.filter(
          (item) => item?.Id !== itemChanged?.Id
        );
      } else {
        newPropertiesSelections.push(itemChanged);
      }
      break;
    }
    case SELECT_ALL_SUBSETS: {
      if (newSubsetList?.length > 0 && newSubsetList.length === newSubsetSelections.length) {
        newSubsetSelections = [];
      } else {
        newSubsetList.forEach((subset) => {
          const indexOfItem = newSubsetSelections.findIndex((item) => item?.Id === subset?.Id);
          if (indexOfItem < 0) {
            newSubsetSelections.push(subset);
          }
        });
      }
      break;
    }
    case SELECT_ALL_PROPERTIES: {
      if (
        newPropertiesList?.length > 0 &&
        newPropertiesList.length === newPropertiesSelections.length
      ) {
        newPropertiesSelections = [];
      } else {
        newPropertiesList.forEach((subset) => {
          const indexOfItem = newPropertiesSelections.findIndex((item) => item?.Id === subset?.Id);
          if (indexOfItem < 0) {
            newPropertiesSelections.push(subset);
          }
        });
      }
      break;
    }
    case UNSELECT_ALL_SUBSETS: {
      newSubsetSelections = [];
      break;
    }
    case UNSELECT_ALL_PROPERTIES: {
      newPropertiesSelections = [];
      break;
    }
    case REMOVE_SELECTED_SUBSET: {
      const itemChanged = action?.payload;
      const indexOfItem = newSubsetSelections.findIndex((item) => item?.Id === itemChanged?.Id);
      if (indexOfItem >= 0) {
        newSubsetSelections = newSubsetSelections.filter((item) => item?.Id !== itemChanged?.Id);
      }
      break;
    }
    case REMOVE_SELECTED_PROPERTY: {
      const itemChanged = action?.payload;
      const indexOfItem = newPropertiesSelections.findIndex((item) => item?.Id === itemChanged?.Id);
      if (indexOfItem >= 0) {
        newPropertiesSelections = newPropertiesSelections.filter(
          (item) => item?.Id !== itemChanged?.Id
        );
      }
      break;
    }
    case UNSELECT_ALL: {
      newSubsetSelections = [];
      newPropertiesSelections = [];
      break;
    }
    default:
      break;
  }
  return {
    subsets: { list: newSubsetList, selections: newSubsetSelections },
    properties: { list: newPropertiesList, selections: newPropertiesSelections },
  };
};