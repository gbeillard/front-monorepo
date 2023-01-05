import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { NavigateFunction } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { withRouter } from '../../Utils/withRouter';
import { history } from '../../history';
import { selectUser } from '../../Reducers/app/selectors';
import { signin as signinAction } from '../../Reducers/authentication/actions';
import {
  selectSigninIsPending,
  selectSigninIsSuccessful,
} from '../../Reducers/authentication/selectors';

type State = {};
type Props = {
  user: { id: number; isAuthenticated: boolean; isBimAndCoAdmin: boolean };
  params: any;
  navigate: NavigateFunction;
  signin: (code: string, languageCode: string) => void;
  signinIsPending: boolean;
  signinIsSuccessful: boolean;
};

// We manipulate unauthenticated components in App.jsx in a way that forces us to use a class component. WTF?
class SigninOidc extends React.Component<Props, State> {
  componentDidMount() {
    if (this.props.signinIsPending || this.props.signinIsSuccessful) {
      return;
    }
    const queryParameters = new URLSearchParams(window.location.hash.replace('#', ''));
    const languageCode: string = this.props.params?.language || 'en';
    const code = queryParameters.get('code');
    const idToken = queryParameters.get('id_token');
    localStorage.setItem('Id_token', idToken);
    this.props.signin(code, languageCode);
  }

  componentDidUpdate(prevProps: Props) {
    // redirect after user is authenticated
    if (this.props?.user.isAuthenticated) {
      const lastKnownLocation = localStorage.getItem('lastLoginLocation') ?? '/';
      if (lastKnownLocation) {
        history.push(lastKnownLocation);
      }
    }

    try {
      Sentry.setUser({
        id: this.props?.user?.id.toString(),
        isAuthenticated: this.props?.user?.isAuthenticated ? 'true' : 'false',
        isBimAndCoAdmin: this.props?.user?.isBimAndCoAdmin ? 'true' : 'false',
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e);
    }
  }

  render() {
    return <p>authenticating...</p>;
  }
}

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  signinIsPending: selectSigninIsPending,
  signinIsSuccessful: selectSigninIsSuccessful,
});
const mapDispatchToProps = (dispatch) => ({
  signin: (code: string, languageCode: string) => dispatch(signinAction(code, languageCode)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SigninOidc));
