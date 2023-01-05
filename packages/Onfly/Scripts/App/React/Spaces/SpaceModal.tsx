import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';
import {
  TextField,
  Stack,
  InfoModal,
  Button,
  P,
  Tooltip,
  Icon,
  Cluster,
} from '@bim-co/componentui-foundation';
import { ONFLY_DOMAIN } from '../../Api/constants';

import { SpaceWrite } from '../../Reducers/Spaces/types';

// Reducers
import { selectSubDomain, selectTranslatedResources } from '../../Reducers/app/selectors';
import { parseNameToSubDomain } from '../../Reducers/Spaces/utils';
import {
  MAX_LENGTH_ENV_SUFFIX_SUBDOMAIN,
  MAX_LENGTH_SUBDOMAIN,
} from '../../Reducers/Spaces/constants';

const defaultSpace: SpaceWrite = {
  Name: '',
  Description: '',
  SubDomain: '',
};

type Props = {
  resources: any;
  subDomain: string;
  isLoading?: boolean;
  isOpen: boolean;
  space?: SpaceWrite;
  onSubmit: (space: SpaceWrite) => void;
  onCancel: () => void;
};

const SpaceModal: React.FC<Props> = ({
  resources,
  subDomain,
  isOpen,
  isLoading,
  space = defaultSpace,
  onCancel,
  onSubmit,
}) => {
  const [currentSpace, setCurrentSpace] = useState<SpaceWrite>(null);
  const [errors, setErrors]: any = useState({});

  const onflySubdomain = `-${subDomain}`;

  useEffect(() => {
    if (isOpen) {
      setCurrentSpace(space);
    }
  }, [isOpen]);

  useEffect(() => {
    // Creation
    if (!space?.Id) {
      // Generate the subdomain when the name change

      let generatedSubdomain = parseNameToSubDomain(currentSpace?.Name);
      generatedSubdomain = generatedSubdomain?.substring(0, getSubdomainMaxLength());

      setCurrentSpace({
        ...currentSpace,
        SubDomain: generatedSubdomain,
      });
    }
  }, [currentSpace?.Name]);

  const nameValidation = (value: string) => !value?.trim() && resources.MetaResource.Required;
  const subDomainValidation = (value: string) => !value?.trim() && resources.MetaResource.Required;

  const validate = {
    Name: (name: string) => nameValidation(name),
    SubDomain: (subDomain: string) => subDomainValidation(subDomain),
  };

  const checkField = (field: string, value) => {
    const validation = validate[field];

    // Return the error message
    return validation && validation(value);
  };

  const getNewErrors = (currentErrors, field: string, value) => {
    const error = checkField(field, value);

    if (!error) {
      delete currentErrors[field];
    }

    return {
      ...currentErrors,
      ...(error && { [field]: error }),
    };
  };

  const checkForm = () => {
    const newErrors = Object.keys(currentSpace).reduce(
      (currentErrors, field) => getNewErrors(currentErrors, field, currentSpace[field]),
      {}
    );

    setErrors(newErrors);

    return newErrors;
  };

  const isValidForm = () => {
    const newErrors: { [s: string]: unknown } = checkForm();

    return !Object.values(newErrors).length;
  };

  const handleOnClickSubmit = () => isValidForm() && onSubmit(currentSpace);

  const handleChangeTextField: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, value } = event.currentTarget;

    setCurrentSpace({
      ...currentSpace,
      [name]: value,
    });

    setErrors(getNewErrors(errors, name, value));
  };

  const getSubmitButtonLabel = useCallback(() => {
    // Creation
    if (!space?.Id) {
      return resources.Spaces.ModalCreate;
    }

    // Edition
    return resources.Spaces.EditModalButton;
  }, [space]);

  const getSubdomainMaxLength = () => {
    const maxLength =
      MAX_LENGTH_SUBDOMAIN - MAX_LENGTH_ENV_SUFFIX_SUBDOMAIN - onflySubdomain.length;

    return maxLength >= 0 ? maxLength : 0;
  };

  const subDomainLabel = () => (
    <Cluster nowrap>
      <span>{resources.Spaces.ModalUrl}</span>
      <TooltipContainer>
        <Tooltip value={resources.Spaces.SpaceModalHelpSubdomainTooltip} placement="top">
          <Icon icon="help" size="xs" />
        </Tooltip>
      </TooltipContainer>
    </Cluster>
  );

  return (
    <InfoModal.Component active={isOpen} close={onCancel}>
      <InfoModal.Title>{resources.Spaces.ModalTitle}</InfoModal.Title>
      <InfoModal.Content>
        <Stack space="16px">
          <TextField
            name="Name"
            label={resources.Spaces.ModalName}
            placeholder={resources.Spaces.ModalPlaceHolderName}
            isRequired
            maxLength={200}
            isError={errors?.Name}
            helperText={errors?.Name}
            value={space?.Name}
            onChange={handleChangeTextField}
          />
          <TextField
            name="Description"
            label={resources.Spaces.ModalDescription}
            placeholder={resources.Spaces.ModalPlaceHolderDescription}
            isMultiline
            height="128px"
            maxLength={4000}
            value={space?.Description}
            onChange={handleChangeTextField}
          />
          <SubDomainContainer>
            <TextField
              name="SubDomain"
              label={subDomainLabel()}
              placeholder={resources.Spaces.ModalPlaceHolderUrl}
              isReadOnly
              value={currentSpace?.SubDomain}
              isError={errors?.SubDomain}
              helperText={errors?.SubDomain}
              maxLength={getSubdomainMaxLength()}
            />
            <SubDomainP>
              <P>{`${onflySubdomain}${ONFLY_DOMAIN}`}</P>
            </SubDomainP>
          </SubDomainContainer>
        </Stack>
      </InfoModal.Content>
      <FormMainActions>
        <InfoModal.SecondaryCTA
          label={resources.MetaResource.Cancel}
          onClick={onCancel}
          isDisabled={isLoading}
        />
        <Button variant="primary" onClick={handleOnClickSubmit} isLoading={isLoading}>
          {getSubmitButtonLabel()}
        </Button>
      </FormMainActions>
    </InfoModal.Component>
  );
};

const FormMainActions = styled(InfoModal.MainActions)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;
const TooltipContainer = styled.div`
  .Tooltip-Trigger {
    display: flex;
  }
`;

const SubDomainContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const SubDomainP = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding-left: 4px;
  white-space: nowrap;
`;

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  subDomain: selectSubDomain,
});

export default React.memo(connect(mapStateToProps)(SpaceModal));