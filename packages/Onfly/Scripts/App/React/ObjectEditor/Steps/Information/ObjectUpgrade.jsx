import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';
import ManufacturerTags from './Manufacturer/ManufacturerTags.jsx';

const ObjectUpgrade = createReactClass({
  render() {
    const self = this;

    let classString = 'panel panel-object-type edit-object';
    if (!this.props.isAuthorized) {
      classString += ' edit-disabled';
    }

    const userContentObjectClassString = 'generic-object';
    let genericOfficialObjectClassString = 'real-object';
    const officialObjectClassString = 'official-object';

    let isManufacturer = false;
    let isSelected = false;

    const userManufs = _.map(this.props.userManufacturers, (manuf, i) => {
      let classString = 'manufacturer-select';

      if (manuf.Id == self.props.selectedManufacturer) {
        classString += ' selected';
        isSelected = true;
      }

      isManufacturer = true;

      return (
        <div
          key={i}
          data-mid={manuf.Id}
          className={classString}
          onClick={self.props._handleSelectManuf}
        >
          <div className="logo">
            <img src={manuf.LogoPath} alt="" />
          </div>
          <h6 className="legende">{manuf.Name}</h6>
        </div>
      );
    });

    if (this.props.submitAuto && $('#setOfficial')[0].checked) {
      this.props.checkEmptyProperties();
    }

    let manufTag = '';
    let chooseManuf;
    if (this.props.isChanged && this.props.newObjectType == 'official') {
      chooseManuf = (
        <div className="flex-list choose-manufacturer manufacturer-list">
          <h4 className="choose-manufacturer-title">
            {this.props.resources.EditionPage.ChooseManufacturer}
          </h4>
          {userManufs}
        </div>
      );
      manufTag = (
        <ManufacturerTags
          initialData={this.props.manufacturerTag}
          bimObjectId={this.props.bimObjectId}
          resources={this.props.resources}
          isAuthorized={this.props.manufacturerAuthorized}
          language={this.props.language}
          _handleChooseManufacturerTag={this.props._handleChooseManufacturerTag}
          managementCloudId={this.props.managementCloudId}
          manufacturerCreate={this.props.manufacturerCreate}
          companyCreate={this.props.companyCreate}
          TemporaryToken={this.props.TemporaryToken}
        />
      );
    }

    let isGenericAuthorizedPartner = false;

    const userCompanies = _.map(this.props.userCompanies, (company, i) => {
      if (company.IsGenericOfficialAuthorized) {
        let classString = 'manufacturer-select';

        if (company.Id == self.props.selectedCompany) {
          classString += ' selected';
        }

        isGenericAuthorizedPartner = true;

        return (
          <div
            key={i}
            data-mid={company.Id}
            className={classString}
            onClick={self.props._handleSelectCompany}
          >
            <div className="logo">
              <img src={company.LogoPath} alt="" />
            </div>
            <h6 className="legende">{company.Name}</h6>
          </div>
        );
      }
    });

    if (!isGenericAuthorizedPartner) {
      genericOfficialObjectClassString += ' hidden';
    }

    let chooseCompany;
    if (this.props.isChanged && this.props.newObjectType == 'genericOfficial') {
      chooseCompany = (
        <div className="flex-list choose-manufacturer manufacturer-list">
          <h4 className="choose-manufacturer-title">
            {this.props.resources.EditionPage.ChooseCompany}
          </h4>
          {userCompanies}
        </div>
      );
    }

    let submitButton;
    if (this.props.isChanged) {
      if (
        (this.props.userManufacturers != null && this.props.userManufacturers.length > 0) ||
        this.props.newObjectType != 'official'
      ) {
        let d = '';
        if (this.props.selectedManufacturer !== 0 && this.props.manufacturerTag !== null) {
          d = 'disabled';
        }
        submitButton = (
          <div>
            <p className="warning-message">
              {this.props.resources.CreateObjectPage.ChangeObjectTypeWarning}
            </p>
            <input
              type="submit"
              className="btn-first btn-green btn-picto-save"
              value={this.props.resources.EditionPage.SetBtnLabel}
              onClick={this.props._handleObjectUpgrade}
              disabled={d}
            />
          </div>
        );
      } else {
        submitButton = (
          <div>
            <p className="warning-message">
              {this.props.resources.EditionPage.YouDoNotHaveAnyManufacturer}
            </p>
          </div>
        );
      }
    }

    return (
      <div className={classString}>
        <div className="panel-header">
          <h3 className="title">{this.props.resources.EditionPage.ObjectTypeBlockTitle}</h3>
        </div>
        <div className="panel-content">
          <fieldset id="object-type-selection">
            <div className={userContentObjectClassString}>
              <input
                type="radio"
                id="setUserContent"
                name="objectType"
                value="userContent"
                checked={
                  (this.props.newObjectType != null && this.props.newObjectType == 'userContent') ||
                  (this.props.newObjectType == null && this.props.objectType == 'userContent') ||
                  this.props.newObjectType == 'genericOfficial' ||
                  (this.props.objectType == 'genericOfficial' && this.props.newObjectType == null)
                }
                disabled={false}
                onChange={this.props._handleChangedStatus}
              />
              <label htmlFor="setUserContent">
                {
                  /* this.props.resources["EditionPage"]["UserContentObjectLabel"] */ this.props
                    .resources.EditionPage.GenericOfficialObjectLabel
                }
              </label>

              <p>{this.props.resources.EditionPage.UserContentObjectDescription}</p>
            </div>

            {/* Commentaire car on n'a plus accès à objet générique. C'est déterminé automatiquement
                                    <div className={genericOfficialObjectClassString}>
                                    <input type="radio"
                                            id="setGenericOfficial"
                                            name="objectType"
                                            value="genericOfficial"
                                            checked={(this.props.newObjectType != null && this.props.newObjectType == "genericOfficial") || (this.props.newObjectType == null && this.props.objectType == "genericOfficial")}
                                            disabled={!isGenericAuthorizedPartner}
                                            onChange={this.props._handleChangedStatus} />
                                    <label htmlFor="setGenericOfficial">{this.props.resources["EditionPage"]["GenericOfficialObjectLabel"]}</label>

                                    <p>{this.props.resources["EditionPage"]["GenericOfficialObjectDescription"]}</p>
                                </div>
                        */}
            <div className={officialObjectClassString}>
              <input
                type="radio"
                id="setOfficial"
                name="objectType"
                value="official"
                readOnly
                checked={
                  (this.props.newObjectType != null && this.props.newObjectType == 'official') ||
                  (this.props.newObjectType == null && this.props.objectType == 'official')
                }
                onClick={this.props._handleChangedStatus}
              />
              <label htmlFor="setOfficial">
                {this.props.resources.EditionPage.OfficialObjectLabel}
              </label>

              <p>{this.props.resources.CreateObjectPage.OfficialObjectDescription}</p>
            </div>
          </fieldset>

          {chooseManuf}
          {manufTag}
          {chooseCompany}

          <div className="submit-button-block">{submitButton}</div>
        </div>
      </div>
    );
  },
});

export default ObjectUpgrade;