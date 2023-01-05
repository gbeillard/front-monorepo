import React from 'react';
import { ImmutableArray } from 'seamless-immutable';

import {
  space,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  Button,
  getColorNameFromId,
} from '@bim-co/componentui-foundation';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Property } from '../../../../../../Reducers/BimObject/Properties/types';
import { Subset, SubsetForDisplay, SubsetSource } from '../../../../../../Reducers/Sets/Subsets/types';
import { selectTranslatedResources } from '../../../../../../Reducers/app/selectors';

const findMissing = (a: Subset[], b: Subset[]): Subset =>
  a.find((aSubset) => !b.find((bSubset) => aSubset.Id === bSubset.Id));

type Props = {
  properties: Property[];
  allSubsets: SubsetForDisplay[];
  resources: any;
  onAddSubset: (property: Property, subset: Subset) => void;
  onRemoveSubset: (property: Property, subset: Subset) => void;
  onDelete: (property: Property) => void;
};
type Option = {
  label: string;
  value: number;
  isReadOnly?: boolean;
};

const isReadOnly = (subset: Subset): boolean =>
  subset?.Sources?.includes(SubsetSource.BimObjectSubsetProperty) ||
  subset?.Sources?.includes(SubsetSource.NodeProperty);

const getDisplayName = (subset: Subset): string =>
  subset.Set ? `${subset.Set.Name} - ${subset.Name}` : subset.Name;
const mapPropertySubsetsToValues = (subsets: Subset[]): Option[] =>
  subsets
    .filter((subset) => !subset.IsDefault)
    .map((subset) => ({
      label: getDisplayName(subset),
      value: subset.Id,
      color: getColorNameFromId(subset.Id),
      isReadOnly: isReadOnly(subset),
    }));
const mapSubsetsToOptions = (subsets: SubsetForDisplay[]): Option[] =>
  subsets
    .filter((subset) => !subset.IsDefault)
    .map((subset) => ({
      label: subset.displayName,
      value: subset.Id,
      color: getColorNameFromId(subset.Id),
    }));
const mapOptionsToSubsets = (options: Option[], subsets: Subset[]): Subset[] =>
  options.map((option) => subsets.find((subset) => subset.Id === option.value));

const PropertySubsetsTable: React.FC<Props> = ({
  properties,
  allSubsets,
  resources,
  onAddSubset,
  onRemoveSubset,
  onDelete,
}) => {
  const onChangeHandler = (property: Property, options: Option[]) => {
    const changedSubsets = mapOptionsToSubsets(options ?? [], allSubsets);
    const propertySubsets = property.Subsets.filter((subset) => !subset.IsDefault);
    // subset removed
    if (propertySubsets.length > changedSubsets.length) {
      const subset = findMissing(propertySubsets, changedSubsets);
      if (isReadOnly(subset)) {
        return;
      }
      onRemoveSubset(property, subset);
      return;
    }

    // subset added
    const subset = findMissing(changedSubsets, propertySubsets);
    if (subset) {
      onAddSubset(property, { ...subset, Sources: [SubsetSource.BimObjectProperty] });
    }
  };
  const options = mapSubsetsToOptions(allSubsets);

  const tableRows = (properties || []).map((property) => {
    const mappedOptions = mapPropertySubsetsToValues(property.Subsets);
    const value = (mappedOptions as unknown as ImmutableArray<Subset>)?.asMutable();

    return (
      <TableRow key={property.Id} hover>
        <TableCell minWidth={space[1000]}>{property.Name}</TableCell>
        <TableCell minWidth={space[1000]}>
          <Dropdown
            isDense
            isMulti
            options={options}
            value={value}
            placeholder={resources.ObjectPropertiesManager.AddSubsetsToProperty}
            placeholderInside={resources.ObjectPropertiesManager.SearchSubset}
            noOptionsMessage={() => resources.ObjectPropertiesManager.NoSubsetFound}
            canClearItems={false}
            onChange={(subset: Option[]) => onChangeHandler(property, subset)}
            hasOptionTags
          />
        </TableCell>
        <TableCell width={space[250]}>
          <Button
            size="dense"
            variant="alternative"
            icon="delete"
            isDisabled={!property?.CanBeDeleted}
            onClick={() => {
              property?.CanBeDeleted && onDelete(property);
            }}
          />
        </TableCell>
      </TableRow>
    );
  });

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell minWidth={space[1000]}>
            {resources.ObjectPropertiesManager.NameColumn}
          </TableCell>
          <TableCell minWidth={space[1000]}>
            {resources.ObjectPropertiesManager.SubsetColumn}
          </TableCell>
          <TableCell width={space[250]} />
        </TableRow>
      </TableHead>
      <TableBody>{tableRows}</TableBody>
    </Table>
  );
};

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});
export default connect(mapStateToProps)(PropertySubsetsTable);