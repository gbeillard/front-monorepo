import FlexSearch from 'flexsearch';
import { CollectionStatus } from './constants';

// Delete collection
export const deleteCollection = (collections, deletedCollectionId) =>
  collections?.filter((collection) => collection?.Id !== deletedCollectionId) ?? [];

export const getCollectionStatusLabels = (resources) => ({
  [CollectionStatus.Private]: resources.ContentManagementCollections.PrivateStatus,
  [CollectionStatus.Shared]: resources.ContentManagementCollections.SharedStatus,
  [CollectionStatus.Public]: resources.ContentManagementCollections.PublicStatus,
});

export const getCollectionStatusLabel = (resources, status) =>
  getCollectionStatusLabels(resources)[status];

// Search collection
export const searchCollections = (collections, search) => {
  if (search && search.trim() !== '') {
    const index = new FlexSearch({
      encode: 'advanced',
      tokenize: 'reverse',
      doc: {
        id: 'Id',
        field: 'Name',
      },
    });

    index.add(collections);

    const searchItems = search.split(/\s/).map((keyword) => ({
      bool: 'or',
      query: keyword,
      field: 'Name',
    }));

    const searchedCollections = index.search(searchItems);
    return searchedCollections;
  }

  return collections;
};

// update collection
export const updateCollection = (collections, updatedCollection) => {
  if (!updatedCollection) {
    return collections;
  }

  const newCollections = [...collections];

  const index = newCollections.findIndex((collection) => collection?.Id === updatedCollection.Id);

  if (index > -1) {
    // Update collection
    newCollections[index] = {
      ...newCollections[index],
      ...updatedCollection,
    };
  }

  return newCollections;
};
