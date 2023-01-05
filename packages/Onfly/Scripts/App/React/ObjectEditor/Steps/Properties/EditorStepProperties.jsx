/* eslint-disable react/button-has-type */
/* eslint-disable react/prefer-es6-class */
import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';

import _ from 'underscore';
import toastr from 'toastr';
import '../../../../../jquery.tablednd.js';
import '../../../../../../Content/handsontable/handsontable.full.min.css';
import { Link } from 'react-router-dom';

// material ui icons
import LockIcon from '@material-ui/icons/Lock.js';
import RefreshIcon from '@material-ui/icons/Refresh.js';
import ClearIcon from '@material-ui/icons/Clear.js';
import * as handsontableEditor from '../../utils/handsontableEditor.js';
import store from '../../../../Store/Store';
import { API_URL } from '../../../../Api/constants';
import { redirectOptions } from './utils/redirectOptions';

let EditorStepProperties = createReactClass({
  getInitialState() {
    /**
     * STEP 1 - VARIABLES
     * STEP 2 - DATAS
     * STEP 3 - SAVE
     * STEP 4 - HANDSONTABLE SETTINGS
     * STEP 5 - ADD PROPERTIES
     * STEP 6 - PROPERTIES SETTINGS
     * STEP 7 - EVENTS CLICK OTHER BUTTON (add variant, display error, ...)
     * STEP 8 - DOCUMENT READY
     * */

    /** STEP 1 - VARIABLES * */
    // var bimObject = new bimandco.domain.bimObject({}, @Html.Raw(ViewBag.BimObject));
    // var languages = @Html.Raw(Json.Encode(ViewBag.Languages)); // All Languages
    // var properties = bimObject.Properties;
    let domains;
    let listProperties;
    let templateMustache;

    const self = this;

    // filtrage des langues selon les langues de l'objet
    const languageObject = _.filter(
      this.props.Languages,
      (lang) =>
        _.find(
          self.props.initialData.LanguagesAvailable,
          (lang_available) => lang.LanguageCode == lang_available
        ) != null
    );

    // set currentLanguage editor
    let currentLanguage = _.find(
      this.props.initialData.LanguagesAvailable,
      (lang_available) => self.props.Language == lang_available
    );
    if (currentLanguage == null) {
      currentLanguage = languageObject[0].LanguageCode;
    }

    return {
      classHeaderHandsontable: ['acid-blue', 'acid-green', 'light-blue', 'primary-green'],
      shouldSave: false,
      fixedColumnsLeft: 3,
      currentDomainId: -1,
      // VARIABLES USED FOR SAVE
      validDatas: true,
      errors: [],
      changeDatas: [],
      propertiesDeleted: false,
      checkedHandsontableInstance: 0,
      saveEnabled: true,
      // VARIABLES USED FOR SAVE PROPERTIES SETTINGS
      propertiesChange: [],
      // VARIABLES USED WHEN MOVE COLUMNS
      canMoveColumns: false,
      firstInstanceMove: true,
      currentLanguage,
      // DATA
      data: null,
      domains: [],
      properties: [],
      bimObjectClassificationNodesList: null,
      settings: null,
      languagesFiltered: languageObject,
      modelsVariant: [],
      initialData: [],
    };
  },

  getLocalization() {
    const Localizationobj = {};
    Localizationobj.pagergotopagestring = this.props.resources.GridMetaLabels.GoToPage;
    Localizationobj.pagershowrowsstring = this.props.resources.GridMetaLabels.ShowRows;
    Localizationobj.pagerrangestring = this.props.resources.GridMetaLabels.PageRangeString;
    Localizationobj.pagernextbuttonstring = this.props.resources.GridMetaLabels.NextBtnString;
    Localizationobj.pagerpreviousbuttonstring = this.props.resources.GridMetaLabels.PrevBtnString;
    Localizationobj.emptydatastring = this.props.resources.GridMetaLabels.NoDataToShow;
    Localizationobj.filterSearchString = this.props.resources.GridMetaLabels.Search;

    return Localizationobj;
  },

  componentWillMount() {
    toastr.options = {
      preventDuplicates: true,
      preventOpenDuplicates: true,
    };
    this.loadVariantsPropertiesData(this.props.Language);
    this.loadBimObjectClassificationNode(this.props.Language);
  },

  componentWillReceiveProps(nextProps) {
    if (
      this.props.isRevisionModalOpen !== nextProps.isRevisionModalOpen &&
      this.state.shouldSave === true
    ) {
      this.saveEditor();
    }

    if (nextProps.Language != this.props.Language || this.props == null) {
      this.setState(this.getInitialState());
      this.loadVariantsPropertiesData(nextProps.Language);
      this.loadBimObjectClassificationNode(nextProps.Language);
    }
  },

  loadBimObjectClassificationNode(language) {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/bimobject/${self.props.bimObjectId}/classification/node/list/${language}?token=${self.props.TemporaryToken}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        self.setState({ bimObjectClassificationNodesList: json });
      });
  },

  loadVariantsPropertiesData(language) {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/variantsproperties/list/${language}?token=${this.props.TemporaryToken}&contentmanagementId=${this.props.managementCloudId}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        self.prepareData(json);
      });
  },

  /** STEP 4 - HANDSONTABLE SETTINGS * */

  /**
   * Handler called before column moved
   *
   * class setBeforeColumnMove
   */
  setBeforeColumnMove() {
    const self = this;

    return function (columns, target) {
      if (
        columns[0] != target - 1 &&
        ((target < self.state.fixedColumnsLeft &&
          _.filter(columns, (value) => value < self.state.fixedColumnsLeft).length > 0) ||
          target < self.state.fixedColumnsLeft ||
          _.filter(columns, (value) => value < self.state.fixedColumnsLeft).length > 0)
      ) {
        toastr.clear();
        toastr.warning(self.props.resources[('EditPropertiesPage', 'RemoveRowLabel')]);
        return false;
      }
      if (self.state.firstInstanceMove) {
        self.setState({ canMoveColumns: true });
      } else {
        self.setState({ canMoveColumns: false });
      }
    };
  },

  /**
   * Handler called after column moved
   *
   * class setAfterColumnMove
   */
  setAfterColumnMove() {
    const self = this;

    return function (columns, target) {
      const hot = this;

      if (self.state.canMoveColumns && self.state.firstInstanceMove) {
        self.setState({ firstInstanceMove: false });

        const listHot = _.filter(
          handsontableEditor.handsontableInstances,
          (instance, index, parent) =>
            handsontableEditor.findHandsontableInstanceSettings(hot, 'domain_id') ==
              handsontableEditor.findHandsontableInstanceSettings(instance, 'domain_id') &&
            !handsontableEditor.compareHandsontableInstanceId(hot, instance)
        );

        _.each(listHot, (hotInstance, index, parent) => {
          const plugin = hotInstance.getPlugin('manualColumnMove');

          plugin.moveColumns(columns, target);
        });

        self.setState({ firstInstanceMove: true });
        self.setState({ canMoveColumns: false });
        self.refreshPropertiesOrder(hot, self.state.data.Properties);
        const listProperties = handsontableEditor.recoveryProperties(
          self.state.domains,
          self.state.data.Properties,
          self.state.languagesFiltered
        );
        self.setState({ properties: listProperties });
      }
      hot.render();
    };
  },

  /**
   * Refresh properties order with current handsontable column order
   *
   * class refreshPropertiesOrder
   * param {hot} object - handsontable instance
   * param {properties} array - properties array
   * param {domains} array - domains array
   */
  refreshPropertiesOrder(hot, properties, domains) {
    let different = 0;

    if (
      handsontableEditor.findHandsontableInstanceSettings(hot, 'domain_id') !=
      handsontableEditor.propertyDomainIdIdentityData
    ) {
      different = 2;
    }

    for (var i = 1 + different; i < hot.countCols(); i++) {
      const property = _.find(
        this.state.data.Properties,
        (property) => property.PropertyId == parseInt(hot.colToProp(i))
      );

      if (i - different != property.Order) {
        property.Order = i - different;
      }
    }
  },

  /**
   * Refresh visibility of all properties
   *
   */
  refreshPropertiesVisibility(hotInstance, properties) {
    const propertiesChange = [];

    _.each(properties, (propertie, index, parent) => {
      const propertyChange = {};

      propertyChange.Id = propertie.PropertyId;
      propertyChange.Attribute = 'Visibility';
      propertyChange.Value = propertie.Visibility;

      propertiesChange.push(propertyChange);
    });

    handsontableEditor.reloadVisibility(
      handsontableEditor.handsontableInstances,
      propertiesChange,
      properties,
      true
    );
    hotInstance.render();
  },

  readOnlyCellRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
  },

  prepareData(data) {
    const self = this;

    for (const hot in handsontableEditor.handsontableInstances) {
      handsontableEditor.handsontableInstances[hot].destroy();
      delete handsontableEditor.handsontableInstances[hot];
    }
    // handsontableEditor.handsontableInstances = {};

    const initialData = handsontableEditor.recoveryData(data, this.state.languagesFiltered);

    // Config domains
    const domains = handsontableEditor.recoveryDomains(data.Properties);

    // Config table with properties (units, order, visibility)
    const properties = handsontableEditor.recoveryProperties(
      domains,
      data.Properties,
      this.props.Languages
    );

    this.setState({
      data,
      domains,
      properties,
      initialData,
    });

    // Handsontable settings
    const settings = {
      fillHandle: {
        direction: 'vertical',
        autoInsertRow: false, // Empêche l'insertion automatique de ligne lors de la navigation
      },
      rowHeaders: true, // Affichage des entêtes de lignes
      allowInsertRow: true, // Empêche l'insertion de ligne
      allowInsertColumn: false, // Empêche l'insertion de colonne
      manualColumnMove: true, // Active le déplacement des colonnes
      manualColumnFreeze: true, // Active le blocage des colonnes
      manualColumnResize: true, // Active le redimensionnement des colonnes
      invalidCellClassName: 'invalidCell', // Définition de la classe css lorsqu'une cellule est invalide
      fixedColumnsLeft: this.state.fixedColumnsLeft, // Fixe les deux premières colonnes
      beforeColumnMove: this.setBeforeColumnMove(), // Définit la fonction appelée avant déplacement d'une colonne
      afterColumnMove: this.setAfterColumnMove(), // Définit la fonction appelée après déplacement d'une colonne
      cells(row, col, prop) {
        const cellProperties = {};
        const colSettings = this.instance.getSettings().columns[col];

        if (colSettings != undefined && colSettings.readOnly) {
          cellProperties.renderer = self.readOnlyCellRenderer;
        }

        return cellProperties;
      }, // Fonction pour définir les readOnly style
      stretchH: 'all', // Toutes les colonnes sont étendues à leur contenu
      preventOverflow: 'horizontal', // Affiche une scrollbar si le tableau dépasse la largeur du conteneur
      className: 'htMiddle',
      rowHeights: 30, // Hauteur de la ligne en pixel
      // Pas encore possible de faire cela, le tableau se redimensionne en 100% de son container
      /* colWidths: function(columnIndex) {
                if(columnIndex === 1 || columnIndex === 2) {
                    return "200";
                }
            } */
      // Clique droit dans le tableau
      contextMenu: {
        items: {
          remove_variant: {
            name: this.props.resources.EditPropertiesPage.RemoveRowLabel,
            disabled() {
              if (this.getSelected() != undefined) {
                const max = Math.max(this.getSelected()[2], this.getSelected()[0]);
                const min = Math.min(this.getSelected()[2], this.getSelected()[0]);

                // disable
                if (self.state.modelsVariant.length > 0) {
                  for (i = 0; i < self.state.modelsVariant.length; i++) {
                    const key = self.state.modelsVariant[i];
                    if (key.slice(0, 14) === 'checkbox_model') {
                      return true;
                    }
                  }
                }

                return max - min + 1 === this.countRows() || this.countRows() === 1;
              }
              return true;
            },
          },
          hide_property: {
            name: this.props.resources.EditPropertiesPage.HideProperty,
            disabled() {
              if (this.getSelected() != undefined) {
                const firstColumn = this.getSettings().columns[this.getSelected()[1]];

                if (this.getSelected()[1] == this.getSelected()[3]) {
                  return (
                    firstColumn.propertyId == handsontableEditor.propertyIdReference ||
                    firstColumn.propertyId == handsontableEditor.propertyIdDesignationReference
                  );
                }
                const secondColumn = this.getSettings().columns[this.getSelected()[3]];

                return (
                  firstColumn.propertyId == handsontableEditor.propertyIdReference ||
                  secondColumn.propertyId == handsontableEditor.propertyIdReference ||
                  firstColumn.propertyId == handsontableEditor.propertyIdDesignationReference ||
                  secondColumn.propertyId == handsontableEditor.propertyIdDesignationReference
                );
              }
              return true;
            },
          },
          duplicate_value: {
            name: this.props.resources.EditPropertiesPage.DuplicateValue,
          },
        },
        callback(key, options) {
          switch (key) {
            case 'remove_variant':
              var max = Math.max(options.start.row, options.end.row);
              var min = Math.min(options.start.row, options.end.row);
              var nbRowDeleted = max - min + 1;

              if (this.countRows() == nbRowDeleted) {
                toastr.warning(self.props.resources.EditPropertiesPage.CantRemoveLastSingleRow);
              } else {
                _.each(handsontableEditor.handsontableInstances, (hot, hotIndex, parent) => {
                  hot.alter('remove_row', min, nbRowDeleted);
                });
              }

              self.state.propertiesDeleted = true;

              break;

            case 'hide_property':
              var hotInstance = this;
              var max = Math.max(options.start.col, options.end.col);
              var min = Math.min(options.start.col, options.end.col);
              const currentPropertiesChange = [];

              for (var i = min; i <= max; i++);
              {
                const propertyChange = {};
                propertyChange.Id = this.getSettings().columns[i - 1].propertyId;
                propertyChange.Attribute = 'Visibility';
                propertyChange.Value = false;
                currentPropertiesChange.push(propertyChange);

                const currentPropsDisplay = self.state.data.Properties;
                _.find(currentPropsDisplay, (property) => {
                  if (property.PropertyId == propertyChange.Id) {
                    property.Visibility = propertyChange.Value;
                  }
                });
              }
              store.dispatch({ type: 'LOADER', state: true });

              fetch(
                `${API_URL}/api/ws/v1/bimobject/${self.props.bimObjectId}/properties/settings/update?token=${self.props.TemporaryToken}`,
                {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(currentPropertiesChange),
                }
              ).then((response) => {
                if (response.status == 200) {
                  listProperties = handsontableEditor.recoveryProperties(
                    self.state.domains,
                    self.state.data.Properties,
                    self.props.Languages
                  );
                  handsontableEditor.reloadVisibility(
                    handsontableEditor.handsontableInstances,
                    currentPropertiesChange,
                    self.state.data.Properties,
                    true
                  );
                  hotInstance.render();
                  hotInstance.view.wt.wtOverlays.adjustElementsSize(true);

                  self.setState({ propertiesChange: [], properties: listProperties });
                  store.dispatch({ type: 'LOADER', state: false });
                } else {
                  store.dispatch({ type: 'LOADER', state: false });
                  toastr.error(self.props.resources.EditPropertiesPage.SavedError);
                }
              });

              break;

            case 'duplicate_value':
              var currentHot = this;
              var currentHotDomainId = handsontableEditor.findHandsontableInstanceSettings(
                currentHot,
                'domain_id'
              );
              var currentHotLang = handsontableEditor.findHandsontableInstanceSettings(
                currentHot,
                'lang'
              );

              var maxCol = Math.max(options.start.col, options.end.col);
              var minCol = Math.min(options.start.col, options.end.col);
              var maxRow = Math.max(options.start.row, options.end.row);
              var minRow = Math.min(options.start.row, options.end.row);

              for (var i = minCol; i <= maxCol; i++) {
                for (var j = minRow; j <= maxRow; j++) {
                  var valueDuplicate = currentHot.getDataAtCell(j, i);

                  _.each(handsontableEditor.handsontableInstances, (hotInstance, index, parent) => {
                    if (
                      i < 3 ||
                      handsontableEditor.findHandsontableInstanceSettings(
                        hotInstance,
                        'domain_id'
                      ) == currentHotDomainId
                    ) {
                      hotInstance.setDataAtCell(j, i, valueDuplicate, 'customUpdate');
                    }
                  });
                }
              }

              break;
          }
        },
      },
    };

    // Affectation des couleurs des en-êtes de colonnes / Custom header color
    settings.afterGetColHeader = handsontableEditor.customHeader(
      domains,
      data.Properties,
      this.state.classHeaderHandsontable
    );

    let { currentDomainId } = self.state;

    // Création des onglets et des tableaux
    _.each(domains, (domain, domainKey, parent) => {
      currentDomainId = currentDomainId == -1 ? domain.Id : currentDomainId;

      _.each(self.state.languagesFiltered, (lang, langId, parent) => {
        const datas = handsontableEditor.returnDataArray(initialData, lang.LanguageCode, domain);

        const hot = handsontableEditor.createHandsontableInstance(
          handsontableEditor.container,
          domain,
          data.Properties,
          lang,
          datas,
          settings,
          self.state.currentLanguage,
          self.props.LanguageCulture,
          true,
          self.state.saveEnabled,
          self.state.handsontableInstances,
          self.props.initialData
        );
        self.addSettings(hot);
      });
    });

    // Set first tab active
    handsontableEditor.changeTab(
      handsontableEditor.container,
      handsontableEditor.handsontableInstances,
      self.state.currentLanguage,
      currentDomainId,
      self.state.saveEnabled
    );

    this.setState({ currentDomainId, settings });
  },

  addSettings(hot) {
    const self = this;

    if (self.state.saveEnabled) {
      // EVENT : afterChange
      hot.addHook(
        'afterChange',
        (changes, source) => {
          const isChanges = changes[0][3] !== changes[0][2];

          if (isChanges) {
            this.setState({ shouldSave: true });
            this.props.handleShouldOpenRevisionModal();
            this.setState({ shouldSave: false });
          }

          if (changes != undefined) {
            _.each(changes, (item, valueId, parent) => {
              const property = item[1];
              const lang = handsontableEditor.findHandsontableInstanceSettings(hot, 'lang');

              if (property != -1) {
                const variantId = hot.getDataAtRowProp(item[0], '-1');

                const element = `${lang}_${variantId}_${property}`;

                if (!_.contains(self.state.changeDatas, element)) {
                  const { changeDatas } = self.state;
                  changeDatas.push(element);
                  self.setState({ changeDatas });
                }
              }

              if (source != 'customUpdate') {
                const propertySelect = _.find(
                  self.state.data.Properties,
                  (property) => property.PropertyId == parseInt(item[1])
                );

                // mise a jour des properties de type selection
                if (
                  propertySelect != undefined &&
                  (propertySelect.EditTypeCode == 1 || propertySelect.EditTypeCode == 2)
                ) {
                  const previousValue = item[2];
                  const newValue = item[3];

                  const editValues = _.find(
                    propertySelect.EditTypeValuesLangs,
                    (value) => value.LanguageCode === lang
                  );
                  const indexRef = editValues.EditTypeValues.split(';').indexOf(newValue);

                  _.each(handsontableEditor.handsontableInstances, (hot, hotId, parent) => {
                    const lang = handsontableEditor.findHandsontableInstanceSettings(hot, 'lang');
                    const editValues = _.find(
                      propertySelect.EditTypeValuesLangs,
                      (value) => value.LanguageCode === lang
                    );

                    let newValueTranslated = '';

                    if (indexRef > -1) {
                      newValueTranslated = editValues.EditTypeValues.split(';')[indexRef];
                    }

                    hot.setDataAtRowProp(item[0], item[1], newValueTranslated, 'customUpdate'); // customUpdate empêche une boucle infinie sur l'event afterChange
                  });
                } else if (
                  item[1] != -1 &&
                  (propertySelect.PropertyId == handsontableEditor.propertyIdDesignationReference ||
                    (propertySelect.PropertyId == handsontableEditor.propertyIdReference &&
                      propertySelect.IsTraduisible))
                ) {
                  _.each(
                    _.filter(
                      handsontableEditor.handsontableInstances,
                      (instance, index, parent) =>
                        handsontableEditor.findHandsontableInstanceSettings(hot, 'lang') ==
                        handsontableEditor.findHandsontableInstanceSettings(instance, 'lang')
                    ),
                    (hot, hotId, parent) => {
                      hot.setDataAtRowProp(item[0], item[1], item[3], 'customUpdate'); // customUpdate empêche une boucle infinie sur l'event afterChange
                    }
                  );
                } else if (item[1] == -1 || !propertySelect.IsTraduisible) {
                  _.each(handsontableEditor.handsontableInstances, (hot, hotId, parent) => {
                    hot.setDataAtRowProp(item[0], item[1], item[3], 'customUpdate'); // customUpdate empêche une boucle infinie sur l'event afterChange
                  });
                }
              }
            });
          }
        },

        hot
      );

      hot.addHook('beforeAutofill', (start, end, data) => {
        // replace comma to dot =>
        const currentData = data[0].toString();
        if (currentData.match(/^\d+(,\d+)*$/) != null) {
          data[0] = [currentData.replace(',', '.')];
        }
      });

      // EVENT : afterCreateRow
      hot.addHook(
        'afterCreateRow',
        function (index, amount, source) {
          const hotInstance = this;

          if (source == undefined) {
            const listHot = _.filter(
              handsontableEditor.handsontableInstances,
              (hot) => !handsontableEditor.compareHandsontableInstanceId(hot, hotInstance)
            );
            const countCols = hotInstance.countRows();

            // GROSSE PERTE DE PERFORMANCE AVEC CETTE BOUCLE
            _.each(listHot, (hot, index, parent) => {
              hot.alter('insert_row', countCols, 1, 'alter');
            });
          } else if (source != 'customUpdate') {
            const { columns } = hot.getSettings();

            _.each(columns, (column, columnIndex, parent) => {
              if (column.data == '-1') {
                const datas = hotInstance.getDataAtProp('-1');
                const variantTmpId = _.min(datas) <= -1 ? _.min(datas) - 1 : -1;

                hot.setDataAtRowProp(index, '-1', variantTmpId, 'customUpdate');
              } else if (column.readOnly) {
                hotInstance.setDataAtRowProp(
                  index,
                  column.data,
                  hotInstance.getDataAtRowProp(0, column.data),
                  'customUpdate'
                );
              }
            });
          }
        },
        hot
      );

      // EVENT : afterValidate
      hot.addHook(
        'afterValidate',
        function (isValid, value, row, prop, source) {
          let { errors } = self.state;
          let columnType = '';

          switch (source) {
            case 'edit':
            case 'validateCells':
              var column = this.getSettings().columns[hot.propToCol(prop)];
              var domainId = handsontableEditor.findHandsontableInstanceSettings(hot, 'domain_id');

              columnType = column.type;

              if (
                ((column.propertyId == handsontableEditor.propertyIdReference ||
                  column.propertyId == handsontableEditor.propertyIdDesignationReference) &&
                  domainId == handsontableEditor.propertyDomainIdIdentityData) ||
                (column.propertyId != handsontableEditor.propertyIdReference &&
                  column.propertyId != handsontableEditor.propertyIdDesignationReference)
              ) {
                let domainError = _.find(errors, (error) => error.domainId == domainId);

                if (domainError != null && domainError.errors != null) {
                  // Suppression de l'erreur lié a la propriété
                  domainError.errors = domainError.errors.filter(
                    (error) => error.propertyId !== column.propertyId
                  );

                  if (domainError.errors.length == 0 && isValid) {
                    // S'il n'y a plus d'erreurs pour ce domain, il est retiré de la liste
                    errors = errors.filter((domainError) => domainError.domainId !== domainId);
                  }
                }

                if (!isValid) {
                  // Création de l'erreur
                  if (domainError === undefined) {
                    domainError = {};
                    domainError.domainId = domainId;
                    domainError.errors = [];
                    errors.push(domainError);
                  }

                  const error = {};
                  error.propertyId = column.propertyId;
                  error.propertyName = hot.getSettings().colHeaders[hot.propToCol(prop)];
                  error.lang = handsontableEditor.findHandsontableInstanceSettings(hot, 'lang');
                  error.value =
                    value === undefined || value == ''
                      ? self.props.resources.EditPropertiesPage.EmptyValue
                      : value;
                  error.type = column.type;
                  error.ref = hot.getDataAtRowProp(row, hot.colToProp(1));
                  error.row = row;

                  switch (column.errorType) {
                    case 'MinMaxControlValueError':
                      var errorMessage = '';

                      if (
                        column.MinControlValue != null &&
                        column.MaxControlValue != null &&
                        (column.MinControlValue != 0 || column.MaxControlValue != 0)
                      ) {
                        errorMessage =
                          self.props.resources.EditPropertiesPage.MinMaxControlValueError;

                        if (errorMessage != null) {
                          errorMessage = errorMessage.replace(
                            '[MinControlValue]',
                            `<strong>${column.MinControlValue}</strong>`
                          );
                          errorMessage = errorMessage.replace(
                            '[MaxControlValue]',
                            `<strong>${column.MaxControlValue}</strong>`
                          );
                        }
                      }

                      error.errorMessage = errorMessage;
                      break;
                    default:
                      error.errorMessage = '';
                  }

                  domainError.errors.push(error);
                }

                self.setState({ errors });
              }
              break;
          }

          if (source == 'edit' && columnType != 'dropdown') {
            // Mise a jour de la liste des message d'erreurs
            self.checkValidation(isValid, false, [hot].length, '', 1);
          }
        },
        hot
      );

      hot.addHook(
        'afterColumnResize',
        (currentColumn, newSize, isDoubleClick) => {
          const scrollBarContainerHandsontable = $($(`#${hot.rootElement.id}`).find('.wtHider')[0]);
          const scrollBarHandsontable = $($(`#${hot.rootElement.id}`).find('.wtHolder')[0]);
          const size = scrollBarContainerHandsontable.css('width');
          $('.double-scroll-content').css('width', size);
          $('.double-scroll').scrollLeft(scrollBarHandsontable.scrollLeft());
        },
        hot
      );
    }
  },

  changeLang(event) {
    const currentLang = event.target.value;

    handsontableEditor.changeTab(
      handsontableEditor.container,
      handsontableEditor.handsontableInstances,
      currentLang,
      this.state.currentDomainId
    );

    this.setState({ currentLang });
  },

  addVariant() {
    const currentHot = handsontableEditor.findHandsontableInstance(
      handsontableEditor.container,
      handsontableEditor.handsontableInstances
    );
    const listHot = _.filter(
      handsontableEditor.handsontableInstances,
      (hot) => !handsontableEditor.compareHandsontableInstanceId(hot, currentHot)
    );
    const countCols = currentHot.countRows();

    currentHot.alter('insert_row', countCols, 1, 'alter');
    currentHot.render();
    this.validateDatasAndSave(false, [currentHot]);

    // get previous choices and put them in temp value
    const modelsCheckeds = $('*[id^="checkbox_model#"]');
    const associatedModels = [];
    const joined = this.state.modelsVariant.slice();

    _.each(modelsCheckeds, (chk) => {
      if (chk.checked) {
        joined.push(`${chk.id}+${parseInt(countCols) + 1}`);
      }

      // clean des checkbox
      chk.checked = false;
    });
    this.setState({ modelsVariant: joined });

    // GROSSE PERTE DE PERFORMANCE AVEC CETTE BOUCLE
    _.each(listHot, (hot, index, parent) => {
      hot.alter('insert_row', countCols, 1, 'alter');
    });
  },

  validateDatasAndSave(save, handsontableInstances, redirectUrl) {
    this.setState({ validDatas: true, errors: [], shouldSave: false });
    let checkedHandsontableInstance = 1;
    const self = this;

    _.each(handsontableInstances, (hot, hotIndex, parent) => {
      hot.validateCells((valid) => {
        self.checkValidation(
          valid,
          save,
          handsontableInstances.length,
          redirectUrl,
          checkedHandsontableInstance
        );
        checkedHandsontableInstance++;
      });
    });
  },

  checkValidation(
    valid,
    save,
    handsontableInstanceCount,
    redirectUrl,
    checkedHandsontableInstance
  ) {
    if (!valid && this.state.validDatas === true) {
      this.setState({ validDatas: valid });
    }

    const { errors } = this.state;
    const { domains } = this.state;
    const properties = this.state.data.Properties;
    const self = this;

    if (checkedHandsontableInstance > handsontableInstanceCount) {
      checkedHandsontableInstance = 1;
    } else if (checkedHandsontableInstance == handsontableInstanceCount) {
      if (!this.state.validDatas && errors.length > 0) {
        if (save) {
          const stringError = this.props.resources.EditPropertiesPage.ValidationDataError;
          $('.save-properties').prop('disabled', false);
          toastr.clear();
          toastr.warning(stringError);
        }

        $('#errors').empty();
        let countError = 0;

        _.each(errors, (domainError) => {
          const masterElement = $('<ul></ul>');
          const findDomain = _.find(domains, (domain) => domain.Id == domainError.domainId);
          const liElement = $(`<li><div>${findDomain.Name}</div></li>`);
          const ulElement = $("<ul id='list'></ul>");

          const errorsByProperty = _.chain(domainError.errors)
            .groupBy('propertyId')
            .map((properties, propertyId) => {
              const langs = _.uniq(_.map(properties, (object) => object.lang));

              const rows = _.uniq(_.map(properties, (object) => object.row + 1));

              const errorMessage = _.uniq(
                _.map(properties, (object) =>
                  object.errorMessage != null ? object.errorMessage : ''
                )
              );

              const property = _.first(properties);

              return {
                property: {
                  propertyId,
                  propertyName: property.propertyName,
                  type: property.type,
                  value: property.value,
                },
                langs,
                rows,
                errorMessage,
              };
            })
            .value();

          _.each(errorsByProperty, (error) => {
            let errorMessage = '';

            if (error.errorMessage != null && error.errorMessage != '') {
              errorMessage = `<p class='errorMessage'>${error.errorMessage}</p>`;
            }

            var error = $(
              `<li>${self.props.resources.EditPropertiesPage.PropertyLabel} : ${
                error.property.propertyName
              } - ${self.props.resources.EditPropertiesPage.RowLabel} : ${error.rows.join('/')} - ${
                self.props.resources.EditPropertiesPage.ValueLabel
              } : ${error.property.value} (${error.property.type}) - <a data-link='${
                _.contains(error.langs, self.props.Language) ? self.props.Language : error.langs[0]
              }-${domainError.domainId}-${parseInt(error.rows[0]) - 1}-${
                error.property.propertyId
              }' class='see-error btn-third btn-red'>${
                self.props.resources.EditPropertiesPage.SeeError
              }</a>${errorMessage}</li>`
            );
            countError++;
            ulElement.append(error);
          });

          liElement.append(ulElement);
          masterElement.append(liElement);
          $('#errors').append(masterElement);

          $('.see-error').on('click', function () {
            const link = $(this).data('link');
            const currentDomainId = link.split('-')[1];
            const currentLang = link.split('-')[0];
            // $('#languages option[value="'+currentLang+'"]').prop('selected', true);
            self.setState({ currentDomainId, currentLanguage: currentLang });

            const hot = handsontableEditor.findHandsontableInstance(
              handsontableEditor.container,
              handsontableEditor.handsontableInstances,
              currentLang,
              currentDomainId
            );
            handsontableEditor.changeTab(
              handsontableEditor.container,
              handsontableEditor.handsontableInstances,
              currentLang,
              currentDomainId
            );

            $('.onglet').removeClass('active');
            $('#tabs').find(`[data-id='${currentDomainId}']`).addClass('active');
            hot.selectCell(
              parseInt(hot.propToCol(link.split('-')[2])),
              hot.propToCol(link.split('-')[3])
            );
          });
        });

        $('#title').html(`${self.props.resources.EditPropertiesPage.ErrorsList} (${countError})`);

        $('#errors')
          .find('li:has(ul)')
          .click(function (event) {
            if (this == event.target) {
              $(this).toggleClass('collapsed');
              $(this).children('ul').toggle('medium');
            }

            return false;
          })
          .addClass('expanded');

        $('#error').css('display', 'block');

        if ($('.content-error').css('display') != 'block') {
          $('.content-error').slideToggle('slow');
        }

        const toastrOptions = {
          timeOut: 0,
          extendedTimeOut: 0,
          closeButton: false,
          tapToDismiss: false,
          onclick: null,
        };

        if (redirectUrl && self.state.changeDatas.length > 0) {
          // a refaire
        } else if (save && self.state.changeDatas.length > 0) {
          // a refaire
        }
      } else if ((save && self.state.changeDatas.length > 0) || self.state.propertiesDeleted) {
        $('#error').css('display', 'none');
        self.saveData(redirectUrl);
      } else if (redirectUrl !== undefined && redirectUrl != '') {
        window.location = redirectUrl;
      } else {
        $('#error').css('display', 'none');
      }
    }
  },

  saveData(redirectUrl) {
    const self = this;

    toastr.clear();
    store.dispatch({ type: 'LOADER', state: true });

    const saveLoad = this.props.resources.EditPropertiesPage.SavingMessage;
    const toastrOptions = {
      timeOut: 0,
      extendedTimeOut: 0,
      closeButton: false,
      tapToDismiss: false,
      onclick: null,
    };

    toastr.info(saveLoad, '', toastrOptions);
    $('.mui-loader').removeClass('hidden');

    const dataSave = [];

    _.each(handsontableEditor.handsontableInstances, (hot, hotIndex, parent) => {
      const languageCode = handsontableEditor.findHandsontableInstanceSettings(hot, 'lang');
      const domainId = handsontableEditor.findHandsontableInstanceSettings(hot, 'domain_id');
      const dataArray = $.extend(true, {}, hot.getData());
      const schema = $.extend(true, {}, hot.getSettings()).columns;

      if (domainId != handsontableEditor.propertyDomainIdIdentityData) {
        schema.splice(0, 3);
      } else {
        schema.splice(0, 1);
      }

      _.each(dataArray, (row, rowIndex, rowParent) => {
        const variantId = _.first(row.splice(0, 1)); // VariantId
        let variantObject = _.find(dataSave, (variant) => variant.variantId == variantId);
        let newVariant = true;

        if (variantObject == null || variantObject == undefined) {
          variantObject = new Object();
          variantObject.variantId = variantId;
          variantObject.isChanged = true;
        } else {
          newVariant = false;
          const hasChange =
            _.filter(self.state.changeDatas, (value) => value.split('_')[1] == variantId).length >
            0;
          variantObject.isChanged = hasChange != undefined ? hasChange : true;
        }

        if (variantId < 0) {
          const rownum = parseInt(rowIndex) + 1;
          const models = self.state.modelsVariant;

          const modelsIds = [];

          _.each(models, (mod) => {
            if (parseInt(mod.split('+')[2]) == rownum) {
              const id = mod.split('#')[1];
              const details = `${id.split('+')[0]}+${id.split('+')[1]}`;
              modelsIds.push(details);
            }
          });

          variantObject.modelsIds = modelsIds.join();
        }

        if (domainId != handsontableEditor.propertyDomainIdIdentityData) {
          row.splice(0, 2); // Suppression de la reference et de sa désignation si le domain n'est pas "Identify Data"
        }

        _.each(row, (value, valueId, parentValue) => {
          let propertyObject = _.find(
            variantObject.properties,
            (property) => property.propertyId == schema[valueId].propertyId
          );
          const langObject = new Object();
          let newProperty = true;

          if (propertyObject == null || propertyObject == undefined) {
            propertyObject = new Object();
            propertyObject.isChanged = true;
          } else {
            propertyObject.isChanged = true;
            newProperty = false;
          }

          if (variantId < 0) {
            propertyObject.isChanged = true;
            langObject.isChanged = true;
          } else {
            const propchanged =
              _.filter(
                self.state.changeDatas,
                (value) =>
                  `${value.split('_')[1]}_${value.split('_')[2]}` ==
                  `${variantId}_${schema[valueId].propertyId}`
              ).length > 0;
            propertyObject.isChanged = propchanged != undefined ? propchanged : true;

            const langchanged =
              _.filter(
                self.state.changeDatas,
                (value) => value == `${languageCode}_${variantId}_${schema[valueId].propertyId}`
              ).length > 0;
            langObject.isChanged = langchanged != undefined ? langchanged : true;
          }

          propertyObject.propertyId = schema[valueId].propertyId;

          langObject.languageCode = languageCode;
          langObject.value = value == null ? '' : value;

          if (propertyObject.langs == null) {
            propertyObject.langs = [];
          }

          propertyObject.langs.push(langObject);

          if (variantObject.properties == null || variantObject.properties == undefined) {
            variantObject.properties = [];
          }

          if (newProperty) {
            variantObject.properties.push(propertyObject);
          }
        });

        if (newVariant) {
          dataSave.push(variantObject);
        }
      });
    });

    fetch(
      `${API_URL}/api/ws/v1/bimobject/${self.props.bimObjectId}/properties/update/${self.state.currentLanguage}?token=${self.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataSave),
      }
    ).then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          const variantsGroupByVariantId = _.groupBy(
            data.VariantValues,
            (variantValue) => variantValue.VariantId
          );

          // AFFECTATION DES NOUVEAUX VARIANT_ID
          _.each(variantsGroupByVariantId, (variantGroup, variantGroupId, parent) => {
            const reference = _.find(
              variantGroup,
              (variantValue) => variantValue.Property.Id == handsontableEditor.propertyIdReference
            );

            const hot = _.first(_.values(handsontableEditor.handsontableInstances));
            const refArray = hot.getDataAtProp('217');

            const rowIndex = refArray.indexOf(_.first(reference.Langs).Value);
            const variantIdProp = hot.getDataAtRowProp(rowIndex, '-1');

            if (variantIdProp == -1) {
              hot.setDataAtRowProp(rowIndex, '-1', variantGroupId);
            }
          });
          // ----------------------------------//

          self.setState({ changeDatas: [], propertiesDeleted: false, modelsVariant: [] });
          $('.save-properties').prop('disabled', false);
          $('.mui-loader').addClass('hidden');
          store.dispatch({ type: 'LOADER', state: false });
          toastr.clear();
          toastr.success(self.props.resources.EditPropertiesPage.SavedSuccessfully);

          if (redirectUrl) {
            window.location = redirectUrl;
          }
        });
      } else {
        $('.save-properties').prop('disabled', false);
        $('.mui-loader').addClass('hidden');
        store.dispatch({ type: 'LOADER', state: false });
        toastr.clear();
        toastr.error(self.props.resources.EditPropertiesPage.SavedError);
      }
    });
  },

  saveSettings(propertiesChange) {
    const self = this;

    store.dispatch({ type: 'LOADER', state: true });

    let responseStatus;

    const domainChangeList = [];

    _.each(propertiesChange, (propertyChange, index, parent) => {
      const property = _.find(
        self.state.data.Properties,
        (property) => property.PropertyId == propertyChange.Id
      );

      if (property != null) {
        // Modification de tous les domaines lors d'un changement sur les propriétés Référence (217) ou Désignation (423)
        if (
          property.PropertyId == handsontableEditor.propertyIdReference ||
          property.PropertyId == handsontableEditor.propertyIdDesignationReference
        ) {
          _.each(self.state.domains, (domain, index, parent) => {
            if (_.find(domainChangeList, (domainId) => domainId == domain.Id) == null) {
              domainChangeList.push(domain.Id);
            }
          });
        } else if (_.find(domainChangeList, (domainId) => domainId == property.Domain.Id) == null) {
          domainChangeList.push(property.Domain.Id);
        }
      }
    });

    fetch(
      `${API_URL}/api/ws/v1/bimobject/${self.props.bimObjectId}/properties/settings/update?token=${self.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertiesChange),
      }
    )
      .then((response) => {
        responseStatus = response.status;
        return response.json();
      })
      .then((data) => {
        if (responseStatus == 200) {
          let currentHot;

          if (data.length > 0) {
            const listProperties = handsontableEditor.recoveryProperties(
              self.state.domains,
              self.state.data.Properties,
              self.state.languagesFiltered
            );
            self.setState({ properties: listProperties });

            // Actualise l'affichage des domains modifiés
            _.each(domainChangeList, (domainId, index, parent) => {
              currentHot = handsontableEditor.findHandsontableInstance(
                handsontableEditor.container,
                handsontableEditor.handsontableInstances,
                self.state.currentLanguage,
                domainId
              );

              const settings = currentHot.getSettings();
              const columnsArray = settings.columns;
              const lang = handsontableEditor.findHandsontableInstanceSettings(currentHot, 'lang');
              var colHeadersArray = currentHot.getSettings().colHeaders;

              // Affectation de l'ordre des propriété du domain en cours
              _.each(self.state.data.Properties, (property, index, parent) => {
                if (property.Domain.Id == domainId) {
                  const bopVMFind = _.find(data, (bopVM) => bopVM.Id == property.Id);
                  if (bopVMFind != null) {
                    property.Order = bopVMFind.Value;
                  }

                  const item = _.find(
                    columnsArray,
                    (value, i) => value.data == property.PropertyId.toString()
                  );
                  item.readOnly = !property.IsEditable; // Read Only
                  _.extend(
                    item,
                    handsontableEditor.returnHandsontableColumnAdditionalParameters(
                      property,
                      self.props.LanguageCulture,
                      lang
                    )
                  );
                }
              });

              var colHeadersArray = handsontableEditor.returnColumnHeaders(
                _.pluck(columnsArray, 'data')
              );
              settings.colHeaders = colHeadersArray;
              currentHot.updateSettings(settings);
            });
          }

          currentHot = handsontableEditor.findHandsontableInstance(
            handsontableEditor.container,
            handsontableEditor.handsontableInstances
          );

          handsontableEditor.reloadVisibility(
            handsontableEditor.handsontableInstances,
            propertiesChange,
            self.state.data.Properties,
            true
          );
          handsontableEditor.reOrderColumnsInHandsontable(
            handsontableEditor.handsontableInstances,
            propertiesChange,
            self.state.data.Properties
          );

          self.setState({ propertiesChange: [] });

          store.dispatch({ type: 'LOADER', state: false });

          toastr.success(self.props.resources.EditPropertiesPage.SavedSuccessfully);

          currentHot.render();
        } else {
          store.dispatch({ type: 'LOADER', state: false });
          toastr.error(self.props.resources.EditPropertiesPage.SavedError);
        }
      });
  },

  selectDomain(event) {
    const currentDomainId = event.target.dataset.id;

    handsontableEditor.changeTab(
      handsontableEditor.container,
      handsontableEditor.handsontableInstances,
      this.state.currentLanguage,
      currentDomainId
    );

    this.setState({ currentDomainId });
  },

  saveEditor() {
    this.validateDatasAndSave(true, _.values(handsontableEditor.handsontableInstances));
    this.setState({
      shouldSave: false,
    });
  },

  render() {
    const self = this;

    // select langs
    const language_options = _.map(this.state.languagesFiltered, (lang, i) => (
      <option value={lang.LanguageCode} key={i}>
        {lang.Translations[self.props.Language]}
      </option>
    ));

    // select domains
    const domains_tab = _.map(this.state.domains, (domain, domainKey, parent) => {
      let className = domain.Id == self.state.currentDomainId ? 'onglet active' : 'onglet';

      let indexClass = domainKey;

      if (indexClass >= self.state.classHeaderHandsontable.length) {
        indexClass %= self.state.classHeaderHandsontable.length;
      }

      className = `${className} ${self.state.classHeaderHandsontable[indexClass]}`;

      return (
        <li key={domain.Id}>
          <a
            id={`tab-${domainKey}`}
            data-id={domain.Id}
            className={className}
            onClick={self.selectDomain}
          >
            {domain.Name}
          </a>
        </li>
      );
    });

    let selectModels;
    const isModels =
      this.state.data != null &&
      (this.state.data.Viewable3DModels.length > 0 || this.state.data.Viewable2DModels.length > 0);

    if (isModels) {
      selectModels = (
        <SelectModels
          resources={this.props.resources}
          getLocalization={this.getLocalization}
          TemporaryToken={this.props.TemporaryToken}
          language={this.props.Language}
          bimObjectId={this.props.bimObjectId}
          bimObjectProperties={this.state.data != null ? this.state.data.Properties : []}
          container={handsontableEditor.container}
          domains={this.state.domains}
          bimObjectClassificationNodesList={this.state.bimObjectClassificationNodesList}
          currentDomainId={this.state.currentDomainId}
          datasObject={this.state.data}
          addVariant={this.addVariant}
        />
      );
    }

    const modalToOpen = isModels ? null : this.addVariant;
    const dataTarget = isModels ? '#choice-models-modal' : '';

    let classOverlay = 'overlay';
    if (this.props.permissions.bimobject_variants || this.props.permissions.bimobject_properties) {
      classOverlay += ' hidden';
    }

    let manageProperties;
    if (this.props.Settings.EnableDictionary) {
      manageProperties = (
        <Link
          to={`/${this.props.Language}/bimobject/${this.props.bimObjectId}/edit/properties/manager`}
          className="btn-second btn-blue btn-picto-edit"
        >
          {this.props.resources.EditPropertiesPage.ManageProperties}
        </Link>
      );
    }

    const handleClickSave = () => {
      this.saveEditor();
      this.props.OpenRevisionModal(redirectOptions.Save);
      this.setState({ shouldSave: false });
    };

    const SaveButton = () => (
      <button className="btn-first btn-green save-properties" onClick={handleClickSave}>
        <RefreshIcon className="hidden mui-loader" />
        {this.props.resources.EditPropertiesPage.SaveChangesBtn}
      </button>
    );

    const isPropertyPage = () => window.location.pathname.includes('properties');

    // save onclick on all 'a' and 'button' in the page
    if (this.state.shouldSave) {
      $('button')
        .unbind()
        .on('click', () => {
          isPropertyPage() && this.saveEditor();
        });

      $('a:not(#add-variant,.onglet)')
        .unbind()
        .on('click', () => {
          isPropertyPage() && this.saveEditor();
        });
    }

    return (
      <div>
        <div className="container-fluid">
          <div className="panel edit-properties edit-object">
            <div className="col-xs-15">
              <h3>{this.props.resources.EditPropertiesPage.BlockTitle}</h3>
              <div className="clear" />
            </div>
            <div className="col-xs-7 col-xs-offset-1">
              <div className="save-button-container">
                <SaveButton />
              </div>
            </div>
            <div className="col-xs-23">
              <select
                id="languages"
                defaultValue={this.state.currentLanguage}
                onChange={this.changeLang}
                data-cy="langues"
              >
                {language_options}
              </select>

              <div className="container-table-editor">
                <nav className="navigation">
                  <ul id="tabs" className="tabs nav nav-tabs">
                    {domains_tab}
                  </ul>
                </nav>

                <div className="double-scroll">
                  <div className="double-scroll-content" />
                </div>
                <section id="content" />

                <section id="error">
                  <div id="title-error" className="title-block">
                    <a id="title" href="React/ObjectEditor/Steps/Properties/EditorStepProperties#">
                      Liste des conflits
                    </a>
                  </div>
                  <div className="content-error">
                    <ul id="errors" />
                  </div>
                </section>
              </div>
              <div className="container-btn-action-editor">
                <a
                  className="btn-second btn-blue btn-picto-plus"
                  id="add-variant"
                  data-toggle="modal"
                  data-target={dataTarget}
                  onClick={modalToOpen}
                >
                  {this.props.resources.EditPropertiesPage.AddRow}
                </a>
                {manageProperties}
                <a
                  className="btn-second btn-blue btn-picto-cogs"
                  data-toggle="modal"
                  data-target="#settings-property-modal"
                >
                  {this.props.resources.EditPropertiesPage.SettingsProperties}
                </a>
              </div>
            </div>
            <div className="col-xs-23">
              <SaveButton />
            </div>
            <div className="clear" />
            <div className={classOverlay}>
              <p className="disabled-text">
                <LockIcon />
              </p>
            </div>
          </div>
        </div>
        {selectModels}
        <ParameterProperties
          resources={this.props.resources}
          currentLanguage={this.state.currentLanguage}
          properties={this.state.properties}
          bimObjectProperties={this.state.data != null ? this.state.data.Properties : []}
          domains={this.state.domains}
          currentDomainId={this.state.currentDomainId}
          saveSettings={this.saveSettings}
          classHeaderHandsontable={this.state.classHeaderHandsontable}
          TemporaryToken={this.props.TemporaryToken}
          languageCode={this.props.Language}
        />
      </div>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    resources: appState.Resources[appState.Language],
    ready: typeof appState.Resources[appState.Language] !== 'undefined',
    entityType: appState.EntityType,
    entityId: appState.EntityId,
    managementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    RoleKey: appState.RoleKey,
    Languages: appState.Languages,
    Language: appState.Language,
    LanguageCulture: appState.LanguageCulture,
  };
};

export default EditorStepProperties = connect(mapStateToProps)(EditorStepProperties);

const ParameterProperties = createReactClass({
  getInitialState() {
    return {
      currentDomainId: this.props.currentDomainId,
      propertiesChange: [],
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentDomainId != -1) {
      this.state.currentDomainId = nextProps.currentDomainId;
    }
  },

  componentDidUpdate() {
    const self = this;

    $('#table-body-settings').tableDnD({
      onDragClass: 'dragClass',
      onDrop(table, rowMoved) {
        _.each($(table).find('tr'), (row, index, parent) => {
          $(row)
            .find('span.order')
            .text(index + 1);

          const rowElement = $(row)[0];

          let propertyId;
          let attribute;
          let value;

          propertyId = $(row).find('span.order').data('id');
          attribute = $(row).find('span.order').data('attribute');
          value = $(row).find('span.order').text();

          const propertyChange = {};
          propertyChange.Id = propertyId;
          propertyChange.Attribute = attribute;
          propertyChange.Value = value;

          const { propertiesChange } = self.state;

          propertiesChange.push(propertyChange);

          self.setState({ propertiesChange });
        });
      },
    });
  },

  selectDomain(event) {
    const { id } = event.target.dataset;
    this.setState({ currentDomainId: id });
  },

  changeProperties(event) {
    let propertyId;
    let attribute;
    let value;

    if ($(event.target).is('select')) {
      const option = $(event.target.options[event.target.selectedIndex]);
      propertyId = $(option).data('id');
      attribute = $(option).data('attribute');
      value = $(option).val();
    } else if ($(event.target).attr('type') == 'checkbox') {
      propertyId = $(event.target).data('id');
      attribute = $(event.target).data('attribute');
      value = $(event.target).is(':checked');
    }

    const { propertiesChange } = this.state;

    const propertyChange = {};
    propertyChange.Id = propertyId;
    propertyChange.Attribute = attribute;
    propertyChange.Value = value;

    const propertyChangeIndex = _.findIndex(propertiesChange, {
      Id: propertyId,
      Attribute: attribute,
    });

    if (propertyChangeIndex > -1) {
      propertiesChange[propertyChangeIndex] = propertyChange;
    } else {
      propertiesChange.push(propertyChange);
    }
    this.setState({ propertiesChange });
  },

  saveSettings() {
    const self = this;

    const { propertiesChange } = self.state;

    _.each(propertiesChange, (propertyChange, index, parent) => {
      const property = _.find(
        self.props.bimObjectProperties,
        (property) => property.PropertyId == propertyChange.Id
      );

      switch (propertyChange.Attribute) {
        case 'Unit':
          var newUnit = _.find(
            property.UnitList,
            (unit) => unit.Id == parseInt(propertyChange.Value)
          );
          property.Unit = newUnit;
          property.DefaultUnit = `${newUnit.Name} (${newUnit.Symbole})`;
          break;
        case 'IsTraduisible':
          property.IsTraduisible = propertyChange.Value;
          break;
        case 'Visibility':
          property.Visibility = propertyChange.Value;
          break;
        case 'Order':
          property.Order = parseInt(propertyChange.Value);
          break;
        case 'PublicVisibility':
          property.PublicVisibility = propertyChange.Value;
          break;
        case 'SmartDownload':
          property.SmartDownload = propertyChange.Value;
          break;
      }
    });

    self.props.saveSettings(propertiesChange);
    self.setState({ propertiesChange: [] });
  },

  render() {
    if (this.props.currentDomainId == -1) {
      return null;
    }

    const self = this;

    const domainList = self.props.properties[self.props.currentLanguage];

    const tab = [];
    const tabDomains = [];

    _.each(domainList, (properties, domainIndex, parentDomain) => {
      const currentDomain = _.find(
        self.props.domains,
        (domainItem) => domainItem.Id == domainIndex
      );

      // onglets
      let className = currentDomain.Id == self.state.currentDomainId ? 'onglet current' : 'onglet';

      let indexClass = domainIndex;
      if (indexClass >= self.props.classHeaderHandsontable.length) {
        indexClass = domainIndex % self.props.classHeaderHandsontable.length;
      }
      className += ` ${self.props.classHeaderHandsontable[indexClass]}`;

      if (currentDomain.Id == handsontableEditor.propertyDomainIdIdentityData.toString()) {
        tabDomains.unshift(
          <li key={currentDomain.Id}>
            <a data-id={currentDomain.Id} className={className} onClick={self.selectDomain}>
              {currentDomain.Name}
            </a>
          </li>
        );
      } else {
        tabDomains.push(
          <li key={currentDomain.Id}>
            <a data-id={currentDomain.Id} className={className} onClick={self.selectDomain}>
              {currentDomain.Name}
            </a>
          </li>
        );
      }

      // tableau
      if (domainIndex == self.state.currentDomainId) {
        _.each(
          _.sortBy(properties, (property) => property.Order),
          (property, propertyIndex, parentProperties) => {
            // Récupération des changements en cours sur la propriété
            const propertiesChange = _.where(self.state.propertiesChange, { Id: property.Id });

            if (propertiesChange.length > 0) {
              _.each(propertiesChange, (propertyChange, index, parent) => {
                switch (propertyChange.Attribute) {
                  case 'Unit':
                    var newUnit = _.find(
                      property.UnitList,
                      (unit) => unit.Id == parseInt(propertyChange.Value)
                    );
                    property.Unit = newUnit;
                    property.DefaultUnit = `${newUnit.Name} (${newUnit.Symbole})`;
                    break;
                  case 'IsTraduisible':
                    property.IsTraduisible = propertyChange.Value;
                    break;
                  case 'Visibility':
                    property.Visibility = propertyChange.Value;
                    break;
                  case 'Order':
                    property.Order = parseInt(propertyChange.Value);
                    break;
                  case 'PublicVisibility':
                    property.PublicVisibility = propertyChange.Value;
                    break;
                  case 'SmartDownload':
                    property.SmartDownload = propertyChange.Value;
                    break;
                }
              });
            }

            // Unit
            let options;

            if (property.UnitList != null && property.UnitList.length > 1) {
              const optionsSelect = [];

              _.each(property.UnitList, (unit, unitIndex, unitList) => {
                optionsSelect.push(
                  <option
                    key={`unit-${unit.Id}`}
                    data-attribute="Unit"
                    data-id={property.Id}
                    value={unit.Id}
                  >{`${unit.Name} (${unit.Symbole})`}</option>
                );
              });

              options = <select defaultValue={property.Unit.Id}>{optionsSelect}</select>;
            } else if (property.Unit != null) {
              options = `${property.Unit.Name} (${property.Unit.Symbole})`;
            } else {
              options = '-';
            }

            let className = '';

            if (
              property.Id == handsontableEditor.propertyIdReference ||
              property.Id == handsontableEditor.propertyIdDesignationReference
            ) {
              className = 'nodrop nodrag';
            }

            let inputSmartDownload = (
              <input
                data-attribute="SmartDownload"
                data-id={property.Id}
                type="checkbox"
                defaultChecked={property.SmartDownload}
              />
            );
            if (
              property.Id == handsontableEditor.propertyIdReference ||
              property.Id == handsontableEditor.propertyIdDesignationReference
            ) {
              inputSmartDownload = (
                <input
                  data-attribute="SmartDownload"
                  type="checkbox"
                  defaultChecked={property.SmartDownload}
                  disabled
                />
              );
            }

            let inputPublicVisibility = (
              <input
                data-attribute="PublicVisibility"
                data-id={property.Id}
                type="checkbox"
                defaultChecked={property.PublicVisibility}
              />
            );
            if (
              property.Id == handsontableEditor.propertyIdReference ||
              property.Id == handsontableEditor.propertyIdDesignationReference
            ) {
              inputPublicVisibility = (
                <input
                  data-attribute="PublicVisibility"
                  type="checkbox"
                  defaultChecked={property.PublicVisibility}
                  disabled
                />
              );
            }

            let inputVisibility = (
              <input
                data-attribute="Visibility"
                data-id={property.Id}
                type="checkbox"
                defaultChecked={property.Visibility}
              />
            );
            if (
              property.Id == handsontableEditor.propertyIdReference ||
              property.Id == handsontableEditor.propertyIdDesignationReference
            ) {
              inputVisibility = (
                <input
                  data-attribute="Visibility"
                  type="checkbox"
                  defaultChecked={property.Visibility}
                  disabled
                />
              );
            }

            const inputTraduisible = (
              <input
                data-attribute="IsTraduisible"
                data-id={property.Id}
                type="checkbox"
                defaultChecked={property.IsTraduisible}
              />
            );

            tab.push(
              <tr id={property.Id} className={className} key={property.Id}>
                <td>
                  <span className="order" data-attribute="Order" data-id={property.Id}>
                    {property.Order}
                  </span>
                </td>
                <td>{property.Name}</td>
                <td>{options}</td>
                <td>{inputTraduisible}</td>
                <td>{inputVisibility}</td>
                <td>{inputPublicVisibility}</td>
                <td>{inputSmartDownload}</td>
              </tr>
            );
          }
        );
      }
    });

    return (
      <div
        className="modal fade"
        id="settings-property-modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
        data-backdrop="static"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <ClearIcon />
              </button>
              <h3 className="modal-title" id="myModalLabel">
                {this.props.resources.EditPropertiesPage.BlockTitle}
              </h3>
            </div>

            <div className="modal-body">
              <ul className="easyPaginateNav nav nav-tabs">{tabDomains}</ul>
              <div
                id="list-properties"
                className="easyPaginateList"
                onChange={self.changeProperties}
              >
                <div className="paginate-properties">
                  <table className="modal-table-properties">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{this.props.resources.EditPropertiesPage.PropertyNameLabel}</th>
                        <th>{this.props.resources.EditPropertiesPage.UnitLabel}</th>
                        <th>{this.props.resources.EditPropertiesPage.IsTraduisibleLabel}</th>
                        <th>{this.props.resources.EditPropertiesPage.VisibilityLabel}</th>
                        <th>{this.props.resources.EditPropertiesPage.PublicVisibilityLabel}</th>
                        <th>{this.props.resources.EditPropertiesPage.SmartDownloadLabel}</th>
                      </tr>
                    </thead>
                    <tbody id="table-body-settings">{tab}</tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                data-dismiss="modal"
                id="save-properties-settings"
                className="btn-second btn-green"
                onClick={this.saveSettings}
              >
                {this.props.resources.EditPropertiesPage.BtnValidate}
              </button>
              <button type="button" data-dismiss="modal" className="btn-second btn-grey">
                {this.props.resources.EditPropertiesPage.CloseBtnLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

const SelectModels = createReactClass({
  render() {
    const that = this;

    const models = [];

    if (that.props.datasObject != null) {
      // 2d
      _.each(that.props.datasObject.Viewable2DModels, (data) => {
        const inputId = `checkbox_model#${data.Id}+2D`;

        models.push(
          <tr key={`2d-model-${data.Id}`}>
            <td>2D</td>
            <td>{data.Name}</td>
            <td>{data.SoftwareDisplay}</td>
            <td>{data.LevelOfDetail}</td>
            <td>
              <input type="checkbox" name="checkbox" id={inputId} />
            </td>
          </tr>
        );
      });

      // 3d
      _.each(that.props.datasObject.Viewable3DModels, (data) => {
        const inputId = `checkbox_model#${data.Id}+3D`;
        models.push(
          <tr key={`3d-model-${data.Id}`}>
            <td>3D</td>
            <td>{data.Name}</td>
            <td>{data.SoftwareDisplay}</td>
            <td>{data.LevelOfDetail}</td>
            <td>
              <input type="checkbox" name="checkbox" id={inputId} />
            </td>
          </tr>
        );
      });
    }

    return (
      <div
        className="modal modal-wide fade in"
        id="choice-models-modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" style={{ width: '60%' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="myModalLabel">
                {that.props.resources.EditModelsPage.BlockTitle}
              </h4>
            </div>
            <div className="modal-body">
              <label>{that.props.resources.EditionPagesWizard.Models}</label>

              <table className="table table-striped" id="bimobject-models-table">
                <thead>
                  <tr>
                    <th>{that.props.resources.BimObjectDetailsDocuments.TypeLabel}</th>
                    <th>{that.props.resources.BimObjectDetails.PropertiesTableNameLabel}</th>
                    <th>{that.props.resources.BimObjectDetailsModels.SoftwareLabel}</th>
                    <th>{that.props.resources.SearchResults.LodFilterTitle}</th>
                    <th>#</th>
                  </tr>
                </thead>
                <tbody id="bimobject-models-choices">{models}</tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-second btn-grey close-upload-model"
                data-dismiss="modal"
                id="close-models-modal"
              >
                {that.props.resources.EditPropertiesPage.CloseBtnLabel}
              </button>
              <button
                type="button"
                className="btn-second btn-blue upload-model"
                data-dismiss="modal"
                id="add-variant"
                onClick={that.props.addVariant}
              >
                {that.props.resources.EditPropertiesPage.BtnValidate}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
