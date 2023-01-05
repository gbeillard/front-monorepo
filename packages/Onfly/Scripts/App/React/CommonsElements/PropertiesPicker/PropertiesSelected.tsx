import React, { useState, useEffect, useContext } from 'react';
import styled from '@emotion/styled';
import { InfoModal, colors, space, H3, Button, Concept } from '@bim-co/componentui-foundation';

import {
  PropertiesSelectContextDispatch,
  PropertiesSelectContextState,
} from './PropertiesPickerModal';
import { REMOVE_SELECTED_SUBSET, REMOVE_SELECTED_PROPERTY } from './Reducers/types';

type Props = {
  resources: any;
  onSubmit?: () => void;
  onCancel?: () => void;
};

type InnerProps = {
  isDisplayed?: boolean;
};

const getSubsetsSelections = (state) => state?.subsets?.selections;
const getPropertiesSelections = (state) => state?.properties?.selections;

/**
 * Main component
 */
const PropertiesSelected: React.FC<Props> = ({ resources, onCancel, onSubmit }) => {
  const propertiesSelectDispatch = useContext(PropertiesSelectContextDispatch);
  const propertiesSelectContextState = useContext(PropertiesSelectContextState);
  const [isDisplayed, setIsDisplayed] = useState(false);

  useEffect(() => {
    if (
      getSubsetsSelections(propertiesSelectContextState) &&
      getSubsetsSelections(propertiesSelectContextState).length > 0
    ) {
      setIsDisplayed(true);
    } else if (
      getPropertiesSelections(propertiesSelectContextState) &&
      getPropertiesSelections(propertiesSelectContextState).length > 0
    ) {
      setIsDisplayed(true);
    } else {
      setIsDisplayed(false);
    }
  }, [propertiesSelectContextState]);

  const handleDelete = (item, type) => {
    const dispatchType = type === 'subset' ? REMOVE_SELECTED_SUBSET : REMOVE_SELECTED_PROPERTY;
    propertiesSelectDispatch({ type: dispatchType, payload: item });
  };

  const renderSelectedSubsets = () => {
    if (
      !getSubsetsSelections(propertiesSelectContextState) ||
      getSubsetsSelections(propertiesSelectContextState).length < 0
    ) {
      return null;
    }
    const subsetsSelected = getSubsetsSelections(propertiesSelectContextState)?.map(
      (selectedItem) => {
        const setName: string = selectedItem?.Set ? selectedItem.Set.Name : null;
        const subsetName: string = selectedItem?.Name;
        const isSubsetDefault: boolean = selectedItem.IsDefault;
        return (
          <SubsetChip
            color="bm"
            key={selectedItem.Id}
            onDelete={() => handleDelete(selectedItem, 'subset')}
          >
            {isSubsetDefault ? `${setName}` : `${setName} - ${subsetName}`}
          </SubsetChip>
        );
      }
    );

    return <SelectedItemsContainer>{subsetsSelected}</SelectedItemsContainer>;
  };

  const renderSelectedProperties = () => {
    if (
      !getPropertiesSelections(propertiesSelectContextState) ||
      getPropertiesSelections(propertiesSelectContextState).length < 0
    ) {
      return null;
    }
    const propertiesSelected = getPropertiesSelections(propertiesSelectContextState)?.map(
      (selectedItem) => {
        const propertyName = selectedItem?.Name;
        return (
          <PropertyChip
            color="bm"
            key={selectedItem.Id}
            onDelete={() => handleDelete(selectedItem, 'property')}
          >
            {propertyName}
          </PropertyChip>
        );
      }
    );

    return <SelectedItemsContainer>{propertiesSelected}</SelectedItemsContainer>;
  };

  return (
    <Right isDisplayed={isDisplayed}>
      <Title>{resources.ContentManagement.PopinPropertiesSelectedTitle}</Title>
      <Selections>
        {renderSelectedSubsets()}
        {renderSelectedProperties()}
      </Selections>
      <HR />
      <CTAButtons>
        <CTAButton variant="alternative" onClick={onCancel}>
          {resources.MetaResource.Cancel}
        </CTAButton>
        <CTAButton variant="primary" onClick={onSubmit}>
          {resources.ContentManagement.PopinPropertiesConfirm}
        </CTAButton>
      </CTAButtons>
    </Right>
  );
};

// eslint-disable-next-line space-infix-ops
export const Right = styled.div<InnerProps>`
  display: flex;
  flex-direction: column;

  height: 100%;
  width: ${(props) => (props.isDisplayed ? '100%' : 0)};
  max-width: ${space[2000]};
  border-left: ${(props) => (props.isDisplayed ? `1px solid ${colors.BM[10]}` : '')};
  background-color: ${colors.NEUTRAL[10]};
  transition: width 0.3s cubic-bezier(0.42, 0, 0.58, 1), opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1);
  opacity: ${(props) => (props.isDisplayed ? 1 : 0)};
  overflow-x: ${(props) => (props.isDisplayed ? 'auto' : 'hidden')};
  overflow-y: auto;

  border-top-right-radius: ${space[50]};
  border-bottom-right-radius: ${space[50]};
`;

export const Title = styled(H3)`
  width: 100%;
  padding-top: ${space[200]};
  padding-left: ${space[200]};
  padding-bottom: 0;
  line-height: ${space[150]};
`;

export const Selections = styled.div`
  overflow: auto;
  width: 100%;
  margin-top: ${space[50]}; /* to align the scrollbar with the container */
  padding-left: ${space[200]};
  padding-right: ${space[25]};
  flex-grow: 1;
`;

export const SelectedItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: ${space[1600]};

  > &:first-of-type {
    margin-top: 0;
  }

  > * {
    margin-top: ${space[50]};
  }
`;

export const PropertyChip = styled(Concept.PropertyWithChip)``;

export const SubsetChip = styled(Concept.PropSetWithChip)``;

export const HR = styled.hr`
  margin-top: ${space[50]};
  margin-bottom: ${space[50]};
`;

export const CTAButtons = styled(InfoModal.Actions)`
  display: inline-flex;
  justify-content: center;
  column-gap: ${space[50]};
  width: 100%;
  padding-top: ${space[50]};
  padding-bottom: ${space[100]};
`;
export const CTAButton = styled(Button)``;

export default React.memo(PropertiesSelected);