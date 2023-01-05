import React from 'react';

// material UI imports
import Checkbox from '@material-ui/core/Checkbox';

export default function PropertiesImportViewListCheckBox({
  isGuidOrNameCheck,
  property,
  actionCheckDataImport,
}) {
  return (
    <Checkbox
      id={property.PropertyLineId}
      value={
        property.PropertyId !== null && property.PropertyId !== undefined
          ? property.PropertyId.toString()
          : ''
      }
      checked={isGuidOrNameCheck ? false : property.PropertyIsChecked}
      disabled={isGuidOrNameCheck}
      indeterminate={isGuidOrNameCheck}
      onChange={!isGuidOrNameCheck ? actionCheckDataImport : undefined}
      tabIndex={-1}
    />
  );
}