import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { EmptyState as EmptyStateDS } from '@bim-co/componentui-foundation';
import { selectTranslatedResources } from '../../Reducers/app/selectors';

type Props = {
  resources: any;
};

const mapSelectToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

// Empty state - Error
const EmptyStateError: React.FC<Props> = ({ resources }) => (
  <EmptyStateDS
    title={resources.ContentManagementEmptyState.ErrorTitle}
    description={resources.ContentManagementEmptyState.ErrorDescription}
  />
);

export const Error = connect(mapSelectToProps)(EmptyStateError);

// Empty state - No search results
const EmptyStateNoSearchResults: React.FC<Props> = ({ resources }) => (
  <EmptyStateDS
    title={resources.ContentManagementEmptyState.NoSearchResultsTitle}
    description={resources.ContentManagementEmptyState.NoSearchResultsDescription}
  />
);

export const NoSearchResults = connect(mapSelectToProps)(EmptyStateNoSearchResults);