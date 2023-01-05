import React from 'react';
import { connect } from 'react-redux';
import BookIcon from '@material-ui/icons/Book';
import { createStructuredSelector } from 'reselect';
import { selectTranslatedResources } from '../../../../Reducers/app/selectors';
import MenuItem from '../index';

type Props = {
  resources: any;
};
const Referencial: React.FC<Props> = ({ resources, children }) => (
  <MenuItem name={resources.ContentManagement.MenuItemReferencial} icon={<BookIcon />}>
    {children}
  </MenuItem>
);

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(Referencial);