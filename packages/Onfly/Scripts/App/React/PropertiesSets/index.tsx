import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';

import CircularProgress from '@material-ui/core/CircularProgress';

// Design System
import {
  Container,
  TextField,
  Concept,
  Button,
  Tag,
  SortDirection,
  List,
  ListHead,
  ListBody,
  ListRow,
  ListCell,
  Menu,
  space,
  defaultTheme,
  colors,
} from '@bim-co/componentui-foundation';

import { useLocation } from 'react-router-dom';
import * as API from '../../Api/PropertiesSetApi.js';

import { replaceStringByComponent } from '../../Utils/utilsResources';

import PropertiesSetForm from './PropertiesSetForm';
import DeleteConfirm from './DeleteConfirm';

import Page404 from '../ErrorPage/Page404';

import EmptyStateGlobal from '../EmptyStates';
// Reducers
import {
  setApiState as setApiStateAction,
  setPropertiesSets as setPropertiesSetsAction,
  setFilter as setFilterAction,
  setSortDirection as setSortDirectionAction,
  setSortOrderBy as setSortOrderByAction,
} from '../../Reducers/properties-sets/actions';

import {
  selectSortedPropertySets,
  selectFilter,
  selectApiState,
  sortDirection,
  sortOrderBy,
} from '../../Reducers/properties-sets/selectors';

import {
  selectToken,
  selectManagementCloudId,
  selectTranslatedResources,
  selectSettings,
  selectLanguageCode,
} from '../../Reducers/app/selectors';

import { setPageTitle as setPageTitleAction } from '../../Reducers/app/actions';
import { history } from '../../history';

type Props = {
  resources: any;
  managementCloudId?: any;
  token?: any;
  apiState?: any;
  setApiState?: Function;
  propertiesSets?: any;
  filter?: any;
  sortDirection?: any;
  sortOrderBy?: any;
  setPropertiesSets?: Function;
  setFilter?: Function;
  setSortDirection?: Function;
  setSortOrderBy?: Function;
  settings: any;
  languageCode: string;
  setPageTitle: (title: string) => void;
};

const getColorName = (index) => {
  const code = index % colors.classColorList.length;
  return colors.classColorList[code];
};

const getSetMenuOptions = (options, propertySet) => {
  const dynamicOptions = options
    .filter((option) => !propertySet.IsPublic || option.isPublic)
    .map((option) => ({
      ...option,
      onClick: () => option?.onClick(propertySet),
    }));
  return dynamicOptions;
};

const goToSetDetailPage = (set, location) => history.push(`${location?.pathname}/${set?.Id}`);

const renderListColumn = (column, item) => (
  <ListCell width={column?.width}>{column.renderItem(item)}</ListCell>
);

const getPropertiesSetRow = (propertiesSet, columns, currentSelectedSet, location) =>
  propertiesSet && (
    <ListRow
      key={propertiesSet.Id}
      hover
      focused={propertiesSet.Id === currentSelectedSet?.Id}
      onClick={() => goToSetDetailPage(propertiesSet, location)}
    >
      {columns.map((column) => renderListColumn(column, propertiesSet))}
    </ListRow>
  );

let timeoutID = null;

// Main component
const PropertiesSets: React.FC<Props> = ({
  propertiesSets,
  sortDirection,
  sortOrderBy,
  filter,
  apiState,
  token,
  managementCloudId,
  resources,
  settings,
  languageCode, // mapStateToProps
  setPropertiesSets,
  setFilter,
  setSortOrderBy,
  setSortDirection,
  setApiState,
  setPageTitle, // mapDispatchToProps
}) => {
  const location = useLocation();
  const [localFilter, setLocalFilter] = useState('');
  const [loadData, setLoadData] = useState(true);
  const [isEditModalActive, setIsEditModalActive] = useState(false);
  const [isDeleteModalActive, setIsDeleteModalActive] = useState(false);
  const [currentPropertySet, setCurrentPropertySet] = useState(null);

  // @Todo : HR
  const options = [
    {
      id: 'edit',
      icon: 'edit',
      label: resources.ContentManagementPropSets.MenuItemEdit,
      onClick: (set) => goToSetDetailPage(set, location),
      isPublic: true,
    },
    {
      id: 'settings',
      icon: 'settings',
      label: resources.ContentManagementPropSets.MenuItemDetails,
      onClick: () => {
        setIsEditModalActive(true);
      },
      isPublic: true,
    },
    {
      id: 'delete',
      icon: 'delete',
      label: resources.ContentManagementPropSets.MenuItemDelete,
      onClick: () => {
        setIsDeleteModalActive(true);
      },
      isPublic: false,
    },
  ];

  const getPropertiesSetCols = (resources) => [
    {
      id: 'Name',
      label: resources.ContentManagementPropSets.ListName,
      isSortable: true,
      sortDirection: SortDirection.Asc,
      renderItem: (item) => <PropertySet color={getColorName(item.Id)}>{item.Name}</PropertySet>,
    },
    {
      id: 'Description',
      label: resources.ContentManagementPropSets.ListDescription,
      isSortable: true,
      renderItem: (item) => item.Description,
    },
    {
      id: 'NbProperties',
      label: resources.ContentManagementPropSets.ListProperties,
      isSortable: true,
      renderItem: (item) => <Tag.Primary>{item.Statistics.NbProperties ?? 0}</Tag.Primary>,
    },
    {
      id: 'Actions',
      label: '',
      isSortable: false,
      width: space[400],
      renderItem: (item) => (
        <Menu items={getSetMenuOptions(options, item)} onClick={() => getPropertySet(item)} />
      ),
    },
  ];

  useEffect(() => {
    if (!sortOrderBy) {
      const defaultSortingCol = getPropertiesSetCols(resources).find(
        (column) => column.sortDirection
      );
      if (defaultSortingCol) {
        setSortOrderBy(defaultSortingCol.id);
        setSortDirection(defaultSortingCol.sortDirection);
      }
    }
  }, [sortOrderBy, resources]);

  useEffect(() => {
    // Page title
    if (!settings?.EnableSetsManagement) {
      setPageTitle(resources.ContentManagement.Error404);
    } else {
      // Default title
      setPageTitle(resources.ContentManagementPropSets.PropertiesSetsTitle);
    }
  }, [languageCode]);

  useEffect(() => {
    if (loadData) {
      const fetchData = async () => {
        let fetchedpropertiesSets = await API.getPropertiesSets(
          managementCloudId,
          token,
          resources
        );
        fetchedpropertiesSets = fetchedpropertiesSets.map((propertySet) => ({
          NbProperties: propertySet.Statistics.NbProperties, // @Fixme : find a better solution (else not working with redux actions)
          ...propertySet,
        }));

        setPropertiesSets(fetchedpropertiesSets);

        const updatedApiState = apiState.setIn(['fetch', 'completed'], true);
        setApiState(updatedApiState);
      };
      setFilter({ text: '' });
      fetchData();
      setLoadData(false);
    }
  }, [loadData]);

  const handleFilterChange = (event) => {
    const text = event.target.value;
    setLocalFilter(text);
    if (timeoutID !== null) {
      clearTimeout(timeoutID);
    }
    timeoutID = setTimeout(() => setFilter({ ...filter, text }), 500);
  };

  const handleEditCancel = () => {
    setCurrentPropertySet(null);
    setIsEditModalActive(false);
  };

  const afterEditSubmit = () => {
    setCurrentPropertySet(null);
    setLoadData(true);
    setIsEditModalActive(false);
  };

  const handleDeleteCancel = () => {
    setCurrentPropertySet(null);
    setIsDeleteModalActive(false);
  };

  const afterDeleteSubmit = () => {
    setCurrentPropertySet(null);
    setLoadData(true);
    setIsDeleteModalActive(false);
  };

  const renderCreateEditModal = () =>
    isEditModalActive && (
      <PropertiesSetForm
        propertySet={currentPropertySet}
        onCancel={handleEditCancel}
        afterSubmit={afterEditSubmit}
        isDisplayed={isEditModalActive}
      />
    );

  const getTitle = () => {
    const title = resources.ContentManagementPropSetForm.ModalDeleteTitle;
    const setName = <TitleTargetName>{currentPropertySet?.Name}</TitleTargetName>;

    return replaceStringByComponent(title, '[propertySetName]', setName);
  };

  const handleSubmit = async (isKeepAssigned) => {
    await API.deletePropertySet(
      currentPropertySet?.Id,
      isKeepAssigned,
      managementCloudId,
      token,
      resources
    );

    afterDeleteSubmit();
  };

  const renderDeleteModal = () =>
    isDeleteModalActive && (
      <DeleteConfirm
        isDisplayed={isDeleteModalActive}
        title={getTitle()}
        description={resources.ContentManagementPropSetForm.ModalDeleteText}
        checkboxLabel={resources.ContentManagementPropSetForm.ModalDeleteCheckbox}
        submitButtonLabel={resources.ContentManagementPropSetForm.ModalDeleteSubmit}
        onCancel={handleDeleteCancel}
        onSubmit={handleSubmit}
      />
    );

  const getPropertySet = (propSetData) => {
    if (!propSetData) {
      return;
    }

    const fetchPropertySet = async () => {
      const fetchedpropertySet = await API.getPropertySet(
        propSetData?.Id,
        managementCloudId,
        token,
        resources
      );

      const updatedApiState = apiState.setIn(['fetch', 'completed'], true);
      setApiState(updatedApiState);

      return fetchedpropertySet;
    };
    fetchPropertySet()
      .then((fetchedpropertySet) => {
        setCurrentPropertySet(fetchedpropertySet);
      })
      .catch(() => {
        // It the record is not found, reset current selected prop set and refresh the list
        setCurrentPropertySet(null);
        setLoadData(true);
      });
  };

  const handleSortClick = (headCell) => {
    if (sortOrderBy !== headCell.id) {
      setSortOrderBy(headCell.id);
      setSortDirection(SortDirection.Asc);
    } else {
      const isSortAsc = sortDirection === SortDirection.Asc;
      setSortDirection(isSortAsc ? SortDirection.Desc : SortDirection.Asc);
    }
  };

  const getPropertiesSetsList = (propertiesSets, resources) => {
    if (!propertiesSets?.length) {
      return <EmptyStateGlobal.NoSearchResults />;
    }

    const cols = getPropertiesSetCols(resources);
    return (
      <List size="large">
        <ListHead leftGap>
          <ListRow>
            {cols.map((column) => (
              <ListCell
                key={column.id}
                sortActive={column.isSortable && sortOrderBy === column.id}
                sortDirection={
                  !column.isSortable
                    ? null
                    : sortOrderBy === column.id
                      ? sortDirection
                      : SortDirection.Asc
                }
                onClick={() => handleSortClick(column)}
                width={column?.width}
              >
                {column.label}
              </ListCell>
            ))}
          </ListRow>
        </ListHead>
        <ListBody>
          {propertiesSets &&
            propertiesSets.map((item) =>
              getPropertiesSetRow(item, cols, currentPropertySet, location)
            )}
        </ListBody>
      </List>
    );
  };

  const hasFetched = apiState.getIn(['fetch', 'completed']);
  if (!hasFetched) {
    return (
      <CenterDiv>
        <CircularProgress />
        {resources.MetaResource.Loading}
      </CenterDiv>
    );
  }

  // Rendering
  if (!settings.EnableSetsManagement) {
    return <Page404 />;
  }

  return (
    <Wrapper>
      <Header>
        <InputContainer>
          <TextField
            placeholder={resources.ContentManagementPropSets.PropertiesSetsSearchPlaceholder}
            iconLeft="search"
            value={localFilter}
            onChange={handleFilterChange}
          />
        </InputContainer>
        <ButtonContainer>
          <Button
            variant="secondary"
            icon="create"
            onClick={() => {
              setCurrentPropertySet(null);
              setIsEditModalActive(true);
            }}
          >
            {resources.ContentManagementPropSets.PropertiesSetsCreate}
          </Button>
        </ButtonContainer>
      </Header>
      <Content>
        <ListContainer>{getPropertiesSetsList(propertiesSets, resources)}</ListContainer>
      </Content>
      {renderCreateEditModal()}
      {renderDeleteModal()}
    </Wrapper>
  );
};

const mapStateToProps = createStructuredSelector({
  propertiesSets: selectSortedPropertySets,
  filter: selectFilter,
  sortDirection,
  sortOrderBy,
  apiState: selectApiState,
  token: selectToken,
  managementCloudId: selectManagementCloudId,
  resources: selectTranslatedResources,
  settings: selectSettings,
  languageCode: selectLanguageCode,
});

const mapDispatchToProps = (dispatch) => ({
  setApiState: (apiState) => dispatch(setApiStateAction(apiState)),
  setPropertiesSets: (propertiesSets) => dispatch(setPropertiesSetsAction(propertiesSets)),
  setSortOrderBy: (orderBy) => dispatch(setSortOrderByAction(orderBy)),
  setSortDirection: (sortDirection) => dispatch(setSortDirectionAction(sortDirection)),
  setFilter: (filter) => dispatch(setFilterAction(filter)),
  setPageTitle: (title: string) => dispatch(setPageTitleAction(title)),
});

// StyleD
const Wrapper = styled.div({
  position: 'fixed',
  top: '59px',
  left: '51px',
  bottom: 0,
  right: 0,
  overflowY: 'auto',
});

const Header = styled.div`
  display: inline-grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 1rem;
  padding: 1rem;
  width: 100%;
`;

const Content = styled.div`
  display: inline-grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 1rem;
  width: 100%;
`;

const ListContainer = styled(Container)`
  margin-bottom: ${space[600]};
  grid-column: 1 / -1;
  grid-template-columns: 1fr 1fr 1fr 2.5rem;
`;

const InputContainer = styled.div`
  display: inline-block;
  grid-column: 1 / 6;
`;

const ButtonContainer = styled.div`
  justify-self: end;
  grid-column: 7 / -1;
`;

const PropertySet = styled(Concept.PropSet)`
  padding-left: 1rem;
`;

const CenterDiv = styled.div({
  width: '100%',
  display: 'flex',
  flexFlow: 'column nowrap',
  justifyContent: 'center',
  alignItems: 'center',
});

const TitleTargetName = styled.span`
  color: ${defaultTheme.primaryColor};
  &::before {
    content: ' ';
  }
`;

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PropertiesSets));