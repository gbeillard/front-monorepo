import { API_URL } from '../../Api/constants';
import { requestExcel, RequestOptions } from '../../Api/utils';

const APIKEY = localStorage.getItem('ApiKey');

const getExcelDictionary = async (languageCode: string, onflyId: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/dictionary/export/excel`;
  const options: RequestOptions = {
    method: 'GET',
    headers: {
      'Accept-Language': languageCode,
    },
  };

  return requestExcel(url, options);
};

const getExcelTemplateDictionary = async (languageCode: string, onflyId: number) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/dictionary/template/excel`;
  const options: RequestOptions = {
    method: 'GET',
    headers: {
      'Accept-Language': languageCode,
    },
  };

  return requestExcel(url, options);
};

const setExcelDictionary = async (languageCode: string, onflyId: number, file, token) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/dictionary/import/excel`;

  const currentExcelData = new FormData();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  currentExcelData.append('file', file[0]);

  const options: RequestOptions = {
    method: 'POST',
    headers: {
      'Api-Key': APIKEY,
      'Accept-Language': languageCode,
      Authorization: `Bearer ${token}`,
    },
    body: currentExcelData,
  };

  const response = await fetch(url, options);
  return response;
};

const validateImportExcelDictionary = async (
  languageCode: string,
  onflyId: number,
  uploadType,
  data,
  token
) => {
  const url = `${API_URL}/api/v10/onfly/${onflyId}/dictionary/properties/${uploadType}/import`;

  const options: RequestOptions = {
    method: 'POST',
    headers: {
      'Api-Key': APIKEY,
      'Accept-Language': languageCode,
      Authorization: `Bearer ${token}`,
    },
    body: data,
  };

  const response = await fetch(url, options);
  return response;
};

export default {
  getExcelDictionary,
  getExcelTemplateDictionary,
  setExcelDictionary,
  validateImportExcelDictionary,
};