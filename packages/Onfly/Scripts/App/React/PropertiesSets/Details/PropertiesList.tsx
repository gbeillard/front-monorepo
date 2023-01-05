import React, { useState } from 'react';
import styled from '@emotion/styled';

import {
  space,
  colors,
  SortDirection,
  Button,
  Checkbox,
  List,
  ListHead,
  ListBody,
  ListRow,
  ListCell,
  Paragraph,
} from '@bim-co/componentui-foundation';
import { Set } from '../../../Reducers/properties-sets/types';
import { Property, FilterSort } from '../../../Reducers/Sets/Properties/types';
import { Subset } from '../../../Reducers/Sets/Subsets/types';

import DropdownSubsets from './DropdownSubsets';

type Props = {
  resources: any;
  set: Set;
  properties: Property[];
  subsets: Subset[];
  filteredProperties: Property[];
  filterSort: FilterSort;
  selectedProperties: Property[];
  selectAllProperties: () => void;
  resetSelectedProperties: () => void;
  selectProperty: (property: Property) => void;
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
  openDeleteModal: (properties: Property[]) => void;
};

const NameParagraph = styled(Paragraph) <{ hasPaddingLeft: boolean }>`
  padding-left: ${(props) => props.hasPaddingLeft && space[100]};
`;
const SecondaryParagraph = styled(Paragraph)`
  color: ${colors.NEUTRAL[60]};
`;

// Columns
const createHeadCell = (id, label = '', width = null, minWidth = null, isSortable = false) => ({
  Id: id,
  Label: label,
  Width: width,
  MinWidth: minWidth,
  IsSortable: isSortable,
});

const getHeadCells = (resources: any) => [
  createHeadCell('Name', resources.ContentManagement.PropertiesTitleName, null, space[1000], true),
  createHeadCell(
    'Domain.Name',
    resources.BimObjectDetails.PropertiesTableDomainLabel,
    space[1000],
    null,
    true
  ),
  createHeadCell(
    'DefaultUnit.Symbol',
    resources.ContentManagement.PropertiesTitleUnitName,
    space[600],
    null,
    true
  ),
  createHeadCell('Subsets', resources.ContentManagement.Subset, null, space[2000]),
  createHeadCell('Actions', '', space[350]),
];

const PropertiesList: React.FunctionComponent<Props> = ({
  resources,
  set,
  properties,
  filteredProperties,
  filterSort,
  subsets,
  selectedProperties,
  selectAllProperties,
  resetSelectedProperties,
  selectProperty,
  setFilterSort,
  editProperties,
  createSubset,
  addSubsets,
  updatePropertySubsets,
  addSubsetProperties,
  deleteSubsetProperties,
  openDeleteModal,
}) => {
  const [focusedProperties, setFocusedProperties] = useState(null);

  const nbProperties = properties?.length;
  const nbSelectedProperties = selectedProperties?.length;
  const allPropertiesIsSelected = nbSelectedProperties > 0 && nbSelectedProperties === nbProperties;

  const handleSelectAllClick = () => {
    if (allPropertiesIsSelected) {
      resetSelectedProperties();
    } else {
      selectAllProperties();
    }
  };

  const handleSelectClick = (property: Property) => {
    !set?.IsPublic && selectProperty(property);
  };

  const isSelected = (property) =>
    selectedProperties.findIndex((selectedProperty) => selectedProperty?.Id === property?.Id) !==
    -1;

  const handleClickDelete = (event, property: Property) => {
    event.stopPropagation();
    openDeleteModal([property]);
  };

  const handleSortClick = (headCell) => {
    const isSortAsc = filterSort.field === headCell.Id && filterSort.order === SortDirection.Asc;

    setFilterSort(headCell?.Id, isSortAsc ? SortDirection.Desc : SortDirection.Asc);
  };

  const handleDropdownOpen = (property: Property) => {
    !set?.IsPublic && setFocusedProperties(property);
  };

  const handleDropdownClose = () => {
    setFocusedProperties(null);
  };

  const isFocused = (property) => focusedProperties && focusedProperties.Id === property?.Id;

  const headCellList = getHeadCells(resources).map((headCell) => (
    <ListCell
      key={headCell.Id}
      width={headCell.Width}
      minWidth={headCell.MinWidth}
      sortActive={headCell.IsSortable && filterSort.field === headCell.Id}
      sortDirection={
        headCell.IsSortable &&
        (filterSort.field === headCell.Id ? filterSort.order : SortDirection.Asc)
      }
      onClick={() => handleSortClick(headCell)}
    >
      {headCell.Label}
    </ListCell>
  ));

  const rowList = filteredProperties?.map((property) => {
    if (property === null || property === undefined) {
      return;
    }

    return (
      <ListRow
        key={property.Id}
        hover={!set?.IsPublic}
        selected={!set?.IsPublic && isSelected(property)}
        focused={!set?.IsPublic && isFocused(property)}
        onClick={!set?.IsPublic && (() => handleSelectClick(property))}
      >
        {!set?.IsPublic && (
          <ListCell width={space[200]}>
            <Checkbox isChecked={isSelected(property)} />
          </ListCell>
        )}
        <ListCell minWidth={space[1000]}>
          <NameParagraph nowrap hasPaddingLeft={set?.IsPublic}>
            {property.Name}
          </NameParagraph>
        </ListCell>
        <ListCell width={space[1000]}>
          <SecondaryParagraph nowrap>{property.Domain?.Name}</SecondaryParagraph>
        </ListCell>
        <ListCell width={space[600]}>
          <SecondaryParagraph nowrap>{property.DefaultUnit?.Symbol}</SecondaryParagraph>
        </ListCell>
        <ListCell minWidth={space[2000]}>
          <DropdownSubsets
            controlYOffset={-8}
            resources={resources}
            set={set}
            properties={[property]}
            subsets={subsets}
            isDisabled={set?.IsPublic}
            onControlOpen={() => handleDropdownOpen(property)}
            onControlClose={handleDropdownClose}
            editProperties={editProperties}
            addSubsets={addSubsets}
            createSubset={createSubset}
            updatePropertySubsets={updatePropertySubsets}
            addSubsetProperties={addSubsetProperties}
            deleteSubsetProperties={deleteSubsetProperties}
          />
        </ListCell>
        <ListCell width={space[350]}>
          <Button
            icon="delete"
            onClick={(event) => handleClickDelete(event, property)}
            isDisabled={set?.IsPublic}
          />
        </ListCell>
      </ListRow>
    );
  });

  return (
    <List>
      <ListHead>
        <ListRow>
          {!set?.IsPublic && (
            <ListCell width={space[200]}>
              <Checkbox
                isIndeterminate={nbSelectedProperties > 0 && nbSelectedProperties < nbProperties}
                isChecked={allPropertiesIsSelected}
                onClick={() => handleSelectAllClick()}
              />
            </ListCell>
          )}
          {headCellList}
        </ListRow>
      </ListHead>
      <ListBody>{rowList}</ListBody>
    </List>
  );
};

export default PropertiesList;