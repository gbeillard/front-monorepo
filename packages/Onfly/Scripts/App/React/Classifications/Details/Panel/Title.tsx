import React from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { defaultTheme, Menu, MenuVariants, space } from '@bim-co/componentui-foundation';
import { IClassificationNode } from '../../../../Reducers/classifications/types';
import {
  selectEnableSetsManagement,
  selectTranslatedResources,
} from '../../../../Reducers/app/selectors';
import { View } from './types';

type Props = {
  view: View;
  onViewChange: (x: View) => void;
  enableSets: boolean;
  node: IClassificationNode;
  resources: any;
};

const getOptions = (resources: any) => [
  { id: 'properties', label: resources.ClassificationDetails.Properties, value: View.Properties },
  { id: 'sets', label: resources.ClassificationDetails.Sets, value: View.Sets },
];
const getButtonText = (view: View, resources) =>
  view === View.Properties
    ? resources.ClassificationDetails.Properties
    : resources.ClassificationDetails.Sets;

const Title: React.FC<Props> = ({ view, onViewChange, enableSets, node, resources }) => {
  const onChangeHandler = (option) => {
    onViewChange(option.value as View);
  };
  const menu = enableSets ? (
    <Menu
      items={getOptions(resources)}
      buttonText={getButtonText(view, resources)}
      onChange={onChangeHandler}
      variant={MenuVariants.H2}
    />
  ) : (
    <Left>{resources.ClassificationDetails.Properties}</Left>
  );
  return (
    <>
      {menu}
      <Pipe>|</Pipe>
      <Right>{node.Name}</Right>
    </>
  );
};

const Base = styled.span`
  color: ${defaultTheme.textColorSecondary};
  font-weight: ${defaultTheme.boldWeight};
  font-size: ${space[125]};
`;
const Left = styled(Base)`
  margin-right: ${space[50]};
`;
const Pipe = styled(Base)`
  margin-right: ${space[50]};
`;
const Right = styled(Base)``;

const mapStateToProps = createStructuredSelector({
  enableSets: selectEnableSetsManagement,
  resources: selectTranslatedResources,
});
export default connect(mapStateToProps)(Title);