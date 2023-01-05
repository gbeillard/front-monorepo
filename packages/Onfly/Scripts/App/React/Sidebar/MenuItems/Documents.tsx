import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FolderIcon from '@material-ui/icons/Folder';
import { selectLanguageCode, selectTranslatedResources } from '../../../Reducers/app/selectors';
import MenuItem from './index';

type Props = {
  groupId: number;
  languageCode: string;
  resources: any;
};

const Documents: React.FC<Props> = ({ groupId, languageCode, resources }) => (
  <MenuItem
    link={
      groupId === 0 ? `/${languageCode}/documents` : `/${languageCode}/group/${groupId}/documents`
    }
    name={resources.ContentManagement.MenuItemDocuments}
    icon={<FolderIcon />}
  />
);

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(Documents);