import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { EmptyState as EmptyStateDS } from '@bim-co/componentui-foundation';
import { selectTranslatedResources } from '../../../../../../Reducers/app/selectors';

type Props = {
  resources: any;
};

const mapSelectToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

// Empty state - The object has not subsets
const EmptyStateObjectHasNotSubsets: React.FC<Props> = ({ resources }) => (
  <EmptyStateDS
    title={resources.ObjectPropertiesManager.ObjectHasNotSubsetsTitle}
    description={resources.ObjectPropertiesManager.ObjectHasNotSubsetsDescription}
  />
);

export const ObjectHasNotSubsets = connect(mapSelectToProps)(EmptyStateObjectHasNotSubsets);