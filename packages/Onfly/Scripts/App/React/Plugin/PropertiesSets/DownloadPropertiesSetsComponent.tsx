/** Imports */

// React
import React, { useEffect, useReducer } from 'react';

// Librairies

// - External libraries
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';
import { SidebarDirections, WithSidebar } from '@bim-co/componentui-foundation';
import { withRouter } from '../../../Utils/withRouter';

// - Corporate libraries

// Absolute from project
import * as PluginUtils from '../../../Utils/pluginUtils';

// - Types
import { View } from '../../Classifications/Details/Panel/types';

// - Components
import PropertiesPickerContainer from '../../CommonsElements/PropertiesPicker/PropertiesPickerContainer';
import PropertiesSelected from '../../CommonsElements/PropertiesPicker/PropertiesSelected';

// Contexts
import {
  PropertiesSelectContextDispatch,
  PropertiesSelectContextState,
} from '../../CommonsElements/PropertiesPicker/PropertiesPickerModal';

// - Selectors
import {
  selectToken,
  selectManagementCloudId,
  selectTranslatedResources,
} from '../../../Reducers/app/selectors';

// properties actions
import { setFilterSearch as setPropertiesFilterSearchAction } from '../../../Reducers/PropertiesV10/actions';

// subsets actions
import { setFilterText as setSubsetsFilterSearchAction } from '../../../Reducers/Sets/Subsets/actions';

// - Reducers
import { modalReducer } from '../../CommonsElements/PropertiesPicker/Reducers/reducer';
import {
  UNSELECT_ALL,
  UNSELECT_ALL_PROPERTIES,
  UNSELECT_ALL_SUBSETS,
} from '../../CommonsElements/PropertiesPicker/Reducers/types';

// Types
type Props = {
  view: string;
  resources: any;
  token: any;
  managementCloudId: any;
  setPropertiesFilterSearch?: (search: string) => void;
  setSubsetsFilterSearch?: (search: string) => void;
};

/**
 * Component dedicated to downloading properties into Revit plugin
 */
const DownloadPropertiesSetsComponent: React.FC<Props> = ({
  view,
  resources,
  token,
  managementCloudId, // mapSelectToProps
  setPropertiesFilterSearch,
  setSubsetsFilterSearch, // mapDispatchToProps
}) => {
  const [modalList, dispatch] = useReducer(modalReducer, {
    subsets: {
      list: [],
      selections: [],
    },
    properties: {
      list: [],
      selections: [],
    },
  });

  // Component Mount : reset search filter
  useEffect(() => {
    setPropertiesFilterSearch('');
    setSubsetsFilterSearch('');
  }, []);

  useEffect(() => {
    // for plugin, disable multiple types selection
    if (view === 'sets') {
      dispatch({ type: UNSELECT_ALL_PROPERTIES });
    } else {
      dispatch({ type: UNSELECT_ALL_SUBSETS });
    }
  }, [view]);

  const handleCancel = () => {
    PluginUtils.downloadPropertiesBundle([], [], managementCloudId, token, resources);
    setPropertiesFilterSearch('');
    setSubsetsFilterSearch('');
    dispatch({ type: UNSELECT_ALL });
  };

  const handleSubmit = () => {
    if (view === 'properties') {
      const propertiesSelected = modalList?.properties?.selections;
      PluginUtils.downloadPropertiesBundle(
        propertiesSelected,
        [],
        managementCloudId,
        token,
        resources
      );
      setPropertiesFilterSearch('');
    }
    if (view === 'sets') {
      const subsetsSelected = modalList?.subsets?.selections;
      PluginUtils.downloadPropertiesBundle(
        [],
        subsetsSelected,
        managementCloudId,
        token,
        resources
      );
      setSubsetsFilterSearch('');
    }
    dispatch({ type: UNSELECT_ALL });
  };

  return (
    <PluginPropertiesDownloaderWrapper>
      <PropertiesSelectContextDispatch.Provider value={dispatch}>
        <PropertiesSelectContextState.Provider value={modalList}>
          <SidebarContainer
            content={
              <PropertiesSelected
                resources={resources}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
              />
            }
            direction={SidebarDirections.RIGHT}
          >
            <PropertiesPickerContainerLeft
              resources={resources}
              view={view === 'properties' ? View.Properties : View.Sets}
              displayTypes={view === 'properties' ? ['properties'] : ['subsets']}
            />
          </SidebarContainer>
        </PropertiesSelectContextState.Provider>
      </PropertiesSelectContextDispatch.Provider>
    </PluginPropertiesDownloaderWrapper>
  );
};

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  token: selectToken,
  managementCloudId: selectManagementCloudId,
});

const mapDispatchToProps = (dispatch) => ({
  setPropertiesFilterSearch: (filter) => dispatch(setPropertiesFilterSearchAction(filter)),
  setSubsetsFilterSearch: (filter) => dispatch(setSubsetsFilterSearchAction(filter)),
});

export const PluginPropertiesDownloaderWrapper = styled.div`
  height: 100vh;
`;

export const SidebarContainer = styled(WithSidebar)`
  overflow: hidden;

  & > :first-of-type {
    padding: 0;
  }
`;

// temporary
export const PropertiesPickerContainerLeft = styled(PropertiesPickerContainer)`
  max-width: calc(100% - 336px);
  overflow: hidden;
  height: 100%;
  padding: 0;
`;

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(React.memo(DownloadPropertiesSetsComponent))
);