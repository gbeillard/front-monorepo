import React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';
import ReactDropzone from 'react-dropzone';
import { defaultTheme } from '@bim-co/componentui-foundation';
import MuiFab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import {
  selectUser,
  selectRole,
  selectToken,
  selectManagementCloudId,
} from '../../Reducers/app/selectors';
import { API_URL } from '../../Api/constants';
import * as GeneralApi from '../../Api/GeneralApi.js';
import { setLoader as setLoaderAction } from '../../Reducers/app/actions';

const PictureManagerContainer = styled.div(({ visible }) => ({
  display: !visible ? 'none' : 'block',
  width: '35px',
  height: '35px',
}));

const Fab = styled(MuiFab)({
  position: 'absolute !important',
  width: '35px !important',
  height: '35px !important',
  minHeight: '35px !important',
  boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.15) !important',
  svg: {
    fontSize: '20px',
    fill: defaultTheme.textColorOnSecondary,
  },
});

const Dropzone = styled(ReactDropzone)({
  position: 'absolute !important',
  width: '35px',
  height: '35px',
  cursor: 'pointer',
});

const PictureManager = ({ user, role, token, managementCloudId, setLoader, visible }) => {
  // todo: move fetch & GeneralApi call to saga
  const onDocDrop = (file) => {
    setLoader(true);
    const data = new FormData();
    data.append('file', file[0]);
    data.append('contentManagementId', managementCloudId);

    // Upload du fichier
    fetch(`${API_URL}/api/ws/v1/contentmanagement/cover/addorupdate?token=${token}`, {
      method: 'POST',
      body: data,
    }).then(() => {
      setLoader(false);
      const url = window.location.host;
      const parts = url.split('.');
      const subDomain = parts[0];
      GeneralApi.getContentManagementInformations(subDomain);
    });
  };

  if (!user.isAuthenticated || !role.key === 'admin') {
    return null;
  }

  return (
    <PictureManagerContainer visible={visible}>
      <Fab>
        <EditIcon />
      </Fab>
      <Dropzone
        accept=".png, .jpg, .jpeg"
        id="raised-button-file"
        multiple={false}
        type="file"
        onDrop={onDocDrop}
      />
    </PictureManagerContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  role: selectRole,
  token: selectToken,
  managementCloudId: selectManagementCloudId,
});

const mapDispatchToProps = (dispatch) => ({
  setLoader: (value) => dispatch(setLoaderAction(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PictureManager);