import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';

import _ from 'underscore';
import toastr from 'toastr';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import Typography from '@material-ui/core/Typography';
import store from '../../../Store/Store';
import { API_URL } from '../../../Api/constants';
import * as QWebChannelUtils from '../../../Utils/qwebchannelUtils.js';

const PROPERTY_DESIGNATION = 'Official_423';
const PADDING_BOTTOM = 130;

let SmartDownload = createReactClass({
  getInitialState() {
    return {
      data: null,
      allPropertiesSelected: false,
      step: 1,
      smproperties: [],
      smvariantshow: [],
      smvariants: [],
      update: false,
      scrollHorizontal: 0,
      scrollVertical: 0,
    };
  },

  componentDidMount() {
    this.loadPropertiesList();

    window.addEventListener('resize', this.resizeSmartDownload);
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeSmartDownload);
  },

  componentDidUpdate(prevProps, prevState) {
    const self = this;

    this.state.update = false;

    this.resizeSmartDownload(false);

    // Si l'étape a changé
    if (this.state.step != prevState.step) {
      this.scrollToCurrentStep(true);
    }

    if (prevProps.Language != this.props.Language) {
      this.refreshTablePropertiesSelect();
    }
  },

  refreshTablePropertiesSelect() {
    const self = this;
    const objSource = {
      datatype: 'json',
      datafields: [
        { name: 'ItemId', type: 'string' },
        { name: 'ParentId', type: 'string' },
        { name: 'TreeId', type: 'string' },
        { name: 'Id', type: 'int' },
        { name: 'PropertyId', type: 'int' },
        { name: 'Name', type: 'string' },
        { name: 'Domain', type: 'string' },
        { name: 'DomainId', type: 'int' },
        { name: 'Type', type: 'string' },
        { name: 'Unit', type: 'string' },
        { name: 'EditType', type: 'string' },
        { name: 'IsGroup', type: 'bool' },
        { name: 'PropertiesGroupFilter', type: 'string' },
        { name: 'PropertiesGroupIdFilter', type: 'string' },
        { name: 'Subsets', type: 'array' },
      ],
      hierarchy: {
        keyDataField: { name: 'ItemId' },
        parentDataField: { name: 'ParentId' },
      },
      id: 'TreeId',
      url: `${API_URL}/api/ws/v3/onfly/${this.props.ManagementCloudId}/bimobjects/${this.props.bimobjectId}/properties/grids/all/${this.props.Language}?token=${this.props.TemporaryToken}`,
    };
    const divId = `#detail-pdt-${this.props.bimobjectId}`;

    const dataAdapter = new $.jqx.dataAdapter(objSource, {
      loadComplete() {
        if ($(`${divId} #bimobject-properties-smart`).length > 0) {
          const rows = _.find(
            $(`${divId} #bimobject-properties-smart`).jqxTreeGrid('getRows'),
            (item) => item.Id == 7
          );
          if (rows != undefined) {
            const item = _.find(rows.records, (item) => item.ItemId == 'OFFICIAL_PROPERTY_217');
            if (item != undefined) {
              self.state.update = true;
              $(`${divId} #bimobject-properties-smart`).jqxTreeGrid('checkRow', item.ItemId);
              self.state.update = false;
            }
          }
          $(`${divId} #bimobject-properties-smart`)
            .jqxTreeGrid('getRows')
            .flatMap((x) => x.records)
            .forEach((item) => {
              if (item.Subsets.find((x) => self.props.selectedSubsets.has(x.Id))) {
                $(`${divId} #bimobject-properties-smart`).jqxTreeGrid('checkRow', item.ItemId);
              }
            });
        }
      },
    });

    $(`${divId} #bimobject-properties-smart`).jqxTreeGrid('destroy');
    $(`${divId} #bimobject-properties-smart`).jqxTreeGrid({
      width: '100%',
      height: '300px',
      filterMode: 'simple',
      selectionMode: 'custom',
      source: dataAdapter,
      altRows: false,
      sortable: false,
      pageable: false,
      checkboxes: true,
      filterable: true,
      enableHover: true,
      hierarchicalCheckboxes: true,
      localization: self.getLocalization(),
      columns: [
        {
          text: self.props.resources.BimObjectDetails.PropertiesTableDomainLabel,
          dataField: 'Domain',
          cellClassName: 'jqx-custom-cell',
          renderer(text, align, height) {
            if (self.state.allPropertiesSelected) {
              return `<div class="jqx-custom-header jqx-custom-header-properties"><div class="jqx-checkbox-header"><span class="jqx-tree-grid-checkbox jqx-tree-grid-indent jqx-checkbox-default jqx-fill-state-normal jqx-rc-all"><div class="jqx-tree-grid-checkbox-tick jqx-checkbox-check-checked"></div></span>${text}</div></div>`;
            }
            return `<div class="jqx-custom-header jqx-custom-header-properties"><div class="jqx-checkbox-header"><span class="jqx-tree-grid-checkbox jqx-tree-grid-indent jqx-checkbox-default jqx-fill-state-normal jqx-rc-all jqx-checkbox-all"></span>${text}</div></div>";`;
          },
        },
        { text: 'PropertiesGroupIdFilter', datafield: 'PropertiesGroupIdFilter', hidden: true },
        { text: 'PropertiesGroupFilter', datafield: 'PropertiesGroupFilter', hidden: true },
        {
          text: self.props.resources.BimObjectDetails.PropertiesTableNameLabel,
          dataField: 'Name',
          cellClassName: 'jqx-custom-cell',
          renderer(text, align, height) {
            return `<div class='jqx-custom-header'>${text}</div>`;
          },
          cellsrenderer(rowKey, dataField, value, data) {
            if (data.IsGroup) {
              return '';
            }
            return value;
          },
        },
        {
          text: self.props.resources.BimObjectDetails.PropertiesTableUnitLabel,
          dataField: 'Unit',
          cellClassName: 'jqx-custom-cell',
          renderer(text, align, height) {
            return `<div class='jqx-custom-header'>${text}</div>`;
          },
        },
        { text: 'IsGroup', dataField: 'IsGroup', hidden: true },
        { text: 'Type', dataField: 'Type', hidden: true },
        { text: 'Id', dataField: 'Id', hidden: true },
        { text: 'TreeId', dataField: 'TreeId', hidden: true },
      ],
    });

    $(`${divId} #bimobject-properties-smart`).on('click', '.jqx-checkbox-header', () => {
      switch (!self.state.allPropertiesSelected) {
        case true:
          var rows = $(`${divId} #bimobject-properties-smart`).jqxTreeGrid('getRows');
          rows.forEach((item) => {
            $(`${divId} #bimobject-properties-smart`).jqxTreeGrid('checkRow', item.ItemId);
          });

          self.selectAllPropertiesState('checked');

          break;

        case false:
          var rows = $(`${divId} #bimobject-properties-smart`).jqxTreeGrid('getRows');
          rows.forEach((item) => {
            if (item.ItemId != 'OFFICIAL_PROPERTY_217') {
              $(`${divId} #bimobject-properties-smart`).jqxTreeGrid('uncheckRow', item.ItemId);
            }
          });

          self.selectAllPropertiesState('unchecked');

          break;
      }

      $(
        $(`${divId} #bimobject-properties-smart #filterbimobject-properties-smart`).children()[0]
      ).css('margin-top', '0px');
    });

    $(`${divId} #bimobject-properties-smart`).on('rowCheck', (event) => {
      const { args } = event;
      const { row } = args;

      if (row.IsGroup == false) {
        const { smproperties } = self.state;
        const { smvariantshow } = self.state;

        if (_.find(smproperties, (item) => item.TreeId == row.TreeId) == undefined) {
          const property = { Property: `${row.Type}_${row.PropertyId}`, Name: row.Name };

          if (property.Property == PROPERTY_DESIGNATION) {
            // Insert designation
            smvariantshow.splice(1, 0, property);
          } else {
            smvariantshow.push(property);
          }

          smproperties.push({
            Type: row.Type,
            Id: row.Id,
            TreeId: row.TreeId,
            PropertyId: row.PropertyId,
          });

          self.setState({ smvariantshow, smproperties });

          self.selectAllPropertiesState(self.determineAllPropertiesState());
        }
      }
    });

    $(`${divId} #bimobject-properties-smart`).on('rowUncheck', (event) => {
      const { args } = event;
      const { row } = args;

      if (row.IsGroup == false) {
        if (row.PropertyId == 217) {
          setTimeout(() => {
            $(`${divId} #bimobject-properties-smart`).jqxTreeGrid('checkRow', row.ItemId);
          }, 1);
        } else {
          let { smproperties } = self.state;
          let { smvariantshow } = self.state;

          const variant = `${row.Type}_${row.PropertyId}`;
          smvariantshow = smvariantshow.filter((sm) => sm.Property != variant);
          const temp = smproperties.filter((item) => item.TreeId !== row.TreeId);
          smproperties = temp;

          self.setState({ smvariantshow, smproperties });

          self.selectAllPropertiesState(self.determineAllPropertiesState());
        }
      }
    });

    $(document).find("span[id^='jqxWidget']").hide();
  },

  selectAllPropertiesState(state) {
    const self = this;

    switch (state) {
      case 'checked':
        self.setState({ allPropertiesSelected: true });
        $('#bimobject-properties-smart .jqx-custom-header-properties').empty();
        $('#bimobject-properties-smart .jqx-custom-header-properties').append(
          '<div class="jqx-checkbox-header"><span class="jqx-tree-grid-checkbox jqx-tree-grid-indent jqx-checkbox-default jqx-fill-state-normal jqx-rc-all jqx-checkbox-all"><div class="jqx-tree-grid-checkbox-tick jqx-checkbox-check-checked"></div></span>Domain</div>'
        );
        break;

      case 'unchecked':
        self.setState({ allPropertiesSelected: false });
        $('#bimobject-properties-smart .jqx-custom-header-properties').empty();
        $('#bimobject-properties-smart .jqx-custom-header-properties').append(
          '<div class="jqx-checkbox-header"><span class="jqx-tree-grid-checkbox jqx-tree-grid-indent jqx-checkbox-default jqx-fill-state-normal jqx-rc-all jqx-checkbox-all"></span>Domain</div>'
        );
        break;

      case 'indeterminate':
        self.setState({ allPropertiesSelected: false });
        $('#bimobject-properties-smart .jqx-custom-header-properties').empty();
        $('#bimobject-properties-smart .jqx-custom-header-properties').append(
          '<div class="jqx-checkbox-header"><span class="jqx-tree-grid-checkbox jqx-tree-grid-indent jqx-checkbox-default jqx-fill-state-normal jqx-rc-all jqx-checkbox-all"><div class="jqx-tree-grid-checkbox-tick jqx-checkbox-check-indeterminate"></div></span>Domain</div>'
        );
        break;
    }
  },

  determineAllPropertiesState() {
    const rows = $('#bimobject-properties-smart').jqxTreeGrid('getRows');
    let countRows = 0;

    rows.forEach((item) => {
      countRows += item.records.length;
    });

    if (this.state.smproperties.length == countRows) {
      return 'checked';
    }
    if (this.state.smproperties.length == 0) {
      return 'unchecked';
    }
    return 'indeterminate';
  },

  getLocalization(isVariantGrid) {
    const Localizationobj = {};
    Localizationobj.filterSearchString = this.props.resources.GridMetaLabels.Search;
    if (isVariantGrid) {
      Localizationobj.emptydatastring = this.props.resources.GridMetaLabels.NoDataToShowVariant;
    } else {
      Localizationobj.emptydatastring = this.props.resources.GridMetaLabels.NoDataToShow;
    }
    return Localizationobj;
  },

  loadPropertiesList() {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v2/onfly/${this.props.ManagementCloudId}/bimobjects/${this.props.bimobjectId}/variants/values/${this.props.modelId}/${this.props.Language}?token=${this.props.TemporaryToken}`,
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
        const variantList = _.sortBy(json, 'VariantId');

        const smvariants = [];

        // Sélection automatique de la variante
        if (variantList != null && self.props.selectedVariantId > 0) {
          const type =
            self.state.smproperties != null && self.state.smproperties.length > 0
              ? self.state.smproperties[0].Type
              : 'Official';
          smvariants.push({ Type: type, VariantId: self.props.selectedVariantId });
        }

        self.setState({ data: variantList, smvariants });
        if ($('#bimobject-properties-smart').length > 0) {
          self.refreshTablePropertiesSelect();
        }
      });
  },

  nextStep() {
    if (this.state.step == 1) {
      this.stepVariants();
    } else if (this.state.step == 2) {
      if (this.props.filteredVariants.length > 0) {
        this.createBundle(this.props.modelId, this.state.smproperties, this.props.filteredVariants);
      } else {
        toastr.warning(this.props.resources.BimObjectDetails.SelectVariantMessage);
      }
    }
  },

  previousStep() {
    if (this.state.step == 2) {
      this.stepProperties();
    } else if (this.state.step == 1) {
      this.props.callbackPreviousStep();
    }
  },

  stepProperties() {
    this.setState({ step: 1 });
  },

  stepVariants() {
    this.createBundle(
      this.props.modelId,
      this.state.smproperties,
      this.props.filteredVariants,
      'application/json'
    );
  },

  createBundle(modelId, smproperties, smvariants, acceptHeader = 'application/xml') {
    store.dispatch({ type: 'LOADER', state: true });

    const propertyFilters = [];
    const variantFilters = [];

    if (smproperties != null) {
      smproperties.forEach((property) => {
        propertyFilters.push({ Id: property.PropertyId });
      });
    }

    if (smvariants != null) {
      smvariants.forEach((property) => {
        variantFilters.push({ Id: property.Id });
      });
    }

    const bundle = {
      Lang: this.props.Language,
      Model3DId: !this.props.variantQueryString ? modelId : 0,
      Properties: propertyFilters,
      Variants: variantFilters,
      Sets: [],
      Options: {},
      Parameters: {
        PluginVersion: _pluginVersion,
        MappingConfigurationId: _mappingConfigurationID,
        MappingConfigurationLanguageCode: _mappingConfigurationLanguage,
        CaoName: _softwarePlugin ?? 'revit',
        MappingDictionaryLanguageCode: _mappingDictionaryLanguage,
        OnflyId: this.props.ManagementCloudId,
      },
    };

    const paramBundle = JSON.stringify(bundle);
    let error = false;
    const self = this;

    fetch(
      `${API_URL}/api/ws/v${_bundleVersion}/onfly/${this.props.ManagementCloudId}/bimobject/${this.props.bimobjectId}/download/bundle?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: acceptHeader,
          'Content-Type': 'application/json',
        },
        body: paramBundle,
      }
    )
      .then((response) => {
        if (response.status != 200) {
          error = true;
        }

        return response.text();
      })
      .then((text) => {
        store.dispatch({ type: 'LOADER', state: false });
        if (_isPlugin && !error && acceptHeader === 'application/xml') {
          window._bundleResponse = text;
          if (QWebChannelUtils.isConnected()) {
            QWebChannelUtils.sendMessage({
              Category: 'SmartDownloadBundle',
              Action: 'set',
              Data: [text],
            });
          } else {
            window.location = '/download/bundle';
          }
        } else if (error) {
          toastr.error(self.props.resources.BimObjectDetails.DownloadFail);
          toastr.error(text);
        } else if (acceptHeader === 'application/json') {
          // case step variants
          const json = JSON.parse(text);
          self.setState({ step: 2, update: this.state.step == 1, bundleJson: json });
        }
      });
  },

  resizeSmartDownload(keepScrollStep = true) {
    const parentSelector = `#detail-pdt-${this.props.bimobjectId}`;

    if (!document.querySelector(`${parentSelector} #smart-download-content`)) {
      return;
    }

    const smartDownloadHeight =
      document.documentElement.offsetHeight - document.getElementById('page-wrapper').offsetTop;
    const SDContainerHeight = document.querySelector(
      `${parentSelector} #smart-download-container`
    )?.offsetHeight;
    let SDContentHeight = document.querySelector(
      `${parentSelector} #smart-download-content`
    )?.offsetHeight;
    const SDContentMinHeight = parseInt(
      $(`${parentSelector} #smart-download-content`).css('min-height'),
      10
    );

    SDContentHeight = smartDownloadHeight - (SDContainerHeight - SDContentHeight) - PADDING_BOTTOM;

    const inputObjectSearch = document.getElementById('input-object-search');

    if (inputObjectSearch != null) {
      SDContentHeight -= inputObjectSearch.offsetHeight + PADDING_BOTTOM;
    }

    if (SDContentHeight < SDContentMinHeight) {
      SDContentHeight = SDContentMinHeight;
    }

    // Set height of content
    if (document.querySelector(`${parentSelector} #smart-download-content`)) {
      document.querySelector(
        `${parentSelector} #smart-download-content`
      ).style.height = `${SDContentHeight}px`;
    }

    switch (this.state.step) {
      case 1:
        break;
      case 2:
        this.resizeTableHeaderVariants();

        const downloadContentMessage = document.querySelector(
          `${parentSelector} #download-content-message`
        );
        const blockVariantsTableHeader = document.querySelector(
          `${parentSelector} #block-variants-table-header`
        );

        if (blockVariantsTableHeader != null && downloadContentMessage != null) {
          const othersHeight =
            blockVariantsTableHeader.offsetHeight + downloadContentMessage.offsetHeight;

          document.querySelector(`${parentSelector} #block-variants-table-body`).style.height = `${
            SDContentHeight - othersHeight
          }px`;
        }
        break;
    }

    if (keepScrollStep) {
      this.scrollToCurrentStep(false);
    }
  },

  scrollToCurrentStep(animated) {
    const parentSelector = `#detail-pdt-${this.props.bimobjectId}`;
    let leftStep = 0;

    leftStep -=
      document.querySelector(`${parentSelector} #smart-download-content`).offsetWidth *
      (this.state.step - 1);

    document.querySelector(`${parentSelector} #step-container`).style.transition = animated
      ? '1s'
      : '0s';
    document.querySelector(`${parentSelector} #step-container`).style.left = `${leftStep}px`;
  },

  resizeTableHeaderVariants() {
    const parentSelector = `#detail-pdt-${this.props.bimobjectId}`;

    _.each(this.state.bundleJson.BimObject?.Variants?.VariantValues, (property) => {
      const cell = document.querySelector(
        `${parentSelector} .table-cell-body-${property.PropertiesData[0].PropertyId}`
      );

      if (cell != null) {
        document.querySelector(
          `${parentSelector} #table-cell-head-${property.PropertiesData[0].PropertyId}`
        ).style.width = `${cell.offsetWidth}px`;
      } else {
        document.querySelector(
          `${parentSelector} #table-cell-head-${property.PropertiesData[0].PropertyId}`
        ).style.width = '249px';
      }
    });
  },

  render() {
    const self = this;
    let currentStep1 = '';
    let currentStep2 = '';

    if (this.state.step == 1) {
      currentStep1 = 'current';
    } else if (this.state.step == 2) {
      currentStep2 = 'current';
    }

    const classDivSmartDownload = 'download-wizard';

    let variantsTable;
    let nbVariantSelected;

    if (this.state.bundleJson != null) {
      const columns = this.state.bundleJson.BimObject?.Variants[0].VariantValues?.map(
        (property, index) => (
          <TableCell
            key={`column-${property.PropertiesData[0].PropertyId}`}
            id={`table-cell-head-${property.PropertiesData[0].PropertyId}`}
            align="left"
          >{`${property.PropertiesData[0].Name}`}</TableCell>
        )
      );

      const variantDisplayed = this.state.bundleJson.BimObject?.Variants;

      nbVariantSelected = variantDisplayed.length;

      const rows = variantDisplayed.map((variant, index) => (
        <TableRowVariant
          key={`row-variant-${variant.VariantId}`}
          Variant={variant}
          Update={self.state.update}
          Index={index}
          OtherTableBlock="block-variants-table-body-checkbox"
        />
      ));

      variantsTable = (
        <div id="bimobject-variants-smart">
          <div id="variants-table-body-container">
            <div id="block-variants-table-body">
              <div>
                <Table>
                  <TableHead>
                    <TableRow>{columns}</TableRow>
                  </TableHead>
                  <TableBody>{rows}</TableBody>
                </Table>
              </div>
              <div className="cale-container">
                <div className="cale" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div id="smart-download-container" className="panel-smart-download no-deploy-card">
        <div className="panel-body">
          <div id="dvSmartDownload" className={classDivSmartDownload}>
            {!this.props.hideStep && (
              <div id="smart-download-step-content" className="step-content">
                <div className="stepwizard-row">
                  <div className="stepwizard-step" onClick={this.stepProperties}>
                    <span className={`btn btn-default btn-circle btn-lg ${currentStep1}`}>1</span>
                    <p>{this.props.resources.BimObjectDetails.DownloadModalWizardStepTwo}</p>
                  </div>
                  <div className="stepwizard-step" onClick={this.stepVariants}>
                    <span className={`btn btn-default btn-circle btn-lg ${currentStep2}`}>2</span>
                    <p>{this.props.resources.BimObjectDetails.DownloadModalWizardStepThree}</p>
                  </div>
                </div>
              </div>
            )}

            <div id="smart-download-content">
              <div id="step-container">
                <div id="step-one-container" className="step">
                  <div id="bimobject-properties-smart-container">
                    <div id="bimobject-properties-smart" />
                  </div>
                </div>
                <div id="step-two-container" className="step">
                  <div id="download-content-message">
                    <Typography variant="subtitle1">
                      {`${this.props.resources.BimObjectDetails.DownloadModalFinalContains} `}
                      <span id="props-count" className="count-blue">
                        {this.state.smproperties.length}
                      </span>
                      {` ${this.props.resources.BimObjectDetails.DownloadModalFinalProperties}`}{' '}
                      {`${this.props.resources.BimObjectDetails.DownloadModalFinalAnd} `}
                      <span id="variants-count" className="count-blue">
                        {nbVariantSelected}
                      </span>
                      {` ${this.props.resources.BimObjectDetails.DownloadModalFinalVariants}`}
                    </Typography>
                  </div>
                  {variantsTable}
                </div>
              </div>
            </div>

            <div id="smart-download-button-step" className="row">
              <div className="col-xs-11 text-right">
                <Button
                  variant="contained"
                  onClick={this.previousStep}
                  className="btn-raised"
                  style={{ marginTop: `${15}px` }}
                >
                  <KeyboardArrowLeftIcon />{' '}
                  {this.props.resources.EditionWizardNavigation.PrevButton}
                </Button>
              </div>
              <div className="col-xs-11 col-xs-offset-1">
                {this.state.step == 2 ? (
                  window._isPlugin && (
                    <Button
                      variant="contained"
                      onClick={this.nextStep}
                      className="btn-raised"
                      style={{ marginTop: `${15}px` }}
                    >
                      {this.props.resources.BimObjectDetailsModels.DownloadLabel}
                    </Button>
                  )
                ) : (
                  <Button
                    variant="contained"
                    onClick={this.nextStep}
                    className="btn-raised"
                    style={{ marginTop: `${15}px` }}
                  >
                    {this.props.resources.EditionWizardNavigation.NextButton}
                    <KeyboardArrowRightIcon className="no-deploy-card" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

const TableRowVariant = createReactClass({
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.Update;
  },

  onMouseEnterTableRowVariant() {
    document
      .querySelector(`#${this.props.OtherTableBlock} table tr:nth-child(${this.props.Index + 1})`)
      .classList.add('is-hover');
  },

  onMouseLeaveTableRowVariant() {
    document
      .querySelector(`#${this.props.OtherTableBlock} table tr:nth-child(${this.props.Index + 1})`)
      .classList.remove('is-hover');
  },

  render() {
    const self = this;

    const variant = self.props.Variant;
    const NB_MAX_CARACTERES_CELL = 49;

    let cells;
    if (self.props.Variant.VariantValues != null) {
      cells = self.props.Variant.VariantValues.map((property, index) => {
        let cellContent;

        const cellClass = `table-cell-body-${property.PropertiesData[0].PropertyId}`;
        const propertyContainerClass = 'property-container';

        cellContent = (
          <div className={propertyContainerClass}>
            <span>{property.PropertiesData[0].CAD_Value}</span>
            <Tooltip
              title={property.PropertiesData[0].Name}
              enterDelay={200}
              placement="left"
              TransitionComponent={Zoom}
            >
              <span className="ellipsis">...</span>
            </Tooltip>
          </div>
        );

        return (
          <TableCell
            key={`variant-${variant.Id}-cell-${property.PropertiesData[0].PropertyId}`}
            className={cellClass}
            align="left"
          >
            {cellContent}
          </TableCell>
        );
      });
    }

    const rowContent = cells;

    return (
      <TableRow
        hover
        onMouseEnter={self.onMouseEnterTableRowVariant}
        onMouseLeave={self.onMouseLeaveTableRowVariant}
      >
        {rowContent}
      </TableRow>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;
  const { propertiesGroupState } = store;

  return {
    resources:
      appState.Resources[appState.Language] != null ? appState.Resources[appState.Language] : [],
    TemporaryToken: appState.TemporaryToken,
    Language: appState.Language,
    PropertiesGroupList:
      propertiesGroupState.GroupsList != null ? propertiesGroupState.GroupsList : [],
    PlatformUrl: appState.PlatformUrl,
    Settings: appState.Settings,
    ManagementCloudId: appState.ManagementCloudId,
  };
};

export default SmartDownload = connect(mapStateToProps)(SmartDownload);
