import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  space,
  Button,
} from '@bim-co/componentui-foundation';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { SubsetSource } from '../../../../Reducers/Sets/Subsets/types';
import { selectTranslatedResources } from '../../../../Reducers/app/selectors';
import {
  selectFilteredProperties,
  selectIsFetchingProperties,
} from '../../../../Reducers/classifications/properties/selectors';
import { NodeProperty } from '../../../../Reducers/classifications/properties/types';

import Loader from '../../../CommonsElements/Loader';

const getIsDeletable = (property: NodeProperty, disableCriticalFeatures: boolean): boolean =>
  !disableCriticalFeatures &&
  !property.Subsets.find((subset) => subset.Sources.includes(SubsetSource.Node));

type Props = {
  properties: NodeProperty[];
  isFetchingProperties: boolean;
  disableCriticalFeatures: boolean;
  resources: any;
  onChange: (x: NodeProperty) => void;
  onDelete: (x: NodeProperty) => void;
};

enum Mandatory {
  None,
  Manufacturer,
  Generic,
  Both,
}

const getOptions = (resources: any) => [
  { label: resources.ClassificationDetails.MandatoryOptionNone, value: Mandatory.None },
  {
    label: resources.ClassificationDetails.MandatoryOptionManufacturer,
    value: Mandatory.Manufacturer,
  },
  { label: resources.ClassificationDetails.MandatoryOptionGeneric, value: Mandatory.Generic },
  { label: resources.ClassificationDetails.MandatoryOptionBoth, value: Mandatory.Both },
];

const getDropdownValue = (property: NodeProperty, options: any) => {
  if (property.IsMandatoryManufacturer) {
    return property.IsMandatoryGeneric
      ? options.find((option) => option.value === Mandatory.Both)
      : options.find((option) => option.value === Mandatory.Manufacturer);
  }

  return property.IsMandatoryGeneric
    ? options.find((option) => option.value === Mandatory.Generic)
    : options.find((option) => option.value === Mandatory.None);
};

const getUpdatedProperty = (property: NodeProperty, mandatory: Mandatory): NodeProperty => {
  switch (mandatory) {
    case Mandatory.None:
      return { ...property, IsMandatoryGeneric: false, IsMandatoryManufacturer: false };
    case Mandatory.Manufacturer:
      return { ...property, IsMandatoryGeneric: false, IsMandatoryManufacturer: true };
    case Mandatory.Generic:
      return { ...property, IsMandatoryGeneric: true, IsMandatoryManufacturer: false };
    case Mandatory.Both:
      return { ...property, IsMandatoryGeneric: true, IsMandatoryManufacturer: true };
    default:
      return { ...property };
  }
};

const PropertyTable: React.FC<Props> = ({
  properties,
  isFetchingProperties,
  disableCriticalFeatures,
  resources,
  onChange,
  onDelete,
}) => {
  const onChangeHandler = (property: NodeProperty, option: { value: Mandatory }) => {
    const updatedProperty = getUpdatedProperty(property, option.value);
    onChange(updatedProperty);
  };

  const options = getOptions(resources);

  const renderBody = () => {
    if (isFetchingProperties) {
      return <Loader />;
    }

    if (!properties || !Array.isArray(properties)) {
      return null;
    }

    return properties.map((property) => {
      const isDeletable = getIsDeletable(property, disableCriticalFeatures);
      return (
        <TableRow key={property.Id} hover>
          <TableCell>{property.Name}</TableCell>
          <TableCell>{property.DefaultUnit?.Name}</TableCell>
          <TableCell>{property.Domain?.Name}</TableCell>
          <TableCell>
            <Dropdown
              isDisabled={disableCriticalFeatures}
              isDense
              options={options}
              value={getDropdownValue(property, options)}
              onChange={(mandatory) => onChangeHandler(property, mandatory)}
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
          <TableCell>{resources.ClassificationDetails.UnitColumn}</TableCell>
          <TableCell>{resources.ClassificationDetails.DomainColumn}</TableCell>
          <TableCell>{resources.ClassificationDetails.MandatoryColumn}</TableCell>
          <TableCell width={space[250]} />
        </TableRow>
      </TableHead>
      <TableBody>{renderBody()}</TableBody>
    </Table>
  );
};

const mapStateToProps = createStructuredSelector({
  properties: selectFilteredProperties,
  isFetchingProperties: selectIsFetchingProperties,
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(PropertyTable);