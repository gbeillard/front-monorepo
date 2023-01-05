import { createSelector } from 'reselect';
import { PlanType } from './types';

const selectRoot = (store) => store.appState;

export const selectLanguageCode = createSelector(selectRoot, (state) => state.Language);
export const selectLanguages = createSelector(selectRoot, (state) => state.Languages);
export const selectResources = createSelector(selectRoot, (state) => state.Resources);
export const selectUrl = createSelector(selectRoot, (state) => state.Url);
export const selectToken = createSelector(selectRoot, (state) => state.TemporaryToken);
export const selectManagementCloudId = createSelector(
  selectRoot,
  (state) => state.ManagementCloudId
);
export const selectIsCommunityUser = createSelector(
  selectRoot,
  (state) => state.SubDomain === 'community'
);
export const selectSubDomain = createSelector(selectRoot, (state) => state.SubDomain);
export const selectSoftwares = createSelector(selectRoot, (state) => state.Softwares);
export const selectSettings = createSelector(selectRoot, (state) => state.Settings);

export const selectTranslatedResources = createSelector(
  selectResources,
  selectLanguageCode,
  (resources, languageCode) => resources[languageCode]
);

export const selectHasPrivateSite = createSelector(
  selectSettings,
  (settings) => settings?.HasPrivateSite
);

export const selectHasBimandCoPublication = createSelector(
  selectSettings,
  (settings) => settings?.EnableBimandCoPublication
);

export const selectUser = createSelector(selectRoot, (state) => ({
  id: state.UserId,
  firstName: state.UserFirstName,
  lastName: state.UserLastName,
  avatar: state.UserAvatar,
  isAuthenticated: state.UserIsAuthenticated,
  isBimAndCoAdmin: state.IsBimAndCoAdmin,
  email: state.UserEmail,
  job: state.UserJob,
  city: state.UserCity,
}));

export const selectRole = createSelector(selectRoot, (state) => ({
  id: state.RoleId,
  key: state.RoleKey,
  label: state.RoleName,
}));

export const selectRoles = createSelector(selectRoot, (state) => state.Roles);

export const selectTranslatedRole = createSelector(
  selectLanguageCode,
  selectRoles,
  selectRole,
  (languageCode, roles, role) => getTranslateRole(languageCode, roles, role)
);

export const selectIsEditingResources = createSelector(
  selectRoot,
  (state) => state.IsEditingResource
);
export const selectPlatformUrl = createSelector(selectRoot, (state) => state.PlatformUrl);
export const selectEntityLogo = createSelector(selectRoot, (state) => state.EntityLogo);
export const selectEntityName = createSelector(selectRoot, (state) => state.EntityName);
export const selectEnableSetsManagement = createSelector(
  selectSettings,
  (settings) => settings.EnableSetsManagement
);
export const selectUnreadMessagesCount = createSelector(
  selectRoot,
  (state) => state.UnreadMessagesCount
);
export const selectDocumentTypes = createSelector(selectRoot, (state) => state.DocumentTypes);
export const selectEnableIfcSDL = createSelector(
  selectSettings,
  (settings) => settings.EnableIfcSDL
);
export const selectEnableFileSearch = createSelector(
  selectSettings,
  (settings) => settings.EnableFileSearch
);
export const selectEnableDictionary = createSelector(
  selectSettings,
  (settings) => settings.EnableDictionary
);
export const selectIsBoostOffer = createSelector(
  selectEnableDictionary,
  (enableDictionary) => !enableDictionary
);
export const selectEnableUseApiDoc = createSelector(
  selectSettings,
  (settings) => settings.EnableUseApiDoc
);
export const selectPlanType = createSelector(selectRoot, (state) => state.PlanType);
export const selectEnableSpaces = createSelector(
  selectSettings,
  (settings) => settings.EnableSpaces
);
export const selectName = createSelector(selectRoot, (state) => state.Name);
export const selectDisplayName = createSelector(
  selectPlanType,
  selectName,
  selectEntityName,
  (planType, name, entityName) => (planType === PlanType.Space ? name : entityName)
);

const getTranslateRole = (languageCode, roles, role) => {
  if (roles[languageCode] !== undefined) {
    const translatedRole = roles[languageCode].find(
      (translatedRoles) => translatedRoles.RoleKey === role.key
    );

    if (translatedRole !== undefined) {
      return {
        key: translatedRole.RoleKey,
        label: translatedRole.RoleName,
      };
    }
  }

  // Par defaut renvoie le role non traduit
  return role;
};
