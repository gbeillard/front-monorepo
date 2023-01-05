import React from 'react';
import styled from '@emotion/styled';
// eslint-disable-next-line import/no-cycle
import { space } from '@bim-co/componentui-foundation';
import Node from './Node.jsx';
import { hasItems } from './utils';

const NodeList = ({
  classificationId,
  nodes,
  onNodesChanged,
  onNodeSelected,
  onNodeAdded,
  onNodeDeleted,
  onNodeMoved,
  display,
  resources,
  nestingLevel = 0,
  show,
  disableCriticalFeatures,
}) => {
  const onNodeChangedHandler = (updatedNode) => {
    const nodeIndex = nodes.findIndex((existingNode) => existingNode.Id === updatedNode.Id);
    const updatedNodes = nodes.setIn([nodeIndex], updatedNode);
    onNodesChanged(updatedNodes);
  };

  if (!show || !hasItems(nodes)) {
    return null;
  }

  const nodeList = nodes.map((node, index) => (
    <Node
      key={node.Id}
      classificationId={classificationId}
      node={node}
      onNodeChanged={onNodeChangedHandler}
      display={display}
      onNodeSelected={onNodeSelected}
      onNodeAdded={onNodeAdded}
      onNodeDeleted={onNodeDeleted}
      onNodeMoved={onNodeMoved}
      resources={resources}
      isLastChild={index === nodes.length - 1}
      nestingLevel={nestingLevel}
      disableCriticalFeatures={disableCriticalFeatures}
    />
  ));

  return <Wrapper depth={nestingLevel}>{nodeList}</Wrapper>;
};

const Wrapper = styled.div`
  padding-left: ${(props) => (props.depth ? space[150] : space[0])};
  display: flex;
  flex-flow: column nowrap;
`;

export default NodeList;