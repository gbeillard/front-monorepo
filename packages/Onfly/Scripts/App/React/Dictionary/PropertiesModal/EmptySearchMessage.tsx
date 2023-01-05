import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';
import { Domain } from '../PropertyRequests/definitions';
import { Property } from './definitions';
import COLORS from '../../../components/colors';
import { selectTranslatedResources } from '../../../Reducers/app/selectors';

const Message = styled.p({
  fontSize: '14px',
  color: COLORS.N50,
  marginTop: '16px',
});
type Props = {
  currentDomain: Domain;
  properties: Property[];
  filter: string;
  resources: any;
};
const EmptySearchMessage: React.FC<Props> = ({ currentDomain, properties, filter, resources }) => {
  if (properties.length > 0 || filter.length === 0) {
    return null;
  }
  return (
    <Message>
      {`${resources.ContentManagement.NoResultForDomain as string} ${currentDomain.DomainName}`}
    </Message>
  );
};

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(EmptySearchMessage);