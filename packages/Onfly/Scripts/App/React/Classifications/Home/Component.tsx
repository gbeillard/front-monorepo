import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';
import { Dialog } from '@material-ui/core';
import { Button, TextField, space, H1, defaultTheme } from '@bim-co/componentui-foundation';
import { selectIsBoostOffer, selectTranslatedResources } from '../../../Reducers/app/selectors';
import { ClassificationsSort, IClassification } from '../../../Reducers/classifications/types';
import CreateClassification from '../CreateClassification';
import List from './List';
import DeleteConfirm from '../../PropertiesSets/DeleteConfirm';
import { replaceStringByComponent } from '../../../Utils/utilsResources';

type Props = {
  classifications: IClassification[];
  onClassificationChanged: (c: IClassification) => void;
  filter: string;
  setFilter: (f: string) => void;
  sort: ClassificationsSort;
  setSort: (s: ClassificationsSort) => void;
  onCreate: (c: IClassification) => void;
  onClone: (c: IClassification) => void;
  onDownload: (c: IClassification) => void;
  onDelete: (c: IClassification, k: boolean) => void;
  onClassificationClicked: (c: IClassification) => void;
  isBoostOffer: boolean;
  resources: any;
};

const Component: React.FC<Props> = ({
  classifications,
  onClassificationChanged,
  filter,
  setFilter,
  sort,
  setSort,
  onCreate,
  onClone,
  onDownload,
  onDelete,
  onClassificationClicked,
  isBoostOffer,
  resources,
}) => {
  const [showCreate, setShowCreate] = useState(false);
  const [classificationToDelete, setClassificationToDelete] = useState<IClassification>(null);

  const handleShowCreate = useCallback(() => {
    setShowCreate(true);
  }, [setShowCreate]);

  const handleCloseCreate = useCallback(() => {
    setShowCreate(false);
  }, [setShowCreate]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setFilter(event.target.value);
    },
    [setFilter]
  );

  const handleDelete = useCallback(
    (keepPropertiesWithValue: boolean) => {
      onDelete(classificationToDelete, keepPropertiesWithValue);
      setClassificationToDelete(null);
    },
    [onDelete, classificationToDelete, setClassificationToDelete]
  );

  const handleCloseDelete = useCallback(() => {
    setClassificationToDelete(null);
  }, [setClassificationToDelete]);

  return (
    <Background>
      <H1>{resources.ClassificationHome.Title}</H1>
      <Toolbar>
        <FilterWrapper>
          <TextField
            data-testid="filter"
            value={filter}
            placeholder={resources.ClassificationHome.FilterPlaceholder}
            onChange={handleChange}
            iconLeft="search"
          />
        </FilterWrapper>
        {!isBoostOffer && (
          <Button variant="primary" onClick={handleShowCreate} icon="add">
            {resources.ClassificationHome.CreateButton}
          </Button>
        )}
      </Toolbar>
      <List
        classifications={classifications}
        onClassificationChanged={onClassificationChanged}
        onClassificationClicked={onClassificationClicked}
        onClassificationDeleteRequest={setClassificationToDelete}
        sort={sort}
        setSort={setSort}
      />
      <Dialog open={showCreate} onClose={handleCloseCreate}>
        <CreateClassification
          onCreate={onCreate}
          onClone={onClone}
          onDownload={onDownload}
          onClose={handleCloseCreate}
        />
      </Dialog>
      <DeleteConfirm
        isDisplayed={classificationToDelete !== null}
        title={replaceStringByComponent(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          resources.ClassificationHome.DeleteClassificationTitle,
          '[ClassificationName]',
          <DeleteModalEmphasis>{classificationToDelete?.Name}</DeleteModalEmphasis>
        )}
        description={resources.ClassificationHome.DeleteClassificationDescription}
        submitButtonLabel={resources.ClassificationHome.DeleteClassificationConfirm}
        checkboxLabel={resources.ClassificationHome.DeleteClassificationCheckboxLabel}
        onCancel={handleCloseDelete}
        onSubmit={handleDelete}
      />
    </Background>
  );
};

const Background = styled.div`
  position: absolute;
  top: 59px;
  left: 51px;
  right: 0;
  bottom: 0;
  padding: ${space[200]} ${space[100]};
  overflow: auto;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${space[150]};
  margin-bottom: ${space[200]};
`;

const FilterWrapper = styled.div`
  width: 40%;
`;

const DeleteModalEmphasis = styled.span`
  color: ${defaultTheme.primaryColor};
`;

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  isBoostOffer: selectIsBoostOffer,
});

export default connect(mapStateToProps)(React.memo(Component));