import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';

import Tags from './MenuItems/Referencial/Tags';
import { Contents, Collections } from './MenuItems/Contents';
import Documents from './MenuItems/Documents';
import ContentRequests from './MenuItems/ContentRequests';
import Messages from './MenuItems/Messages';
import Groups from './MenuItems/Groups';
import Spaces from './MenuItems/Spaces';
import Referencial from './MenuItems/Referencial';
import Properties from './MenuItems/Referencial/Properties';
import Translations from './MenuItems/Referencial/Translations';
import Equivalences from './MenuItems/Referencial/Equivalences';
import DefaultMapping from './MenuItems/Referencial/DefaultMappingMenu';
import PropertiesSets from './MenuItems/Referencial/PropertiesSets';
import Requests from './MenuItems/Referencial/Requests';
import Settings from './MenuItems/Settings';
import Users from './MenuItems/Settings/Users';
import ManageContents from './MenuItems/Contents/ManageContents';
import Suppliers from './MenuItems/Settings/Suppliers';
import Classifications from './MenuItems/Referencial/Classifications';
import PublishingControl from './MenuItems/Referencial/PublishingControl';
import ApiDoc from './MenuItems/Settings/ApiDoc';
import ContactUs from './MenuItems/ContactUs';
import CreateBug from './MenuItems/ContactUs/CreateBug';
import Bugs from './MenuItems/ContactUs/Bugs';
import { globalAuthorizations } from './authorizations';
import Metabase from './MenuItems/ContactUs/Metabase';
import Preferences from './MenuItems/Settings/Preferences';
import Documentation from './MenuItems/ContactUs/Documentation';
import Chat from './MenuItems/ContactUs/Chat';
import Search from './MenuItems/Search/Search';
import { Files, Objects } from './MenuItems/Search';

import {
  selectSettings,
  selectRole,
  selectUnreadMessagesCount,
  selectIsBoostOffer,
} from '../../Reducers/app/selectors';

import { RoleKeyType } from '../../Reducers/Roles/types';

type Props = {
  groupId: number;
  roleKey: RoleKeyType;
  handleReset: () => void;
  unreadMessageCount: number;
  settings: {
    EnableDocuments: boolean;
    EnableContentRequests: boolean;
    MaxGroupNumber: number;
    MaxSpaceNumber: number;
    EnableBugtrack: boolean;
    EnableDictionary: boolean;
    EnableAutomaticTranslation: boolean;
    EnableMappingBox: boolean;
    EnableMetabaseDashboards: boolean;
    EnableSetsManagement: boolean;
    EnableClassificationManagement: boolean;
    EnableFileSearch: boolean;
    EnableUseApiDoc: boolean;
    EnableSpaces: boolean;
  };
  IsBoostOffer: boolean;
};

const ModularMenu: React.FC<Props> = ({
  groupId,
  roleKey,
  handleReset,
  settings,
  unreadMessageCount,
  IsBoostOffer,
}) => {
  const authorizations = globalAuthorizations[roleKey];

  const showSearch = Object.values(authorizations.search).some(
    (authorization) => authorization === true
  );

  const showContent = Object.values(authorizations.contents).some(
    (authorization) => authorization === true
  );

  const showDictionary =
    (settings.EnableDictionary &&
      Object.values(authorizations.dictionary).some((authorization) => authorization === true)) ||
    (settings.EnableClassificationManagement && authorizations.settings.enableClassifications);

  const showSettings = Object.values(authorizations.settings).some(
    (authorization) => authorization === true
  );

  const bottomMenu = (
    <ul className="bottom-menu">
      <ContactUs>
        {authorizations.contactUs.enableCreateBug && settings.EnableBugtrack && (
          <CreateBug groupId={groupId} />
        )}
        {authorizations.contactUs.enableBugs && settings.EnableBugtrack && (
          <Bugs groupId={groupId} />
        )}
        <Chat />
        <Documentation />
        {authorizations.contactUs.enableApiDoc && settings.EnableUseApiDoc && <ApiDoc />}
      </ContactUs>
    </ul>
  );

  if (groupId !== 0) {
    return (
      <MenuContainer>
        <ul>
          {authorizations.enableGroupObjects && (
            <Objects groupId={groupId} handleReset={handleReset} />
          )}
          {authorizations.enableGroupDocuments && settings.EnableDocuments && (
            <Documents groupId={groupId} />
          )}
          {authorizations.enableMessages && (
            <Messages groupId={groupId} unreadMessagesCount={unreadMessageCount} />
          )}
          {showSettings && (
            <Settings>
              {authorizations.settings.enableUsers && <Users groupId={groupId} />}
            </Settings>
          )}
        </ul>
        {bottomMenu}
      </MenuContainer>
    );
  }

  return (
    <MenuContainer>
      <ul>
        {showSearch && (
          <Search>
            {authorizations.search.enableObjects && !IsBoostOffer && (
              <Objects groupId={groupId} handleReset={handleReset} />
            )}
            {authorizations.search.enableSearch && settings.EnableFileSearch && <Files />}
          </Search>
        )}
        {showContent && (
          <Contents>
            {authorizations.contents.enableManageContents && <ManageContents />}
            {authorizations.contents.enableCollections && <Collections />}
          </Contents>
        )}
        {authorizations.enableDocuments && settings.EnableDocuments && (
          <Documents groupId={groupId} />
        )}
        {authorizations.enableContentRequests && settings.EnableContentRequests && (
          <ContentRequests />
        )}
        {authorizations.enableMessages && (
          <Messages groupId={groupId} unreadMessagesCount={unreadMessageCount} />
        )}

        {authorizations.enableGroups && settings.MaxGroupNumber > 0 && <Groups />}
        {authorizations.enableSpace && settings.EnableSpaces && <Spaces />}

        {showDictionary && (
          <Referencial>
            {settings.EnableDictionary && (
              <>
                {authorizations.dictionary.enableProperties && <Properties />}
                {authorizations.dictionary.enablePropertiesSets &&
                  settings.EnableSetsManagement && <PropertiesSets />}
                {authorizations.dictionary.enableMappings && <Translations />}
                {authorizations.dictionary.enableEquivalences && settings.EnableMappingBox && (
                  <Equivalences />
                )}
                {authorizations.dictionary.enableMappings && <DefaultMapping />}
              </>
            )}
            {settings.EnableClassificationManagement &&
              authorizations.settings.enableClassifications && <Classifications />}
            {settings.EnableDictionary && (
              <>
                {authorizations.settings.enablePublishingControl && <PublishingControl />}
                {authorizations.dictionary.enableRequests && <Requests />}
              </>
            )}
          </Referencial>
        )}

        {showSettings && (
          <Settings>
            {authorizations.settings.enableUsers && <Users groupId={groupId} />}
            {authorizations.settings.enablePins && <Tags />}
            {authorizations.settings.enableSuppliers && !IsBoostOffer && <Suppliers />}
            {authorizations.settings.enableMetabase && settings.EnableMetabaseDashboards && (
              <Metabase />
            )}
            {authorizations.settings.enablePreferences && <Preferences />}
          </Settings>
        )}
      </ul>
      {bottomMenu}
    </MenuContainer>
  );
};

const MenuContainer = styled.div`
  height: calc(100% - 58px - 44px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const mapStateToProps = createStructuredSelector({
  settings: selectSettings,
  IsBoostOffer: selectIsBoostOffer,
  role: selectRole,
  unreadMessageCount: selectUnreadMessagesCount,
});

export default connect(mapStateToProps)(ModularMenu);
