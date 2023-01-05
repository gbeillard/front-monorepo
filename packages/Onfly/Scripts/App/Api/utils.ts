export type RequestOptions = {
  method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: {
    Accept?: string;
    Authorization?: string;
    'Api-Key'?: string;
    'Content-Type'?: string;
    'Accept-Language'?: string;
    BimAndCoIntrospect?: string;
  };
  body?: any;
};

export const request = async <T>(url: string, options: RequestOptions): Promise<T> => {
  const response = await generateRequest(url, options);
  const checkedResponse = checkResponse(response);
  return parseJSON(checkedResponse);
};

export const request2 = async <T>(url: string, options: RequestOptions): Promise<T> => {
  const headers = { 'Api-Key': localStorage.getItem('ApiKey'), ...options.headers };
  const response = await fetch(url, { ...options, headers });
  const checkedResponse = checkResponse(response);
  return parseJSON(checkedResponse);
};

export const requestRaw = async (url: string, options: RequestOptions): Promise<string> => {
  const response = await generateRequest(url, options);
  const checkedResponse = checkResponse(response);
  return parseRaw(checkedResponse);
};

export const requestExcel = async (url: string, options: RequestOptions) => {
  let filename = 'filename.xlsx';
  await generateRequest(url, options)
    .then((response) => {
      filename = response.headers
        .get('Content-Disposition')
        .split(';')
        .find((n) => n.includes('filename='))
        .replace('filename=', '')
        .trim();
      return checkResponse(response);
    })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
      a.click();
      a.remove(); // afterwards we remove the element again
      window.URL.revokeObjectURL(url);
    });
};

export const generateRequest = async (url: string, options: RequestOptions) => {
  const headers = {
    'Api-Key': localStorage.getItem('ApiKey'),
    Authorization: `Bearer ${localStorage.getItem('Temporary_token')}`,
    ...options.headers,
  };
  return fetch(url, { ...options, headers });
};

const checkResponse = (response: Response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  throw new Error(response.status.toString());
};

const parseRaw = async (response: Response) => {
  if (response.status === 204 || response.status === 205) {
    return null;
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  return text;
};

export const parseJSON = async (response: Response) => JSON.parse(await parseRaw(response));