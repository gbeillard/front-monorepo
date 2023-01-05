import { SortDirection } from '@bim-co/componentui-foundation';
import { Space } from '../../Reducers/Spaces/types';

export type Column = {
  id: string;
  label?: string;
  width?: string;
  isSortable?: boolean;
  sortDirection?: SortDirection | null;
  minWidth?: string;
  render: (space: Space) => any;
};

export type MenuOption = {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
};