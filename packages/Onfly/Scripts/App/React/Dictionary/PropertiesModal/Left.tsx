import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import { Searchbar } from '@bim-co/componentui-foundation';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';
import { Property } from './definitions';
import { selectTranslatedResources } from '../../../Reducers/app/selectors';
import { Domain } from '../PropertyRequests/definitions';
import PropertyRow from './PropertyRow';
import COLORS from '../../../components/colors';
import EmptySearchMessage from './EmptySearchMessage';

const STEP_COUNT = 10;

type Props = {
  properties: Property[];
  onPropertyChanged: (x: Property) => void;
  filter: string;
  setFilter: (x: string) => void;
  domains: Domain[];
  selectedDomain: Domain;
  onDomainChanged: (x: Domain) => void;
  resources: any;
};
const Left: React.FC<Props> = ({
  properties,
  onPropertyChanged,
  filter,
  setFilter,
  domains,
  selectedDomain,
  onDomainChanged,
  resources,
}) => {
  const [showCount, setShowCount] = useState(STEP_COUNT);
  const inputHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setFilter(event.target.value);
  };
  const selectHandler: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const selectedDomainId = parseInt(event.target.value, 10);
    const domain = domains.find((domain) => domain.DomainId === selectedDomainId);
    onDomainChanged(domain);
  };
  const onLoadMore = () => {
    setShowCount(showCount + STEP_COUNT);
  };

  const propertyList = properties
    .slice(0, showCount)
    .map((property) => (
      <PropertyRow key={property.Id} property={property} onPropertyChanged={onPropertyChanged} />
    ));

  const domainList = domains.map((domain) => (
    <MenuItem key={domain.DomainId} value={domain.DomainId}>
      {domain.DomainName}
    </MenuItem>
  ));

  return (
    <InfiniteScroll loadMore={onLoadMore} hasMore={showCount < properties.length} useWindow={false}>
      <Wrapper>
        <Title>{resources.ContentManagement.PropertiesModalLeftTitle}</Title>
        <Header>
          <FiltersWrapper>
            <FormControl style={{ width: '50%', marginRight: '32px' }} fullWidth>
              <InputLabel>{resources.ContentManagement.DictionaryChooseDomain}</InputLabel>
              <Select value={selectedDomain.DomainId ?? ''} onChange={selectHandler}>
                {domainList}
              </Select>
            </FormControl>
            <Filter
              value={filter}
              onChange={inputHandler}
              placeholder={resources.ContentManagement.PropertiesModalFilter}
            />
          </FiltersWrapper>
        </Header>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>{resources.ContentManagement.PropertiesExcelTemplateName}</TableCell>
              <TableCell>{resources.ContentManagement.PropertiesExcelTemplateDomain}</TableCell>
              <TableCell>{resources.ContentManagement.PropertiesExcelTemplateUnit}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{propertyList}</TableBody>
        </Table>
        <EmptySearchMessage
          currentDomain={selectedDomain}
          properties={properties}
          filter={filter}
        />
      </Wrapper>
    </InfiniteScroll>
  );
};

const Wrapper = styled.div({
  padding: '32px 64px',
});
const Header = styled.div({
  top: 0,
  paddingTop: '32px',
  position: 'sticky',
  zIndex: 1,
  backgroundColor: 'white',
});
const FiltersWrapper = styled.div({
  display: 'flex',
  flexFlow: 'row nowrap',
  width: '100%',
  alignItems: 'baseline',
  justifyContent: 'space-between',
});
const Title = styled.h3({
  marginBottom: 0,
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '20px',
  lineHeight: '24px',
  color: COLORS.N80,
});
const Filter = styled(Searchbar)({
  width: '100%',
  maxWidth: '100%',
});

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
});
export default connect(mapStateToProps)(Left);