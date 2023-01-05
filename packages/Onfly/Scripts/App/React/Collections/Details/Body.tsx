import React from 'react';

import { Collection } from '../../../Reducers/Collections/types';
import { SearchObjectGroup } from '../../../Reducers/BimObject/types';
import { GroupType } from '../../../Reducers/groups/constants';

import EmptyState from '../EmptyStates';
import { Objects, Files } from '../../Search';

type Props = {
  collection: Collection;
  isBoostOffer: boolean;
  hasAccessToManageContents: boolean;
};

const Body: React.FC<Props> = ({ collection, isBoostOffer, hasAccessToManageContents }) => {
  /* Component states */
  // The collection is empty
  if (collection?.Statistics?.NbBimObjects <= 0) {
    return (
      <EmptyState.EmptyCollection
        collection={collection}
        hasAccessToManageContents={hasAccessToManageContents}
      />
    );
  }

  const props = {
    group: {
      id: collection?.Id,
      type: GroupType.Collection,
      isFavorite: collection?.IsFavorite,
    } as SearchObjectGroup,
  };

  if (isBoostOffer) {
    return <Files {...props} />;
  }

  return <Objects {...props} />;
};

export default Body;