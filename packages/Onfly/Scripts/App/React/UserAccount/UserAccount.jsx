import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import _ from 'underscore';
import toastr from 'toastr';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { KeyboardDatePicker } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Fab from '@material-ui/core/Fab';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// material ui icons
import EditIcon from '@material-ui/icons/Edit.js';
import * as Utils from '../../Utils/utils.js';
import * as GeneralApi from '../../Api/GeneralApi.js';
import store from '../../Store/Store';
import { API_URL } from '../../Api/constants';
import UserNavBar from './UserNavBar';

let UserAccount = createReactClass({
  getInitialState() {
    return {
      previousLanguage: this.props.Language,
      data: [],
      selectedPhoto: null,
      errorTextEmail: '',
      UserDetails: this.props.UserDetails,
    };
  },

  componentDidMount() {
    this.state.previousLanguage = this.props.Language;
    store.dispatch({ type: 'UPDATE_USER_ACCOUNT' });
  },

  componentDidUpdate() {
    if (this.state.previousLanguage != this.props.Language) {
      this.state.previousLanguage = this.props.Language;
      store.dispatch({ type: 'UPDATE_USER_ACCOUNT' });
    }
  },

  componentWillReceiveProps(nextProps) {
    if (this.state.UserDetails == null) {
      this.state.UserDetails = nextProps.UserDetails;
    }

    if (
      nextProps.UserDetails?.AvatarAdress &&
      nextProps.UserDetails.AvatarAdress !== this.state.UserDetails?.AvatarAdress
    ) {
      this.state.UserDetails.AvatarAdress = nextProps.UserDetails.AvatarAdress;
      this.forceUpdate();
    }
  },

  updateProfile() {
    const self = this;
    const location = window.location.href.split('.');
    const content = location[0].replace('http://', '').replace('https://', '');
    const userDetails = self.state.UserDetails;

    const d = new Date(userDetails.DateOfBirth);
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear();
    if (month.length < 2) {
      month = `0${month}`;
    }
    if (day.length < 2) {
      day = `0${day}`;
    }
    const birthDateUser = [year, month, day].join('-');

    if (userDetails.FirstName == '') {
      toastr.error(this.props.resources.ContentManagement.FirstNameRequired);
    } else if (userDetails.LastName == '') {
      toastr.error(this.props.resources.ContentManagement.LastNameRequired);
    } else if (userDetails.DefaultLanguage == '') {
      toastr.error(this.props.resources.CreateUserPropModal.LanguageRequiredMessage);
    } else if (this.companyIsEmpty(userDetails)) {
      toastr.error(this.props.resources.ContentManagement.CompanyNameRequired);
    } else if (userDetails.Function == '0') {
      toastr.error(this.props.resources.ContentManagement.FunctionNameRequired);
    } else if (
      userDetails.NewsletterAdress != null &&
      userDetails.NewsletterAdress.replace(/\s/g, '') != '' &&
      Utils.validateEmail(userDetails.NewsletterAdress) == false
    ) {
      toastr.error(this.props.resources.UserProfileEdition.IncorrectMailAdress);
    } else {
      store.dispatch({ type: 'LOADER', state: true });

      fetch(`${API_URL}/api/ws/v1/user/account/update?token=${self.props.TemporaryToken}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ContentManagementId: content,
          FirstName: userDetails.FirstName,
          LastName: userDetails.LastName,
          DateOfBirth: birthDateUser,
          Telephone: userDetails.Telephone,
          Town: userDetails.Town,
          Country: userDetails.Country,
          Language: userDetails.DefaultLanguage,
          CompanyName: userDetails.CompanyName,
          Job: userDetails.Job,
          Function: userDetails.Function,
          Sector: userDetails.Sector,
          NumberOfEmployees: userDetails.NumberOfEmployees,
          AboutUser: userDetails.AboutUser,
          NewsletterEmail: userDetails.NewsletterAdress,
          ContactAccept: userDetails.ContactAccept,
        }),
      })
        .then((response) => {
          if (response.status == 200) {
            store.dispatch({ type: 'LOADER', state: false });
            toastr.success(self.props.resources.UserProfileEdition.AccountUpdateSuccess);
          } else {
            return response.text();
          }
        })
        .then((text) => {
          if (text != undefined) {
            store.dispatch({ type: 'LOADER', state: false });
            toastr.error(self.props.resources.UserProfileEdition.AccountUpdateFail);
          }
        });
    }
  },

  handleChangeUserAbout(event) {
    this.state.UserDetails.AboutUser = event.target.value;
    this.forceUpdate();
  },

  handleChangeFirstName(event) {
    this.state.UserDetails.FirstName = event.target.value;
    this.forceUpdate();
  },

  handleChangeLastName(event) {
    this.state.UserDetails.LastName = event.target.value;
    this.forceUpdate();
  },

  handleChangeTown(event) {
    this.state.UserDetails.Town = event.target.value;
    this.forceUpdate();
  },

  handleChangeCountry(event) {
    this.state.UserDetails.Country = event.target.value;
    this.forceUpdate();
  },

  handleChangeDefaultLanguage(event) {
    this.state.UserDetails.DefaultLanguage = event.target.value;
    this.forceUpdate();
  },

  handleChangeCompanyName(event) {
    this.state.UserDetails.CompanyName = event.target.value;
    this.forceUpdate();
  },

  handleChangeNewsletterAdress(event) {
    this.props.UserDetails.NewsletterAdress = event.target.value;
    if (Utils.validateEmail(event.target.value) == false) {
      this.setState({
        errorTextEmail: this.props.resources.UserProfileEdition.IncorrectMailAdress,
      });
    } else if (this.state.errorTextEmail != '') {
      this.setState({ errorTextEmail: '' });
    }

    this.forceUpdate();
  },

  handleChangeJob(event) {
    this.state.UserDetails.Job = event.target.value;
    this.forceUpdate();
  },

  handleChangeTelephone(event) {
    this.state.UserDetails.Telephone = event.target.value;
    this.forceUpdate();
  },

  handleChangeUserInformationFunction(event) {
    this.state.UserDetails.Function = event.target.value;
    this.forceUpdate();
  },

  handleChangeUserActivity(event) {
    this.state.UserDetails.Sector = event.target.value;
    this.forceUpdate();
  },

  handleChangeUserEmployeNumber(event) {
    this.state.UserDetails.NumberOfEmployees = event.target.value;
    this.forceUpdate();
  },

  handleChangeUserBirthDate(date) {
    this.setState((prevState) => {
      const DateOfBirth = date === null ? '' : date.format('YYYY-MM-DD');
      const { UserDetails } = prevState;
      const updatedUserDetails = { ...UserDetails, DateOfBirth };
      return { ...prevState, UserDetails: updatedUserDetails };
    });
  },

  changeUserAvatar() {
    const self = this;

    $.each(self.docInput.files, (index, doc) => {
      if (doc.size > 10485760) {
        toastr.error(`file : ${doc.name} is too big`);
      }
    });

    store.dispatch({ type: 'LOADER', state: true });

    // Upload du fichier
    const data = new FormData();
    data.append('file', self.docInput.files[0]);
    data.append('workspace', 'official');

    fetch(`${API_URL}/api/ws/v1/user/account/update/avatar?token=${self.props.TemporaryToken}`, {
      method: 'POST',
      body: data,
    }).then(() => {
      store.dispatch({ type: 'LOADER', state: false });
      GeneralApi.getUserDetails(self.props.TemporaryToken);
      self.forceUpdate();
    });
  },

  handleChangeContactAccept() {
    this.state.UserDetails.ContactAccept = event.target.checked;
    this.forceUpdate();
  },

  companyIsEmpty(user) {
    return !user?.CompanyName || user?.CompanyName?.trim() === '';
  },

  render() {
    const self = this;
    const user = this.state.UserDetails;

    if (user != null) {
      const birth =
        user != null && user.DateOfBirth != undefined && user.DateOfBirth != null
          ? user.DateOfBirth.toString()
          : null;
      const day = birth != null ? birth.substring(8, 10) : null;
      const month = birth != null ? birth.substring(5, 7) : null;
      const year = birth != null ? birth.substring(0, 4) : null;
      const userBirthDate =
        birth != null ? new Date(parseInt(year), parseInt(month) - 1, parseInt(day)) : null;

      // get countries
      const countryId = user != null && user.Country != undefined ? user.Country.toString() : '';
      const countriesSelectList = [];
      _.each(self.props.Countries, (country) => {
        const countryName = country.Name != '' ? country.Name : country.Id;
        countriesSelectList.push(
          <MenuItem key={country.Id.toString()} value={country.Id.toString()} data-cy={countryName}>
            {countryName}
          </MenuItem>
        );
      });

      // get languages
      const langId = user != null ? user.DefaultLanguage : 'en';
      const defaultLanguageSelectList = [];
      _.each(self.props.Languages, (lang) => {
        if (lang.IsInterface) {
          const keys = _.keys(lang.Translations);
          let language_trad = '';
          if (_.contains(keys, self.props.Language)) {
            language_trad = lang.Translations[self.props.Language];
          } else {
            language_trad = lang.DefaultName;
          }

          const languageLine = (
            <a className={`change-lang-dropdown-link lang-${lang.LanguageCode}`}>
              {' '}
              {language_trad}{' '}
            </a>
          );

          defaultLanguageSelectList.push(
            <MenuItem key={lang.LanguageCode} value={lang.LanguageCode} data-cy={language_trad}>
              {languageLine}
            </MenuItem>
          );
        }
      });

      // get functions
      const funcId = user != null ? user.Function : '';
      const defaultFunctionsSelectList = [];
      _.each(self.props.Functions, (func) => {
        const functionValue = func.FunctionName != '' ? func.FunctionName : func.FunctionId;
        defaultFunctionsSelectList.push(
          <MenuItem key={func.FunctionId} value={func.FunctionId} data-cy={functionValue}>
            {functionValue}
          </MenuItem>
        );
      });

      // get activities
      const actId = user != null ? user.Sector : '';
      const defaultActivitiesSelectList = [];
      _.each(self.props.Activities, (activity) => {
        const activityLabel = activity.Name || activity.Id;
        defaultActivitiesSelectList.push(
          <MenuItem key={activity.Id} value={activity.Id} data-cy={activityLabel}>
            {activityLabel}
          </MenuItem>
        );
      });

      // get companies size
      const sizeId = user != null ? user.NumberOfEmployees : '';
      const defaultEmployeNumberSelectList = [];
      _.each(self.props.CompaniesSize, (siz) => {
        const sizeValue = siz.CompanySizeValue != '' ? siz.CompanySizeValue : siz.CompanySizeId;
        defaultEmployeNumberSelectList.push(
          <MenuItem key={siz.CompanySizeId} value={siz.CompanySizeId} data-cy={sizeValue}>
            {sizeValue}
          </MenuItem>
        );
      });

      return (
        <div className="edit-profile-panel">
          <UserNavBar />
          <div className="row up-account-part">
            <div className="col-xs-10 col-md-4 col-xs-offset-1">
              <div className="row user-profile-picture">
                <img
                  src={
                    user.AvatarAdress != null
                      ? `${user.AvatarAdress}?w=150&h=150&mode=pad&scale=both`
                      : null
                  }
                  alt=""
                />

                <input
                  accept=".png, .jpg, .jpeg"
                  id="user-avatar"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={self.changeUserAvatar}
                  ref={(ref) => (self.docInput = ref)}
                />
                <label htmlFor="user-avatar">
                  <Fab
                    size="small"
                    component="span"
                    className="btn-blue change-profile-picture-button"
                  >
                    <EditIcon />
                  </Fab>
                </label>
              </div>
            </div>
            <div className="col-xs-10 col-md-4 col-xs-offset-1">
              <div className="row">
                <TextField
                  id="fNameInput"
                  defaultValue={user.FirstName}
                  helperText={
                    user.FirstName == ''
                      ? self.props.resources.UserProfileEdition.RequiredField
                      : ''
                  }
                  error={user.FirstName == ''}
                  onChange={self.handleChangeFirstName}
                  style={{ width: '100%' }}
                  label={self.props.resources.UserProfileEdition.FirstNameLabel}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    'data-cy': self.props.resources.UserProfileEdition.FirstNameLabel,
                  }}
                />
              </div>
              <div className="row">
                <KeyboardDatePicker
                  disableFuture
                  label={self.props.resources.UserAccount.UserInformationBirthDateLabel}
                  value={userBirthDate}
                  onChange={this.handleChangeUserBirthDate}
                  autoOk
                  format="DD/MM/YYYY"
                  style={{ width: '100%' }}
                  inputProps={{
                    'data-cy': 'date-of-birth-picker',
                  }}
                />
              </div>
              <div className="row">
                <FormControl className="formControl_userAccount">
                  <InputLabel shrink htmlFor="userDefaultLang-label">
                    {self.props.resources.UserProfileEdition.DefaultLanguagePlaceHolder}
                  </InputLabel>
                  <Select
                    data-cy={self.props.resources.UserProfileEdition.DefaultLanguagePlaceHolder}
                    required={false}
                    displayEmpty
                    id="userDefaultLang"
                    value={langId}
                    onChange={self.handleChangeDefaultLanguage}
                    style={{ width: '100%' }}
                  >
                    {defaultLanguageSelectList}
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="col-xs-10 col-md-4 col-xs-offset-1">
              <div className="row">
                <TextField
                  id="lNameInput"
                  defaultValue={user.LastName}
                  helperText={
                    user.LastName == '' ? self.props.resources.UserProfileEdition.RequiredField : ''
                  }
                  error={user.LastName == ''}
                  onChange={self.handleChangeLastName}
                  style={{ width: '100%' }}
                  label={self.props.resources.UserProfileEdition.LastNameLabel}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    'data-cy': self.props.resources.UserProfileEdition.LastNameLabel,
                  }}
                />
              </div>
              <div className="row">
                <TextField
                  id="cityInput"
                  defaultValue={user.Town == '' ? '' : user.Town}
                  // helperText={user.Town == "" ? self.props.resources["UserProfileEdition"]["RequiredField"] : ""}
                  // error={user.Town == ""}
                  onChange={self.handleChangeTown}
                  style={{ width: '100%' }}
                  label={this.props.resources.UserProfileEdition.CityLabel}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    'data-cy': this.props.resources.UserProfileEdition.CityLabel,
                  }}
                />
              </div>
            </div>
            <div className="col-xs-10 col-md-4 col-xs-offset-1">
              <div className="row">
                <FormControl className="formControl_userAccount">
                  <InputLabel shrink htmlFor="userCountry-label">
                    {self.props.resources.UserProfileEdition.CountryLabel}
                  </InputLabel>
                  <Select
                    data-cy={self.props.resources.UserProfileEdition.CountryLabel}
                    id="userCountry"
                    required={false}
                    value={countryId}
                    onChange={self.handleChangeCountry}
                    style={{ width: '100%' }}
                  >
                    {countriesSelectList}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>

          <div className="row middle-account-part">
            <div className="col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-1">
              <div className="row">
                <TextField
                  id="companieInput"
                  defaultValue={user.CompanyName}
                  helperText={
                    self.companyIsEmpty(user)
                      ? self.props.resources.UserProfileEdition.RequiredField
                      : ''
                  }
                  error={self.companyIsEmpty(user)}
                  onChange={self.handleChangeCompanyName}
                  style={{ width: '100%' }}
                  label={self.props.resources.UserProfileEdition.CompanyLabel}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    'data-cy': self.props.resources.UserProfileEdition.CompanyLabel,
                  }}
                />
              </div>
              <div className="row">
                <TextField
                  id="newsLetterInput"
                  defaultValue={user.NewsletterAdress}
                  helperText={self.state.errorTextEmail}
                  error={self.state.errorTextEmail != ''}
                  onChange={self.handleChangeNewsletterAdress}
                  style={{ width: '100%' }}
                  label="newsletter"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    'data-cy': 'newsletter',
                  }}
                />
              </div>
            </div>

            <div className="col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-1">
              <div className="row">
                <TextField
                  id="jobTitleInput"
                  defaultValue={user.Job}
                  // helperText={user.Job == "" ? self.props.resources["UserProfileEdition"]["RequiredField"] : ""}
                  // error={user.Job == ""}
                  onChange={self.handleChangeJob}
                  style={{ width: '100%' }}
                  label={self.props.resources.UserAccount.UserInformationJobTitleLabel}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    'data-cy': self.props.resources.UserAccount.UserInformationJobTitleLabel,
                  }}
                />
              </div>
              <div className="row">
                <TextField
                  id="phoneNumberInput"
                  defaultValue={user.Telephone}
                  onChange={self.handleChangeTelephone}
                  maxLength="20"
                  style={{ width: '100%' }}
                  // helperText={user.Telephone == "" ? self.props.resources["UserProfileEdition"]["RequiredField"] : ""}
                  label={self.props.resources.UserProfileEdition.PhoneLabel}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    'data-cy': self.props.resources.UserProfileEdition.PhoneLabel,
                  }}
                />
              </div>
            </div>

            <div className="col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-1">
              <div className="row">
                <FormControl className="formControl_userAccount">
                  <InputLabel shrink htmlFor="userFunction-label">
                    {self.props.resources.UserAccount.UserInformationFunctionLabel}
                  </InputLabel>
                  <Select
                    data-cy={self.props.resources.UserAccount.UserInformationFunctionLabel}
                    required={false}
                    displayEmpty
                    id="userFunction"
                    value={funcId}
                    onChange={self.handleChangeUserInformationFunction}
                    style={{ width: '100%' }}
                  >
                    {defaultFunctionsSelectList}
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-1">
              <div className="row">
                <FormControl className="formControl_userAccount">
                  <InputLabel shrink htmlFor="userActivity-label">
                    {self.props.resources.UserAccount.UserInformationActivityLabel}
                  </InputLabel>
                  <Select
                    data-cy={self.props.resources.UserAccount.UserInformationActivityLabel}
                    displayEmpty
                    required={false}
                    id="userActivity"
                    value={actId}
                    onChange={self.handleChangeUserActivity}
                    style={{ width: '100%' }}
                  >
                    {defaultActivitiesSelectList}
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-1">
              <div className="row">
                <FormControl className="formControl_userAccount">
                  <InputLabel shrink htmlFor="userEmploye-label">
                    {self.props.resources.ManufacturerRegistration.NumberOfEmploye}
                  </InputLabel>
                  <Select
                    data-cy={self.props.resources.ManufacturerRegistration.NumberOfEmploye}
                    displayEmpty
                    required={false}
                    id="userEmploye"
                    value={sizeId}
                    onChange={self.handleChangeUserEmployeNumber}
                    style={{ width: '100%' }}
                  >
                    {defaultEmployeNumberSelectList}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>

          <div className="row down-account-part">
            <div className="col-xs-21 col-md-9 col-xs-offset-1">
              <TextField
                id="aboutUserInput"
                multiline
                InputLabelProps={{
                  className: 'label-for-multiline',
                  shrink: true,
                }}
                rows="3"
                rowsMax="4"
                // ref={(input) => { this.aboutUserInput = input; }}
                defaultValue={user.AboutUser}
                onChange={self.handleChangeUserAbout}
                style={{ width: '100%' }}
                label={self.props.resources.UserAccount.UserInformationAboutMeLabel}
                inputProps={{
                  'data-cy': self.props.resources.UserAccount.UserInformationAboutMeLabel,
                }}
              />
            </div>
          </div>

          <div className="row down-account-part">
            <div className="col-xs-21 col-md-21 col-xs-offset-1">
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={user.ContactAccept}
                    onChange={this.handleChangeContactAccept}
                    className="cgu-checkbox"
                  />
                }
                label={self.props.resources.UserAccount.ContactAccept}
              />
            </div>
          </div>

          <div className="row cguValidation" />

          <div className="row buttons-account-part">
            <div className="col-xs-10 col-md-4 col-xs-offset-1">
              <Button
                variant="contained"
                className="btn-raised btn-send btn-blue"
                onClick={self.updateProfile}
              >
                {this.props.resources.EditPropertiesPage.BtnValidate}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    Title: appState.Title,
    Language: appState.Language,
    EntityLogo: appState.EntityLogo,
    UserIsAuthenticated: appState.UserIsAuthenticated,
    UserId: appState.UserId,
    UserFirstName: appState.UserFirstName,
    UserlastName: appState.UserLastName,
    Role: appState.Role,
    Countries: appState.Countries,
    Languages: appState.Languages,
    Functions: appState.Functions,
    Activities: appState.Activities,
    CompaniesSize: appState.CompaniesSize,
    resources:
      appState.Resources[appState.Language] != null ? appState.Resources[appState.Language] : [],
    UserDetails: appState.UserDetails,
    TemporaryToken: appState.TemporaryToken,
  };
};

export default UserAccount = connect(mapStateToProps)(UserAccount);