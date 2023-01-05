/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';

import moment from 'moment';

// material ui icons
import CloudDownloadIcon from '@material-ui/icons/CloudDownload.js';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore.js';
import * as Utils from '../../Utils/utils.js';
import store from '../../Store/Store';

const DocumentRowHistory = createReactClass({
  getInitialState() {
    return {
      classNameRow: 'row row-doc',
    };
  },

  downloadDocumentVersion() {
    this.props.downloadDocumentVersion(this.props.doc.DocumentVersionId, false);
  },

  restoreDocumentVersion() {
    this.props.restoreDocumentVersion(this.props.doc.DocumentVersionId);
  },

  viewDocument() {
    if (this.props.doc.Extension === '.pdf') {
      this.props.downloadDocumentVersion(
        this.props.doc.DocumentVersionId,
        this.props.doc.FileName,
        'pdf'
      );
    } else if (
      this.props.doc.Extension === '.gif' ||
      this.props.doc.Extension === '.png' ||
      this.props.doc.Extension === '.jpg'
    ) {
      this.props.downloadDocumentVersion(
        this.props.doc.DocumentVersionId,
        this.props.doc.FileName,
        'image'
      );
    } else if (this.props.doc.Extension === '.mp4' || this.props.doc.Extension === '.avi') {
      this.props.downloadDocumentVersion(
        this.props.doc.DocumentVersionId,
        this.props.doc.FileName,
        'video'
      );
    }
  },

  render() {
    let picto = 'icons-svg ';
    let classNameIsDeleted;
    let fileName;

    if (this.props.doc.IsDeleted) {
      classNameIsDeleted = 'file-deleted';
    }

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
          <i className={picto} /> {this.props.doc.FileName} <i className="icons-svg icon-eye" />
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
          <i className={picto} /> {this.props.doc.FileName} <i className="icons-svg icon-eye" />
        </span>
      );
    } else if (this.props.doc.Extension === '.mp4' || this.props.doc.Extension === '.avi') {
      picto += 'icon-file-video';
      fileName = (
        <span onClick={this.viewDocument} className={`file-action ${classNameIsDeleted}`}>
          <i className={picto} /> {this.props.doc.FileName} <i className="icons-svg icon-eye" />
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
      picto += 'icon-file-zip';
      fileName = (
        <span className={classNameIsDeleted}>
          <i className={picto} /> {this.props.doc.FileName}
        </span>
      );
    }

    return (
      <div className="row row-doc">
        <div className="col-md-13 col-sm-12 col-name">
          {fileName}
          <div className="path-doc">
            {this.props.contextRequest === 'all' ? this.props.doc.Path : ''}
          </div>
        </div>
        <div className="col-md-2 col-sm-4 small">
          {moment(this.props.doc.Horodate, 'YYYYMMDDHHmmss').format('L LTS')}
        </div>
        <div className="col-md-4 hidden-xs">
          <div className="userprofile small">
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
        <div className="col-md-2 col-sm-4">{Utils.getReadableSize(this.props.doc.Size)}</div>
        <div className="col-md-2 col-sm-2 col-xs-23">
          {this.props.doc.DocumentVersionId !== 0 ? (
            <div className="dropdown pull-right">
              <button
                className="btn btn-default dropdown-toggle "
                type="button"
                data-toggle="dropdown"
              >
                <i className="icons-svg icon-arrow-down" />
              </button>
              <ul className="dropdown-menu pull-left">
                <li>
                  <a onClick={this.downloadDocumentVersion}>
                    <CloudDownloadIcon />
                    {this.props.resources.ContentManagement.DocumentActionDownload}
                  </a>
                </li>
                <li>
                  <a onClick={this.restoreDocumentVersion}>
                    <SettingsBackupRestoreIcon />
                    {this.props.resources.ContentManagement.DocumentActionRestore}
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            <div className="pull-right">
              {this.props.resources.ContentManagement.DocumentActualVersion}
            </div>
          )}
        </div>
      </div>
    );
  },
});

export default DocumentRowHistory;