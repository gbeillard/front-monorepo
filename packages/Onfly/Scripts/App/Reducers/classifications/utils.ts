import { IClassification, IClassificationNode } from './types';

export type ClassificationNode = {
  id: number;
  text: string;
  parentid: string;
  children: ClassificationNode[];
  definition?: string;
  name?: string;
};

export type TreeNode = {
  Id: number;
  Name: string;
  Definition?: string;
  Children: TreeNode[];
  selected: boolean;
  containsSelected: boolean;
};

export const replaceClassification = (
  classifications: IClassification[],
  replacingClassification: IClassification
) =>
  classifications.map((existingClassification) => {
    if (existingClassification.Id === replacingClassification.Id) {
      return replacingClassification;
    }

    return existingClassification;
  });
export const removeClassification = (
  classifications: IClassification[],
  classificationToRemove: IClassification
) =>
  classifications.filter(
    (existingClassification) => existingClassification.Id !== classificationToRemove.Id
  );

export const addSelectedToRelevantNode = (
  nodes: IClassificationNode[],
  selectedNode: IClassificationNode
): IClassificationNode[] =>
  nodes.map((node) => {
    const selected = node.Id === selectedNode.Id;
    if (node.Children?.length > 0) {
      const updatedChildren = addSelectedToRelevantNode(node.Children, selectedNode);
      return { ...node, Children: updatedChildren, selected };
    }

    return { ...node, selected };
  });

export const appendNodesToClassification = (
  classifications: IClassification[],
  nodes: TreeNode[],
  classificationId: number
) => {
  const classificationToUpdate = classifications.find(
    (classification) => classification.Id === classificationId
  );
  if (classificationToUpdate) {
    return classifications.map((classification) => {
      if (classification.Id === classificationId) {
        return { ...classification, nodes };
      }
      return classification;
    });
  }

  return [...classifications, { Id: classificationId, nodes }];
};

export const flattenNodesTree = (tree: TreeNode) => [tree.Id, ...flattenNodes(tree.Children)];
const flattenNodes = (nodes: TreeNode[]): number[] =>
  nodes.reduce((flattened, node) => {
    flattened.push(node.Id);
    if (node.Children.length > 0) {
      flattened = flattened.concat(flattenNodes(node.Children));
    }
    return flattened;
  }, []);

export const updateNode = (
  nodes: IClassificationNode[],
  updatedNode: IClassificationNode
): IClassificationNode[] =>
  nodes.map((node) => {
    if (node.Children?.length > 0) {
      const updatedChildren = updateNode(node.Children, updatedNode);
      if (node.Id === updatedNode.Id) {
        return { ...updatedNode, Children: updatedChildren };
      }

      return { ...node, Children: updatedChildren };
    }

    if (node.Id === updatedNode.Id) {
      return updatedNode;
    }

    return node;
  });

export const addNode = (
  nodes: IClassificationNode[],
  parentNodeId: number,
  nodeToAdd: IClassificationNode
): IClassificationNode[] => {
  if (parentNodeId === null) {
    return [...nodes, nodeToAdd];
  }

  return nodes.map((existingNode) => {
    if (parentNodeId === existingNode.Id) {
      return { ...existingNode, Children: [...existingNode.Children, nodeToAdd] };
    }

    const updatedChildren = addNode(existingNode.Children, parentNodeId, nodeToAdd);
    return { ...existingNode, Children: updatedChildren };
  });
};

export const removeNode = (
  nodes: IClassificationNode[],
  nodeToRemove: IClassificationNode
): IClassificationNode[] => {
  const filteredNodes = nodes.filter((existingNode) => existingNode.Id !== nodeToRemove.Id);
  if (filteredNodes.length < nodes.length) {
    return filteredNodes;
  }

  return nodes.map((existingNode) => {
    const filteredChildren = removeNode(existingNode.Children, nodeToRemove);
    return { ...existingNode, Children: filteredChildren };
  });
};

export const moveNode = (
  nodes: IClassificationNode[],
  target: IClassificationNode,
  node: IClassificationNode
) => {
  const without = removeNode(nodes, node);
  return addNode(without, target?.Id ?? null, node);
};

export const updateSelectedNode = (
  node: IClassificationNode,
  nodes: IClassificationNode[]
): IClassificationNode => {
  if (node === null) {
    return null;
  }

  const updatedNode = nodes.find((item) => item.Id === node.Id);
  if (updatedNode) {
    return updatedNode;
  }

  const flattenedChildren: IClassificationNode[] = nodes.reduce(
    (allChildren, currentNode) => [...allChildren, ...currentNode.Children],
    []
  );
  return updateSelectedNode(node, flattenedChildren);
};