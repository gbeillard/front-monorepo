import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import API from '../../../Api/ClassificationsApi';
import Component from './Component';
import {
  selectFilter,
  selectSort,
  selectVisibleClassifications,
  selectLanguage as selectClassificationsLanguage,
} from '../../../Reducers/classifications/selectors';
import {
  setFilter as setFilterAction,
  setSort as setSortAction,
  fetchClassifications as fetchClassificationsAction,
  updateClassification as updateClassificationAction,
  deleteClassification as deleteClassificationAction,
  setLanguage as setClassificationsLanguageAction,
  resetState as resetStateAction,
} from '../../../Reducers/classifications/actions';
import { setLoader as setLoaderAction } from '../../../Reducers/app/actions';
import { ClassificationsSort, IClassification } from '../../../Reducers/classifications/types';
import { LanguageCode } from '../../../Reducers/app/types';
import { Classification } from '../interfaces';
import { history } from '../../../history';

export const redirectToClassificationDetails = (
  classificationId,
  language: string,
  automaticTranslation = false
) => {
  const path = `/${language}/manage-classifications/${classificationId}`;

  if (automaticTranslation) {
    history.push(path, { translationInProgress: true });
  } else {
    history.push(path);
  }
};

type Props = {
  classifications: IClassification[];
  filter: string;
  sort: ClassificationsSort;
  token: string;
  managementCloudId: number;
  language: LanguageCode;
  classificationsLanguage: LanguageCode;
  fetchClassifications: () => void;
  updateClassification: (c: IClassification) => void;
  deleteClassification: (c: IClassification, k: boolean) => void;
  setFilter: (f: string) => void;
  setSort: (s: ClassificationsSort) => void;
  setClassificationsLanguage: (l: LanguageCode) => void;
  resetState: () => void;
  EnableClassificationManagement: boolean;
};

export const ClassificationsContainer: React.FC<Props> = ({
  classifications,
  filter,
  sort,
  token,
  managementCloudId,
  language,
  classificationsLanguage,
  EnableClassificationManagement, // mapSelectToProps
  fetchClassifications,
  updateClassification,
  deleteClassification,
  setFilter,
  setSort,
  setClassificationsLanguage,
  resetState, // mapDispatchToProps
}) => {
  useEffect(
    () => () => {
      resetState();
    },
    []
  );

  useEffect(() => {
    setClassificationsLanguage(language);
  }, [language]);

  useEffect(() => {
    classificationsLanguage && fetchClassifications();
  }, [classificationsLanguage]);

  if (classifications === null) {
    return null;
  }

  const handleCreate = useCallback(
    async (classification) => {
      // utilisé pour la Modal de création de classifications, hors scope
      const savedClassificationId = await API.saveClassification(
        token,
        managementCloudId,
        classification as Classification
      );
      redirectToClassificationDetails(
        savedClassificationId,
        language,
        classification.Template != null
      );
    },
    [token, managementCloudId, language]
  );

  const handleClone = useCallback(
    async (classification) => {
      // utilisé pour la Modal de création de classifications, hors scope
      const clonedClassificationId = await API.cloneClassification(
        token,
        managementCloudId,
        classification as Classification
      );
      redirectToClassificationDetails(clonedClassificationId, language);
    },
    [token, managementCloudId, language]
  );

  const handleDownload = useCallback(async (downloadLanguage) => {
    // utilisé pour la Modal de création de classifications, hors scope
    await API.downloadClassificationTemplate(token, managementCloudId, downloadLanguage);
  }, []);

  const handleClassificationClicked = useCallback(
    ({ Id }) => {
      redirectToClassificationDetails(Id, language);
    },
    [language]
  );

  if (EnableClassificationManagement) {
    return (
      <Component
        classifications={classifications}
        onClassificationChanged={updateClassification}
        onCreate={handleCreate}
        onClone={handleClone}
        onDownload={handleDownload}
        onDelete={deleteClassification}
        onClassificationClicked={handleClassificationClicked}
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
      />
    );
  }
  return (
    <div className="text-center">
      <h1 className="loadingtext">BIM&CO - ONFLY</h1>
      <p>Error 403 Access Denied</p>
    </div>
  );
};

const mapStateToProps = (store) => {
  const { appState } = store;

  return {
    token: appState.TemporaryToken,
    managementCloudId: appState.ManagementCloudId,
    language: appState.Language,
    classifications: selectVisibleClassifications(store),
    filter: selectFilter(store),
    sort: selectSort(store),
    classificationsLanguage: selectClassificationsLanguage(store),
    EnableClassificationManagement: appState.Settings.EnableClassificationManagement,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchClassifications: () => dispatch(fetchClassificationsAction()),
  updateClassification: (classification: IClassification) =>
    dispatch(updateClassificationAction(classification)),
  deleteClassification: (classification: IClassification, keepPropertiesWithValue: boolean) =>
    dispatch(deleteClassificationAction(classification, keepPropertiesWithValue)),
  setFilter: (filter: string) => dispatch(setFilterAction(filter)),
  setSort: (sort: ClassificationsSort) => dispatch(setSortAction(sort)),
  setLoader: (state) => dispatch(setLoaderAction(state)),
  setClassificationsLanguage: (language) => dispatch(setClassificationsLanguageAction(language)),
  resetState: () => dispatch(resetStateAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ClassificationsContainer));