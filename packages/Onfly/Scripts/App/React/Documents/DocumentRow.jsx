/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';

import moment from 'moment';

// material ui icons
import EditIcon from '@material-ui/icons/Edit.js';
import OpenWithIcon from '@material-ui/icons/OpenWith.js';
import ClearIcon from '@material-ui/icons/Clear.js';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload.js';
import LocalOfferIcon from '@material-ui/icons/LocalOffer.js';
import HistoryIcon from '@material-ui/icons/History.js';
import * as Utils from '../../Utils/utils.js';
import store from '../../Store/Store';

const DocumentRow = createReactClass({
  getInitialState() {
    return {
      classNameRow: 'row row-doc',
    };
  },

  navigateToDirectory() {
    this.props.navigateToDirectoryById(
      this.props.doc.Id,
      this.props.doc.Path,
      this.props.doc.PathId
    );
  },

  dragOver(event) {
    event.preventDefault();
    this.setState({ classNameRow: 'row row-doc dragover' });
  },

  dragLeave(event) {
    event.preventDefault();
    this.setState({ classNameRow: 'row row-doc' });
  },

  dragStart(event) {
    event.dataTransfer.setData('text/plain', this.props.doc.Id);
  },

  drop(event) {
    event.preventDefault();
    this.setState({ classNameRow: 'row row-doc' });
    const elementDragged = event.dataTransfer.getData('text/plain');
    const elementDropped = this.props.doc.Id;
    if (elementDragged !== elementDropped) {
      this.props.dragEnd(elementDragged, elementDropped);
    }
  },

  downloadDocument() {
    this.props.downloadDocument(this.props.doc.Id, false);
  },

  viewDocument() {
    if (this.props.doc.Extension === '.pdf') {
      this.props.downloadDocument(this.props.doc.Id, this.props.doc.FileName, 'pdf');
    } else if (
      this.props.doc.Extension === '.gif' ||
      this.props.doc.Extension === '.png' ||
      this.props.doc.Extension === '.jpg'
    ) {
      this.props.downloadDocument(this.props.doc.Id, this.props.doc.FileName, 'image');
    } else if (this.props.doc.Extension === '.mp4' || this.props.doc.Extension === '.avi') {
      this.props.downloadDocument(this.props.doc.Id, this.props.doc.FileName, 'video');
    }
  },

  editTag() {
    this.props.editTag(this.props.doc.Id);
  },

  render() {
    const self = this;

    let picto = 'icons-svg ';
    let classNameIsDeleted;
    let fileName;

    if (this.props.doc.IsDeleted) {
      classNameIsDeleted = 'file-deleted';
    }

    const docUpdateAt = moment(new Date(self.props.doc.UpdatedAt)).format('L LTS');

    if (!this.props.doc.IsDirectory) {
      if (
        this.props.doc.Extension === '.csv' ||
        this.props.doc.Extension === '.xls' ||
        this.props.doc.Extension === '.xlsx'
      ) {
        picto += 'icon-file-excel';
        fileName = (
          <span className={classNameIsDeleted}>
            <i className={picto} /> {this.props.doc.FileName}
          </span>
        );
      } else if (this.props.doc.Extension === '.pdf') {
        picto += 'icon-file-pdf';
        fileName = (
          <span onClick={this.viewDocument} className={`file-action ${classNameIsDeleted}`}>
            <i className={picto} /> {this.props.doc.FileName}{' '}
            <i className="icons-svg icon-eye hidden-xs" />
          </span>
        );
      } else if (
        this.props.doc.Extension === '.gif' ||
        this.props.doc.Extension === '.png' ||
        this.props.doc.Extension === '.jpg' ||
        this.props.doc.Extension === '.bmp' ||
        this.props.doc.Extension === '.jpeg'
      ) {
        picto += 'icon-file-image';
        fileName = (
          <span onClick={this.viewDocument} className={`file-action ${classNameIsDeleted}`}>
            <i className={picto} /> {this.props.doc.FileName}{' '}
            <i className="icons-svg icon-eye hidden-xs" />
          </span>
        );
      } else if (this.props.doc.Extension === '.mp4' || this.props.doc.Extension === '.avi') {
        picto += 'icon-file-video';
        fileName = (
          <span onClick={this.viewDocument} className={`file-action ${classNameIsDeleted}`}>
            <i className={picto} /> {this.props.doc.FileName}{' '}
            <i className="icons-svg icon-eye hidden-xs" />
          </span>
        );
      } else if (this.props.doc.Extension === '.doc' || this.props.doc.Extension === '.docx') {
        picto += 'icon-file-text';
        fileName = (
          <span className={classNameIsDeleted}>
            <i className={picto} /> {this.props.doc.FileName}
          </span>
        );
      } else if (this.props.doc.Extension === '.zip') {
        picto += 'icon-file-zip';
        fileName = (
          <span className={classNameIsDeleted}>
            <i className={picto} /> {this.props.doc.FileName}
          </span>
        );
      } else {
        picto += 'icon-file';
        fileName = (
          <span className={classNameIsDeleted}>
            <i className={picto} /> {this.props.doc.FileName}
          </span>
        );
      }

      const tags_sorted = _.sortBy(this.props.doc.Pins, (value, id) => value.Name);

      const tags = _.map(tags_sorted, (value, id) => <span className="tag">{value.Name}</span>);

      return (
        <div className="row row-doc" draggable="true" onDragStart={this.dragStart}>
          <div className="col-xs-12 col-sm-7 col-name">
            {fileName}
            <div className="path-doc">
              {this.props.contextRequest === 'all' ? this.props.doc.Path : ''}
            </div>
          </div>
          <div className="col-xs-11 col-sm-4">{tags}</div>
          <div className="col-xs-8 col-sm-4 text-center">{docUpdateAt}</div>
          <div className="hidden-xs col-sm-4 text-center">
            <div className="userprofile">
              <span className="userpic">
                <img
                  src={`${this.props.doc.UploaderAvatar}?width=40&height=40&scale=both`}
                  alt=""
                  className="userpicimg"
                />
              </span>
              <div className="text-container">{this.props.doc.UploaderName}</div>
            </div>
          </div>
          <div className="hidden-xs col-sm-2 text-center">
            {Utils.getReadableSize(this.props.doc.Size)}
          </div>
          <div className="col-xs-4 col-sm-2 text-center">
            <div className="dropdown">
              <button
                className="btn btn-default dropdown-toggle "
                type="button"
                data-toggle="dropdown"
              >
                <i className="icons-svg icon-arrow-down" />
              </button>
              <ul className="dropdown-menu pull-right">
                <li>
                  <a onClick={this.downloadDocument}>
                    <CloudDownloadIcon />
                    {this.props.resources.ContentManagement.DocumentActionDownload}
                  </a>
                </li>
                <li>
                  <a onClick={this.editTag}>
                    <LocalOfferIcon />
                    {this.props.resources.ContentManagement.DocumentActionEditTag}
                  </a>
                </li>
                <li>
                  <a
                    onClick={this.props.showDocumentHistory}
                    data-name={this.props.doc.FileName}
                    data-id={this.props.doc.Id}
                  >
                    <HistoryIcon />
                    {this.props.resources.ContentManagement.DocumentActionViewHistory}
                  </a>
                </li>
                <li>
                  <a
                    onClick={this.props.beginRename}
                    data-name={this.props.doc.FileName}
                    data-id={this.props.doc.Id}
                  >
                    <EditIcon />
                    {this.props.resources.ContentManagement.DocumentActionRename}
                  </a>
                </li>
                <li>
                  <a
                    onClick={this.props.beginMove}
                    data-name={this.props.doc.FileName}
                    data-id={this.props.doc.Id}
                  >
                    <OpenWithIcon />
                    {this.props.resources.ContentManagement.DocumentActionMove}
                  </a>
                </li>
                <li>
                  <a onClick={this.props.beginDelete} data-id={this.props.doc.Id}>
                    <ClearIcon />
                    {this.props.resources.ContentManagement.DocumentActionRemove}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    }
    picto += 'icon-folder';

    return (
      <div
        className={this.state.classNameRow}
        draggable="true"
        onDragStart={this.dragStart}
        onDragOver={this.dragOver}
        onDragLeave={this.dragLeave}
        onDrop={this.drop}
      >
        <div className="col-xs-12 col-sm-7 col-name">
          <span onClick={this.navigateToDirectory} className={`file-action ${classNameIsDeleted}`}>
            <i className={picto} /> {this.props.doc.Name}
          </span>
          <div className="path-doc">
            {this.props.contextRequest === 'all' ? this.props.doc.Path : ''}
          </div>
        </div>
        <div className="col-xs-11 col-sm-4">&nbsp;</div>
        <div className="col-xs-8 col-sm-4 text-center">{docUpdateAt}</div>
        <div className="hidden-xs col-sm-4 text-center">
          <div className="userprofile">
            <span className="userpic">
              <img
                src={`${this.props.doc.UploaderAvatar}?width=40&height=40&scale=both`}
                alt=""
                className="userpicimg"
              />
            </span>
            <div className="text-container">{this.props.doc.UploaderName}</div>
          </div>
        </div>
        <div className="hidden-xs col-sm-2 text-center">&nbsp;</div>
        <div className="col-xs-4 col-sm-2 text-center">
          <div className="dropdown">
            <button
              className="btn btn-default dropdown-toggle"
              type="button"
              data-toggle="dropdown"
            >
              <i className="icons-svg icon-arrow-down" />
            </button>
            <ul className="dropdown-menu pull-right">
              <li>
                <a
                  onClick={this.props.beginRename}
                  data-name={this.props.doc.Name}
                  data-id={this.props.doc.Id}
                >
                  <EditIcon />
                  {this.props.resources.ContentManagement.DocumentActionRename}
                </a>
              </li>
              <li>
                <a
                  onClick={this.props.beginMove}
                  data-isfolder={this.props.doc.IsDirectory}
                  data-name={this.props.doc.Name}
                  data-id={this.props.doc.Id}
                >
                  <OpenWithIcon />
                  {this.props.resources.ContentManagement.DocumentActionMove}
                </a>
              </li>
              <li>
                <a onClick={this.props.beginDelete} data-id={this.props.doc.Id}>
                  <ClearIcon />
                  {this.props.resources.ContentManagement.DocumentActionRemove}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  },
});

export default DocumentRow;