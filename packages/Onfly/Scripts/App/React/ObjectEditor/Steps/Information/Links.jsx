import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';

// material ui icons
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import store from '../../../../Store/Store';
import { API_URL } from '../../../../Api/constants';

const Links = createReactClass({
  getInitialState() {
    return {
      data: [],
      currentNameEdit: '',
      currentUrlEdit: '',
      currentIdEdit: 0,
      loaded: false,
    };
  },

  componentDidMount() {
    if (this.props.bimObjectId != null) {
      this.loadLinksList();
    }
  },

  loadLinksList() {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/links/list?token=${this.props.TemporaryToken}`,
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
        store.dispatch({ type: 'LOADER', state: false });
      });
  },

  prepareEdit(link) {
    $('#edit-link-modal .bimobjectlink-name').val(link.Name);
    $('#edit-link-modal .bimobjectlink-url').val(link.Url);

    this.setState({ currentIdEdit: link.LinkId });

    $('#edit-link-modal').modal();
  },

  handleAddLink() {
    const self = this;
    const name = $('#create-link-modal .bimobjectlink-name').val();
    const url = $('#create-link-modal .bimobjectlink-url').val();

    store.dispatch({ type: 'LOADER', state: true });

    $('#create-link-modal .bimobjectlink-name').val('');
    $('#create-link-modal .bimobjectlink-url').val('');
    $('#create-link-modal').modal('hide');

    fetch(
      `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/links/addorupdate?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ Name: name, Url: url, IsExternal: false }]),
      }
    ).then((response) => {
      self.loadLinksList();
    });
  },

  handleEditLink(event) {
    const self = this;

    const url = $('#edit-link-modal .bimobjectlink-url').val();
    const name = $('#edit-link-modal .bimobjectlink-name').val();

    $('#edit-link-modal').modal('hide');
    store.dispatch({ type: 'LOADER', state: true });

    fetch(
      `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/links/addorupdate?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            Name: name,
            Url: url,
            IsExternal: false,
            LinkId: self.state.currentIdEdit,
          },
        ]),
      }
    ).then((response) => {
      self.loadLinksList();
    });
  },

  handleDeleteLink(event, link) {
    event.preventDefault();
    const self = this;

    store.dispatch({ type: 'LOADER', state: true });

    fetch(
      `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/links/remove?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ LinkId: link.LinkId }]),
      }
    ).then((response) => {
      self.loadLinksList();
    });
  },

  render() {
    const links = this.state.data.map((link, i) => (
      <tr key={i}>
        <td>{link.Name}</td>
        <td className="table-url">
          <a href={link.Url}>{link.Url}</a>
        </td>
        <td className="text-right">
          <a className="edit-lang edit-btn">
            <EditIcon onClick={() => this.prepareEdit(link)} />
          </a>
          <a className="delete-lang delete-btn">
            <DeleteIcon onClick={(event) => this.handleDeleteLink(event, link)} />
          </a>
        </td>
      </tr>
    ));

    let classString = 'panel edit-object';
    if (!this.props.isAuthorized) {
      classString += ' edit-disabled';
    }

    let addButton;
    if (this.props.bimObjectId > 0) {
      addButton = (
        <span
          className="browse fileinput-button"
          data-toggle="modal"
          data-target="#create-link-modal"
        >
          <button className="btn-third btn-blue">
            {this.props.resources.EditionPage.AddLinkButton}
          </button>
        </span>
      );
    }

    return (
      <div>
        <div className={classString}>
          <div className="col-md-7">
            <h3>{this.props.resources.EditionPages.LinksTitle}</h3>
            <p>{this.props.resources.EditionPages.LinksText}</p>
          </div>
          <div className="col-md-15 col-md-offset-1">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>{this.props.resources.EditionPage.MetaLinkName}</th>
                  <th className="table-url">{this.props.resources.EditionPage.MetaLinkUrl}</th>
                  <th />
                </tr>
              </thead>
              <tbody>{links}</tbody>
            </table>
            {addButton}
          </div>
        </div>

        <div
          className="modal fade"
          id="create-link-modal"
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
                  {this.props.resources.EditionPage.CreateLinkBimObjectTitle}
                </h4>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>{this.props.resources.EditionPage.LinkNameLabel}</label>
                  <input className="bimobjectlink-name form-control" type="text" />
                </div>
                <div className="form-group">
                  <label>{this.props.resources.EditionPage.LinkUrlLabel}</label>
                  <input className="bimobjectlink-url form-control" type="url" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-second btn-grey" data-dismiss="modal">
                  {this.props.resources.EditionPage.CloseBtnLabel}
                </button>
                <button
                  type="button"
                  className="btn-second btn-blue create-link"
                  onClick={this.handleAddLink}
                >
                  {this.props.resources.EditionPage.SaveBtnLabel}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="edit-link-modal"
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
                  {this.props.resources.EditionPage.EditLinkBimObjectTitle}
                </h4>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <input type="hidden" className="bimobjectlink-id" />
                  <label>{this.props.resources.EditionPage.LinkNameLabel}</label>
                  <input className="bimobjectlink-name form-control" type="text" />
                </div>
                <div className="form-group">
                  <label>{this.props.resources.EditionPage.LinkUrlLabel}</label>
                  <input className="bimobjectlink-url form-control" type="url" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-second btn-grey" data-dismiss="modal">
                  {this.props.resources.EditionPage.CloseBtnLabel}
                </button>
                <button
                  type="button"
                  className="btn-second btn-blue save-link"
                  onClick={this.handleEditLink}
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

export default Links;