import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import _ from 'underscore';
import Dropzone from 'react-dropzone';
import toastr from 'toastr';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import store from '../Store/Store';
import * as SearchApi from '../Api/SearchApi.js';
import DocumentRow from './Documents/DocumentRow.jsx';
import PdfViewer from './Documents/PdfViewer.jsx';
import ImageViewer from './Documents/ImageViewer.jsx';
import VideoViewer from './Documents/VideoViewer.jsx';
import DocumentHistory from './Documents/DocumentHistory.jsx';
import SearchPinsDocument from './Documents/SearchPinsDocument.jsx';
import DirectoryTreeView from './Documents/DirectoryTreeView.jsx';
import { API_URL } from '../Api/constants';
import { withRouter } from '../Utils/withRouter';

let intervalRefreshDoc;

let ManageDocuments = createReactClass({
  getInitialState() {
    return {
      newKeyWord: '',
      path: '/',
      editId: 0,
      pdfUrl: '',
      imageUrl: '',
      selectedDocName: '',
      videoUrl: '',
      showDeletedDocs: false,
      historyDocumentId: 0,
      tagsEditDocs: [],
      selectedTags: [],
    };
  },

  componentDidMount() {
    const self = this;
    const request = self.prepareRequest(0, this.state.selectedTags);
    SearchApi.searchDoc(
      request,
      self.props.contextRequest,
      self.props.managementCloudId,
      self.props.TemporaryToken,
      0
    );
    intervalRefreshDoc = setInterval(() => {
      if (
        self.state.pdfUrl == '' &&
        self.state.imageUrl == '' &&
        self.state.videoUrl == '' &&
        self.state.historyDocumentId == 0
      ) {
        const requestRefresh = self.prepareRequest(self.props.directoryId, self.state.selectedTags);
        SearchApi.searchDoc(
          requestRefresh,
          self.props.contextRequest,
          self.props.managementCloudId,
          self.props.TemporaryToken,
          self.props.directoryId
        );
      }
    }, 5000);
  },

  componentWillUnmount() {
    clearInterval(intervalRefreshDoc);
  },

  onDocDrop(files) {
    const self = this;

    if (files.length != 1) {
      toastr.error('please set files one by one');
      return;
    }

    const data = new FormData();
    data.append('file', files[0]);
    data.append('directoryId', this.props.directoryId);

    store.dispatch({ type: 'LOADER', state: true });

    let url = `/api/ws/v1/contentmanagement/${this.props.managementCloudId}/document/add?token=${this.props.TemporaryToken}`;
    if (this.props.params.groupId != null) {
      url = `/api/ws/v1/contentmanagement/${this.props.managementCloudId}/group/${this.props.params.groupId}/document/add?token=${this.props.TemporaryToken}`;
    }

    fetch(API_URL + url, {
      method: 'POST',
      body: data,
    }).then((response) => {
      if (response.status == 200) {
        store.dispatch({ type: 'LOADER', state: false });
        toastr.success(self.props.resources.EditDocumentsPage.UploadSuccess);
      } else {
        store.dispatch({ type: 'LOADER', state: false });
        toastr.error(self.props.resources.EditDocumentsPage.UploadFail);
      }
    });
  },

  changeContextRequest(event) {
    const newRequest = this.prepareRequest(
      this.props.directoryId,
      this.state.selectedTags,
      event.target.value
    );
    SearchApi.searchDoc(
      newRequest,
      event.target.value,
      this.props.managementCloudId,
      this.props.TemporaryToken,
      this.props.directoryId
    );
  },

  changeKeyword(event) {
    const keyword = event.target.value;

    this.setState({ newKeyWord: keyword });
    const self = this;

    setTimeout(() => {
      if (self.state.newKeyWord == keyword) {
        const newRequest = self.prepareRequest(self.props.directoryId, self.state.selectedTags);
        newRequest.SearchValue = { Value: keyword };
        SearchApi.searchDoc(
          newRequest,
          self.props.contextRequest,
          self.props.managementCloudId,
          self.props.TemporaryToken,
          self.props.directoryId
        );
      }
    }, 500);
  },

  prepareRequest(
    directoryId,
    selectedTags = this.state.selectedTags,
    contextRequest = this.props.contextRequest
  ) {
    const request = this.props.initialRequest;
    if (contextRequest == 'directory') {
      request.SearchContainerFilter.ValueContainerFilter = [
        {
          Property: 'DirectoryId',
          Alias: 'DirectoryId',
          Values: [directoryId],
        },
      ];
    }

    // group filter
    if (this.props.params.groupId != null) {
      if (request.SearchContainerFilter.ValueContainerFilter == null) {
        request.SearchContainerFilter.ValueContainerFilter = [];
      }

      const filterGroup = {
        Property: 'Group',
        Alias: 'Group',
        Values: [this.props.params.groupId.toString()],
      };

      request.SearchContainerFilter.ValueContainerFilter.push(filterGroup);
    } else {
      if (request.SearchContainerFilter.ValueContainerFilter == null) {
        request.SearchContainerFilter.ValueContainerFilter = [];
      }

      const filterNoGroup = {
        Property: 'Group',
        Alias: 'Group',
        Values: ['0'],
      };

      request.SearchContainerFilter.ValueContainerFilter.push(filterNoGroup);
    }

    // tag filter
    if (selectedTags.length > 0) {
      if (request.SearchContainerFilter.ValueContainerFilter == null) {
        request.SearchContainerFilter.ValueContainerFilter = [];
      }

      const filterTags = {
        Property: 'Pins.Name_raw',
        Alias: 'Pins',
        Values: selectedTags,
      };

      request.SearchContainerFilter.ValueContainerFilter.push(filterTags);
    }

    // document deleted
    if (this.state.showDeletedDocs) {
      const filterStatus = {
        Property: 'IsDeleted',
        Alias: 'IsDeleted',
        Values: ['true', 'false'],
      };

      if (request.SearchContainerFilter.ValueContainerFilter == null) {
        request.SearchContainerFilter.ValueContainerFilter = [];
      }

      request.SearchContainerFilter.ValueContainerFilter.push(filterStatus);
    }

    // search
    request.SearchValue = { Value: this.state.newKeyWord };
    return request;
  },

  handleRequest(event) {
    const data = event.currentTarget.dataset;
    if (data.property == 'Pins.Name_raw') {
      let { selectedTags } = this.state;
      if (data.checked == 'true') {
        selectedTags.push(data.value);
      } else {
        selectedTags = _.filter(selectedTags, (tag) => tag != data.value);
      }

      const request = this.prepareRequest(this.props.directoryId, selectedTags);
      SearchApi.searchDoc(
        request,
        'directory',
        this.props.managementCloudId,
        this.props.TemporaryToken,
        this.props.directoryId
      );
      this.setState({ selectedTags });
    }
  },

  createDirectory(event) {
    const self = this;
    let url = `/api/ws/v1/contentmanagement/${this.props.managementCloudId}/document/addDirectory?token=${this.props.TemporaryToken}`;

    if (this.props.params.groupId != null && this.props.params.groupId != undefined) {
      url = `/api/ws/v1/contentmanagement/${this.props.managementCloudId}/group/${this.props.params.groupId}/document/addDirectory?token=${this.props.TemporaryToken}`;
    }

    fetch(API_URL + url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Name: 'New Folder', DirectoryId: this.props.directoryId }),
    }).then((response) => {
      if (response.status == 200) {
        store.dispatch({ type: 'LOADER', state: false });
        toastr.success(self.props.resources.ContentManagement.DocumentActionCreateDirectorySuccess);
      } else {
        store.dispatch({ type: 'LOADER', state: false });
        toastr.error(self.props.resources.EditDocumentsPage.UploadFail);
      }
    });
  },

  navigateToDirectoryById(directoryId, path, pathId) {
    const request = this.prepareRequest(directoryId, this.state.selectedTags, 'directory');
    SearchApi.searchDoc(
      request,
      'directory',
      this.props.managementCloudId,
      this.props.TemporaryToken,
      directoryId
    );
    this.setState({ path, pathId });
  },

  navigateToDirectory(event) {
    const directoryId = event.target.dataset.id;
    const { path } = event.target.dataset;
    const pathId = event.target.dataset.pathid;

    this.navigateToDirectoryById(directoryId, path, pathId);
  },

  beginRename(event) {
    const { name } = event.target.dataset;
    const { id } = event.target.dataset;

    this.refs.renameInput.value = name;
    this.setState({ editId: id });

    $('#rename-document-modal').modal();
  },

  confirmRename() {
    const newName = this.refs.renameInput.value;
    const id = this.state.editId;
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/document/${id}/rename?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Name: newName }),
      }
    ).then((response) => {
      store.dispatch({ type: 'LOADER', state: false });
      if (response.status == 200) {
        toastr.success(self.props.resources.EditDocumentsPage.RenameSuccess);
      } else {
        toastr.error(self.props.resources.EditDocumentsPage.RenameFail);
      }
    });
  },

  beginDelete(event) {
    const { id } = event.target.dataset;
    this.setState({ editId: id });

    $('#delete-document-modal').modal();
  },

  confirmDelete() {
    const id = this.state.editId;
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/document/${id}/delete?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    ).then((response) => {
      store.dispatch({ type: 'LOADER', state: false });
      toastr.success(self.props.resources.ContentManagement.DocumentActionDeleteSuccess);
    });
  },

  beginMove(event) {
    const { id } = event.target.dataset;
    const isFolder = event.target.dataset.isfolder == 'true';
    this.setState({ editId: id });

    $('#move-document-modal').modal();

    if (isFolder) {
      $('#modal-move-title-doc')[0].classList.add('hidden');
      $('#modal-move-title-folder')[0].classList.remove('hidden');
    } else {
      $('#modal-move-title-folder')[0].classList.add('hidden');
      $('#modal-move-title-doc')[0].classList.remove('hidden');
    }
  },

  confirmMove(directoryId) {
    this.dragEnd(this.state.editId, directoryId);
  },

  dragEnd(dragId, dropId) {
    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/document/${dragId}/changeDirectory/${dropId}?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    ).then((response) => {
      store.dispatch({ type: 'LOADER', state: false });
      toastr.success(self.props.resources.ContentManagement.DocumentActionMoveSuccess);
    });
  },

  downloadDocument(documentId, documentName = '', typeDoc = '') {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/download/document/${documentId}?token=${this.props.TemporaryToken}`,
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
          if (typeDoc == 'pdf') {
            self.setState({ pdfUrl: text, selectedDocName: documentName });
          } else if (typeDoc == 'image') {
            self.setState({ imageUrl: text, selectedDocName: documentName });
          } else if (typeDoc == 'video') {
            self.setState({ videoUrl: text, selectedDocName: documentName });
          } else {
            window.location = text;
          }
        } else {
          toastr.error('error while downloading');
        }
      });
  },

  downloadDocumentVersion(documentId, documentName = '', typeDoc = '') {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/download/documentversion/${documentId}?token=${this.props.TemporaryToken}`,
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
          if (typeDoc == 'pdf') {
            self.setState({ pdfUrl: text, selectedDocName: documentName });
          } else if (typeDoc == 'image') {
            self.setState({ imageUrl: text, selectedDocName: documentName });
          } else if (typeDoc == 'video') {
            self.setState({ videoUrl: text, selectedDocName: documentName });
          } else {
            window.location = text;
          }
        } else {
          toastr.error('error while downloading');
        }
      });
  },

  restoreDocumentVersion(documentId, documentVersionId) {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/document/${documentId}/restore/${documentVersionId}?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    ).then((response) => {
      store.dispatch({ type: 'LOADER', state: false });
      if (response.status == 200) {
        toastr.success(self.props.resources.EditDocumentsPage.RestoredSuccess);
      } else {
        toastr.error(self.props.resources.EditDocumentsPage.RestoredFail);
      }
    });
  },

  exitViewer() {
    this.setState({ pdfUrl: '', imageUrl: '', videoUrl: '' });
  },

  toggleShowDeleted() {
    this.setState({ showDeletedDocs: !this.state.showDeletedDocs });
  },

  showDocumentHistory(event) {
    let id;
    let name;
    if (event.target.dataset.id == null) {
      id = 0;
      name = '';
    } else {
      id = event.target.dataset.id;
      name = event.target.dataset.name;
    }
    this.setState({ historyDocumentId: id, selectedDocName: name });
  },

  editTag(documentId) {
    this.setState({ editId: documentId });
    this.loadTagEditedDoc(documentId);
    $('#edit-tag-document-modal').modal();
  },

  addTagToDocument(id) {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/documents/pin/add?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ objectsList: [this.state.editId], pinsList: [id] }),
      }
    ).then((response) => {
      self.loadTagEditedDoc();
    });
  },

  removeTagFromDocument(id) {
    const self = this;

    //   const { id } = event.target.dataset;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/documents/pin/remove?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ objectsList: [this.state.editId], pinsList: [id] }),
      }
    ).then((response) => {
      self.loadTagEditedDoc();
    });
  },

  loadTagEditedDoc(documentId = this.state.editId) {
    const self = this;
    // Tags
    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${self.props.managementCloudId}/document/${documentId}/pin/list?token=${self.props.TemporaryToken}`,
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
        self.setState({ tagsEditDocs: json });
      });
  },

  /* eslint-disable max-lines-per-function */
  render() {
    const self = this;

    let containerDirectoryClassName = '';

    // breadCrumb
    const breadCrumb = [];
    if (this.props.contextRequest === 'directory') {
      breadCrumb.push(
        <li onClick={this.navigateToDirectory} data-id="0" data-path="/" data-pathid="/0" key="0">
          {this.props.resources.EditDocumentsPage.DocumentRootTitle}
        </li>
      );
      if (this.state.path !== '/') {
        const pathExplode = this.state.path.split('/');
        const pathExplodeId = this.state.pathId.split('/');
        for (const i in pathExplode) {
          let path = '';
          let pathid = '';
          for (let j = 1; j <= i; j++) {
            path += `/${pathExplode[j]}`;
            pathid += `/${pathExplodeId[j]}`;
          }

          if (pathExplode[i] != '') {
            breadCrumb.push(
              <li
                onClick={this.navigateToDirectory}
                data-id={pathExplodeId[i]}
                data-path={path}
                data-pathid={pathid}
                key={pathExplodeId[i]}
              >
                {pathExplode[i]}
              </li>
            );
          }
        }
      }
    } else {
      containerDirectoryClassName = 'hidden';
    }

    // documents list
    const docs = _.map(this.props.data, (doc, i) => (
      <DocumentRow
        doc={doc}
        key={i}
        navigateToDirectoryById={self.navigateToDirectoryById}
        beginRename={self.beginRename}
        beginDelete={self.beginDelete}
        beginMove={self.beginMove}
        dragEnd={self.dragEnd}
        lang={self.props.Language}
        contextRequest={self.props.contextRequest}
        downloadDocument={self.downloadDocument}
        showDocumentHistory={self.showDocumentHistory}
        resources={self.props.resources}
        editTag={self.editTag}
      />
    ));

    // class document page
    let classNameDocs;
    if (
      this.state.pdfUrl !== '' ||
      this.state.imageUrl !== '' ||
      this.state.videoUrl !== '' ||
      this.state.historyDocumentId !== 0
    ) {
      classNameDocs = 'hidden';
    }

    const editedDocPins = _.map(this.state.tagsEditDocs, (pin, i) => (
      // @CLM : Peut - etre pas le mieux mais sinon id n'est pas  envoy� dans la m�thode  --event.target.dataset.id est undefined
      <span
        className="tag"
        key={pin.PinName}
        data-id={pin.PinId}
        onClick={() => {
          self.removeTagFromDocument(pin.PinId);
        }}
      >
        {pin.PinName} <CloseIcon />
      </span>
    ));

    return (
      <div className="doc-zone">
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

        <DocumentHistory
          documentId={this.state.historyDocumentId}
          documentName={this.state.selectedDocName}
          exitHistory={this.showDocumentHistory}
          managementCloudId={this.props.managementCloudId}
          TemporaryToken={this.props.TemporaryToken}
          downloadDocumentVersion={this.downloadDocumentVersion}
          restoreDocumentVersion={this.restoreDocumentVersion}
          resources={self.props.resources}
        />

        <div className={classNameDocs}>
          <div className="container-fluid no-padding">
            {this.props.RoleKey != 'partner' ? (
              <div className="col-xs-23">
                <Dropzone
                  multiple={false}
                  onDrop={this.onDocDrop}
                  className="dropzone-area"
                  data-cy={this.props.resources.EditDocumentsPage.DragBox}
                >
                  <h4>{this.props.resources.EditDocumentsPage.DragBox}</h4>
                  <p className="legende">
                    {this.props.resources.EditDocumentsPage.SupportedFiles}
                    <br />
                    {this.props.resources.ContentManagement.MaxDocSize}
                  </p>
                </Dropzone>
              </div>
            ) : null}
            <div className="col-xs-23 searchbar">
              <div className="col-xs-23 col-sm-14">
                <div className="searchwarpper searchwarpper-documents">
                  <div className="input-group searchglobal">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={this.props.resources.EditDocumentsPage.SearchForInput}
                      onChange={this.changeKeyword}
                      data-cy={this.props.resources.EditDocumentsPage.SearchForInput}
                    />
                    <span className="input-group-btn">
                      <button className="btn btn-default" type="button">
                        <SearchIcon />
                      </button>
                      <select
                        className="form-control search-perimeter"
                        onChange={this.changeContextRequest}
                        value={this.props.contextRequest}
                      >
                        <option value="directory">
                          {this.props.resources.EditDocumentsPage.ThisDirectory}
                        </option>
                        <option value="all">
                          {this.props.resources.EditDocumentsPage.AllDirectory}
                        </option>
                      </select>
                    </span>
                  </div>
                </div>
              </div>
              <div className="filter-tags col-xs-23 col-sm-8 col-sm-offset-1" />
            </div>
            <div className={containerDirectoryClassName}>
              <div className="col-xs-23">
                <ul className="breadcrumb">{breadCrumb}</ul>
              </div>
              <div className="col-xs-11">
                <button
                  className="btn-second btn-blue btn-create-directory"
                  onClick={this.createDirectory}
                >
                  {this.props.resources.ContentManagement.DocumentCreateDirectory}
                </button>
              </div>
              <div className="col-xs-11 col-xs-offset-1 text-right">
                <label className="toggle-button">
                  {this.props.resources.ContentManagement.DocumentShowDeletedDoc}
                  <input
                    type="checkbox"
                    className="toggle-button-input"
                    onChange={this.toggleShowDeleted}
                    checked={this.showDeletedDocs}
                  />
                  <span />
                </label>
              </div>
            </div>
          </div>

          <div className="container-fluid" data-cy="tableau des documents">
            <div className="row row-doc-title hidden-xs">
              <div className="col-sm-7 col-name">
                {this.props.resources.EditDocumentsPage.ContainerFileName}
              </div>
              <div className="col-sm-4">{this.props.resources.EditDocumentsPage.ContainerTags}</div>
              <div className="col-sm-4 text-center">
                {this.props.resources.EditDocumentsPage.ContainerDate}
              </div>
              <div className="col-sm-4 text-center">
                {this.props.resources.EditDocumentsPage.ContainerCreator}
              </div>
              <div className="col-sm-2 text-center">
                {this.props.resources.EditDocumentsPage.ContainerSize}
              </div>
              <div className="col-sm-2 text-center">
                {this.props.resources.EditDocumentsPage.ContainerActions}
              </div>
            </div>
            {docs}
          </div>

          <div
            className="modal fade"
            id="delete-document-modal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="myModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">
                    {this.props.resources.ContentManagement.ConfirmDeleteDocumentModalTitle}
                  </h4>
                  <CloseIcon data-toggle="modal" data-dismiss="modal" />
                </div>
                <div className="modal-body">
                  {this.props.resources.ContentManagement.ConfirmDeleteDocumentModalText}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-second btn-grey"
                    data-dismiss="modal"
                    data-cy={this.props.resources.MetaResource.Cancel}
                  >
                    {this.props.resources.MetaResource.Cancel}
                  </button>
                  <button
                    type="button"
                    className="btn-second btn-red"
                    data-dismiss="modal"
                    onClick={this.confirmDelete}
                    data-cy={this.props.resources.MetaResource.Delete}
                  >
                    {this.props.resources.MetaResource.Delete}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="rename-document-modal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="myModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">
                    {this.props.resources.ContentManagement.EditDocumentModalTitle}
                  </h4>
                  <CloseIcon data-toggle="modal" data-dismiss="modal" />
                </div>
                <div className="modal-body">
                  <input type="text" ref="renameInput" data-cy="rename-input" />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-second btn-grey" data-dismiss="modal">
                    {this.props.resources.MetaResource.Cancel}
                  </button>
                  <button
                    type="button"
                    className="btn-second btn-green"
                    data-dismiss="modal"
                    onClick={this.confirmRename}
                    data-cy={this.props.resources.MetaResource.Save}
                  >
                    {this.props.resources.MetaResource.Save}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="edit-tag-document-modal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="myModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">
                    {this.props.resources.ContentManagement.EditDocumentModalTitle}
                  </h4>
                  <CloseIcon data-toggle="modal" data-dismiss="modal" />
                </div>
                <div className="modal-body">
                  <div className="container-fluid">
                    <div className="col-md-11 col-sm-23">
                      <SearchPinsDocument
                        ManagementCloudId={this.props.managementCloudId}
                        TemporaryToken={this.props.TemporaryToken}
                        AddPin={this.addTagToDocument}
                        Resources={this.props.resources}
                      />
                    </div>
                    <div className="col-md-11 col-md-offset-1 col-sm-23">{editedDocPins}</div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-second btn-grey" data-dismiss="modal">
                    {this.props.resources.MetaResource.Close}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <DirectoryTreeView
            managementCloudId={this.props.managementCloudId}
            TemporaryToken={this.props.TemporaryToken}
            resources={this.props.resources}
            confirmMove={this.confirmMove}
            groupId={this.props.params.groupId}
          />
        </div>
      </div>
    );
  },
});

const mapStateToProps = function (store, ownProps) {
  const { appState } = store;
  const searchState = store.searchDocState;
  const sortField = '';
  const initialRequest = {
    SearchType: 'managementcloud-document',
    SearchValue: { Value: '' },
    SearchSorting: {
      Name: sortField,
      Order: 'Desc',
    },
    SearchPaging: {
      From: 0,
      Size: 1000,
    },
    SearchContainerFilter: {},
    SearchContainerDynamicFilter: [],
    LanguageCode: appState.Language,
    Context: '',
  };

  let request = searchState.Request;
  if (request == null) {
    request = initialRequest;
  }

  return {
    managementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    UserId: appState.UserId,
    resources: appState.Resources[appState.Language],
    Request: request,
    initialRequest,
    data: searchState.Documents,
    length: searchState.Documents != undefined ? searchState.Documents.length : 0,
    staticOrderedFilters: searchState.staticOrderedFilters,
    staticFilters: searchState.StaticFilters,
    resultsCount: searchState.Total,
    page: searchState.Page,
    contextRequest: searchState.ContextRequest,
    sorting: request.SearchSorting.Name,
    sortOrder: request.SearchSorting.Order,
    directoryId: searchState.DirectoryId,
    Language: appState.Language,
    RoleKey: appState.RoleKey,
  };
};

export default ManageDocuments = withRouter(connect(mapStateToProps)(ManageDocuments));