export type Translations = {
  pt?: string;
  pl?: string;
  en?: string;
  nl?: string;
  de?: string;
  es?: string;
  it?: string;
  fr?: string;
};

export type Language = {
  Id: number;
  IsInterface: boolean;
  LanguageCode: LanguageCode;
  Translations?: Translations;
  isDefault?: boolean;
};

export type LanguageCode = keyof Translations;

export enum PlanType {
  Error = -1,
  BimAndCo = 1,
  Onfly = 2,
  Space = 3,
}

export type User = {
  avatar: string;
  firstName: string;
  id: number;
  isAuthenticated: boolean;
  isBimAndCoAdmin: boolean;
  lastName: string;
  job: UserJob;
  email: string;
  city: string;
};

export type UserJob = {
  Id: number;
  DefaultValue: string;
};