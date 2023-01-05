import React, { useEffect, useState, ReactElement } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';

import {
  Checkbox,
  P,
  Modal,
  InfoModal,
  useModal,
  space,
  defaultTheme,
} from '@bim-co/componentui-foundation';

// Reducers
import { selectTranslatedResources } from '../../Reducers/app/selectors';

type Props = {
  resources: any;
  isDisplayed: boolean;
  title: string | ReactElement;
  description?: string | ReactElement;
  checkboxLabel?: string;
  submitButtonLabel: string;
  onCancel: () => void;
  onSubmit: (isKeep: boolean) => void;
};

const initialState = {
  isKeepAssigned: true,
};

const DeleteConfirm: React.FC<Props> = ({
  // mapStateToProps
  resources,
  // Props
  isDisplayed,
  title,
  description,
  checkboxLabel,
  submitButtonLabel,
  onSubmit,
  onCancel,
}) => {
  const [isDeleteModalActive, openDeleteModal, closeDeleteModal] = useModal();
  const [isKeepAssigned, setIsKeepAssigned] = useState(initialState.isKeepAssigned);

  useEffect(() => {
    if (isDisplayed) {
      setIsKeepAssigned(initialState.isKeepAssigned);
      openDeleteModal();
    }
  }, [isDisplayed]);

  const handleCancel = () => {
    closeDeleteModal();
    onCancel();
  };

  const handleSubmit = () => {
    closeDeleteModal();
    onSubmit(isKeepAssigned);
  };

  return (
    <Modal active={isDeleteModalActive} close={handleCancel}>
      <InfoModal.Title>{title}</InfoModal.Title>
      <InfoModal.Content>
        <P color={defaultTheme.textColorSecondary}>{description}</P>
        {checkboxLabel && (
          <ConfirmCheckbox
            label={checkboxLabel}
            checked={isKeepAssigned}
            onClick={() => setIsKeepAssigned(!isKeepAssigned)}
          />
        )}
      </InfoModal.Content>
      <InfoModal.Actions>
        <FormMainActions>
          <InfoModal.SecondaryCTA label={resources.MetaResource.Cancel} onClick={handleCancel} />
          <InfoModal.PrimaryCTA label={submitButtonLabel} danger onClick={handleSubmit} />
        </FormMainActions>
      </InfoModal.Actions>
    </Modal>
  );
};

// StyleD
const FormMainActions = styled(InfoModal.MainActions)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const ConfirmCheckbox = styled(Checkbox)`
  margin-top: ${space[100]};
`;

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default React.memo(connect(mapStateToProps, {})(DeleteConfirm));