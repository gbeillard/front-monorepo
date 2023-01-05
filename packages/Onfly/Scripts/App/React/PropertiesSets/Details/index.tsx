import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import toastr from 'toastr';

/* Types */
import { SortDirection } from '@bim-co/componentui-foundation';
import { useParams } from 'react-router-dom';
import {
  Property,
  FilterSort,
  PropertySubsetsError,
} from '../../../Reducers/Sets/Properties/types';
import { Set } from '../../../Reducers/properties-sets/types';
import { Subset, CreateSubsetSuccess } from '../../../Reducers/Sets/Subsets/types';

/* Actions */
import { setPageTitle as setPageTitleAction } from '../../../Reducers/app/actions';
import {
  fetchProperties as fetchPropertiesAction,
  setFilterSearch as setFilterSearchAction,
  setFilterSort as setFilterSortAction,
  editProperties as editPropertiesAction,
  updatePropertySubsets as updatePropertySubsetsAction,
  deleteProperties as deletePropertiesAction,
  addProperties as addPropertiesAction,
} from '../../../Reducers/Sets/Properties/actions';
import { fetchSet as fetchSetAction } from '../../../Reducers/properties-sets/actions';
import {
  fetchSubsets as fetchSubsetsAction,
  createSubset as createSubsetAction,
  editSubsets as editSubsetsAction,
  addSubsets as addSubsetsAction,
  addSubsetProperties as addSubsetPropertiesAction,
  deleteSubsetProperties as deleteSubsetPropertiesAction,
} from '../../../Reducers/Sets/Subsets/actions';

/* Selectors */
import {
  selectTranslatedResources,
  selectLanguageCode,
  selectSettings,
} from '../../../Reducers/app/selectors';
import {
  selectProperties,
  selectFilteredProperties,
  selectFilterSort,
  selectFetchPropertiesIsSuccess,
  selectFetchPropertiesIsPending,
  selectFetchPropertiesIsError,
  selectUpdatePropertySubsetsIsError,
  selectDeletePropertiesIsError,
  selectAddPropertiesIsError,
} from '../../../Reducers/Sets/Properties/selectors';
import {
  selectSet,
  selectFetchSetIsSuccess,
  selectFetchSetIsPending,
  selectFetchSetIsError,
} from '../../../Reducers/properties-sets/selectors';
import {
  selectSubsetsWithoutDefaultSorted,
  selectFetchSubsetsIsError,
  selectCreateSubsetIsSuccess,
  selectCreateSubsetIsError,
  selectAddSubsetPropertiesIsError,
  selectDeleteSubsetPropertiesIsError,
} from '../../../Reducers/Sets/Subsets/selectors';

/* Utils */
import { editSubsets as utilEditSubsets } from '../../../Reducers/Sets/Subsets/utils';

import Component from './component';
import Page from '../../CommonsElements/PageContentContainer';
import Page404 from '../../ErrorPage/Page404';

type Props = {
  languageCode: string;
  resources: any;
  settings: any;
  set: Set;
  properties: Property[];
  subsets: Subset[];
  filteredProperties: Property[];
  filterSort: FilterSort;
  fetchPropertiesIsSuccess: boolean;
  fetchPropertiesIsPending: boolean;
  fetchPropertiesIsError: string;
  fetchSetIsSuccess: boolean;
  fetchSetIsPending: boolean;
  fetchSetIsError: string;
  fetchSubsetsIsError: string;
  createSubsetIsSuccess?: CreateSubsetSuccess;
  createSubsetIsError: string;
  updatePropertySubsetsIsError: PropertySubsetsError;
  addSubsetPropertiesIsError: string;
  deleteSubsetPropertiesIsError: string;
  deletePropertiesIsError: string;
  addPropertiesIsError: string;
  setPageTitle: (title: string) => void;
  fetchSet: (id: number) => void;
  fetchProperties: (setId: number) => void;
  setFilterSearch: (search: string) => void;
  setFilterSort: (field: string, order: SortDirection) => void;
  fetchSubsets: (setId: number) => void;
  editProperties: (properties: Property[]) => void;
  createSubset: (setId: number, subset: Subset, properties?: Property[]) => void;
  editSubsets: (subsets: Subset[]) => void;
  addSubsets: (subsets: Subset[]) => void;
  updatePropertySubsets: (
    setId: number,
    propertyId: number,
    subsets: Subset[],
    keepPropertiesWithValue?: boolean
  ) => void;
  addSubsetProperties: (setId: number, subsetId: number, propertyIds: number[]) => void;
  deleteSubsetProperties: (
    setId: number,
    subsetId: number,
    propertyIds: number[],
    keepPropertiesWithValue?: boolean
  ) => void;
  deleteProperties: (
    setId: number,
    properties: Property[],
    keepPropertiesWithValue?: boolean
  ) => void;
  addProperties: (setId: number, properties: Property[]) => void;
};

const PropertiesSets: React.FC<Props> = ({
  // mapSelectToProps
  resources,
  languageCode,
  settings,
  set,
  properties,
  filteredProperties,
  filterSort,
  subsets,
  fetchPropertiesIsSuccess,
  fetchPropertiesIsPending,
  fetchPropertiesIsError,
  fetchSetIsSuccess,
  fetchSetIsPending,
  fetchSetIsError,
  fetchSubsetsIsError,
  createSubsetIsSuccess,
  createSubsetIsError,
  updatePropertySubsetsIsError,
  addSubsetPropertiesIsError,
  deleteSubsetPropertiesIsError,
  deletePropertiesIsError,
  addPropertiesIsError,
  // mapDispatchToProps
  setPageTitle,
  fetchSet,
  fetchProperties,
  setFilterSearch,
  setFilterSort,
  fetchSubsets,
  editProperties,
  createSubset,
  editSubsets,
  addSubsets,
  updatePropertySubsets,
  addSubsetProperties,
  deleteSubsetProperties,
  deleteProperties,
  addProperties,
}) => {
  const { setId } = useParams();

  useEffect(() => {
    // Load set
    fetchSet(parseInt(setId));

    // Load subsets of set
    fetchSubsets(parseInt(setId));

    // Default filters
    setFilterSearch('');
    setFilterSort('Name', SortDirection.Asc);
  }, []);

  useEffect(() => {
    // Load properties
    fetchProperties(parseInt(setId));
  }, [languageCode]);

  useEffect(() => {
    // Page title
    let pageTitle = resources.ContentManagement.YourSet;

    if (!settings?.EnableSetsManagement) {
      setPageTitle(resources.ContentManagement.Error404);
    } else if (fetchSetIsSuccess && pageTitle && set?.Name) {
      pageTitle = pageTitle.replace('[SetName]', set?.Name);
      setPageTitle(pageTitle);
    } else if (fetchSetIsError) {
      // Error when set is loading or set is public
      setPageTitle(resources.ContentManagementEmptyState.SetDoesNotExistTitle);
    }
  }, [languageCode, fetchSetIsSuccess, fetchSetIsError]);

  /* Success and error handler */

  useEffect(() => {
    // Loading of subsets failed
    if (fetchSetIsSuccess && fetchSubsetsIsError) {
      toastr.error(resources.ContentManagement.LoadingSubsetsFailed, fetchSubsetsIsError);
    }
  }, [fetchSetIsSuccess, fetchSubsetsIsError]);

  useEffect(() => {
    if (createSubsetIsSuccess) {
      const { subset } = createSubsetIsSuccess;

      const updatedProperties = createSubsetIsSuccess?.properties?.map((updatedProperty) => {
        const property: Property = properties.find((p) => p?.Id === updatedProperty?.Id);

        if (property) {
          return {
            ...property,
            Subsets: utilEditSubsets(property.Subsets, [subset]),
          };
        }
      });

      if (updatedProperties) {
        editProperties(updatedProperties);
      }

      editSubsets([subset]);
    }
  }, [createSubsetIsSuccess]);

  useEffect(() => {
    // Create subset failed
    if (createSubsetIsError) {
      toastr.error(resources.ContentManagement.CreateSubsetFailed, createSubsetIsError);
    }
  }, [createSubsetIsError]);

  useEffect(() => {
    // Update property subsets failed
    if (updatePropertySubsetsIsError) {
      toastr.error(updatePropertySubsetsIsError.message);
    }
  }, [updatePropertySubsetsIsError]);

  useEffect(() => {
    // Add properties to subset failed
    if (addSubsetPropertiesIsError) {
      toastr.error(
        resources.ContentManagement.AddSubsetPropertiesFailed,
        addSubsetPropertiesIsError
      );
    }
  }, [addSubsetPropertiesIsError]);

  useEffect(() => {
    // Delete subset properties failed
    if (deleteSubsetPropertiesIsError) {
      toastr.error(
        resources.ContentManagement.DeleteSubsetPropertiesFailed,
        deleteSubsetPropertiesIsError
      );
    }
  }, [deleteSubsetPropertiesIsError]);

  useEffect(() => {
    // Delete properties failed
    if (deletePropertiesIsError) {
      toastr.error(resources.ContentManagement.DeleteSetPropertiesFailed, deletePropertiesIsError);
    }
  }, [deletePropertiesIsError]);

  useEffect(() => {
    // Add properties failed
    if (addPropertiesIsError) {
      toastr.error(resources.ContentManagement.AddSetPropertiesFailed, addPropertiesIsError);
    }
  }, [addPropertiesIsError]);

  if (!settings?.EnableSetsManagement) {
    return <Page404 />;
  }

  return (
    <Page>
      <Component
        languageCode={languageCode}
        resources={resources}
        set={set}
        properties={properties}
        subsets={subsets}
        filteredProperties={filteredProperties}
        filterSort={filterSort}
        setFilterSearch={setFilterSearch}
        setFilterSort={setFilterSort}
        fetchPropertiesIsSuccess={fetchPropertiesIsSuccess}
        fetchPropertiesIsPending={fetchPropertiesIsPending}
        fetchPropertiesIsError={fetchPropertiesIsError}
        fetchSetIsPending={fetchSetIsPending}
        fetchSetIsError={fetchSetIsError}
        editProperties={editProperties}
        createSubset={createSubset}
        addSubsets={addSubsets}
        updatePropertySubsets={updatePropertySubsets}
        addSubsetProperties={addSubsetProperties}
        deleteSubsetProperties={deleteSubsetProperties}
        deleteProperties={deleteProperties}
        addProperties={addProperties}
      />
    </Page>
  );
};

const mapSelectToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  languageCode: selectLanguageCode,
  settings: selectSettings,
  set: selectSet,
  properties: selectProperties,
  filteredProperties: selectFilteredProperties,
  filterSort: selectFilterSort,
  subsets: selectSubsetsWithoutDefaultSorted,
  fetchPropertiesIsError: selectFetchPropertiesIsError,
  fetchPropertiesIsSuccess: selectFetchPropertiesIsSuccess,
  fetchPropertiesIsPending: selectFetchPropertiesIsPending,
  fetchSetIsSuccess: selectFetchSetIsSuccess,
  fetchSetIsPending: selectFetchSetIsPending,
  fetchSetIsError: selectFetchSetIsError,
  fetchSubsetsIsError: selectFetchSubsetsIsError,
  createSubsetIsSuccess: selectCreateSubsetIsSuccess,
  createSubsetIsError: selectCreateSubsetIsError,
  updatePropertySubsetsIsError: selectUpdatePropertySubsetsIsError,
  addSubsetPropertiesIsError: selectAddSubsetPropertiesIsError,
  deleteSubsetPropertiesIsError: selectDeleteSubsetPropertiesIsError,
  deletePropertiesIsError: selectDeletePropertiesIsError,
  addPropertiesIsError: selectAddPropertiesIsError,
});

const mapDispatchToProps = (dispatch) => ({
  setPageTitle: (title: string) => dispatch(setPageTitleAction(title)),
  fetchSet: (id: number) => dispatch(fetchSetAction(id)),
  fetchProperties: (setId: number) => dispatch(fetchPropertiesAction(setId)),
  setFilterSearch: (search: string) => dispatch(setFilterSearchAction(search)),
  setFilterSort: (field: string, order: SortDirection) =>
    dispatch(setFilterSortAction(field, order)),
  fetchSubsets: (setId: number) => dispatch(fetchSubsetsAction(setId)),
  editProperties: (properties: Property[]) => dispatch(editPropertiesAction(properties)),
  createSubset: (setId: number, subset: Subset, properties?: Property[]) =>
    dispatch(createSubsetAction(setId, subset, properties)),
  editSubsets: (subsets: Subset[]) => dispatch(editSubsetsAction(subsets)),
  addSubsets: (subsets: Subset[]) => dispatch(addSubsetsAction(subsets)),
  updatePropertySubsets: (
    setId: number,
    propertyId: number,
    subsets: Subset[],
    keepPropertiesWithValue?: boolean
  ) => dispatch(updatePropertySubsetsAction(setId, propertyId, subsets, keepPropertiesWithValue)),
  addSubsetProperties: (setId: number, subsetId: number, propertyIds: number[]) =>
    dispatch(addSubsetPropertiesAction(setId, subsetId, propertyIds)),
  deleteSubsetProperties: (
    setId: number,
    subsetId: number,
    propertyIds: number[],
    keepPropertiesWithValue?: boolean
  ) =>
    dispatch(deleteSubsetPropertiesAction(setId, subsetId, propertyIds, keepPropertiesWithValue)),
  deleteProperties: (setId: number, properties: Property[], keepPropertiesWithValue?: boolean) =>
    dispatch(deletePropertiesAction(setId, properties, keepPropertiesWithValue)),
  addProperties: (setId: number, properties: Property[]) =>
    dispatch(addPropertiesAction(setId, properties)),
});

export default connect(mapSelectToProps, mapDispatchToProps)(PropertiesSets);