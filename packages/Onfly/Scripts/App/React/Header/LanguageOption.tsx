import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from '../../Utils/withRouter';
import { Translations } from '../../Reducers/app/types';

export const getLanguageLabel = (translations: Translations, languageCode: string): string =>
  translations[languageCode];
export const getURL = (
  location: Location,
  currentLanguageCode: string,
  newLanguageCode: string
): string => {
  const url = location.pathname.includes(`/${currentLanguageCode}/`)
    ? location.pathname.replace(`/${currentLanguageCode}/`, `/${newLanguageCode}/`)
    : `${location.pathname + newLanguageCode}/`;

  return `${url}${location.search}`;
};

export type Language = {
  IsInterface: boolean;
  Translations: Translations;
  LanguageCode: string;
};

export type Location = {
  pathname: string;
  search: string;
};

export type Props = {
  language: Language;
  languageCode: string;
  location: Location;
};

export const LanguageOption: React.FunctionComponent<Props> = ({
  language,
  languageCode,
  location,
}) => {
  if (!language.IsInterface) {
    return null;
  }
  const label = getLanguageLabel(language.Translations, languageCode);
  const url = getURL(location, languageCode, language.LanguageCode);
  return (
    <li>
      <Link to={url} className={`lang-${language.LanguageCode}`}>
        {label}
      </Link>
    </li>
  );
};

export default withRouter(LanguageOption);