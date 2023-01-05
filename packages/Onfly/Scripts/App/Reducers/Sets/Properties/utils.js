import FlexSearch from 'flexsearch';
import _ from 'underscore';
import { SortDirection } from '@bim-co/componentui-foundation';

export const searchProperties = (properties, search) => {
  if (search && search.trim() !== '') {
    const index = new FlexSearch({
      encode: 'advanced',
      tokenize: 'reverse',
      doc: {
        id: 'Id',
        field: 'Name',
      },
    });

    index.add(properties);

    const searchItems = search.split(/\s/).map((keyword) => ({
      bool: 'or',
      query: keyword,
      field: 'Name',
    }));

    const searchedProperties = index.search(searchItems);
    return searchedProperties;
  }

  return properties;
};

// Sort
export const sortObjectArray = (array, field, order) => {
  const sortedArray = _.sortBy(array, (object) => getPropertyValue(object, field) ?? '');

  if (order === SortDirection.Desc) {
    sortedArray?.reverse();
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

export const extractDomains = (properties) => {
  const domainsList = [];
  (properties || []).forEach((property) => {
    if (domainsList.findIndex((domain) => domain.Id === property?.Domain?.Id) < 0) {
      domainsList.push(property?.Domain);
    }
  });
  return domainsList;
};

export const filterByDomain = (properties, domain) => {
  if (domain == null) {
    return properties;
  }

  return properties.filter((property) => property?.Domain?.Id === domain?.Id);
};
