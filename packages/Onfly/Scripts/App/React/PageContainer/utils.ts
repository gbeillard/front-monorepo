import { Params } from 'react-router-dom';

type PageTitleFactoryOptions = {
  resources: any;
  titleZone: string;
  titleKey: string;
  Title: string;
  Group: { GroupId: string | number; Name: string };
  params: Params;
};

export const createPageTitle = ({
  resources,
  titleZone,
  titleKey,
  Title,
  Group,
  params,
}: PageTitleFactoryOptions): string => {
  if (
    resources != null &&
    titleZone != null &&
    titleKey != null &&
    titleZone !== '' &&
    titleKey !== ''
  ) {
    if (parseInt(params.groupId) > 0 && Group.GroupId > 0) {
      // Page d'un groupe
      if (resources[titleZone][titleKey].indexOf('[group]') === -1) {
        return `${Group.Name} - ${resources[titleZone][titleKey]}`;
      }
      return resources[titleZone][titleKey].replace('[group]', Group.Name);
    }
    return resources[titleZone][titleKey];
  }
  return Title;
};