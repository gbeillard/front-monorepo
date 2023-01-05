export type Property = {
  Id: number;
  Name: string;
  Domain: {
    Id: number;
    Name: string;
  };
  Unit: {
    Id: number;
    Name: string;
  };
  isAlreadyAssociated: boolean;
  selected: boolean;
};