export interface Classification {
  // duplicate
  Classification: number;
  ClassificationId: number;

  ClassificationDetails: Translation[];
  ManagementCloudId: string;
  Name: string;
  Description: string;
  LanguageCode: string;
  CopyFrom: string;
  Template?: File;
  Version: string;
  IsEnabled: boolean;
  isDeletable: boolean;
  ObjectsCount: number;
  ObjectsTotal: number;
  PropertyName: string | null;
  PropertyCode: string | null;
}

export interface Translation {
  ClassificationLangId: number;
  ClassificationLangCode: string;
  ClassificationName: string;
  ClassificationDescription: string;
}