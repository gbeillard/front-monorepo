import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';

import { Modal, InfoModal } from '@bim-co/componentui-foundation';

// Reducers
import {
  selectToken,
  selectManagementCloudId,
  selectTranslatedResources,
} from '../../../Reducers/app/selectors';
import IframePage from './IframePage';
import SmartDownload from './SmartDownload';
import { VariantConfigurator } from './types';

const SmartDownloadAny = SmartDownload as React.FC<any>;

type Props = {
  resources: any;
  managementCloudId?: number;
  token?: string;
  url: string;
  bimobjectId: number;
  modelId: any;
  active: boolean;
  onClose: () => void;
  variant?: VariantConfigurator;
  linkedVariants?: VariantConfigurator[];
};

const ConfiguratorForm: React.FC<Props> = ({
  onClose,
  url,
  bimobjectId,
  modelId,
  active,
  variant,
  linkedVariants,
}) => {
  const [step, setStep] = useState(1);
  const [variants, setVariants] = useState([]);

  const handleClose = () => {
    setStep(1);
    setVariants([]);
    onClose();
  };

  // data: '{ "Variants": [{ "Id": 513619, "IsParent": true }, { "Id": 513660 }, { "Id": 513685 }] }'
  const handleConfiguratorSubmit = (data: any) => {
    setStep(2);
    setVariants(data.Variants.filter((variant) => variant?.Id > 0));
  };

  const handleReturnToConfigurator = () => {
    setStep(1);
    setVariants([]);
  };

  const render = () => {
    if (step === 1) {
      return (
        <IframePage
          url={url}
          handleConfiguratorSubmit={handleConfiguratorSubmit}
          variant={variant}
          linkedVariants={linkedVariants}
        />
      );
    }
    if (step === 2) {
      const smProps = {
        bimobjectId,
        modelId,
        hideStep: true,
        filteredVariants: variants,
        callbackPreviousStep: handleReturnToConfigurator,
        variantQueryString: variant,
      };
      return (
        <div className="panel-object panel-object-std" id={`detail-pdt-${bimobjectId}`}>
          <SmartDownloadAny {...smProps} />
        </div>
      );
    }
  };

  // passer active en props
  return (
    <ModalXLarge active={active} close={handleClose} size="large">
      <InfoModal.Title>Configure your BimObject</InfoModal.Title>
      <InfoModal.Content>{render()}</InfoModal.Content>
    </ModalXLarge>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
  managementCloudId: selectManagementCloudId,
  resources: selectTranslatedResources,
});

// StyleD
const ModalXLarge = styled(Modal)`
  width: 80vw;
  max-width: 80vw;
  margin-top: 7rem;
  max-height: calc(100% - 5rem);
`;

export default connect(mapStateToProps)(React.memo(ConfiguratorForm));
