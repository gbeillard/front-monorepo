import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';

import {
  Stack,
  Dropdown,
  Modal,
  InfoModal,
  useModal,
  getColorNameFromId,
  TextField,
  space,
} from '@bim-co/componentui-foundation';

import DeleteConfirm from './DeleteConfirm';

import * as API from '../../Api/PropertiesSetApi.js';

// Reducers
import { fetchSubsets as fetchSubsetsAction } from '../../Reducers/Sets/Subsets/actions';

import { selectSubsetsWithoutDefault } from '../../Reducers/Sets/Subsets/selectors';

import {
  selectToken,
  selectManagementCloudId,
  selectTranslatedResources,
} from '../../Reducers/app/selectors';

import { Subset } from '../../Reducers/Sets/Subsets/types';

type Props = {
  isDisplayed: boolean;
  resources: any;
  managementCloudId?: any;
  token?: any;
  propertySet?: any;
  subsets?: Subset[];
  fetchSubsets: (setId: number) => void;
  onCancel: () => void;
  afterSubmit: () => void;
};

// Subsets
type DropdownOption = {
  value: number | string;
  label: string;
  color?: string;
};

const createDropdownOption = (subset: Subset): DropdownOption => ({
  value: subset.Name,
  label: subset.Name,
  color: getColorNameFromId(subset?.Id) ?? 'primary',
});

const getMissingSubsets = (sourceArray, subsetsToCheck) => {
  const sourceValues = (sourceArray || []).map((subset) => subset.label);
  return (subsetsToCheck || []).filter(
    (subsetToCheck) => !subsetToCheck.IsDefault && sourceValues.indexOf(subsetToCheck?.Name) === -1
  );
};

const PropertiesSetForm: React.FC<Props> = ({
  propertySet,
  isDisplayed,
  afterSubmit,
  onCancel,
  token,
  managementCloudId,
  resources, // mapStateToProps
  subsets, // mapSelectToProps
  fetchSubsets, // mapDispatchToProps
}) => {
  const [isFormModalActive, openFormModal, closeFormModal] = useModal();
  const [isConfirmModalActive, openConfirmModal, closeConfirmModal] = useModal();
  const [currentName, setCurrentName] = useState(propertySet?.Name);
  const [currentDescription, setCurrentDescription] = useState(propertySet?.Description);
  const [currentSubsets, setCurrentSubsets] = useState([]);
  const { register, handleSubmit, control, errors, setValue, getValues } = useForm();

  useEffect(() => {
    if (propertySet) fetchSubsets(propertySet?.Id);
  }, [propertySet]);

  useEffect(() => {
    isDisplayed ? openFormModal() : closeFormModal();
  }, [isDisplayed]);

  useEffect(() => {
    if (propertySet && subsets)
      setCurrentSubsets(
        subsets?.filter((subset) => !subset.IsDefault).map((subset) => createDropdownOption(subset))
      );
  }, [propertySet, subsets]);

  useEffect(() => {
    setValue('name', currentName);
  }, [currentName]);

  useEffect(() => {
    setValue('description', currentDescription);
  }, [currentDescription]);

  useEffect(() => {
    setValue('subsets', currentSubsets);
  }, [currentSubsets]);

  /**
   * Handles form data, evaluates if confirm modal is needed
   * @param data
   */
  const processSubmit = async (data) => {
    // Subset has been deleted in existing Set
    const isConfirmDisplay = propertySet && getMissingSubsets(data.subsets, subsets)?.length > 0;

    if (isConfirmDisplay) {
      openConfirmModal();
    } else {
      onSubmit(data);
    }
  };

  const onSubmit = async (data) => {
    const subsetsCreate = (getValues('subsets') || []).map((dropdownOption) => ({
      Name: dropdownOption?.label,
    }));
    await API.createEditPropertySet(
      managementCloudId,
      token,
      resources,
      { subsets: subsetsCreate, keepPropertiesWithValue: data.shouldKeep, ...data },
      propertySet
    );
    setCurrentSubsets([]);
    closeFormModal();
    afterSubmit();
  };

  const handleConfirmCancel = () => {
    closeConfirmModal();
    const missingSubsets = getMissingSubsets(getValues('subsets'), subsets);
    const revertedSubsets = (getValues('subsets') || []).concat(
      missingSubsets.map((subset) => createDropdownOption(subset))
    );
    setCurrentSubsets(revertedSubsets);
  };

  const handleConfirmSubmit = async (shouldKeep) => {
    closeConfirmModal();
    const formValues = { shouldKeep, ...getValues() };
    onSubmit(formValues);
  };

  const handleChangeName: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setCurrentName(event.target.value);
    },
    [setCurrentName]
  );

  const handleChangeDescription: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setCurrentDescription(event.target.value);
    },
    [setCurrentDescription]
  );

  const handleChangeSubsets = useCallback(
    (subsets) => {
      const updatedSubsets = (subsets || []).map((subset) => ({
        ...subset,
        color: subset.color ?? 'primary',
      }));
      setCurrentSubsets(updatedSubsets);
    },
    [setCurrentSubsets]
  );

  const renderDescription = () => (
    <TextField
      isMultiline
      value={currentDescription}
      onChange={handleChangeDescription}
      placeholder={resources.ContentManagementPropSetForm.FieldDescriptionPlaceHolder}
      label={resources.ContentManagementPropSetForm.FieldDescriptionLabel}
      maxLength={300}
      isDisabled={propertySet?.IsPublic}
    />
  );

  const renderName = () => (
    <TextField
      placeholder={resources.ContentManagementPropSetForm.FieldNamePlaceHolder}
      label={resources.ContentManagementPropSetForm.FieldNameLabel}
      ref={register({ required: true })}
      isRequired
      isError={errors && errors.name}
      helperText={errors && errors.name ? resources.MetaResource.Required : null}
      value={currentName}
      onChange={handleChangeName}
      isDisabled={propertySet?.IsPublic}
    />
  );

  const renderSubsets = ({ value }) => (
    <Dropdown
      value={value}
      isMulti
      isCreatable
      hasOptionTags
      LabelText={resources.ContentManagementPropSetForm.FieldSubsetsLabel}
      placeholder={resources.ContentManagementPropSetForm.FieldSubsetsPlaceHolder}
      placeholderInside={resources.ContentManagement.SearchSubset}
      noOptionsMessage={() => resources.ContentManagement.NoSubsetFound}
      createLabel={resources.MetaResource.Create}
      noMargin
      options={currentSubsets}
      onChange={handleChangeSubsets}
      isDisabled={propertySet?.IsPublic}
    />
  );

  return (
    <>
      <Modal active={isFormModalActive} close={onCancel} size="medium">
        <InfoModal.Title>{resources.ContentManagementPropSetForm.ModalTitle}</InfoModal.Title>
        <form>
          <InfoModal.Content>
            <Stack space={space[100]}>
              <Controller
                name="name"
                control={control}
                defaultValue={currentName}
                render={renderName}
              />
              <Controller
                name="description"
                control={control}
                defaultValue={currentDescription}
                render={renderDescription}
              />
              <Controller
                name="subsets"
                control={control}
                defaultValue={[]}
                render={renderSubsets}
              />
            </Stack>
          </InfoModal.Content>
          <InfoModal.Actions>
            <FormMainActions>
              <InfoModal.SecondaryCTA
                isDisabled={propertySet?.IsPublic}
                label={resources.MetaResource.Cancel}
                onClick={onCancel}
              />
              <InfoModal.PrimaryCTA
                isDisabled={propertySet?.IsPublic}
                label={
                  propertySet
                    ? resources.ContentManagementPropSetForm.FormEdit
                    : resources.ContentManagementPropSetForm.FormCreate
                }
                onClick={handleSubmit(processSubmit)}
              />
            </FormMainActions>
          </InfoModal.Actions>
        </form>
      </Modal>
      <DeleteConfirm
        isDisplayed={isConfirmModalActive}
        title={resources.ContentManagementPropSetForm.ModalConfirmTitle}
        description={resources.ContentManagementPropSetForm.ModalConfirmText}
        checkboxLabel={resources.ContentManagementPropSetForm.ModalConfirmCheckbox}
        submitButtonLabel={resources.ContentManagementPropSetForm.ModalConfirmSubmit}
        onCancel={handleConfirmCancel}
        onSubmit={handleConfirmSubmit}
      />
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
  managementCloudId: selectManagementCloudId,
  resources: selectTranslatedResources,
  subsets: selectSubsetsWithoutDefault,
});

const mapDispatchToProps = (dispatch) => ({
  fetchSubsets: (setId: number) => dispatch(fetchSubsetsAction(setId)),
});

// StyleD
const FormMainActions = styled(InfoModal.MainActions)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(PropertiesSetForm));