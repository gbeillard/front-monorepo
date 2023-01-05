interface Translation {
  ClassificationLangId: number;
  ClassificationLangCode: string;
}

type TranslationType = (translations: Translation[], languageCode: string) => Translation;

export const getTranslation: TranslationType = (translations = [], languageCode) => {
  const translationForLanguageCode = translations.find(
    (translation) => translation.ClassificationLangCode === languageCode
  );
  if (translationForLanguageCode && translationForLanguageCode.ClassificationLangId !== 0) {
    return translationForLanguageCode;
  }
  return translations.find((translation) => translation.ClassificationLangId !== 0);
};