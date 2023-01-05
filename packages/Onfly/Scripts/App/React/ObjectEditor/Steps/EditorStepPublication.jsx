import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'underscore';
import toastr from 'toastr';

// material ui icons
import ClearIcon from '@material-ui/icons/Clear';
import { Button } from '@bim-co/componentui-foundation';
import { redirectOptions } from './Properties/utils/redirectOptions';
import * as LibraryApi from '../../../Api/LibraryApi.js';
import store from '../../../Store/Store';

import { API_URL } from '../../../Api/constants';
import { RoutePaths } from '../../Sidebar/RoutePaths';
import { history } from '../../../history';
import { retrieveUrl } from './Properties/utils/retrieveUrl';

let EditorStepPublication = createReactClass({
  getInitialState() {
    return {
      status: '',
      missingData: [],
      missingProperties: [],
      isObjectCreator: false,
    };
  },

  componentDidMount() {
    this.getBimObjectInformation(this.props.Language);
  },

  componentDidUpdate(prevProps) {
    if (this.props.Language !== prevProps.Language) {
      this.getBimObjectInformation(prevProps.Language);
    }
  },

  handlePublish(redirectOption) {
    store.dispatch({ type: 'LOADER', state: false });
    if (this.props.shouldOpenRevisionModal) {
      return this.props.handleOpenRevisionModal(redirectOption);
    }
    return history.push(retrieveUrl(redirectOption, this.props.Language, this.props.bimObjectId));
  },

  // START API calls
  getBimObjectInformation(language) {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/informations/contentmanagement/${this.props.ManagementCloudId}/bimobject/${this.props.bimObjectId}/${language}?token=${this.props.TemporaryToken}`,
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
        const isObjectCreator = json.CreatorId.toString() == self.props.UserId.toString();

        self.setState({
          status: json.Status,
          missingData: json.MissingData,
          missingProperties: json.MissingProperties,
          missingClassifications: json.MissingClassifications,
          isObjectCreator,
        });
        store.dispatch({ type: 'LOADER', state: false });
      });
  },

  setPublication(status) {
    const self = this;
    store.dispatch({ type: 'LOADER', state: true });

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.ManagementCloudId}/bimobject/addorupdate?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ BimobjectId: this.props.bimObjectId, Status: status }]),
      }
    ).then((response) => {
      if (response.status === 200) {
        store.dispatch({
          type: 'DELETE_OBJECTS_FROM_RESULTS',
          objectIds: self.props.bimObjectId,
          actionType: status,
        });
        store.dispatch({
          type: 'DELETE_OBJECTS_FROM_RESULTS_GROUP',
          objectIds: self.props.bimObjectId,
          actionType: status,
        });

        if (status === 'published') {
          return this.handlePublish(redirectOptions.Detail);
        }
        self.getBimObjectInformation(self.props.Language);
      } else {
        toastr.error(self.props.resources.ContentManagement.RemoveObjectFail);
      }
    });
  },

  // END API calls
  unPublishObject(event) {
    this.setPublication('hidden');
  },

  publishObject(event) {
    this.setPublication('published');
  },

  showModalConfirmDeleteObject(event) {
    $('#confirm-delete-object-modal').modal('show');
  },

  deleteBimObject(event) {
    LibraryApi.removeBimObjects(
      this.props.ManagementCloudId,
      [this.props.bimObjectId],
      this.props.TemporaryToken,
      this.props.UserId,
      this.props.resources
    );
    history.push(`/${this.props.Language}/bimobjects/`);
  },

  render() {
    const self = this;
    if (!self.props.bimObjectId) return null;
    let button;
    let deletebutton;

    let messages = null;
    if (this.state.status === 'published') {
      if (this.props.RoleKey === 'admin' || this.props.RoleKey === 'validator') {
        button = (
          <button className="btn-first btn-blue" onClick={self.unPublishObject}>
            {this.props.resources.PublicationBlockEditor.UnpublishBtnLabel}
          </button>
        );
      } else {
        button = (
          <button className="btn-first btn-grey disabled">
            {this.props.resources.PublicationBlockEditor.UnpublishBtnLabel}
          </button>
        );
      }
    } else if (self.state.missingData.length == 0 && this.state.status != '') {
      if (this.props.RoleKey === 'admin' || this.props.RoleKey === 'validator') {
        button = (
          <button className="btn-first btn-blue" onClick={self.publishObject}>
            {this.props.resources.PublicationBlockEditor.PublishBtnLabel}
          </button>
        );
      } else {
        button = (
          <button className="btn-first btn-grey disabled">
            {this.props.resources.PublicationBlockEditor.PublishBtnLabel}
          </button>
        );
      }
    } else {
      messages = _.map(self.state.missingData, (item, i) => {
        let details = null;
        if (item.Category === 'properties') {
          details = _.map(self.state.missingProperties, (property, j) => (
            <div key={property.Name}>-{property.Name}</div>
          ));
          return (
            <div key={i}>
              <br />
              <Link
                to={`/${self.props.Language}/bimobject/${self.props.bimObjectId}/edit/properties`}
              >
                <strong>{item.Comment}</strong>
              </Link>
              {details}
            </div>
          );
        }
        if (item.Category === 'classifications') {
          details = _.map(self.state.missingClassifications, (classif, j) => (
            <div key={classif.Name}>-{classif.Name}</div>
          ));
          return (
            <div key={i}>
              <br />
              <Link
                to={`/${self.props.Language}/bimobject/${self.props.bimObjectId}/edit/classifications`}
              >
                <strong>{item.Comment}</strong>
              </Link>
              {details}
            </div>
          );
        }
      });

      button = (
        <button className="btn-first btn-blue disabled">
          {this.props.resources.PublicationBlockEditor.PublishBtnLabel}
        </button>
      );
    }

    if (
      this.props.RoleKey === 'admin' ||
      this.props.RoleKey === 'validator' ||
      this.state.isObjectCreator == true
    ) {
      deletebutton = (
        <button
          className="btn-first btn-red btn-delete-object"
          onClick={self.showModalConfirmDeleteObject}
        >
          {this.props.resources.MetaResource.Delete}
        </button>
      );
    } else {
      deletebutton = (
        <button className="btn-first btn-grey btn-delete-object disabled">
          {this.props.resources.MetaResource.Delete}
        </button>
      );
    }

    const publication = (
      <div>
        <div className="container-fluid">
          <div className="panel panel-object-publication edit-object">
            <div className="col-md-23">
              <h3>{this.props.resources.PublicationBlockEditor.PublicationBlockTitle}</h3>
              <p>
                {
                  this.props.resources.PublicationBlockEditorContentManagement
                    .PublicationBlockDescription
                }
              </p>
            </div>
            <div className="col-md-23">
              <h4>{this.props.resources.VisibilityTitle}</h4>
              <div>{messages}</div>
              {button}
              {deletebutton}
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="confirm-delete-object-modal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <ClearIcon />
                </button>
                <h4>{this.props.resources.BimObjectDelete.Title}</h4>
              </div>
              <div className="modal-body">
                <p>{this.props.resources.BimObjectDelete.Description}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-second btn-grey" data-dismiss="modal">
                  {this.props.resources.EditionPage.CloseBtnLabel}
                </button>
                <button
                  type="button"
                  className="btn-second btn-red"
                  data-dismiss="modal"
                  onClick={self.deleteBimObject}
                >
                  {this.props.resources.MetaResource.Delete}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    let groupPublication = '';
    if (this.props.RoleKey === 'admin' || this.props.RoleKey === 'validator') {
      const description =
        this.props.resources.PublicationGroupBlockEditor.PublicationSpacesDescription?.replace(
          '[ContentManager]',
          this.props.resources.ContentManagement.MenuItemManageContents
        );

      groupPublication = (
        <div>
          <div className="container-fluid">
            <div className="panel panel-object-publication edit-object">
              <div className="col-md-23">
                <h3>
                  {this.props.resources.PublicationGroupBlockEditor.PublicationGroupBlockTitle}
                </h3>
                <p>{description}</p>
                <Button
                  variant="secondary"
                  size="medium"
                  icon="object"
                  onClick={() =>
                    history.push(`/${this.props.Language}/${RoutePaths.ManageContents}`)
                  }
                >
                  {this.props.resources.ContentManagement.MenuItemManageContents}
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        {publication}
        {groupPublication}
      </div>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    resources: appState.Resources[appState.Language],
    ready: typeof appState.Resources[appState.Language] !== 'undefined',
    ManagementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    RoleKey: appState.RoleKey,
    Language: appState.Language,
    UserId: appState.UserId,
  };
};

export default EditorStepPublication = connect(mapStateToProps)(EditorStepPublication);
