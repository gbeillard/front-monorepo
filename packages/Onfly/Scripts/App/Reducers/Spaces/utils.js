import FlexSearch from 'flexsearch';
import { SortDirection } from '@bim-co/componentui-foundation';
import _ from 'underscore';
import { ONFLY_HTTP_PROTOCOL, ONFLY_DOMAIN } from '../../Api/constants';
import { ping } from '../../Utils/utils';
import { SpacesStatus } from './constants';

// Delete space
export const deleteSpace = (space, deletedSpaceId) =>
  space?.filter((space) => space.Id !== deletedSpaceId) ?? [];

export const parseNameToSubDomain = (name) => {
  const parsedName = name
    ?.replace(/ /g, '')
    .replace(/&/g, 'and')
    .replace(/œ/g, 'oe')
    .replace(/[^0-9a-zA-Z]+/g, '-')
    .replace(/^\-+|\-+$/g, '')
    .toLowerCase();
  return parsedName;
};

// Search space
export const searchSpaces = (spaces, search) => {
  if (search && search.trim() !== '') {
    const index = new FlexSearch({
      encode: 'advanced',
      tokenize: 'reverse',
      doc: {
        id: 'Id',
        field: 'Name',
      },
    });

    index.add(spaces);

    const searchItems = search.split(/\s/).map((keyword) => ({
      bool: 'or',
      query: keyword,
      field: 'Name',
    }));

    const searchedSpaces = index.search(searchItems);
    return searchedSpaces;
  }
  return spaces;
};

export const retrieveUrlSpaceOnfly = (subDomain) =>
  `${ONFLY_HTTP_PROTOCOL}://${subDomain}${ONFLY_DOMAIN}`;


export const updateSpaceStatus = (spaces, space, status) => {
  if (!space) {
    return spaces;
  }
  const newSpaces = [...spaces];

  const index = newSpaces.findIndex((s) => s?.Id === space.Id);

  if (index > -1) {
    newSpaces[index] = {
      ...newSpaces[index],
      Status: status,
    };
  }
  return newSpaces;
};

export const spaceMapping = (id, space, parentSubDomain, user, role) => {
  const spaceRole = {
    Id: parseInt(role.RoleId),
    Key: role.RoleKey,
    Name: role.RoleName,
  };

  const spaceUser = {
    Id: user.id,
    FirstName: user.firstName,
    LastName: user.lastName,
  };

  const newSpace = {
    Id: id,
    ObjectsCount: 0,
    Role: spaceRole,
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
    UpdatedBy: spaceUser,
    CreatedBy: spaceUser,
    ...space,
    SubDomain: `${space.SubDomain}-${parentSubDomain}`,
  };
  return newSpace;
};

// update space
export const updateSpace = (spaces, updatedSpace) => {
  if (!updatedSpace) {
    return spaces;
  }

  const newSpaces = [...spaces];

  const index = newSpaces.findIndex((space) => space?.Id === updatedSpace.Id);

  if (index > -1) {
    // Update space
    newSpaces[index] = {
      ...newSpaces[index],
      ...updatedSpace,
    };
  }

  return newSpaces;
};

const getSpaceValue = (object, field) => {
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

// Sort
export const sortObjectArray = (array, field, order) => {
  const sortedArray = _.sortBy(array, (object) => getSpaceValue(object, field) ?? '');

  if (order === SortDirection.Desc) {
    sortedArray?.reverse();
  }

  return sortedArray;
};

// add requestid to space
export const addAskAuthorization = (spaces, spaceId, requestId) => {
  if (!spaceId) {
    return spaces;
  }
  const newSpaces = [...spaces];

  const index = newSpaces.findIndex((s) => s?.Id === spaceId);

  if (index > -1) {
    newSpaces[index] = {
      ...newSpaces[index],
      AccessRequest: {
        Id: requestId,
      },
    };
  }
  return newSpaces;
};

export const setDefaultStatus = (spaces) => spaces?.map((space) => ({
  ...space,
  Status: space?.AccessRequest ? SpacesStatus.RequestAccessSend : null,
}));

export default {
  retrieveUrlSpaceOnfly,
  searchSpaces,
  parseNameToSubDomain,
  updateSpaceStatus,
  deleteSpace,
  updateSpace,
};
