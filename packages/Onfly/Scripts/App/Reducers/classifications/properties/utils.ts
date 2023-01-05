import FlexSearch from 'flexsearch';
import _ from 'underscore';
import { SubsetSource } from '../../Sets/Subsets/types';
import { NodeProperty } from './types';

export const getSourceSubset = (property: NodeProperty) =>
  property.Subsets.find((subset) => subset.Sources.includes(SubsetSource.Node));

/**
 * Search for a text into a list
 * @param properties List of properties
 * @param filter the text to search for
 * @param fieldNames list of fields to search in
 */
export const searchProperties = (
  properties: NodeProperty[],
  filter: string,
  fieldNames: string[] = ['Name']
): NodeProperty[] => {
  if (!filter || filter.trim() === '') {
    return properties;
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
  index.add(properties);

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