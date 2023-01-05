import jwt from 'jsonwebtoken';
import { API_URL, METABASE_SITE_URL } from './constants';
import { request, RequestOptions, generateRequest } from './utils';
import toastr from 'toastr';
import { LanguageCode } from '../Reducers/app/types';

type MetabaseDashboard = {
  Id: number;
};

type MetabaseData = {
  Dashboard: MetabaseDashboard;
  LanguageCode: LanguageCode;
  resources: any;
};

export const GetMetabaseDashboardData = (
  onflyId: number,
  languageCode: string
): Promise<MetabaseData> => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/dashboards`;
  const options: RequestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': `${languageCode}`,
    },
  };
  return request(url, options);
};

export const GetUrl = (data: MetabaseData): string => {
  const METABASE_SECRET_KEY = 'e028e97edd5bcc5ac14737f23a5313584ddd8d9cc9af717465fde236225bfa47';

  const url = window.location.host;
  const parts = url.split('.');
  const subDomain = parts[0];

  const payload = {
    resource: { dashboard: data.Dashboard.Id },
    params: {
      onfly_s_lectionn_: subDomain,
      langue: data.LanguageCode,
    },
    exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
  };
  const token = jwt.sign(payload, METABASE_SECRET_KEY);
  return `${METABASE_SITE_URL}/embed/dashboard/${token}#bordered=false&titled=false`;
};

export const GetMetabaseDashboardDataExport = (
  onflyId: number,
  languageCode,
  
  resources = null
): Promise<MetabaseData> => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/statistics`;

  const options: RequestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': `${languageCode}`,
    },
  };

  generateRequest(url, options).then((response) => {  
    if (response.status == 200) {
      if (resources != null) {
        toastr.success(resources.Metabase.DataExportSuccess);
      }
    } else if (resources != null) {
      toastr.error(resources.Metabase.DataExportFail);
    }
  });

  return;
};
