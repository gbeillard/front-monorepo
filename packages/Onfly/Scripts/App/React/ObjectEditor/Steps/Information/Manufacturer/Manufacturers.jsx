import React from 'react';
import createReactClass from 'create-react-class';

const Manufacturers = createReactClass({
  render() {
    let classString = 'panel edit-object ';

    const currentLogoPath =
      this.props.manuf != null && this.props.manuf != undefined
        ? `${this.props.manuf.LogoPath}?w=120&h=120`
        : '';
    const manufName =
      this.props.manuf != null && this.props.manuf != undefined ? this.props.manuf.Name : '';

    if (!this.props.isAuthorized) {
      classString += ' edit-disabled';
    }

    return (
      <div className={classString}>
        <div className="col-md-7">
          <h3>{this.props.resources.EditionPage.ManufBlockTitle}</h3>
          <p>{this.props.resources.EditionPage.ManufBlockDescription}</p>
        </div>
        <div className="col-md-15 col-md-offset-1">
          <div className="manufacturer-select selected">
            <img src={currentLogoPath} />
            <h6>{manufName}</h6>
          </div>
        </div>
      </div>
    );
  },
});

export default Manufacturers;