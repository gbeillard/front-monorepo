export type Role = {
  Id: number;
  Key: RoleKey;
  Name: string;
};

export enum RoleKey {
  admin = 'admin',
  object_creator = 'object_creator',
  validator = 'validator',
  member = 'member',
  partner = 'partner',
  public_creator = 'public_creator',
}

export type RoleKeyType = keyof typeof RoleKey;