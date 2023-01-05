import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import MuiFab from '@material-ui/core/Fab';
import HomeIcon from '@material-ui/icons/Home';
import { createStructuredSelector } from 'reselect';
import { selectRole, selectLanguageCode, selectEntityLogo } from '../../Reducers/app/selectors';
import PictureManager from './PictureManager';
import { PictureContainer } from './Styles';

type Props = {
  role: { key: string; label: string };
  entityLogo: string;
  languageCode: string;
};

enum pictureMode {
  DEFAULT,
  ADMIN,
  GROUP,
}

type ModeProps = {
  mode: pictureMode;
};

const Fab = styled(MuiFab)<ModeProps>(({ mode }) => ({
  display: mode != pictureMode.GROUP ? 'none !important' : 'inline-flex',
  width: '35px !important',
  height: '35px !important',
  minHeight: '35px !important',
  boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.15) !important',
  svg: {
    fontSize: '20px',
  },
}));

const OnflyLogo = styled.img<ModeProps>(({ mode }) => ({
  display: mode != pictureMode.DEFAULT ? 'none' : 'block',
  width: '35px',
  height: '35px',
  borderRadius: '50%',
  verticalAlign: 'middle',
}));

const Picture: React.FunctionComponent<Props> = ({ role, entityLogo, languageCode }) => {
  const setDefaultMode = () => {
    setMode(pictureMode.DEFAULT);
  };

  const setCurrentMode = () => {
    if (window.location.pathname.includes('/group/')) {
      setMode(pictureMode.GROUP);
    } else if (role.key === 'admin') {
      setMode(pictureMode.ADMIN);
    } else {
      setDefaultMode();
    }
  };

  const [mode, setMode] = useState(pictureMode.DEFAULT);

  return (
    <PictureContainer onMouseEnter={setCurrentMode} onMouseLeave={setDefaultMode}>
      <Link to={`/${languageCode}`} data-cy="Bouton accueil">
        <Fab onClick={setDefaultMode} mode={mode}>
          <HomeIcon />
        </Fab>
      </Link>
      <PictureManager visible={mode == pictureMode.ADMIN} />
      <Link to={`/${languageCode}`} data-cy="logo du Onfly">
        <OnflyLogo
          src={`${entityLogo}?width=100&height=100&scale=both`}
          mode={mode}
          alt="Onfly logo"
        />
      </Link>
    </PictureContainer>
  );
};

const mapSelectToProps = createStructuredSelector({
  role: selectRole,
  entityLogo: selectEntityLogo,
  languageCode: selectLanguageCode,
});

export default connect(mapSelectToProps)(Picture);