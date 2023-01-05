import React, { useState } from 'react';
import styled from '@emotion/styled';

/* Connectors */

import { space, defaultTheme } from '@bim-co/componentui-foundation';
import { BimObjectProps } from '../../../../../Reducers/BimObject/connectors';

import { BimObjectPropertiesProps } from '../../../../../Reducers/BimObject/Properties/connectors';

import { BimObjectSubsetsProps } from '../../../../../Reducers/BimObject/Subsets/connectors';

import { BimObjectPropertiesSubsetsProps } from '../../../../../Reducers/BimObject/Properties/Subsets/connectors';

import { View, PropertiesView } from './types';

import TablesContainer from './Tables';
import PropertyFilters from './Tables/PropertyFilters';
import EmptyState from './EmptyStates';
import EmptyStateGlobal from '../../../../EmptyStates';
import Loader from '../../../../CommonsElements/Loader';

type Props = {
  view: View;
} & BimObjectProps &
  BimObjectPropertiesProps &
  BimObjectSubsetsProps &
  BimObjectPropertiesSubsetsProps;

const Container = styled.div`
  flex-grow: 1;
  min-width: min-content;
  margin-bottom: ${space[100]};
  padding: ${space[100]} ${space[100]} ${space[600]};
  border-radius: ${defaultTheme.borderRadiusDense};
  background-color: ${defaultTheme.backgroundColor};
`;

const Body: React.FunctionComponent<Props> = ({
  view,
  // Connectors
  bimObjectProps,
  bimObjectPropertiesProps,
  bimObjectSubsetsProps,
  bimObjectPropertiesSubsetsProps,
}) => {
  const [propertiesView, setPropertiesView] = useState(PropertiesView.Attributes);

  /* Component states */
  // The load of properties is pending
  if (view === View.Properties && bimObjectPropertiesProps?.fetchPropertiesIsPending) {
    return <Loader />;
  }

  // The load of subsets is pending
  if (view === View.Sets && bimObjectSubsetsProps?.fetchSubsetsIsPending) {
    return <Loader />;
  }

  // The object has not subsets
  if (
    view === View.Sets &&
    bimObjectSubsetsProps?.fetchSubsetsIsSuccess &&
    bimObjectSubsetsProps?.subsets?.length === 0
  ) {
    return <EmptyState.ObjectHasNotSubsets />;
  }

  // Error when bimobject properties list is loading
  if (view === View.Properties && bimObjectPropertiesProps?.fetchPropertiesIsError) {
    return <EmptyStateGlobal.Error />;
  }

  // Error when bimobject subsets list is loading
  if (view === View.Sets && bimObjectSubsetsProps?.fetchSubsetsIsError) {
    return <EmptyStateGlobal.Error />;
  }

  return (
    <Container>
      <PropertyFilters
        view={view}
        propertiesView={propertiesView}
        domains={bimObjectPropertiesProps?.propertiesDomains}
        sets={view === View.Sets ? bimObjectSubsetsProps?.sets : bimObjectPropertiesProps?.sets}
        filter={
          view === View.Sets ? bimObjectSubsetsProps?.filter : bimObjectPropertiesProps?.filter
        }
        onViewChange={setPropertiesView}
        setFilter={
          view === View.Sets
            ? bimObjectSubsetsProps?.setFilter
            : bimObjectPropertiesProps?.setFilter
        }
      />
      <TablesContainer
        view={view}
        propertiesView={propertiesView}
        bimObjectProps={bimObjectProps}
        bimObjectPropertiesProps={bimObjectPropertiesProps}
        bimObjectSubsetsProps={bimObjectSubsetsProps}
        bimObjectPropertiesSubsetsProps={bimObjectPropertiesSubsetsProps}
      />
    </Container>
  );
};

export default Body;