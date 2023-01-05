import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

import { Button, space } from '@bim-co/componentui-foundation';

import { View } from './types';

/* Connectors */

import { BimObjectProps } from '../../../../../Reducers/BimObject/connectors';

import { BimObjectPropertiesProps } from '../../../../../Reducers/BimObject/Properties/connectors';

import { BimObjectSubsetsProps } from '../../../../../Reducers/BimObject/Subsets/connectors';

/* Selectors */
import {
  selectTranslatedResources,
  selectLanguageCode,
  selectEnableSetsManagement,
} from '../../../../../Reducers/app/selectors';

import { Property } from '../../../../../Reducers/BimObject/Properties/types';
import { Subset } from '../../../../../Reducers/Sets/Subsets/types';

/* Components */
import PropertiesPickerModal from '../../../../CommonsElements/PropertiesPicker/PropertiesPickerModal';
import Title from './Title';

type Props = {
  languageCode: string;
  resources: any;
  enableSets: boolean;
  view: View;
  onViewChange: (view: View) => void;
} & BimObjectProps &
  BimObjectPropertiesProps &
  BimObjectSubsetsProps;

const FlexContainer = styled.div`
  display: flex;
`;

const Container = styled(FlexContainer)`
  margin-bottom: ${space[200]};
  padding-top: ${space[125]};
  align-items: center;
`;

const BackButton = styled(Button)`
  margin-right: ${space[50]};
`;

const AddButtonContainer = styled(FlexContainer)`
  flex-grow: 1;
  justify-content: flex-end;
`;

const AddButton = styled(Button)`
  margin-left: ${space[200]};
`;

const Header: React.FunctionComponent<Props> = ({
  view,
  onViewChange,
  // mapSelectToProps
  resources,
  languageCode,
  enableSets,
  // Connectors
  bimObjectProps,
  bimObjectPropertiesProps,
  bimObjectSubsetsProps,
}) => {
  const [isPropertiesModalOpen, setIsPropertiesModalOpen] = useState(false);
  const bimObjectId = bimObjectProps?.bimObject?.Id;

  const handleOnConfirmPropertiesModal = ({ properties, subsets }) => {
    if (bimObjectId && properties?.length > 0) {
      const propertiesWithSubsets: Property[] = properties.map((property) => ({
        ...property,
        Subsets: [],
        CanBeDeleted: true,
      }));
      bimObjectPropertiesProps?.addProperties(bimObjectId, propertiesWithSubsets);
    }

    if (bimObjectId && subsets?.length > 0) {
      bimObjectSubsetsProps?.addSubsets(bimObjectId, subsets as Subset[]);
    }

    setIsPropertiesModalOpen(false);
  };

  return (
    <>
      <Container>
        {/* Left */}
        <Link to={`/${languageCode}/bimobject/${bimObjectId}/edit/properties`}>
          <BackButton icon="arrow-left" />
        </Link>
        <Title view={view} bimObject={bimObjectProps?.bimObject} onViewChange={onViewChange} />

        {/* Right */}
        <AddButtonContainer>
          <AddButton variant="primary" icon="create" onClick={() => setIsPropertiesModalOpen(true)}>
            {view === View.Sets
              ? resources.ObjectPropertiesManager.AddSets
              : resources.ObjectPropertiesManager.AddProperties}
          </AddButton>
        </AddButtonContainer>
      </Container>
      <PropertiesPickerModal
        isDisplayed={isPropertiesModalOpen}
        onCancel={() => setIsPropertiesModalOpen(false)}
        onConfirm={handleOnConfirmPropertiesModal}
        view={view}
        setView={onViewChange}
        enableSets={enableSets}
        existingElements={{
          properties: bimObjectPropertiesProps?.properties,
          subsets: bimObjectSubsetsProps?.subsets,
        }}
      />
    </>
  );
};

const mapSelectToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  languageCode: selectLanguageCode,
  enableSets: selectEnableSetsManagement,
});

export default connect(mapSelectToProps)(Header);