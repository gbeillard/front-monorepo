import { API_URL } from '../../Api/constants';
import { request, RequestOptions } from '../../Api/utils';

class CountryApi {
  static fetchCountries = (temporaryToken: string, languageCode: string) => {
    const url = `${API_URL}/api/ws/v1/region/country/list?lang=${languageCode}&continentCode=MO&token=${temporaryToken}`;
    const options: RequestOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': languageCode,
      },
    };

    return request(url, options);
  };
}

export default CountryApi;