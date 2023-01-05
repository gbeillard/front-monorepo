/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React from 'react';
import createReactClass from 'create-react-class';

const PdfViewer = createReactClass({
  render() {
    let height = window.innerHeight;
    if (height > 500) {
      height -= 160;
    }

    let iframe = null;
    if (this.props.url !== '') {
      iframe = (
        <iframe
          className="pdf-viewer"
          width="100%"
          height={height}
          src={`${ADOBE_PDF_VIEWER_URL}/Scripts/pdfViewerAdobe.html?url=${this.props.url}&clientId=${ADOBE_PDF_VIEWER_CLIENT_ID}`}
        />
      );
    } else {
      return null;
    }

    return (
      <div className="panel panel-preview-doc">
        <div className="panel-heading">
          <button
            className="btn-second btn-blue btn-picto-back viewer-closing-button"
            onClick={this.props.exitViewer}
          >
            {this.props.resources.MetaResource.Return}
          </button>
          <h4>{this.props.docName}</h4>
        </div>
        <div className="">{iframe}</div>
      </div>
    );
  },
});

export default PdfViewer;