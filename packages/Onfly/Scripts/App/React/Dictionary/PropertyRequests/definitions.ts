import { Nature } from '../../../Reducers/properties/constants';

export type PropertyRequest = {
  Id: number;
  Name: string;
  RequesterName: string;
  RequestDate: Date;
  RequestStatus: PropertyRequestStatus;
  DomainId: number;
};

export type PropertyRequestStatus = 'dirty' | 'sended' | 'accepted' | 'rejected';

export type PropertyDetails = {
  PropertyId: number;
  PropertyDomainCode: number;
  PropertyUnitCode: number;
  PropertyDataTypeCode: number;
  PropertyEditTypeCode: number;
  PropertyParameterType: number;
  IsAuthorisedToEdit: boolean;
  RequestComment: string;
  RequestResponse: string;
  RequestState: string;
  MappedPropId: null;
  Nature: Nature;
  Translations: PropertyDetailsTranslation[];
};

export type PropertyRequestResponse = {
  RequestId: number;
  RequestStatus: string;
  RequestMessageResponse: string;
};

export type PropertyDetailsTranslation = {
  TranslationId: number;
  TranslationLangCode: string;
  PropertyName: string;
  PropertyDescription: string;
  PropertyInformations: string;
  IsDefaultTranslation: boolean;
  PropertyEditTypeValues: string;
};

export type Domain = {
  DomainId: number;
  DomainName: string;
};

export type Unit = {
  Id: number;
  Name: string;
  FormatName: string;
  Symbole: string;
  UnitType: string;
};

export type Language = {
  Id: number;
  IsInterface: boolean;
  LanguageCode: string;
  LanguageCulture: string;
  Translations: LanguageTranslation[];
};

export type LanguageTranslation = {
  pt: string;
  pl: string;
  en: string;
  nl: string;
  de: string;
  es: string;
  it: string;
  fr: string;
};

export type EditType = {
  Id: number;
  Name: string;
  IsMultiple: boolean;
};

export type DataType = {
  Id: number;
  Name: string;
};

export type ParameterType = {
  Id: number;
  Name: string;
  CaoName: string;
};