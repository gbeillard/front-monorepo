import { all } from 'redux-saga/effects';

import { sagas as OCSagas } from '@bim-co/onfly-connect';

import classificationsSagas from './classifications/sagas';
import classificationsPropertiesSagas from './classifications/properties/sagas';
import classificationsPropertiesSubsetsSagas from './classifications/properties/subsets/sagas';
import classificationsSubsetsSagas from './classifications/subsets/sagas';
import appSagas from './app/sagas';
import dictionarySagas from './dictionary/sagas';
import objectsSagas from './BimObject/sagas';
import documentsSagas from './BimObject/Documents/sagas';
import variantsSagas from './BimObject/Variants/sagas';
import setSagas from './properties-sets/saga';
import setPropertiesSagas from './Sets/Properties/saga';
import setSubsetsSagas from './Sets/Subsets/saga';
import propertiesV10Sagas from './PropertiesV10/saga';
import bimObjectUsersSagas from './BimObject/Users/saga';
import bimObjectPropertiesSagas from './BimObject/Properties/saga';
import bimObjectSubsetsSagas from './BimObject/Subsets/saga';
import bimObjectPropertiesSubsetsSagas from './BimObject/Properties/Subsets/sagas';
import preferencesSagas from './preferences/sagas';
import analyticsSagas from './analytics/sagas';
import usersInvitationsSagas from './Users/Invitations/sagas';
import authenticationSagas from './authentication/sagas';
import collectionsSagas from './Collections/sagas';
import SpacesSagas from './Spaces/sagas';

export default function* rootSaga() {
  yield all([
    ...classificationsSagas,
    ...classificationsPropertiesSagas,
    ...classificationsPropertiesSubsetsSagas,
    ...classificationsSubsetsSagas,
    ...appSagas,
    ...dictionarySagas,
    ...objectsSagas,
    ...documentsSagas,
    ...variantsSagas,
    ...setSagas,
    ...setPropertiesSagas,
    ...setSubsetsSagas,
    ...propertiesV10Sagas,
    ...bimObjectUsersSagas,
    ...bimObjectPropertiesSagas,
    ...bimObjectSubsetsSagas,
    ...bimObjectPropertiesSubsetsSagas,
    ...preferencesSagas,
    ...analyticsSagas,
    ...usersInvitationsSagas,
    ...authenticationSagas,
    ...OCSagas,
    ...collectionsSagas,
    ...SpacesSagas,
  ]);
}
