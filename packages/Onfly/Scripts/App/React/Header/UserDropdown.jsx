/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { defaultTheme } from '@bim-co/componentui-foundation';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import {
  selectUser,
  selectTranslatedRole,
  selectTranslatedResources,
  selectLanguageCode,
  selectIsEditingResources,
  selectIsBoostOffer,
} from '../../Reducers/app/selectors';
import { toggleEditResources as toggleEditResourcesAction } from '../../Reducers/app/actions';
import SsoLogout from '../Login/SsoLogout';

const Wrapper = styled.li({ position: 'relative' });

const PictureWrapper = styled.span({
  display: 'block',
  position: 'relative',
  float: 'left',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  margin: '0 10px 0 0',
});
const Image = styled.img({
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  verticalAlign: 'inherit',
});

const ProfilePicture = ({ avatar }) => (
  <PictureWrapper>
    <Image src={`${avatar}?width=100&height=100&scale=both`} alt="" />
  </PictureWrapper>
);

const UserButtonWrapper = styled.div({
  display: 'flex',
  float: 'left',
  width: 'auto',
  clear: 'both',
  alignItems: 'center',
  margin: '0px auto',
  color: defaultTheme.textColorTertiary,
  cursor: 'pointer',
  '&:hover': {
    color: defaultTheme.textColorOnSecondary,
  },
});
const TextWrapper = styled.div({
  textAlign: 'left',
  marginRight: '8px',
});
const UsernameLabel = styled.h3({
  display: 'block',
  fontSize: '14px',
  lineHeight: '21px',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  padding: 0,
});
const RoleLabel = styled.p({
  color: '#a4a4a4 !important',
  fontSize: '13px !important',
  lineHeight: '15px !important',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  margin: 0,
});
const UserButton = ({ user, roleLabel, onClick }) => (
  <UserButtonWrapper onClick={onClick}>
    <ProfilePicture avatar={user.avatar} />
    <TextWrapper>
      <UsernameLabel>{`${user.firstName} ${user.lastName}`}</UsernameLabel>
      <RoleLabel>{roleLabel}</RoleLabel>
    </TextWrapper>
    <Caret />
  </UserButtonWrapper>
);

const Caret = styled.i({
  display: 'inline-block',
  width: '0',
  height: '0',
  marginLeft: '2px',
  verticalAlign: 'middle',
  borderTop: '4px dashed',
  borderRight: '4px solid transparent',
  borderLeft: '4px solid transparent',
  fontHeight: '40px',
});

const Dropdown = styled.ul(({ show }) => ({
  width: '100%',
  position: 'absolute',
  top: '45px',
  left: 'auto',
  right: 0,
  zIndex: 1000,
  display: show ? 'block' : 'none',
  float: 'left',
  minWidth: '160px',
  margin: '4px 0 0',
  listStyle: 'none',
  fontSize: '14px',
  textAlign: 'left',
  backgroundColor: '#ffffff',
  border: 0,
  borderRadius: 0,
  padding: '5px 0 0 0',
  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
  backgroundClip: 'padding-box',
  maxHeight: '300px',
  '> li': {
    lineHeight: '30px',
    borderBottom: '1px solid #fafafa',
    fontSize: '12px',
    cursor: 'pointer',
    '> a': {
      display: 'flex',
      alignItems: 'center',
      padding: '3px 20px',
      clear: 'both',
      fontWeight: 'normal',
      lineHeight: '25px',
      color: '#333333',
      whiteSpace: 'nowrap',
      ':hover': {
        textDecoration: 'none',
        color: defaultTheme.textColorOnSecondary,
        backgroundColor: '#f5f5f5',
      },
    },
  },
  'i, svg': {
    position: 'relative',
    top: '-1px',
    width: '17px',
    fontSize: '16px',
    marginRight: '7px',
  },
}));

const Backdrop = styled.div(({ show }) => ({
  display: show ? 'initial' : 'none',
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'transparent',
  zIndex: 900,
}));
const UserDropdown = ({
  user,
  role,
  languageCode,
  isEditingResources,
  resources,
  toggleEditResources,
  isBoostOffer,
}) => {
  const [show, setShow] = useState(false);
  if (user == null || user === undefined || user.id === '') {
    return null;
  }

  const onToggleDropdown = () => {
    setShow(!show);
  };

  const onToggleResourcesHandler = () => {
    toggleEditResources(!isEditingResources);
  };

  return (
    <Wrapper id="user_menu">
      <a>
        <UserButton user={user} roleLabel={role.label} onClick={onToggleDropdown} />
      </a>
      <Backdrop show={show} onClick={() => setShow(false)} />
      <Dropdown show={show}>
        {/* ['admin', 'object_creator', 'validator'].includes(role.key) && !isBoostOffer && (
          <li>
            <Link id="create_object" to={`/${languageCode}/bimobject/create`}>
              <AddIcon />
              {resources.BimObjectList.CreateObjectButton}
            </Link>
          </li>
        ) */}
        <li>
          <Link to={`/${languageCode}/user-account`}>
            <EditIcon />
            {resources.AuthenticatedLayout.UserProfile}
          </Link>
        </li>
        {!window._isPlugin && (
          <li>
            <a>
              <ExitToAppIcon />
              <SsoLogout />
            </a>
          </li>
        )}
        {user.isBimAndCoAdmin && (
          <li>
            <a onClick={onToggleResourcesHandler}>
              <SettingsIcon />
              {resources.AuthenticatedLayout.EditResourcesLink}
            </a>
          </li>
        )}
      </Dropdown>
    </Wrapper>
  );
};

const mapStateToProps = () =>
  createStructuredSelector({
    user: selectUser,
    role: selectTranslatedRole,
    languageCode: selectLanguageCode,
    isEditingResources: selectIsEditingResources,
    resources: selectTranslatedResources,
    isBoostOffer: selectIsBoostOffer,
  });

const mapDispatchToProps = (dispatch) => ({
  toggleEditResources: (value) => dispatch(toggleEditResourcesAction(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDropdown);