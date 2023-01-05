import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';

import _ from 'underscore';
import LockIcon from '@material-ui/icons/Lock.js';
import ClearIcon from '@material-ui/icons/Clear.js';
import ModalManufacturerPublishingQuotaLimit from '../../ModalManufacturerPublishingQuotaLimit.jsx';
import { API_URL } from '../../../Api/constants';
import store from '../../../Store/Store';
import * as Utils from '../../../Utils/utils.js';

let EditorStepPhotos = createReactClass({
  getInitialState() {
    return {
      data: [],
      selectedPhoto: null,
      showModalManufacturerPublishQuota: false,
      manufacturerQuotaPublishVMList: [],
    };
  },

  componentDidMount() {
    this.loadImagesList();
  },

  loadImagesList() {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/photos/list/official?token=${this.props.TemporaryToken}`,
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
        self.setState({ data: json });
        store.dispatch({ type: 'LOADER', state: false });
      });
  },

  selectPhoto(event) {
    const id = event.target.dataset.pid;

    this.setState({ selectedPhoto: id });
  },

  setAsDefault(event) {
    const self = this;

    const id = event.target.dataset.pid;

    store.dispatch({ type: 'LOADER', state: true });

    fetch(
      `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/photos/setdefault/${id}?token=${this.props.TemporaryToken}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    ).then((response) => {
      self.loadImagesList();
    });
  },

  confirmDelete() {
    const self = this;
    store.dispatch({ type: 'LOADER', state: true });

    fetch(
      `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/photos/remove/${this.state.selectedPhoto}?token=${this.props.TemporaryToken}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    ).then((response) => {
      self.loadImagesList();
    });
  },

  onImageDrop(files) {
    const self = this;

    store.dispatch({ type: 'LOADER', state: true });

    const data = new FormData();
    data.append('file', files[0]);
    data.append('workspace', 'official');

    $.ajax({
      type: 'POST',
      url: `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/photos/upload?token=${this.props.TemporaryToken}`,
      data,
      processData: false,
      contentType: false,
      async: true,
      success(data) {
        self.loadImagesList();
      },
      error(XMLHttpRequest, textStatus, errorThrown) {
        store.dispatch({ type: 'LOADER', state: false });

        // L'upload de model n'est pas autorisé
        if (XMLHttpRequest.status == 403) {
          const manufacturerQuotaPublishVMList = XMLHttpRequest.responseJSON;

          if (manufacturerQuotaPublishVMList != null && manufacturerQuotaPublishVMList.length > 0) {
            self.setState({
              showModalManufacturerPublishQuota: true,
              manufacturerQuotaPublishVMList,
            });
            self.setState({
              showModalManufacturerPublishQuota: false,
            });
          }
        }
      },
    });
  },

  render() {
    let rows;
    const orderedRows = [];
    const self = this;

    if (this.state.data.length !== 0) {
      rows = _.map(this.state.data, (photo, i) => {
        const isDefault = photo.IsDefault;
        let buttonDefault;
        if (!isDefault) {
          buttonDefault = (
            <button
              className="btn-third btn-blue default-bimobject-photo"
              data-pid={photo.PhotoId}
              onClick={self.setAsDefault}
            >
              {self.props.resources.EditPhotoPage.SetDefaultBtn}
            </button>
          );
        }

        return (
          <div
            key={i}
            id={`first-${photo.IsDefault}`}
            className={`thumbnail default-${photo.IsDefault}`}
          >
            <img src={`${photo.PhotoPath}?w=150&h=150&mode=pad&scale=both`} alt="..." />
            <div className="thumbnail-overlay" />
            <span className="photo-size">{Utils.getReadableSize(photo.Size)}</span>
            {buttonDefault}
            <button
              className="btn-third btn-red delete-bimobject-photo"
              data-toggle="modal"
              data-target="#confirm-deletion-modal"
              data-pid={photo.PhotoId}
              onClick={self.selectPhoto}
            >
              {self.props.resources.EditPhotoPage.DeletePhotoBtn}
            </button>
          </div>
        );
      });

      const firstItem = rows.findIndex((i) => i.props.id == 'first-true');
      orderedRows.push(rows[firstItem]);
      rows.forEach((row) => {
        if (orderedRows.indexOf(row) == -1) {
          orderedRows.push(row);
        }
      });
    }

    let classOverlay = 'overlay';
    if (this.props.permissions.bimobject_photos) {
      classOverlay += ' hidden';
    }

    return (
      <div className="container-fluid">
        <div className="panel edit-object">
          <div className="col-md-7">
            <h3>{this.props.resources.EditPhotoPage.BlockTitle}</h3>
          </div>
          <div className="col-md-7 col-md-offset-1">
            <Dropzone
              multiple={false}
              accept="image/*"
              onDrop={this.onImageDrop}
              className="dropzone-area"
            >
              <h4>{this.props.resources.EditPhotoPage.DragBox}</h4>
              <p className="legende">
                {this.props.resources.EditPhotoPage.SupportedFiles}
                <br />
                {this.props.resources.EditPhotoPage.SizeMax.replace('{0}', '30')}
              </p>
            </Dropzone>
          </div>
          <div className="col-md-7 col-md-offset-1 bimobject-photos">{orderedRows}</div>
          <div className={classOverlay}>
            <p className="disabled-text">
              <LockIcon />
            </p>
          </div>
        </div>
        <div
          className="modal fade"
          id="confirm-deletion-modal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="confirmationModal"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <ClearIcon />
                </button>
                <h4 className="modal-title" id="myModalLabel">
                  {this.props.resources.DeletePhotoModal.ModalTitle}
                </h4>
              </div>
              <div className="modal-body">{this.props.resources.DeletePhotoModal.ModalText}</div>
              <div className="modal-footer">
                <button type="button" className="btn-second btn-grey" data-dismiss="modal">
                  {this.props.resources.DeletePhotoModal.CancelButton}
                </button>
                <button
                  type="button"
                  className="btn-second btn-red"
                  id="confirm-deletion-button"
                  data-dismiss="modal"
                  onClick={this.confirmDelete}
                >
                  {this.props.resources.DeletePhotoModal.ConfirmButton}
                </button>
              </div>
            </div>
          </div>
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
  };
};

export default EditorStepPhotos = connect(mapStateToProps)(EditorStepPhotos);