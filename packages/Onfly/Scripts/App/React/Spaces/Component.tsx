import React from 'react';

import Header from './Header';
import Body from './Body';
import { Space, SpaceWrite } from '../../Reducers/Spaces/types';

type Props = {
  resources: any;
  spaces: Space[];
  searchedSpaces: Space[];
  fetchSpacesIsPending: boolean;
  fetchSpacesIsError: string;
  fetchSpacesIsSuccess: boolean;
  setSpacesSearch: (search: string) => void;
  deleteSpace: (spaceId: number) => void;
  updateSpace: (space: SpaceWrite) => void;
  createSpace: (space: SpaceWrite) => void;
};

const Component: React.FC<Props> = ({
  resources,
  spaces,
  searchedSpaces,
  fetchSpacesIsSuccess,
  fetchSpacesIsPending,
  fetchSpacesIsError,
  setSpacesSearch,
  deleteSpace,
  updateSpace,
  createSpace,
}) => (
  <>
    <Header
      resources={resources}
      spaces={spaces}
      setSpacesSearch={setSpacesSearch}
      fetchSpacesIsSuccess={fetchSpacesIsSuccess}
      createSpace={createSpace}
    />
    <Body
      resources={resources}
      spaces={spaces}
      searchedSpaces={searchedSpaces}
      fetchSpacesIsSuccess={fetchSpacesIsSuccess}
      fetchSpacesIsPending={fetchSpacesIsPending}
      fetchSpacesIsError={fetchSpacesIsError}
      updateSpace={updateSpace}
      deleteSpace={deleteSpace}
    />
  </>
);
export default Component;