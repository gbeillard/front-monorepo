import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';
import toastr from 'toastr';
import { useParams } from 'react-router-dom';

/* Types */

import { ObjectStatus } from '../../../../../Reducers/BimObject/types';

/* Connectors */

import {
  BimObjectProps,
  BimObjectDispatchers,
  BimObjectSelectors,
  BimObjectMergeProps,
} from '../../../../../Reducers/BimObject/connectors';

import {
  BimObjectUserProps,
  BimObjectUserDispatchers,
  BimObjectUserSelectors,
  BimObjectUserMergeProps,
} from '../../../../../Reducers/BimObject/Users/connectors';

import {
  BimObjectPropertiesProps,
  BimObjectPropertiesDispatchers,
  BimObjectPropertiesSelectors,
  BimObjectPropertiesMergeProps,
} from '../../../../../Reducers/BimObject/Properties/connectors';

import {
  BimObjectSubsetsProps,
  BimObjectSubsetsDispatchers,
  BimObjectSubsetsSelectors,
  BimObjectSubsetsMergeProps,
} from '../../../../../Reducers/BimObject/Subsets/connectors';

import {
  BimObjectPropertiesSubsetsProps,
  BimObjectPropertiesSubsetsDispatchers,
  BimObjectPropertiesSubsetsSelectors,
  BimObjectPropertiesSubsetsMergeProps,
} from '../../../../../Reducers/BimObject/Properties/Subsets/connectors';

/* Selectors */
import { selectTranslatedResources, selectLanguageCode } from '../../../../../Reducers/app/selectors';

import { selectFetchAllSubsetsIsError } from '../../../../../Reducers/Sets/Subsets/selectors';

/* Actions */
import { setPageTitle as setPageTitleAction } from '../../../../../Reducers/app/actions';

import { fetchAllSubsets as fetchAllSubsetsAction } from '../../../../../Reducers/Sets/Subsets/actions';

import Component from './Component';
import PageContentContainer from '../../../../CommonsElements/PageContentContainer';
import { propertiesHasSet } from '../../../../../Reducers/BimObject/Properties/utils';

type Props = {
  languageCode: string;
  resources: any;
  allFetchSubsetsIsError: string;
  setPageTitle: (title: string) => void;
  fetchAllSubsets: () => void;
} & BimObjectProps &
  BimObjectUserProps &
  BimObjectPropertiesProps &
  BimObjectSubsetsProps &
  BimObjectPropertiesSubsetsProps;

const Page = styled(PageContentContainer)`
  display: flex;
  flex-direction: column;
`;

const PropertiesManager: React.FC<Props> = ({
  // Connectors
  bimObjectProps,
  bimObjectUserProps,
  bimObjectPropertiesProps,
  bimObjectSubsetsProps,
  bimObjectPropertiesSubsetsProps,
  // mapSelectToProps
  resources,
  languageCode,
  allFetchSubsetsIsError,
  // mapDispatchToProps
  setPageTitle,
  fetchAllSubsets,
}) => {
  const { bimobjectId } = useParams<{ bimobjectId: string }>();

  useEffect(() => {
    // Load user permissions
    bimObjectUserProps.fetchAuthorization(parseInt(bimobjectId));

    // Load all subsets
    fetchAllSubsets();

    // Load bimobject subsets
    bimObjectSubsetsProps.fetchSubsets(parseInt(bimobjectId));

    // Default filters
    const defaultFilter = {
      text: '',
      domainId: null,
      setId: null,
    };
    bimObjectSubsetsProps.setFilter(defaultFilter);
    bimObjectPropertiesProps.setFilter(defaultFilter);
  }, []);

  useEffect(() => {
    // Load bimobject informations
    bimObjectProps.fetchBimObject(parseInt(bimobjectId));

    // Load bimobject properties
    bimObjectPropertiesProps.fetchProperties(parseInt(bimobjectId));
  }, [languageCode]);

  useEffect(() => {
    // Page title

    // All bimboject informations was load
    if (
      !bimObjectUserProps?.fetchAutorizationIsPending &&
      !bimObjectProps?.fetchBimObjectIsPending
    ) {
      if (shouldObjectNotExist) {
        setPageTitle(resources.ContentManagementEmptyState.ObjectDoesNotExistTitle as string);
      } else if (bimObjectUserProps?.fetchAutorizationIsSuccess && isUserUnauthorized) {
        setPageTitle(resources.BimObjectAccessAuthorizeAttribute.NoAuthorize as string);
      } else if (bimObjectProps?.fetchBimObjectIsSuccess && bimObjectProps?.bimObject) {
        let pageTitle: string = resources.ObjectPropertiesManager.Title;
        pageTitle = pageTitle.replace('[ObjectName]', bimObjectProps.bimObject.Name);
        setPageTitle(pageTitle);
      }
    }
  }, [
    languageCode,
    bimObjectUserProps?.fetchAutorizationIsError,
    bimObjectUserProps?.fetchAutorizationIsSuccess,
    bimObjectProps?.fetchBimObjectIsError,
    bimObjectProps?.fetchBimObjectIsSuccess,
  ]);

  /* Success handler */

  useEffect(() => {
    // Refresh bimobject properties after added a new subset to object
    if (bimObjectSubsetsProps?.addSubsetsIsSuccess) {
      bimObjectPropertiesProps.fetchProperties(parseInt(bimobjectId));
    }
  }, [bimObjectSubsetsProps?.addSubsetsIsSuccess]);

  useEffect(() => {
    // Refresh bimobject properties after deleted a subset to object
    if (bimObjectSubsetsProps?.deleteSubsetIsSuccess) {
      bimObjectPropertiesProps.fetchProperties(parseInt(bimobjectId));
    }
  }, [bimObjectSubsetsProps?.deleteSubsetIsSuccess]);

  useEffect(() => {
    if (bimObjectPropertiesProps?.fetchPropertiesIsSuccess) {
      // Reset set filter when properties no longer have the set define in the filter
      let { filter } = bimObjectPropertiesProps;

      if (filter?.setId && !propertiesHasSet(bimObjectPropertiesProps.properties, filter?.setId)) {
        filter = {
          ...filter,
          setId: null,
        };

        bimObjectPropertiesProps.setFilter(filter);
      }
    }
  }, [bimObjectPropertiesProps?.fetchPropertiesIsSuccess]);

  /* Error handler */

  useEffect(() => {
    // Add properties failed
    if (bimObjectPropertiesProps?.addPropertiesIsError) {
      toastr.error(
        resources.ObjectPropertiesManager.AddPropertiesFailed,
        bimObjectPropertiesProps?.addPropertiesIsError
      );
    }
  }, [bimObjectPropertiesProps?.addPropertiesIsError]);

  useEffect(() => {
    // Delete property failed
    if (bimObjectPropertiesProps?.deletePropertyIsError) {
      toastr.error(
        resources.ObjectPropertiesManager.DeletePropertyFailed,
        bimObjectPropertiesProps?.deletePropertyIsError
      );
    }
  }, [bimObjectPropertiesProps?.deletePropertyIsError]);

  useEffect(() => {
    // Add subsets failed
    if (bimObjectSubsetsProps?.addSubsetsIsError) {
      toastr.error(
        resources.ObjectPropertiesManager.AddSubsetsFailed,
        bimObjectSubsetsProps?.addSubsetsIsError
      );
    }
  }, [bimObjectSubsetsProps?.addSubsetsIsError]);

  useEffect(() => {
    // Refresh bimobject properties after added a new subset to object
    if (bimObjectSubsetsProps?.addSubsetsIsSuccess) {
      bimObjectPropertiesProps.fetchProperties(parseInt(bimobjectId));
    }
  }, [bimObjectSubsetsProps?.addSubsetsIsSuccess]);

  useEffect(() => {
    // Refresh bimobject properties after deleted a subset to object
    if (bimObjectSubsetsProps?.deleteSubsetIsSuccess) {
      bimObjectPropertiesProps.fetchProperties(parseInt(bimobjectId));
    }
  }, [bimObjectSubsetsProps?.deleteSubsetIsSuccess]);

  useEffect(() => {
    // Delete subset from property
    if (bimObjectPropertiesSubsetsProps?.deleteSubsetIsError) {
      toastr.error(
        resources.ObjectPropertiesManager.DeletePropertySubsetFailed,
        bimObjectPropertiesSubsetsProps?.deleteSubsetIsError
      );
    }
  }, [bimObjectPropertiesSubsetsProps?.deleteSubsetIsError]);

  useEffect(() => {
    // Loading of subsets failed
    if (allFetchSubsetsIsError) {
      toastr.error(resources.ContentManagement.LoadingSubsetsFailed, allFetchSubsetsIsError);
    }
  }, [allFetchSubsetsIsError]);

  // User is unauthorized to edit object variants or object properties
  const isUserUnauthorized =
    !bimObjectUserProps?.userPermissionsByActionZone?.bimobject_variants ||
    !bimObjectUserProps?.userPermissionsByActionZone?.bimobject_properties;

  // Error when object informations is loading or object is deleted
  const shouldObjectNotExist =
    bimObjectProps?.fetchBimObjectIsError !== undefined ||
    bimObjectUserProps?.fetchAutorizationIsError !== undefined ||
    bimObjectProps?.bimObject?.Status === ObjectStatus.Deleted;

  return (
    <Page>
      <Component
        bimObjectProps={bimObjectProps}
        bimObjectUserProps={bimObjectUserProps}
        bimObjectPropertiesProps={bimObjectPropertiesProps}
        bimObjectSubsetsProps={bimObjectSubsetsProps}
        bimObjectPropertiesSubsetsProps={bimObjectPropertiesSubsetsProps}
        userIsUnauthorized={isUserUnauthorized}
        objectDoesNotExist={shouldObjectNotExist}
      />
    </Page>
  );
};

const mapSelectToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  languageCode: selectLanguageCode,
  allFetchSubsetsIsError: selectFetchAllSubsetsIsError,
  ...BimObjectSelectors,
  ...BimObjectUserSelectors,
  ...BimObjectPropertiesSelectors,
  ...BimObjectSubsetsSelectors,
  ...BimObjectPropertiesSubsetsSelectors,
});

const mapDispatchToProps = (dispatch) => ({
  setPageTitle: (title: string) => dispatch(setPageTitleAction(title)),
  fetchAllSubsets: () => dispatch(fetchAllSubsetsAction()),
  ...BimObjectDispatchers(dispatch),
  ...BimObjectUserDispatchers(dispatch),
  ...BimObjectPropertiesDispatchers(dispatch),
  ...BimObjectSubsetsDispatchers(dispatch),
  ...BimObjectPropertiesSubsetsDispatchers(dispatch),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  ...BimObjectMergeProps(stateProps, dispatchProps),
  ...BimObjectUserMergeProps(stateProps, dispatchProps),
  ...BimObjectPropertiesMergeProps(stateProps, dispatchProps),
  ...BimObjectSubsetsMergeProps(stateProps, dispatchProps),
  ...BimObjectPropertiesSubsetsMergeProps(stateProps, dispatchProps),
});

export default connect(mapSelectToProps, mapDispatchToProps, mergeProps)(PropertiesManager);