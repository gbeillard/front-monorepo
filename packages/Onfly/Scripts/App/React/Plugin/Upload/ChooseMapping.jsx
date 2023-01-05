/* eslint-disable react/prefer-es6-class */
import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import _ from 'underscore';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import { fetchPreferences as fetchPreferencesAction } from '../../../Reducers/preferences/actions';
import * as QWebChannelUtils from '../../../Utils/qwebchannelUtils';

// material ui icons
import store from '../../../Store/Store';

import MappingPropertiesListV2 from '../../Dictionary/MappingPropertiesListV2.jsx';

import PropertiesModal from '../../CommonsElements/PropertiesModal.jsx';
import { API_URL } from '../../../Api/constants';
import ModalDuplicateParameterName from './ModalDuplicateParameterName';
import {
  selectIsUploadMapping,
  selectOnflyUpload,
  selectPlatformUpload,
  selectSelectedGroups,
} from '../../../Reducers/groups/selectors';
import { selectPreferences } from '../../../Reducers/preferences/selectors';

const ChooseMapping = createReactClass({
  getInitialState() {
    return {
      enableMagicMapping: true,
      selectedTab: 0,
      selectedId: -1,
      PropertiesDomainToConnectList: [],
      PropertyMappingToConnect: null,
      PropertyMappingIsToConnectLater: false,
      LastDataTypeToConnect: '',
      ListIndexMenu: [],
      showModalDuplicateParameterName: false,
      TemporaryToken: this.props.TemporaryToken,
    };
  },

  componentDidMount() {
    this.props.fetchPreferences();
  },

  sendBundleWithMapping(bundles, bundleId) {
    QWebChannelUtils.sendMessage({
      Category: 'BundleListMapped',
      Action: 'set',
      Data: { BundleList: bundles, Id: bundleId },
    });
  },

  processUpload() {
    this.props.processUpload(
      this.props.selectedGroups,
      this.props.onflyUpload,
      this.props.platformUpload,
      this.sendBundleWithMapping
    );
  },

  handleClickButtonConnect(property, isToConnectLater) {
    // search if a parameter with the same name is already mapped
    let propertyToFind = null;
    _.each(this.props.mappingConnected, (domain) => {
      const propFind = _.find(
        domain.PropertyList,
        (prop) => prop.PropertyMappingConnected?.Name == property.Name ?? false
      );
      if (propFind != null) {
        propertyToFind = propFind;
      }
    });

    if (propertyToFind == null) {
      this.openModalProperties(property, isToConnectLater);
    } else {
      this.setState({
        showModalDuplicateParameterName: true,
        PropertyAlreadyMappedToConnect: propertyToFind,
        PropertyMappingToConnect: property,
      });
    }
  },

  openModalProperties(property, isToConnectLater) {
    this.getDictionaryPropertiesToConnect(property, isToConnectLater);
  },

  getDictionaryPropertiesToConnect(property, isToConnectLater) {
    store.dispatch({ type: 'LOADER', state: true });

    let url = `${API_URL}/api/ws/v2/${this.props.Language}/contentmanagement/${this.props.ManagementCloudId}/dictionary/mapping/property/connect/list?token=${this.props.TemporaryToken}`;

    if (this.props.SubDomain === 'community') {
      url = `${API_URL}/api/ws/v2/${this.props.Language}/dictionary/mapping/property/connect/list?token=${this.props.TemporaryToken}`;
    }

    fetch(url, {
      body: JSON.stringify({ CaoDataType: property.DataTypeName, CaoName: window._softwarePlugin }),
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((propertiesDomainToConnectList) => {
        this.setState({
          PropertyMappingToConnect: property,
          PropertiesDomainToConnectList: propertiesDomainToConnectList,
          PropertyMappingIsToConnectLater: isToConnectLater != null ? isToConnectLater : false,
          LastDataTypeToConnect: property.DataTypeName,
        });

        store.dispatch({ type: 'LOADER', state: false });
        $('#AddPropertyScreen').modal('show');
      });
  },

  scrollToElement(type, id) {
    if (this.state.ListIndexMenu != null && this.refList != null) {
      let index = -1;

      switch (type) {
        case 'domain-title':
          index = _.findLastIndex(this.state.ListIndexMenu, {
            type,
            id,
          });
          break;
        case 'connected-properties-list':
        case 'connect-later-title':
          index = _.findLastIndex(this.state.ListIndexMenu, {
            type,
          });
          break;
      }

      if (index > -1) {
        const indexToScroll = this.state.ListIndexMenu[index].index;

        this.refList.measureAllRows();
        this.refList.scrollToRow(indexToScroll);
      }
    }
  },

  handleClickDomainMenu(event, domain, i) {
    this.setState({ selectedTab: i });
    this.scrollToElement('domain-title', domain.Id);
  },

  updateDomainSelected(domainId) {
    const domainIdInt = parseInt(domainId);
    this.setState({ selectedTab: domainIdInt });
  },

  connectProperty(id, property) {
    this.handleCloseModalDuplicateParameterName();
    store.dispatch({
      type: 'connectUploadProperty',
      propertyToConnect: property,
      propertyConnected: this.state.PropertyMappingToConnect,
    });
  },

  disconnectProperty(id, propertyConnected) {
    store.dispatch({ type: 'disconnectUploadProperty', propertyConnected });
  },

  processMagicMapping() {
    store.dispatch({ type: 'processMagicMapping' });
  },

  setListRef(ref) {
    this.refList = ref;
  },

  setListIndexMenu(list) {
    this.state.ListIndexMenu = list;
  },

  handleCloseModalDuplicateParameterName() {
    this.setState({
      showModalDuplicateParameterName: false,
      PropertyAlreadyMappedToConnect: null,
      PropertyMappingToConnect: null,
    });
  },

  handleConfirmModalDuplicateParameterName() {
    this.connectProperty(null, this.state.PropertyAlreadyMappedToConnect);
  },

  render() {
    const self = this;

    if (this.props.IsUploadMapping) {
      this.processMagicMapping();
      this.processUpload();
      //store.dispatch({ type: 'LOADER', state: false });
    }
    let categoriesDisplay;
    if (this.props.mapping != null) {
      const domainsListNav = _.map(this.props.mapping, (domain, i) => (
        <Tab
          label={domain.Name}
          className="tab-button"
          key={domain.Name}
          onClick={(event) => self.handleClickDomainMenu(event, domain, i)}
        />
      ));
      categoriesDisplay = (
        <Tabs
          className="tabs-group"
          id="dictionary-domains"
          value={this.state.selectedTab}
          variant="scrollable"
        >
          {domainsListNav}
        </Tabs>
      );
    }

    return (
      <div id="modal-mapping-mono-object" className="choose-mapping">
        <div id="mapping-plugin">
          <div id="header-container">
            {/* <button className="close-popup" onClick={this.props.closeUI}><CloseIcon /></button> */}
            <h1>{this.props.resources.UploadObject.UploadObject}</h1>
          </div>
          <div
            id="result-container"
            className={this.props.nbObjects > 1 ? 'row modal-mapping-poly-objects' : 'row'}
          >
            <MappingPropertiesListV2
              SelectorDomainList="#dictionary-domains"
              HandleSelectorDomainList={this.updateDomainSelected}
              SetListRef={this.setListRef}
              SetListIndexMenu={this.setListIndexMenu}
              Resources={this.props.resources}
              ConnectedPropertiesList={this.props.mappingConnected}
              DisconnectProperty={this.disconnectProperty}
              PropertiesDomainList={this.props.mapping}
              HandleClickButtonConnect={this.handleClickButtonConnect}
              ShowVerticalDivider
            />
          </div>
          <div className="btn-container">
            <div>
              <Button className="btn-flat blue magic-mapping" onClick={this.processMagicMapping}>
                {this.props.resources.UploadObject.MagicMapping}
              </Button>
            </div>
            {/*categoriesDisplay*/}
            <Button variant="contained" className="btn-raised publish" onClick={this.processUpload}>
              {this.props.resources.UploadObject.Upload}
            </Button>
          </div>
        </div>
        <PropertiesModal
          properties={this.state.PropertiesDomainToConnectList}
          propertyMappingIdToConnect={self.state.PropertyMappingToConnect != null ? 1 : 0}
          connectProperty={self.connectProperty}
          disconnectProperty={self.disconnectProperty}
          propertyMappingIsToConnectLater={self.state.PropertyMappingIsToConnectLater}
          propertyMappingToConnect={this.state.PropertyMappingToConnect}
        />
        <ModalDuplicateParameterName
          open={this.state.showModalDuplicateParameterName}
          handleCancel={this.handleCloseModalDuplicateParameterName}
          handleConfirm={this.handleConfirmModalDuplicateParameterName}
          propertyName={this.state.PropertyAlreadyMappedToConnect?.Name}
          parameterName={this.state.PropertyMappingToConnect?.Name}
        />
      </div>
    );
  },
});

const mapDispatchToProps = (dispatch) => ({
  fetchPreferences: () => dispatch(fetchPreferencesAction()),
  processUpload: (selectedGroups, onflyUpload, platformUpload, callback) =>
    dispatch({
      type: 'setModelDataToBundle',
      selectedGroups,
      onflyUpload,
      platformUpload,
      callback,
    }),
});

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    resources: appState.Resources[appState.Language],
    Languages: appState.Languages,
    Language: appState.Language,
    objects: appState.objectsList,
    nbObjects: appState.objectsList.length,
    mapping: appState.mapping,
    mappingConnected: appState.mappingConnected,
    mappingRev: appState.mappingRev,
    objectRev: appState.objectRev,
    context: appState.context,
    ManagementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    SubDomain: appState.SubDomain,
    IsUploadMapping: selectIsUploadMapping(store),
    selectedGroups: selectSelectedGroups(store),
    onflyUpload: selectOnflyUpload(store),
    platformUpload: selectPlatformUpload(store),
    Preferences: selectPreferences(store),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseMapping);
