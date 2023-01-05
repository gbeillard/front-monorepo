import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ImmutableArray } from 'seamless-immutable';

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  space,
  Button,
  getColorNameFromId,
} from '@bim-co/componentui-foundation';

import { NodeProperty } from '../../../../Reducers/classifications/properties/types';
import { Subset, SubsetSource } from '../../../../Reducers/Sets/Subsets/types';
import { getSourceSubset } from '../../../../Reducers/classifications/properties/utils';
import { selectTranslatedResources } from '../../../../Reducers/app/selectors';
import {
  selectFilteredProperties,
  selectIsFetchingProperties,
} from '../../../../Reducers/classifications/properties/selectors';
import { selectAllSubsetsForDisplayWithDefaultFilteredBySetAndText } from '../../../../Reducers/Sets/Subsets/selectors';

import Loader from '../../../CommonsElements/Loader';

const findMissing = (a: Subset[], b: Subset[]): Subset =>
  a.find((aSubset) => !b.find((bSubset) => aSubset.Id === bSubset.Id));
const getIsDeletable = (property: NodeProperty, disableCriticalFeatures: boolean): boolean =>
  !disableCriticalFeatures &&
  !property.Subsets.find((subset) => subset.Sources.includes(SubsetSource.Node));

type Props = {
  properties: NodeProperty[];
  isFetchingProperties: boolean;
  allSubsets: Subset[];
  disableCriticalFeatures: boolean;
  resources: any;
  onAddSubset: (p: NodeProperty, s: Subset) => void;
  onRemoveSubset: (p: NodeProperty, s: Subset) => void;
  onDelete: (x: NodeProperty) => void;
};
type Option = {
  label: string;
  value: number;
  isReadOnly?: boolean;
};

const getSubsetLabel = (subset: Subset) =>
  subset.Set ? `${subset.Set.Name} - ${subset.Name}` : subset.Name;
const mapSubsetsToOptions = (subsets: Subset[]): Option[] =>
  subsets
    .filter((subset) => !subset.IsDefault)
    .map((subset) => ({
      label: getSubsetLabel(subset),
      value: subset.Id,
      color: getColorNameFromId(subset.Id),
      isReadOnly: subset.Sources?.includes(SubsetSource.Node),
    }));
const mapOptionsToSubsets = (options: Option[], subsets: Subset[]): Subset[] =>
  options.map((option) => subsets.find((subset) => subset.Id === option.value));

const PropertySubsetsTable: React.FC<Props> = ({
  properties,
  isFetchingProperties,
  allSubsets,
  disableCriticalFeatures,
  resources,
  onAddSubset,
  onRemoveSubset,
  onDelete,
}) => {
  const onChangeHandler = (property: NodeProperty, options: Option[]) => {
    const changedSubsets = mapOptionsToSubsets(options ?? [], allSubsets);
    const propertySubsets = property.Subsets.filter((subset) => !subset.IsDefault);
    // subset removed
    if (propertySubsets.length > changedSubsets.length) {
      const subset = findMissing(propertySubsets, changedSubsets);
      if (subset.Sources.includes(SubsetSource.Node)) {
        return;
      }
      onRemoveSubset(property, subset);
      return;
    }

    // subset added
    const subset = findMissing(changedSubsets, propertySubsets);
    const sourceSubset = getSourceSubset(property);
    const source = sourceSubset ? SubsetSource.NodeSubsetProperty : SubsetSource.NodeProperty;
    onAddSubset(property, { ...subset, Sources: [source] });
  };

  const options = mapSubsetsToOptions(allSubsets);

  const renderBody = () => {
    if (isFetchingProperties) {
      return <Loader />;
    }

    if (!properties || !Array.isArray(properties)) {
      return null;
    }

    return properties.map((property) => {
      const mappedOptions = mapSubsetsToOptions(property.Subsets);
      const value = (mappedOptions as unknown as ImmutableArray<Subset>)?.asMutable();
      const isDeletable = getIsDeletable(property, disableCriticalFeatures);
      return (
        <TableRow key={property.Id} hover>
          <TableCell>{property.Name}</TableCell>
          <TableCell>
            <Dropdown
              isDense
              isMulti
              options={options}
              value={value}
              onChange={(subset) => onChangeHandler(property, subset as Option[])}
              isDisabled={disableCriticalFeatures}
              hasOptionTags
            />
          </TableCell>
          <TableCell width={space[250]}>
            <Button
              size="dense"
              variant="alternative"
              icon="remove"
              disabled={!isDeletable}
              onClick={() => {
                isDeletable && onDelete(property);
              }}
            />
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{resources.ClassificationDetails.NameColumn}</TableCell>
          <TableCell>{resources.ClassificationDetails.Subsets}</TableCell>
          <TableCell width={space[250]} />
        </TableRow>
      </TableHead>
      <TableBody>{renderBody()}</TableBody>
    </Table>
  );
};

const mapStateToProps = createStructuredSelector({
  properties: selectFilteredProperties,
  allSubsets: selectAllSubsetsForDisplayWithDefaultFilteredBySetAndText,
  isFetchingProperties: selectIsFetchingProperties,
  resources: selectTranslatedResources,
});
export default connect(mapStateToProps)(PropertySubsetsTable);