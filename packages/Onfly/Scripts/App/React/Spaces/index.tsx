import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import toastr from 'toastr';
import Page from '../CommonsElements/PageContentContainer';
import Component from './Component';

import { Space, SpaceWrite } from '../../Reducers/Spaces/types';
import {
  createSpace as createSpaceAction,
  fetchSpaces as fetchSpacesAction,
  setSpacesSearch as setSpacesSearchAction,
  updateSpace as updateSpaceAction,
  deleteSpace as deleteSpaceAction,
} from '../../Reducers/Spaces/actions';

/* Selectors */
import { selectTranslatedResources, selectEnableSpaces } from '../../Reducers/app/selectors';

import {
  selectSpaces,
  selectFetchSpacesIsPending,
  selectFetchSpacesIsError,
  selectSearchedSpaces,
  selectFetchSpacesIsSuccess,
  selectDeleteSpaceIsError,
  selectCreateSpaceIsError,
  selectUpdateSpaceIsError,
} from '../../Reducers/Spaces/selectors';
import Page404 from '../ErrorPage/Page404';

type Props = {
  resources: any;
  spaces: Space[];
  searchedSpaces: Space[];
  enableSpaces: boolean;
  fetchSpaces: () => void;
  setSearchedSpace?: Space[];
  fetchSpacesIsPending: boolean;
  fetchSpacesIsSuccess: boolean;
  fetchSpacesIsError: string;
  updateSpaceIsError: string;
  deleteSpaceIsError: string;
  createSpaceIsError: string;
  setSpacesSearch: (search: string) => void;
  deleteSpace: (spaceId: number) => void;
  createSpace: (space: SpaceWrite) => void;
  updateSpace: (space: SpaceWrite) => void;
};

const Spaces: React.FC<Props> = ({
  resources,
  spaces,
  enableSpaces,
  // mapDispatchToProps
  searchedSpaces,
  createSpace,
  fetchSpaces,
  fetchSpacesIsPending,
  fetchSpacesIsError,
  fetchSpacesIsSuccess,
  setSpacesSearch,
  deleteSpace,
  deleteSpaceIsError,
  createSpaceIsError,
  updateSpaceIsError,
  updateSpace,
}) => {
  useEffect(() => {
    // Reset search
    setSpacesSearch('');
    // Load Spaces
    fetchSpaces();
  }, []);

  /* Error handler */
  useEffect(() => {
    // Delete space failed
    if (deleteSpaceIsError) {
      toastr.error(resources.Spaces.DeleteSpaceFailed, deleteSpaceIsError);
    }
  }, [deleteSpaceIsError]);

  useEffect(() => {
    // create space failed
    if (createSpaceIsError) {
      toastr.error(createSpaceIsError);
    }
  }, [createSpaceIsError]);

  useEffect(() => {
    // Update space failed
    if (updateSpaceIsError) {
      toastr.error(resources.Spaces.UpdateSpaceFailed, updateSpaceIsError);
    }
  }, [updateSpaceIsError]);

  if (!enableSpaces) {
    return <Page404 />;
  }

  return (
    <Page withNewBackgroundColor>
      <Component
        resources={resources}
        spaces={spaces}
        fetchSpacesIsPending={fetchSpacesIsPending}
        fetchSpacesIsError={fetchSpacesIsError}
        searchedSpaces={searchedSpaces}
        setSpacesSearch={setSpacesSearch}
        fetchSpacesIsSuccess={fetchSpacesIsSuccess}
        deleteSpace={deleteSpace}
        createSpace={createSpace}
        updateSpace={updateSpace}
      />
    </Page>
  );
};

const mapSelectToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  spaces: selectSpaces,
  enableSpaces: selectEnableSpaces,
  fetchSpacesIsPending: selectFetchSpacesIsPending,
  searchedSpaces: selectSearchedSpaces,
  fetchSpacesIsSuccess: selectFetchSpacesIsSuccess,
  fetchSpacesIsError: selectFetchSpacesIsError,
  deleteSpaceIsError: selectDeleteSpaceIsError,
  createSpaceIsError: selectCreateSpaceIsError,
  updateSpaceIsError: selectUpdateSpaceIsError,
});

const mapDispatchToProps = (dispatch) => ({
  fetchSpaces: () => dispatch(fetchSpacesAction()),
  setSpacesSearch: (search: string) => dispatch(setSpacesSearchAction(search)),
  deleteSpace: (spaceId: number) => dispatch(deleteSpaceAction(spaceId)),
  createSpace: (space: SpaceWrite) => dispatch(createSpaceAction(space)),
  updateSpace: (space: SpaceWrite) => dispatch(updateSpaceAction(space)),
});

export default connect(mapSelectToProps, mapDispatchToProps)(Spaces);