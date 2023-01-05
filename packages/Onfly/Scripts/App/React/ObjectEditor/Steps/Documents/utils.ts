import { DocumentWrite, DocumentSource } from '../../../../Reducers/BimObject/Documents/types';

export type Validation = {
  name: boolean;
  file?: boolean;
  link?: boolean;
  isReady: boolean;
};

export const getNameValidation = (document: DocumentWrite): boolean => document.Name.length > 2;
export const getCreateValidation = (
  document: DocumentWrite,
  source: DocumentSource
): Validation => {
  const name = getNameValidation(document);

  if (source === DocumentSource.File) {
    const file = Boolean(document.File);
    const isReady = name && file;
    return {
      name,
      file,
      isReady,
    };
  }

  const link = document.FileName.length > 2;
  const isReady = name && link;
  return {
    name,
    link,
    isReady,
  };
};

export const getEditValidation = (document: DocumentWrite, source: DocumentSource): Validation => {
  const name = getNameValidation(document);

  if (source === DocumentSource.File) {
    const isReady = name;
    return {
      name,
      isReady,
    };
  }

  const link = document.FileName.length > 2;
  const isReady = name && link;
  return {
    name,
    link,
    isReady,
  };
};