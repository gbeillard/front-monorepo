import { TreeNode, appendNodesToClassification, flattenNodesTree } from './utils';
import { IClassification } from './types';

describe('classifications store - utils', () => {
  describe('appendNodesToClassification', () => {
    const nodes: TreeNode[] = [
      {
        Id: 100,
        Name: 'Parent 1',
        selected: false,
        containsSelected: false,
        Children: [
          {
            Id: 110,
            Name: 'Child 1',
            selected: false,
            containsSelected: false,
            Children: [
              {
                Id: 111,
                Name: 'Grandchild 1',
                selected: false,
                containsSelected: false,
                Children: [],
              },
            ],
          },
        ],
      },
      {
        Id: 200,
        Name: 'Parent 2',
        selected: false,
        containsSelected: false,
        Children: [],
      },
    ];
    const classifications: IClassification[] = [
      {
        Id: 1,
        Name: '',
        Description: '',
        IsAutomaticTranslate: false,
        IsBimAndCo: false,
        IsPrivate: false,
        IsMandatory: false,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
        NameProperty: null,
        CodeProperty: null,
        Statistics: null,
      },
      {
        Id: 2,
        Name: '',
        Description: '',
        IsAutomaticTranslate: false,
        IsBimAndCo: false,
        IsPrivate: false,
        IsMandatory: false,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
        NameProperty: null,
        CodeProperty: null,
        Statistics: null,
      },
      {
        Id: 3,
        Name: '',
        Description: '',
        IsAutomaticTranslate: false,
        IsBimAndCo: false,
        IsPrivate: false,
        IsMandatory: false,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
        NameProperty: null,
        CodeProperty: null,
        Statistics: null,
      },
    ];
    it('should append the nodes to the classification if it exists', () => {
      const result = appendNodesToClassification(classifications, nodes, 2);
      const expected = [classifications[0], { ...classifications[1], nodes }, classifications[2]];
      expect(result).toEqual(expected);
    });
    it('should append the nodes to a new classification if it can not be found', () => {
      const result = appendNodesToClassification(classifications, nodes, 4);
      const expected = [
        classifications[0],
        classifications[1],
        classifications[2],
        { Id: 4, nodes },
      ];
      expect(result).toEqual(expected);
    });
  });
  describe('flattenNodesTree', () => {
    it('should return the relevant list of nodes ids', () => {
      const tree: TreeNode = {
        Id: 100,
        Name: '100',
        selected: false,
        containsSelected: false,
        Children: [
          {
            Id: 110,
            Name: '110',
            selected: false,
            containsSelected: false,
            Children: [
              {
                Id: 111,
                Name: '111',
                selected: false,
                containsSelected: false,
                Children: [],
              },
            ],
          },
          {
            Id: 120,
            Name: '120',
            selected: false,
            containsSelected: false,
            Children: [],
          },
        ],
      };
      expect(flattenNodesTree(tree)).toEqual([100, 110, 111, 120]);
      expect(flattenNodesTree(tree.Children[0])).toEqual([110, 111]);
      expect(flattenNodesTree(tree.Children[0].Children[0])).toEqual([111]);
      expect(flattenNodesTree(tree.Children[1])).toEqual([120]);
    });
  });
});