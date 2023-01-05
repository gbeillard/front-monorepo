import React from 'react';
import createReactClass from 'create-react-class';

const VideoViewer = createReactClass({
  render() {
    let height = window.innerHeight;
    if (height > 500) {
      height -= 160;
    }

    let iframe = null;
    if (this.props.url !== '') {
      iframe = <video width="100%" height={height} controls="controls" src={this.props.url} />;
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

export default VideoViewer;