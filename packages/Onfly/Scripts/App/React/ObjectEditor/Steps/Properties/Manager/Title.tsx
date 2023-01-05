import React from 'react';
import { ImmutableObject } from 'seamless-immutable';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

/* Selectors */
import { space, MenuVariants, Menu, H2 as DS_H2, Ellipsis } from '@bim-co/componentui-foundation';
import {
  selectEnableSetsManagement,
  selectTranslatedResources,
} from '../../../../../Reducers/app/selectors';

import { View } from './types';
import { BimObject } from '../../../../../Reducers/BimObject/types';

import { replaceStringByComponent } from '../../../../../Utils/utilsResources';

type Props = {
  resources: any;
  enableSets: boolean;
  view: View;
  bimObject: ImmutableObject<BimObject>;
  onViewChange: (view: View) => void;
};

const MenuContainer = styled.div`
  margin-right: ${space[25]};
`;

const createMenuOption = (id: string, label: string, value: View) => ({
  id,
  label,
  value,
});

const getMenuOptions = (resources: any) => [
  createMenuOption(
    'properties',
    resources.ObjectPropertiesManager.Properties as string,
    View.Properties
  ),
  createMenuOption('sets', resources.ObjectPropertiesManager.Sets as string, View.Sets),
];

const getMenuOption = (resources: any, view: View) =>
  getMenuOptions(resources).find((option) => option.value === view);

const getOtherMenuOptions = (resources: any, view: View) =>
  getMenuOptions(resources).filter((option) => option.value !== view);

const Title: React.FC<Props> = ({ resources, enableSets, view, bimObject, onViewChange }) => {
  const onChangeHandler = (option) => {
    onViewChange(option.value as View);
  };

  const selectedOption = getMenuOption(resources, view);

  const objectName =
    bimObject?.Name && !bimObject?.Name?.includes('[ElementsType]') ? bimObject?.Name : '';

  let content = resources.ObjectPropertiesManager.ElementsTypeOfObject;
  content = content?.replace('[ObjectName]', objectName);

  if (enableSets) {
    const menu = (
      <MenuContainer>
        <Menu
          items={getOtherMenuOptions(resources, view)}
          buttonText={selectedOption?.label}
          onChange={onChangeHandler}
          variant={MenuVariants.H2}
        />
      </MenuContainer>
    );

    content = replaceStringByComponent(content as string, '[ElementsType]', menu, H2);
  } else {
    content = <H2>{content?.replace('[ElementsType]', selectedOption?.label)}</H2>;
  }

  return <>{content}</>;
};

const H2Container = styled(DS_H2)`
  overflow: hidden;
`;

const H2: React.FC = ({ children }) => (
  <H2Container>
    <Ellipsis>{children}</Ellipsis>
  </H2Container>
);

const mapStateToProps = createStructuredSelector({
  enableSets: selectEnableSetsManagement,
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(Title);