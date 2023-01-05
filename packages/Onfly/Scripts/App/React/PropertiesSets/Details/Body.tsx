import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

import { space, SortDirection, defaultTheme } from '@bim-co/componentui-foundation';
import { Set } from '../../../Reducers/properties-sets/types';
import { Property, FilterSort } from '../../../Reducers/Sets/Properties/types';
import { Subset } from '../../../Reducers/Sets/Subsets/types';

import { replaceStringByComponent } from '../../../Utils/utilsResources';

import PropertiesList from './PropertiesList';
import PropertiesToolbar from './PropertiesToolbar';
import EmptyStateGlobal from '../../EmptyStates';
import EmptyStateSet from '../EmptyStates';
import Loader from '../../CommonsElements/Loader';
import DeleteConfirm from '../DeleteConfirm';

type Props = {
  resources: any;
  set: Set;
  properties: Property[];
  subsets: Subset[];
  filteredProperties: Property[];
  filterSort: FilterSort;
  fetchPropertiesIsSuccess: boolean;
  fetchPropertiesIsPending: boolean;
  setFilterSort: (field: string, order: SortDirection) => void;
  editProperties: (properties: Property[]) => void;
  createSubset: (setId: number, subset: Subset, properties?: Property[]) => void;
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
};

const BodyContainer = styled.div`
  min-width: min-content;
  padding-bottom: ${space[1600]};
`;

const ModalDeletePropertyName = styled.span`
  color: ${defaultTheme.primaryColor};
`;

const Body: React.FunctionComponent<Props> = ({
  resources,
  set,
  properties,
  filteredProperties,
  filterSort,
  subsets,
  fetchPropertiesIsSuccess,
  fetchPropertiesIsPending,
  setFilterSort,
  editProperties,
  createSubset,
  addSubsets,
  updatePropertySubsets,
  addSubsetProperties,
  deleteSubsetProperties,
  deleteProperties,
}) => {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [propertiesToDelete, setPropertiesToDelete] = useState<Property[]>([]);

  useEffect(() => {
    // Update selected properties
    if (selectedProperties?.length > 0) {
      const updatedSelectedProperties = properties?.filter(
        (property) =>
          selectedProperties?.findIndex(
            (selectedProperty) => selectedProperty?.Id === property?.Id
          ) > -1
      );

      setSelectedProperties(updatedSelectedProperties);
    }
  }, [properties]);

  const nbProperties = properties?.length;
  const nbFilteredProperties = filteredProperties?.length;

  const selectAllProperties = () => {
    if (properties) {
      setSelectedProperties(properties);
    }
  };

  const resetSelectedProperties = () => setSelectedProperties([]);

  // Sélectionne ou désélectionne la propriété
  const selectProperty = (property: Property) => {
    if (!property) {
      return;
    }

    const selectedIndex = selectedProperties.findIndex(
      (selectedProperty) => selectedProperty?.Id === property?.Id
    );

    let newSelectedProperties = [];

    // Ajoute la nouvelle propriété
    if (selectedIndex === -1) {
      newSelectedProperties = newSelectedProperties.concat(selectedProperties, property);
    }
    // Retire la propriété déjà sélectionnée
    else if (selectedIndex === 0) {
      // Propriété en première position du tableau
      newSelectedProperties = newSelectedProperties.concat(selectedProperties.slice(1));
    } else if (selectedIndex === selectedProperties.length - 1) {
      // Propriété au milieu du tableau
      newSelectedProperties = newSelectedProperties.concat(selectedProperties.slice(0, -1));
    } else if (selectedIndex > 0) {
      // Propriété en dernière position du tableau
      newSelectedProperties = newSelectedProperties.concat(
        selectedProperties.slice(0, selectedIndex),
        selectedProperties.slice(selectedIndex + 1)
      );
    }

    setSelectedProperties(newSelectedProperties);
  };

  const openDeleteModal = (properties: Property[]) => {
    setPropertiesToDelete(properties);
    setModalDeleteIsOpen(true);
  };

  const handleDeleteModalCancel = () => {
    setModalDeleteIsOpen(false);
  };

  const handleDeleteModalSubmit = (keepPropertiesWithValue: boolean) => {
    setModalDeleteIsOpen(false);
    deleteProperties(set?.Id, propertiesToDelete, keepPropertiesWithValue);
  };

  const getDeleteModalTitle = () => {
    if (propertiesToDelete?.length === 1) {
      const title = resources.ContentManagement.DeleteSetPropertyModalTitle;
      const propertyName = (
        <ModalDeletePropertyName>{propertiesToDelete[0]?.Name}</ModalDeletePropertyName>
      );

      return replaceStringByComponent(title, '[PropertyName]', propertyName);
    }

    return resources.ContentManagement.DeleteSetPropertiesModalTitle;
  };

  const getDeleteModalDescription = () => {
    if (propertiesToDelete?.length === 1) {
      return resources.ContentManagement.DeleteSetPropertyModalDescription;
    }

    return resources.ContentManagement.DeleteSetPropertiesModalDescription;
  };

  /* Component states */
  // The properties of set is loading
  if (fetchPropertiesIsPending) {
    return <Loader />;
  }

  // The set has no properties
  if (fetchPropertiesIsSuccess && nbProperties === 0) {
    return <EmptyStateSet.EmptySet setName={set?.Name} />;
  }

  // The search returned no results
  if (fetchPropertiesIsSuccess && nbProperties > 0 && nbFilteredProperties === 0) {
    return <EmptyStateGlobal.NoSearchResults />;
  }

  return (
    <BodyContainer>
      <PropertiesList
        resources={resources}
        set={set}
        properties={properties}
        subsets={subsets}
        filteredProperties={filteredProperties}
        filterSort={filterSort}
        selectedProperties={selectedProperties}
        selectAllProperties={selectAllProperties}
        resetSelectedProperties={resetSelectedProperties}
        selectProperty={selectProperty}
        setFilterSort={setFilterSort}
        editProperties={editProperties}
        createSubset={createSubset}
        addSubsets={addSubsets}
        updatePropertySubsets={updatePropertySubsets}
        addSubsetProperties={addSubsetProperties}
        deleteSubsetProperties={deleteSubsetProperties}
        openDeleteModal={openDeleteModal}
      />
      <PropertiesToolbar
        resources={resources}
        set={set}
        selectedProperties={selectedProperties}
        subsets={subsets}
        editProperties={editProperties}
        createSubset={createSubset}
        addSubsets={addSubsets}
        updatePropertySubsets={updatePropertySubsets}
        addSubsetProperties={addSubsetProperties}
        deleteSubsetProperties={deleteSubsetProperties}
        openDeleteModal={openDeleteModal}
      />
      <DeleteConfirm
        isDisplayed={modalDeleteIsOpen}
        title={getDeleteModalTitle()}
        description={getDeleteModalDescription()}
        checkboxLabel={resources.ContentManagementPropSetForm.ModalConfirmCheckbox}
        submitButtonLabel={resources.MetaResource.Delete}
        onCancel={handleDeleteModalCancel}
        onSubmit={(keepPropertiesWithValue) => handleDeleteModalSubmit(keepPropertiesWithValue)}
      />
    </BodyContainer>
  );
};

export default Body;