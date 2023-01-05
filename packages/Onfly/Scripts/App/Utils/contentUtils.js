import toastr from 'toastr';

import { getContent } from '../Api/ContentApi';
import { downloadLink } from './utils.js';

/**
 * Handle download content
 * @param {any} content
 * @param {number} managementCloudId
 * @param {any} resources
 */
export const downloadContent = async (content, managementCloudId, resources) => {
  const contentPromise = getContent(content?.Id, content?.MediaType, managementCloudId);

  return contentPromise.then((results) => {
    if (results !== null) {
      downloadLink(results);
    } else {
      toastr.error(resources.BimObjectDetails.DownloadFail);
    }
    return results !== null;
  });
};
