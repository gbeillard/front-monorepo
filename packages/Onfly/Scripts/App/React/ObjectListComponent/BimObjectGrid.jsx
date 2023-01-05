import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';
import { Link } from 'react-router-dom';
import store from '../../Store/Store';

const BimObjectGrid = createReactClass({
  render() {
    let brand;

    if (this.props.bimobject.ObjectType > 0) {
      if (this.props.bimobject.Manufacturer != null) {
        if (this.props.bimobject.Manufacturer.LogoPath != '') {
          brand = (
            <img
              src={`${this.props.bimobject.Manufacturer.LogoPath}?width=85&height=35`}
              className="brand-logo"
              alt={this.props.bimobject.Manufacturer.Name}
            />
          );
        } else {
          brand = this.props.bimobject.Manufacturer.Name;
        }
      }
    } else {
      brand = this.props.resources.SearchResults.ObjectTypeFilterGeneric;
    }

    let isGeneric;
    let isPublished;
    let conform_html = '';

    if (this.props.bimobject.ObjectType == 2) {
      isGeneric = 'object-component-bim-no-generic ';
      conform_html = (
        <div className="object-component-bim-conform">
          <span>Official</span>
        </div>
      );
    } else {
      isGeneric = 'object-component-bim-generic ';
    }

    let companyLogo;
    let alt;
    if (this.props.bimobject.Company.Id != 0) {
      alt = `${this.props.bimobject.Company.Name} - bim`;
      companyLogo = (
        <img
          className="logo-company"
          src={`${this.props.bimobject.Company.LogoPath}?maxwidth=100&maxheight=25`}
          alt={alt}
        />
      );
    }

    let editButton;
    const { isAuthenticated } = this.props;

    let bimCoin = '';
    if (this.props.bimobject.IsPaying) {
      bimCoin = <img src="/Content/images/bimcoin-color.svg" className="bimCoin" />;
    }

    return (
      <Link
        to={`/${this.props.language}/bimobject/${this.props.bimobject.Id}/details`}
        className={`item-list panel ${isGeneric}${isPublished}`}
      >
        <div className="bimobject-photo">
          <img src={`${this.props.bimobject.Photo}?width=185&height=185&scale=both`} />
        </div>
        <p className="bimobject-name">
          {this.props.bimobject.Name} {bimCoin}
        </p>
        <div className="brand">{brand}</div>
        <div className="object-hover">
          {editButton}
          {companyLogo}
        </div>
        {conform_html}
      </Link>
    );
  },
});

export default BimObjectGrid;