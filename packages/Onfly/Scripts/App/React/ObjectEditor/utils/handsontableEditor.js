import React from 'react';
import _ from 'underscore';
import LensIcon from '@material-ui/icons/Lens.js';
import Tipped from '../../../../tipped/tipped.js';

// material ui icons

export const propertyIdReference = 217; // Property id of property REFERENCE
export const propertyIdDesignationReference = 423; // Property id of property DESIGNATION_REFERENCE
export const propertyDomainIdIdentityData = 7; // Domain id Identity Data
const LICENSE_KEY = '57890-95731-8c101-e491d-c6234';

export var handsontableInstances = {};
export const container = '#content';

/**
 * Sort twos elements with content comparison
 *
 * class sortTabs
 * @param {object} a - first element to compare
 * @param {object} b - second element to compare
 * @returns {bool} boolean
 */
export function sortTabs(a, b) {
  if (parseInt(a.children[0].dataset.id) == propertyDomainIdIdentityData) {
    return -1;
  }
  return parseInt(a.children[0].dataset.id) > parseInt(b.children[0].dataset.id) ? 1 : -1;
}

/**
 * Move element with custom index in array
 *
 * class moveElementInArray
 * @param {array} array - container
 * @param {object} value - element
 * @param {int} newIndex - new index
 * @returns {array} reordered array
 */
export function moveElementInArray(array, value, newIndex) {
  const oldIndex = _.indexOf(array, value.toString());

  if (oldIndex > -1) {
    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex >= array.length) {
      newIndex = array.length;
    }

    const arrayClone = array.slice();
    arrayClone.splice(oldIndex, 1);
    arrayClone.splice(newIndex, 0, value);

    return arrayClone;
  }

  return array;
}

/**
 * Change column visibility in handsontable instance
 *
 * class reloadVisibility
 * @param {object} handsontableInstance - handsontable instances
 * @param {array} propertiesChange - settings properties change
 * @param {array} properties - properties of bimObject
 * @param {bool} isInEditor - if the instance in in edit mode
 */
export function reloadVisibility(handsontableInstance, propertiesChange, properties, isInEditor) {
  _.each(handsontableInstance, (hot, hotIndex, parent) => {
    const plugin = hot.getPlugin('hiddenColumns');

    _.each(hot.getSettings().columns, (column) => {
      _.each(propertiesChange, (change, index, parent) => {
        if (column.data != -1 && change.Id == column.propertyId) {
          const property = _.find(
            properties,
            (property) => property.PropertyId == column.propertyId
          );
          const indexCol = hot.propToCol(column.data);

          if (isInEditor) {
            if (property.Visibility) {
              if (plugin.isHidden(indexCol)) {
                plugin.showColumn(indexCol);
              }
            } else {
              plugin.hideColumn(indexCol);
            }
          } else if (property.PublicVisibility) {
            if (plugin.isHidden(indexCol)) {
              plugin.showColumn(indexCol);
            }
          } else {
            plugin.hideColumn(indexCol);
          }
        }
      });
    });
  });
}

/**
 * Change column order in handsontable instance
 *
 * class reOrderColumnsInHandsontable
 * @param {object} handsontableInstance - handsontable instances
 * @param {array} propertiesChange - settings properties change
 * @param {int} properties - properties of bimObject
 */
export function reOrderColumnsInHandsontable(handsontableInstance, propertiesChange, properties) {
  _.each(handsontableInstance, (hot, hotIndex, parent) => {
    const plugin = hot.getPlugin('manualColumnMove');

    _.each(hot.getSettings().columns, (column) => {
      _.each(propertiesChange, (change, index, parent) => {
        if (column.data != -1 && change.Id == column.propertyId) {
          const property = _.find(
            properties,
            (property) => property.PropertyId == column.propertyId
          );
          const indexCol = hot.propToCol(column.data);

          if (findHandsontableInstanceSettings(hot, 'domain_id') == propertyDomainIdIdentityData) {
            if (indexCol != property.Order && indexCol > 2) {
              plugin.moveColumn(indexCol, property.Order);
            }
          } else if (indexCol != property.Order + 2 && indexCol > 2) {
            plugin.moveColumn(indexCol, property.Order + 2);
          }
        }
      });
    });
  });
}

/**
 * Find handsontable instance vitwh argument or return current instance displayed
 *
 * class findHandsontableInstance
 * @param {string} container - container element
 * @param {object} handsontableInstance - handsontable instances
 * @param {string} languageCode - language code
 * @param {int} domainId - domain Id
 * @returns {object} handsontable instance
 */
export function findHandsontableInstance(container, handsontableInstance, languageCode, domainId) {
  const currentInstance =
    handsontableInstance[`#${$(`${container} > div:not(.inactive)`).attr('id')}`];

  if (languageCode !== undefined && domainId !== undefined) {
    return handsontableInstance[`#handsontable-${languageCode}-${domainId}`];
  }
  if (languageCode !== undefined) {
    return handsontableInstance[
      `#handsontable-${languageCode}-${findHandsontableInstanceSettings(
        currentInstance,
        'domain_id'
      )}`
    ];
  }
  if (domainId !== undefined) {
    return handsontableInstance[
      `#handsontable-${findHandsontableInstanceSettings(currentInstance, 'lang')}-${domainId}`
    ];
  }
  return currentInstance;
}

export function recoveryData(bimObject, languages) {
  // ------- RECOVERY DATAS ------- //
  // Reference & Designation values

  const variantsGroupByVariantId = _.groupBy(
    bimObject.VariantValues,
    (variantValue) => variantValue.VariantId
  );

  const variantsReference = _.object(
    _.map(variantsGroupByVariantId, (value, key, list) => {
      const property = _.filter(
        value,
        (variantValue) => variantValue.Property.Id == propertyIdReference
      )[0];

      return [key, property];
    })
  );

  const variantDesignation = _.object(
    _.map(variantsGroupByVariantId, (value, key, list) => {
      const property = _.filter(
        value,
        (variantValue) => variantValue.Property.Id == propertyIdDesignationReference
      )[0];

      return [key, property];
    })
  );

  const variantsGroupByDomainId = _.groupBy(
    bimObject.VariantValues,
    (variantValue) => variantValue.Domain.Id
  );

  // Create object with attributes languages
  const initialData = _.object(
    _.map(languages, (lang, langKey, parent) => {
      // Foreach language, create an object with each domain in the BimObject
      const langObject = _.object(
        _.map(variantsGroupByDomainId, (domain, domainKey, parent) => {
          // Group variants by domain
          const variants = _.groupBy(domain, (variantValue) => variantValue.VariantId);

          // Foreach domain, create an object with each variant in the BimObject
          const domainItem = _.object(
            _.map(variants, (variant, variantKey, parent) => {
              const variantObjectReference = new Object();

              // Take VARIANT_ID
              variantObjectReference[-1] = variantKey;

              // Take REFERENCE
              variantObjectReference[variantsReference[variantKey].Property.Id] =
                findVariantValueByLang(variantsReference[variantKey].Langs, lang.LanguageCode);

              // Take DESIGNATION REFERENCE
              variantObjectReference[variantDesignation[variantKey].Property.Id] =
                findVariantValueByLang(variantDesignation[variantKey].Langs, lang.LanguageCode);

              // Polyfill Object.assign not supported by IE
              if (typeof Object.assign !== 'function') {
                Object.assign = function (target, varArgs) {
                  // .length of function is 2
                  if (target === undefined) {
                    // TypeError if undefined or null
                    throw new TypeError('Cannot convert undefined or null to object');
                  }

                  const to = Object(target);

                  for (let index = 1; index < arguments.length; index++) {
                    const nextSource = arguments[index];

                    if (nextSource !== undefined) {
                      // Skip over if undefined or null
                      for (const nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                          to[nextKey] = nextSource[nextKey];
                        }
                      }
                    }
                  }
                  return to;
                };
              }

              // Foreach variant, create an array with the property name and the value
              const variantObject = Object.assign(
                variantObjectReference,
                _.object(
                  _.map(variant, (variantValue, propertyKey, parent) => {
                    if (propertyKey != -1) {
                      var value = findVariantValueByLang(variantValue.Langs, lang.LanguageCode);

                      const property = _.find(
                        bimObject.Properties,
                        (element) => element.PropertyId == variantValue.Property.Id
                      );

                      if (property !== undefined && property.DataTypeCode == 3) {
                        if (value == '' || value == '0') {
                          value = 'false';
                        } else if (value == '1') {
                          value = 'true';
                        }
                      }

                      return [variantValue.Property.Id, value];
                    }
                    return [-1, value];
                  })
                )
              );

              return [variantKey, variantObject];
            })
          );

          return [domainKey, domainItem];
        })
      );

      return [lang.LanguageCode, langObject];
    })
  );

  return initialData;
}

/**
 * Find value of variantValue by LanguageCode, if not return empty string
 *
 * class findVariantValueByLang
 * @param {array} langs - langs array
 * @param {string} languageCode - language code
 * @returns {string} value string
 */
export function findVariantValueByLang(langs, languageCode) {
  let value = '';

  if (langs !== undefined && langs.length > 0) {
    if (_.contains(_.pluck(langs, 'LanguageCode'), languageCode)) {
      value = _.find(langs, (lang) => languageCode == lang.LanguageCode).Value;
    }
  }

  return value;
}

/**
 * Return array with all values for a lang and a domain
 *
 * class returnDataArray
 * @param {array} datas - global datas array
 * @param {string} lang - language code
 * @param {object} domain - domain property
 * @returns {array} datas array
 */
export function returnDataArray(datas, lang, domain) {
  const dataLang = datas[lang];
  return _.values(dataLang[domain.Id]);
}

/**
 * Return array with all values for a lang and a domain
 *
 * class returnColumnParams
 * @param {array} arrayId - property id array
 * @param {array} properties - properties reference
 * @param {string} currentLangCulture - languageCodeCulture
 * @returns {array} datas array
 */
export function returnColumnParams(
  arrayId,
  properties,
  currentLangCulture,
  langEditor,
  initialData
) {
  arrayId = moveElementInArray(arrayId, -1, 0); // VARIANT_ID TO INDEX 0
  arrayId = moveElementInArray(arrayId, propertyIdReference, 1); // REFERENCE TO INDEX 1
  arrayId = moveElementInArray(arrayId, propertyIdDesignationReference, 2); // DESIGNATION REFERENCE TO INDEX 2

  const array = _.map(arrayId, (value, valueId, parent) => {
    const item = new Object();

    if (value != -1) {
      const findItem = _.find(properties, (element) => element.PropertyId == parseInt(value));

      if (findItem !== undefined) {
        item.readOnly = !findItem.IsEditable; // Read Only
        item.data = value.toString(); // Column parent

        switch (findItem.PropertyId) {
          case propertyIdReference:
            item.order = 1;
            item.width = 150;
            break;

          case propertyIdDesignationReference:
            item.order = 2;
            item.width = 300;
            break;

          default:
            item.order = findItem.Order + 2;
            break;
        }

        _.extend(
          item,
          returnHandsontableColumnAdditionalParameters(
            findItem,
            currentLangCulture,
            langEditor,
            initialData
          )
        ); // Additional parameters (type, format, source, ...)
      }
    } else {
      item.data = -1;
      item.order = 0;
      item.readOnly = true;
    }

    return item;
  });

  return _.sortBy(array, (element) => element.order);
}

/**
 * Return an array with property name for column header
 *
 * class returnColumnHeaders
 * @param {array} arrayId - int array with property id
 * @param {object} properties - properties in array
 * @returns {array} column header string
 */
export function returnColumnHeaders(arrayId, properties) {
  return _.map(arrayId, (value) => {
    const property = _.find(properties, (element) => element.PropertyId == parseInt(value, 10));

    if (property == undefined || value == -1) {
      return '';
    }
    return returnColumnHeader(property);
  });
}

export function returnColumnHeader(property) {
  if (property.Unit != null) {
    if (property.IsMandatory) {
      return `<span class='mandatory-asterisk'>*</span> ${property.Name} [${property.Unit.Symbole}]`;
    }
    return `${property.Name} [${property.Unit.Symbole}]`;
  }
  if (property.IsMandatory) {
    return `<span class='mandatory-asterisk'>*</span> ${property.Name}`;
  }
  return property.Name;
}

/**
 * Return an object with different attribute for cell configuration
 *
 * class returnHandsontableColumnAdditionalParameters
 * @param {object} property - property
 * @param {string} currentLangCulture - current language code culture
 * @returns {object} item
 */
export function returnHandsontableColumnAdditionalParameters(
  property,
  currentLangCulture,
  langEditor,
  initialData
) {
  const item = new Object();

  switch (property.EditTypeCode) {
    case 1: // Selection Unique
    case 2: // Selection Multiple
      item.type = 'dropdown';
      item.allowInvalid = true;

      var editValues = _.find(
        property.EditTypeValuesLangs,
        (value) => value.LanguageCode === langEditor
      );

      if (
        editValues != undefined &&
        editValues.EditTypeValues != undefined &&
        editValues.EditTypeValues.length > 0
      ) {
        let source = [''];
        source = source.concat(editValues.EditTypeValues.split(';'));

        item.source = source;
      } else {
        item.source = [];
      }

      break;
    case 3: // Saisie
      switch (property.DataTypeCode) {
        case 1: // Valeur numérique
          item.type = 'numeric';
          item.language = 'en-US';
          item.format = '0.00';

          if (
            property.MinControlValue != null &&
            property.MaxControlValue != null &&
            (property.MinControlValue != 0 || property.MaxControlValue != 0)
          ) {
            item.validator = function (value, callback) {
              // Si la valeur est comprise entre le min et le max
              if (value >= property.MinControlValue && value <= property.MaxControlValue) {
                callback(true);
              } else {
                callback(false);
              }
            };

            item.errorType = 'MinMaxControlValueError';
            item.MinControlValue = property.MinControlValue;
            item.MaxControlValue = property.MaxControlValue;
          }

          break;
        case 2: // Texte
          item.type = 'text';
          break;
        case 3: // Booléen
          item.type = 'checkbox';
          break;
        case 4: // Date et Heurez
          item.type = 'date';
          item.dateFormat = 'DD/MM/YYYY HH:mm:ss';
          item.correctFormat = true;
          break;
        case 5: // Chaine
          item.type = 'text';
          break;
        case 6: // Url
          item.type = 'text';
          item.renderer = 'html';
          break;
        case 7: // Entier
          item.type = 'numeric';
          item.language = 'en-US';
        default:
          item.type = 'text';
          break;
      }
      break;
    default:
      item.type = 'text';
      break;
  }

  item.propertyId = property.PropertyId;
  item.isMandatory = property.IsMandatory;

  // Valeur unique pour les références
  if (property.PropertyId == propertyIdReference) {
    item.validator = function (value, callback) {
      const ref = this.instance.getDataAtCol(this.col);
      ref.splice(this.row, 1);

      if (_.contains(ref, value) || !value) {
        callback(false);
      } else {
        callback(true);
      }
    };
  }

  return item;
}

/**
 * Return an array with custom domain object (id, name)
 *
 * class recoveryDomains
 * @param {array} properties - Properties
 * @returns {array} array with domains object
 */
export function recoveryDomains(properties) {
  // Take all domains
  const listDomains = _.chain(_.pluck(properties, 'Domain'))
    .groupBy((domain) => domain.Id)
    .map((value, key) => ({
      Id: _.first(value).Id,
      Name: _.first(value).Name,
    }))
    .value();

  // Place le domaine Données d'identification en première position :)
  listDomains.splice(
    0,
    0,
    listDomains.splice(
      _.findIndex(listDomains, (domain) => domain.Id == propertyDomainIdIdentityData),
      1
    )[0]
  );

  return listDomains;
}

/**
 * Return an object with custom properties object
 *
 * class recoveryProperties
 * @param {array} domains - Domains array
 * @param {array} properties - Properties array
 * @param {array} languages - Languages array
 * @returns {object} object with properties
 */
export function recoveryProperties(domains, properties, languages) {
  const object = _.object(
    _.map(languages, (lang, langIndex, parentLangs) => {
      const domainProperties = _.object(
        _.map(domains, (domain, domainIndex, parentDomains) => {
          const propertiesArray = _.map(
            _.filter(properties, (property) => property.Domain.Id == domain.Id),
            (property, propertyIndex, parentProperties) => ({
              Id: property.PropertyId,
              Name: property.Name,
              Unit: property.Unit,
              UnitList: property.UnitList,
              Order: property.Order,
              IsTraduisible: property.IsTraduisible,
              Visibility: property.Visibility,
              PublicVisibility: property.PublicVisibility,
              SmartDownload: property.SmartDownload,
              BimObjectPropertiesGroupVMList: property.BimObjectPropertiesGroupVMList,
              PropertiesGroupSelectedId: property.PropertiesGroupSelectedId,
              Description: property.Description,
            })
          );

          return [domain.Id, propertiesArray];
        })
      );

      return [lang.LanguageCode, domainProperties];
    })
  );

  return object;
}

export function customHeader(domains, properties, classHeaderHandsontable) {
  return function (col, TH) {
    function applyClass(elem, className) {
      if (!Handsontable.dom.hasClass(elem, className)) {
        Handsontable.dom.addClass(elem, className);
      }
    }

    const hot = this;
    let indexClass = _.indexOf(
      _.pluck(domains, 'Id'),
      parseInt(findHandsontableInstanceSettings(this, 'domain_id'))
    );

    if (indexClass >= classHeaderHandsontable.length) {
      indexClass %= classHeaderHandsontable.length;
    }

    const className = classHeaderHandsontable[indexClass];

    applyClass(TH, className);

    if (hot.colToProp(col) != '-1' && hot.colToProp(col) != null) {
      const property = _.find(
        properties,
        (property) => property.PropertyId == parseInt(hot.colToProp(col))
      );
      if (property != null) {
        let propertyDescription = property.Description;
        if (propertyDescription == null || propertyDescription == '') {
          propertyDescription = property.Information;
        }

        const tippedTH = Tipped.get(TH);

        if (tippedTH != null && tippedTH.tooltips != null && tippedTH.tooltips.length > 0) {
          if (tippedTH.tooltips[0].content != propertyDescription) {
            Tipped.remove(TH);
            Tipped.create(TH, propertyDescription, {
              hideOnClickOutside: true,
              hideOthers: true,
              behavior: 'hide',
            });
          }
        } else {
          Tipped.create(TH, propertyDescription, {
            hideOnClickOutside: true,
            hideOthers: true,
            behavior: 'hide',
          });
        }
      }
    }
  };
}

/**
 * Create handsontable instance
 *
 * class createHandsontableInstance
 * @param {string} mainContainer - container in html page
 * @param {object} domain - current domain
 * @param {array} properties - array of properties
 * @param {string} lang - language code of handsontable instance
 * @param {array} datas - array with all datas
 * @param {object} settings - settings of handsontable
 * @param {string} currentLang - current language code displayed
 * @param {boolean} isInEditor - if is in editor properties
 * @returns {string} domain_id or lang
 */
export function createHandsontableInstance(
  mainContainer,
  domain,
  properties,
  lang,
  datas,
  settings,
  currentLang,
  currentLangCulture,
  isInEditor,
  saveEnabled,
  handsontableInstance,
  initialData
) {
  const handsontableId = `handsontable-${lang.LanguageCode}-${domain.Id}`;

  $(mainContainer).append(`<div class='inactive' id='${handsontableId}'></div>`);
  const container = document.getElementById(handsontableId);
  const hotId = `#${handsontableId}`;

  let arrayId = [];

  if (datas.length > 0) {
    arrayId = Object.keys(_.first(datas));
  }

  // DATAS
  const columnParams = returnColumnParams(
    arrayId,
    properties,
    currentLangCulture,
    lang.LanguageCode,
    initialData
  );
  const columnHeaders = returnColumnHeaders(_.pluck(columnParams, 'data'), properties);

  settings.columns = columnParams; // Paramétrage des colonnes (types d'édition)
  settings.colHeaders = columnHeaders; // Entête de colonne, type de la colonne
  settings.data = datas; // Valeurs du tableau
  settings.licenseKey = LICENSE_KEY;

  // Masquage des colonnes
  const hiddenColumnIndex = [];

  _.each(columnParams, (column, colIndex, parent) => {
    if (column.data != -1) {
      const property = _.find(properties, (property) => property.PropertyId == column.propertyId);

      if (property == undefined) {
        hiddenColumnIndex.push(colIndex);
      } else if (isInEditor) {
        if (!property.Visibility) {
          hiddenColumnIndex.push(colIndex);
        }
      } else if (!property.PublicVisibility) {
        hiddenColumnIndex.push(colIndex);
      }
    } else {
      hiddenColumnIndex.push(colIndex);
    }
  });

  const hiddenColumns = {
    columns: hiddenColumnIndex,
    indicators: false, // Masquage des guides pour réafficher les colonnes
  };

  settings.hiddenColumns = hiddenColumns;

  const hot = new Handsontable(container, settings);
  handsontableInstances[hotId] = hot;

  return hot;
}

/**
 * Return handsonbtale setting domain_id or lang
 *
 * class findHandsontableInstanceSettings
 * @param {object} hot - handsontable instance
 * @param {string} type - setting string (type domain_id or lang)
 * @returns {string} domain_id or lang
 */
export function findHandsontableInstanceSettings(hot, type) {
  if (type == 'domain_id') {
    return hot.rootElement.id.split('-')[2];
  }
  if (type == 'lang') {
    return hot.rootElement.id.split('-')[1];
  }
}

/**
 * Compare two handsontables instance with id
 *
 * class compareHandsontableInstanceId
 * @param {object} hot - handsontable instance
 * @param {object} hot2 - handsontable instance
 * @returns {boolean} if it's same instance id
 */
export function compareHandsontableInstanceId(hot, hot2) {
  return hot.guid == hot2.guid;
}

/**
 * Change active tab domain and/or lang of handsontable instance
 *
 * class changeTab
 * @param {string} container - container
 * @param {object} handsontableInstance - handsontable instances
 * @param {string} lang - language code
 * @param {int} id - domain id
 */
export function changeTab(container, handsontableInstance, lang, id, saveEnabled) {
  const handsontables = $(container).children();
  const handsontableId = `#handsontable-${lang}-${id}`;

  _.each(handsontables, (handsontableDiv, index, parent) => {
    const idSelector = `#${handsontableDiv.id}`;

    $(idSelector).removeClass('inactive');

    if (idSelector != handsontableId) {
      $(idSelector).addClass('inactive');
    }
  });

  handsontableInstance[handsontableId].render();

  const scrollBarContainerHandsontable = $($(handsontableId).find('.wtHider')[0]);
  const scrollBarHandsontable = $($(handsontableId).find('.wtHolder')[0]);
  const size = scrollBarContainerHandsontable.css('width');
  $('.double-scroll-content').css('width', size);
  $('.double-scroll').scrollLeft(scrollBarHandsontable.scrollLeft());

  $('.double-scroll').off('scroll');
  $(handsontableId).find('.wtHolder').off('scroll');

  // add Event double scroll bar
  $('.double-scroll').on('scroll', function () {
    scrollBarHandsontable.scrollLeft($(this).scrollLeft());
  });

  scrollBarHandsontable.on('scroll', function () {
    $('.double-scroll').scrollLeft($(this).scrollLeft());
  });
}

/**
 * Refresh class css of tabs
 *
 * class refreshTab
 * @param {string} tabContainer - tab container
 * @param {array} classHeaderHandsontable - class css string array
 */
export function refreshTab(tabContainer, classHeaderHandsontable) {
  const tabs = $(tabContainer).find('a');
  const { length } = classHeaderHandsontable;

  _.each(tabs, (tab, tabIndex, parent) => {
    const lastClass = $(tab).attr('class').split(' ').pop();
    $(tab).removeClass(lastClass);

    let indexClass = tabIndex;

    if (indexClass >= length) {
      indexClass %= length;
    }

    $(tab).addClass(classHeaderHandsontable[indexClass]);
  });
}
