import store from '../Store/Store';
import { API_URL } from './constants';

export function getPropertyDomains(temporaryToken, languageCode) {
  fetch(`${API_URL}/api/ws/v1/domain/list/${languageCode}?token=${temporaryToken}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Tri par ordre alphabétique
      const domainList = data.sort((a, b) => {
        const domainNameA = a.DomainName.toLowerCase();
        const domainNameB = b.DomainName.toLowerCase();

        return domainNameA.localeCompare(domainNameB);
      });

      store.dispatch({ data: domainList, type: 'LOAD_PROPERTY_DOMAINS' });
    });
}

export function getPropertyUnits(temporaryToken, languageCode) {
  fetch(`${API_URL}/api/ws/v1/property/unit/list/${languageCode}?token=${temporaryToken}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      store.dispatch({ data, type: 'LOAD_PROPERTY_UNITS' });
    });
}

export function getPropertyEditTypes(temporaryToken, languageCode) {
  fetch(`${API_URL}/api/ws/v1/property/edittype/list/${languageCode}?token=${temporaryToken}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      store.dispatch({ data, type: 'LOAD_PROPERTY_EDIT_TYPES' });
    });
}

export function getPropertyDataTypes(temporaryToken, languageCode) {
  fetch(`${API_URL}/api/ws/v1/property/datatype/list/${languageCode}?token=${temporaryToken}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      store.dispatch({ data, type: 'LOAD_PROPERTY_DATA_TYPES' });
    });
}

export function getPropertyParameterTypes(temporaryToken, languageCode) {
  fetch(
    `${API_URL}/api/ws/v1/property/parametertype/list/${languageCode}?token=${temporaryToken}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      store.dispatch({ data, type: 'LOAD_PROPERTY_PARAMETER_TYPES' });
    });
}

export const fetchDomains = async (token, managementCloudId, languageCode) => {
  const url = `${API_URL}/api/ws/v1/properties/${languageCode}/contentmanagement/${managementCloudId}/dictionnary?token=${token}`;
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, options);
  return response.json();
};

const API = {
  fetchDomains,
};

export default API;
