import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import { LanguageOption, getLanguageLabel, getURL, Location, Language } from './LanguageOption';
import { Translations } from '../../Reducers/app/types';

describe('<LanguageOption />', () => {
  describe('getURL', () => {
    it('should replace the current language with the new one', () => {
      const location: Location = { pathname: 'mypath/fr/123', search: '' };
      const result = getURL(location, 'fr', 'en');
      expect(result).toEqual('mypath/en/123');
    });
    it('should append the new language if the current one is not part of the url', () => {
      const location: Location = { pathname: 'mypath/', search: '' };
      const result = getURL(location, 'fr', 'en');
      expect(result).toEqual('mypath/en/');
    });
    it('should preserve the query string', () => {
      const location: Location = {
        pathname: 'mypath/fr/123',
        search: '?abc=def',
      };
      const result = getURL(location, 'fr', 'en');
      expect(result).toEqual('mypath/en/123?abc=def');
    });
  });
  describe('getLanguageLabel', () => {
    it('should extract the right translation', () => {
      const translations: Translations = {};
      translations.fr = 'Français';
      translations.en = 'Anglais';
      translations.de = 'Allemand';
      expect(getLanguageLabel(translations, 'fr')).toBe('Français');
      expect(getLanguageLabel(translations, 'en')).toBe('Anglais');
      expect(getLanguageLabel(translations, 'de')).toBe('Allemand');
    });
  });
  describe('Component', () => {
    it('should not render if the language is not for the interface', () => {
      const language: Language = {
        IsInterface: false,
        Translations: {},
        LanguageCode: 'iu',
      };
      const languageCode = 'en';
      const location: Location = { pathname: 'mypath/fr/123', search: '' };

      const component = shallow(
        <LanguageOption language={language} languageCode={languageCode} location={location} />
      );
      expect(component.isEmptyRender()).toBe(true);
    });
    it('should render a link element if the language is interface ready', () => {
      const Translations: Translations = {};
      Translations.en = 'Anglais';
      const language: Language = {
        IsInterface: true,
        LanguageCode: 'fr',
        Translations,
      };
      const languageCode = 'en';
      const location: Location = { pathname: 'mypath/en/123', search: '?abc=123' };

      const component = shallow(
        <LanguageOption language={language} languageCode={languageCode} location={location} />
      );
      const link = component.find<{ to: string; children: any }>(Link);

      const expectedLabel = getLanguageLabel(Translations, languageCode);
      expect(link.props().children).toBe(expectedLabel);

      const expectedUrl = getURL(location, languageCode, language.LanguageCode);
      expect(link.props().to).toBe(expectedUrl);
    });
  });
});