import React from 'react';
import createReactClass from 'create-react-class';

import { API_URL } from '../../../../Api/constants';

const Catalogs = createReactClass({
  _handleAddToCatalog(event) {
    event.preventDefault();

    const self = this;
    const catalogId = $('.select-catalog').val();
    if (catalogId > 0) {
      fetch(
        `${API_URL}/api/ws/v1/bimobject/${this.props.bimobjectId}/catalog/${catalogId}/add?token=${this.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      ).then((response) => {
        self.props._getBimObjectCatalogsList(self.props.bimobjectId);
      });
    }
  },

  _handleRemoveFromCatalog(event) {
    event.preventDefault();

    const self = this;
    const catalogId = event.target.dataset.cid;

    fetch(
      `${API_URL}/api/ws/v1/bimobject/${this.props.bimobjectId}/catalog/${catalogId}/remove?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    ).then((response) => {
      self.props._getBimObjectCatalogsList(self.props.bimobjectId);
    });
  },

  render() {
    const catalogs = this.props.catalogList.map((c, i) => (
      <option key={i} value={c.Id}>
        {c.Name}
      </option>
    ));
    var selectedTable;
    if (this.props.selectedCatalogs != null) {
      const selectedCatalogs = this.props.selectedCatalogs.map((c, i) => (
        <tr key={i}>
          <td>{c.Name}</td>
          <td>
            <a className="delete-btn">
              <i
                className="glyphicon glyphicon-remove pull-right"
                data-cid={c.Id}
                onClick={this._handleRemoveFromCatalog}
              />
            </a>
          </td>
        </tr>
      ));
      var selectedTable = (
        <table className="table table-striped" id="catalogs-table">
          <thead>
            <tr>
              <th>{this.props.resources.EditionPage.CatalogName}</th>
              <th />
            </tr>
          </thead>
          <tbody>{selectedCatalogs}</tbody>
        </table>
      );
    }

    let classString = 'panel edit-object';
    if (!this.props.isAuthorized) {
      classString += ' edit-disabled';
    }

    return (
      <div className={classString}>
        <div className="col-md-7">
          <h3>{this.props.resources.EditionPage.CatalogTitle}</h3>
          <p>{this.props.resources.EditionPage.CatalogDescription}</p>
        </div>
        <div className="col-md-7 col-md-offset-1">
          <label>{this.props.resources.EditionPage.CatalogLabel}</label>
          <select name="p-catalog" className="select-catalog">
            <option value="0">-</option>
            {catalogs}
          </select>
          <div>
            <button className="btn-third btn-blue add-catalog" onClick={this._handleAddToCatalog}>
              {this.props.resources.EditionPage.CatalogAddBtn}
            </button>
          </div>
        </div>
        <div className="col-md-7 col-md-offset-1" id="bimobject-manufacturers">
          {selectedTable}
        </div>
      </div>
    );
  },
});

export default Catalogs;