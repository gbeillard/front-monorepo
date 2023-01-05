import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import _ from 'underscore';
import { Input } from '@bim-co/componentui-foundation';

import Button from '@material-ui/core/Button';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward.js';
import WarningIcon from '@material-ui/icons/Warning.js';

import * as QWebChannelUtils from '../../../Utils/qwebchannelUtils.js';
import PropertiesDomains from './PropertiesDomains.jsx';
import { API_URL } from '../../../Api/constants';
import { setLoader as setLoaderAction } from '../../../Reducers/app/actions';
import iconSearch from '../../../../../Content/images/icon-search.svg';
import { selectPluginDictionaryLanguage } from '../../../Reducers/plugin/selectors';
import {
  selectToken,
  selectResources,
  selectManagementCloudId,
} from '../../../Reducers/app/selectors';

// todo: migrer en composant fonctionnel
const PluginDownloadProperties = createReactClass({
  getInitialState() {
    return {
      propertiesDomainList: [],
      selectedProperties: [],
      searchText: '',
    };
  },

  componentDidMount() {
    this.getPropertiesDomains();
  },

  closeUI() {
    QWebChannelUtils.sendMessage({
      Category: 'CancelDownloadProperties',
      Action: 'set',
      Data: null,
    });
  },

  getPropertiesDomains() {
    const self = this;

    this.props.setLoader(true);

    // todo: api_url en NODE_ENV
    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/properties/officialsearch/${this.props.dictionaryLanguage}?token=${this.props.temporaryToken}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => (response.status == 200 ? response.json() : []))
      .then((propertiesDomainList) => {
        if (Array.isArray(propertiesDomainList)) {
          self.setState({ propertiesDomainList });
        }
        self.props.setLoader(false);
      });
  },

  selectProperty(propertyId, checked, property) {
    // todo: séparer en 2 méthodes
    if (checked) {
      // créée une copie du tableau avec le nouvel élement à la fin
      const selectedProperties = [...this.state.selectedProperties, property];
      this.setState({ selectedProperties });
      return;
    }

    // créée une copie du tableau sans l'élement à l'id spécifié
    const selectedProperties = this.state.selectedProperties.filter(
      (property) => property.Id !== propertyId
    );
    this.setState({ selectedProperties });
  },

  handleChangePropertyNature(property, nature) {
    // update property nature
    const newProperty = { ...property, Nature: nature };

    const domainIndex = _.findIndex(
      this.state.propertiesDomainList,
      (value) => value.DomainId === property.DomainId
    );
    const propertyDomainIndex = _.findIndex(
      this.state.propertiesDomainList[domainIndex].Properties,
      (value) => value.Id === property.Id
    );

    const newDomainsList = [...this.state.propertiesDomainList];
    newDomainsList[domainIndex].Properties[propertyDomainIndex] = newProperty;

    // on retire la propriété si selectionnée et on l'ajoute la propriété mise à jour :
    const selectedProperties = this.state.selectedProperties.filter(
      (prop) => prop.Id !== property.Id
    );
    const selectedPropertiesFinal = [...selectedProperties, newProperty];

    this.setState({
      propertiesDomainList: newDomainsList,
      selectedProperties: selectedPropertiesFinal,
    });
  },

  handleSearchChange(event) {
    const self = this;
    const searchText = event.currentTarget.value;

    this.state.searchText = searchText;

    setTimeout(() => {
      if (self.state.searchText === searchText) {
        self.setState({ searchText });
      }
    }, 500);
  },

  finish() {
    const list = _.map(this.state.selectedProperties, (value) => ({
      Name: value.Name,
      IsEditable: value.IsEditable,
      CaoParameterGroup: value.CaoParameterGroup,
      CaoParameterTypeName: value.CaoParameterTypeName,
      DataType: value.DataTypeId,
      CaoMappingKey: value.CaoMappingKey,
      CaoPlatformSpecificData: {
        CAD_ParameterType: value.Nature === 0 ? 'Type' : 'Instance',
        CAD_MappingType: 'Shared',
      },
    }));

    // reset search
    this.setState({ selectedProperties: [], searchText: '' });

    // send properties with socket
    QWebChannelUtils.sendMessage({
      Category: 'sendpropertieslist',
      Action: 'set',
      Data: { PropertiesList: list },
    });
  },

  render() {
    return (
      <div id="modal-mapping-mono-object" className="choose-properties">
        <div id="mapping-plugin">
          <div id="header-container">
            <h1>{this.props.resources.DownloadProperties?.DownloadPropertiesTitle}</h1>
          </div>
          <div id="result-container">
            <div id="search-bar-component">
              <Input
                placeholder={this.props.resources.ContentManagementDictionary?.Search}
                onChange={this.handleSearchChange}
                iconLeft={iconSearch}
              />
            </div>
            <PropertiesDomains
              resources={this.props.resources}
              domains={this.state.propertiesDomainList}
              currentSelectedProperties={this.state.selectedProperties}
              searchText={this.state.searchText}
              selectProperty={this.selectProperty}
              multiSelection
              showNature
              changePropertyNature={this.handleChangePropertyNature}
            />
          </div>
          <div className="btn-container bottom-container">
            <div>
              <WarningIcon className="warning" />
              <span>{this.props.resources.DownloadProperties?.DownloadPropertiesWarning}</span>
            </div>
            <span className="properties-selected">
              {`${this.state.selectedProperties.length} ${this.props.resources.DownloadProperties?.DownloadPropertiesSelected}`}
            </span>
            <Button
              variant="contained"
              className="btn-raised publish pull-right"
              onClick={this.finish}
            >
              {this.props.resources.UploadObject?.ContinueButton} <ArrowForwardIcon />
            </Button>
          </div>
        </div>
      </div>
    );
  },
});

const mapStateToProps = (store) => {
  const { appState } = store;

  return {
    dictionaryLanguage: selectPluginDictionaryLanguage ?? appState.Language,
    resources: selectResources,
    managementCloudId: selectManagementCloudId,
    temporaryToken: selectToken,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setLoader: (display) => dispatch(setLoaderAction(display)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PluginDownloadProperties);