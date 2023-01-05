import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';

// material ui icons
import CloseIcon from '@material-ui/icons/Close';
import store from '../../../../Store/Store';
import { API_URL } from '../../../../Api/constants';

const Revisions = createReactClass({
  getInitialState() {
    return {
      data: [],
      loaded: false,
    };
  },

  componentDidMount() {
    if (this.props.bimObjectId != null) {
      this.loadRevisionsList(this.props.bimObjectId);
    } else {
      this.setState(this.getInitialState());
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.bimObjectId != null) {
      this.loadRevisionsList(nextProps.bimObjectId);
    } else {
      this.setState(this.getInitialState());
    }
  },

  loadRevisionsList(objectId) {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/bimobject/${objectId}/revision/list?token=${this.props.TemporaryToken}`,
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
        self.setState({ data: json, loaded: true });
      });
  },

  handleSaveRevision() {
    const self = this;
    const comment = this.refs.revcomment.value;
    store.dispatch({ type: 'LOADER', state: true });

    fetch(
      `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/revision/add?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Comment: comment }),
      }
    ).then((response) => {
      self.loadRevisionsList(self.props.bimObjectId);
      $('#edit-revision-modal').modal('hide');
      store.dispatch({ type: 'LOADER', state: false });
    });
  },

  fetchRevision() {
  },

  render() {
    let lastRevision = '#1';
    if (this.state.data.length > 0) {
      lastRevision = this.state.data[0].Revision;
    }

    const revisions = _.map(this.state.data, (revision, i) => {
      if (i == 0) {
        lastRevision = revision.Revision;
      }
      return (
        <tr key={i}>
          <td>{revision.Revision}</td>
          <td>{revision.CreatedAt}</td>
          <td>{revision.Comment}</td>
        </tr>
      );
    });

    let classString = 'panel edit-object';
    if (!this.props.isAuthorized) {
      classString += ' edit-disabled';
    }

    let addLink = '';
    if (this.props.bimObjectId > 0) {
      addLink = (
        <button
          className="btn-third btn-blue"
          data-toggle="modal"
          data-target="#edit-revision-modal"
        >
          {this.props.resources.EditionPages.AddRevisionButtonLabel}
        </button>
      );
    }

    return (
      <div>
        <div className={classString}>
          <div className="col-md-7">
            <h3>{this.props.resources.EditionPages.RevisionsBlockTitle}</h3>
            <p>{this.props.resources.EditionPages.RevisionsBlockDescription}</p>
          </div>
          <div className="col-md-15 col-md-offset-1">
            <div id="infos-panel" />
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>{this.props.resources.EditionPages.RevisionNumberLabel}</th>
                  <th>{this.props.resources.EditionPages.RevisionCreatedAtLabel}</th>
                  <th>{this.props.resources.EditionPages.RevisionCommentLabel}</th>
                </tr>
              </thead>
              <tbody>{revisions}</tbody>
            </table>
            {addLink}
          </div>
        </div>

        <div
          className="modal fade"
          id="edit-revision-modal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <CloseIcon aria-hidden="true" />
                </button>
                <h4 className="modal-title" id="myModalLabel">
                  {this.props.resources.EditionPage.EditRevisionTitle}
                </h4>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>{this.props.resources.EditionPage.CurrentRevisionLabel}</label>
                  <span className="bimobjectrevision-current"> {lastRevision}</span>
                </div>
                <div className="form-group">
                  <label>{this.props.resources.EditionPage.MetaRevisionNumber}</label>
                  <textarea
                    rows="10"
                    className="bimobjectrevision-comment form-control"
                    ref="revcomment"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-second btn-grey" data-dismiss="modal">
                  {this.props.resources.EditionPage.CloseBtnLabel}
                </button>
                <button
                  type="button"
                  className="btn-second btn-blue save-revision"
                  onClick={this.handleSaveRevision}
                >
                  {this.props.resources.EditionPage.SaveBtnLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default Revisions;