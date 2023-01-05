import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';

import _ from 'underscore';
import LockIcon from '@material-ui/icons/Lock';
import ClearIcon from '@material-ui/icons/Clear';
import CancelIcon from '@material-ui/icons/Cancel';
import store from '../../../../Store/Store';
import SearchPinsEditor from './SearchPinsEditor.jsx';
import ClassificationsComponent from '../../../CommonsElements/ClassificationsComponent.jsx';
import { API_URL } from '../../../../Api/constants';

// material ui icons

let EditorStepClassifications = createReactClass({
  getInitialState() {
    return {
      selectedNodeId: 0,
      bimObjectClassificationNodesList: [],
      pins: [],
      uselessProperties: [],
    };
  },

  componentWillMount() {
    this.loadBimObjectClassificationNode();
    this.loadBimObjectPins();
  },

  addPinToBimObject(id) {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/bimobjects/pin/add?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ objectsList: [this.props.bimObjectId], pinsList: [id] }),
      }
    ).then((response) => {
      self.loadBimObjectPins();
    });
  },

  removePinFromBimObject(pinId) {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/bimobjects/pin/remove?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ objectsList: [this.props.bimObjectId], pinsList: [pinId] }),
      }
    ).then((response) => {
      self.loadBimObjectPins();
    });
  },

  addClassificationNode(node) {
    const self = this;

    store.dispatch({ type: 'LOADER', state: true });

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${self.props.managementCloudId}/bimobject/${self.props.bimObjectId}/classification/node/add/${node.Id}/uselesspropertyinfo/${this.props.Language}?token=${self.props.TemporaryToken}`,
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
        if (json.length > 0) {
          self.setState({ uselessProperties: json, selectedNodeId: node.Id });
          store.dispatch({ type: 'LOADER', state: false });
          $('#useless-properties-modal').modal();
        } else {
          self.addClassificationNodeConfirm(node.Id, null);
        }
      });
  },

  addClassificationNodeConfirm(nodeId, properties_to_delete) {
    const self = this;

    store.dispatch({ type: 'LOADER', state: true });

    fetch(
      `${API_URL}/api/ws/v1/bimobject/${self.props.bimObjectId}/classification/node/add/${nodeId}?token=${self.props.TemporaryToken}&managementCloudId=${self.props.managementCloudId}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ PropertiesToRemove: properties_to_delete }),
      }
    ).then((response) => {
      self.loadBimObjectClassificationNode();
    });
  },

  confirmPropertiesToRemove() {
    const properties_to_remove = [];
    $('#container-useless-properties .useless-property-checkbox:checked').each((i, item) => {
      properties_to_remove.push($(item)[0].dataset.id);
    });

    this.addClassificationNodeConfirm(this.state.selectedNodeId, properties_to_remove);
  },

  checkBeforeRemoveClassification(node) {
    const self = this;
    const nodeId = node.Id;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${self.props.managementCloudId}/bimobject/${self.props.bimObjectId}/classification/node/delete/${nodeId}/uselesspropertyinfo/${self.props.Language}?token=${self.props.TemporaryToken}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
      })
      .then((listUselessProperty) => {
        if (listUselessProperty != null) {
          self.setState({ uselessProperties: listUselessProperty });

          if (listUselessProperty.length > 0) {
            $('#remove-classification-modal #RemoveAllUselessProperties').show();
          } else {
            $('#remove-classification-modal #RemoveAllUselessProperties').hide();
          }

          if (listUselessProperty.length > 0) {
            $('#remove-classification-modal #confirmRemoveClassification').data('id', nodeId);
            $('#remove-classification-modal').modal();
          } else {
            // Suppression de la classification
            self.removeClassificationNode(nodeId);
          }
        }
      });
  },

  clickConfirmRemoveClassification(event) {
    const nodeId = $(event.currentTarget).data('id');

    this.removeClassificationNode(nodeId);
  },

  removeClassificationNode(nodeId) {
    store.dispatch({ type: 'LOADER', state: true });

    const self = this;

    const propertiesToRemoveList = [];
    $('#RemoveAllUselessProperties .useless-property-checkbox:checked').each((i, item) => {
      propertiesToRemoveList.push($(item)[0].dataset.id);
    });

    fetch(
      `${API_URL}/api/ws/v1/bimobject/${self.props.bimObjectId}/classification/node/remove/${nodeId}?token=${self.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertiesToRemoveList),
      }
    ).then((response) => {
      self.loadBimObjectClassificationNode();
    });
  },

  loadBimObjectPins() {
    const self = this;
    // Tags
    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${self.props.managementCloudId}/bimobject/${self.props.bimObjectId}/pin/list?token=${self.props.TemporaryToken}`,
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
        self.setState({ pins: json });
      });
  },

  loadBimObjectClassificationNode() {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/bimobject/${self.props.bimObjectId}/classification/node/list/${self.props.Language}?token=${self.props.TemporaryToken}`,
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
        store.dispatch({ type: 'LOADER', state: false });
      });
  },

  render() {
    const self = this;

    let classOverlayClassif = 'overlay';
    if (this.props.permissions.bimobject_classifications) {
      classOverlayClassif += ' hidden';
    }

    const pins = [];
    _.map(this.state.pins, (pin, i) => {
      pins.push(
        <div
          className="tag xs"
          key={pin.PinId}
          onClick={() => self.removePinFromBimObject(pin.PinId)}
        >
          <span>{pin.PinName}</span> <CancelIcon />
        </div>
      );
    });

    // useless properties when changing classificationNode
    const uselessProperties = [];
    _.map(this.state.uselessProperties, (property, i) => {
      uselessProperties.push(
        <li key={`useless-property-${property.Id}`}>
          <div className="container-fluid useless-property">
            <div className="row">
              <div className="col-md-7">
                <input
                  type="checkbox"
                  defaultChecked="checked"
                  className="useless-property-checkbox"
                  data-id={property.Id}
                />{' '}
                {property.Name}
              </div>
              <div className="col-md-15 col-md-offset-1">{property.Description}</div>
            </div>
          </div>
        </li>
      );
    });

    return (
      <div>
        <div className="container-fluid">
          <div className="panel edit-object">
            <div className="col-md-7">
              <h3>{this.props.resources.TagSearch.TagBlockTitle}</h3>
              <p>{this.props.resources.TagSearch.TagBlockDescription}</p>
            </div>
            <div className="col-md-15 col-md-offset-1">
              <div className="col-md-11 col-sm-23">
                <SearchPinsEditor
                  managementCloudId={this.props.managementCloudId}
                  TemporaryToken={this.props.TemporaryToken}
                  bimObjectId={this.props.bimObjectId}
                  addPinToBimObject={this.addPinToBimObject}
                  loadBimObjectPins={this.loadBimObjectPins}
                  resources={this.props.resources}
                />
              </div>
              <div className="col-md-11 col-md-offset-1 col-sm-23">{pins}</div>
            </div>
          </div>

          <div className="panel edit-object">
            <div className="col-md-23">
              <h3>{this.props.resources.EditClassificationsPage.ClassificationBlockTitle}</h3>
              <p>{this.props.resources.EditClassificationsPage.ClassificationBlockDescr}</p>
            </div>
            <div className="col-md-23">
              <ClassificationsComponent
                selectNode={this.addClassificationNode}
                selectedNodes={this.state.bimObjectClassificationNodesList}
                removeSelectedNode={this.checkBeforeRemoveClassification}
                selectedItem={this.state.bimObjectClassificationNodesList}
              />
            </div>
            <div className={classOverlayClassif}>
              <p className="disabled-text">
                <LockIcon />
              </p>
            </div>
          </div>

          <div
            className="modal fade"
            id="useless-properties-modal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="userPropertiesModal"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-large">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <ClearIcon />
                  </button>
                  <h4 className="modal-title" id="myModalLabel">
                    {this.props.resources.EditClassificationsPage.UseLessPropertiesModalTitle}
                  </h4>
                </div>
                <div className="modal-body">
                  <h4>{this.props.resources.EditClassificationsPage.UseLessPropertiesModalText}</h4>
                  <div id="container-useless-properties">
                    <ul className="uselessproperties">{uselessProperties}</ul>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-second btn-grey" data-dismiss="modal">
                    {this.props.resources.MetaResource.Cancel}
                  </button>
                  <button
                    type="button"
                    className="btn-second btn-blue"
                    data-dismiss="modal"
                    onClick={this.confirmPropertiesToRemove}
                  >
                    {this.props.resources.EditClassificationsPage.RemoveUseLessPropertiesAndAddNode}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="remove-classification-modal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="removeClassificationModal"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <ClearIcon />
                  </button>
                  <h4 className="modal-title">
                    {this.props.resources.PropertiesGroups.RemoveClassificationQuestion}
                  </h4>
                </div>
                <div className="modal-body">
                  <div id="RemoveAllUselessProperties">
                    <h4>
                      {this.props.resources.EditClassificationsPage.UseLessPropertiesModalTitle}
                    </h4>
                    <p>{this.props.resources.EditClassificationsPage.UseLessPropertiesModalText}</p>
                    <ul className="uselessproperties">{uselessProperties}</ul>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-second btn-grey" data-dismiss="modal">
                    {this.props.resources.MetaResource.Cancel}
                  </button>
                  <button
                    type="button"
                    id="confirmRemoveClassification"
                    className="btn-second btn-blue"
                    data-dismiss="modal"
                    onClick={this.clickConfirmRemoveClassification}
                  >
                    {this.props.resources.MetaResource.Confirm}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;
  const { classificationsState } = store;

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
  };
};

export default EditorStepClassifications = connect(mapStateToProps)(EditorStepClassifications);
