// Requirements =>
// Need SelectedObjects as [] in case of multiselection
// Need Resources as object
// Need Datas as object with datas of search result objects
// Need CurrentGroups as list of avalaibles groups
// Need UnselectAllObjects as function to unselect all objects
// Need SelectAllObjects as function to select all objects of current result
// Need SortUpdateRequest as function to sort current object list

import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';

// Material UI
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

const ManageObjectsTableHeader = createReactClass({
  getInitialState() {
    return {
      filterClassifActive: false,
      filterProjectActive: false,
      orderBy: 'CreatedAt',
      order: 'Desc',
    };
  },

  handleSortColumn(event) {
    let currentId = event.currentTarget.dataset.id;
    const self = this;
    let orderSort = self.state.order === 'Desc' ? 'Asc' : 'Desc';

    switch (currentId) {
      case 'MobjectTableAuthor':
        self.props.SortUpdateRequest('script_author', orderSort);
        if (self.state.orderBy !== currentId) {
          orderSort = 'Asc';
        }
        break;
      case 'MobjectTableLastModified':
        self.props.SortUpdateRequest('UpdatedAt', orderSort);
        break;
      case 'MobjectTableStatus':
        self.props.SortUpdateRequest('Status', orderSort);
        break;
      case 'MobjectTableName':
        self.props.SortUpdateRequest('Name', orderSort);
        if (self.state.orderBy !== currentId) {
          orderSort = 'Asc';
        }
        break;
      default:
        orderSort = self.props.initialRequest.SearchSorting.Order;
        currentId = null;
        self.props.SortUpdateRequest(self.state.orderBy, self.state.order);
        break;
    }
    self.setState({ orderBy: currentId, order: orderSort });
  },

  render() {
    const self = this;

    const columnData = [
      {
        id: 'MobjectTableSelect',
        label: '',
        sortable: false,
        classname: 'mobject-table-select',
      },
      {
        id: 'MobjectTableName',
        label: self.props.Resources.ManageObjects.ResultColumnName,
        sortable: true,
        classname: 'mobject-table-name',
      },
      {
        id: 'MobjectTableAuthor',
        label: self.props.Resources.ManageObjects.ResultColumnCreator,
        sortable: true,
        classname: 'mobject-table-author',
      },
      {
        id: 'MobjectTableLastModified',
        label: self.props.Resources.ManageObjects.ResultColumnLastUpdate,
        sortable: true,
        classname: 'mobject-table-last-modified',
      },
      {
        id: 'MobjectTableClassif',
        label: self.props.Resources.ManageObjects.ResultColumnClassif,
        sortable: false,
        classname: 'mobject-table-classif',
      },
      {
        id: 'MobjectTableAvailability',
        label: self.props.Resources.ManageObjects.ResultColumnLocation,
        sortable: false,
        classname: 'mobject-table-availability',
      },
      {
        id: 'MobjectTableStatus',
        label: self.props.Resources.ManageObjects.ResultColumnStatus,
        sortable: true,
        classname: 'mobject-table-status',
      },
      {
        id: 'MobjectTableOptionsButtons',
        label: '',
        sortable: true,
        classname: 'mobject-table-options',
      },
    ];

    const mobjectsTableHead = _.map(columnData, (column, i) => {
      if (column.id === 'MobjectTableSelect') {
        return (
          <TableCell key={column.id} sortdirection={null} className={column.classname}>
            <Checkbox
              checked={
                self.props.Datas.length > 0
                  ? self.props.Datas.length === self.props.SelectedObjects.length
                  : false
              }
              indeterminate={
                self.props.Datas.length > 0
                  ? self.props.SelectedObjects.length > 0 &&
                  self.props.SelectedObjects.length < self.props.Datas.length
                  : false
              }
              tabIndex={-1}
              color="primary"
              onChange={self.props.SelectAllObjects}
            />
          </TableCell>
        );
      }
      let tableLabel = <span>{column.label}</span>;

      if (column.sortable) {
        tableLabel = (
          <TableSortLabel
            active={self.state.orderBy === column.id}
            direction={self.state.order.toLowerCase()}
            data-id={column.id}
            onClick={column.sortable ? self.handleSortColumn : null}
          >
            {column.label}
          </TableSortLabel>
        );
      }

      return (
        <TableCell key={column.id} sortdirection={null} className={column.classname}>
          <Tooltip
            title={column.sortable ? self.props.Resources.ContentManagement.TooltipOrderBy : ''}
            placement="bottom-start"
            enterDelay={300}
          >
            {tableLabel}
          </Tooltip>
        </TableCell>
      );
    });

    return <TableRow>{mobjectsTableHead}</TableRow>;
  },
});

export default ManageObjectsTableHeader;