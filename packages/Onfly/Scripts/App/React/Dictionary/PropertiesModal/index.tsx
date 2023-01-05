import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import DialogWithRecap from '../../../components/DialogWithRecap';
import { API_URL } from '../../../Api/constants';
import {
  selectLanguageCode,
  selectManagementCloudId,
  selectToken,
  selectTranslatedResources,
} from '../../../Reducers/app/selectors';
import { Property } from './definitions';
import { Domain, Unit } from '../PropertyRequests/definitions';
import Left from './Left';
import Right from './Right';
import COLORS from '../../../components/colors';
import { BimObjectProps } from '../../../Reducers/BimObject/connectors';

// import Domain from '../../CommonsElements/Domain';

const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.SE90,
    },
  },
});
const mapProperty = (
  data: any,
  languageCode: string,
  domains: Domain[],
  units: Unit[]
): Property => {
  const propertyName = data.PropertyLangs.find(
    (traduction) => traduction.LangCode === languageCode
  )?.LangName;
  const domainName = domains.find(
    (domain) => domain.DomainId === data.PropertyDomainCode
  )?.DomainName;
  const unitName = units.find((unit) => unit.Id === data.PropertyUnitCode)?.Name;

  return {
    Id: data.PropertyId,
    Name: propertyName,
    Domain: {
      Id: data.PropertyDomainCode,
      Name: domainName,
    },
    Unit: {
      Id: data.PropertyUnitCode,
      Name: unitName,
    },
    isAlreadyAssociated: data.PropertyIsChecked,
    selected: false,
  };
};
const getMappedProperties = (properties: Property[], selectedProperties: Property[]): Property[] =>
  properties.map((property) => {
    const selected = selectedProperties.some(
      (selectedProperty) => selectedProperty.Id === property.Id
    );
    return { ...property, selected };
  });

const getFilteredProperties = (properties: Property[], filter: string): Property[] => {
  if (filter.length < 3) {
    return properties;
  }

  const normalizedFilter = filter.toLowerCase();
  return properties.filter(
    (property) =>
      property.Name.toLowerCase().includes(normalizedFilter) ||
      property.Domain?.Name?.toLowerCase()?.includes(normalizedFilter) ||
      property.Unit?.Name?.toLowerCase()?.includes(normalizedFilter)
  );
};
const mapProperties = (
  data: any[],
  languageCode: string,
  domains: Domain[],
  units: Unit[]
): Property[] => data.map((dataItem) => mapProperty(dataItem, languageCode, domains, units));
type Props = {
  open: boolean;
  onConfirm: (x: Property[]) => void;
  onClose: () => void;
  languageCode: string;
  onflyId: number;
  resources: any;
  token: string;
} & BimObjectProps;
const orderDomainsByName = (domains: Domain[]): Domain[] =>
  domains
    .slice()
    .sort((a, b) => a.DomainName.toLowerCase().localeCompare(b.DomainName.toLowerCase()));

const PropertiesModal: React.FC<Props> = ({
  open,
  onConfirm,
  onClose,
  languageCode,
  onflyId,
  resources,
  token,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<Domain>({
    DomainId: undefined,
    DomainName: undefined,
  });
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!open) {
      return;
    }
    fetchDomains();
    fetchUnits();
    setSelectedProperties([]);
  }, [open]);

  useEffect(() => {
    if (domains.length === 0 || units.length === 0) {
      return;
    }

    fetchProperties(selectedDomain.DomainId);
  }, [domains, units, selectedDomain.DomainId]);

  const fetchDomains = async () => {
    const response = await fetch(
      `${API_URL}/api/ws/v1/domain/list/${languageCode}?token=${token}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const fetchedDomains: Domain[] = await response.json();

    const orderedDomains = orderDomainsByName(fetchedDomains);

    orderedDomains.unshift({
      DomainId: -1,
      DomainName: resources.ObjectPropertiesManager.AllDomains,
    });
    setDomains(orderedDomains);
    setSelectedDomain(orderedDomains.length > 1 ? orderedDomains[1] : orderedDomains[0]);
  };

  const fetchUnits = async () => {
    const response = await fetch(
      `${API_URL}/api/ws/v1/property/unit/list/${languageCode}?token=${token}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    const json: Unit[] = await response.json();
    setUnits(json);
  };

  const fetchProperties = async (domainId?: number) => {
    setIsLoading(true);
    const url = `${API_URL}/api/ws/v1/${languageCode}/contentmanagement/${onflyId}/dictionary/property/${domainId}/defaultonfly?token=${token}`;
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(url, options);
    const fetchedProperties = await response.json();
    const mappedProperties = mapProperties(
      fetchedProperties.PropertiesTemplateModelList as any[],
      languageCode,
      domains,
      units
    );
    setProperties(mappedProperties);
    setIsLoading(false);
  };

  const onConfirmHandler = () => {
    onConfirm(selectedProperties);
  };

  const onPropertyChangedHandler = (updatedProperty: Property) => {
    if (updatedProperty.selected) {
      onPropertySelected(updatedProperty);
    } else {
      onPropertyDeselected(updatedProperty);
    }
  };

  const onPropertySelected = (property: Property) => {
    const updatedSelectedProperties = [...selectedProperties, property];
    setSelectedProperties(updatedSelectedProperties);
  };

  const onPropertyDeselected = (property: Property) => {
    const updatedSelectedProperties = selectedProperties.filter(
      (existingProperty) => existingProperty.Id !== property.Id
    );
    setSelectedProperties(updatedSelectedProperties);
  };

  const filteredProperties = getFilteredProperties(properties, filter);
  const mappedProperties = getMappedProperties(filteredProperties, selectedProperties);

  const left = (
    <Left
      properties={mappedProperties}
      onPropertyChanged={onPropertyChangedHandler}
      filter={filter}
      setFilter={setFilter}
      domains={domains}
      selectedDomain={selectedDomain}
      onDomainChanged={setSelectedDomain}
    />
  );

  const right = (
    <Right
      properties={selectedProperties}
      onConfirm={onConfirmHandler}
      onDelete={onPropertyDeselected}
      onCancel={onClose}
    />
  );
  const showRight = selectedProperties.length > 0;

  return (
    <ThemeProvider theme={theme}>
      <DialogWithRecap
        left={left}
        right={right}
        showRight={showRight}
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="lg"
        isLoading={isLoading}
      />
    </ThemeProvider>
  );
};

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  onflyId: selectManagementCloudId,
  resources: selectTranslatedResources,
  token: selectToken,
});

export default connect(mapStateToProps)(PropertiesModal);
