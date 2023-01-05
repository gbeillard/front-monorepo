import React from 'react';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  List,
  ListHead,
  ListBody,
  ListRow,
  ListCell,
  Menu,
  Tag,
  Paragraph,
  colors,
  Icon,
  Cluster,
} from '@bim-co/componentui-foundation';
import { useLocation, useNavigate } from 'react-router-dom';

import { OCAnalytics } from '@bim-co/onfly-connect';

// Selectors
import { selectRole } from '../../Reducers/app/selectors';

// Type
import { Column, MenuOption } from './types';

import { Collection } from '../../Reducers/Collections/types';
import { AnalyticsEvent } from '../../Reducers/analytics/types';

import { getCollectionStatusLabel } from '../../Reducers/Collections/utils';


// Columns
const getColumns = (resources: any, getMenuOption: (collection: Collection) => void): Column[] => [
  {
    id: 'Name',
    label: resources.ContentManagementCollections.ColumnName,
    minWidth: '160px',
    render: (collection) => (
      <CellName>
        <Cluster nowrap>
          <IconContainer>
            {collection?.IsFavorite && <Icon icon="favorite" size="s" />}
          </IconContainer>
          <Paragraph nowrap>{collection?.Name}</Paragraph>
        </Cluster>
      </CellName>
    ),
  },
  {
    id: 'Description',
    label: resources.ContentManagementCollections.ColumnDescription,
    render: (collection) => (
      <SecondaryParagraph nowrap>{collection?.Description}</SecondaryParagraph>
    ),
  },
  {
    id: 'Status',
    label: resources.ContentManagementCollections.ColumnStatus,
    width: '120px',
    render: (collection) => getCollectionStatusLabel(resources, collection?.Status),
  },
  {
    id: 'UpdateDate',
    label: resources.ContentManagementCollections.ColumnUpdateDate,
    width: '112px',
    render: (collection) => moment(collection?.UpdatedAt, 'YYYYMMDDHHmmss').format('L'),
  },
  {
    id: 'UpdatedBy',
    label: resources.ContentManagementCollections.ColumnEditedBy,
    minWidth: '96px',
    render: (collection) =>
      `${collection?.UpdatedBy?.FirstName} ${collection?.UpdatedBy?.LastName}`,
  },
  {
    id: 'NbObjects',
    label: resources.ContentManagementCollections.ColumnNbObjects,
    width: '72px',
    render: (collection) => <Tag.Primary>{collection?.Statistics?.NbBimObjects ?? 0}</Tag.Primary>,
  },
  {
    id: 'Actions',
    width: '56px',
    needAuthorization: true,
    render: (collection) => !collection?.IsFavorite && <Menu items={getMenuOption(collection)} />,
  },
];

type Props = {
  resources: any;
  role: any;
  collections: Collection[];
  openDeleteModal: (collection: Collection) => void;
  openEditModal: (collection: Collection) => void;
  sendAnalytics: (event: AnalyticsEvent) => void;
};

const CollectionsList: React.FC<Props> = ({
  resources,
  role,
  collections,
  openDeleteModal,
  openEditModal,
  sendAnalytics,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // Menu options
  const getMenuOptions = (collection: Collection): MenuOption[] => [
    {
      id: 'edit',
      icon: 'edit',
      label: resources.ContentManagementCollections.MenuOptionEdit,
      onClick: () => openEditModal(collection),
    },
    {
      id: 'delete',
      icon: 'delete',
      label: resources.ContentManagementCollections.MenuOptionDelete,
      onClick: () => openDeleteModal(collection),
    },
  ];

  const columns = getColumns(resources, getMenuOptions).filter(
    (column) => !column.needAuthorization || (column.needAuthorization && role?.key === 'admin')
  );

  const headCellList = columns.map((headCell) => (
    <ListCell key={headCell.id} width={headCell.width} minWidth={headCell.minWidth}>
      {headCell.label}
    </ListCell>
  ));

  const getBodyRowCellList = (collection: Collection) =>
    columns.map((column) => (
      <ListCell
        key={`${collection.Id}-${column.id}`}
        width={column.width}
        minWidth={column.minWidth}
      >
        {column.render(collection)}
      </ListCell>
    ));

  const handleOnClickListRow = (collectionId: number) => {
    sendAnalytics(AnalyticsEvent.UserOpenedCollection);
    OCAnalytics.event('selected-collections');
    navigate(`${pathname}/${collectionId}`);
  };

  const rowList = collections?.map((collection) => {
    if (collection == null) {
      return null;
    }

    return (
      <ListRow key={collection.Id} hover onClick={() => handleOnClickListRow(collection.Id)}>
        {getBodyRowCellList(collection)}
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

const CellName = styled.div`
  overflow: hidden;
  padding-left: 16px;
`;
const SecondaryParagraph = styled(Paragraph)`
  color: ${colors.NEUTRAL[60]};
`;

const FlexContainer = styled.div`
  display: flex;
`;

const IconContainer = styled(FlexContainer)`
  min-width: 16px;
  height: 16px;
`;

const mapStateToProps = createStructuredSelector({
  role: selectRole,
});

export default connect(mapStateToProps)(CollectionsList);