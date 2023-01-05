/* eslint-disable import/no-cycle */
import { select, takeLatest, call, put, delay } from 'redux-saga/effects';
import {
  FETCH_NODES,
  DEPRECATED_FETCH_CLASSIFICATIONS,
  SET_NODES_FILTER,
  REMOVE_NODE_FROM_CLASSIFICATION,
  ADD_NODE_TO_CLASSIFICATION,
  MOVE_NODE,
  UPDATE_NODE,
  FETCH_CLASSIFICATION,
  UPDATE_CLASSIFICATION,
  DELETE_CLASSIFICATION,
  FETCH_CLASSIFICATIONS,
  IClassification,
  IClassificationNode,
} from './types';
import {
  selectToken,
  selectLanguageCode,
  selectManagementCloudId,
  selectSubDomain,
} from '../app/selectors';
import { selectLanguage } from './selectors';
import API from '../../Api/ClassificationsApi';
import APIV10 from './api';
import {
  fetchNodesSuccess,
  fetchNodesError,
  deprecatedFetchClassificationsSuccess,
  deprecatedFetchClassificationsError,
  setNodesFilterSuccess,
  removeNodeFromClassificationSuccess,
  removeNodeFromClassificationError,
  addNodeToClassificationSuccess,
  addNodeToClassificationError,
  moveNodeSuccess,
  moveNodeError,
  updateNodeSuccess,
  updateNodeError,
  fetchClassificationSuccess,
  fetchClassificationError,
  updateClassificationSuccess,
  updateClassificationError,
  deleteClassificationSuccess,
  deleteClassificationError,
  fetchNodes,
  fetchClassificationsSuccess,
  fetchClassificationsError,
  fetchClassifications,
} from './actions';
import { LanguageCode } from '../app/types';

function* deprecatedFetchClassifications() {
  const token = yield select(selectToken);
  const onflyId = yield select(selectManagementCloudId);
  const languageCode = yield select(selectLanguageCode);
  const subDomain = yield select(selectSubDomain);

  try {
    const classifications = yield call(
      API.getClassificationsListV2,
      token,
      onflyId,
      languageCode,
      subDomain
    );
    yield put(deprecatedFetchClassificationsSuccess(classifications));
  } catch (error) {
    yield put(deprecatedFetchClassificationsError(error));
  }
}

const sortByName = (classifications: IClassification[]) =>
  classifications
    .slice()
    .sort((a, b) => (a.Name.toLocaleLowerCase() < b.Name.toLocaleLowerCase() ? -1 : 1));
function* fetchClassificationsSaga() {
  const onflyId: number = yield select(selectManagementCloudId);
  const language: LanguageCode = yield select(selectLanguage);
  try {
    const classifications: IClassification[] = yield call(APIV10.list, language, onflyId);
    yield put(fetchClassificationsSuccess(sortByName(classifications)));
  } catch (error) {
    yield put(fetchClassificationsError(error as string));
  }
}

function* fetchClassification(action) {
  const { id } = action;
  const onflyId: number = yield select(selectManagementCloudId);
  const language: LanguageCode = yield select(selectLanguage);
  try {
    const classification: IClassification = yield call(APIV10.get, language, onflyId, id as number);
    yield put(fetchClassificationSuccess(classification));
    yield put(fetchNodes(id));
  } catch (error) {
    yield put(fetchClassificationError(error as string));
  }
}

function* updateClassification(action) {
  const { classification } = action;
  const onflyId: number = yield select(selectManagementCloudId);
  const language: LanguageCode = yield select(selectLanguage);
  try {
    yield call(APIV10.update, language, onflyId, classification as IClassification);
    yield put(updateClassificationSuccess());
  } catch (error) {
    yield put(updateClassificationError(error as string));
  }
}

function* deleteClassification(action) {
  const { classification, keepPropertiesWithValue } = action;
  const onflyId: number = yield select(selectManagementCloudId);
  try {
    yield call(
      APIV10.remove,
      onflyId,
      classification as IClassification,
      keepPropertiesWithValue as boolean
    );
    yield put(deleteClassificationSuccess());
    yield put(fetchClassifications());
  } catch (error) {
    yield put(deleteClassificationError(error as string));
  }
}

function* fetchNodesSaga(action) {
  const { classificationId } = action;
  const onflyId: number = yield select(selectManagementCloudId);
  const language: LanguageCode = yield select(selectLanguage);

  try {
    const nodes = yield call(APIV10.listNodes, language, onflyId, classificationId as number);
    yield put(fetchNodesSuccess(classificationId, nodes));
  } catch (error) {
    yield put(fetchNodesError(error));
  }
}

function* setNodesFilter(action) {
  yield delay(500);
  const { nodesFilter } = action;
  yield put(setNodesFilterSuccess(nodesFilter));
}

function* addNodeToClassification(action) {
  const { classificationId, nodeId, node } = action;
  const onflyId: number = yield select(selectManagementCloudId);
  const language: LanguageCode = yield select(selectLanguage);

  try {
    yield call(
      APIV10.addNode,
      language,
      onflyId,
      classificationId as number,
      nodeId as number,
      node as IClassificationNode
    );
    yield put(addNodeToClassificationSuccess());
    yield put(fetchNodes(classificationId));
  } catch (error) {
    yield put(addNodeToClassificationError(error));
  }
}

function* removeNodeFromClassification(action) {
  const { classificationId, node, keepPropertiesWithValue } = action;
  const onflyId: number = yield select(selectManagementCloudId);
  try {
    yield call(
      APIV10.deleteNode,
      onflyId,
      classificationId as number,
      node as IClassificationNode,
      keepPropertiesWithValue as boolean
    );
    yield put(removeNodeFromClassificationSuccess());
  } catch (error) {
    yield put(removeNodeFromClassificationError(error));
  }
}

function* moveNode(action) {
  const { classificationId, target, node } = action;
  const onflyId: number = yield select(selectManagementCloudId);

  try {
    yield call(
      APIV10.moveNode,
      onflyId,
      classificationId as number,
      target as IClassificationNode,
      node as IClassificationNode
    );
    yield put(moveNodeSuccess());
  } catch (error) {
    yield put(moveNodeError(error));
  }
}

// update node informations
function* updateNode(action) {
  const { classificationId, node } = action;
  const onflyId: number = yield select(selectManagementCloudId);
  const language: LanguageCode = yield select(selectLanguage);

  try {
    yield call(
      APIV10.updateNode,
      language,
      onflyId,
      classificationId as number,
      node as IClassificationNode
    );
    yield put(updateNodeSuccess());
  } catch (error) {
    yield put(updateNodeError(error as string));
  }
}

const classificationsSagas = [
  takeLatest(DEPRECATED_FETCH_CLASSIFICATIONS, deprecatedFetchClassifications),
  takeLatest(FETCH_CLASSIFICATIONS, fetchClassificationsSaga),
  takeLatest(FETCH_CLASSIFICATION, fetchClassification),
  takeLatest(UPDATE_CLASSIFICATION, updateClassification),
  takeLatest(DELETE_CLASSIFICATION, deleteClassification),
  takeLatest(FETCH_NODES, fetchNodesSaga),
  takeLatest(SET_NODES_FILTER, setNodesFilter),
  takeLatest(ADD_NODE_TO_CLASSIFICATION, addNodeToClassification),
  takeLatest(REMOVE_NODE_FROM_CLASSIFICATION, removeNodeFromClassification),
  takeLatest(MOVE_NODE, moveNode),
  takeLatest(UPDATE_NODE, updateNode),
];

export default classificationsSagas;