export const hasItems = (nodes) => nodes && nodes !== null && nodes.length > 0;
export const searchTree = (node, id) => {
  if (node.Id === id) {
    return node;
  }
  if (node.Children != null) {
    let i;
    let result = null;
    for (i = 0; result == null && i < node.Children.length; i += 1) {
      result = searchTree(node.Children[i], id);
    }
    return result;
  }
  return null;
};
