// NOTE: i have rewrite this modal with material ui and without any bootstrap
// Please, use that one now.

import React from 'react';
import createReactClass from 'create-react-class';

// material ui icons
import CloseIcon from '@material-ui/icons/Close';

const SuppressionModal = createReactClass({
  render() {
    return (
      <div
        className="modal fade"
        id="confirm-deletion-modal"
        data-backdrop="static"
        data-keyboard="false"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="confirmationModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-illu">
          <div className="modal-content">
            <div className="modal-header">
              {this.props.urlImage != null ? <img src={this.props.urlImage} alt="" /> : null}
              <CloseIcon
                className="close"
                data-toggle="modal"
                onClick={this.props.abortButtonAction}
              />
            </div>
            <div className="modal-body">
              <h4 className="modal-title" id="myModalLabel">
                {this.props.headerTitle}
              </h4>
              {this.props.bodyContent}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-second btn-grey"
                onClick={this.props.abortButtonAction}
              >
                {this.props.abortButtonTitle}
              </button>
              <button
                type="button"
                className={
                  this.props.confirmButtonStyle != null
                    ? this.props.confirmButtonStyle
                    : 'btn-second btn-red'
                }
                id="confirm-deletion-button"
                onClick={this.props.confirmButtonAction}
              >
                {this.props.confirmButtonTitle}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default SuppressionModal;