import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectLanguageCode, selectTranslatedResources } from '../../../../Reducers/app/selectors';
import MenuItem from '../index';

type Props = {
  groupId: number;
  languageCode: string;
  resources: any;
};

const Users: React.FC<Props> = ({ groupId, languageCode, resources }) => (
  <MenuItem
    link={
      groupId == 0
        ? `/${languageCode}/manage-users`
        : `/${languageCode}/group/${groupId}/manage-users`
    }
    name={resources.ContentManagement.MenuItemUsers}
  />
);

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(Users);