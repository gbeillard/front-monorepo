import React, { useEffect, useState } from 'react';
import Immutable from 'seamless-immutable';

import { Dropdown, FixedDropdown } from '@bim-co/componentui-foundation';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Set } from '../../../Reducers/properties-sets/types';
import { Property, PropertySubsetsError } from '../../../Reducers/Sets/Properties/types';
import { Subset, SubsetOption } from '../../../Reducers/Sets/Subsets/types';

import {
  addSubsets as utilAddSubsets,
  createSubsetOption,
  hasSubset,
} from '../../../Reducers/Sets/Subsets/utils';

import DeleteConfirm from '../DeleteConfirm';
import { selectUpdatePropertySubsetsIsError } from '../../../Reducers/Sets/Properties/selectors';

type Props = {
  resources: any;
  set: Set;
  properties: Property[];
  subsets: Subset[];
  controlWidth?: number | string;
  controlYOffset?: number;
  offsetFromBottom?: number;
  offsetFromRight?: number;
  isControlOpen?: boolean;
  isDisabled?: boolean;
  updatePropertySubsetsIsError: PropertySubsetsError;
  onControlOpen?: () => void;
  onControlClose?: () => void;
  editProperties: (properties: Property[]) => void;
  addSubsets: (subsets: Subset[]) => void;
  createSubset: (setId: number, subset: Subset, properties?: Property[]) => void;
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
};

const DropdownSubsets: React.FunctionComponent<Props> = ({
  resources,
  set,
  properties,
  subsets,
  controlWidth,
  controlYOffset,
  offsetFromBottom,
  offsetFromRight,
  isControlOpen,
  isDisabled,
  updatePropertySubsetsIsError,
  onControlOpen,
  onControlClose,
  editProperties,
  addSubsets,
  createSubset,
  updatePropertySubsets,
  addSubsetProperties,
  deleteSubsetProperties,
}) => {
  const [baseProperties, setBaseProperties] = useState([] as Property[]);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  useEffect(() => {
    // Edition simple - Update property subsets failed
    if (
      properties?.length === 1 &&
      updatePropertySubsetsIsError?.propertyId === properties[0]?.Id
    ) {
      cancelPropertiesSubsetsChanges();
    }
  }, [updatePropertySubsetsIsError]);

  if (properties == null) {
    return;
  }

  // Converti les options du dropdown des sous-sets en liste de sous-sets
  const converOptionsToSubsets = (options: SubsetOption[]) =>
    options?.map(
      (option): Subset => ({
        Id: typeof option?.value === 'number' ? option?.value : 0,
        Name: option?.label,
        IsDefault: false,
      })
    );

  const getNewSubset = (options: SubsetOption[]) => options?.find((option) => option?.__isNew__);

  const getDifferentSubsets = (basePropertyList: Property[], propertyList: Property[]) => {
    const differentSubsets = [] as Subset[];

    basePropertyList?.forEach((baseProperty) => {
      const property = propertyList?.find((p) => p?.Id === baseProperty?.Id);

      baseProperty?.Subsets?.forEach((baseSubset) => {
        const subset = property?.Subsets?.find((s) => s?.Id === baseSubset?.Id);

        if (subset == null && !hasSubset(differentSubsets, baseSubset)) {
          differentSubsets?.push(baseSubset);
        }
      });
    });

    return differentSubsets;
  };

  const getAddedSubsets = () => getDifferentSubsets(properties, baseProperties);

  const getDeletedSubsets = () => getDifferentSubsets(baseProperties, properties);

  const handleOnChangeDropdown = (
    oldSubsetValues: SubsetOption[],
    newSubsetValues: SubsetOption[]
  ) => {
    const newSubsets = converOptionsToSubsets(newSubsetValues);
    const oldSubsets = converOptionsToSubsets(oldSubsetValues);

    // A subset has been added
    if (oldSubsets === undefined || newSubsets?.length > oldSubsets?.length) {
      const subsetsAdded = newSubsets?.filter((subset) => !hasSubset(oldSubsets, subset));

      const newUpdatedProperties = properties?.map((updatedProperty) => ({
        ...updatedProperty,
        Subsets: utilAddSubsets(updatedProperty?.Subsets, subsetsAdded),
      }));

      editProperties(newUpdatedProperties);

      // Is a new subset
      const newSubsetOption = getNewSubset(newSubsetValues);

      if (newSubsetOption) {
        const newSubsetArray = converOptionsToSubsets([newSubsetOption]);

        addSubsets(newSubsetArray);

        createSubset(set?.Id, newSubsetArray[0], newUpdatedProperties);
      }
    }
    // A subset has been removed
    else if (newSubsets === undefined || newSubsets?.length < oldSubsets?.length) {
      const deletedSubsets = oldSubsets?.filter((subset) => !hasSubset(newSubsets, subset));

      const newUpdatedProperties = properties?.map((updatedProperty) => ({
        ...updatedProperty,
        Subsets: updatedProperty?.Subsets?.filter((subset) => !hasSubset(deletedSubsets, subset)),
      }));

      editProperties(newUpdatedProperties);
    }
  };

  const editSubsets = (newSubsets: Subset[], keepPropertiesWithValue?: boolean) => {
    const addedSubsets = getAddedSubsets();
    const deletedSubsets = getDeletedSubsets();

    // If subsets has not changed
    if (addedSubsets?.length === 0 && deletedSubsets?.length === 0) {
      return false;
    }

    // Edition simple
    if (properties?.length === 1) {
      updatePropertySubsets(set?.Id, properties[0]?.Id, newSubsets, keepPropertiesWithValue);
    }
    // Edition multiple
    else if (properties?.length > 1) {
      const propertyIds = properties?.map((property) => property?.Id);

      deletedSubsets?.forEach((subset) => {
        deleteSubsetProperties(set?.Id, subset?.Id, propertyIds, keepPropertiesWithValue);
      });

      addedSubsets?.forEach((subset) => {
        addSubsetProperties(set?.Id, subset?.Id, propertyIds);
      });
    }
  };

  const cancelPropertiesSubsetsChanges = () => {
    editProperties(baseProperties);
  };

  const handleDropdownOpen = () => {
    onControlOpen && onControlOpen();

    setBaseProperties(properties);
  };

  const handleDropdownClose = (newSubsets: Subset[]) => {
    onControlClose && onControlClose();

    if (getDeletedSubsets()?.length > 0) {
      setDeleteModalIsOpen(true);
    } else {
      editSubsets(newSubsets);
    }
  };

  const handleDeleteModalCancel = () => {
    setDeleteModalIsOpen(false);

    cancelPropertiesSubsetsChanges();
  };

  const handleDeleteModalSubmit = (newSubsets: Subset[], keepPropertiesWithValue: boolean) => {
    setDeleteModalIsOpen(false);

    editSubsets(newSubsets, keepPropertiesWithValue);
  };

  let commonSubsets = properties[0]?.Subsets;

  properties.forEach((property) => {
    if (property) {
      commonSubsets = commonSubsets?.filter((subset) => hasSubset(property.Subsets, subset));
    }
  });

  const subsetsValues = commonSubsets?.map((subset) => createSubsetOption(subset));

  const subsetsOptions = subsets?.map((subset) => createSubsetOption(subset));

  const dropdownCommonProps = {
    isMulti: true,
    isCreatable: true,
    hasOptionTags: true,
    isClearable: false,
    canDeleteItem: false,
    isTriggerAdaptive: true,
    controlWidth,
    placeholderInside: resources.ContentManagement.SearchSubset,
    noOptionsMessage: () => resources.ContentManagement.NoSubsetFound,
    createLabel: resources.MetaResource.Create,
    value: subsetsValues,
    options: Immutable(subsetsOptions)?.asMutable(),
    onControlOpen: handleDropdownOpen,
    onControlClose: () => handleDropdownClose(commonSubsets),
    onChange: (propertySubsets) => handleOnChangeDropdown(subsetsValues, propertySubsets),
  };

  let dropdown;

  if (isControlOpen != null) {
    if (isControlOpen) {
      dropdown = (
        <FixedDropdown
          {...dropdownCommonProps}
          offsetFromBottom={offsetFromBottom}
          offsetFromRight={offsetFromRight}
          isControlOpen={isControlOpen}
          placeholder={resources.ContentManagement.AddSubsetsToProperties}
        />
      );
    }
  } else {
    dropdown = (
      <Dropdown
        {...dropdownCommonProps}
        isDense
        isDisabled={isDisabled}
        placeholder={resources.ContentManagement.AddSubsetsToProperty}
        controlYOffset={controlYOffset}
      />
    );
  }

  return (
    <>
      {dropdown}
      <DeleteConfirm
        isDisplayed={deleteModalIsOpen}
        title={resources.ContentManagementPropSetForm.ModalConfirmTitle}
        description={resources.ContentManagementPropSetForm.ModalConfirmText}
        checkboxLabel={resources.ContentManagementPropSetForm.ModalConfirmCheckbox}
        submitButtonLabel={resources.ContentManagementPropSetForm.ModalConfirmSubmit}
        onCancel={handleDeleteModalCancel}
        onSubmit={(keepPropertiesWithValue) =>
          handleDeleteModalSubmit(commonSubsets, keepPropertiesWithValue)
        }
      />
    </>
  );
};

const mapSelectToProps = createStructuredSelector({
  updatePropertySubsetsIsError: selectUpdatePropertySubsetsIsError,
});

export default connect(mapSelectToProps)(DropdownSubsets);