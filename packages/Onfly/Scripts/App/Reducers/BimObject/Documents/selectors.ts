import { createSelector } from 'reselect';
import { DocumentRead, Variant } from './types';
import { baseState } from './reducer';

const selectRoot = (store): typeof baseState => store.documents;

export const selectDocuments = createSelector(selectRoot, (state) => state.documents);

export const selectCommonDocuments = createSelector(selectDocuments, (documents) =>
  documents.filter(
    (document) => document !== null && document !== undefined && document.Variants.length == 0
  )
);

export const selectVariantsDocument = createSelector(selectDocuments, (documents) =>
  getvariants(documents)
);

// Renvoie une liste de variantes ayant des documents rattachés
const getvariants = (documents: DocumentRead[]) => {
  if (documents === null || documents === undefined) {
    return [];
  }

  const variantList: Variant[] = [];

  documents.forEach((document) => {
    // Si le document est rattach� a des variantes
    if (document !== null && document !== undefined && document.Variants.length > 0) {
      document.Variants.forEach((documentVariant) => {
        const variantFound = variantList.find((variant) => variant.Id === documentVariant.Id);

        if (variantFound !== null && variantFound !== undefined) {
          variantFound.Documents.push({ ...document });
        } else {
          variantList.push({
            ...documentVariant,
            Documents: [{ ...document }],
          });
        }
      });
    }
  });

  return variantList;
};

export const selectHasCompletedfetchDocuments = createSelector(
  selectRoot,
  (state) => state.api.fetchDocuments.success
);
export const selectHasCompletedCreate = createSelector(
  selectRoot,
  (state) => state.api.createDocument.success
);
export const selectHasCompletedUpdate = createSelector(
  selectRoot,
  (state) => state.api.updateDocument.success
);
export const selectHasCompletedDelete = createSelector(
  selectRoot,
  (state) => state.api.deleteDocument.success
);