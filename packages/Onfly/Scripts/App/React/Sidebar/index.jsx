import React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';
import Tooltip from '@material-ui/core/Tooltip';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { defaultTheme } from '@bim-co/componentui-foundation';
import Menu from './Menu';
import Picture from './Picture';
import {
  selectTranslatedResources,
  selectLanguageCode,
  selectPlatformUrl,
} from '../../Reducers/app/selectors';
import COLORS from '../../components/colors';
import { SidebarContainer } from './Styles';

const DownloadPluginLink = styled.a(({ isPlugin }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  display: !isPlugin ? 'block' : 'none',
  width: '100%',
  padding: '8px',
  borderRadius: 0,
  backgroundColor: defaultTheme.textColorTertiary,
  color: `${COLORS.EMPTY} !important`,
  textAlign: 'center',
  textDecoration: 'none',
  '&:hover': {
    backgroundColor: defaultTheme.textColorOnSecondary,
  },
}));

const Sidebar = ({ platformUrl, languageCode, resources }) => (
  <SidebarContainer>
    <Picture />
    <Menu />
    <Tooltip title={resources.ContentManagement.DownloadAppButton}>
      <DownloadPluginLink
        href={`${platformUrl}/${languageCode}/bimandco-plugins/trackdownload?type=Revit`}
        target="_blank"
        isPlugin={_isPlugin}
      >
        <CloudDownloadIcon />
      </DownloadPluginLink>
    </Tooltip>
  </SidebarContainer>
);

const mapStateToProps = createStructuredSelector({
  platformUrl: selectPlatformUrl,
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
});
export default connect(mapStateToProps)(Sidebar);