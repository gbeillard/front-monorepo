import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { EmptyState as EmptyStateDS } from '@bim-co/componentui-foundation';

import { selectTranslatedResources } from '../../../Reducers/app/selectors';

type Props = {
  resources: any;
};
const EmptySpaceList: React.FC<Props> = ({ resources }) => {
  const title = resources.Spaces.EmptyListTitle;
  const description = resources.Spaces.EmptyListDescription;

  return <EmptyStateDS title={title} description={description} />;
};

const mapSelectToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export const EmptySpacesList = connect(mapSelectToProps)(EmptySpaceList);