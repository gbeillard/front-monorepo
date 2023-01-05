import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';

import {
  Stack,
  TextField,
  space,
  Dropdown,
  InfoModal,
  Tooltip,
  defaultTheme,
  Button,
} from '@bim-co/componentui-foundation';
import { CollectionWrite } from '../../Reducers/Collections/types';

import { CollectionStatus } from '../../Reducers/Collections/constants';

import { replaceStringByComponent } from '../../Utils/utilsResources';

// Reducers
import { selectTranslatedResources, selectLanguageCode } from '../../Reducers/app/selectors';

import { getCollectionStatusLabels } from '../../Reducers/Collections/utils';

const defaultCollection: CollectionWrite = {
  Name: '',
  Status: CollectionStatus.Shared,
};

type Props = {
  resources: any;
  languageCode: any;
  isOpen: boolean;
  isLoading?: boolean;
  collection?: CollectionWrite;
  onCancel: () => void;
  onSubmit: (collection: CollectionWrite) => void;
};

const CollectionModal: React.FC<Props> = ({
  resources,
  languageCode,
  isOpen,
  isLoading,
  collection = defaultCollection,
  onCancel,
  onSubmit,
}) => {
  const [currentCollection, setCurrentCollection] = useState<CollectionWrite>(null);
  const [errors, setErrors]: any = useState({});

  useEffect(() => {
    if (isOpen) {
      setCurrentCollection(collection);
    }
  }, [isOpen]);

  const nameValidation = (value: string) => !value?.trim() && resources.MetaResource.Required;

  const validate = {
    Name: (name: string) => nameValidation(name),
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
    const newErrors = Object.keys(currentCollection).reduce(
      (currentErrors, field) => getNewErrors(currentErrors, field, currentCollection[field]),
      {}
    );

    setErrors(newErrors);

    return newErrors;
  };

  const isValidForm = () => {
    const newErrors: { [s: string]: unknown } = checkForm();

    return !Object.values(newErrors).length;
  };

  const handleOnClickSubmit = () => isValidForm() && onSubmit(currentCollection);

  const handleChangeTextField: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, value } = event.currentTarget;

    setCurrentCollection({
      ...currentCollection,
      [name]: value,
    });
    setErrors(getNewErrors(errors, name, value));
  };

  const handleChangeDropdownStatus = (dropdownOption) => {
    setCurrentCollection({
      ...currentCollection,
      Status: dropdownOption?.value,
    });
  };

  const getDropdownStatusOptions = useCallback(() => {
    const collectionStatusLabels = getCollectionStatusLabels(resources);

    return Object.keys(collectionStatusLabels)?.map((collectionStatus) => ({
      value: collectionStatus,
      label: collectionStatusLabels[collectionStatus],
      isReadOnly: true,
    }));
  }, [languageCode]);

  const getDropdownStatusValue = (status) =>
    getDropdownStatusOptions()?.find((dropdownOption) => dropdownOption?.value === status);

  const getModalTitle = useCallback(() => {
    // Creation
    if (!collection?.Id) {
      return resources.ContentManagementCollections.CreateCollectionModalTitle;
    }

    // Edition
    const title: string = resources.ContentManagementCollections.EditCollectionModalTitle;
    const collectionName = <ModalEditCollectionName>{collection?.Name}</ModalEditCollectionName>;

    return replaceStringByComponent(title, '[CollectionName]', collectionName);
  }, [languageCode, collection]);

  const getSubmitButtonLabel = useCallback(() => {
    // Creation
    if (!collection?.Id) {
      return resources.ContentManagementCollections.CreateCollectionModalButton;
    }

    // Edition
    return resources.ContentManagementCollections.EditCollectionModalButton;
  }, [languageCode, collection]);

  return (
    <InfoModal.Component active={isOpen} close={onCancel}>
      <InfoModal.Title>{getModalTitle()}</InfoModal.Title>
      <InfoModal.Content>
        <Stack space={space[100]}>
          <TextField
            name="Name"
            label={resources.ContentManagementCollections.FieldNameLabel}
            placeholder={resources.ContentManagementCollections.FieldNamePlaceholder}
            isRequired
            maxLength={200}
            isError={errors?.Name}
            helperText={errors?.Name}
            value={collection?.Name}
            onChange={handleChangeTextField}
          />
          <TextField
            name="Description"
            label={resources.ContentManagementCollections.FieldDescriptionLabel}
            placeholder={resources.ContentManagementCollections.FieldDescriptionPlaceholder}
            isMultiline
            height="128px"
            maxLength={4000}
            value={collection?.Description}
            onChange={handleChangeTextField}
          />
          <Tooltip
            renderValue={() => (
              <TooltipText>{resources.ContentManagementCollections.FieldStatusTooltip}</TooltipText>
            )}
            placement="top-start"
          >
            <Dropdown
              LabelText={resources.ContentManagementCollections.FieldStatusLabel}
              placeholderInside={resources.ContentManagementCollections.FieldStatusPlaceholder}
              noOptionsMessage={() =>
                resources.ContentManagementCollections.FieldStatusNoOptionMessage
              }
              options={getDropdownStatusOptions()}
              value={getDropdownStatusValue(collection?.Status)}
              onChange={handleChangeDropdownStatus}
              noMargin
              isDisabled
            />
          </Tooltip>
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

const TooltipText = styled.div`
  padding: 16px;
  max-width: 320px;
`;

const ModalEditCollectionName = styled.span`
  color: ${defaultTheme.primaryColor};
`;

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  languageCode: selectLanguageCode,
});

export default React.memo(connect(mapStateToProps)(CollectionModal));