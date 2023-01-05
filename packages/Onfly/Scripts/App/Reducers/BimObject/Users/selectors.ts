import { createSelector } from 'reselect';
import { baseState } from './reducer';
import {
  UserEditorAuthorization,
  UserBimObjectAuthorization,
  UserPermissionsActionZone,
} from './types';

const selectRoot = (store): typeof baseState => store.bimObjectUsersState;

export const selectFetchAutorizationIsSuccess = createSelector(
  selectRoot,
  (state): boolean => state.api.fetchAutorization.success
);
export const selectFetchAutorizationIsPending = createSelector(
  selectRoot,
  (state): boolean => state.api.fetchAutorization.pending
);
export const selectFetchAutorizationIsError = createSelector(
  selectRoot,
  (state): string => state.api.fetchAutorization.error
);

export const selectUserAuthorization = createSelector(
  selectRoot,
  (state): UserEditorAuthorization => state.userAuthorization
);
export const selectUserPermissions = createSelector(
  selectUserAuthorization,
  (userAuthorization): UserBimObjectAuthorization[] => userAuthorization?.Permissions
);
export const selectUserPermissionsByActionZone = createSelector(
  selectUserPermissions,
  (userPermissions): UserPermissionsActionZone => {
    const permissions = {} as UserPermissionsActionZone;

    userPermissions?.forEach((userPermission) => {
      permissions[userPermission?.ActionZone] = userPermission?.Authorized;
    });

    return permissions;
  }
);