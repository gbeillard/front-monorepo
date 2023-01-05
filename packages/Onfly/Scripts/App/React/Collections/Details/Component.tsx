import React from 'react';

import { Loader } from '@bim-co/componentui-foundation';
import { Collection } from '../../../Reducers/Collections/types';

import Header from './Header';
import Body from './Body';
import EmptyState from '../EmptyStates';

type Props = {
  resources: any;
  hasAccessToManageContents: boolean;
  collection: Collection;
  fetchCollectionIsPending: boolean;
  fetchCollectionIsError: string;
  isBoostOffer: boolean;
};

const Component: React.FC<Props> = ({
  resources,
  hasAccessToManageContents,
  collection,
  fetchCollectionIsPending,
  fetchCollectionIsError,
  isBoostOffer,
}) => {
  if (fetchCollectionIsPending) {
    return <Loader />;
  }

  /* Component states */
  // Error when collection is loading
  if (fetchCollectionIsError) {
    return <EmptyState.CollectionDoesNotExist />;
  }

  return (
    <>
      <Header resources={resources} hasAccessToManageContents={hasAccessToManageContents} />
      <Body
        collection={collection}
        isBoostOffer={isBoostOffer}
        hasAccessToManageContents={hasAccessToManageContents}
      />
    </>
  );
};

export default Component;