export const FETCH_AUTHORIZATION = 'BIMOBJECT/USERS/FETCH_AUTHORIZATION';
export const FETCH_AUTHORIZATION_SUCCESS = 'BIMOBJECT/USERS/FETCH_AUTHORIZATION_SUCCESS';
export const FETCH_AUTHORIZATION_ERROR = 'BIMOBJECT/USERS/FETCH_AUTHORIZATION_ERROR';

/* Models */
export type UserEditorAuthorization = {
  Permissions: UserBimObjectAuthorization[];
  Companies: UserCompanyAuthorization[];
  Manufacturers: UserManufacturerAuthorization[];
};

export type UserBimObjectAuthorization = {
  Id: number;
  ActionZone: string;
  ActionTag: string;
  ActionName: string;
  ActionDescription: string;
  Authorized: boolean;
  UserId: number;
};

export type UserCompanyAuthorization = {
  Id: number;
  Name: string;
  IsGenericOfficialAuthorized: boolean;
  LogoPath: string;
  ManufacturerAuthorized: UserManufacturerAuthorization[];
};

export type UserManufacturerAuthorization = {
  Id: number;
  Name: string;
  LogoPath: string;
};

export type UserPermissionsActionZone = {
  bimobject_access_controls: boolean;
  bimobject_catalogs: boolean;
  bimobject_classifications: boolean;
  bimobject_companies: boolean;
  bimobject_countries: boolean;
  bimobject_documents: boolean;
  bimobject_general_informations: boolean;
  bimobject_groups: boolean;
  bimobject_links: boolean;
  bimobject_manufacturers: boolean;
  bimobject_models: boolean;
  bimobject_object_type: boolean;
  bimobject_photos: boolean;
  bimobject_properties: boolean;
  bimobject_publication: boolean;
  bimobject_revisions: boolean;
  bimobject_tags: boolean;
  bimobject_variants: boolean;
};

/* Actions */
export type FetchAuthorizationAction = {
  type: typeof FETCH_AUTHORIZATION;
  bimObjectId: number;
};

export type FetchAuthorizationSuccessAction = {
  type: typeof FETCH_AUTHORIZATION_SUCCESS;
  userAuthorization: UserEditorAuthorization;
};

export type FetchAuthorizationErrorAction = {
  type: typeof FETCH_AUTHORIZATION_ERROR;
  error: string;
};

export type UsersActions =
  | FetchAuthorizationAction
  | FetchAuthorizationSuccessAction
  | FetchAuthorizationErrorAction;