import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';
import store from '../../../../Store/Store';
import { API_URL } from '../../../../Api/constants';

const Companies = createReactClass({
  getInitialState() {
    return {
      company: this.props.initialData,
    };
  },

  _setCompany(event) {
    const self = this;
    const companyId = event.target.value;

    store.dispatch({ type: 'LOADER', state: true });

    fetch(
      `${API_URL}/api/ws/v2/bimobject/${this.props.bimobjectId}/company/${companyId}/update?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        store.dispatch({ type: 'LOADER', state: false });
        return response.json();
      })
      .then((json) => {
        self.setState({ company: json.ContentPartner });
      });
  },

  _removeCompany() {
    const self = this;

    store.dispatch({ type: 'LOADER', state: true });

    fetch(
      `${API_URL}/api/ws/v2/bimobject/${this.props.bimobjectId}/company/${this.state.company.Id}/delete?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    ).then((response) => {
      store.dispatch({ type: 'LOADER', state: false });
      self.setState({ company: null });
    });
  },

  render() {
    let company;
    if (this.state.company != null) {
      company = (
        <span className="company-infos">
          <img src={`${this.state.company.LogoPath}?width=100`} className="company-logo" />
          <h5>{this.state.company.Name}</h5>
        </span>
      );
    }

    let companyOptions = null;
    if (this.props.companyList != null && this.props.companyList.length > 0) {
      companyOptions = _.map(this.props.companyList, (company, index) => (
        <option key={index} value={company.Id}>
          {company.Name}
        </option>
      ));
    }

    let classString = 'panel edit-object';
    if (!this.props.isAuthorized) {
      classString += ' edit-disabled';
    }

    let removeButton;
    if (this.state.company != null) {
      removeButton = (
        <button className="btn-second btn-red remove-btn" onClick={this._removeCompany}>
          {this.props.resources.EditionPage.RemoveCompanyButton}
        </button>
      );
    }

    let title;
    let description;
    let defaultValue;
    if (this.props.objectType == 'userContent' || this.props.objectType == 'genericOfficial') {
      title = this.props.resources.EditionPages.CompanyUserContentBlockTitle;
      description = this.props.resources.EditionPages.CompanyUserContentBlockDescription;
      defaultValue = this.props.resources.EditionPage.SelectUserContentCompany;
    } else {
      title = this.props.resources.EditionPages.CompanyBlockTitle;
      description = this.props.resources.EditionPages.CompanyBlockDescription;
      defaultValue = this.props.resources.EditionPage.SelectCompany;
    }

    return (
      <div className={classString}>
        <div className="col-md-7">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className="col-md-7 col-md-offset-1">
          <select
            value={this.state.company != null ? this.state.company.Id : -1}
            onChange={this._setCompany}
            className="company-select"
          >
            <option value={-1}>{defaultValue}</option>
            {companyOptions}
          </select>
          {removeButton}
        </div>
        <div className="col-md-7 col-md-offset-1">{company}</div>
      </div>
    );
  },
});

export default Companies;