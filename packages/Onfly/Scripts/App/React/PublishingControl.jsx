/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import _ from 'underscore';

// material ui calls
import Button from '@material-ui/core/Button';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Switch from '@material-ui/core/Switch';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete.js';
import SuppressionModal from './CommonsElements/SuppressionModal.jsx';
import PropertiesModal from './CommonsElements/PropertiesModal.jsx';
import { API_URL } from '../Api/constants';

let PublishingControl = createReactClass({
  getInitialState() {
    return {
      properties: [],
      propertiesDictionnary: [],
      headerTitle: '',
      bodyContent: '',
      abortButtonTitle: '',
      confirmButtonTitle: '',
      confirmButtonStyle: '',
      urlImage: '',
      currentPropertyIdDelete: -1,
    };
  },

  componentWillMount() {
    this.loadContentManagementProperties();
    this.loadDictionnaryProperties();
  },

  loadContentManagementProperties() {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/properties/${this.props.Language}?token=${this.props.TemporaryToken}`,
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
        self.setState({ properties: json });
      });
  },

  loadDictionnaryProperties() {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/properties/${this.props.Language}/contentmanagement/${this.props.managementCloudId}/dictionnary?token=${this.props.TemporaryToken}`,
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
        self.setState({ propertiesDictionnary: json });
      });
  },

  openModalSelectProperties() {
    $('#AddPropertyScreen').modal('show');
  },

  changeMandatoryProperty(event) {
    const self = this;
    const propertyId = event.target.value.substring(1);
    const state = event.target.checked;
    const objectType = event.target.value.substring(0, 1) == 'g' ? 'generic' : 'manufacturer';

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/properties/${propertyId}/mandatory/${objectType}/${state}?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    ).then(() => {
      self.loadContentManagementProperties();
    });
  },

  confirmRemoveProperty(event) {
    this.state.currentPropertyIdDelete = event.currentTarget.dataset.id;
    $('#confirm-deletion-modal').modal('show');
  },

  cancelRemoveProperty() {
    this.state.currentPropertyIdDelete = -1;
    $('#confirm-deletion-modal').modal('hide');
  },

  removeProperty() {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/properties/remove/${this.state.currentPropertyIdDelete}?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    ).then(() => {
      $('#confirm-deletion-modal').modal('hide');
      self.loadContentManagementProperties();
    });
  },

  addProperty(propertyId, checked) {
    if (checked == true) {
      const self = this;

      fetch(
        `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/properties/add/${propertyId}?token=${this.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).then(() => {
        self.loadContentManagementProperties();
      });
    }
  },

  render() {
    const self = this;

    if (self.props.Settings.EnableDictionary) {
      const properties_row = _.map(this.state.properties, (item) => (
        <TableRow key={item.PropertyId}>
          <TableCell>
            <span className="ellipsis">{item.PropertyName}</span>
          </TableCell>
          <TableCell>
            <Switch
              checked={item.IsMandatoryGeneric}
              onChange={self.changeMandatoryProperty}
              value={`g${item.PropertyId}`}
              color="primary"
            />
          </TableCell>
          <TableCell>
            <Switch
              checked={item.IsMandatoryManufacturer}
              onChange={self.changeMandatoryProperty}
              value={`m${item.PropertyId}`}
              color="primary"
            />
          </TableCell>
          <TableCell>
            <IconButton
              aria-label={self.props.resources.EditClassificationsPage.HeadDelete}
              onClick={self.confirmRemoveProperty}
              data-id={item.PropertyId}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
      ));

      return (
        <div>
          <Paper style={{ padding: '15px', maxWidth: '1024px', margin: '0 auto' }}>
            <Button
              variant="contained"
              color="primary"
              className="pull-right"
              onClick={this.openModalSelectProperties}
            >
              {this.props.resources.ContentManagement.PropertyMandatoryAddProperties}
            </Button>
            <h3>{this.props.resources.ContentManagement.MandatoryPropertiesTitle}</h3>
            <Table id="table-properties-result">
              <TableHead style={{ width: '100%' }}>
                <TableRow>
                  <TableCell key="0" sortdirection={null}>
                    <span className="ellipsis">
                      {this.props.resources.EditClassificationsPage.HeadPropertyName}
                    </span>
                  </TableCell>
                  <TableCell key="1" sortdirection={null}>
                    <span className="ellipsis">
                      {this.props.resources.ContentManagement.HeadMandatoryGeneric}
                    </span>
                  </TableCell>
                  <TableCell key="2" sortdirection={null}>
                    <span className="ellipsis">
                      {this.props.resources.ContentManagement.HeadMandatoryManufacturer}
                    </span>
                  </TableCell>
                  <TableCell key="3" sortdirection={null}>
                    <span className="ellipsis">
                      {this.props.resources.EditClassificationsPage.HeadDelete}
                    </span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ maxHeight: '400px', overflow: 'auto' }}>
                {properties_row}
              </TableBody>
            </Table>
          </Paper>

          <PropertiesModal
            properties={this.state.propertiesDictionnary}
            currentSelectedProperties={this.state.properties}
            selectProperty={this.addProperty}
            disableCheckBoxSelected
            showBtnCreateNewProperty
            compatibleProperties={false}
          />

          <SuppressionModal
            headerTitle={
              this.props.resources.ContentManagement.PropertyMandatoryConfirmRemoveModalTitle
            }
            bodyContent={
              this.props.resources.ContentManagement.PropertyMandatoryConfirmRemoveModalBody
            }
            abortButtonTitle={this.props.resources.MetaResource.Cancel}
            abortButtonAction={this.cancelRemoveProperty}
            confirmButtonTitle={
              this.props.resources.ContentManagement.PropertyMandatoryConfirmRemoveModalButton
            }
            confirmButtonAction={this.removeProperty}
          />
        </div>
      );
    }

    return (
      <div className="text-center">
        <h1 className="loadingtext">BIM&CO - ONFLY</h1>
        <p>Error 403 Access Denied</p>
      </div>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    managementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    Language: appState.Language,
    resources: appState.Resources[appState.Language],
    Settings: appState.Settings,
  };
};

export default PublishingControl = connect(mapStateToProps)(PublishingControl);