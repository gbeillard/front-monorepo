import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Button, shadow, defaultTheme, space, P } from '@bim-co/componentui-foundation';
import styled from '@emotion/styled';
import {
  addProperties as addPropertiesToNodeAction,
  fetchProperties as fetchPropertiesAction,
  updateProperty as updatePropertyAction,
  deleteProperty as deletePropertyAction,
  setFilter as setPropertiesFilterAction,
} from '../../../../Reducers/classifications/properties/actions';
import { NodeProperty } from '../../../../Reducers/classifications/properties/types';
import { IClassificationNode } from '../../../../Reducers/classifications/types';
import { selectNodeProperties } from '../../../../Reducers/classifications/properties/selectors';
import { fetchAllSubsets as fetchAllSubsetsAction } from '../../../../Reducers/Sets/Subsets/actions';
import { selectAllSubsetsForDisplayWithDefaultFilteredBySetAndText } from '../../../../Reducers/Sets/Subsets/selectors';
import { Subset } from '../../../../Reducers/Sets/Subsets/types';
import {
  addSubsets as addSubsetsToNodeAction,
  fetchSubsets as fetchNodeSubsetsAction,
  removeSubset as removeSubsetAction,
  setFilter as setFilterAction,
} from '../../../../Reducers/classifications/subsets/actions';
import {
  selectSubsets as selectNodeSubsets,
  selectFilteredSubsets,
  selectFilter,
} from '../../../../Reducers/classifications/subsets/selectors';

import PropertyAttributesTable from './PropertyAttributesTable';
import SubsetsTable from './SubsetsTable';
import PropertySubsetsTable from './PropertySubsetsTable';

import { Filter } from '../../../../Reducers/classifications/subsets/types';
import { fetchSets as fetchSetsAction } from '../../../../Reducers/properties-sets/actions';
import { selectPropertiesSets } from '../../../../Reducers/properties-sets/selectors';
import { Set } from '../../../../Reducers/properties-sets/types';
import { PropertiesView, View } from './types';
import PropertyFilters from './PropertyFilters';

import {
  addSubset as addSubsetToPropertyAction,
  removeSubset as removeSubsetFromPropertyAction,
} from '../../../../Reducers/classifications/properties/subsets/actions';
import { FlexWrapper } from './_shared/styles';
import PropertiesPickerModal from '../../../CommonsElements/PropertiesPicker/PropertiesPickerModal';
import {
  selectLanguageCode,
  selectEnableSetsManagement,
  selectTranslatedResources,
} from '../../../../Reducers/app/selectors';

import Title from './Title';
import { LanguageCode } from '../../../../Reducers/app/types';
import DeleteConfirm from '../../../PropertiesSets/DeleteConfirm';
import { replaceStringByComponent } from '../../../../Utils/utilsResources';

const Wrapper = styled.div`
  background-color: ${defaultTheme.backgroundColor};
  box-shadow: ${shadow[30]};
  border-radius: ${defaultTheme.borderRadiusBig};
  padding: ${space[200]} ${space[100]} 0;
  max-height: 75vh;
  display: flex;
  flex-flow: column;
  &:after {
    content: '';
    position: absolute;
    z-index: 1;
    bottom: 0;
    left: 0;
    pointer-events: none;
    background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 74.48%);
    width: 100%;
    height: ${space[300]};
    border-radius: ${space[50]};
  }
`;
const MainWrapper = styled(FlexWrapper)`
  margin-top: ${space[62]};
`;
const TableWrapper = styled.div`
  overflow-y: auto;
  flex-grow: 1;
  padding-bottom: ${space[200]};
`;
const CloseWrapper = styled.div`
  position: absolute;
  top: ${space[25]};
  right: ${space[25]};
`;
const Description = styled(P)`
  color: ${defaultTheme.textColorTertiary};
  margin-left: ${space[50]};
  margin-top: ${space[50]};
`;
const EditButton = styled(Button)`
  margin-left: ${space[50]};
`;
const DeleteModalEmphasis = styled.span`
  color: ${defaultTheme.primaryColor};
`;
type Props = {
  classificationId: number;
  node?: IClassificationNode;
  subsets: Subset[];
  allSubsets: Subset[];
  subsetsFilter: Filter;
  sets: Set[];
  nodeProperties: NodeProperty[];
  nodeSubsets: Subset[];
  enableSets: boolean;
  languageCode: LanguageCode;
  disableCriticalFeatures: boolean;
  resources: any;
  fetchProperties: (classificationId: number, nodeId: number) => void;
  updateProperty: (classificationId: number, nodeId: number, property: NodeProperty) => void;
  deleteProperty: (
    classificationId: number,
    nodeId: number,
    property: NodeProperty,
    keepPropertiesWithValue: boolean
  ) => void;
  fetchSubsets: (classificationId: number, nodeId: number) => void;
  fetchAllSubsets: () => void;
  removeSubset: (
    classificationId: number,
    nodeId: number,
    subset: Subset,
    keepPropertiesWithValue: boolean
  ) => void;
  setSubsetsFilter: (filter: Filter) => void;
  setPropertiesFilter: (filter: { text: string; setId: number; domainId: number }) => void;
  fetchSets: () => void;
  addSubsetToProperty: (c: number, n: number, p: NodeProperty, s: Subset) => void;
  removeSubsetFromProperty: (c: number, n: number, p: NodeProperty, s: Subset) => void;
  addSubsetsToNode: (classificationid: number, nodeId: number, subsets: Subset[]) => void;
  addPropertiesToNode: (
    classificationid: number,
    nodeId: number,
    properties: NodeProperty[]
  ) => void;
  onClose: () => void;
  onEditNode: () => void;
};

const Panel: React.FC<Props> = ({
  classificationId,
  node,
  nodeProperties,
  nodeSubsets,
  enableSets,
  languageCode,
  disableCriticalFeatures,
  resources,
  fetchProperties,
  updateProperty,
  deleteProperty,
  fetchSubsets,
  fetchAllSubsets,
  removeSubset,
  fetchSets,
  addSubsetToProperty,
  removeSubsetFromProperty,
  addSubsetsToNode,
  addPropertiesToNode,
  onClose,
  onEditNode,
  setSubsetsFilter,
  setPropertiesFilter,
}) => {
  const [view, setView] = useState(View.Properties);
  const [propertiesView, setPropertiesView] = useState(PropertiesView.Attributes);
  const [show, setShow] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<NodeProperty>(null);
  const [subsetToDelete, setSubsetToDelete] = useState<Subset>(null);

  useEffect(() => {
    if (!node?.Id) {
      return;
    }
    setPropertiesFilter({ domainId: null, setId: null, text: '' });
    setSubsetsFilter({ setId: null, text: '' });
    fetchSets();
    fetchProperties(classificationId, node.Id);
    fetchSubsets(classificationId, node.Id);
    fetchAllSubsets();
  }, [node?.Id, languageCode]);

  const onChangePropertyHandler = (property: NodeProperty) => {
    updateProperty(classificationId, node.Id, property);
  };

  const onDeletePropertyHandler = (property: NodeProperty, keepPropertiesWithValue: boolean) => {
    deleteProperty(classificationId, node.Id, property, keepPropertiesWithValue);
    setPropertyToDelete(null);
  };

  const onDeleteSubsetHandler = (subset: Subset, keepPropertiesWithValue: boolean) => {
    removeSubset(classificationId, node.Id, subset, keepPropertiesWithValue);
    setSubsetToDelete(null);
  };

  const onAddSubsetToPropertyHandler = (property: NodeProperty, subset: Subset) => {
    addSubsetToProperty(classificationId, node.Id, property, subset);
  };

  const onRemoveSubsetFromPropertyHandler = (property: NodeProperty, subset: Subset) => {
    removeSubsetFromProperty(classificationId, node.Id, property, subset);
  };

  const onPickerConfirmHandler = ({ properties, subsets }) => {
    if (properties.length > 0) {
      const propertiesWithSubsets = properties.map((property) => ({ ...property, Subsets: [] }));
      addPropertiesToNode(classificationId, node.Id, propertiesWithSubsets);
    }
    if (subsets.length > 0) {
      addSubsetsToNode(classificationId, node.Id, subsets);
    }
    setShow(false);
  };

  if (node === null) {
    return null;
  }

  return (
    <Wrapper>
      <CloseWrapper>
        <Button icon="x" variant="alternative" onClick={onClose} />
      </CloseWrapper>
      <MainWrapper apart>
        <FlexWrapper>
          <Title view={view} onViewChange={setView} node={node} />
          {!disableCriticalFeatures && (
            <EditButton icon="edit" size="default" variant="alternative" onClick={onEditNode} />
          )}
        </FlexWrapper>
        <FlexWrapper>
          <Button
            icon="add"
            onClick={() => setShow(true)}
            variant="secondary"
            disabled={disableCriticalFeatures}
          >
            {view === View.Properties
              ? resources.ClassificationDetails.AddProperty
              : resources.ClassificationDetails.AddSet}
          </Button>
        </FlexWrapper>
      </MainWrapper>
      {node.Description && <Description>{node.Description}</Description>}
      {view === View.Properties && propertiesView === PropertiesView.Attributes && (
        <>
          <PropertyFilters view={propertiesView} onViewChange={setPropertiesView} />
          <TableWrapper>
            <PropertyAttributesTable
              onChange={onChangePropertyHandler}
              onDelete={setPropertyToDelete}
              disableCriticalFeatures={disableCriticalFeatures}
            />
          </TableWrapper>
        </>
      )}
      {view === View.Properties && propertiesView === PropertiesView.Subsets && (
        <>
          <PropertyFilters view={propertiesView} onViewChange={setPropertiesView} />
          <TableWrapper>
            <PropertySubsetsTable
              onDelete={setPropertyToDelete}
              onAddSubset={onAddSubsetToPropertyHandler}
              onRemoveSubset={onRemoveSubsetFromPropertyHandler}
              disableCriticalFeatures={disableCriticalFeatures}
            />
          </TableWrapper>
        </>
      )}
      {view === View.Sets && (
        <TableWrapper>
          <SubsetsTable
            onDelete={setSubsetToDelete}
            disableCriticalFeatures={disableCriticalFeatures}
          />
        </TableWrapper>
      )}
      <PropertiesPickerModal
        isDisplayed={show}
        onClose={() => setShow(false)}
        onCancel={() => setShow(false)}
        onConfirm={onPickerConfirmHandler}
        enableSets={enableSets}
        view={view}
        setView={setView}
        existingElements={{ properties: nodeProperties, subsets: nodeSubsets }}
      />
      <DeleteConfirm
        isDisplayed={subsetToDelete !== null}
        title={replaceStringByComponent(
          resources.ClassificationDetails.DeleteSubsetTitle,
          '[SubsetName]',
          <DeleteModalEmphasis>{subsetToDelete?.Name}</DeleteModalEmphasis>
        )}
        description={resources.ClassificationDetails.DeleteSubsetDescription}
        checkboxLabel={resources.ClassificationDetails.DeleteSubsetCheckboxLabel}
        submitButtonLabel={resources.ClassificationDetails.DeleteSubsetConfirm}
        onCancel={() => setSubsetToDelete(null)}
        onSubmit={(keepPropertiesWithValue) =>
          onDeleteSubsetHandler(subsetToDelete, keepPropertiesWithValue)
        }
      />
      <DeleteConfirm
        isDisplayed={propertyToDelete !== null}
        title={replaceStringByComponent(
          resources.ClassificationDetails.DeletePropertyTitle,
          '[PropertyName]',
          <DeleteModalEmphasis>{propertyToDelete?.Name}</DeleteModalEmphasis>
        )}
        description={resources.ClassificationDetails.DeletePropertyDescription}
        checkboxLabel={resources.ClassificationDetails.DeletePropertyCheckboxLabel}
        submitButtonLabel={resources.ClassificationDetails.DeletePropertyConfirm}
        onCancel={() => setPropertyToDelete(null)}
        onSubmit={(keepPropertiesWithValue) =>
          onDeletePropertyHandler(propertyToDelete, keepPropertiesWithValue)
        }
      />
    </Wrapper>
  );
};

const mapStateToProps = createStructuredSelector({
  subsets: selectFilteredSubsets,
  allSubsets: selectAllSubsetsForDisplayWithDefaultFilteredBySetAndText,
  subsetsFilter: selectFilter,
  sets: selectPropertiesSets,
  nodeProperties: selectNodeProperties,
  nodeSubsets: selectNodeSubsets,
  enableSets: selectEnableSetsManagement,
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
});
const mapDispatchToProps = (dispatch: any) => ({
  fetchProperties: (classificationId: number, nodeId: number) =>
    dispatch(fetchPropertiesAction(classificationId, nodeId)),
  updateProperty: (classificationId: number, nodeId: number, property: NodeProperty) =>
    dispatch(updatePropertyAction(classificationId, nodeId, property)),
  deleteProperty: (
    classificationId: number,
    nodeId: number,
    property: NodeProperty,
    keepPropertiesWithValue: boolean
  ) => dispatch(deletePropertyAction(classificationId, nodeId, property, keepPropertiesWithValue)),
  fetchSubsets: (classificationId: number, nodeId: number) =>
    dispatch(fetchNodeSubsetsAction(classificationId, nodeId)),
  fetchAllSubsets: () => dispatch(fetchAllSubsetsAction()),
  removeSubset: (
    classificationId: number,
    nodeId: number,
    subset: Subset,
    keepPropertiesWithValue: boolean
  ) => dispatch(removeSubsetAction(classificationId, nodeId, subset, keepPropertiesWithValue)),
  setSubsetsFilter: (filter: Filter) => dispatch(setFilterAction(filter)),
  setPropertiesFilter: (filter: { text: string; setId: number; domainId: number }) =>
    dispatch(setPropertiesFilterAction(filter)),
  fetchSets: () => dispatch(fetchSetsAction()),
  addSubsetToProperty: (
    classificationId: number,
    nodeId: number,
    property: NodeProperty,
    subset: Subset
  ) => dispatch(addSubsetToPropertyAction(classificationId, nodeId, property, subset)),
  removeSubsetFromProperty: (
    classificationId: number,
    nodeId: number,
    property: NodeProperty,
    subset: Subset
  ) => dispatch(removeSubsetFromPropertyAction(classificationId, nodeId, property, subset)),
  addSubsetsToNode: (classificationId: number, nodeId: number, subsets: Subset[]) =>
    dispatch(addSubsetsToNodeAction(classificationId, nodeId, subsets)),
  addPropertiesToNode: (classificationId: number, nodeId: number, properties: NodeProperty[]) =>
    dispatch(addPropertiesToNodeAction(classificationId, nodeId, properties)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Panel);