import { Icon, Menu, IIcon, space } from '@bim-co/componentui-foundation';
import React, { useEffect } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { Language, LanguageCode } from '../../Reducers/app/types';
import { selectLanguageCode, selectLanguages } from '../../Reducers/app/selectors';
import { fetchLanguages } from '../../Reducers/app/actions';

type Option = { value: LanguageCode; label: string; icon: IIcon };

type Props = {
  value: LanguageCode;
  onChange: (x: LanguageCode) => void;
  menuOptions?: any;
  languageCode: LanguageCode;
  languages: Language[];
  fetchLanguages: () => void;
};

const getIcon = (languageCode: LanguageCode): IIcon =>
  `flag${languageCode?.toUpperCase()}` as IIcon;
const getTranslatedLabel = (language: Language, languageCode: LanguageCode) =>
  language?.Translations[languageCode];

const getOptions = (languages: Language[], languageCode: LanguageCode): Option[] =>
  languages
    .filter((language) => language.IsInterface)
    .map((language) => ({
      id: language.LanguageCode,
      value: language.LanguageCode,
      label: getTranslatedLabel(language, languageCode),
      icon: getIcon(language.LanguageCode),
    }));
const getButtonText = (selectedLanguage: Language, languageCode: LanguageCode) => {
  const label = getTranslatedLabel(selectedLanguage, languageCode);
  const icon = getIcon(selectedLanguage?.LanguageCode);
  return (
    <ButtonTextWrapper>
      <Icon icon={icon} size="s" />
      {label}
    </ButtonTextWrapper>
  );
};

const LanguagesMenu: React.FC<Props> = ({
  value,
  onChange,
  menuOptions, // parent
  languageCode,
  languages, // mapStateToProps
  fetchLanguages, // mapDispatchToProps
}) => {
  useEffect(() => {
    if (!languages || languages.length === 0) {
      fetchLanguages();
    }
  }, []);

  const onChangeHandler = (option: Option) => {
    onChange(option.value);
  };

  const selectedLanguage = languages.find((language) => language.LanguageCode === value);

  return (
    <Menu
      buttonText={getButtonText(selectedLanguage, languageCode) as unknown as string}
      items={getOptions(languages, languageCode)}
      onChange={onChangeHandler}
      menuOptions={menuOptions}
    />
  );
};

const ButtonTextWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  > svg {
    margin-right: ${space[50]};
  }
`;

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  languages: selectLanguages,
});
const mapDispatchToProps = (dispatch: any) => ({
  fetchLanguages: () => dispatch(fetchLanguages()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguagesMenu);