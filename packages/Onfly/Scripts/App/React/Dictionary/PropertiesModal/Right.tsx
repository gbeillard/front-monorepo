import React from 'react';
import { Button } from '@bim-co/componentui-foundation';
import styled from '@emotion/styled';
import { ListItem } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import CompactList from '../../../components/lists/CompactList';
import COLORS from '../../../components/colors';
import { selectTranslatedResources } from '../../../Reducers/app/selectors';
import { Property } from './definitions';
import SelectedProperty from './SelectedProperty';

type Props = {
  properties: Property[];
  onConfirm: () => void;
  onCancel: () => void;
  onDelete: (x: Property) => void;
  resources: any;
};
const Right: React.FC<Props> = ({ properties, onConfirm, onCancel, onDelete, resources }) => {
  const propertyList = properties.map((property) => (
    <ListItem disableGutters dense key={property.Id}>
      <SelectedProperty label={property.Name} onDelete={() => onDelete(property)} />
    </ListItem>
  ));
  return (
    <Wrapper>
      <Title>{resources.ContentManagement.PropertiesModalRightTitle}</Title>
      <ScrollableArea>
        <CompactList>{propertyList}</CompactList>
      </ScrollableArea>
      <ActionsArea>
        <Button variant="primary" onClick={onConfirm}>
          {resources.ContentManagement.PropertiesModalContinue}
        </Button>
        <CancelButton variant="alternative" onClick={onCancel}>
          {resources.MetaResource.Cancel}
        </CancelButton>
      </ActionsArea>
    </Wrapper>
  );
};

const Title = styled.h4({
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: '16px',
  lineHeight: '24px',
  color: COLORS.N70,
  marginTop: '32px',
  marginLeft: '32px',
});
const Wrapper = styled.div({
  display: 'flex',
  flexFlow: 'column nowrap',
  overflowX: 'hidden',
  maxHeight: '80vh',
  height: '80vh',
});
const ScrollableArea = styled.div({
  flewGrow: 1,
  overflowY: 'auto',
  padding: '32px 32px 0 32px',
  marginBottom: '8px',
});
const ActionsArea = styled.div({
  display: 'flex',
  flexFlow: 'column nowrap',
  marginTop: 'auto',
  padding: '0 32px 8px 32px',
});
const CancelButton = styled(Button)({
  marginTop: '8px',
});

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});
export default connect(mapStateToProps)(Right);