import React from 'react';
import { connect } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';
import { defaultTheme } from '@bim-co/componentui-foundation';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';
import LanguagesSelect from '../ObjectEditor/Steps/Documents/DocumentDialog/LanguageSelect';
import UserDropdown from './UserDropdown';
import { selectTranslatedResources, selectLanguageCode } from '../../Reducers/app/selectors';
import { Nav } from './Styles';
import { withRouter } from '../../Utils/withRouter';

const LanguageSelectStyles = {
  menu: (provided) => ({
    ...provided,
    width: 'auto',
    zIndex: 2,
    right: 0,
  }),
};

const Header = ({ hasSidebar, isLoginPage, pageTitle, languageCode, resources, params }) => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const onChangeHandler = (updatedLanguageCode) => {
    const url = pathname.includes(`/${languageCode}/`)
      ? pathname.replace(`/${languageCode}/`, `/${updatedLanguageCode}/`)
      : `${pathname + updatedLanguageCode}/`;

    navigate(`${url}${search}`);
  };

  return (
    <Nav hasSidebar={hasSidebar} isLoginPage={isLoginPage} id="top-app-bar-wrapper">
      {!isLoginPage && (
        <WrapperTitle>
          {params.groupId && (
            <Tooltip
              title={resources.ContentManagement.ReturnToGroupList}
              aria-label={resources.ContentManagement.ReturnToGroupList}
              placement="bottom"
            >
              <Link to={`/${languageCode}/groups`} data-cy="Bouton retour">
                <ExitToAppIconWrapper />
              </Link>
            </Tooltip>
          )}
          <Title dangerouslySetInnerHTML={{ __html: pageTitle }} />
        </WrapperTitle>
      )}
      <ActionsWrapper>
        {!isLoginPage && (
          <li>
            <ButtonNewMessage className="btn-new-message hidden">
              {resources.ActivityPreference.MessageNewTitle}
            </ButtonNewMessage>
          </li>
        )}
        <li>
          <LanguagesSelect
            value={languageCode}
            onChange={onChangeHandler}
            useButtonControl
            styles={LanguageSelectStyles}
          />
        </li>
        {!isLoginPage && <UserDropdown />}
      </ActionsWrapper>
    </Nav>
  );
};

const WrapperTitle = styled.div({
  display: 'flex',
  alignItems: 'center',
  a: {
    color: '#676767',
    '&:hover': {
      color: defaultTheme.primaryColorHover,
    },
  },
});

const ExitToAppIconWrapper = styled(ExitToAppIcon)({
  marginLeft: '15px',
  marginTop: '4px',
  transform: 'rotate(180deg)',
});

const ActionsWrapper = styled.ul({
  display: 'flex',
  alignItems: 'center',
  '> li': {
    display: 'block',
    float: 'left',
    padding: '0 20px 0 0',
    '> a': {
      display: 'inline-block',
      lineHeight: '48px',
    },
  },
});
const Title = styled.h1({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  margin: '0 0 0 20px',
});

const ButtonNewMessage = styled.a({
  display: 'inline-block',
  margin: '3px 10px 0 10px',
  padding: '0 16px !important',
  borderRadius: '4px',
  backgroundColor: defaultTheme.primaryColor,
  color: '#FFF !important',
  fontSize: '14px',
  lineHeight: '32px ! important',
  fontWeight: 500,
  textTransform: 'uppercase',
  verticalAlign: 'middle',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: defaultTheme.primaryColorHover,
  },
});

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
});

export default withRouter(connect(mapStateToProps)(Header));