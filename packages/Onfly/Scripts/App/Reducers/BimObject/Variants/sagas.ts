import { select, call, put, takeLatest } from 'redux-saga/effects';
import { FETCH_VARIANTS, FetchVariantsAction, ObjectVariant } from './types';
import { fetchVariantsSuccess, fetchVariantsError } from './actions';
import { selectLanguageCode, selectToken } from '../../app/selectors';
import API from './api';

function* fetchVariants({ bimObjectId }: FetchVariantsAction) {
  const languageCode: string = yield select(selectLanguageCode);
  const token: string = yield select(selectToken);
  try {
    const variants: ObjectVariant[] = yield call(API.list, languageCode, token, bimObjectId);
    yield put(fetchVariantsSuccess(variants));
  } catch (error) {
    yield put(fetchVariantsError(error as Error));
  }
}

const sagas = [takeLatest(FETCH_VARIANTS, fetchVariants)];

export default sagas;