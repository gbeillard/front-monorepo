import FlexSearch from 'flexsearch';
import _ from 'underscore';
import { SortDirection } from '@bim-co/componentui-foundation';
import * as Utils from '../../Utils/utils.js';

/**
 * Search for a text into a list
 * @param properties List of properties
 * @param filter the text to search for
 * @param fieldNames list of fields to search in
 */
export const searchProperties = (properties, filter, fieldNames = ['Name']) => {
  if (!filter || filter.trim() === '') {
    return properties;
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

  return index.search(searchItems);
};

// Sort
export const sortObjectArray = (array, field, order) => {
  const sortedArray = _.sortBy(array, (object) => getPropertyValue(object, field));

  if (order === SortDirection.Desc) {
    return sortedArray?.reverse();
  }

  return sortedArray;
};

const getPropertyValue = (object, field) => {
  let propertyValue;

  if (object && field) {
    const fields = field?.split('.');
    const firstField = fields?.shift();

    propertyValue = object[firstField];

    fields?.forEach((fieldName) => {
      if (propertyValue) {
        propertyValue = propertyValue[fieldName];
      }
    });
  }

  if (typeof propertyValue === 'string') {
    propertyValue = propertyValue.toLowerCase();
  }

  return propertyValue;
};

// Edit properties
export const editProperties = (properties, updatedProperties) => {
  const newProperties = [...properties];

  if (newProperties) {
    updatedProperties?.forEach((property) => {
      const index = newProperties.findIndex((newProperty) => newProperty?.Id === property?.Id);

      if (index > -1) {
        // Update subsets
        newProperties[index] = {
          ...newProperties[index],
          Subsets: property?.Subsets,
        };
      }
    });
  }

  return newProperties;
};

// Check if properties has a property
export const hasProperty = (properties, property) =>
  properties?.findIndex((p) => p?.Id === property?.Id) > -1;

// Delete properties
export const deleteProperties = (properties, deletedProperties) =>
  (properties || []).filter((property) => !hasProperty(deletedProperties, property));

/**
 * Extract the list of domains and sort them
 * @param {*} properties : the list of properties from which all domains are extracted
 */
export const extractDomains = (properties) => {
  let domainsList = [];
  (properties || []).forEach((property) => {
    if (domainsList.findIndex((domain) => domain.Id === property?.Domain?.Id) < 0) {
      domainsList.push(property?.Domain);
    }
  });
  domainsList = _.sortBy(domainsList, (domain) =>
    Utils.removeDiacritics(domain.Name).toLowerCase()
  );
  return domainsList;
};

export const filterByDomain = (properties, domain) => {
  if (domain == null) {
    return properties;
  }

  return properties.filter((property) => property?.Domain?.Id === domain?.Id);
};
