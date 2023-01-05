/* eslint-disable max-lines-per-function */
/* eslint-disable react/no-unused-state */
import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';
import toastr from 'toastr';
import styled from '@emotion/styled';

// material UI elements
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Button } from '@bim-co/componentui-foundation';

// material UI icons
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import ErrorIcon from '@material-ui/icons/Error';
import SelectNature from '../Properties/SelectNature';
import store from '../../Store/Store';
import * as DisplayDesign from '../../Utils/displayDesign.js';
import { API_URL } from '../../Api/constants';

// Component design system
import COLORS from '../../components/colors';
import DialogTitle from '../../components/dialogs/DialogTitle';
import DialogContent from '../../components/dialogs/DialogContent';
import DialogActions from '../../components/dialogs/DialogActions';

const PropertyElement = createReactClass({
  getInitialState() {
    return {
      errorFieldPropertyName: false,
      errorFieldDescription: false,
      errorFieldDomain: false,
      errorFieldEditType: false,
      errorFieldDataType: false,
      errorFieldParameterType: false,
      currentDataModel: this.props.CurrentDataModel,
      isEditionMode: false,
      isCreationMode: false,
      isImportBcMode: false,
      isAuthorisedToEdit: false,
      propertyDatas: {
        PropertyId: 0,
        PropertyName: '',
        PropertyDescription: '',
        PropertyLang: '',
        PropertyDomain: 0,
        PropertyDomainType: '',
        PropertyUnit: 0,
        PropertyType: 0,
        PropertyEditType: 0,
        PropertyEditTypeValues: '',
        PropertyParameterType: 0,
        PropertyInformations: '',
        IsDefaultLang: false,
        RequestComments: '',
        RequestResponse: '',
        Nature: 0,
      }, // used to display datas
      isEditTypeError: false,
      lastEditValue: '',
      isEditTypeEmptyError: false,
      errorDetailsList: null,
    };
  },
  componentDidMount() {
    this.mapCurrentDatas();
  },

  UNSAFE_componentWillReceiveProps() {
    const self = this;
    setTimeout(() => {
      self.mapCurrentDatas();
    }, 500);
  },

  bestCopyEver(src) {
    return { ...src };
  },

  mapCurrentDatas() {
    const dataModel = this.props.CurrentDataModel;
    if (dataModel !== undefined && dataModel !== null) {
      const currentProps = this.state.propertyDatas;
      // get local copy of datas
      const currentCopyDatas = this.bestCopyEver(dataModel);

      if (currentCopyDatas.Translations !== undefined && currentCopyDatas.Translations !== null) {
        let currentLangIndex = currentCopyDatas.Translations.findIndex(
          (l) => l.IsDefaultTranslation !== undefined && l.IsDefaultTranslation === true
        );

        if (currentLangIndex === -1) {
          currentLangIndex = currentCopyDatas.Translations.findIndex(
            (l) => l.TranslationLangCode === this.props.Language
          );
        }

        if (currentLangIndex === -1) {
          currentLangIndex = currentCopyDatas.Translations.findIndex(
            (l) => l.TranslationLangCode === 'en'
          );
        }

        const currentLang = currentCopyDatas.Translations[currentLangIndex];
        currentProps.PropertyId = currentCopyDatas.PropertyId;
        currentProps.PropertyName = currentLang.PropertyName;
        currentProps.PropertyDescription = currentLang.PropertyDescription;
        currentProps.PropertyLang = currentLang.TranslationLangCode;
        currentProps.PropertyDomain = currentCopyDatas.PropertyDomainCode;
        currentProps.PropertyUnit = currentCopyDatas.PropertyUnitCode;
        currentProps.PropertyType = currentCopyDatas.PropertyDataTypeCode;
        currentProps.PropertyEditType = currentCopyDatas.PropertyEditTypeCode;
        currentProps.PropertyEditTypeValues = currentLang.PropertyEditTypeValues;
        currentProps.PropertyParameterType = currentCopyDatas.PropertyParameterType;
        currentProps.PropertyInformations = currentLang.PropertyInformations;
        currentProps.IsDefaultLang = currentLang.IsDefaultTranslation;
        currentProps.RequestComments =
          currentCopyDatas.RequestComments != null ? currentCopyDatas.RequestComments : '';
        currentProps.RequestResponse =
          currentCopyDatas.RequestResponse != null ? currentCopyDatas.RequestResponse : '';
        currentProps.Nature = currentCopyDatas.Nature;

        // to check if is bim and co prop import/edit
        const bcPropMode = !!(
          this.props.IsImportBcMode === true ||
          (currentCopyDatas.MappedPropId !== undefined &&
            currentCopyDatas.MappedPropId !== 0 &&
            currentCopyDatas.IsAuthorisedToEdit === false)
        );

        this.setState({
          propertyDatas: currentProps,
          currentDataModel: currentCopyDatas,
          isEditionMode: !this.props.IsReadOnly,
          isAuthorisedToEdit: currentCopyDatas.IsAuthorisedToEdit,
          isImportBcMode: bcPropMode,
        });
        this.handleCheckEditTypeValues(currentCopyDatas);
      }
    } else {
      const emptyDatas = {
        PropertyId: 0,
        PropertyName: '',
        PropertyDescription: '',
        PropertyLang: '',
        PropertyDomain: 0,
        PropertyDomainType: '',
        PropertyUnit: 0,
        PropertyType: 0,
        PropertyEditType: 0,
        PropertyEditTypeValues: '',
        PropertyParameterType: 0,
        PropertyInformations: '',
        IsDefaultLang: false,
        RequestComments: '',
        RequestResponse: '',
        Nature: 0,
      };

      this.setState({
        propertyDatas: emptyDatas,
        isEditionMode: false,
        isAuthorisedToEdit: false,
        isImportBcMode: false,
        isCreationMode: this.props.IsCreationMode,
      });
    }
  },

  _getDomainType(domainId) {
    const self = this;
    const domainSelected = _.find(self.props.Domains, (domain) => domain.DomainId == domainId);

    if (domainSelected != null) {
      return domainSelected.DomainType;
    }

    return '';
  },

  checkNameValidity(isEditionMode, currentDatas) {
    const self = this;
    store.dispatch({ type: 'LOADER', state: true });

    let creationName = '';
    let propertyLangs = [];
    let isOk = true;
    let currentPropertyId = 0;

    if (isEditionMode) {
      propertyLangs = currentDatas.Translations;
      currentPropertyId = currentDatas.PropertyId;
    } else {
      creationName = currentDatas.PropertyName;
    }

    // = > check name
    fetch(
      `${API_URL}/api/ws/v1/${self.props.Language}/contentmanagement/${self.props.ManagementCloudId}/dictionary/properties/edit/namecheck?token=${self.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isEditMode: isEditionMode,
          creationName,
          currentPropertyId,
          propertyLangs,
        }),
      }
    )
      .then((response) => {
        if (response.status !== 200) {
          isOk = false;
        }
        return response.json();
      })
      .then((json) => {
        store.dispatch({ type: 'LOADER', state: false });

        if (isOk === true) {
          // after ok check =>
          if (isEditionMode) {
            if (self.checkIfPropertyHasChanged() && !currentDatas.IsAuthorisedToEdit) {
              self.props.handleOpenModalDuplicateProperty(currentDatas);
            } else {
              self.props.ValidateBottomButton(self.state.currentDataModel);
            }
          } else {
            self.props.ValidateBottomButton(currentDatas);
          }
        } else {
          toastr.error(json);
        }
      });
  },

  handleChangeName(event) {
    if (this.state.isCreationMode && this.state.isImportBcMode !== true) {
      const currentValue = event.target.value;
      const currentProperty = this.state.propertyDatas;
      currentProperty.PropertyName = currentValue;
      this.setState({ propertyDatas: currentProperty });
    }

    if (this.state.isEditionMode || this.state.isImportBcMode === true) {
      const currentValue = event.target.value;

      // Recherche de la traduction à modifier
      const translationToUpdate = this.state.currentDataModel.Translations.find(
        (l) => l.TranslationLangCode === this.state.propertyDatas.PropertyLang
      );
      let updatedTranslations;

      // Si la traduction existe
      if (translationToUpdate) {
        // Création d'un nouvel objet "translation" avec la valeur modifié
        const updatedTranslation = { ...translationToUpdate, PropertyName: currentValue };
        // Création d'un nouveau tableau des "translations" avec la traduction modifié
        updatedTranslations = this.state.currentDataModel.Translations.map((translation) => {
          if (translation.TranslationLangCode === updatedTranslation.TranslationLangCode) {
            return updatedTranslation;
          }
          return translation;
        });
      } else {
        // in case of import, there is some missing langs, we have to add it
        const updatedTranslation = {
          IsDefaultTranslation: false,
          LangPropertyGuid: null,
          PropertyDescription: '',
          PropertyEditTypeValues: '',
          PropertyInformations: '',
          PropertyName: '',
          TranslationLangCode: currentProperty.PropertyLang,
        };
        updatedTranslations = [...translationToUpdate, updatedTranslation];
      }

      // Création d'un nouvel objet "currentDataModel" avec le tableau des traductions modifié
      const updatedCurrentDataModel = {
        ...this.state.currentDataModel,
        Translations: updatedTranslations,
      };
      const updatedPropertyDatas = { ...this.state.propertyDatas, PropertyName: currentValue };

      this.setState({
        propertyDatas: updatedPropertyDatas,
        currentDataModel: updatedCurrentDataModel,
      });
    }
  },

  handleChangeDescription(event) {
    if (this.state.isCreationMode && this.state.isImportBcMode !== true) {
      const currentValue = event.target.value;
      const currentProperty = this.state.propertyDatas;
      currentProperty.PropertyDescription = currentValue;
      this.setState({ propertyDatas: currentProperty });
    }

    if (this.state.isEditionMode || this.state.isImportBcMode === true) {
      const currentValue = event.target.value;

      // Recherche de la traduction à modifier
      const translationToUpdate = this.state.currentDataModel.Translations.find(
        (l) => l.TranslationLangCode === this.state.propertyDatas.PropertyLang
      );
      let updatedTranslations;

      // Création d'un nouvel objet "translation" avec la valeur modifié
      const updatedTranslation = { ...translationToUpdate, PropertyDescription: currentValue };
      // Création d'un nouveau tableau des "translations" avec la traduction modifié
      updatedTranslations = this.state.currentDataModel.Translations.map((translation) => {
        if (translation.TranslationLangCode === updatedTranslation.TranslationLangCode) {
          return updatedTranslation;
        }
        return translation;
      });

      // Création d'un nouvel objet "currentDataModel" avec le tableau des traductions modifié
      const updatedCurrentDataModel = {
        ...this.state.currentDataModel,
        Translations: updatedTranslations,
      };
      const updatedPropertyDatas = {
        ...this.state.propertyDatas,
        PropertyDescription: currentValue,
      };

      this.setState({
        propertyDatas: updatedPropertyDatas,
        currentDataModel: updatedCurrentDataModel,
      });
    }
  },

  handleChangeComments(event) {
    if (this.state.isImportBcMode !== true) {
      if (this.props.IsPropRequest === true && this.state.isEditionMode === false) {
        const currentValue = event.target.value;
        const currentProperty = this.state.propertyDatas;
        currentProperty.RequestComments = currentValue;
        this.setState({
          propertyDatas: currentProperty,
        });
      } else if ((this.state.isEditionMode = true)) {
        const currentValue = event.target.value;
        const currentProperty = this.state.propertyDatas;
        const currentDatasModel = this.state.currentDataModel;
        currentProperty.RequestComments = currentValue;
        currentDatasModel.RequestComments = currentValue;
        this.setState({
          propertyDatas: currentProperty,
          currentDataModel: currentDatasModel,
        });
      }
    }
  },

  handleChangeResponse(event) {
    if (this.state.isImportBcMode !== true) {
      if (this.props.IsRequestReplie === true && this.state.isEditionMode === false) {
        const currentValue = event.target.value;
        const currentProperty = this.state.propertyDatas;
        currentProperty.RequestResponse = currentValue;
        this.setState({
          propertyDatas: currentProperty,
        });
      } else if (this.state.isEditionMode === true) {
        const currentValue = event.target.value;
        const currentProperty = this.state.propertyDatas;
        const currentDatasModel = this.state.currentDataModel;
        currentProperty.RequestResponse = currentValue;
        currentDatasModel.RequestResponse = currentValue;
        this.setState({
          propertyDatas: currentProperty,
          currentDataModel: currentDatasModel,
        });
      }
    }
  },

  handleChangeLang(event) {
    const currentProperty = this.state.propertyDatas;
    if (this.state.isCreationMode) {
      const currentValue = event.target.value;
      currentProperty.PropertyLang = currentValue;
      this.setState({ propertyDatas: currentProperty });
    }

    const dataModel = this.state.currentDataModel;
    const currentLangIndex = dataModel.Translations.findIndex(
      (l) => l.TranslationLangCode == event.target.value
    );

    if (currentLangIndex != null && currentLangIndex !== -1) {
      const currentLang = dataModel.Translations[currentLangIndex];
      currentProperty.PropertyName = currentLang.PropertyName;
      currentProperty.PropertyDescription =
        currentLang.PropertyDescription == undefined ? '' : currentLang.PropertyDescription;
      currentProperty.PropertyLang = currentLang.TranslationLangCode;
      currentProperty.PropertyEditTypeValues = currentLang.PropertyEditTypeValues;
      currentProperty.PropertyInformations = currentLang.PropertyInformations;
      currentProperty.IsDefaultLang = currentLang.IsDefaultTranslation;
    } else {
      currentProperty.PropertyName = '';
      currentProperty.PropertyDescription = '';
      currentProperty.PropertyLang = event.target.value;
      currentProperty.PropertyEditTypeValues = '';
      currentProperty.PropertyInformations = '';
      currentProperty.IsDefaultLang = false;
    }

    const updatedTranslations = dataModel.Translations.map((translation) => {
      if (translation.PropertyEditTypeValues.trim() === '') {
        translation.PropertyEditTypeValues = this.state.lastEditValue;
      }
      return translation;
    });

    const updatedCurrentDataModel = {
      ...this.state.currentDataModel,
      Translations: updatedTranslations,
    };
    let updatedPropertyDatas;

    if (this.state.propertyDatas.PropertyEditTypeValues.trim() === '') {
      updatedPropertyDatas = {
        ...this.state.propertyDatas,
        PropertyEditTypeValues: this.state.lastEditValue,
      };
    } else {
      updatedPropertyDatas = { ...this.state.propertyDatas };
    }

    this.setState({
      propertyDatas: updatedPropertyDatas,
      currentDataModel: updatedCurrentDataModel,
    });

    this.handleCheckEditTypeValues(updatedCurrentDataModel);
  },

  handleChangeDefaultLang(event) {
    if (this.state.isEditionMode && this.state.isImportBcMode !== true) {
      const currentValue = event.currentTarget.checked;
      const currentProperty = this.state.propertyDatas;
      const currentDatasModel = this.state.currentDataModel;
      const currentLangIndex = currentDatasModel.Translations.findIndex(
        (l) => l.TranslationLangCode === currentProperty.PropertyLang
      );
      const currentLangDefault = currentDatasModel.Translations.findIndex(
        (l) => l.IsDefaultTranslation === true
      );
      if (currentLangDefault !== -1) {
        currentDatasModel.Translations[currentLangDefault].IsDefaultTranslation = false;
      }
      const currentLang = currentDatasModel.Translations[currentLangIndex];
      currentLang.IsDefaultTranslation = currentValue;
      currentProperty.IsDefaultLang = currentValue;

      this.setState({
        propertyDatas: currentProperty,
        currentDataModel: currentDatasModel,
      });
    }
  },

  handleChangeDomain(event) {
    if (this.state.isImportBcMode !== true) {
      if (this.state.isCreationMode) {
        const currentValue = event.target.value;
        const currentProperty = this.state.propertyDatas;
        currentProperty.PropertyDomain = currentValue;
        this.setState({ propertyDatas: currentProperty });
      }
      if (this.state.isEditionMode) {
        const currentValue = event.target.value;
        const currentProperty = this.state.propertyDatas;
        const currentDatasModel = this.state.currentDataModel;
        currentDatasModel.PropertyDomainCode = currentValue;
        currentProperty.PropertyDomain = currentValue;
        this.setState({
          propertyDatas: currentProperty,
          currentDataModel: currentDatasModel,
        });
      }
    }
  },

  handleChangeUnit(event) {
    if (this.state.isImportBcMode !== true) {
      if (this.state.isCreationMode) {
        const currentValue = event.target.value;
        const currentProperty = this.state.propertyDatas;
        currentProperty.PropertyUnit = currentValue;
        this.setState({ propertyDatas: currentProperty });
      }
      if (this.state.isEditionMode) {
        const currentValue = event.target.value ?? 0;
        const currentProperty = this.state.propertyDatas;
        const currentDatasModel = this.state.currentDataModel;
        currentDatasModel.PropertyUnitCode = currentValue;
        currentProperty.PropertyUnit = currentValue;
        this.setState({
          propertyDatas: currentProperty,
          currentDataModel: currentDatasModel,
        });
      }
      this.chooseParameterTypeByDefault();
    }
  },

  handleChangeType(event) {
    if (this.state.isImportBcMode != true) {
      if (this.state.isCreationMode) {
        const currentValue = event.target.value;
        const currentProperty = this.state.propertyDatas;
        currentProperty.PropertyType = currentValue;
        this.setState({ propertyDatas: currentProperty });
      }
      if (this.state.isEditionMode) {
        const currentValue = event.target.value;
        const currentProperty = this.state.propertyDatas;
        const currentDatasModel = this.state.currentDataModel;
        currentDatasModel.PropertyDataTypeCode = currentValue;
        currentProperty.PropertyType = currentValue;
        this.setState({
          propertyDatas: currentProperty,
          currentDataModel: currentDatasModel,
        });
      }

      this.chooseParameterTypeByDefault();
    }
  },

  handleChangeEditType(event) {
    if (this.state.isImportBcMode != true) {
      if (this.state.isCreationMode) {
        const currentValue = event.target.value;
        const currentProperty = this.state.propertyDatas;
        currentProperty.PropertyEditType = currentValue;
        this.setState({ propertyDatas: currentProperty });
      }
      if (this.state.isEditionMode) {
        const currentValue = event.target.value;
        const currentProperty = this.state.propertyDatas;
        const currentDatasModel = this.state.currentDataModel;

        currentDatasModel.PropertyEditTypeCode = currentValue;
        currentProperty.PropertyEditType = currentValue;
        this.setState({
          propertyDatas: currentProperty,
          currentDataModel: currentDatasModel,
        });
        this.handleCheckEditTypeValues(currentDatasModel);
      }
    }
  },

  handleCheckEditTypeValues(currentDatasModel) {
    // check current values in each lang
    if (this.state.isImportBcMode !== true) {
      const currentsLangs = currentDatasModel && currentDatasModel.Translations;
      let editValuesCounter = 0;
      let continueToRead = true;
      let isEditTypeErrorValue = this.state.isEditTypeError;
      let countEmptyEditTypeValue = 0;
      let isEnoughtValue = true;

      if (
        currentsLangs !== null &&
        (currentDatasModel.PropertyEditTypeCode === 1 ||
          currentDatasModel.PropertyEditTypeCode === 2)
      ) {
        _.each(currentsLangs, (lang, i) => {
          if (continueToRead) {
            let editTypeValueLang =
              lang?.PropertyEditTypeValues
                ? (lang.PropertyEditTypeValues || '').split(';')
                : '';
            editTypeValueLang =
              editTypeValueLang && editTypeValueLang?.filter((elem) => elem.trim() !== '');
            if (!lang.PropertyEditTypeValues) {
              countEmptyEditTypeValue++;
            }
            if (editTypeValueLang?.length <= 1) {
              isEnoughtValue = false;
            }
            if (i === 0) {
              editValuesCounter = editTypeValueLang?.length;
            } else if (editValuesCounter !== editTypeValueLang?.length) {
              isEditTypeErrorValue = true;
              continueToRead = false;
            } else {
              isEditTypeErrorValue = false;
            }
          }
        });
        const isEditTypeEmptyError =
          countEmptyEditTypeValue === currentsLangs.length || !isEnoughtValue;
        this.setState({ isEditTypeEmptyError });
      } else {
        const editTypeValue = this.state.propertyDatas.PropertyEditTypeValues ? this.state.propertyDatas.PropertyEditTypeValues : '';
        const splitEditTypeValue = (editTypeValue) =>
          editTypeValue.split(';').filter((string) => string !== '');
        const editTypeValueArray =
          editTypeValue ? splitEditTypeValue(editTypeValue) : '';
        const isEnoughtTypeValue = editTypeValueArray.length < 2 && this.state.propertyDatas.PropertyEditType !== 3;
        this.setState({ isEditTypeEmptyError: isEnoughtTypeValue });
      }

      this.setState({
        isEditTypeError: isEditTypeErrorValue,
      });
    }
  },

  handleChangeEditTypeValue(event) {
    const currentValue = event.target.value;

    if (this.state.isImportBcMode !== true) {
      if (this.state.isCreationMode) {
        const currentProperty = this.state.propertyDatas;
        currentProperty.PropertyEditTypeValues = currentValue;
        this.setState({ propertyDatas: currentProperty });
        this.handleCheckEditTypeValues(this.state.currentDataModel);
      }

      if (this.state.isEditionMode) {
        // Recherche de la traduction à modifier
        const translationToUpdate = this.state.currentDataModel.Translations.find(
          (l) => l.TranslationLangCode === this.state.propertyDatas.PropertyLang
        );
        let updatedTranslations;

        // Création d'un nouvel objet "translation" avec la valeur modifié
        const updatedTranslation = { ...translationToUpdate, PropertyEditTypeValues: currentValue };
        // Création d'un nouveau tableau des "translations" avec la traduction modifié
        updatedTranslations = this.state.currentDataModel.Translations.map((translation) => {
          if (translation.TranslationLangCode === updatedTranslation.TranslationLangCode) {
            return updatedTranslation;
          }
          return translation;
        });
        // Création d'un nouvel objet "currentDataModel" avec le tableau des traductions modifié
        const updatedCurrentDataModel = {
          ...this.state.currentDataModel,
          Translations: updatedTranslations,
        };
        const updatedPropertyDatas = {
          ...this.state.propertyDatas,
          PropertyEditTypeValues: currentValue,
        };

        this.setState({
          propertyDatas: updatedPropertyDatas,
          currentDataModel: updatedCurrentDataModel,
          lastEditValue: currentValue,
        });

        this.handleCheckEditTypeValues(updatedCurrentDataModel);
      }
    }
  },

  handleChangeParameterType(event) {
    if (this.state.isImportBcMode !== true) {
      const currentValue = event.target.value;
      const currentProperty = this.state.propertyDatas;

      if (this.state.isCreationMode) {
        currentProperty.PropertyParameterType = currentValue;
        this.setState({ propertyDatas: currentProperty });
      }
      if (this.state.isEditionMode) {
        const currentDatasModel = this.state.currentDataModel;
        currentDatasModel.PropertyParameterType = currentValue;
        currentProperty.PropertyParameterType = currentValue;
        this.setState({
          propertyDatas: currentProperty,
          currentDataModel: currentDatasModel,
        });
      }
    }
  },

  handleChangeInformations(event) {
    if (this.state.isImportBcMode !== true) {
      if (this.state.isCreationMode) {
        const currentValue = event.target.value;
        const currentProperty = this.state.propertyDatas;
        currentProperty.PropertyInformations = currentValue;
        this.setState({ propertyDatas: currentProperty });
      }

      if (this.state.isEditionMode) {
        const currentValue = event.target.value;

        // Recherche de la traduction à modifier
        const translationToUpdate = this.state.currentDataModel.Translations.find(
          (l) => l.TranslationLangCode === this.state.propertyDatas.PropertyLang
        );
        let updatedTranslations;

        // Création d'un nouvel objet "translation" avec la valeur modifié
        const updatedTranslation = { ...translationToUpdate, PropertyInformations: currentValue };
        // Création d'un nouveau tableau des "translations" avec la traduction modifié
        updatedTranslations = this.state.currentDataModel.Translations.map((translation) => {
          if (translation.TranslationLangCode === updatedTranslation.TranslationLangCode) {
            return updatedTranslation;
          }
          return translation;
        });

        // Création d'un nouvel objet "currentDataModel" avec le tableau des traductions modifié
        const updatedCurrentDataModel = {
          ...this.state.currentDataModel,
          Translations: updatedTranslations,
        };
        const updatedPropertyDatas = {
          ...this.state.propertyDatas,
          PropertyInformations: currentValue,
        };

        this.setState({
          propertyDatas: updatedPropertyDatas,
          currentDataModel: updatedCurrentDataModel,
        });
      }
    }
  },

  handleChangeNature(nature) {
    if (this.state.isImportBcMode !== true) {
      const currentProperty = this.state.propertyDatas;

      if (this.state.isCreationMode) {
        currentProperty.Nature = nature;
        this.setState({ propertyDatas: currentProperty });
      }
      if (this.state.isEditionMode) {
        const currentDatasModel = this.state.currentDataModel;
        currentDatasModel.Nature = nature;
        currentProperty.Nature = nature;
        this.setState({
          propertyDatas: currentProperty,
          currentDataModel: currentDatasModel,
        });
      }
    }
  },

  chooseParameterTypeByDefault() {
    const self = this;
    const currentDatas = this.state.propertyDatas;
    if (
      currentDatas.PropertyParameterType === undefined ||
      currentDatas.PropertyParameterType === null ||
      currentDatas.PropertyParameterType === 0
    ) {
      if (currentDatas.PropertyUnit !== null || currentDatas.PropertyType !== null) {
        let propertyId = -1;
        if (
          currentDatas.PropertyId !== undefined &&
          currentDatas.PropertyId !== null &&
          currentDatas.PropertyId > 0
        ) {
          propertyId = currentDatas.PropertyId;
        }
        let unitId = -1;
        if (
          currentDatas.PropertyUnit !== undefined &&
          currentDatas.PropertyUnit != null &&
          currentDatas.PropertyUnit > 0
        ) {
          unitId = currentDatas.PropertyUnit;
        }
        let domainId = -1;
        if (
          currentDatas.PropertyDomain !== undefined &&
          currentDatas.PropertyDomain !== null &&
          currentDatas.PropertyDomain > 0
        ) {
          domainId = currentDatas.PropertyDomain;
        }
        let dataTypeId = -1;
        if (
          currentDatas.PropertyType !== undefined &&
          currentDatas.PropertyType !== null &&
          currentDatas.PropertyType > 0
        ) {
          dataTypeId = currentDatas.PropertyType;
        }

        const url = `${API_URL}/api/ws/v1/contentmanagement/${self.props.ManagementCloudId}/dictionary/property/${propertyId}/parameterType?token=${self.props.TemporaryToken}&unitId=${unitId}&domainId=${domainId}&dataTypeId=${dataTypeId}`;
        fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            if (response.status !== 200) {
              isOk = false;
            }
            return response.json();
          })
          .then((json) => {
            const currentValue = json.Id;
            const currentProperty = self.state.propertyDatas;

            if (self.state.isCreationMode) {
              currentProperty.PropertyParameterType = currentValue;
              self.setState({ propertyDatas: currentProperty });
            }
            if (self.state.isEditionMode) {
              const currentDatasModel = self.state.currentDataModel;
              currentDatasModel.PropertyParameterType = currentValue;
              currentProperty.PropertyParameterType = currentValue;
              self.setState({
                propertyDatas: currentProperty,
                currentDataModel: currentDatasModel,
              });
            }
          });
      }
    }
  },

  cancelAction() {
    const currentDatas = this.state.propertyDatas;
    if (this.props.CancelButtonAction != null) {
      this.props.CancelButtonAction(currentDatas);
    }
  },

  validateAction() {
    let isOk = true;

    // check name
    if (this.state.propertyDatas.PropertyName === '') {
      this.setState({ errorFieldPropertyName: true });
      isOk = false;
    } else {
      this.setState({ errorFieldPropertyName: false });
    }

    // check domain
    if (this.state.propertyDatas.PropertyDomain === 0) {
      this.setState({ errorFieldDomain: true });
      isOk = false;
    } else {
      this.setState({ errorFieldDomain: false });
    }

    // check edit type
    if (this.state.propertyDatas.PropertyEditType === 0) {
      this.setState({ errorFieldEditType: true });
      isOk = false;
    } else {
      this.setState({ errorFieldEditType: false });
    }

    // check parameter type
    if (this.state.propertyDatas.PropertyParameterType === 0) {
      this.setState({ errorFieldParameterType: true });
      isOk = false;
    } else {
      this.setState({ errorFieldParameterType: false });
    }

    // check data type
    if (this.state.propertyDatas.PropertyType === 0) {
      this.setState({ errorFieldDataType: true });
      isOk = false;
    } else {
      this.setState({ errorFieldDataType: false });
    }

    if (isOk) {
      const currentDatas = this.state.propertyDatas;
      if (currentDatas.PropertyDomain !== null && currentDatas.PropertyDomain > 0) {
        const propType = this._getDomainType(currentDatas.PropertyDomain);
        currentDatas.PropertyDomainType = propType;
      }

      if (this.state.isEditionMode) {
        this.checkNameValidity(true, this.state.currentDataModel);
      } else {
        this.checkNameValidity(false, currentDatas);
      }
    }
  },

  checkIfPropertyHasChanged() {
    const oldProperty = this.props.CurrentDataModel;
    const newProperty = this.state.currentDataModel;
    let propertyHasChanged = false;

    for (const [key, value] of Object.entries(oldProperty)) {
      if (key === 'Translations') {
        // Pour chaque traduction
        for (const oldTranslation of value) {
          const newTranslation = newProperty[key].find(
            (translation) => translation.TranslationLangCode === oldTranslation.TranslationLangCode
          );

          if (newTranslation === null || newTranslation === undefined) {
            propertyHasChanged = true;
          } else {
            for (const [translationKey, translationValue] of Object.entries(oldTranslation)) {
              newTranslation == null;
              if (newTranslation[translationKey] !== translationValue) {
                propertyHasChanged = true;
                break;
              }
            }
          }

          if (propertyHasChanged === true) {
            break;
          }
        }
      } else if (newProperty[key] !== value) {
        propertyHasChanged = true;
      }

      if (propertyHasChanged === true) {
        break;
      }
    }
    return propertyHasChanged;
  },

  // render elements
  render() {
    const self = this;
    let availableEditTypeValues;
    const currentDatas = self.state.propertyDatas;

    const ITEM_HEIGHT = 48;
    const SELECT_PROPS = {
      MenuProps: {
        disableEnforceFocus: true,
        disableAutoFocus: true,
        BackdropProps: {
          invisible: true,
        },
        style: {
          zIndex: 2100,
          maxHeight: ITEM_HEIGHT * 6.5 + 96,
        },
      },
    };

    /* Helper text */
    let helperTextPropertyName = self.props.Resources.UserPropertyPage.PropertyNameHelpText;
    let helperTextDescription = self.props.Resources.UserPropertyPage.PropertyDescriptionHelpText;
    if (self.state.errorFieldPropertyName) {
      helperTextPropertyName = self.props.Resources.UserPropertyPage.PropertyNameRequiredMessage;
    }
    if (self.state.errorFieldDescription) {
      helperTextDescription =
        self.props.Resources.UserPropertyPage.PropertyDescriptionRequiredMessage;
    }

    /* Liste des langues */
    let languageList = self.props.Languages.sort((a, b) => {
      let languageTradA = a.DefaultName;
      let languageTradB = b.DefaultName;

      if (a.Translations != null && a.Translations[self.props.Language] != null) {
        languageTradA = a.Translations[self.props.Language].toLowerCase();
      }

      if (b.Translations != null && b.Translations[self.props.Language] != null) {
        languageTradB = b.Translations[self.props.Language].toLowerCase();
      }

      if (languageTradA == null) {
        return 0;
      }

      return languageTradA.localeCompare(languageTradB);
    });

    if (languageList != null && languageList !== undefined) {
      languageList = _.map(languageList, (lang, i) => {
        if (lang.IsInterface) {
          let languageTrad = lang.DefaultName;

          if (lang.Translations[self.props.Language] != null) {
            languageTrad = lang.Translations[self.props.Language];
          }

          return (
            <MenuItem key={`lang-${lang.LanguageCode}`} value={lang.LanguageCode}>
              {languageTrad}
            </MenuItem>
          );
        }
      });
    }

    /* Liste des domains */
    const domainsList = _.map(self.props.Domains, (domain) => (
      <MenuItem key={`domain-${domain.DomainId}`} value={domain.DomainId}>
        {domain.DomainName}
      </MenuItem>
    ));

    /* Liste des unités */
    const unitsList = [];
    _.each(self.props.Units, (unit) => {
      unitsList.push(
        <StyledMenuItem key={`unit-${unit.Id}`} value={unit.Id}>
          {unit.FormatName}
        </StyledMenuItem>
      );
    });

    /* Liste des edit types */
    const editTypesList = _.map(self.props.EditTypes, (editType, i) => (
      <MenuItem key={`editype-${editType.Id}`} value={editType.Id}>
        {editType.Name}
      </MenuItem>
    ));

    if (self.state.propertyDatas.PropertyEditType > 0) {
      const editTypeSelected = _.find(
        self.props.EditTypes,
        (editType) => editType.Id === self.state.propertyDatas.PropertyEditType
      );

      if (editTypeSelected !== undefined && editTypeSelected.IsMultiple === true) {
        const currentEditValuesNumber = (
          self.state.propertyDatas.PropertyEditTypeValues || ''
        ).split(';').length;

        availableEditTypeValues = (
          <TextField
            label={`${self.props.Resources.UserPropertyPage.AvailableEditTypeValuesLabel} (${currentEditValuesNumber})`}
            helperText={self.props.Resources.UserPropertyPage.AvailableEditTypeValuesHelpText}
            multiline
            InputLabelProps={{
              shrink: true,
              className: 'label-for-multiline',
            }}
            rows="2"
            margin="normal"
            fullWidth
            placeholder="1;2;3"
            name="editTypeValue"
            value={self.state.propertyDatas.PropertyEditTypeValues}
            onChange={self.handleChangeEditTypeValue}
          />
        );
      }
    }

    /* Liste des parameter types */
    const parameterTypesList = _.map(self.props.ParameterTypes, (parameterType, i) => (
      <MenuItem key={`parameterType-${parameterType.Id}`} value={parameterType.Id}>
        {parameterType.Name}
      </MenuItem>
    ));

    /* Liste des data types */
    const dataTypesList = _.map(self.props.DataTypes, (dataType, i) => (
      <MenuItem key={`datatype-${dataType.Id}`} value={dataType.Id}>
        {dataType.Name}
      </MenuItem>
    ));

    let isDefaultLang;

    if (self.state.isEditionMode) {
      isDefaultLang = (
        <FormControlLabel
          control={
            <Checkbox
              checked={currentDatas.IsDefaultLang}
              onChange={self.handleChangeDefaultLang}
              checkedIcon={<CheckCircleIcon style={{ color: DisplayDesign.acidBlue }} />}
              icon={<RadioButtonUncheckedIcon style={{ color: DisplayDesign.acidBlue }} />}
            />
          }
          label={self.props.Resources.UserPropertyPage.IsDefaultTranslation}
          labelPlacement="end"
        />
      );
    }

    const langHelperText =
      self.state.isEditionMode && currentDatas.PropertyId > 0
        ? ''
        : self.props.Resources.UserPropertyPage.LanguageHelpText;

    const errorMessage =
      (self.state.isEditTypeError == true || self.state.isEditTypeEmptyError) &&
        (self.state.propertyDatas.PropertyEditType === 1 ||
          self.state.propertyDatas.PropertyEditType === 2) ? (
        <TypographyErrorCounter component="p">
          <ErrorIcon />{' '}
          {self.state.isEditTypeError
            ? self.props.Resources.ContentManagement.PropertiesEditTypeLangsErrorMessage
            : self.props.Resources.ContentManagement.PropertiesEditTypeLengthErrorMessage}
        </TypographyErrorCounter>
      ) : (
        ''
      );

    let cancelButton;
    if (self.props.IsReadOnly === false) {
      cancelButton = (
        <Button id="property-element-cancel-button" onClick={self.cancelAction}>
          {self.props.CancelButtonLabel}
        </Button>
      );
    }

    let validationButton;
    if (self.props.IsReadOnly === false) {
      validationButton =
        self.state.isEditTypeError === true || self.state.isEditTypeEmptyError ? (
          <Button variant="primary" disabled>
            {' '}
            {self.props.Resources.MetaResource.Confirm}{' '}
          </Button>
        ) : (
          <Button variant="primary" onClick={self.validateAction}>
            {' '}
            {self.props.Resources.MetaResource.Confirm}{' '}
          </Button>
        );
    }

    let commentRequest;
    if (self.props.IsPropRequest === true || self.props.IsRequestReplie === true) {
      const isEdit = self.props.IsPropRequest === true ? self.handleChangeComments : null;
      commentRequest = (
        <TextField
          label={self.props.Resources.ContentManagement.PropertyRequestComment}
          margin="normal"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={self.state.propertyDatas.RequestComments}
          onChange={isEdit}
        />
      );
    }

    let replieRequest;
    if (self.props.IsRequestReplie === true) {
      const isEdit = self.props.IsReadOnly !== true ? self.handleChangeResponse : null;
      replieRequest = (
        <TextField
          label={self.props.Resources.ContentManagement.PropertyRequestResponse}
          margin="normal"
          fullWidth
          InputLabelProps={{
            shrink: true,
            className: 'label-for-multiline',
          }}
          name="propertyName"
          value={self.state.propertyDatas.RequestResponse}
          onChange={isEdit}
        />
      );
    }

    return (
      <>
        <DialogTitle>{self.props.HeaderTitle}</DialogTitle>
        <DialogContent>
          <div>
            <TextField
              label={self.props.Resources.UserPropertyPage.PropertyNameLabel}
              helperText={helperTextPropertyName}
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true,
                className: 'label-for-multiline',
              }}
              name="propertyName"
              required
              error={self.state.errorFieldPropertyName}
              value={self.state.propertyDatas.PropertyName}
              onChange={self.handleChangeName}
            />

            <TextField
              label={self.props.Resources.UserPropertyPage.PropertyDescriptionLabel}
              helperText={helperTextDescription}
              multiline
              InputLabelProps={{
                shrink: true,
                className: 'label-for-multiline',
              }}
              rows="2"
              margin="normal"
              fullWidth
              name="description"
              value={self.state.propertyDatas.PropertyDescription}
              onChange={self.handleChangeDescription}
            />
            <TextField
              select
              value={self.state.propertyDatas.PropertyLang}
              label={self.props.Resources.UserPropertyPage.SelectLanguageLabel}
              helperText={langHelperText}
              margin="normal"
              fullWidth
              name="language"
              SelectProps={SELECT_PROPS}
              InputLabelProps={{
                shrink: true,
                className: 'label-for-multiline',
              }}
              onChange={self.handleChangeLang}
            >
              {languageList}
            </TextField>

            {isDefaultLang}

            <TextField
              select
              value={self.state.propertyDatas.PropertyDomain}
              label={self.props.Resources.UserPropertyPage.PropertyDomainLabel}
              helperText={self.props.Resources.UserPropertyPage.PropertyDomainHelpText}
              margin="normal"
              fullWidth
              required
              error={self.state.errorFieldDomain}
              name="domain"
              SelectProps={SELECT_PROPS}
              InputLabelProps={{
                shrink: true,
                className: 'label-for-multiline',
              }}
              onChange={self.handleChangeDomain}
            >
              {domainsList}
            </TextField>

            <TextField
              select
              value={self.state.propertyDatas.PropertyUnit}
              label={self.props.Resources.UserPropertyPage.PropertyUnitLabel}
              helperText={self.props.Resources.UserPropertyPage.PropertyUnitHelpText}
              margin="normal"
              fullWidth
              name="unit"
              SelectProps={SELECT_PROPS}
              InputLabelProps={{
                shrink: true,
                className: 'label-for-multiline',
              }}
              onChange={self.handleChangeUnit}
            >
              {unitsList}
            </TextField>

            <TextField
              select
              value={self.state.propertyDatas.PropertyType}
              label={self.props.Resources.UserPropertyPage.DataTypeLabel}
              helperText={self.props.Resources.UserPropertyPage.DataTypeHelpText}
              margin="normal"
              fullWidth
              required
              error={self.state.errorFieldDataType}
              name="dataType"
              SelectProps={SELECT_PROPS}
              InputLabelProps={{
                shrink: true,
                className: 'label-for-multiline',
              }}
              onChange={self.handleChangeType}
            >
              {dataTypesList}
            </TextField>

            <TextField
              select
              value={self.state.propertyDatas.PropertyEditType}
              label={self.props.Resources.UserPropertyPage.PropertyEditTypeLabel}
              helperText={self.props.Resources.UserPropertyPage.PropertyEditTypeHelpText}
              margin="normal"
              fullWidth
              name="editType"
              required
              error={self.state.errorFieldEditType}
              SelectProps={SELECT_PROPS}
              InputLabelProps={{
                shrink: true,
                className: 'label-for-multiline',
              }}
              onChange={self.handleChangeEditType}
            >
              {editTypesList}
            </TextField>

            {availableEditTypeValues}

            <TextField
              select
              value={self.state.propertyDatas.PropertyParameterType}
              label={self.props.Resources.UserPropertyPage.PropertyParameterTypeLabel}
              helperText={self.props.Resources.UserPropertyPage.PropertyParameterTypeHelpText}
              margin="normal"
              fullWidth
              name="parameterType"
              required
              error={self.state.errorFieldParameterType}
              SelectProps={SELECT_PROPS}
              InputLabelProps={{
                shrink: true,
                className: 'label-for-multiline',
              }}
              onChange={self.handleChangeParameterType}
            >
              {parameterTypesList}
            </TextField>

            <TextField
              label={self.props.Resources.UserPropertyPage.InformationLabel}
              helperText={self.props.Resources.UserPropertyPage.InformationHelpText}
              multiline
              InputLabelProps={{
                shrink: true,
                className: 'label-for-multiline',
              }}
              rows="2"
              margin="normal"
              fullWidth
              name="information"
              value={self.state.propertyDatas.PropertyInformations}
              onChange={self.handleChangeInformations}
            />

            <SelectNature
              value={self.state.propertyDatas.Nature}
              onChange={self.handleChangeNature}
              margin="normal"
            />

            {commentRequest}

            {replieRequest}
          </div>
          {errorMessage}
        </DialogContent>
        <DialogActions>
          {cancelButton}
          {validationButton}
        </DialogActions>
      </>
    );
  },
});

// #region styled
const StyledMenuItem = styled(MenuItem)({
  minHeight: '30px',
});
const TypographyErrorCounter = styled(Typography)({
  display: 'flex',
  marginTop: '16px !important',
  justifyContent: 'flex-end',
  alignItems: 'center',
  color: `${COLORS.ERROR} !important`,
  svg: {
    marginRight: '7px',
  },
});
// #endregion

export default PropertyElement;
