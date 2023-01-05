import React from 'react';
import { SidebarContainer, PictureContainer } from './Sidebar/Styles';
import { Nav } from './Header/Styles';

type Props = {
  hasSideBar: boolean;
  isOnflyCommunity: boolean;
  isLoginPage: boolean;
};

const AppSkeleton: React.FC<Props> = ({ hasSideBar, isOnflyCommunity, isLoginPage }) => (
  <>
    {hasSideBar && (
      <SidebarContainer>
        <PictureContainer />
      </SidebarContainer>
    )}
    {!isOnflyCommunity && <Nav hasSidebar={hasSideBar} isLoginPage={isLoginPage} />}
  </>
);

export default AppSkeleton;