import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import SearchIcon from '@material-ui/icons/Search';
import { selectTranslatedResources } from '../../../../Reducers/app/selectors';
import MenuItem from '../index';

type Props = {
  resources: any;
};
const Search: React.FC<Props> = ({ resources, children }) => (
  <MenuItem name={resources.ContentManagement.MenuItemSearch} icon={<SearchIcon />}>
    {children}
  </MenuItem>
);

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(Search);