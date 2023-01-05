import React from 'react';
import createReactClass from 'create-react-class';

import _ from 'underscore';
import DocumentRowHistory from './DocumentRowHistory.jsx';
import { API_URL } from '../../Api/constants';

const DocumentHistory = createReactClass({
  getInitialState() {
    return {
      documentId: this.props.documentId,
      revisions: [],
    };
  },

  componentDidUpdate() {
    if (this.state.documentId !== this.props.documentId) {
      this.setState({ documentId: this.props.documentId, revisions: [] });

      if (this.props.documentId !== 0) {
        const self = this;

        fetch(
          `${API_URL}/api/ws/v1/contentmanagement/${this.props.managementCloudId}/document/${this.props.documentId}/history?token=${this.props.TemporaryToken}`,
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
            self.setState({ revisions: json });
          });
      }
    }
  },

  restoreDocumentVersion(documentVersionId) {
    this.props.restoreDocumentVersion(this.props.documentId, documentVersionId);
  },

  render() {
    if (this.props.documentId === 0) {
      return null;
    }
    const self = this;

    const revisionsList = _.map(this.state.revisions, (item, i) => (
      <DocumentRowHistory
        doc={item}
        key={i}
        downloadDocumentVersion={self.props.downloadDocumentVersion}
        restoreDocumentVersion={self.restoreDocumentVersion}
        resources={self.props.resources}
      />
    ));

    return (
      <div className="panel panel-preview-doc">
        <div className="panel-heading">
          <button className="btn-second btn-blue btn-picto-back" onClick={this.props.exitHistory}>
            {this.props.resources.MetaResource.Return}
          </button>
          <h4>
            {`${this.props.resources.ContentManagement.HistoryFileTitle} : ${this.props.documentName}`}
          </h4>
        </div>
        <div className="panel-body">{revisionsList}</div>
      </div>
    );
  },
});

export default DocumentHistory;