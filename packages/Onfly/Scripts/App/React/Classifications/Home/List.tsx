import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import {
  List,
  ListHead,
  ListBody,
  ListRow,
  ListCell,
  space,
  SortDirection,
} from '@bim-co/componentui-foundation';
import { createStructuredSelector } from 'reselect';
import Item from './Item';
import {
  ClassificationsSort,
  IClassification,
  SortOrderBy,
} from '../../../Reducers/classifications/types';
import { selectTranslatedResources } from '../../../Reducers/app/selectors';

type Props = {
  classifications: IClassification[];
  resources: any;
  onClassificationChanged: (c: IClassification) => void;
  onClassificationClicked: (c: IClassification) => void;
  onClassificationDeleteRequest: (c: IClassification) => void;
  sort: ClassificationsSort;
  setSort: (s: ClassificationsSort) => void;
};

const ClassificationsList: React.FC<Props> = ({
  classifications,
  onClassificationChanged,
  onClassificationClicked,
  onClassificationDeleteRequest,
  sort,
  setSort,
  resources,
}) => {
  const classificationList = useMemo(
    () =>
      classifications.map((classification) => (
        <Item
          key={classification.Id}
          classification={classification}
          onClassificationChanged={onClassificationChanged}
          onClassificationClicked={onClassificationClicked}
          onClassificationDeleteRequest={onClassificationDeleteRequest}
        />
      )),
    [classifications]
  );

  const handleSort = useCallback(
    (orderBy: SortOrderBy) => {
      if (sort.orderBy !== orderBy) {
        setSort({ orderBy, direction: SortDirection.Asc });
        return;
      }

      const direction =
        sort.direction === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc;
      setSort({ ...sort, direction });
    },
    [sort, setSort]
  );

  const handleSortName = useCallback(() => {
    handleSort(SortOrderBy.Name);
  }, [handleSort]);

  const handleSortOrigin = useCallback(() => {
    handleSort(SortOrderBy.Origin);
  }, [handleSort]);

  const handleSortVersion = useCallback(() => {
    handleSort(SortOrderBy.Version);
  }, [handleSort]);

  const handleSortSortedObjects = useCallback(() => {
    handleSort(SortOrderBy.SortedObjects);
  }, [handleSort]);

  const handleSortVisibility = useCallback(() => {
    handleSort(SortOrderBy.Visibility);
  }, [handleSort]);

  return (
    <List size="large">
      <ListHead>
        <ListRow>
          <ListCell
            sortActive={sort.orderBy === SortOrderBy.Name}
            sortDirection={sort.direction}
            onClick={handleSortName}
          >
            {resources.ClassificationHome.NameColumn}
          </ListCell>
          <ListCell
            sortActive={sort.orderBy === SortOrderBy.Origin}
            sortDirection={sort.direction}
            onClick={handleSortOrigin}
          >
            {resources.ClassificationHome.OriginColumn}
          </ListCell>
          <ListCell
            sortActive={sort.orderBy === SortOrderBy.Version}
            sortDirection={sort.direction}
            onClick={handleSortVersion}
          >
            {resources.ClassificationHome.VersionColumn}
          </ListCell>
          <ListCell
            sortActive={sort.orderBy === SortOrderBy.SortedObjects}
            sortDirection={sort.direction}
            onClick={handleSortSortedObjects}
          >
            {resources.ClassificationHome.SortedObjectsColumn}
          </ListCell>
          <ListCell
            sortActive={sort.orderBy === SortOrderBy.Visibility}
            sortDirection={sort.direction}
            onClick={handleSortVisibility}
          >
            {resources.ClassificationHome.VisibilityColumn}
          </ListCell>
          <ListCell width={space[350]} />
        </ListRow>
      </ListHead>
      <ListBody>{classificationList}</ListBody>
    </List>
  );
};

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(React.memo(ClassificationsList));