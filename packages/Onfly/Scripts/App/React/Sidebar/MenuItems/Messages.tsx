import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ForumIcon from '@material-ui/icons/Forum';
import { selectLanguageCode, selectTranslatedResources } from '../../../Reducers/app/selectors';
import MenuItem from './index';

type Props = {
  groupId: number;
  unreadMessagesCount: number;
  languageCode: string;
  resources: any;
};

const Messages: React.FC<Props> = ({ groupId, unreadMessagesCount, languageCode, resources }) => (
  <MenuItem
    link={groupId == 0 ? `/${languageCode}/messages` : `/${languageCode}/group/${groupId}/messages`}
    name={resources.ContentManagement.MenuItemMessages}
    icon={<ForumIcon />}
    badge={unreadMessagesCount}
  />
);

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(Messages);