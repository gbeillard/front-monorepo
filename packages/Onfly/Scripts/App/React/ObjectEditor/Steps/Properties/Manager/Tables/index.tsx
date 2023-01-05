import React, { useState } from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

/* Types */

import { defaultTheme } from '@bim-co/componentui-foundation';
import { Property } from '../../../../../../Reducers/BimObject/Properties/types';

import { Subset, SubsetForDisplay } from '../../../../../../Reducers/Sets/Subsets/types';

/* Connectors */

import { BimObjectProps } from '../../../../../../Reducers/BimObject/connectors';

import { BimObjectPropertiesProps } from '../../../../../../Reducers/BimObject/Properties/connectors';

import { BimObjectSubsetsProps } from '../../../../../../Reducers/BimObject/Subsets/connectors';

import { BimObjectPropertiesSubsetsProps } from '../../../../../../Reducers/BimObject/Properties/Subsets/connectors';

/* Selectors */
import { selectTranslatedResources } from '../../../../../../Reducers/app/selectors';

import { selectAllSubsetsForDisplaySorted } from '../../../../../../Reducers/Sets/Subsets/selectors';

import { View, PropertiesView } from '../types';

import { replaceStringByComponent } from '../../../../../../Utils/utilsResources';

import PropertyAttributesTable from './PropertyAttributesTable';
import PropertySubsetsTable from './PropertySubsetsTable';
import SubsetsTable from './SubsetsTable';
import DeleteConfirm from '../../../../../PropertiesSets/DeleteConfirm';
import EmptyStateGlobal from '../../../../../EmptyStates';

type Props = {
  resources: any;
  allSubsetsForDisplaySorted: SubsetForDisplay[];
  view: View;
  propertiesView: PropertiesView;
} & BimObjectProps &
  BimObjectPropertiesProps &
  BimObjectSubsetsProps &
  BimObjectPropertiesSubsetsProps;

const TablesContainer: React.FunctionComponent<Props> = ({
  view,
  propertiesView,
  // Connectors
  bimObjectProps,
  bimObjectPropertiesProps,
  bimObjectSubsetsProps,
  bimObjectPropertiesSubsetsProps,
  // mapSelectToProps
  resources,
  allSubsetsForDisplaySorted,
}) => {
  const [propertyToDelete, setPropertyToDelete] = useState<Property>(null);
  const [isModalDeletePropertyOpen, setIsModalDeletePropertyOpen] = useState(false);
  const [subsetToDelete, setsubsetToDelete] = useState<Subset>(null);
  const [isModalDeleteSubsetOpen, setIsModalDeleteSubsetOpen] = useState(false);

  const bimObjectId = bimObjectProps?.bimObject?.Id;
  const nbProperties = bimObjectPropertiesProps?.properties?.length;
  const nbFilteredProperties = bimObjectPropertiesProps?.filteredProperties?.length;
  const nbSubsets = bimObjectSubsetsProps?.subsets?.length;
  const nbFilteredSubsets = bimObjectSubsetsProps?.filteredSubsets?.length;

  const openDeletePropertyModal = (property: Property) => {
    setPropertyToDelete(property);
    setIsModalDeletePropertyOpen(true);
  };

  const closeDeletePropertyModal = () => {
    setIsModalDeletePropertyOpen(false);
  };

  const openDeleteSubsetModal = (subset: Subset) => {
    setsubsetToDelete(subset);
    setIsModalDeleteSubsetOpen(true);
  };

  const closeDeleteSubsetModal = () => {
    setIsModalDeleteSubsetOpen(false);
  };

  const onDeletePropertyHandler = (property: Property) => {
    if (bimObjectId) {
      bimObjectPropertiesProps?.deleteProperty(bimObjectId, property?.Id);
    }
    closeDeletePropertyModal();
  };

  const onDeleteSubsetHandler = (subset: Subset, keepPropertiesWithValue: boolean) => {
    if (bimObjectId) {
      bimObjectSubsetsProps?.deleteSubset(bimObjectId, subset?.Id, keepPropertiesWithValue);
    }
    closeDeleteSubsetModal();
  };

  const getDeleteModalDescription = (description: string) => {
    const objectName = <TextPrimaryColor>{bimObjectProps?.bimObject?.Name}</TextPrimaryColor>;

    return replaceStringByComponent(description, '[ObjectName]', objectName);
  };

  const getDeleteModalPropertyTitle = () => {
    const title: string = resources.ObjectPropertiesManager.DeletePropertyTitle;
    const propertyName = <TextPrimaryColor>{propertyToDelete?.Name}</TextPrimaryColor>;

    return replaceStringByComponent(title, '[PropertyName]', propertyName);
  };

  const getDeleteModalSubsetTitle = () => {
    const title: string = resources.ObjectPropertiesManager.DeleteSubsetTitle;
    const setName = <TextPrimaryColor>{subsetToDelete?.Set?.Name}</TextPrimaryColor>;

    return replaceStringByComponent(title, '[SetName]', setName);
  };

  /* Component states */
  // The search of properties returned no results
  if (
    view === View.Properties &&
    bimObjectPropertiesProps?.fetchPropertiesIsSuccess &&
    bimObjectPropertiesProps?.filter?.text?.trim() !== '' &&
    nbProperties > 0 &&
    nbFilteredProperties === 0
  ) {
    return <EmptyStateGlobal.NoSearchResults />;
  }

  // The search of sets returned no results
  if (
    view === View.Sets &&
    bimObjectSubsetsProps?.fetchSubsetsIsSuccess &&
    bimObjectSubsetsProps?.filter?.text?.trim() !== '' &&
    nbSubsets > 0 &&
    nbFilteredSubsets === 0
  ) {
    return <EmptyStateGlobal.NoSearchResults />;
  }

  return (
    <>
      {view === View.Properties && propertiesView === PropertiesView.Attributes && (
        <PropertyAttributesTable
          properties={bimObjectPropertiesProps?.filteredProperties}
          onDelete={openDeletePropertyModal}
        />
      )}
      {view === View.Properties && propertiesView === PropertiesView.Subsets && (
        <PropertySubsetsTable
          properties={bimObjectPropertiesProps?.filteredProperties}
          allSubsets={allSubsetsForDisplaySorted}
          onDelete={openDeletePropertyModal}
          onAddSubset={(property, subset) =>
            bimObjectPropertiesSubsetsProps?.addSubsetToProperty(bimObjectId, property, subset)
          }
          onRemoveSubset={(property, subset) =>
            bimObjectPropertiesSubsetsProps?.removeSubsetFromProperty(bimObjectId, property, subset)
          }
        />
      )}
      {view === View.Sets && (
        <SubsetsTable
          subsets={bimObjectSubsetsProps?.filteredSubsets}
          onDelete={openDeleteSubsetModal}
        />
      )}
      <DeleteConfirm
        isDisplayed={isModalDeletePropertyOpen}
        title={getDeleteModalPropertyTitle()}
        description={getDeleteModalDescription(
          resources.ObjectPropertiesManager.DeletePropertyDescription as string
        )}
        submitButtonLabel={resources.ObjectPropertiesManager.DeletePropertyConfirm}
        onCancel={closeDeletePropertyModal}
        onSubmit={() => onDeletePropertyHandler(propertyToDelete)}
      />
      <DeleteConfirm
        isDisplayed={isModalDeleteSubsetOpen}
        title={getDeleteModalSubsetTitle()}
        description={getDeleteModalDescription(
          resources.ObjectPropertiesManager.DeleteSubsetDescription as string
        )}
        checkboxLabel={resources.ObjectPropertiesManager.DeleteSubsetCheckboxLabel}
        submitButtonLabel={resources.ObjectPropertiesManager.DeleteSubsetConfirm}
        onCancel={closeDeleteSubsetModal}
        onSubmit={(keepPropertiesWithValue) =>
          onDeleteSubsetHandler(subsetToDelete, keepPropertiesWithValue)
        }
      />
    </>
  );
};

const TextPrimaryColor = styled.span`
  color: ${defaultTheme.primaryColor};
`;

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  allSubsetsForDisplaySorted: selectAllSubsetsForDisplaySorted,
});

export default connect(mapStateToProps)(TablesContainer);