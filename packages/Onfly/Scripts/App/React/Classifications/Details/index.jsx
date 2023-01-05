/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useNavigate, useParams } from 'react-router-dom';
import { history } from '../../../history';
import Component from './Component';
import {
  fetchNodes as fetchNodesAction,
  setNodes as setNodesAction,
  updateNode as updateNodeAction,
  setNodesFilter as setNodesFilterAction,
  selectNode as selectNodeAction,
  addNodeToClassification as addNodeToClassificationAction,
  removeNodeFromClassification as removeNodeFromClassificationAction,
  moveNode as moveNodeAction,
  fetchClassification as fetchClassificationAction,
  deleteClassification as deleteClassificationAction,
  resetState as resetClassificationsStateAction,
} from '../../../Reducers/classifications/actions';
import {
  selectDisplayedNodesFilter,
  selectNodesDisplay,
  selectSelectedNode,
  selectProperties,
  selectMappedClassification,
  selectLanguage,
} from '../../../Reducers/classifications/selectors';
import {
  selectLanguageCode,
  selectManagementCloudId,
  selectTranslatedResources,
  selectSettings,
  selectUser,
  selectIsBoostOffer,
} from '../../../Reducers/app/selectors';
import { isDisableCriticalFeatures } from '../utils';

const DetailsContainer = ({
  classification,
  properties,
  fetchClassification,
  deleteClassification,
  fetchNodes,
  moveNode,
  updateNode,
  selectNode,
  addNodeToClassification,
  removeNodeFromClassification,
  filter,
  setFilter,
  display,
  languageCode,
  currentNode,
  resources,
  classificationsLanguage,
  resetClassificationsState,
  onflyId,
  isBoostOffer,
  settings,
  user,
}) => {
  const navigate = useNavigate();

  const { classificationId } = useParams();

  useEffect(() => {
    // mount
    fetchClassification(classificationId);

    // unmount
    return () => {
      resetClassificationsState();
    };
  }, []);

  useEffect(() => {
    if (classificationId) {
      fetchClassification(classificationId);
    }
  }, [classificationsLanguage]);

  useEffect(() => {
    if (classificationId) {
      fetchNodes(classificationId);
    }
  }, [classificationId]);

  if (!settings.EnableClassificationManagement) {
    return (
      <div className="text-center">
        <h1 className="loadingtext">BIM&CO - ONFLY</h1>
        <p>{resources.ContentManagement.Error403}</p>
      </div>
    );
  }

  if (!classification.nodes) {
    return <span>Loading...</span>;
  }

  const onPageChangeHandler = (id) => {
    const url = `/${languageCode}/manage-classifications/${id}`;
    navigate(url);
  };

  const onLanguageChangeHandler = (language) => {
    const url = `/${language}/manage-classifications/${classification.id}`;
    navigate(url);
  };

  const onNodeAddedHandler = (addedNode, nodeId) => {
    addNodeToClassification(classification.Id, nodeId, addedNode);
  };

  const onNodeDeletedHandler = (node, keepPropertiesWithValue) => {
    removeNodeFromClassification(classification.Id, node, keepPropertiesWithValue);
  };

  const onNodeEditedHandler = (node) => {
    updateNode(classification.Id, node);
  };

  const onNodeMovedHandler = (node, target) => {
    moveNode(classification.Id, node, target);
  };

  const onDeleteClassificationHandler = (keepPropertiesWithValue) => {
    deleteClassification(classification, keepPropertiesWithValue);
    const url = `/${languageCode}/manage-classifications`;
    history.push(url);
  };

  const onClassificationEditedHandler = () => {
    fetchClassification(classification.Id);
  };

  return (
    <Component
      classification={classification}
      onDeleteClassification={onDeleteClassificationHandler}
      properties={properties}
      filter={filter}
      onNodeSelected={selectNode}
      onNodeAdded={onNodeAddedHandler}
      onNodeDeleted={onNodeDeletedHandler}
      onNodeMoved={onNodeMovedHandler}
      onFilterChanged={setFilter}
      display={display}
      onPageChange={onPageChangeHandler}
      currentLanguageCode={languageCode}
      onLanguageChange={onLanguageChangeHandler}
      currentNode={currentNode}
      resources={resources}
      onNodeEdited={onNodeEditedHandler}
      onClassificationEdited={onClassificationEditedHandler}
      disableCriticalFeatures={isDisableCriticalFeatures(
        classification,
        isBoostOffer,
        onflyId,
        user
      )}
    />
  );
};

const mapStateToProps = createStructuredSelector({
  classification: selectMappedClassification,
  properties: selectProperties,
  filter: selectDisplayedNodesFilter,
  display: selectNodesDisplay,
  languageCode: selectLanguageCode,
  currentNode: selectSelectedNode,
  resources: selectTranslatedResources,
  classificationsLanguage: selectLanguage,
  onflyId: selectManagementCloudId,
  settings: selectSettings,
  user: selectUser,
  isBoostOffer: selectIsBoostOffer,
});

const mapDispatchToProps = (dispatch) => ({
  fetchClassification: (id) => dispatch(fetchClassificationAction(id)),
  deleteClassification: (classification, keepPropertiesWithValue) =>
    dispatch(deleteClassificationAction(classification, keepPropertiesWithValue)),
  fetchNodes: (id) => dispatch(fetchNodesAction(id)),
  setNodes: (nodes) => dispatch(setNodesAction(nodes)),
  updateNode: (classificationId, node) => dispatch(updateNodeAction(classificationId, node)),
  selectNode: (node) => dispatch(selectNodeAction(node)),
  addNodeToClassification: (classificationId, nodeId, node) =>
    dispatch(addNodeToClassificationAction(classificationId, nodeId, node)),
  removeNodeFromClassification: (classificationId, node, keepPropertiesWithValue) =>
    dispatch(removeNodeFromClassificationAction(classificationId, node, keepPropertiesWithValue)),
  moveNode: (classificationId, target, node) =>
    dispatch(moveNodeAction(classificationId, target, node)),
  setFilter: (filter) => dispatch(setNodesFilterAction(filter)),
  resetClassificationsState: () => dispatch(resetClassificationsStateAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailsContainer);