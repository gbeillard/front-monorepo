import { Property, OfficialProperty } from './types';
import { removeDiacritics } from '../../Utils/utils.js';

export const getFilteredProperties = (
  properties: Property[],
  filter: string,
  sortBy: string,
  sortOrder: string
): Property[] => {
  if (properties.length === 0) {
    return properties;
  }

  // add sorting element
  const sortByCode = sortBy === '' ? 'Id' : sortBy;
  const sortByOrder = sortOrder === '' ? 'asc' : sortOrder;
  let currentsProps = properties;
  switch (sortByCode) {
    case 'Id':
      currentsProps =
        sortByOrder === 'asc'
          ? [...currentsProps].sort((a, b) => a.Id - b.Id)
          : [...currentsProps].sort((a, b) => b.Id - a.Id);
      break;
    case 'sortName':
      currentsProps =
        sortByOrder === 'asc'
          ? [...currentsProps].sort((a, b) => a.Name.localeCompare(b.Name))
          : [...currentsProps].sort((a, b) => b.Name.localeCompare(a.Name));
      break;
    case 'sortDomain':
      currentsProps =
        sortByOrder === 'asc'
          ? [...currentsProps].sort((a, b) => a.DomainName.localeCompare(b.DomainName))
          : [...currentsProps].sort((a, b) => b.DomainName.localeCompare(a.DomainName));
      break;
    case 'sortUnit':
      currentsProps =
        sortByOrder === 'asc'
          ? [...currentsProps].sort((a, b) => a.UnitName.localeCompare(b.UnitName))
          : [...currentsProps].sort((a, b) => b.UnitName.localeCompare(a.UnitName));
      break;
    case 'sortEditType':
      currentsProps =
        sortByOrder === 'asc'
          ? [...currentsProps].sort((a, b) => a.EditTypeName.localeCompare(b.EditTypeName))
          : [...currentsProps].sort((a, b) => b.EditTypeName.localeCompare(a.EditTypeName));
      break;
    case 'sortDataType':
      currentsProps =
        sortByOrder === 'asc'
          ? [...currentsProps].sort((a, b) => a.DataTypeName.localeCompare(b.DataTypeName))
          : [...currentsProps].sort((a, b) => b.DataTypeName.localeCompare(a.DataTypeName));
      break;
    default:
      break;
  }

  return currentsProps.filter((property) =>
    removeDiacritics(property.Name.toLowerCase()).includes(removeDiacritics(filter.toLowerCase()))
  );
};

export const getVisibleProperties = (properties: Property[], visibleCount: number): Property[] =>
  properties.slice(0, visibleCount);

export const setPropertiesSelect = (
  properties: Property[],
  selected: boolean,
  selectedIds: number[]
): Property[] => properties.map((property) => setPropertySelect(property, selected, selectedIds));

export const setPropertySelect = (
  property: Property,
  selected: boolean,
  selectedIds: number[]
): Property => {
  if (selectedIds.includes(property.Id)) {
    return { ...property, selected };
  }

  return property;
};

export const mapProperties = (properties: Property[], languageCode: string): OfficialProperty[] =>
  properties.map((property) => mapProperty(property, languageCode));
export const mapProperty = (property: Property, languageCode: string): OfficialProperty => ({
  propertyId: property.Id,
  propertyLangs: [{ langCode: languageCode, langName: property.Name, isDefaultLang: true }],
});