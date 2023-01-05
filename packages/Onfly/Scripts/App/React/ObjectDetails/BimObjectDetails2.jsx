/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prefer-es6-class */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import _ from 'underscore';
import toastr from 'toastr';
import QRCode from 'qrcode.react';
import styled from '@emotion/styled';
import { Menu, Checkbox, space } from '@bim-co/componentui-foundation';

// Material UI
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';

// material ui icons
import ThreeDRotationIcon from '@material-ui/icons/ThreeDRotation';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CompareIcon from '@material-ui/icons/Compare';
import PrintIcon from '@material-ui/icons/Print';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { fetchDocumentTypes as fetchDocumentTypesAction } from '../../Reducers/app/actions';
import { fetchAllSubsets as fetchAllSubsetsAction } from '../../Reducers/Sets/Subsets/actions';
import {
  selectAllSubsetsForDisplaySorted,
  selectFetchAllSubsetsIsError,
  selectFetchAllSubsetsIsPending,
  selectFetchAllSubsetsIsSuccess,
} from '../../Reducers/Sets/Subsets/selectors';
import * as QWebChannelUtils from '../../Utils/qwebchannelUtils.js';
import * as LibraryApi from '../../Api/LibraryApi.js';
import * as Utils from '../../Utils/utils.js';
import SmartDownload from './SmartDownload.jsx';
import VideoViewer from '../Documents/VideoViewer.jsx';
import ImageViewer from '../Documents/ImageViewer.jsx';
import PdfViewer from '../Documents/PdfViewer.jsx';
import store from '../../Store/Store';
import { API_URL } from '../../Api/constants';

// Actions

// selectors

// Child component
import DocumentTable from '../ObjectEditor/Steps/Documents/DocumentTable';
import { sendAnalytics } from '../../Reducers/analytics/actions';

let BimObjectDetails2 = createReactClass({
  getInitialState() {
    return {
      smartDownload: false,
      selectSmartDownloadModelId: -1,
      selectSmartDownloadModelName: '',
      selectedVariantId: 0,
      pins: [],
      pdfUrl: '',
      imageUrl: '',
      selectedDocName: '',
      videoUrl: '',
      domainOpened: [],
      anchorRefButtonDownload: null,
      popperDownloadChoiceIsOpen: false,
      fullDownloadPropertyList: [],
      selectSmartDownloadModel: null,
      selectedSubsets: new Map([]),
    };
  },

  shouldComponentUpdate(nextProps) {
    if (!nextProps.displayed && this.props.displayed && !this.props.detailsPage) {
      $(`#detail-pdt-${this.props.bimobjectId}`).collapse('hide');
      return false;
    }
    return true;
  },

  componentDidUpdate(prevProps) {
    if (this.props.displayed && !this.props.detailsPage) {
      // Load documents types
      if (this.props.DocumentTypes.length === 0) {
        this.props.fetchDocumentTypes();
      }
      if (
        !this.props.selectFetchSubsetsIsPending &&
        !this.props.selectFetchSubsetsIsError &&
        !this.props.selectFetchSubsetsIsSuccess
      ) {
        this.props.fetchAllSubsets();
      }

      $(`#detail-pdt-${this.props.bimobjectId}`).collapse('show');
    }
  },

  componentDidMount() {
    if (this.props.displayed) {
      // Load documents types
      if (this.props.DocumentTypes.length === 0) {
        this.props.fetchDocumentTypes();
      }
      if (
        !this.props.selectFetchSubsetsIsPending &&
        !this.props.selectFetchSubsetsIsError &&
        !this.props.selectFetchSubsetsIsSuccess
      ) {
        this.props.fetchAllSubsets();
      }

      $(`#detail-pdt-${this.props.bimobjectId}`).collapse('show');
    }
  },

  componentWillUnmount() {
    store.dispatch({ type: 'LOADER', state: false });
  },

  selectTabModels() {
    this.props.changeTabSelection('models');
  },

  selectTabDocuments() {
    this.closeOpenPopperDownloadChoice();
    this.props.changeTabSelection('documents');
  },

  selectTabData() {
    this.closeOpenPopperDownloadChoice();
    this.props.changeTabSelection('data');
  },

  selectTabQRCode() {
    this.closeOpenPopperDownloadChoice();
    this.props.changeTabSelection('qrcode');
  },

  beginSmartDownload(modelId, modelName) {
    let top = document.getElementById(`panel-object-${this.props.bimobjectId}`).offsetTop;
    const inputObjectSearch = document.getElementById('input-object-search');

    if (inputObjectSearch != null) {
      top -= inputObjectSearch.offsetHeight + 20;
    }

    document.documentElement.scrollTo({ top, behavior: 'smooth' });

    this.props.toggleCarHeaderVisibility();
    this.setState({
      smartDownload: true,
      selectSmartDownloadModelId: modelId,
      selectSmartDownloadModelName: modelName,
      popperDownloadChoiceIsOpen: false,
    });
  },

  cancelSmartDownload() {
    this.setState({ smartDownload: false, selectSmartDownloadModelId: -1 });

    this.props.toggleCarHeaderVisibility();
  },

  quickDownload(event) {
    const self = this;
    const modelId = event.currentTarget.dataset.id;
    const { type } = event.currentTarget.dataset;

    const subsets = Array.from(this.state.selectedSubsets.values());

    const sets = subsets.reduce((acc, value) => {
      const existingSet = acc.find((x) => x.Id === value.Set.Id);
      if (existingSet) {
        existingSet.Subsets.push(value.Id);
        return acc;
      }
      return [
        {
          Subsets: [value.Id],
          ...value.Set,
        },
        ...acc,
      ];
    }, []);

    if (_isPlugin && type == '3d') {
      const bundle = {
        Lang: this.props.Language,
        Model3DId: modelId,
        Properties: [],
        Variants: [],
        Sets: sets,
        Options: {
          EnableIFC: this.props.Settings.EnableIfcSDL,
        },
        Parameters: {
          PluginVersion: _pluginVersion,
          MappingConfigurationId: _mappingConfigurationID,
          MappingConfigurationLanguageCode: _mappingConfigurationLanguage,
          CaoName: _softwarePlugin,
          MappingDictionaryLanguageCode: _mappingDictionaryLanguage,
          OnflyId: this.props.managementCloudId,
        },
      };

      const paramBundle = JSON.stringify(bundle);

      store.dispatch({ type: 'LOADER', state: true });

      let error = false;

      fetch(
        `${API_URL}/api/ws/v${_bundleVersion}/onfly/${this.props.managementCloudId}/bimobject/${this.props.bimobjectId}/download/bundle?token=${this.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/xml',
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
          window._bundleResponse = text;
          store.dispatch({ type: 'LOADER', state: false });
          if (_isPlugin && !error) {
            if (QWebChannelUtils.isConnected()) {
              QWebChannelUtils.sendMessage({
                Category: 'SmartDownloadBundle',
                Action: 'set',
                Data: [text],
              });
            } else {
              window.location = '/download/bundle';
            }
          } else {
            toastr.error(self.props.resources.BimObjectDetails.DownloadFail);
          }
          this.props.sendAnalytics('user-clicked-smart-download');
        });
    } else {
      let error = false;

      fetch(
        `${API_URL}/api/ws/v1/download/${type}model/${modelId}/CONTENT_MANAGEMENT/${this.props.managementCloudId}?token=${this.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => {
          if (response.status != 200) {
            error = true;
          }
          return response.json();
        })
        .then((text) => {
          if (_.keys(text).indexOf('status') === -1 && !error) {
            toastr.success(self.props.resources.BimObjectDetails.DownloadSuccess);
            window.location = text;
          } else {
            toastr.error(self.props.resources.BimObjectDetails.DownloadFail);
          }
          this.props.sendAnalytics('user-clicked-quick-download');
        });
    }
  },

  downloadDocument(document) {
    const self = this;

    if (document !== null && document !== undefined) {
      fetch(
        `${API_URL}/api/ws/v1/download/document/${document.Id}/CONTENT_MANAGEMENT/${this.props.managementCloudId}?token=${this.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => response.json())
        .then((text) => {
          if (_.keys(text).indexOf('status') == -1) {
            window.location = text;
            toastr.success(self.props.resources.BimObjectDetails.DownloadSuccess);
          } else {
            toastr.error(self.props.resources.BimObjectDetails.DownloadFail);
          }
        });
    }
  },

  viewDocument(document) {
    const self = this;

    if (document !== null && document !== undefined) {
      fetch(
        `${API_URL}/api/ws/v1/download/document/${document.Id}/CONTENT_MANAGEMENT/${this.props.managementCloudId}?token=${this.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => response.json())
        .then((documentURL) => {
          if (_.keys(documentURL).indexOf('status') == -1) {
            const formatedExtension = document.Extension.replace('.', '').toLowerCase();

            switch (formatedExtension) {
              case 'pdf':
                self.setState({ pdfUrl: documentURL, selectedDocName: document.FileName });
                break;
              // Image
              case 'bmp':
              case 'gif':
              case 'jpeg':
              case 'jpg':
              case 'png':
                self.setState({ imageUrl: documentURL, selectedDocName: document.FileName });
              // Vidéo
              case 'mp4':
              case 'avi':
                self.setState({ videoUrl: documentURL, selectedDocName: document.FileName });
                break;
            }
          }
        });
    }
  },

  exitViewer() {
    this.setState({ pdfUrl: '', imageUrl: '', videoUrl: '' });
  },

  printQRCode() {
    const self = this;

    // Définie la zone à imprimer
    const qrcodeCM = document
      .getElementsByClassName(`bimobject-qrcode-${self.props.bimobjectId}`)[0]
      .getElementsByTagName('canvas')[0]
      .toDataURL();

    // Ouvre une nouvelle fenetre
    const f = window.open(
      '',
      'ZoneImpr',
      'height=500, width=600,toolbar=0, menubar=0, scrollbars=1, resizable=1,status=0, location=0, left=10, top=10'
    );
    // Définit le Style de la page
    f.document.body.style.color = '#000000';
    f.document.body.style.backgroundColor = '#FFFFFF';
    f.document.body.style.padding = '10px';
    // Ajoute les Données
    f.document.title = '';

    f.document.write(`<img src="${qrcodeCM}" />`);

    f.document.close();

    f.document.body.onload = function () {
      // Imprime et ferme la fenetre
      f.print();
      f.close();
    };
  },

  addObjectToLibrary() {
    const values = [this.props.bimobjectId];

    LibraryApi.addBimObjects(
      this.props.managementCloudId,
      values,
      this.props.TemporaryToken,
      this.props.resources
    );
  },

  toggleDomain(event) {
    const { id } = event.currentTarget.dataset;
    const domain_selected = this.state.domainOpened;
    const index = domain_selected.indexOf(id);
    if (index === -1) {
      domain_selected.push(id);
    } else {
      domain_selected.splice(index, 1);
    }

    this.setState({ domainOpened: domain_selected });
  },

  importTwobaData(gtin) {
    const self = this;

    store.dispatch({ type: 'LOADER', state: true });

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/2ba/enrichObject/${this.props.bimobjectId}?gtin=${gtin}&token=${this.props.TemporaryToken}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    ).then(() => {
      store.dispatch({ type: 'LOADER', state: false });
      self.props.loadBimObjectInformations(false);
    });
  },

  toggleOpenPopperDownloadChoice(event, model) {
    this.setState({
      popperDownloadChoiceIsOpen: !this.state.popperDownloadChoiceIsOpen,
      anchorRefButtonDownload: event.currentTarget.parentNode,
      selectSmartDownloadModel: model,
    });
  },

  closeOpenPopperDownloadChoice(event) {
    if (this.state.popperDownloadChoiceIsOpen) {
      this.setState({ popperDownloadChoiceIsOpen: false });
    }
  },

  createBundle(modelId, smproperties, smvariants) {
    store.dispatch({ type: 'LOADER', state: true });

    const propertyFilters = [];
    const variantFilters = [];

    if (smproperties != null) {
      smproperties.forEach((property) => {
        propertyFilters.push({ Type: property.Type, Id: property.PropertyId });
      });
    } else if (this.state.selectedSubsets.size > 0) {
      const containsSelectedSubset = (subsets) =>
        subsets?.find((y) => this.state.selectedSubsets.has(y.Id));

      const filteredVariantValues = this.props.data.VariantValues.filter((x) =>
        containsSelectedSubset(x.Property.Subsets)
      );

      const filteredProperties = filteredVariantValues.map((x) => x.Property);

      filteredProperties.forEach((property) => {
        propertyFilters.push({ Id: property.Id });
      });
    }

    if (smvariants != null) {
      smvariants.forEach((property) => {
        variantFilters.push({ Type: property.Type, Id: property.VariantId });
      });
    }

    const bundle = {
      Lang: this.props.Language,
      Model3DId: modelId,
      Properties: propertyFilters,
      Variants: variantFilters,
      Sets: [],
      Options: {
        EnableIFC: this.props.Settings.EnableIfcSDL,
      },
      Parameters: {
        PluginVersion: _pluginVersion,
        MappingConfigurationId: _mappingConfigurationID,
        MappingConfigurationLanguageCode: _mappingConfigurationLanguage,
        CaoName: _softwarePlugin,
        MappingDictionaryLanguageCode: _mappingDictionaryLanguage,
        OnflyId: this.props.managementCloudId,
      },
    };

    const paramBundle = JSON.stringify(bundle);
    let error = false;
    const self = this;

    fetch(
      `${API_URL}/api/ws/v${_bundleVersion}/onfly/${this.props.managementCloudId}/bimobject/${this.props.bimobjectId}/download/bundle?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/xml',
          'Content-Type': 'application/json',
        },
        body: paramBundle,
      }
    )
      .then((response) => {
        if (response.status != 200) {
          error = true;
          return response.json();
        }

        return response.text();
      })
      .then((text) => {
        store.dispatch({ type: 'LOADER', state: false });
        if (_isPlugin && !error) {
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
        } else {
          toastr.error(self.props.resources.BimObjectDetails.DownloadFail);
          toastr.error(text.Message);
        }
      });
  },

  fullDownload(modelId) {
    this.createBundle(modelId);
    this.props.sendAnalytics('user-clicked-full-download');
  },

  getSoftware(softwareId) {
    let software;

    if (this.props.Softwares) {
      software = this.props.Softwares.find((s) => s && s.Id === softwareId);
    }

    return software;
  },

  onSubsetChange(option) {
    const subset = option.value;

    if (_.isEmpty(subset)) {
      this.state.selectedSubsets.clear();
    } else if (this.state.selectedSubsets.has(subset.Id)) {
      this.state.selectedSubsets.delete(subset.Id);
    } else {
      this.state.selectedSubsets.set(subset.Id, subset);
    }

    this.setState({
      selectedSubsets: this.state.selectedSubsets,
    });
  },

  /* eslint-disable max-lines-per-function */
  render() {
    if (
      this.props.data == null ||
      (this.props.data != null && this.props.data.LanguageCode != this.props.Language)
    ) {
      if (this.props.displayed) {
        return (
          <div className="linear-progress">
            <LinearProgress variant="indeterminate" color="primary" />
          </div>
        );
      }
      return null;
    }

    const self = this;

    let documentsClass = 'hidden';
    let modelsClass = 'models-zone content-card hidden';
    let dataClass = 'hidden';
    let qrcodeClass = 'hidden';
    let smartDownload;
    let hasGTIN = false;
    let gtin = '';
    const selectedVariantId =
      this.props.selectedVariantId !== null ? this.props.selectedVariantId : 0;

    const containsSelectedSubset = (subsets) =>
      subsets?.find((y) => self.state.selectedSubsets.has(y.Id));

    let documents = [];

    const filteredVariantValues =
      this.state.selectedSubsets.size === 0
        ? this.props.data.VariantValues
        : this.props.data.VariantValues.filter((x) => containsSelectedSubset(x.Property.Subsets));

    // comment for LOT 1 SETS
    const filteredDocuments =
      this.state.selectedSubsets.size === 0
        ? this.props.data.Documents
        : this.props.data.Documents.filter(
          (x) => !(x.Subsets ?? []).length || containsSelectedSubset(x.Subsets)
        );

    const filtered2DModels =
      this.state.selectedSubsets.size === 0
        ? this.props.data.TwoDModels
        : this.props.data.TwoDModels.map((x) => ({
          ...x,
          Variants: x.Variants.filter(
            (y) => (y.Subsets?.length === 0 ?? true) || containsSelectedSubset(y.Subsets)
          ),
        }));

    const filtered3DModels =
      this.state.selectedSubsets.size === 0
        ? this.props.data.ThreeDModels
        : this.props.data.ThreeDModels.map((x) => ({
          ...x,
          ThreeDModelVariants: x.ThreeDModelVariants.filter(
            (y) =>
              (y.Variant.Subsets?.length === 0 ?? true) ||
              containsSelectedSubset(y.Variant.Subsets) ||
              (y.Variant?.length === 0 ?? true)
          ),
        }));

    const documentSubsets = this.props.data.Documents?.flatMap((x) => x.Subsets) ?? [];
    const propertiesSubsets =
      this.props.data.VariantValues?.flatMap((x) => x.Property.Subsets) ?? [];
    const twoDSubsets =
      this.props.data.TwoDSubsets?.flatMap((x) => x.Variants.flatMap((y) => y.Subsets)) ?? [];
    const threeDSubsets =
      this.props.data.ThreeDModels?.flatMap((x) =>
        x.ThreeDModelVariants.flatMap((y) => y.Variant.Subsets)
      ) ?? [];
    const subsetsSum = documentSubsets
      .concat(propertiesSubsets)
      .concat(twoDSubsets)
      .concat(threeDSubsets)
      .reduce((acc, curr) => {
        if (acc.map((x) => x.Id).includes(curr.Id)) {
          return acc;
        }
        acc.push(curr);
        return acc;
      }, []);

    const models3dFiltered = filtered3DModels.filter((model) => {
      if (model) {
        return (
          model.ThreeDModelVariants.some(
            (threeDModelVariant) =>
              threeDModelVariant &&
              threeDModelVariant.Variant &&
              threeDModelVariant.Variant.Id == selectedVariantId
          ) ||
          (model.ThreeDModelVariants?.length === 0 ?? true)
        );
      }
    });

    const models2dFiltered = filtered2DModels.filter((model) => {
      if (model) {
        return model.Variants.some(
          (twoDModelVariant) =>
            twoDModelVariant && twoDModelVariant && twoDModelVariant.Id == selectedVariantId
        );
      }
    });

    let models3d;
    let models2d;

    if (this.props.tabSelected === 'data') {
      dataClass = '';

      // variants
      var tableProperties = [];
      const variantList = [];

      const sortedArray = _(filteredVariantValues)
        .chain()
        .sortBy((variantValue3) => variantValue3.Property.Id)
        .sortBy((variantValue2) => variantValue2.Domain.Id)
        .sortBy((variantValue) => variantValue.VariantId)
        .value();

      let lastDomain = '';
      let last_domain_name = '';
      let line = [];
      const otherLines = [];

      let selectedVariantName = '';
      const lengthArray = sortedArray.length;
      var cptProperties = 0;
      let lastOrtherLineAddedId = 0;

      // ////////////////////////////////

      // map table properties

      _.each(sortedArray, (variantValue, i) => {
        // Property.Id === 217 is to check if it's a reference
        if (variantValue.Property.Id === 217) {
          variantList.push({ VariantId: variantValue.VariantId, Name: variantValue.Value });
          if (variantValue.VariantId === selectedVariantId) {
            selectedVariantName = variantValue.Value;
          }
        }

        if (variantValue.VariantId == selectedVariantId) {
          const currentDescription =
            variantValue.Property.Description != null
              ? variantValue.Property.Description.trim()
              : '';

          // gtin props
          if (
            variantValue.Property.Id == 1511 &&
            variantValue.Value != null &&
            variantValue.Value != ''
          ) {
            hasGTIN = true;
            gtin = variantValue.Value;
          }

          let unit;

          if (variantValue.Property != null) {
            if (variantValue.Property.Unit != null) {
              unit = `(${variantValue.Property.Unit.Symbole})`;
            }
          }

          let forceAdd = false;
          if (i + 1 == lengthArray) {
            // Last property of all
            forceAdd = true;
          } else if (i + 1 <= lengthArray - 1) {
            if (sortedArray[i + 1].VariantId != variantValue.VariantId) {
              // Last property of the variant
              forceAdd = true;
            }
          }

          if (forceAdd && lastDomain == variantValue.Domain.Id) {
            const propertyLine = (
              <li key={`th${i}`}>
                <label>
                  <Tooltip placement="top" title={currentDescription}>
                    <span>
                      {variantValue.Property.Name} {unit}
                    </span>
                  </Tooltip>
                </label>
                <p>{variantValue.Value}</p>
              </li>
            );

            // Si la propriété est dans le dico du Onfly
            if (variantValue.Property.PropertiesGroupMappingId > 0) {
              line.push(propertyLine);
            } else {
              otherLines.push(propertyLine);
              lastOrtherLineAddedId = variantValue.Property.Id;
            }
          }

          if (
            line.length > 0 &&
            ((lastDomain != variantValue.Domain.Id && lastDomain != '') || forceAdd)
          ) {
            const classNameDomain = _.some(
              self.state.domainOpened,
              (domain) => lastDomain == parseInt(domain)
            )
              ? 'open'
              : '';
            tableProperties.push(
              <li
                key={lastDomain}
                className={classNameDomain}
                data-id={lastDomain}
                onClick={self.toggleDomain}
              >
                <a className="tablePropertiesDetails">{last_domain_name}</a>
                <ul>{line}</ul>
              </li>
            );
            line = [];
          }

          const propertyLine = (
            <li key={`th${i}`}>
              <label>
                <Tooltip placement="top" title={currentDescription}>
                  <span>
                    {variantValue.Property.Name} {unit}
                  </span>
                </Tooltip>
              </label>
              <p>{variantValue.Value}</p>
            </li>
          );

          // Si la propriété est dans le dico du Onfly
          if (variantValue.Property.PropertiesGroupMappingId > 0) {
            line.push(propertyLine);
          } else if (lastOrtherLineAddedId != variantValue.Property.Id) {
            otherLines.push(propertyLine);
          }

          if (line.length > 0 && forceAdd && lastDomain != variantValue.Domain.Id) {
            const classNameDomain = _.some(
              self.state.domainOpened,
              (domain) => variantValue.Domain.Id == parseInt(domain)
            )
              ? 'open'
              : '';
            tableProperties.push(
              <li
                key={variantValue.Domain.Id}
                className={classNameDomain}
                data-id={variantValue.Domain.Id}
                onClick={self.toggleDomain}
              >
                <a className="tablePropertiesDetails">{variantValue.Domain.Name}</a>
                <ul>{line}</ul>
              </li>
            );
            line = [];
          }

          lastDomain = variantValue.Domain.Id;
          last_domain_name = variantValue.Domain.Name;

          cptProperties++;
        }
      });

      // ////////////////////////////////

      if (otherLines.length > 0) {
        const classNameDomain = _.some(self.state.domainOpened, (domain) => parseInt(domain) == -1)
          ? 'open'
          : '';

        // Ajout du domain "Autres"
        tableProperties.push(
          <li
            key="domain-other"
            className={classNameDomain}
            data-id={-1}
            onClick={self.toggleDomain}
          >
            <a className="tablePropertiesDetails">
              {self.props.resources.BimObjectDetails.DomainOther}
            </a>
            <ul>{otherLines}</ul>
          </li>
        );
      }
    } else if (this.props.tabSelected === 'models' && !this.state.smartDownload) {
      modelsClass = 'models-zone content-card';

      // models
      models3d = _.map(models3dFiltered, (model, i) => {
        let threeDModelVariant;

        if (model && model.ThreeDModelVariants) {
          threeDModelVariant = model.ThreeDModelVariants.find(
            (threeDModelVariant) =>
              threeDModelVariant &&
              threeDModelVariant.Variant &&
              threeDModelVariant.Variant.Id == selectedVariantId
          );
        }

        const software = model.Software && self.getSoftware(model.Software.Id);

        let downloadButton;

        if (_isPlugin && !this.props.data?.Configurators?.length > 0) {
          // SDL
          downloadButton = (
            <div className="block-split-button-download">
              <ButtonGroup
                className="button-group-download-choice"
                variant="contained"
                aria-label="Split button"
                size="small"
              >
                <Tooltip title={self.props.resources.BimObjectDetails.FullDownload}>
                  <Button
                    className="btn-full-download"
                    onClick={(event) => self.fullDownload(model.Id)}
                  >
                    <CloudDownloadIcon />
                  </Button>
                </Tooltip>
                <Button
                  className="btn-arrow-download"
                  variant="contained"
                  aria-owns={self.state.popperDownloadChoiceIsOpen ? 'paper-download-choice' : null}
                  aria-haspopup="true"
                  onClick={(event) => self.toggleOpenPopperDownloadChoice(event, model)}
                >
                  <ArrowDropDownIcon />
                </Button>
              </ButtonGroup>
            </div>
          );
        } else if (!_isPlugin) {
          // QDL
          downloadButton = (
            <Tooltip title={self.props.resources.BimObjectDetails.TooltipQuickDownload}>
              <button
                className="btn-download"
                data-id={model.Id}
                onClick={self.quickDownload}
                data-type="3d"
              >
                <CloudDownloadIcon />
              </button>
            </Tooltip>
          );
        }

        return (
          <div className={classNameGlobal} id={`detail-pdt-${this.props.bimobjectId}`}>
            {shouldDisplaySubsetButton ? (
              ''
            ) : (
              <StyledMenu>
                <Menu
                  buttonText={getButtonText()}
                  multi
                  items={_.sortBy(menuOptions, (option) => option?.label)}
                  menuOptions={{ maxHeight: space[2500] }}
                  triggerOptions={{ style: { maxWidth: '50%' } }}
                />
              </StyledMenu>
            )}
            <PdfViewer
              url={this.state.pdfUrl}
              exitViewer={this.exitViewer}
              docName={this.state.selectedDocName}
              resources={this.props.resources}
            />
            <ImageViewer
              url={this.state.imageUrl}
              exitViewer={this.exitViewer}
              docName={this.state.selectedDocName}
              resources={this.props.resources}
            />
            <VideoViewer
              url={this.state.videoUrl}
              exitViewer={this.exitViewer}
              docName={this.state.selectedDocName}
              resources={this.props.resources}
            />

            <div className={visibilityPanel}>
              <div className="object-descriptif">
                <div className="col-xs-23">
                  <ul
                    className={`nav nav-tabs nav-tabs-detail${this.props.tabSelected === 'data' ? ' dataTabs' : ''
                      }${this.props.cardHeaderIsVisible || !this.props.displayed ? '' : ' hidden'}`}
                  >
                    <li
                      role="presentation"
                      className={this.props.tabSelected == 'data' ? 'active' : ''}
                    >
                      <a data-toggle="tab" onClick={this.selectTabData}>
                        <span className="badge">{cptProperties}</span>
                        {this.props.resources.DetailsMenu.PropertiesListLabel}
                      </a>
                    </li>
                    <li
                      role="presentation"
                      className={this.props.tabSelected == 'models' ? 'active' : ''}
                    >
                      <a data-toggle="tab" onClick={this.selectTabModels}>
                        <span className="badge">
                          {models3dFiltered.length + models2dFiltered.length}
                        </span>
                        {this.props.resources.DetailsMenu.ThreeDModelsLabel}
                      </a>
                    </li>
                    <li
                      role="presentation"
                      className={this.props.tabSelected == 'documents' ? 'active' : ''}
                    >
                      <a data-toggle="tab" onClick={this.selectTabDocuments}>
                        <span className="badge">{documents.length}</span>
                        {this.props.resources.DetailsMenu.DocumentsListLabel}
                      </a>
                    </li>
                    {!_isPlugin ? (
                      <li
                        role="presentation"
                        className={this.props.tabSelected == 'qrcode' ? 'active' : ''}
                      >
                        <a data-toggle="tab" onClick={this.selectTabQRCode}>
                          {this.props.resources.BimObjectDetailsInfos.QRCodeLabel}
                        </a>
                      </li>
                    ) : null}
                  </ul>

                  <div className={dataClass}>
                    <a className="btn-compare align-right hidden">
                      <CompareIcon />
                    </a>
                    {hasGTIN ? (
                      <a
                        className="btn btn-blue align-right"
                        onClick={() => this.importTwobaData(gtin)}
                      >
                        Import 2ba Data
                      </a>
                    ) : null}
                    <ul id="variants-details" className="content-card">
                      {tableProperties}
                    </ul>
                  </div>
                  <div className={modelsClass}>
                    <h4>{this.props.resources.DetailsMenu.ThreeDModelsLabel}</h4>
                    <table className="table table-stripped">
                      <thead>
                        <tr>
                          <th>{this.props.resources.BimObjectDetailsModels.FileNameLabel}</th>
                          <th className="text-center">
                            {this.props.resources.BimObjectDetailsModels.SizeLabel}
                          </th>
                          <th>{this.props.resources.BimObjectDetailsModels.SoftwareLabel}</th>
                          <th className="text-center">
                            {this.props.resources.BimObjectDetailsModels.LevelOfDetailLabel}
                          </th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>{models3d}</tbody>
                    </table>
                    {models3dFiltered.length == 0 ? (
                      <p className="no-model">
                        {this.props.resources.BimObjectDetailsModels.No3dModel}{' '}
                        {this.props.canEdit == true ? (
                          <Link
                            to={`/${this.props.Language}/bimobject/${this.props.bimobjectId}/edit/models`}
                            className="btn-second btn-blue"
                          >
                            {this.props.resources.BimObjectDetailsModels.AddModel}
                          </Link>
                        ) : (
                          ''
                        )}
                      </p>
                    ) : (
                      ''
                    )}

                    <div className={models2dFiltered.length == 0 ? 'hidden' : ''}>
                      <h4>{this.props.resources.DetailsMenu.TwoDModelsLabel}</h4>
                      <table className="table table-stripped">
                        <thead>
                          <tr>
                            <th>{this.props.resources.BimObjectDetailsModels.FileNameLabel}</th>
                            <th className="text-center">
                              {this.props.resources.BimObjectDetailsModels.SizeLabel}
                            </th>
                            <th>{this.props.resources.BimObjectDetailsModels.SoftwareLabel}</th>
                            <th className="text-center">
                              {this.props.resources.BimObjectDetailsModels.LevelOfDetailLabel}
                            </th>
                            <th />
                          </tr>
                        </thead>
                        <tbody>{models2d}</tbody>
                      </table>
                      {models2dFiltered.length == 0 ? (
                        <p className="no-model">
                          {this.props.resources.BimObjectDetailsModels.No2dModel}{' '}
                          {this.props.canEdit == true ? (
                            <Link
                              to={`/${this.props.Language}/bimobject/${this.props.bimobjectId}/edit/models`}
                              className="btn-second btn-blue"
                            >
                              {this.props.resources.BimObjectDetailsModels.AddModel}
                            </Link>
                          ) : (
                            ''
                          )}
                        </p>
                      ) : (
                        ''
                      )}
                    </div>
                    <Popper
                      open={self.state.popperDownloadChoiceIsOpen}
                      anchorEl={self.state.anchorRefButtonDownload}
                      transition
                      disablePortal
                    >
                      {({ TransitionProps, placement }) => (
                        <Grow
                          {...TransitionProps}
                          style={{
                            transformOrigin:
                              placement === 'bottom' ? 'center top' : 'center bottom',
                          }}
                        >
                          <Paper id="paper-download-choice">
                            <ClickAwayListener onClickAway={self.closeOpenPopperDownloadChoice}>
                              <MenuList>
                                <MenuItem
                                  key="menuitem-smartdownload"
                                  onClick={(event) =>
                                    self.beginSmartDownload(smModelId, smModelName)
                                  }
                                >
                                  {self.props.resources.BimObjectDetails.TooltipSmartDownload}
                                </MenuItem>
                              </MenuList>
                            </ClickAwayListener>
                          </Paper>
                        </Grow>
                      )}
                    </Popper>
                  </div>

                  {smartDownload}

                  <div className={documentsClass}>
                    {documents.length > 0 ? (
                      <DocumentTable
                        documents={documents}
                        showLinkButton
                        onClickView={self.viewDocument}
                        onClickDownload={self.downloadDocument}
                      />
                    ) : (
                      <p className="text-center">
                        {this.props.resources.BimObjectDetailsDocuments.EmptyState}
                      </p>
                    )}
                  </div>
                  {!_isPlugin ? (
                    <div className={qrcodeClass} id="qrcode-container">
                      <div className="row">
                        <div className="col-md-23 flex-container">
                          <p>
                            <Link
                              to={`/${this.props.Language}/bimobject/${this.props.bimobjectId}/details`}
                              className="link-qrcode"
                            >
                              {`${location.protocol}//${location.href.split('/')[2]}/${this.props.Language
                                }/bimobject/${this.props.bimobjectId}/details`}
                            </Link>
                          </p>
                          {!_isPlugin ? (
                            <a className="btn-print align-right" onClick={this.printQRCode}>
                              <PrintIcon />
                            </a>
                          ) : null}
                        </div>
                        <div
                          className={`col-md-23 text-center bimobject-qrcode-${this.props.bimobjectId}`}
                          id="qrcode-cm"
                        >
                          <QRCode
                            value={`${location.protocol}//${location.host}/${this.props.Language}/bimobject/${this.props.bimobjectId}/details`}
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );
      });

      if (_isPlugin && _pluginVersion >= 300 && !this.props.data?.Configurators?.length > 0) {
        models3d.push(
          <tr key="dataonly">
            <td colSpan="4">
              {this.props.data.HasCAOParameters
                ? this.props.resources.BimObjectDetails.InsertDataInComponent
                : this.props.resources.BimObjectDetails.DownloadDataOnly}
            </td>
            <td>
              <div className="group-btn text-right">
                <div className="block-split-button-download">
                  <ButtonGroup
                    className="button-group-download-choice"
                    variant="contained"
                    aria-label="Split button"
                    size="small"
                  >
                    <Tooltip title={self.props.resources.BimObjectDetails.FullDownload}>
                      <Button
                        className="btn-full-download"
                        onClick={(event) => self.fullDownload(0)}
                      >
                        <CloudDownloadIcon />
                      </Button>
                    </Tooltip>
                    <Button
                      className="btn-arrow-download"
                      variant="contained"
                      aria-owns={
                        self.state.popperDownloadChoiceIsOpen ? 'paper-download-choice' : null
                      }
                      aria-haspopup="true"
                      onClick={(event) => self.toggleOpenPopperDownloadChoice(event)}
                    >
                      <ArrowDropDownIcon />
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            </td>
          </tr>
        );
      }

      const models2d = _.map(models2dFiltered, (model, i) => {
        const software = model.Software && self.getSoftware(model.Software.Id);

        return (
          <tr key={model.Id}>
            <td>{model.FileName}</td>
            <td className="text-center">{Utils.getReadableSize(model.Size)}</td>
            <td>
              {software && <img src={`${software.Icon}?scale=both&height=30&width=30`} />}{' '}
              {software && `${software.Name} ${software.Version ? `(${software.Version})` : ''}`}
            </td>
            <td className="text-center">{model.LevelOfDetail == 0 ? '-' : model.LevelOfDetail}</td>
            <td>
              {!_isPlugin ? (
                <div className="group-btn text-right">
                  <Tooltip title={self.props.resources.BimObjectDetails.TooltipQuickDownload}>
                    <button
                      className="btn-download"
                      data-id={model.Id}
                      onClick={self.quickDownload}
                      data-type="2d"
                    >
                      <CloudDownloadIcon />
                    </button>
                  </Tooltip>
                </div>
              ) : null}
            </td>
          </tr>
        );
      });
    } else if (this.state.smartDownload && this.props.tabSelected == 'models') {
      smartDownload = (
        <SmartDownload
          modelId={this.state.selectSmartDownloadModelId}
          modelName={this.state.selectSmartDownloadModelName}
          bimobjectId={this.props.bimobjectId}
          cancelSmartDownload={this.cancelSmartDownload}
          createBundle={this.createBundle}
          selectedVariantId={this.state.selectedVariantId}
          selectedSubsets={this.state.selectedSubsets}
        />
      );
    } else if (this.props.tabSelected === 'documents') {
      documentsClass = 'content-card';
    } else if (this.props.tabSelected === 'qrcode') {
      qrcodeClass = 'content-card';
    }

    let visibilityPanel = '';
    if (this.state.pdfUrl != '' || this.state.imageUrl != '' || this.state.videoUrl != '') {
      visibilityPanel = 'hidden';
    }

    let classNameGlobal = 'detail-pdt collapse no-deploy-card';
    if (this.props.detailsPage) {
      classNameGlobal = 'detail-pdt';
    }

    const smModelId =
      this.state.selectSmartDownloadModel != null ? this.state.selectSmartDownloadModel.Id : 0;
    const smModelName =
      this.state.selectSmartDownloadModel != null ? this.state.selectSmartDownloadModel.Name : '';

    // Liste les documents qui sont rattachés à aucune variante
    // ou qui sont rattachés à la variante sélectionnée
    documents = filteredDocuments.filter((document) => {
      if (document.Variants != null && document.Variants != undefined) {
        const variant = document.Variants.find(
          (variant) => variant != null && variant !== undefined && variant.Id == selectedVariantId
        );

        return document.Variants.length === 0 || variant !== undefined;
      }
    });

    // const sets = this.props.subsets && this.props.subsets.reduce((acc, value) => {
    const sets =
      subsetsSum &&
      subsetsSum.reduce((acc, value) => {
        const existingSet = acc.find((x) => x.Id === value.Set.Id);

        if (existingSet) {
          existingSet.Subsets.push({
            Id: value.Id,
            Name: value.Name,
          });
          return acc;
        }
        return [
          {
            Subsets: [{ Id: value.Id, Name: value.Name }],
            ...value.Set,
          },
          ...acc,
        ];
      }, []);

    const handleAddSubsets = (subset) => {
      if (!this.state.selectedSubsets.has(subset.Id)) {
        this.state.selectedSubsets.set(subset.Id, subset);
      } else {
        this.state.selectedSubsets.delete(subset.Id);
      }
      this.setState({
        selectedSubsets: this.state.selectedSubsets,
      });
    };

    const menuOptions = sets && [
      ...sets.map((set) => ({
        label: set.Name,
        id: set.Id,
        items: set.Subsets.map((subset) => ({
          id: `${set.Id}.${subset.Id}`,
          value: subset,
          label: subset.Name ? subset.Name : set.Name,
          renderContent: (props) => (
            <Checkbox
              label={subset.Name ? subset.Name : set.Name}
              isChecked={this.state.selectedSubsets.has(subset.Id)}
              onClick={() => handleAddSubsets(subset)}
            />
          ),
        })).sort((a, b) => (a.label.toUpperCase() > b.label.toUpperCase() ? 1 : -1)),
      })),
    ];

    /**
     * @fixme : this is a patch to avoid long text. It should be fixed in the upcoming version of Menu component
     */
    const getButtonText = () => {
      if (this.state.selectedSubsets.size === 0) {
        return this.props.resources.BimObjectDetails.SubsetCascadeLabel;
      }
      const buttonText = Array.from(this.state.selectedSubsets.keys())
        .map((selectedSubsetId) => {
          const selectedSubset = this.props.subsets.find(
            (subset) => subset.Id === selectedSubsetId
          );
          if (!selectedSubset) {
            return '';
          }
          return selectedSubset.Name ? selectedSubset.Name : selectedSubset.Set?.Name;
        })
        .join(', ');
      return buttonText;
    };

    const isEnableSetManagement = this.props.Settings.EnableSetsManagement;
    const shouldDisplaySubsetButton =
      this.state.smartDownload ||
      !Array.isArray(this.props.subsets) ||
      this.props.subsets.length === 0 ||
      !isEnableSetManagement;

    return (
      <div className={classNameGlobal} id={`detail-pdt-${this.props.bimobjectId}`}>
        {shouldDisplaySubsetButton ? (
          ''
        ) : (
          <StyledMenu>
            <Menu
              buttonText={getButtonText()}
              multi
              items={_.sortBy(menuOptions, (option) => option?.label)}
              menuOptions={{ maxHeight: space[2500] }}
              triggerOptions={{ style: { maxWidth: '50%' } }}
            />
          </StyledMenu>
        )}
        <PdfViewer
          url={this.state.pdfUrl}
          exitViewer={this.exitViewer}
          docName={this.state.selectedDocName}
          resources={this.props.resources}
        />
        <ImageViewer
          url={this.state.imageUrl}
          exitViewer={this.exitViewer}
          docName={this.state.selectedDocName}
          resources={this.props.resources}
        />
        <VideoViewer
          url={this.state.videoUrl}
          exitViewer={this.exitViewer}
          docName={this.state.selectedDocName}
          resources={this.props.resources}
        />

        <div className={visibilityPanel}>
          <div className="object-descriptif">
            <div className="col-xs-23">
              <ul
                className={`nav nav-tabs nav-tabs-detail${this.props.tabSelected === 'data' ? ' dataTabs' : ''
                  }${this.props.cardHeaderIsVisible || !this.props.displayed ? '' : ' hidden'}`}
              >
                <li
                  role="presentation"
                  className={this.props.tabSelected == 'data' ? 'active' : ''}
                >
                  <a data-toggle="tab" onClick={this.selectTabData}>
                    <span className="badge">{cptProperties}</span>
                    {this.props.resources.DetailsMenu.PropertiesListLabel}
                  </a>
                </li>
                <li
                  role="presentation"
                  className={this.props.tabSelected == 'models' ? 'active' : ''}
                >
                  <a data-toggle="tab" onClick={this.selectTabModels}>
                    <span className="badge">
                      {models3dFiltered.length + models2dFiltered.length}
                    </span>
                    {this.props.resources.DetailsMenu.ThreeDModelsLabel}
                  </a>
                </li>
                <li
                  role="presentation"
                  className={this.props.tabSelected == 'documents' ? 'active' : ''}
                >
                  <a data-toggle="tab" onClick={this.selectTabDocuments}>
                    <span className="badge">{documents.length}</span>
                    {this.props.resources.DetailsMenu.DocumentsListLabel}
                  </a>
                </li>
                {!_isPlugin ? (
                  <li
                    role="presentation"
                    className={this.props.tabSelected == 'qrcode' ? 'active' : ''}
                  >
                    <a data-toggle="tab" onClick={this.selectTabQRCode}>
                      {this.props.resources.BimObjectDetailsInfos.QRCodeLabel}
                    </a>
                  </li>
                ) : null}
              </ul>

              <div className={dataClass}>
                <a className="btn-compare align-right hidden">
                  <CompareIcon />
                </a>
                {hasGTIN ? (
                  <a
                    className="btn btn-blue align-right"
                    onClick={() => this.importTwobaData(gtin)}
                  >
                    Import 2ba Data
                  </a>
                ) : null}
                <ul id="variants-details" className="content-card">
                  {tableProperties}
                </ul>
              </div>
              <div className={modelsClass}>
                <h4>{this.props.resources.DetailsMenu.ThreeDModelsLabel}</h4>
                <table className="table table-stripped">
                  <thead>
                    <tr>
                      <th>{this.props.resources.BimObjectDetailsModels.FileNameLabel}</th>
                      <th className="text-center">
                        {this.props.resources.BimObjectDetailsModels.SizeLabel}
                      </th>
                      <th>{this.props.resources.BimObjectDetailsModels.SoftwareLabel}</th>
                      <th className="text-center">
                        {this.props.resources.BimObjectDetailsModels.LevelOfDetailLabel}
                      </th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>{models3d}</tbody>
                </table>
                {models3dFiltered.length == 0 ? (
                  <p className="no-model">
                    {this.props.resources.BimObjectDetailsModels.No3dModel}{' '}
                    {this.props.canEdit == true ? (
                      <Link
                        to={`/${this.props.Language}/bimobject/${this.props.bimobjectId}/edit/models`}
                        className="btn-second btn-blue"
                      >
                        {this.props.resources.BimObjectDetailsModels.AddModel}
                      </Link>
                    ) : (
                      ''
                    )}
                  </p>
                ) : (
                  ''
                )}

                <div className={models2dFiltered.length == 0 ? 'hidden' : ''}>
                  <h4>{this.props.resources.DetailsMenu.TwoDModelsLabel}</h4>
                  <table className="table table-stripped">
                    <thead>
                      <tr>
                        <th>{this.props.resources.BimObjectDetailsModels.FileNameLabel}</th>
                        <th className="text-center">
                          {this.props.resources.BimObjectDetailsModels.SizeLabel}
                        </th>
                        <th>{this.props.resources.BimObjectDetailsModels.SoftwareLabel}</th>
                        <th className="text-center">
                          {this.props.resources.BimObjectDetailsModels.LevelOfDetailLabel}
                        </th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>{models2d}</tbody>
                  </table>
                  {models2dFiltered.length == 0 ? (
                    <p className="no-model">
                      {this.props.resources.BimObjectDetailsModels.No2dModel}{' '}
                      {this.props.canEdit == true ? (
                        <Link
                          to={`/${this.props.Language}/bimobject/${this.props.bimobjectId}/edit/models`}
                          className="btn-second btn-blue"
                        >
                          {this.props.resources.BimObjectDetailsModels.AddModel}
                        </Link>
                      ) : (
                        ''
                      )}
                    </p>
                  ) : (
                    ''
                  )}
                </div>
                <Popper
                  open={self.state.popperDownloadChoiceIsOpen}
                  anchorEl={self.state.anchorRefButtonDownload}
                  transition
                  disablePortal
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                      }}
                    >
                      <Paper id="paper-download-choice">
                        <ClickAwayListener onClickAway={self.closeOpenPopperDownloadChoice}>
                          <MenuList>
                            <MenuItem
                              key="menuitem-smartdownload"
                              onClick={(event) => self.beginSmartDownload(smModelId, smModelName)}
                            >
                              {self.props.resources.BimObjectDetails.TooltipSmartDownload}
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>

              {smartDownload}

              <div className={documentsClass}>
                {documents.length > 0 ? (
                  <DocumentTable
                    documents={documents}
                    showLinkButton
                    onClickView={self.viewDocument}
                    onClickDownload={self.downloadDocument}
                  />
                ) : (
                  <p className="text-center">
                    {this.props.resources.BimObjectDetailsDocuments.EmptyState}
                  </p>
                )}
              </div>
              {!_isPlugin ? (
                <div className={qrcodeClass} id="qrcode-container">
                  <div className="row">
                    <div className="col-md-23 flex-container">
                      <p>
                        <Link
                          to={`/${this.props.Language}/bimobject/${this.props.bimobjectId}/details`}
                          className="link-qrcode"
                        >
                          {`${location.protocol}//${location.href.split('/')[2]}/${this.props.Language
                            }/bimobject/${this.props.bimobjectId}/details`}
                        </Link>
                      </p>
                      {!_isPlugin ? (
                        <a className="btn-print align-right" onClick={this.printQRCode}>
                          <PrintIcon />
                        </a>
                      ) : null}
                    </div>
                    <div
                      className={`col-md-23 text-center bimobject-qrcode-${this.props.bimobjectId}`}
                      id="qrcode-cm"
                    >
                      <QRCode
                        value={`${location.protocol}//${location.host}/${this.props.Language}/bimobject/${this.props.bimobjectId}/details`}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    resources:
      appState.Resources[appState.Language] != null ? appState.Resources[appState.Language] : [],
    ready: typeof appState.Resources[appState.Language] !== 'undefined',
    entityType: appState.EntityType,
    entityId: appState.EntityId,
    managementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    RoleKey: appState.RoleKey,
    Languages: appState.Languages,
    Language: appState.Language,
    PlatformUrl: appState.PlatformUrl,
    UserId: appState.UserId,
    SubDomain: appState.SubDomain,
    Settings: appState.Settings,
    DocumentTypes: appState.DocumentTypes,
    Softwares: appState.Softwares,
    subsets: selectAllSubsetsForDisplaySorted(store),
    selectFetchSubsetsIsPending: selectFetchAllSubsetsIsPending(store),
    selectFetchSubsetsIsSuccess: selectFetchAllSubsetsIsSuccess(store),
    selectFetchSubsetsIsError: selectFetchAllSubsetsIsError(store),
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchDocumentTypes: () => dispatch(fetchDocumentTypesAction()),
  fetchAllSubsets: () => dispatch(fetchAllSubsetsAction()),
  sendAnalytics: (event) => dispatch(sendAnalytics(event)),
});

const StyledMenu = styled.div({
  margin: '3px',
});

export default BimObjectDetails2 = connect(mapStateToProps, mapDispatchToProps)(BimObjectDetails2);