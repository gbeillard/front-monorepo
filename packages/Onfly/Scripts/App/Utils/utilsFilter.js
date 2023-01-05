import _ from 'underscore';

export const type = {
  DOMAIN: 'domain',
  PROPERTIES: 'properties',
  DICTIONARY: 'dictionary',
  PROPERTIES_GROUP: 'properties-group',
  IFC_PROPERTY: 'ifc-property',
};

export function addFilter(filterList, type, values, callBack) {
  const newFilterList = filterList;
  const filterIndex = _.findLastIndex(newFilterList, { type });

  // Filter exist
  if (filterIndex > -1) {
    const filterValue = newFilterList[filterIndex].values;

    if (!_.contains(filterValue, values)) {
      newFilterList[filterIndex].values.push(values);
    }
  } else {
    let filterValue = values;

    if (!_.isArray(values)) {
      filterValue = [values];
    }

    const filter = { type, values: filterValue };

    newFilterList.push(filter);
  }

  if (callBack != null) {
    callBack(newFilterList);
  }
}

export function removeFilter(filterList, type, values, callBack) {
  const newFilterList = filterList;
  const filterIndex = _.findLastIndex(newFilterList, { type });

  // Filter exist
  if (filterIndex > -1) {
    const filterValue = newFilterList[filterIndex].values;

    if (_.isArray(values)) {
      let paramValues = [];
      paramValues = paramValues.concat(values);
      _.each(paramValues, (val) => {
        const indexValue = newFilterList[filterIndex].values.indexOf(val);
        if (indexValue > -1) {
          newFilterList[filterIndex].values.splice(indexValue, 1);
        }
      });

      if (newFilterList[filterIndex].values.length == 0) {
        newFilterList.splice(filterIndex, 1);
      }
    } else if (_.contains(filterValue, values)) {
      if (filterValue.length > 1) {
        const indexValue = filterValue.indexOf(values);
        if (indexValue > -1) {
          newFilterList[filterIndex].values.splice(indexValue, 1);
        }
      } else {
        newFilterList.splice(filterIndex, 1);
      }
    }

    if (callBack != null) {
      callBack(newFilterList);
    }
  }
}

export function getFilterValues(filterList, type) {
  const filterDomainIndex = _.findLastIndex(filterList, { type });
  let filterValues = [];

  if (filterDomainIndex > -1) {
    filterValues = filterList[filterDomainIndex].values;
  }

  return filterValues;
}

export const checkFilter = (filterValues, values, filterType = '') => {
  let filtered = false;

  if (filterValues.length > 0) {
    if (_.isArray(values)) {
      if (values.length > 0) {
        filtered = filterValues.some((v) => values.includes(v));
      }
    } else {
      switch (filterType) {
        case 'ifc-property':
          filtered = values != '';
          break;
        case '':
          filtered = _.contains(filterValues, values);
          break;
      }
    }
  } else {
    filtered = true;
  }

  return filtered;
};
