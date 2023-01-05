import toastr from 'toastr';
import store from '../Store/Store';
import { API_URL } from './constants';
import {
  setDocumentTitle,
  updateTemporaryToken,
  resetAuthToken,
  updateInformationContext,
  setCrispMetadata,
} from '../Reducers/app/actions';
import { request } from './utils';

export function getResources(resourceslist, language, isEditingResource) {
  fetch(`${API_URL}/api/ws/v1/resources/list/${language}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resourceslist),
  })
    .then((response) => response.json())
    .then((json) => {
      const action = {
        data: json,
        type: 'UPDATE_RESOURCES',
        language,
        isEditingResource,
      };
      store.dispatch(action);
    });
}

export const getContentManagementInformations = async (subDomain) => {
  const response = await fetch(
    `${API_URL}/api/ws/v1/contentmanagement/informations?sub_domain=${subDomain}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  const json = await response.json();
  store.dispatch(updateInformationContext(json));
  store.dispatch(setDocumentTitle(json.EntityName));
};

export const getTemporaryKey = async (token, contentManagementId, resources = null) => {
  const response = await fetch(
    `${API_URL}/api/ws/requesttemporarykey?token=${token}&content_management_id=${contentManagementId}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  // status error handling
  if (response.status !== 200) {
    store.dispatch(resetAuthToken());

    if (resources !== null) {
      toastr.error(resources.SessionLogin.NoAccess);
    }
    return;
  }

  // json error handling
  const json = await response.json();
  if (!json || json === 'error') {
    store.dispatch(resetAuthToken());
    return;
  }

  // actual data
  store.dispatch(updateTemporaryToken({ ...json, AuthToken: token }));
  store.dispatch(setCrispMetadata(json.UserFirstName, json.UserLastName, json.UserAvatar));
};

export function getRoles(language, token, onflyId) {
  let url = `${API_URL}/api/ws/v1/roles/contentmanagement/list/${language}?token=${token}`;
  if (onflyId != undefined && onflyId != null) {
    url += `&onflyId=${onflyId}`;
  }

  fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      const action = { data: json, type: 'UPDATE_ROLES', language };
      store.dispatch(action);
    });
}

export async function getSoftwares() {
  const url = `${API_URL}/api/ws/v1/software/list`;

  const options = {
    method: 'GET',
  };
  const softwares = await request(url, options);

  const action = { data: softwares, type: 'UPDATE_SOFTWARES' };
  store.dispatch(action);
}

export function getCivilities(lang) {
  fetch(`${API_URL}/api/ws/v1/civility/list/${lang}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      const action = { data: json, type: 'UPDATE_CIVILITIES' };
      store.dispatch(action);
    });
}

export function getCountries(lang, continent) {
  fetch(`${API_URL}/api/ws/v1/region/country/list?lang=${lang}&continentCode=${continent}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      const action = { data: json, type: 'UPDATE_COUNTRIES' };
      store.dispatch(action);
    });
}

export function getFunctions(lang) {
  fetch(`${API_URL}/api/ws/v1/functions/list/${lang}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      const action = { data: json, type: 'UPDATE_FUNCTIONS' };
      store.dispatch(action);
    });
}

export function getActivities(lang) {
  fetch(`${API_URL}/api/ws/v2/activities/${lang}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((activities) => {
      const action = { data: activities, type: 'UPDATE_ACTIVITIES' };
      store.dispatch(action);
    });
}

export function getCompaniesSize() {
  fetch(`${API_URL}/api/ws/v1/companies/size/list`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      const action = { data: json, type: 'UPDATE_COMPANIES_SIZE' };
      store.dispatch(action);
    });
}

export function getUserDetails(temporaryToken) {
  fetch(`${API_URL}/api/ws/v1/user/account/details?token=${temporaryToken}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      const action = { data: json, type: 'UPDATE_USER_DETAILS' };
      store.dispatch(action);
    });
}

export const fetchLanguages = async () => {
  const response = await fetch(`${API_URL}/api/ws/v1/languages/list`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

export const fetchDocumentTypes = async (token) => {
  const response = await fetch(
    `${API_URL}/api/ws/v1/bimobject/document/types/list?token=${token}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  return response.json();
};
