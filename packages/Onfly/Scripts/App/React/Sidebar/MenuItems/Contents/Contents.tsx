import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import { selectTranslatedResources } from '../../../../Reducers/app/selectors';
import MenuItem from '../index';

type Props = {
  resources: any;
};
const Contents: React.FC<Props> = ({ resources, children }) => (
  <MenuItem name={resources.ContentManagement.MenuItemContents} icon={<FormatListBulletedIcon />}>
    {children}
  </MenuItem>
);

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(Contents);