/* eslint-disable no-underscore-dangle */
import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import _ from 'underscore';
import ObjectUpgrade from './ObjectUpgrade.jsx';
import store from '../../../../Store/Store';

import Companies from './Companies.jsx';
import Catalogs from './Catalogs.jsx';
import NameAndDescription from './NameAndDescription.jsx';
import Revisions from './Revisions.jsx';
import Links from './Links.jsx';
import Manufacturers from './Manufacturer/Manufacturers.jsx';
import DistributionCountries from './DistributionCountries.jsx';
import ModalManufacturerPublishingQuotaLimit from '../../../ModalManufacturerPublishingQuotaLimit.jsx';
import ManufacturerTags from './Manufacturer/ManufacturerTags.jsx';
import { API_URL } from '../../../../Api/constants';

// mapping pour plus de facilité de travail ensuite
const objectTypeRef = ['userContent', 'genericOfficial', 'official'];

let EditorInformation = createReactClass({
  getInitialState() {
    return {
      objectType:
        this.props.initialData != null
          ? objectTypeRef[this.props.initialData.ObjectType]
          : objectTypeRef[0],
      isChanged: false,
      newObjectType: null,
      selectedManuf: 0,
      selectedCompany: 0,
      loading: false,
      catalogs: [],
      catalogList: [],
      selectedCatalogs: [],
      manufacturer: this.props.initialData != null ? this.props.initialData.Manufacturer : null,
      company: this.props.initialData != null ? this.props.initialData.ContentPartner : null,
      countries: null,
      countriesSelected: null,
      bimObjectId: this.props.bimObjectId,
      showModalManufacturerPublishQuota: false,
      manufacturerQuotaPublishVMList: [],
      manufacturerTag:
        this.props.initialData != null ? this.props.initialData.ManufacturerTag : null,
    };
  },

  componentDidMount() {
    if (
      this.props.bimObjectId != null &&
      this.props.initialData != null &&
      this.props.initialData.Manufacturer != null
    ) {
      this._getCatalogsForManufacturer(this.props.initialData.Manufacturer.Id);
      this._getBimObjectCatalogsList(this.props.bimObjectId);
      this._getCountriesForManufacturer(this.props.initialData.Manufacturer.Id);
      this._getBimObjectCountries(this.props.bimObjectId);
    } else if (this.props.bimObjectId == null) {
      const state = this.getInitialState();
      state.objectType = 'userContent';
      this.setState(state);
    }
  },

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.bimObjectId != null &&
      nextProps.initialData != null &&
      nextProps.initialData.Manufacturer != null
    ) {
      this._getCatalogsForManufacturer(nextProps.initialData.Manufacturer.Id);
      this._getBimObjectCatalogsList(nextProps.bimObjectId);
      this._getCountriesForManufacturer(nextProps.initialData.Manufacturer.Id);
      this._getBimObjectCountries(nextProps.bimObjectId);
    } else if (nextProps.bimObjectId == null) {
      const state = this.getInitialState();
      state.objectType = 'userContent';
      this.setState(state);
    } else if (nextProps.initialData != null) {
      this.setState({
        manufacturer: nextProps.initialData.Manufacturer,
        company: nextProps.initialData.ContentPartner,
        manufacturerTag: nextProps.initialData.ManufacturerTag,
      });
    }
  },

  _handleChangedStatus() {
    const radioClicked = $("input:radio[name='objectType']:checked").val();
    if (
      (radioClicked == this.state.newObjectType &&
        this.state.newObjectType == this.state.objectType) ||
      (radioClicked == this.state.objectType && this.props.bimObjectId == null)
    ) {
      this.setState({ isChanged: false, newObjectType: null });
    } else {
      this.setState({ isChanged: true, newObjectType: radioClicked });
    }
  },

  _getCatalogsForManufacturer(manufacturerId) {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/manufacturer/${manufacturerId}/catalogs/list/${this.props.Language}?token=${this.props.TemporaryToken}`,
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
        self.setState({ catalogList: json });
      });
  },

  _getBimObjectCatalogsList(bimObjectId) {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/bimobject/${bimObjectId}/catalogs/list/${this.props.Language}?token=${this.props.TemporaryToken}`,
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
        self.setState({ selectedCatalogs: json });
      });
  },

  _getCountriesForManufacturer(manufacturerId) {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/manufacturer/${manufacturerId}/countries/list/${this.props.Language}?token=${this.props.TemporaryToken}`,
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
        self.setState({ countries: json });
      });
  },

  _getBimObjectCountries(bimObjectId) {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/bimobject/${bimObjectId}/countries/list/${this.props.Language}?token=${this.props.TemporaryToken}`,
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
        self.setState({ countriesSelected: json });
      });
  },

  _handleObjectUpgrade(event) {
    event.preventDefault();
    const self = this;

    const newType = $("input:radio[name='objectType']:checked").val();

    // On a besoin d'appeler l'api avec un type capitalisé, pour pouvoir le parser correctement dnas l'enum
    const newTypeCapitalized = newType[0].toUpperCase() + newType.slice(1);

    if (this.props.bimObjectId == null) {
      let manufacturer = null;
      let company = null;

      if (newType == 'official') {
        manufacturer = _.find(
          this.props.manufacturersAuthorization,
          (manufacturerTmp) => manufacturerTmp.Id == self.state.selectedManuf
        );
      }

      if (newType == 'genericOfficial') {
        company = _.find(
          this.props.companiesAuthorization,
          (companyTmp) => companyTmp.Id == self.state.selectedCompany
        );
      }

      self.setState({
        newObjectType: newType,
        isChanged: false,
        manufacturer,
        company,
      });
    } else if (newType == 'official' && this.state.selectedManuf != 0) {
      store.dispatch({ type: 'LOADER', state: true });

      let httpResponseStatus;

      fetch(
        `${API_URL}/api/ws/v2/bimobject/${this.props.bimObjectId}/manufacturer/${this.state.selectedManuf}/update?token=${this.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => {
          httpResponseStatus = response.status;
          store.dispatch({ type: 'LOADER', state: false });
          return response.json();
        })
        .then((json) => {
          // L'assignation n'est pas autorisé
          if (httpResponseStatus == 403) {
            const manufacturerQuotaPublishVMList = json;

            if (
              manufacturerQuotaPublishVMList != null &&
              manufacturerQuotaPublishVMList.length > 0
            ) {
              self.setState({
                showModalManufacturerPublishQuota: true,
                manufacturerQuotaPublishVMList,
              });
              self.setState({
                showModalManufacturerPublishQuota: false,
              });
            }
          } else {
            self.props.refreshInformation();
            self.setState({
              objectType: newType,
              isChanged: false,
              loading: false,
              selectedCatalogs: null,
              manufacturer: json.Manufacturer,
              manufacturerTag: json.ManufacturerTag,
              company: json.ContentPartner,
              selectedManuf: 0,
              selectedCompany: 0,
            });

            self._getCatalogsForManufacturer(json.Manufacturer.Id);
            self._getBimObjectCatalogsList(self.props.bimObjectId);
            self._getCountriesForManufacturer(json.Manufacturer.Id);
            self._getBimObjectCountries(self.props.bimObjectId);
          }
        });
    } else if (newType == 'genericOfficial') {
      store.dispatch({ type: 'LOADER', state: true });

      fetch(
        `${API_URL}/api/ws/v2/bimobject/${this.props.bimObjectId}/company/${this.state.selectedCompany}/update?token=${this.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).then(() => {
        fetch(
          `${API_URL}/api/ws/v2/bimobject/${self.props.bimObjectId}/type/${newTypeCapitalized}/update?token=${self.props.TemporaryToken}`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        )
          .then((response) => {
            store.dispatch({ type: 'LOADER', state: false });
            return response.json();
          })
          .then((json) => {
            self.props.refreshInformation();
            self.setState({
              objectType: objectTypeRef[json.DisplayObjectType],
              isChanged: false,
              loading: false,
              selectedCatalogs: null,
              manufacturer: json.Manufacturer,
              company: json.ContentPartner,
              manufacturerTag: json.ManufacturerTag,
              selectedManuf: 0,
              selectedCompany: 0,
            });
          });
      });
    } else if (this.state.objectType != this.state.newObjectType) {
      store.dispatch({ type: 'LOADER', state: true });

      fetch(
        `${API_URL}/api/ws/v2/bimobject/${this.props.bimObjectId}/type/${newTypeCapitalized}/update?token=${this.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => {
          store.dispatch({ type: 'LOADER', state: false });
          return response.json();
        })
        .then((json) => {
          self.props.refreshInformation();
          self.setState({
            objectType: objectTypeRef[json.DisplayObjectType],
            isChanged: false,
            loading: false,
            selectedCatalogs: null,
            manufacturer: json.Manufacturer,
            company: json.ContentPartner,
            manufacturerTag: json.ManufacturerTag,
            selectedManuf: 0,
            selectedCompany: 0,
          });
        });
    } else {
      this.setState({ isChanged: false });
    }
  },

  _handleChooseManuf(event) {
    const manufId = event != null ? event.currentTarget.dataset.mid : 0;

    // Dom manipulation to style the selected manufacturer
    const manufs = $(this.refs.manufs).children();
    _.each(manufs, (manuf) => {
      $(manuf).removeClass('selected');
    });
    if (event != null) {
      $(event.currentTarget).addClass('selected');
    }

    this.setState({ selectedManuf: manufId });
  },

  _handleChooseCompany(event) {
    const companyId = event.currentTarget.dataset.mid;

    // Dom manipulation to style the selected company
    const companies = $(this.refs.companies).children();
    _.each(companies, (company) => {
      $(company).removeClass('selected');
    });
    $(event.currentTarget).addClass('selected');

    this.setState({ selectedCompany: companyId });
  },

  _handleChooseManufacturerTag(tag, newObjectType, isCreationMode = false) {
    if (isCreationMode === false) {
      this.props.refreshInformation();
    }
    this.setState({
      manufacturerTag: tag,
      objectType: newObjectType,
      newObjectType,
      isChanged: false,
    });
  },

  render() {
    let userContentObject;
    let officialObject;
    let manufBlock;
    let genericOfficialCompaniesBlock;
    const self = this;

    if (
      (this.state.objectType == 'userContent' && this.props.bimObjectId != null) ||
      (this.state.objectType == 'genericOfficial' && this.props.bimObjectId != null) ||
      (this.state.objectType == 'official' &&
        this.state.newObjectType != 'userContent' &&
        this.state.manufacturerTag != null &&
        this.state.manufacturer == null)
    ) {
      userContentObject = (
        <span>
          <Companies
            initialData={this.state.company}
            bimobjectId={this.props.bimObjectId}
            companyList={this.props.companiesAuthorization}
            resources={this.props.resources}
            isAuthorized={this.props.companyAuthorized}
            objectType={this.state.objectType}
            TemporaryToken={this.props.TemporaryToken}
          />
        </span>
      );
      if (this.state.objectType == 'official' && this.state.manufacturerTag != null) {
        userContentObject = (
          <span>
            <ManufacturerTags
              initialData={this.state.manufacturerTag}
              bimObjectId={this.props.bimObjectId}
              resources={this.props.resources}
              isAuthorized={this.props.manufacturerAuthorized}
              language={this.props.Language}
              _handleChooseManufacturerTag={this._handleChooseManufacturerTag}
              managementCloudId={this.props.managementCloudId}
              manufacturerCreate={this.state.selectedManuf}
              companyCreate={this.state.selectedCompany}
              TemporaryToken={this.props.TemporaryToken}
            />

            <Companies
              initialData={this.state.company}
              bimobjectId={this.props.bimObjectId}
              companyList={this.props.companiesAuthorization}
              resources={this.props.resources}
              isAuthorized={this.props.companyAuthorized}
              objectType={this.state.objectType}
              TemporaryToken={this.props.TemporaryToken}
            />
          </span>
        );
      }
    } else if (this.state.objectType === 'official' && this.state.manufacturer != null) {
      const companiesForManufacturer = _.filter(this.props.companiesAuthorization, (company) => {
        const manuf_authorized = _.map(company.ManufacturerAuthorized, (manuf) => {
          if (manuf.Id == self.state.manufacturer.Id) {
            return manuf;
          }
        });

        return manuf_authorized.length > 0;
      });

      officialObject = (
        <span>
          <Catalogs
            bimobjectId={this.props.bimObjectId}
            selectedCatalogs={this.state.selectedCatalogs}
            catalogList={this.state.catalogList}
            manufacturer={this.state.manufacturer}
            isAuthorized={this.props.catalogsAuthorized}
            resources={this.props.resources}
            language={this.props.Language}
            TemporaryToken={this.props.TemporaryToken}
            _getBimObjectCatalogsList={this._getBimObjectCatalogsList}
          />

          <DistributionCountries
            canEditManufacturer={this.props.canEditManufacturer}
            isAuthorized={this.props.countriesAuthorized}
            resources={this.props.resources}
            countries={this.state.countries}
            countriesSelected={this.state.countriesSelected}
            manufacturerId={this.state.manufacturer.Id}
            TemporaryToken={this.props.TemporaryToken}
            bimObjectId={this.props.bimObjectId}
          />

          <Companies
            initialData={this.state.company}
            bimobjectId={this.props.bimObjectId}
            companyList={companiesForManufacturer}
            resources={this.props.resources}
            isAuthorized={this.props.companyAuthorized}
            objectType={this.state.objectType}
            TemporaryToken={this.props.TemporaryToken}
          />
        </span>
      );

      manufBlock = (
        <Manufacturers
          manuf={this.state.manufacturer}
          resources={this.props.resources}
          isAuthorized={this.props.manufacturerAuthorized}
        />
      );
    } else if (
      this.state.newObjectType === 'official' &&
      this.props.bimObjectId === null &&
      this.state.manufacturer !== null
    ) {
      manufBlock = (
        <Manufacturers
          manuf={this.state.manufacturer}
          resources={this.props.resources}
          isAuthorized={this.props.manufacturerAuthorized}
        />
      );
    }

    let classNameOverlay = '';
    let classNameOverlayContainer = '';
    if (this.state.isChanged) {
      classNameOverlay = 'overlay';
      classNameOverlayContainer = 'overlay-container';
    }

    return (
      <div>
        <ObjectUpgrade
          objectType={this.state.objectType}
          isChanged={this.state.isChanged}
          newObjectType={this.state.newObjectType}
          resources={this.props.resources}
          selectedManufacturer={this.state.selectedManuf}
          selectedCompany={this.state.selectedCompany}
          isAuthorized={this.props.objectTypeAuthorized}
          isGenericAuthorizedPartner={this.props.isGenericAuthorizedPartner}
          userManufacturers={this.props.manufacturersAuthorization}
          userCompanies={this.props.companiesAuthorization}
          _handleSelectCompany={this._handleChooseCompany}
          _handleSelectManuf={this._handleChooseManuf}
          _handleChangedStatus={this._handleChangedStatus}
          _handleObjectUpgrade={this._handleObjectUpgrade}
          manufacturerTag={this.state.manufacturerTag}
          _handleChooseManufacturerTag={this._handleChooseManufacturerTag}
          bimObjectId={this.props.bimObjectId}
          manufacturerAuthorized={this.props.manufacturerAuthorized}
          language={this.props.Language}
          managementCloudId={this.props.managementCloudId}
          manufacturerCreate={this.state.selectedManuf}
          companyCreate={this.state.selectedCompany}
          TemporaryToken={this.props.TemporaryToken}
        />

        <div className={classNameOverlayContainer}>
          {manufBlock}
          {genericOfficialCompaniesBlock}

          <NameAndDescription
            data={this.props.langs}
            bimObjectId={this.props.bimObjectId}
            additionalLanguages={this.props.additionalLangOptions}
            languages={this.props.Languages}
            isAuthorized={this.props.nameAuthorized}
            resources={this.props.resources}
            managementCloudId={this.props.managementCloudId}
            TemporaryToken={this.props.TemporaryToken}
            language={this.props.Language}
            objectTypeCreate={
              this.state.newObjectType != null ? this.state.newObjectType : this.state.objectType
            }
            manufacturerCreate={this.state.selectedManuf}
            companyCreate={this.state.selectedCompany}
            refreshInformation={this.props.refreshInformation}
            EnableAutomaticTranslation={this.props.Settings.EnableAutomaticTranslation}
            manufacturerTag={this.state.manufacturerTag}
          />

          <Revisions
            bimObjectId={this.props.bimObjectId}
            isAuthorized={this.props.revisionsAuthorized}
            resources={this.props.resources}
            TemporaryToken={this.props.TemporaryToken}
          />

          <Links
            isAuthorized={this.props.linksAuthorized}
            bimObjectId={this.props.bimObjectId}
            resources={this.props.resources}
            TemporaryToken={this.props.TemporaryToken}
          />

          {userContentObject}
          {officialObject}

          <div className={classNameOverlay} />
        </div>
        <ModalManufacturerPublishingQuotaLimit
          showModalManufacturerPublishQuota={this.state.showModalManufacturerPublishQuota}
          manufacturerQuotaPublishVMList={this.state.manufacturerQuotaPublishVMList}
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
    Settings: appState.Settings,
  };
};

export default EditorInformation = connect(mapStateToProps)(EditorInformation);