export const propertiesHasSet = (properties, setId) =>
  properties?.some((property) => property?.Subsets?.some((subset) => subset?.Set?.Id === setId));