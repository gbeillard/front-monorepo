import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import moment from 'moment';

import {
  List,
  ListHead,
  ListBody,
  ListRow,
  ListCell,
  Tag,
  Paragraph,
  colors,
  Cluster,
  Menu,
  Ellipsis,
  SortDirection
} from '@bim-co/componentui-foundation';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Space } from '../../Reducers/Spaces/types';

import { Column, MenuOption } from './types';
import { RoleKey } from '../../Reducers/Roles/types';

import { retrieveUrlSpaceOnfly } from '../../Reducers/Spaces/utils';

// Reducers
import {
  setSortDirection as setSortDirectionAction, 
  setSortOrderBy as setSortOrderByAction,
} from '../../Reducers/Spaces/actions';

// Selectors
import { selectSortDirection, selectSortOrderBy } from '../../Reducers/Spaces/selectors';
import RequestAccessButton from './RequestAccessButton';

// Columns
const getColumns = (resources: any, getMenuOptions: (space: Space) => void): Column[] => [
  {
    id: 'Name',
    label: resources.Spaces.ColumnName,
    minWidth: '80px',
    isSortable: true,
    sortDirection: SortDirection.Asc,
    render: (space) => (
      <CellName>
        <Cluster nowrap>
          <Paragraph nowrap>{space?.Name}</Paragraph>
        </Cluster>
      </CellName>
    ),
  },
  {
    id: 'Description',
    label: resources.Spaces.ColumnDescription,
    render: (space) => <SecondaryParagraph nowrap>{space?.Description}</SecondaryParagraph>,
  },
  {
    id: 'CreatedAt',
    label: resources.Spaces.ColumnCreatedAt,
    width: '152px',
    isSortable: true,
    render: (space) => moment(space?.CreatedAt, 'YYYYMMDDHHmmss').format('L'),
  },
  {
    id: 'CreatedBy',
    label: resources.Spaces.ColumnEditedBy,
    minWidth: '80px',
    isSortable: true,
    render: (space) => `${space?.CreatedBy?.FirstName} ${space?.CreatedBy?.LastName}`,
  },
  {
    id: 'Status',
    label: resources.Spaces.ColumnStatus,
    minWidth: '80px',
    isSortable: true,
    render: (space) =>
      space?.Role ? (
        <Ellipsis>{resources.Spaces.StatusActif}</Ellipsis>
      ) : (
        <RequestAccessButton space={space} />
      ),
  },
  {
    id: 'ObjectsCount',
    label: resources.Spaces.ColumnObject,
    isSortable: true,
    width: '120px',
    render: (space) => <Tag.Primary>{space?.ObjectsCount ?? 0}</Tag.Primary>,
  },
  {
    id: 'Actions',
    width: '56px',
    render: (space) =>
      space?.Role?.Key === RoleKey.admin && (
        <ActionColumn>
          <Menu items={getMenuOptions(space)} />
        </ActionColumn>
      ),
  },
];

type Props = {
  resources: any;
  spaces: Space[];
  sortDirection: SortDirection;
  sortOrderBy: string;
  openEditModal: (space: Space) => void;
  openDeleteModal: (space: Space) => void;
  setSortOrderBy?: (sortOrderBy: string) => void;
  setSortDirection?: (sortDirection: SortDirection) => void;
};

const SpacesList: React.FC<Props> = ({
  resources,
  spaces,
  openEditModal,
  openDeleteModal,
  sortDirection,
  sortOrderBy,
  setSortOrderBy,
  setSortDirection,
}) => {
  useEffect(() => {
    if (!sortOrderBy) {
      const defaultSortingCol = getColumns(resources, getMenuOptions).find(
        (column) => column.sortDirection
      );
      if (defaultSortingCol) {
        setSortOrderBy(defaultSortingCol.id);
        setSortDirection(defaultSortingCol.sortDirection);
      }
    }
  }, [sortOrderBy, resources]);

  const getMenuOptions = (space: Space): MenuOption[] => [
    {
      id: 'edit',
      icon: 'edit',
      label: resources.Spaces.MenuOptionEdit,
      onClick: () => openEditModal(space),
    },
    {
      id: 'delete',
      icon: 'delete',
      label: resources.MetaResource.Delete,
      onClick: () => openDeleteModal(space),
    },
  ];
  const handleSortClick = (headCell) => {
    if (sortOrderBy !== headCell.id) {
      setSortOrderBy(headCell.id);
      setSortDirection(SortDirection.Asc);
    } else {
      const isSortAsc = sortDirection === SortDirection.Asc;
      setSortDirection(isSortAsc ? SortDirection.Desc : SortDirection.Asc);
    }
  };

  const columns = getColumns(resources, getMenuOptions);

  const headCellList = columns.map((headCell) => (
    <ListCell
      key={headCell.id}
      width={headCell.width}
      sortActive={headCell.isSortable && sortOrderBy === headCell.id}
      sortDirection={
        // eslint-disable-next-line no-nested-ternary
        !headCell.isSortable
          ? null
          : sortOrderBy === headCell.id
          ? sortDirection
          : SortDirection.Asc
      }
      minWidth={headCell.minWidth}
      onClick={() => handleSortClick(headCell)}
    >
      {headCell.label}
    </ListCell>
  ));

  const getBodyRowCellList = (space: Space) =>
    columns.map((column) => (
      <ListCell key={`${space.Id}-${column.id}`} width={column.width} minWidth={column.minWidth}>
        {column.render(space)}
      </ListCell>
    ));

  const rowList = spaces?.map((space) => {
    if (space == null) {
      return null;
    }

    const canAccessSpace = space?.Role && 'Key' in space.Role;

    const handleOnClickListRow = (spaceSubdomain: string) => {
      window.open(retrieveUrlSpaceOnfly(spaceSubdomain), '_blank').focus();
    };

    return (
      <ListRow
        key={space.Id}
        hover={canAccessSpace}
        onClick={canAccessSpace ? () => handleOnClickListRow(space.SubDomain) : null}
      >
        {getBodyRowCellList(space)}
      </ListRow>
    );
  });

  return (
    <List size="large">
      <ListHead>
        <ListRow>{headCellList}</ListRow>
      </ListHead>
      <ListBody>{rowList}</ListBody>
    </List>
  );
};

const mapStateToProps = createStructuredSelector({
  sortDirection: selectSortDirection,
  sortOrderBy: selectSortOrderBy,
});

const mapDispatchToProps = (dispatch) => ({
  setSortOrderBy: (orderBy: string) => dispatch(setSortOrderByAction(orderBy)),
  setSortDirection: (sortDirection: SortDirection) =>
    dispatch(setSortDirectionAction(sortDirection)),
});

const CellName = styled.div`
  overflow: hidden;
  padding-left: 16px;
`;
const SecondaryParagraph = styled(Paragraph)`
  color: ${colors.NEUTRAL[60]};
`;

const ActionColumn = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

export default connect(mapStateToProps, mapDispatchToProps)(SpacesList);
