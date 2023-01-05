import React, { useEffect, ReactNode } from 'react';
import { connect } from 'react-redux';
import { Button, Select } from '@bim-co/componentui-foundation';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';
import flagDE from '../../../../../../../Content/images/flags_svg/de.svg';
import flagEN from '../../../../../../../Content/images/flags_svg/en.svg';
import flagES from '../../../../../../../Content/images/flags_svg/es.svg';
import flagFR from '../../../../../../../Content/images/flags_svg/fr.svg';
import flagIT from '../../../../../../../Content/images/flags_svg/it.svg';
import flagMulti from '../../../../../../../Content/images/flags_svg/multi.svg';
import flagNL from '../../../../../../../Content/images/flags_svg/nl.svg';
import flagPL from '../../../../../../../Content/images/flags_svg/pl.svg';
import flagPT from '../../../../../../../Content/images/flags_svg/pt.svg';

import {
  selectLanguages,
  selectLanguageCode,
  selectTranslatedResources,
} from '../../../../../Reducers/app/selectors';
import { fetchLanguages } from '../../../../../Reducers/app/actions';
import { Language, LanguageCode } from '../../../../../Reducers/app/types';

const Label = styled.span({ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' });
const Flag = styled.img({ marginRight: '12px' });
const logos = {
  de: flagDE,
  en: flagEN,
  es: flagES,
  fr: flagFR,
  it: flagIT,
  nl: flagNL,
  pl: flagPL,
  pt: flagPT,
  multi: flagMulti,
};

const getLogo = (languageCode: LanguageCode) => logos[languageCode] || logos.multi;
const getTranslatedLabel = (
  languageCode: LanguageCode,
  language: Language,
  defaultValue: string
): string => (language.isDefault ? defaultValue : language.Translations[languageCode]);
const getFullLabel = (
  languageCode: LanguageCode,
  language: Language,
  defaultValue: string
): ReactNode => {
  const logo = getLogo(language.LanguageCode);
  return (
    <Label>
      <Flag src={logo} />
      {getTranslatedLabel(languageCode, language, defaultValue)}
    </Label>
  );
};

type Props = {
  value: LanguageCode;
  onChange: (x: LanguageCode) => void;
  placeholder?: string;
  languageCode: LanguageCode;
  languages: Language[];
  fetchLanguages: () => void;
  hasMultilingualOption?: boolean;
  useButtonControl?: boolean;
  resources: any;
};

const DEFAULT_OPTION = {
  Id: -1,
  IsInterface: false,
  LanguageCode: null,
  isDefault: true,
};

const getOptions = (
  languages: Language[],
  hasMultilingualOption: boolean,
  defaultOption: Language
): Language[] => {
  const filteredLanguages = languages.filter((language) => language.IsInterface);
  if (!hasMultilingualOption) {
    return filteredLanguages;
  }

  return [defaultOption, ...filteredLanguages];
};
const ButtonControl = React.forwardRef(({ selectProps }: any, ref?: any) => {
  const { value, menuIsOpen, onMenuOpen, onMenuClose } = selectProps;
  const onClickHandler = () => {
    if (menuIsOpen) {
      onMenuClose();
    } else {
      onMenuOpen();
    }
  };

  const onBlurHandler = () => {
    onMenuClose();
  };

  return (
    <Button ref={ref} onClick={onClickHandler} onBlur={onBlurHandler}>
      <img src={getLogo(value.LanguageCode)} />
    </Button>
  );
});

const LanguageSelect: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  languageCode,
  languages,
  fetchLanguages,
  hasMultilingualOption,
  useButtonControl = false,
  resources,
  ...props
}) => {
  useEffect(() => {
    if (!languages || languages.length === 0) {
      fetchLanguages();
    }
  }, []);

  const onChangeHandler = (language: Language) => {
    onChange(language.LanguageCode);
  };

  const options = getOptions(languages, hasMultilingualOption, DEFAULT_OPTION);
  const selectedOption = options.find((option) => option.LanguageCode === value) || DEFAULT_OPTION;

  if (useButtonControl) {
    return (
      <Select
        placeholder={placeholder}
        value={selectedOption}
        onChange={onChangeHandler}
        options={options}
        getOptionValue={(language: Language) => language.LanguageCode}
        getOptionLabel={(language: Language) =>
          getFullLabel(languageCode, language, resources.MetaResource.Multilingual)
        }
        components={{ Control: ButtonControl }}
        {...props}
      />
    );
  }

  return (
    <Select
      placeholder={placeholder}
      value={selectedOption}
      onChange={onChangeHandler}
      options={options}
      getOptionValue={(language: Language) => language.LanguageCode}
      getOptionLabel={(language: Language) =>
        getFullLabel(languageCode, language, resources.MetaResource.Multilingual)
      }
      {...props}
    />
  );
};

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  languages: selectLanguages,
  resources: selectTranslatedResources,
});

const mapDispatchToProps = (dispatch) => ({
  fetchLanguages: () => dispatch(fetchLanguages()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelect);