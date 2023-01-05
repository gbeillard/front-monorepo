import React, { useEffect, useReducer } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';
import {
  useModal,
  SidebarDirections,
  Modal,
  WithSidebar,
  space,
  colors,
} from '@bim-co/componentui-foundation';
import PropertiesSelected from './PropertiesSelected';
import PropertiesPickerContainer from './PropertiesPickerContainer';

import { selectTranslatedResources } from '../../../Reducers/app/selectors';

import { modalReducer } from './Reducers/reducer';
import { ExistingElements, UNSELECT_ALL } from './Reducers/types';
import { View } from '../../Classifications/Details/Panel/types';

type Props = {
  isDisplayed: boolean;
  resources: any;
  existingElements?: ExistingElements;
  onConfirm?: (x: any) => void;
  onClose?: () => void;
  onCancel?: () => void;
  view: View;
  setView: (view: View) => void;
  enableSets: boolean;
};

export const PropertiesSelectContextDispatch = React.createContext(null);
export const PropertiesSelectContextState = React.createContext(null);

/**
 * Main component
 */
const PropertiesPickerModal: React.FC<Props> = ({
  isDisplayed,
  onConfirm,
  onCancel,
  existingElements,
  view,
  setView,
  resources, // mapStateToProps
  enableSets,
}) => {
  const [isPropertiesSelectModalActive, openPropertiesSelectModal, closePropertiesSelectModal] =
    useModal();

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

  useEffect(() => {
    if (isDisplayed) {
      openPropertiesSelectModal();
    }
  }, [isDisplayed]);

  const handleCancel = () => {
    onCancel();
    closePropertiesSelectModal();

    dispatch({ type: UNSELECT_ALL });
  };

  const handleSubmit = () => {
    const subsetsSelected = modalList?.subsets?.selections;
    const propertiesSelected = modalList?.properties?.selections;
    onConfirm({ subsets: subsetsSelected, properties: propertiesSelected });
    closePropertiesSelectModal();

    dispatch({ type: UNSELECT_ALL });
  };

  return (
    <Modal
      active={isPropertiesSelectModalActive}
      close={handleCancel}
      size="xlarge"
      noPadding
      style={{
        height: `calc(100vh - ${space[500]})`,
        top: space[200],
        marginLeft: space[600],
        maxWidth: '2912px',
      }}
    >
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
              existingElements={existingElements}
              view={view}
              setView={setView}
              enableSets={enableSets}
            />
          </SidebarContainer>
        </PropertiesSelectContextState.Provider>
      </PropertiesSelectContextDispatch.Provider>
    </Modal>
  );
};

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export const SidebarContainer = styled(WithSidebar)`
  overflow: hidden;
  height: 100%;
`;

// temporary
export const PropertiesPickerContainerLeft = styled(PropertiesPickerContainer)`
  max-width: calc(100% - 336px);
  overflow: hidden;
  height: 100%;
`;

export const Left = styled.div`
  flex-grow: 1;
  background-color: ${colors.WHITE};
  max-width: 100%;
  overflow-y: auto;
`;

export default connect(mapStateToProps, null)(React.memo(PropertiesPickerModal));