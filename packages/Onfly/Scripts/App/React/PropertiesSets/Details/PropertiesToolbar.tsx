import React, { useState } from 'react';
import styled from '@emotion/styled';

import { space, Button } from '@bim-co/componentui-foundation';
import { Set } from '../../../Reducers/properties-sets/types';
import { Property } from '../../../Reducers/Sets/Properties/types';
import { Subset } from '../../../Reducers/Sets/Subsets/types';

import Toolbar from '../../CommonsElements/ToolBar';

import DropdownSubsets from './DropdownSubsets';

type Props = {
  resources: any;
  set: Set;
  selectedProperties: Property[];
  subsets: Subset[];
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
  openDeleteModal: (properties: Property[]) => void;
};

const ButtonDelete = styled(Button)`
  margin-right: ${space[100]};
`;

const PropertiesToolbar: React.FunctionComponent<Props> = ({
  resources,
  set,
  selectedProperties,
  subsets,
  editProperties,
  createSubset,
  addSubsets,
  updatePropertySubsets,
  addSubsetProperties,
  deleteSubsetProperties,
  openDeleteModal,
}) => {
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  const nbSelectedProperties = selectedProperties?.length;

  const handleClickAddSubsets = () => {
    setDropdownIsOpen(true);
  };

  const handleDropdownClose = () => {
    if (dropdownIsOpen) {
      setDropdownIsOpen(false);
    }
  };

  return (
    <Toolbar
      open={nbSelectedProperties > 0}
      message={`${nbSelectedProperties} ${resources.ContentManagement.PropertiesSelected}`}
    >
      <ButtonDelete
        icon="delete"
        variant="danger"
        isDisabled={dropdownIsOpen}
        onClick={() => openDeleteModal(selectedProperties)}
      >
        {resources.MetaResource.Delete}
      </ButtonDelete>
      <Button
        icon="tag"
        variant="alternative"
        canSelect
        isSelected={dropdownIsOpen}
        onClick={handleClickAddSubsets}
      >
        {resources.ContentManagement.AddSubsetsToProperties}
      </Button>
      <DropdownSubsets
        controlWidth={556}
        offsetFromBottom={64}
        offsetFromRight={112}
        isControlOpen={dropdownIsOpen}
        onControlClose={handleDropdownClose}
        resources={resources}
        set={set}
        properties={selectedProperties}
        subsets={subsets}
        editProperties={editProperties}
        addSubsets={addSubsets}
        createSubset={createSubset}
        updatePropertySubsets={updatePropertySubsets}
        addSubsetProperties={addSubsetProperties}
        deleteSubsetProperties={deleteSubsetProperties}
      />
    </Toolbar>
  );
};

export default PropertiesToolbar;