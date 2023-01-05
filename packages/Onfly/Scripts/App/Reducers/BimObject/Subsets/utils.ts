import FlexSearch from 'flexsearch';
import { Set } from '../../properties-sets/types';
import { Subset } from '../../Sets/Subsets/types';
import { Filter } from './types';

/**
 * Search for a text into a list
 * @param subsets List of subsets
 * @param filter the text to search for
 * @param fieldNames list of fields to search in
 */
export const searchSubsets = (
  subsets: Subset[],
  filter: string,
  fieldNames: string[] = ['Name']
): Subset[] => {
  if (!filter || filter.trim() === '') {
    return subsets;
  }

  const logicalSearchField = fieldNames.length > 1 ? 'or' : 'and';
  const search = [filter];

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const index = new FlexSearch({
    encode: 'advanced',
    tokenize: 'full',
    doc: {
      id: 'Id',
      field: fieldNames,
    },
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return index.search(searchItems);
};

export const getFilteredSubsets = (subsets: Subset[], { text, setId }: Filter): Subset[] => {
  const textFilteredSubsets = searchSubsets(subsets, text, ['Name', 'Set:Name']);

  if (setId === null) {
    return textFilteredSubsets;
  }

  return textFilteredSubsets.filter((subset) => subset.Set.Id === setId);
};

export const getSets = (subsets: Subset[]): Set[] =>
  subsets.reduce(
    (sets: Set[], subset) =>
      sets.find((set) => set.Id === subset.Set.Id) ? sets : [...sets, subset.Set],
    []
  );