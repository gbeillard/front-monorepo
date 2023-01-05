import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EditIcon from '@material-ui/icons/Edit';
import { selectLanguageCode, selectTranslatedResources } from '../../../Reducers/app/selectors';
import MenuItem from './index';
// import PencilIcon from '../../../../../Content/images/icon-pencil-o.svg';

type Props = {
  languageCode: string;
  resources: any;
};

const ContentRequests: React.FC<Props> = ({ languageCode, resources }) => (
  <MenuItem
    link={`/${languageCode}/content-requests`}
    name={resources.ContentManagement.MenuItemContentRequests}
    icon={<EditIcon />}
  />
);

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(ContentRequests);