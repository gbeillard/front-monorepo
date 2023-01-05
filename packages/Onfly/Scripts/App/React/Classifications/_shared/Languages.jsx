import React from 'react';
import { connect } from 'react-redux';
import { Select, MenuItem } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import {
  selectLanguageCode,
  selectLanguages,
  selectTranslatedResources,
} from '../../../Reducers/app/selectors';

const PLACEHOLDER_VALUE = -1;

const getTranslatedLanguages = (languages, language) =>
  languages.map((l) => {
    const Translated = l.Translations[language];
    return { ...l, Translated };
  });

const Languages = ({
  selectedLanguageCode = PLACEHOLDER_VALUE,
  onChange, // parent
  languageCode,
  languages = [],
  resources, // mapStateToProps
}) => {
  const onChangeHandler = (event) => {
    onChange(event.target.value);
  };

  const optionList = getTranslatedLanguages(languages, languageCode).map((language) => (
    <MenuItem key={language.LanguageCode} value={language.LanguageCode}>
      {language.Translated}
    </MenuItem>
  ));

  return (
    <Select value={selectedLanguageCode} onChange={onChangeHandler}>
      <MenuItem value={PLACEHOLDER_VALUE} disabled>
        {resources.ContentManagementClassif.NewClassifLang}
      </MenuItem>
      {optionList}
    </Select>
  );
};

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  languages: selectLanguages,
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(Languages);