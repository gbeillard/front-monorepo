import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { EmptyState as EmptyStateDS } from '@bim-co/componentui-foundation';
import { useNavigate } from 'react-router-dom';
import { selectTranslatedResources, selectLanguageCode } from '../../../Reducers/app/selectors';

type Props = {
  resources: any;
  languageCode: string;
};

const mapSelectToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  languageCode: selectLanguageCode,
});

// Empty state - Unauthorized
const EmptyStateObjectUnauthorized: React.FC<Props> = ({ resources, languageCode }) => {
  const navigate = useNavigate();

  const onClick = () => navigate(`/${languageCode}/bimobjects`);

  return (
    <EmptyStateDS
      title={resources.BimObjectAccessAuthorizeAttribute.NoAuthorize}
      actionLabel={resources.ContentManagementEmptyState.BackToHomeAction}
      onClickAction={onClick}
    />
  );
};
export const ObjectUnauthorized = connect(mapSelectToProps)(EmptyStateObjectUnauthorized);

// Empty state - Object does not exist
const EmptyStateObjectDoesNotExist: React.FC<Props> = ({ resources, languageCode }) => {
  const navigate = useNavigate();
  return (
    <EmptyStateDS
      title={resources.ContentManagementEmptyState.ObjectDoesNotExistTitle}
      actionLabel={resources.ContentManagementEmptyState.BackToHomeAction}
      onClickAction={() => navigate(`/${languageCode}/bimobjects`)}
    />
  );
};
export const ObjectDoesNotExist = connect(mapSelectToProps)(EmptyStateObjectDoesNotExist);