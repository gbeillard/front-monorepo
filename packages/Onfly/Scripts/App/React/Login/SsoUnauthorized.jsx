import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';

import toastr from 'toastr';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

// material ui icons
import ArrowForwardIcon from '@material-ui/icons/ArrowForward.js';
import * as Utils from '../../Utils/utils.js';
import store from '../../Store/Store';
import { API_URL } from '../../Api/constants';
import { logout } from './SsoLogout';
import { defaultTheme, H3, Button as ButtonDS } from '@bim-co/componentui-foundation';
import { getLocationFrom } from '../../Utils/location';
import { v4 as uuid } from 'uuid';
import { SSO_URL } from '../../Api/constants';

const SsoUnauthorized = createReactClass({
  getInitialState() {
    return {
      emailInputError: '',
      fnameInputError: '',
      lnameInputError: '',
      jobInputError: '',
      cityInputError: '',
    };
  },

  componentWillMount() {
    const urlParams = new URLSearchParams(window.location.search)
    if(urlParams.has('login'))
    {
      const nonce = uuid();
      const state = uuid();

      const redirectUri = encodeURIComponent(`${window.location.origin}/${this.props.Language}/signin-oidc`);
      const scope = 'openid bim.api.onfly offline_access';
      const responseType = 'code id_token';
      const onflyClientId = localStorage.getItem('OnflyClientId');

      const url = `${SSO_URL}/api/connect/authorize?client_id=${onflyClientId}&scope=${scope}&redirect_uri=${redirectUri}&response_type=${responseType}&state=${state}&nonce=${nonce}&onflyId=${this.props.managementCloudId}`;
      
      const pathname = getLocationFrom(location) || '/';
      localStorage.setItem('lastLoginLocation', pathname);
      window.location.href = url;
    }

    store.dispatch({ type: 'SET_TITLE_PAGE', data: '' });
  },

  logoutHandler(){
    const redirectUri = `${window.location.origin}/${this.props.Language}/unauthorized?login=true`;
    logout(redirectUri);
  },

  tryLogin() {
    const email = this.emailSessionLogin.value;
    const password = this.passwordSessionLogin.value;
    const self = this;

    store.dispatch({ type: 'LOADER', state: true });

    fetch(`${API_URL}/api/ws/getuserauthtoken`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        password,
      }),
    })
      .then((response) => {
        store.dispatch({ type: 'LOADER', state: false });
        if (response.status !== 200) {
          toastr.error(self.props.Resources.ContentManagement.UncorrectLogin);
          return null;
        }
        return response.json();
      })
      .then((json) => {
        if (json != null && Utils.validateGUID(json)) {
          const action = { data: json, type: 'UPDATE_AUTH_TOKEN' };
          store.dispatch(action);
        }
      });
  },

  handleOnKeyUp(event) {
    if (event.keyCode === 13) {
      if ($('.login-container').not('.hidden').length > 0) {
        this.tryLogin();
      } else if ($('.reset-password-container').not('.hidden').length > 0) {
        this.resetPassword();
      }
    }
  },

  displayLogin() {
    $('.reset-password-container').addClass('hidden');
    $('.request-access-container').addClass('hidden');
    $('.reset-password-container-confirm').addClass('hidden');
    $('.login-container').removeClass('hidden');
  },

  requestAccess() {
    $('.request-access-container').removeClass('hidden');
    $('.login-container').addClass('hidden');
    $('.reset-password-container-confirm').addClass('hidden');
  },

  checkEmailBeforeAll() {
    const inputEmail = this.inputEmailUser.value.replace(/\s/g, '');
    const self = this;

    // email check
    if (!Utils.validateEmail(inputEmail) || inputEmail == '') {
      self.setState({
        emailInputError: self.props.Resources.UsersManagement.MissingOrIncorrectMail,
      });
      return;
    }

    fetch(`${API_URL}/api/ws/v1/user/onflyaccess/emailcheck`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        OnFlyId: self.props.managementCloudId,
        UserEmail: inputEmail,
      }),
    }).then((response) => {
      store.dispatch({ type: 'LOADER', state: false });
      if (response.status != 200) {
        self.setState({ emailInputError: self.props.Resources.UsersManagement.AlreadyOnFlyUser });
        return;
      }

      self.checkRequests();
    });
  },

  checkRequests() {
    const inputEmail = this.inputEmailUser.value.replace(/\s/g, '');
    const self = this;

    fetch(`${API_URL}/api/ws/v1/user/onflyaccess/requestcheck`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        OnFlyId: self.props.managementCloudId,
        UserEmail: inputEmail,
      }),
    }).then((response) => {
      store.dispatch({ type: 'LOADER', state: false });
      if (response.status != 200) {
        self.setState({
          emailInputError: self.props.Resources.UsersManagement.AlreadyRequestedMail,
        });
        return;
      }

      self.checkDomain();
    });
  },

  checkDomain() {
    const inputEmail = this.inputEmailUser.value.replace(/\s/g, '');
    const self = this;

    fetch(`${API_URL}/api/ws/v1/user/onflyaccess/domaincheck`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        OnFlyId: self.props.managementCloudId,
        UserEmail: inputEmail,
      }),
    }).then((response) => {
      store.dispatch({ type: 'LOADER', state: false });
      if (response.status != 200) {
        self.setState({
          emailInputError: self.props.Resources.UsersManagement.UnauthorizedDomainName,
        });
        return;
      }

      self.setState({ emailInputError: '' });
      self.sendOnFlyRequest();
    });
  },

  sendOnFlyRequest() {
    const onFlyId = this.props.managementCloudId;
    const inputEmail = this.inputEmailUser.value.replace(/\s/g, '');
    const inputFname = this.inputFnameUser.value.trim();
    const inputLname = this.inputLnameUser.value.trim();
    const inputCity = this.inputCityNameUser.value.trim();
    const inputJob = this.inputJobUser.value.trim();
    const self = this;
    let isOk = true;
    let fnameerror = '';
    let lnameerror = '';
    let joberror = '';
    let cityerror = '';

    // inputs
    if (inputFname === '') {
      fnameerror = self.props.Resources.UsersManagement.MissingFname;
      isOk = false;
    } else {
      fnameerror = '';
    }

    if (inputLname === '') {
      lnameerror = self.props.Resources.UsersManagement.MissingLname;
      isOk = false;
    } else {
      lnameerror = '';
    }

    if (inputCity === '') {
      cityerror = self.props.Resources.UsersManagement.MissingCity;
      isOk = false;
    } else {
      cityerror = '';
    }

    if (inputJob === '') {
      joberror = self.props.Resources.UsersManagement.MissingJob;
      isOk = false;
    } else {
      joberror = '';
    }

    self.setState({
      fnameInputError: fnameerror,
      lnameInputError: lnameerror,
      cityInputError: cityerror,
      jobInputError: joberror,
    });

    if (isOk) {
      store.dispatch({ type: 'LOADER', state: true });

      fetch(`${API_URL}/api/ws/v1/user/onflyaccessrequest/send`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          OnFlyId: onFlyId,
          UserEmail: inputEmail,
          UserFirstName: inputFname,
          UserLastName: inputLname,
          RequestCity: inputCity,
          UserJob: inputJob,
        }),
      }).then((response) => {
        store.dispatch({ type: 'LOADER', state: false });
        if (response.status === 200) {
          toastr.success(self.props.Resources.UsersManagement.RequestSended);
          self.displayLogin();
        } else {
          toastr.error(self.props.Resources.UsersManagement.RequestProblem);
        }
      });
    }
  },

  render() {
    return (
      <div id="login-page-wrapper" onKeyUp={this.handleOnKeyUp} data-test-id="login">
        <img src={this.props.EntityLogo} className="logo-bg" />
        <div className="login-panel panel panel-default panel-login">
          <div className="panel-body">
            <div className="login-container">
              <div className="panel-header">
                <div className="userprofile text-center">
                  <div className="userpic userpiclogin">
                    <img
                      src={`${this.props.EntityLogo}?width=120&height=120&scale=both`}
                      className="userpicimg"
                    />
                  </div>
                </div>
                <h2 className="text-center">{this.props.Resources.AnalyticsLogin.SignIn}</h2>
              </div>
              <fieldset>
                <div className="bottom-panel-body">
                  <H3 color={defaultTheme.status.dangerTextColor}>
                    {this.props.Resources.SessionLogin.UnauthorizedMessage}
                  </H3>
                  <div className="btn-content">
                    <ButtonDS onClick={() => this.logoutHandler()}>
                      {this.props.Resources.SessionLogin.SignWithAnotherAccount}
                    </ButtonDS>
                  </div>
                </div>
                <div
                  className="bottom-panel-body-request"
                  onClick={this.requestAccess}
                  style={{ cursor: 'pointer' }}
                >
                  <span>{this.props.Resources.SessionLogin.AskAccess}</span>
                  <ArrowForwardIcon />
                </div>
              </fieldset>
            </div>

            <div className="request-access-container hidden">
              <div className="panel-header">
                <h2 className="text-center">
                  {this.props.Resources.UsersManagement.AccessRequestBoardingPass}
                </h2>
              </div>
              <div className="logos-inline">
                <img
                  src={`${this.props.EntityLogo}?width=120&height=120&scale=both`}
                  className="userpicimg"
                />
                <ArrowForwardIcon />
                <img src="/Content/images/logo-loading.png" />
              </div>
              <div className="border">
                <span className="border-left" />
                <span className="border-center" />
                <span className="border-right" />
              </div>
              <fieldset>
                <div className="form-group">
                  <TextField
                    error={this.state.emailInputError != ''}
                    id="email"
                    label={this.props.Resources.UsersManagement.EmailLabel}
                    inputRef={(input) => {
                      this.inputEmailUser = input;
                    }}
                    helperText={this.state.emailInputError}
                  />
                  <TextField
                    id="fname"
                    error={this.state.fnameInputError != ''}
                    label={this.props.Resources.UsersManagement.FirstNameLabel}
                    inputRef={(input) => {
                      this.inputFnameUser = input;
                    }}
                    helperText={this.state.fnameInputError}
                  />
                  <TextField
                    id="lname"
                    error={this.state.lnameInputError != ''}
                    label={this.props.Resources.UsersManagement.LastNameLabel}
                    inputRef={(input) => {
                      this.inputLnameUser = input;
                    }}
                    helperText={this.state.lnameInputError}
                  />
                  <TextField
                    id="jobtitle"
                    error={this.state.jobInputError != ''}
                    label={this.props.Resources.UsersManagement.JobLabel}
                    inputRef={(input) => {
                      this.inputJobUser = input;
                    }}
                    helperText={this.state.jobInputError}
                  />
                  <TextField
                    id="city"
                    error={this.state.cityInputError != ''}
                    label={this.props.Resources.UsersManagement.CityLabel}
                    inputRef={(input) => {
                      this.inputCityNameUser = input;
                    }}
                    helperText={this.state.cityInputError}
                  />
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  className="btn-raised"
                  fullWidth
                  onClick={this.checkEmailBeforeAll}
                >
                  {this.props.Resources.UsersManagement.RequestAccessButton}
                </Button>
              </fieldset>
              <span className="reset-password" onClick={this.displayLogin}>
                {this.props.Resources.SessionLogin.SignWithAnotherAccount}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
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
    Resources: appState.Resources[appState.Language],
    SubDomain: appState.SubDomain,
    managementCloudId: appState.ManagementCloudId,
  };
};

export default connect(mapStateToProps)(SsoUnauthorized);