/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { getColorNameFromId } from '@bim-co/componentui-foundation';
import FlexSearch from 'flexsearch';
import _ from 'underscore';

// Add subsets
export const addSubsets = (subsets, updatedSubsets) => {
  const newSubsets = updatedSubsets?.filter((subset) => !hasSubset(subsets, subset));
  return (subsets || []).concat(newSubsets);
};

// Edit subsets
export const editSubsets = (subsets, updatedSubsets) => {
  const newSubsets = [...subsets];

  if (newSubsets) {
    updatedSubsets?.forEach((subset) => {
      // Find by name
      const index = newSubsets.findIndex((newSubset) => newSubset?.Name === subset?.Name);

      if (index > -1) {
        // Update subset id
        newSubsets[index] = {
          ...newSubsets[index],
          Id: subset?.Id,
        };
      }
    });
  }

  return newSubsets;
};

// Check if subsets has subset with the same name
export const hasSubset = (subsetList, subset) =>
  subsetList?.findIndex((s) => s?.Name === subset?.Name) > -1;

// Dropdown options
export const createSubsetOption = (subset) => ({
  value: subset?.Id > 0 ? subset?.Id : subset?.Name,
  label: subset?.Name,
  color: getColorNameFromId(subset?.Id),
});

// Filter by Set
export const filterBySet = (subsets, set) => {
  if (set == null) {
    return subsets;
  }

  return subsets.filter((subset) => subset?.Set?.Id === set?.Id);
};

export const extractSets = (subsets) => {
  let setsList = [];
  subsets.forEach((subset) => {
    if (setsList.findIndex((set) => set.Id === subset?.Set?.Id) < 0) {
      setsList.push(subset?.Set);
    }
  });
  setsList = _.sortBy(setsList, (set) => set.Name?.toLowerCase());
  return setsList;
};

/**
 * @deprecated
 * @param {string} text The text to normalize
 */
export const normalizeFilterText = (text) =>
  text
    .toLowerCase()
    .replace(/-/, ' ')
    .replace(/_/, ' ')
    .split(/\s/)
    .filter((word) => word.length > 2);

const getHasText = (text) => text.length > 0 && text[0].length > 0;

const matchText = (text, subset, fields) =>
  text.filter((word) =>
    (fields || []).find((field) => subset[field] && subset[field].toLowerCase().includes(word))
  ).length > 0;

const searchFlex = (filter, subset, fields) => {
  const hasText = getHasText(filter);
  if (!hasText) {
    return true;
  }

  return matchText(filter, subset, fields);
};

/**
 * Filters a list of subsets with a given string
 * @param {Subset[]} subsets the list to filter
 * @param {string} filter the string to find
 * @param {string[]} fieldNames a list of fields (for each item in the list)
 */
export const getSubsetsFilteredByText = (subsets, filter, fieldNames = ['Name']) => {
  if (!filter && filter.trim() === '') {
    return subsets;
  }

  const logicalSearchField = fieldNames.length > 1 ? 'or' : 'and';
  const search = [filter];

  const index = new FlexSearch({
    encode: 'advanced',
    tokenize: 'full',
    doc: {
      id: 'Id',
      field: fieldNames,
    },
  });
  index.add(subsets);

  let searchItems = [];

  fieldNames.forEach((fieldName) => {
    const searchItemsInField = search.map((keyword) => ({
      bool: logicalSearchField,
      query: keyword,
      field: fieldName,
    }));
    searchItems = searchItems.concat(searchItemsInField);
  });
  return index.search(searchItems);
};
