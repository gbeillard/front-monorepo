export const isDisableCriticalFeatures = (classification, isBoostOffer, onflyId, user) => {
  const isPublicClassification = !classification.IsPrivate;
  const isBimAndCoOnfly = onflyId === 1;
  const { isBimAndCoAdmin } = user;
  const classificationOwner = classification.OwnerId;
  const isClassicationCurrentOnfly = classificationOwner === onflyId;

  return (
    (isPublicClassification || isBoostOffer || !isClassicationCurrentOnfly) &&
    (!isBimAndCoOnfly || !isBimAndCoAdmin)
  );
};