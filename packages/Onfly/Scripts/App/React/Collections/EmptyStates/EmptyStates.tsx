import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { EmptyState as EmptyStateDS, Icon } from '@bim-co/componentui-foundation';
import { useNavigate } from 'react-router-dom';
import { Collection } from '../../../Reducers/Collections/types';

import {
  selectTranslatedResources,
  selectLanguageCode,
  selectIsBoostOffer,
} from '../../../Reducers/app/selectors';

import { replaceStringByComponent } from '../../../Utils/utilsResources';
import { RoutePaths } from '../../Sidebar/RoutePaths';

type Props = {
  resources: any;
  languageCode: string;
};

// Empty state - Empty collection
type EmptyCollectionProps = Props & {
  collection: Collection;
  isBoostOffer: boolean;
  hasAccessToManageContents: boolean;
};

const EmptyStateEmptyCollection: React.FC<EmptyCollectionProps> = ({
  resources,
  languageCode,
  collection,
  isBoostOffer,
  hasAccessToManageContents,
}) => {
  const navigate = useNavigate();
  let title = collection?.IsFavorite
    ? resources.ContentManagementCollectionsEmptyState.EmptyMyFavoritesCollectionTitle
    : resources.ContentManagementCollectionsEmptyState.EmptyCollectionTitle;
  let description = collection?.IsFavorite
    ? resources.ContentManagementCollectionsEmptyState.EmptyMyFavoritesCollectionDescription
    : resources.ContentManagementCollectionsEmptyState.EmptyCollectionDescription;

  title = title?.replace('[CollectionName]', collection?.Name) ?? title;

  const actionLabel = collection?.IsFavorite
    ? resources.ContentManagementCollectionsEmptyState.EmptyMyFavoritesCollectionAction
    : resources.ContentManagement.MenuItemManageContents;
  const url = `/${languageCode}/${collection?.IsFavorite ? (isBoostOffer ? 'files' : 'bimobjects') : RoutePaths.ManageContents
    }`;

  if (!hasAccessToManageContents && !collection?.IsFavorite) {
    return (
      <EmptyStateDS
        title={title}
        description={description}
        actionLabel={actionLabel}
        onClickAction={() => navigate(url)}
      />
    );
  }

  if (collection?.IsFavorite) {
    description = replaceStringByComponent(
      description as string,
      '[FavoriteIcon]',
      <Icon icon="favorite-outline" size="xs" />
    );
  } else {
    description =
      description?.replace(
        '[ManageObject]',
        resources.ContentManagement.MenuItemManageContents?.trim()
      ) ?? description;
  }

  return (
    <EmptyStateDS
      title={title}
      description={description}
      actionLabel={actionLabel}
      onClickAction={() => navigate(url)}
    />
  );
};

const mapSelectToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  languageCode: selectLanguageCode,
  isBoostOffer: selectIsBoostOffer,
});

export const EmptyCollection = connect(mapSelectToProps)(EmptyStateEmptyCollection);

// Empty state - Collection does not exist
const EmptyStateCollectionDoesNotExist: React.FC<Props> = ({ resources, languageCode }) => {
  const navigate = useNavigate();
  return (
    <EmptyStateDS
      title={resources.ContentManagementCollectionsEmptyState.CollectionDoesNotExistTitle}
      description={
        resources.ContentManagementCollectionsEmptyState.CollectionDoesNotExistDescription
      }
      actionLabel={resources.ContentManagementCollectionsEmptyState.CollectionDoesNotExistAction}
      onClickAction={() => navigate(`/${languageCode}/collections`)}
    />
  );
};

export const CollectionDoesNotExist = connect(mapSelectToProps)(EmptyStateCollectionDoesNotExist);