import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import styled from '@emotion/styled';
import { TextField, Portal, space, defaultTheme } from '@bim-co/componentui-foundation';
import { Dialog } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectTranslatedResources } from '../../../Reducers/app/selectors';
import NodesTree from './NodesTree';
import Header from './Header';
import EditClassifications from '../EditClassifications';
import { EDITED_PROP } from '../EditClassifications/constants';
import { Panel } from './Panel';
import EditDialogContent from './NodesTree/EditDialogContent';
import DeleteConfirm from '../../PropertiesSets/DeleteConfirm';
import { replaceStringByComponent } from '../../../Utils/utilsResources';

const InifiniteScrollLoader = () => null;
const scrollStep = 100;

const Component = ({
  classification,
  properties,
  onClassificationEdited,
  onDeleteClassification,
  onNodeSelected,
  onNodeAdded,
  onNodeEdited,
  onNodeDeleted,
  onNodeMoved,
  filter,
  onFilterChanged,
  display,
  onPageChange,
  currentLanguageCode,
  onLanguageChange,
  currentNode,
  resources,
  disableCriticalFeatures,
}) => {
  const [showEditClassification, setShowEditClassification] = useState(false);
  const [showDeleteClassification, setShowDeleteClassification] = useState(false);
  const [showEditNode, setShowEditNode] = useState(false);
  const [editedProp, setEditedProp] = useState(EDITED_PROP.NONE);
  const [nodesCount, setNodesCount] = useState(scrollStep);
  const onLoadMore = () => {
    setNodesCount((currentCount) => currentCount + scrollStep);
  };

  const onChangeHandler = (event) => {
    onFilterChanged(event.target.value);
  };

  const openEditClassification = () => {
    setShowEditClassification(true);
  };
  const closeEditClassification = () => {
    setShowEditClassification(false);
    setEditedProp(EDITED_PROP.NONE);
  };
  const openDeleteClassification = () => {
    setShowDeleteClassification(true);
  };
  const closeDeleteClassification = () => {
    setShowDeleteClassification(false);
  };
  const openEditNode = () => {
    setShowEditNode(true);
  };
  const closeEditNode = () => {
    setShowEditNode(false);
  };
  const onSubmitEditHandler = (node) => {
    closeEditNode();
    onNodeEdited(node);
  };

  const onSubmitDeleteHandler = (keepPropertiesWithValue) => {
    onDeleteClassification(keepPropertiesWithValue);
    closeDeleteClassification();
  };

  return (
    <Wrapper>
      <InfiniteScroll
        loadMore={onLoadMore}
        hasMore={nodesCount < classification.nodes?.length}
        loader={<InifiniteScrollLoader />}
        useWindow={false}
      >
        <Header
          title={classification.Name}
          onEdit={openEditClassification}
          onDelete={openDeleteClassification}
          onPageChange={onPageChange}
          onLanguageChange={onLanguageChange}
          languageCode={currentLanguageCode}
          disableCriticalFeatures={disableCriticalFeatures}
        />
        <Main>
          <FilterWrapper>
            <TextField
              value={filter}
              onChange={onChangeHandler}
              size="dense"
              placeholder={resources.ClassificationDetails.Search}
              iconLeft="search"
            />
          </FilterWrapper>
          <NodesTree
            classificationId={classification.Id}
            nodes={classification.nodes}
            onNodeSelected={onNodeSelected}
            onNodeAdded={onNodeAdded}
            onNodeDeleted={onNodeDeleted}
            onNodeMoved={onNodeMoved}
            display={display}
            resources={resources}
            nodesCount={nodesCount}
            disableCriticalFeatures={disableCriticalFeatures}
          />
        </Main>

        <Dialog open={showEditClassification} onClose={closeEditClassification}>
          <EditClassifications
            classificationId={classification.Id}
            onClose={closeEditClassification}
            editedProp={editedProp}
            setEditedProp={setEditedProp}
            onSuccess={onClassificationEdited}
            disableCriticalFeatures={disableCriticalFeatures}
          />
        </Dialog>
        <DeleteConfirm
          isDisplayed={showDeleteClassification}
          title={replaceStringByComponent(
            resources.ClassificationHome.DeleteClassificationTitle,
            '[ClassificationName]',
            <DeleteModalEmphasis>{classification?.Name}</DeleteModalEmphasis>
          )}
          description={resources.ClassificationHome.DeleteClassificationDescription}
          submitButtonLabel={resources.ClassificationHome.DeleteClassificationConfirm}
          checkboxLabel={resources.ClassificationHome.DeleteClassificationCheckboxLabel}
          onCancel={closeDeleteClassification}
          onSubmit={onSubmitDeleteHandler}
        />
        <Dialog open={showEditNode} onClose={closeEditNode}>
          <EditDialogContent
            node={currentNode}
            onSubmit={onSubmitEditHandler}
            onClose={closeEditNode}
          />
        </Dialog>
        <Portal>
          <PanelWrapper>
            <Panel
              node={currentNode}
              classificationId={classification.Id}
              properties={properties}
              onClose={() => onNodeSelected(null)}
              onEditNode={openEditNode}
              disableCriticalFeatures={disableCriticalFeatures}
            />
          </PanelWrapper>
        </Portal>
      </InfiniteScroll>
    </Wrapper>
  );
};

// start styled elements
const Wrapper = styled.div`
  position: absolute;
  top: 59px;
  left: 51px;
  right: 0;
  bottom: 0;
  padding: ${space[150]} ${space[100]} 0;
  overflow: auto;
`;
const Main = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin-top: ${space[200]};
`;
const PanelWrapper = styled.div`
  position: absolute;
  top: 150px;
  left: 40%;
  right: ${space[225]};
`;
const FilterWrapper = styled.div`
  margin-left: ${space[75]};
  max-width: ${space[1000]};
`;
const DeleteModalEmphasis = styled.span`
  color: ${defaultTheme.primaryColor};
`;
// end styled elements

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(Component);