import { createStructuredSelector } from 'reselect';
import { selectTranslatedResources } from '../app/selectors';

const mapSelectToTranslatedResources = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default mapSelectToTranslatedResources;
