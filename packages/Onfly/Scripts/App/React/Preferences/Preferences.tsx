import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { H4, defaultTheme, ContentPage, Stack } from '@bim-co/componentui-foundation';

import { selectTranslatedResources } from '../../Reducers/app/selectors';
import {
  fetchPreferences as fetchPreferencesAction,
  updatePreferences as updatePreferencesAction,
} from '../../Reducers/preferences/actions';

import { Preferences } from '../../Reducers/preferences/types';

import { RevitPlugin, Search } from './Pages';
import MenuLink from './Components/MenuLink';

type Props = {
  fetchPreferences: () => void;
  updatePreferences: (preferences: Preferences) => void;
  resources: any;
};

const Preferences: React.FC<Props> = ({ resources, fetchPreferences }) => {
  const [Page, setPage] = useState(Search);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const sidebar = (
    <Stack space="16px">
      <div>
        <HeaderTitle>{resources.Preferences.GeneralTitle}</HeaderTitle>
      </div>
      <MenuLink isActive={Page === Search} onClick={() => setPage(Search)}>
        {resources.Preferences.SearchTitle}
      </MenuLink>
      <div>
        <HeaderTitle>{resources.Preferences.SidebarTitle}</HeaderTitle>
      </div>
      <MenuLink isActive={Page === RevitPlugin} onClick={() => setPage(RevitPlugin)}>
        {resources.Preferences.HeaderTitle}
      </MenuLink>
    </Stack>
  );

  return <ContentPage sidebar={sidebar} header={<Page.Header />} content={<Page.Sections />} />;
};

const HeaderTitle = styled(H4)`
  color: ${defaultTheme.textColorDisabled};
`;

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchPreferences: () => dispatch(fetchPreferencesAction()),
  updatePreferences: (preferences: Preferences) => dispatch(updatePreferencesAction(preferences)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);