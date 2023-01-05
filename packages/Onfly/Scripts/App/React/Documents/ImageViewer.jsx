import React from 'react';
import createReactClass from 'create-react-class';

const ImageViewer = createReactClass({
  render() {
    let iframe = null;
    if (this.props.url !== '') {
      iframe = <img width="100%" height="100%" src={this.props.url} />;
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

export default ImageViewer;