import React from 'react';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from '@emotion/styled';

const Loader = styled.div({
  position: 'fixed',
  top: '58px',
  bottom: 0,
  right: 0,
  display: 'flex',
  width: '100%',
  background: 'rgba(255, 255, 255, 0.8)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 30001,
});

class Loading extends React.PureComponent {
  render() {
    if (!this.props.Loader) {
      return null;
    }

    return (
      <Loader id="loader-spinner">
        <CircularProgress disableShrink />
      </Loader>
    );
  }
}

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    Loader: appState.Loader,
  };
};

export default connect(mapStateToProps)(Loading);