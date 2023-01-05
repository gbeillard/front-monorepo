import React, { useState } from 'react';

import { View } from './types';

/* Connectors */

import { BimObjectProps } from '../../../../../Reducers/BimObject/connectors';

import { BimObjectUserProps } from '../../../../../Reducers/BimObject/Users/connectors';

import { BimObjectPropertiesProps } from '../../../../../Reducers/BimObject/Properties/connectors';

import { BimObjectSubsetsProps } from '../../../../../Reducers/BimObject/Subsets/connectors';

import { BimObjectPropertiesSubsetsProps } from '../../../../../Reducers/BimObject/Properties/Subsets/connectors';

/* Components */

import Header from './Header';
import Body from './Body';
import Loader from '../../../../CommonsElements/Loader';
import EmptyState from '../../../EmptyStates';

type Props = {
  userIsUnauthorized: boolean;
  objectDoesNotExist: boolean;
} & BimObjectProps &
  BimObjectUserProps &
  BimObjectPropertiesProps &
  BimObjectSubsetsProps &
  BimObjectPropertiesSubsetsProps;

const Component: React.FunctionComponent<Props> = ({
  userIsUnauthorized,
  objectDoesNotExist,
  // Connectors
  bimObjectProps,
  bimObjectUserProps,
  bimObjectPropertiesProps,
  bimObjectSubsetsProps,
  bimObjectPropertiesSubsetsProps,
}) => {
  const [view, setView] = useState(View.Properties);

  if (bimObjectUserProps?.fetchAutorizationIsPending || bimObjectProps?.fetchBimObjectIsPending) {
    return <Loader />;
  }

  // Error when object informations is loading  or object is deleted
  if (objectDoesNotExist) {
    return <EmptyState.ObjectDoesNotExist />;
  }

  // The user is unauthorized to edit object variants or object properties
  if (userIsUnauthorized) {
    return <EmptyState.ObjectUnauthorized />;
  }

  return (
    <>
      <Header
        view={view}
        bimObjectProps={bimObjectProps}
        bimObjectPropertiesProps={bimObjectPropertiesProps}
        bimObjectSubsetsProps={bimObjectSubsetsProps}
        onViewChange={setView}
      />
      <Body
        view={view}
        bimObjectProps={bimObjectProps}
        bimObjectPropertiesProps={bimObjectPropertiesProps}
        bimObjectSubsetsProps={bimObjectSubsetsProps}
        bimObjectPropertiesSubsetsProps={bimObjectPropertiesSubsetsProps}
      />
    </>
  );
};

export default Component;