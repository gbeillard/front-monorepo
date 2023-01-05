/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useDrag, useDrop } from 'react-dnd';

import { P, space, getClassificationColorFromId, defaultTheme } from '@bim-co/componentui-foundation';
import Dialog from '@material-ui/core/Dialog';

// eslint-disable-next-line import/no-cycle
import NodeList from './NodeList.jsx';
import AddButton from './AddButton.jsx';
import DeleteButton from './DeleteButton.jsx';
import Arrow from './Arrow.jsx';

import { DRAG_TYPES } from './constants';
import { NODES_DISPLAY } from '../../../../Reducers/classifications/types';
import { searchTree, hasItems } from './utils';
import AddDialogContent from './AddDialogContent.jsx';
import DeleteConfirm from '../../../PropertiesSets/DeleteConfirm';

import { replaceStringByComponent } from '../../../../Utils/utilsResources';

const Node = ({
  classificationId,
  node,
  onNodeSelected,
  onNodeAdded,
  onNodeDeleted,
  onNodeMoved,
  display,
  resources,
  nestingLevel,
  disableCriticalFeatures,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef(null);
  const canDropHandler = (droppedNode) => {
    if (
      disableCriticalFeatures ||
      display === NODES_DISPLAY.FILTER ||
      droppedNode.Id === node.Id || // drop on self
      node.Children.find((child) => child.Id === droppedNode.Id) || // drop in parent
      searchTree(droppedNode, node.Id) // drop in child
    ) {
      return false;
    }

    return true;
  };
  const onNodeDropped = (droppedNode, monitor) => {
    if (disableCriticalFeatures || monitor.didDrop()) {
      return;
    }
    onNodeMoved(node, droppedNode);
  };
  const [{ isOverCurrent }, drop] = useDrop({
    accept: DRAG_TYPES.NODE,
    canDrop: (item) => canDropHandler(item.dndNode),
    drop: (item, monitor) => onNodeDropped(item.dndNode, monitor),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  const [, drag] = useDrag({
    item: { type: DRAG_TYPES.NODE, dndNode: node },
  });

  // combine refs
  drag(drop(ref));

  const onToggleExpand = (event) => {
    setIsExpanded(!isExpanded);
    event.preventDefault();
  };

  const onNodeClickHandler = () => {
    onNodeSelected(node);
  };

  const openAdd = (event) => {
    event.stopPropagation();
    setShowAddModal(true);
  };

  const closeAdd = () => {
    setShowAddModal(false);
  };

  const onNodeCreated = (addedNode) => {
    onNodeAdded(addedNode, node.Id);
    closeAdd();
  };

  const openDelete = (event) => {
    event.stopPropagation();
    setShowDeleteModal(true);
  };

  const closeDelete = () => {
    setShowDeleteModal(false);
  };

  const onDelete = (keepPropertiesWithValue) => {
    onNodeDeleted(node, keepPropertiesWithValue);
    closeDelete();
  };

  const getDeleteModalTitle = (node) => {
    const title = resources.ContentManagementClassif.DeleteClassifNodeTitleV2;
    const nodeName = <ModalDeleteNodeName>{node?.Name}</ModalDeleteNodeName>;

    return replaceStringByComponent(title, '[ClassificationNodeName]', nodeName);
  };

  const hasChildren = hasItems(node.Children);

  return (
    <NodeItem ref={ref} dropping={isOverCurrent} disableCriticalFeatures={disableCriticalFeatures}>
      <Content>
        <Arrow
          selected={node.selected}
          hasChildren={hasChildren}
          nestingLevel={nestingLevel}
          expanded={isExpanded}
          onClick={onToggleExpand}
        />
        <Bubble selected={node.selected} onClick={onNodeClickHandler}>
          <Dot classificationId={classificationId} depth={nestingLevel} />
          <Name selected={node.selected}>
            {node.Code && `${node.Code} - `} {node.Name}
          </Name>
          {!disableCriticalFeatures && node.selected && <AddButton onClick={openAdd} />}
          {!disableCriticalFeatures && node.selected && <DeleteButton onClick={openDelete} />}
        </Bubble>
      </Content>
      <NodeList
        classificationId={classificationId}
        nodes={node.Children}
        onNodeSelected={onNodeSelected}
        resources={resources}
        onNodeAdded={onNodeAdded}
        onNodeDeleted={onNodeDeleted}
        onNodeMoved={onNodeMoved}
        showLeftBorder
        nestingLevel={nestingLevel + 1}
        show={isExpanded}
        disableCriticalFeatures={disableCriticalFeatures}
      />
      <Dialog open={showAddModal} onClose={closeAdd}>
        <AddDialogContent
          parentId={node.Id}
          resources={resources}
          onNodeAdded={onNodeCreated}
          onClose={closeAdd}
        />
      </Dialog>
      <DeleteConfirm
        isDisplayed={showDeleteModal}
        title={getDeleteModalTitle(node)}
        description={resources.ContentManagementClassif.DeleteClassifNodeDescriptionV2}
        checkboxLabel={resources.ContentManagementPropSetForm.ModalConfirmCheckbox}
        submitButtonLabel={resources.ContentManagementClassif.DeleteClassifNodeConfirm}
        onCancel={closeDelete}
        onSubmit={(keepPropertiesWithValue) => onDelete(keepPropertiesWithValue)}
      />
    </NodeItem>
  );
};

const NodeItem = styled.div`
  border: ${({ dropping, disableCriticalFeatures }) =>
    dropping && !disableCriticalFeatures
      ? `1px solid ${defaultTheme.textColorSecondary}`
      : '1px solid transparent'};
  border-radius: ${defaultTheme.borderRadiusBig};
`;

const Content = styled.span`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`;

const getOpacity = (depth = 0) => Math.max(1 - depth * 0.2, 0.4);

const Dot = styled.span`
  width: ${space[100]};
  height: ${space[100]};
  margin-right: ${space[50]};
  margin-left: 0;
  border-radius: 50%;
  background-color: ${({ classificationId }) =>
    getClassificationColorFromId(classificationId).color};
  opacity: ${({ depth }) => getOpacity(depth)};
`;

const Bubble = styled.span`
  border-radius: 30px;
  border: ${space[12]} solid;
  border-color: ${(props) => (props.selected ? defaultTheme.primaryColor : 'transparent')};
  background-color: ${(props) => (props.selected ? defaultTheme.backgroundColor : '')};
  padding: ${space[25]} ${space[62]};
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${defaultTheme.textColorSecondary};
`;

const Name = styled(P)`
  font-weight: ${({ selected }) => (selected ? defaultTheme.boldWeight : 'initial')};
  font-size: ${space[87]};
  line-height: ${space[150]};
  margin-right: ${space[50]};
`;

const ModalDeleteNodeName = styled.span`
  color: ${defaultTheme.primaryColor};
`;

export default Node;