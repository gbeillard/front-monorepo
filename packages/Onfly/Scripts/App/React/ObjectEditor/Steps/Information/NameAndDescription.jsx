import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';
import toastr from 'toastr';

// import material ui material
import Typography from '@material-ui/core/Typography';

// material ui icons
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ListIcon from '@material-ui/icons/List';
import CloseIcon from '@material-ui/icons/Close';
import TranslateIcon from '@material-ui/icons/Translate';
import CheckIcon from '@material-ui/icons/Check';
import { API_URL } from '../../../../Api/constants';
import store from '../../../../Store/Store';
import { history } from '../../../../history';
import { withRouter } from '../../../../Utils/withRouter';

const NameAndDescription = createReactClass({
  getInitialState() {
    return {
      data: [],
      addedLanguage: false,
      languageSelectDefault: '',
      descriptionIdToDelete: '',
      hasAutomaticTranslation: false,
      translationInProgress: false,
      bimobjname: '',
    };
  },

  componentDidMount() {
    if (this.props.bimObjectId != null) {
      if (this.props.location.state != null) {
        this.state.translationInProgress =
          this.props.location.state.translationInProgress != null
            ? this.props.location.state.translationInProgress
            : false;
      }

      this.loadBimObjectDescriptions(this.props.bimObjectId);
    } else {
      this.setState(this.getInitialState());
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.bimObjectId != null) {
      if (this.props.location.state != null) {
        this.state.translationInProgress =
          this.props.location.state.translationInProgress != null
            ? this.props.location.state.translationInProgress
            : false;
        this.loadBimObjectDescriptions(nextProps.bimObjectId);
      }
    } else {
      this.setState(this.getInitialState());
    }
  },

  loadBimObjectDescriptions(objectId) {
    const self = this;

    fetch(`${API_URL}/api/ws/v1/bimobject/description/list?token=${this.props.TemporaryToken}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ ObjectId: objectId }]),
    })
      .then((response) => response.json())
      .then((json) => {
        let hasAutomaticTranslation = false;
        let { translationInProgress } = self.state;

        if (json != null) {
          hasAutomaticTranslation = _.findLastIndex(json, { IsAutomaticTranslate: true }) > -1;
        }

        if (hasAutomaticTranslation) {
          translationInProgress = false;
        }

        self.setState({ data: json, hasAutomaticTranslation, translationInProgress });
        this.props.refreshInformation();
      });
  },

  _handleCreateLang(event) {
    var self = this;
    store.dispatch({ type: 'LOADER', state: true });

    let languageCode = $('#create-lang-modal .bimobjectlang-language-code').val();
    if (this.state.addedLanguage) {
      languageCode = $('#create-lang-modal .bimobjectlang-addlanguage-code').val();
    }

    const name = $('#create-lang-modal .bimobjectlang-name').val();
    const description = $('#create-lang-modal .bimobjectlang-description').val();
    const isdefault = $('#create-lang-modal .bimobjectlang-isdefault').prop('checked');

    // objet existant
    if (this.props.bimObjectId != null) {
      fetch(
        `${API_URL}/api/ws/v1/bimobject/description/addorupdate?token=${this.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            {
              ObjectId: self.props.bimObjectId,
              LanguageCode: languageCode,
              Name: name,
              Description: description,
              IsDefault: isdefault,
            },
          ]),
        }
      ).then((response) => {
        this.loadBimObjectDescriptions(this.props.bimObjectId);
        store.dispatch({ type: 'LOADER', state: false });
        $('#create-lang-modal .bimobjectlang-name').val('');
        $('#create-lang-modal .bimobjectlang-description').val('');
        $('#create-lang-modal .bimobjectlang-isdefault').prop('checked', false);
        $('#create-lang-modal').modal('hide');
        this.props.refreshInformation();
      });
      // creation de l'objet
    } else {
      var self = this;
      $('#create-lang-modal').modal('hide');
      store.dispatch({ type: 'LOADER', state: true });

      const newTypeCapitalized =
        this.props.objectTypeCreate[0].toUpperCase() + this.props.objectTypeCreate.slice(1);
      let data = null;

      const manufacturerTagId =
        this.props.manufacturerTag != null ? this.props.manufacturerTag.Id : null;
      const manufacturerTagName =
        this.props.manufacturerTag != null ? this.props.manufacturerTag.Name : null;

      if (this.props.objectTypeCreate == 'official') {
        data = {
          ObjectType: newTypeCapitalized,
          ManufacturerId: this.props.manufacturerCreate,
          ManufacturerTagId: manufacturerTagId,
          ManufacturerTagName: manufacturerTagName,
          Details: [
            {
              LanguageCode: languageCode,
              Name: name.trim(),
              Description: description.trim(),
              isDefault: true,
            },
          ],
        };
      } else if (this.props.objectTypeCreate == 'genericOfficial') {
        data = {
          ObjectType: newTypeCapitalized,
          CompanyId: this.props.companyCreate,
          Details: [
            {
              LanguageCode: languageCode,
              Name: name.trim(),
              Description: description.trim(),
              isDefault: true,
            },
          ],
        };
      } else {
        data = {
          ObjectType: newTypeCapitalized,
          Details: [
            {
              LanguageCode: languageCode,
              Name: name.trim(),
              Description: description.trim(),
              isDefault: true,
            },
          ],
        };
      }

      fetch(
        `${API_URL}/api/ws/v2/contentmanagement/${this.props.managementCloudId}/bimobject/initialize?token=${this.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )
        .then((response) => response.json())
        .then((json) => {
          store.dispatch({ type: 'LOADER', state: false });
          if (Number.isInteger(json.BimObjectId)) {
            history.push({
              pathname: `/${self.props.language}/bimobject/${json.BimObjectId}/edit/informations`,
              state: { translationInProgress: true },
            });
            this.props.refreshInformation();
          } else {
            toastr.error('error');
          }
        });
    }
  },

  prepareEdit(event) {
    const data = event.currentTarget.dataset;

    $('#edit-lang-modal .bimobjectlang-edit-language-code').val(data.language);
    $('#edit-lang-modal .bimobjectlang-name').val(data.name);
    $('#edit-lang-modal .bimobjectlang-description').val(data.description);
    $('#edit-lang-modal .bimobjectlang-isdefault').prop('checked', data.isdefault == 'true');

    $('#edit-lang-modal').modal();
  },

  handleEditLang(event) {
    const self = this;

    const languageCode = $('#edit-lang-modal .bimobjectlang-edit-language-code').val();
    const name = $('#edit-lang-modal .bimobjectlang-name').val();
    const description = $('#edit-lang-modal .bimobjectlang-description').val();
    const isdefault = $('#edit-lang-modal .bimobjectlang-isdefault').prop('checked');

    fetch(
      `${API_URL}/api/ws/v1/bimobject/description/addorupdate?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            ObjectId: self.props.bimObjectId,
            LanguageCode: languageCode,
            Name: name,
            Description: description,
            IsDefault: isdefault,
          },
        ]),
      }
    ).then((response) => {
      this.loadBimObjectDescriptions(self.props.bimObjectId);
      $('#edit-lang-modal').modal('hide');
      this.props.refreshInformation();
    });
  },

  handleDeleteLang(event) {
    const self = this;
    const lid = self.state.descriptionIdToDelete;

    fetch(`${API_URL}/api/ws/v1/bimobject/description/remove?token=${this.props.TemporaryToken}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ ObjectId: self.props.bimObjectId, LanguageCode: lid }]),
    }).then((response) => {
      self.loadBimObjectDescriptions(self.props.bimObjectId);
      self.props.refreshInformation();
      $('#delete-lang-modal').modal('hide');
    });
  },

  _initModal(event) {
    if (this.state.languageSelectDefault != '') {
      $('#create-lang-modal .bimobjectlang-language-code').val(this.state.languageSelectDefault);
    } else {
      const firstValue = $('#create-lang-modal .bimobjectlang-language-code option:first').val();
      $('#create-lang-modal .bimobjectlang-language-code').val(firstValue);
    }

    $('#addedLanguages').hide();
    $('#ShowClassicLang').hide();
    $('#commonsLanguages').show();
    $('#ShowAddLang').show();
  },

  _showAddedLanguageSelection(event) {
    this.setState({ addedLanguage: true });

    $('#commonsLanguages').hide();
    $('#ShowAddLang').hide();
    $('#addedLanguages').fadeIn(500);
    $('#ShowClassicLang').fadeIn(500);
  },

  _showClassicLanguageSelection(event) {
    this.setState({ addedLanguage: false });

    $('#addedLanguages').hide();
    $('#ShowClassicLang').hide();
    $('#commonsLanguages').fadeIn(500);
    $('#ShowAddLang').fadeIn(500);
  },

  _openDeleteModal(event) {
    if (this.state.data.length <= 1) {
      toastr.error(this.props.resources.EditionPage.OneLangLeft);
      return;
    }

    const { lid } = event.currentTarget.dataset;
    this.setState({ descriptionIdToDelete: lid });
    $('#delete-lang-modal').modal();
  },

  onChangeInputName(event) {
    this.setState({ bimobjname: event.target.value.trim() });
  },

  render() {
    const self = this;

    const langOptionsFull = [];

    this.props.languages.sort((a, b) => {
      let comparison = 0;
      if (a.Translations[self.props.language] > b.Translations[self.props.language]) {
        comparison = 1;
      } else if (a.Translations[self.props.language] < b.Translations[self.props.language]) {
        comparison = -1;
      }
      return comparison;
    });

    const langOptions = this.props.languages.map((lang, i) => {
      if (lang.IsInterface) {
        langOptionsFull.push(
          <option key={i} value={lang.LanguageCode}>
            {lang.Translations[self.props.language]}
          </option>
        );
        if (
          _.find(self.state.data, (dataDesc) => dataDesc.LanguageCode == lang.LanguageCode) == null
        ) {
          return (
            <option key={i} value={lang.LanguageCode}>
              {lang.Translations[self.props.language]}
            </option>
          );
        }
      }
    });

    const currentLang = _.find(
      self.state.data,
      (dataDesc) => dataDesc.LanguageCode == self.props.language
    );
    const langEn = _.find(self.state.data, (dataDesc) => dataDesc.LanguageCode == 'en');

    if (currentLang == null) {
      self.state.languageSelectDefault = self.props.language;
    } else if (langEn == null) {
      self.state.languageSelectDefault = 'en';
    } else if (this.props.languages.length > 0) {
      self.state.languageSelectDefault = '';
    }

    const additionalLangOptions = this.props.languages.map((lang, i) => {
      if (!lang.IsInterface) {
        langOptionsFull.push(
          <option key={i} value={lang.LanguageCode}>
            {lang.Translations[self.props.language]}
          </option>
        );
        if (
          _.find(self.state.data, (dataDesc) => dataDesc.LanguageCode == lang.LanguageCode) == null
        ) {
          return (
            <option key={i} value={lang.LanguageCode}>
              {lang.Translations[self.props.language]}
            </option>
          );
        }
      }
    });
    let rows;

    if (this.state.data.length !== 0) {
      rows = this.state.data.map((lang, i) => (
        <tr key={lang.LanguageCode}>
          <td>
            {
              _.find(this.props.languages, (dataDesc) => dataDesc.LanguageCode == lang.LanguageCode)
                .Translations[self.props.language]
            }
          </td>
          <td data-cy="col-name">{lang.Name}</td>
          <td>{lang.Description}</td>
          <td>{lang.IsDefault ? '✓' : null}</td>
          <td className="text-right">
            <a className="edit-lang edit-btn">
              <EditIcon
                data-language={lang.LanguageCode}
                data-name={lang.Name}
                data-description={lang.Description}
                data-isdefault={lang.IsDefault}
                onClick={this.prepareEdit}
              />
            </a>
            <a className="delete-lang delete-btn">
              <DeleteIcon data-lid={lang.LanguageCode} onClick={this._openDeleteModal} />
            </a>
          </td>
        </tr>
      ));
    }

    let classString = 'panel panel-object-langs edit-object';
    if (!this.props.isAuthorized) {
      classString += ' edit-disabled';
    }

    let additionalLangsRender = '';
    if (additionalLangOptions.length > 0) {
      additionalLangsRender = (
        <div>
          <span className="" data-toggle="modal" id="ShowAddLang">
            <button
              id="language-table"
              onClick={this._showAddedLanguageSelection}
              className="btn btn-link"
            >
              <ListIcon /> {this.props.resources.EditionPage.AddedLanguageNameLabel}
            </button>
          </span>

          <div className="form-group" id="addedLanguages">
            <label>{this.props.resources.EditionPage.AdditionnalLanguages}</label>
            <select className="form-control bimobjectlang-addlanguage-code">
              {additionalLangOptions}
            </select>
          </div>

          <span className="" data-toggle="modal" id="ShowClassicLang">
            <button
              id="language-table"
              onClick={this._showClassicLanguageSelection}
              className="btn btn-link"
            >
              <ListIcon /> {this.props.resources.EditionPage.ClassicLanguageNameLabel}
            </button>
          </span>
        </div>
      );
    }

    let classNameAddLang = 'browse fileinput-button';
    if (langOptions.length == 0 && additionalLangOptions.length == 0) {
      classNameAddLang += ' hidden';
    }

    return (
      <div>
        <div className={classString}>
          <div className="col-md-7">
            <h3>{this.props.resources.EditionPages.NameAndDescriptionTitle}</h3>
            <p>{this.props.resources.EditionPages.NameAndDescriptionText}</p>
            {self.props.EnableAutomaticTranslation && self.state.hasAutomaticTranslation ? (
              <div className="automatic-translation-information align-bottom">
                <div className="icon-group">
                  <TranslateIcon className="translate-icon" />
                  <CheckIcon className="check-icon" />
                </div>
                <p
                  className="translation-provided-by"
                  dangerouslySetInnerHTML={{
                    __html: this.props.resources.AutomaticTranslation.ProvidedByWithLink,
                  }}
                />
              </div>
            ) : null}
          </div>
          <div className="col-md-15 col-md-offset-1">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>{this.props.resources.EditionPage.MetaBimObjectLanguage}</th>
                  <th>{this.props.resources.EditionPage.MetaBimObjectName}</th>
                  <th>{this.props.resources.EditionPage.MetaBimObjectDescription}</th>
                  <th>{this.props.resources.EditionPage.MetaBimObjectDefault}</th>
                  <th />
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </table>
            {self.props.EnableAutomaticTranslation && self.state.translationInProgress ? (
              <Typography variant="body2" className="text-green">
                {this.props.resources.AutomaticTranslation.TranslationInProgress}
              </Typography>
            ) : null}
            <span
              className={classNameAddLang}
              data-toggle="modal"
              data-target="#create-lang-modal"
              onClick={this._initModal}
            >
              <a className="btn-blue btn-third">
                {this.props.resources.EditionPage.AddNameAndDescription}
              </a>
            </span>
          </div>
        </div>

        <div
          className="modal fade"
          id="create-lang-modal"
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
                  {this.props.resources.EditionPage.CreateLanguageBimObjectTitle}
                </h4>
              </div>
              <div className="modal-body">
                <div className="form-group" id="commonsLanguages">
                  <label>{this.props.resources.EditionPage.LanguageNameLabel}</label>
                  <select className="bimobjectlang-language-code form-control" data-cy="langues">
                    {langOptions}
                  </select>
                </div>

                {additionalLangsRender}

                <div className="form-group">
                  <label>{this.props.resources.EditionPage.BimObjectNameLabel}</label>
                  <input
                    className="bimobjectlang-name form-control"
                    data-cy="Nom de l'objet"
                    onChange={this.onChangeInputName}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label>{this.props.resources.EditionPage.BimObjectDescriptionLabel}</label>
                  <textarea rows="10" className="bimobjectlang-description form-control" />
                </div>
                <div className="form-group">
                  <label className="pointer">
                    <input
                      type="checkbox"
                      id="default-lang"
                      className="bimobjectlang-isdefault pointer"
                    />
                    {this.props.resources.EditionPage.BimObjectDefaultLanguageLabel}
                  </label>
                  <p className="default-lang-text legende">
                    {this.props.resources.EditionPage.DefaultLangText}
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-second btn-grey" data-dismiss="modal">
                  {this.props.resources.EditionPage.CloseBtnLabel}
                </button>
                {this.state.bimobjname != '' ? (
                  <button
                    type="button"
                    className="btn-second btn-blue create-lang"
                    onClick={this._handleCreateLang}
                  >
                    {this.props.resources.EditionPage.SaveBtnLabel}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="edit-lang-modal"
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
                  {this.props.resources.EditModalTitle}
                </h4>
              </div>
              <div className="modal-body">
                <div className="form-group" id="commonsLanguages">
                  <label>{this.props.resources.EditionPage.LanguageNameLabel}</label>
                  <select className="bimobjectlang-edit-language-code">{langOptionsFull}</select>
                </div>

                <div className="form-group">
                  <label>{this.props.resources.EditionPage.BimObjectNameLabel}</label>
                  <input className="bimobjectlang-name form-control" type="text" />
                </div>
                <div className="form-group">
                  <label>{this.props.resources.EditionPage.BimObjectDescriptionLabel}</label>
                  <textarea rows="10" className="bimobjectlang-description form-control" />
                </div>
                <div className="form-group">
                  <label className="pointer">
                    <input type="checkbox" className="bimobjectlang-isdefault pointer" />
                    {this.props.resources.DefaultLangLabel}
                  </label>
                  <p className="default-lang-text legende">
                    {this.props.resources.EditionPage.DefaultLangText}
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-second btn-grey" data-dismiss="modal">
                  {this.props.resources.EditionPage.CloseBtnLabel}
                </button>
                <button
                  type="button"
                  className="btn-second btn-blue save-lang"
                  onClick={this.handleEditLang}
                >
                  {this.props.resources.EditionPage.SaveBtnLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="delete-lang-modal"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {this.props.resources.EditionPage.DeleteDescriptionTitle}
                </h4>
                <CloseIcon className="close" data-toggle="modal" data-dismiss="modal" />
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <div className="row" />
                  <div className="row">
                    <div className="col-xs-11 text-center">
                      <a data-toggle="modal" onClick={self.handleDeleteLang}>
                        <img
                          src="../../../../../../Content/images/AccepterLaRequete.svg"
                          width="98"
                          height="98"
                          alt=""
                        />
                        <span>{this.props.resources.EditionPage.DeleteDescriptionButton}</span>
                      </a>
                    </div>
                    <div className="col-xs-11 col-xs-offset-1 text-center">
                      <a data-dismiss="modal" aria-label="Close">
                        <img
                          src="../../../../../../Content/images/RejeterLaRequete.svg"
                          width="98"
                          height="98"
                          alt=""
                        />
                        <span>
                          {self.props.resources.UsersManagement.PageMemberRevokeAccessCancel}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default withRouter(NameAndDescription);
