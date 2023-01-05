import { API_URL } from '../../Api/constants';
import { request, RequestOptions } from '../../Api/utils';

const getAllList = (
  languageCode: string,
  onflyId: number,
  mappingConfigurationId?: string,
  mappingConfigurationLanguage?: string,
  mappingDictionaryLanguage?: string
) => {
  const queryParameters = [];
  if (mappingConfigurationId) {
    queryParameters.push(`namingConventionId=${JSON.stringify(mappingConfigurationId)}`);
  }

  if (mappingDictionaryLanguage === '') {
    queryParameters.push(`filterByNamingConvention=true`);
  }

  const queryString = queryParameters.length ? `?${queryParameters.join('&')}` : '';
  const url = `${API_URL}/api/v10/onfly/${onflyId}/properties${queryString}`;
  const language = (mappingConfigurationLanguage !== undefined && mappingConfigurationLanguage !== '')
  ? mappingConfigurationLanguage 
  : (mappingDictionaryLanguage !== undefined && mappingDictionaryLanguage !== '') ? mappingDictionaryLanguage : languageCode;

  const options: RequestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': language,
    },
  };

  return request(url, options);
};

export default {
  getAllList,
};