import { LanguageCode } from 'Scripts/App/Reducers/app/types';
import { redirectOptions } from './redirectOptions';

export const retrieveUrl = (
  redirectOption: string,
  language: LanguageCode,
  bimObjectId: number
) => {
  const baseUrl = `/${language}/bimobject/${bimObjectId}/edit`;
  const stepInformationUrl = `${baseUrl}/informations`;
  const stepPropertiesUrl = `${baseUrl}/properties`;
  const nextStepUrl = `${baseUrl}/models`;
  const prevStepUrl = `${baseUrl}/classifications`;
  const publicationUrl = `/${language}/bimobject/${bimObjectId}/details`;

  switch (redirectOption) {
    case redirectOptions.Info:
      return stepInformationUrl;
    case redirectOptions.Next:
      return nextStepUrl;
    case redirectOptions.Prev:
      return prevStepUrl;
    case redirectOptions.Detail:
      return publicationUrl;
    default:
      return stepPropertiesUrl;
  }
};
