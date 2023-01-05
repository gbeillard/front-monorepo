import { GroupType } from './constants';

export const getGroupTypeLabels = (resources) => ({
  [GroupType.Project]: resources?.ContentManagement.GroupeTypeProject,
  [GroupType.Collection]: resources?.ContentManagement.GroupeTypeCollection,
});

export const getGroupTypeLabel = (resources, type) => getGroupTypeLabels(resources)[type];

export const getGroupName = (resources, name, type) => {
  if (type) {
    return `${name} (${getGroupTypeLabel(resources, type)})`;
  }

  return name;
};
