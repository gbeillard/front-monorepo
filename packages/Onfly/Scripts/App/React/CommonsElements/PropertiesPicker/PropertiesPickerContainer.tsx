import React, { useContext } from 'react';

import styled from '@emotion/styled';

import { Menu, space, colors, H2, MenuVariants } from '@bim-co/componentui-foundation';

/* Contexts */
import { PropertiesSelectContextState } from './PropertiesPickerModal';

// Selectors
import SubsetsList from './SubsetsList';
import PropertiesList from './PropertiesList';
import { ExistingElements } from './Reducers/types';
import { View } from '../../Classifications/Details/Panel/types';

type Props = {
  resources: any;
  existingElements?: ExistingElements;
  setView?: (view: View) => void;
  view: View;
  enableSets?: boolean;
  displayTypes?: string[];
  isDense?: boolean;
};

type WrapperProps = {
  isFull?: boolean;
  isDense?: boolean;
};

type TitleTextProps = {
  isDense?: boolean;
};

const getDisplayTypeLabel = (displayType, resources) =>
  displayType === 'subsets'
    ? resources.ContentManagement.PopinPropertiesDisplayTypeSubsets
    : resources.ContentManagement.PopinPropertiesDisplayTypeProperties;

const getSubsetsSelections = (state) => state?.subsets?.selections;

const getDisplayTypesOptions = (_displayTypes, resources) =>
  (_displayTypes ?? []).map((displayType) => ({
    id: displayType,
    label: getDisplayTypeLabel(displayType, resources),
    value: displayType,
  }));

const PropertiesPickerContainer: React.FC<Props> = ({
  resources,
  existingElements,
  setView,
  view,
  enableSets,
  displayTypes,
  isDense,
}) => {
  const propertiesSelectContextState = useContext(PropertiesSelectContextState);

  const getCurrentDisplayType = () => (view === View.Properties ? 'properties' : 'subsets');

  const innerDisplayTypes =
    view === View.Properties ? ['properties', 'subsets'] : ['subsets', 'properties'];

  const displayTypesList = displayTypes ?? (enableSets ? innerDisplayTypes : ['properties']);

  const getTitle = () => {
    const titleMenu = (
      <TitleMenu
        items={getDisplayTypesOptions(displayTypesList, resources)}
        variant={MenuVariants.H2}
        buttonText={getDisplayTypeLabel(getCurrentDisplayType(), resources)}
        onChange={(item) =>
          setView && setView(item?.value === 'properties' ? View.Properties : View.Sets)
        }
        size={isDense ? 'dense' : 'default'}
      />
    );

    return (
      <TitleWrapper>
        <TitleText isDense={isDense}>
          {resources.ContentManagement.PopinPropertiesContentTitle}
        </TitleText>
        {displayTypesList?.length === 1
          ? getDisplayTypeLabel(getCurrentDisplayType(), resources)
          : titleMenu}
      </TitleWrapper>
    );
  };

  return (
    <Wrapper isFull={!getSubsetsSelections(propertiesSelectContextState)?.length} isDense={isDense}>
      <Title isDense={isDense}>{getTitle()}</Title>
      {getCurrentDisplayType() === 'subsets' && (
        <SubsetsList
          resources={resources}
          displayTypes={displayTypesList}
          existingElements={existingElements}
          isDense={isDense}
        />
      )}
      {getCurrentDisplayType() === 'properties' && (
        <PropertiesList
          resources={resources}
          displayTypes={displayTypesList}
          existingElements={existingElements}
          isDense={isDense}
        />
      )}
    </Wrapper>
  );
};

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const TitleText = styled.div<TitleTextProps>`
  display: inline-flex;
  padding-right: ${space[50]};
`;

const Wrapper = styled.div<WrapperProps>`
  padding-right: ${({ isDense }) => (isDense ? space[0] : space[300])};
  padding-left: ${({ isDense }) => (isDense ? space[0] : space[400])};
  padding-top: ${({ isDense }) => (isDense ? space[0] : space[200])};
  padding-bottom: ${({ isDense }) => (isDense ? space[0] : space[300])};
  position: relative;

  display: flex;
  flex-direction: column;

  height: 100%;
  overflow: hidden;

  & > * {
    width: 100%;
  }
`;

const Title = styled(H2) <TitleTextProps>`
  margin-bottom: 0;
  line-height: ${space[150]};
  padding-bottom: ${({ isDense }) => (isDense ? space[150] : space[250])};
  color: ${colors.NEUTRAL[100]};
`;

const TitleMenu = styled(Menu)`
  margin-left: ${space[25]};
`;

export default React.memo(PropertiesPickerContainer);