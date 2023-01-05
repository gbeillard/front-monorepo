import { Collection } from '../../Reducers/Collections/types';

export type Column = {
  id: string;
  label?: string;
  width?: string;
  minWidth?: string;
  needAuthorization?: boolean;
  render: (collection: Collection) => any;
};

export type MenuOption = {
  id: string;
  icon: string;
  label: string;
  onClick: () => void;
};