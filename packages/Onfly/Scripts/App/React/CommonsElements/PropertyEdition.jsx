import React from 'react';

import PropertyElement from './PropertyElement';

// Component design system
import Dialog from '../../components/dialogs/Dialog';

const PropertyEdition = ({
  propertyEditionOpen,
  propertyEditionClose,
  temporaryToken,
  managementCloudId,
  resources,
  language,
  languages,
  domains,
  units,
  dataTypes,
  editTypes,
  parameterTypes,
  isReadOnly,
  isPropertyInCreationMode,
  selectedProperty,
  propertyPanelValidButton,
  propertyPanelTitle,
  handleOpenModalDuplicateProperty,
}) => (
  <Dialog
    open={propertyEditionOpen}
    onClose={propertyEditionClose}
    fullWidth
    maxWidth="md"
    scroll="body"
  >
    <PropertyElement
      TemporaryToken={temporaryToken}
      ManagementCloudId={managementCloudId}
      Resources={resources}
      Language={language}
      Languages={languages}
      Domains={domains}
      Units={units}
      DataTypes={dataTypes}
      EditTypes={editTypes}
      CurrentDataModel={selectedProperty}
      ValidateBottomButton={propertyPanelValidButton}
      HeaderTitle={propertyPanelTitle}
      IsReadOnly={isReadOnly}
      IsCreationMode={isPropertyInCreationMode}
      CancelButtonAction={propertyEditionClose}
      CancelButtonLabel={resources.MetaResource.Cancel}
      ParameterTypes={parameterTypes}
      handleOpenModalDuplicateProperty={handleOpenModalDuplicateProperty}
    />
  </Dialog>
);

export default PropertyEdition;