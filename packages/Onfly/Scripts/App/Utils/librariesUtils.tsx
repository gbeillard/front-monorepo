import { LibrarySettings } from '@bim-co/onfly-connect/Search';
import { createLibrary } from '../React/Search/utils';
import { ContentManagementLibrary } from '../Reducers/BimObject/types';
import { RoleKey } from '../Reducers/Roles/types';

export const getLibrariesSettings = (roleKey: RoleKey): LibrarySettings[] => {
  if (roleKey === RoleKey.public_creator) {
    return [
      { Name: ContentManagementLibrary.Onfly, IsVisible: false },
      { Name: ContentManagementLibrary.Entity, IsVisible: false },
      { Name: ContentManagementLibrary.Platform, IsVisible: true },
      { Name: ContentManagementLibrary.User, IsVisible: true },
      { Name: ContentManagementLibrary.Spaces, IsVisible: true },
    ];
  }
  return [
    { Name: ContentManagementLibrary.Onfly, IsVisible: true },
    { Name: ContentManagementLibrary.Entity, IsVisible: true },
    { Name: ContentManagementLibrary.Platform, IsVisible: true },
    { Name: ContentManagementLibrary.User, IsVisible: false },
    { Name: ContentManagementLibrary.Spaces, IsVisible: true },
  ];
};

export const getDefaultLibraries = () => {
  const defaultLibraries = JSON.parse(sessionStorage.getItem('searchLibraries'));

  return defaultLibraries?.length
    ? defaultLibraries
    : [createLibrary(ContentManagementLibrary.Onfly), createLibrary(ContentManagementLibrary.User)];
};
