import React from 'react';

import { colors, Icon, IIcon, TextField, Menu, space, Ellipsis } from '@bim-co/componentui-foundation';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { Set } from '../../../../Reducers/properties-sets/types';
import { PropertiesView } from './types';

import { setFilter as setFilterAction } from '../../../../Reducers/classifications/properties/actions';
import {
  selectFilter,
  selectSets,
  selectDomains,
} from '../../../../Reducers/classifications/properties/selectors';
import { Filter, PropertyDomain } from '../../../../Reducers/classifications/properties/types';
import { FlexWrapper } from './_shared/styles';
import {
  selectEnableSetsManagement,
  selectTranslatedResources,
} from '../../../../Reducers/app/selectors';

const getPropertiesOptionsRender = (props, icon: IIcon, view: PropertiesView) => (
  <PropertiesOptionsContainer apart>
    <PropertiesOptionLabelContainer>
      <PropertiesOptionIcon size="s" icon={icon} />
      <Ellipsis>{props?.label}</Ellipsis>
    </PropertiesOptionLabelContainer>
    {props?.value === view && <CheckIcon size="m" icon="check" />}
  </PropertiesOptionsContainer>
);

const getPropertiesOptions = (resources, view: PropertiesView) => [
  {
    id: 'attributes',
    renderContent: () =>
      getPropertiesOptionsRender(
        {
          label: resources.ClassificationDetails.Attributes,
          value: PropertiesView.Attributes,
        },
        'attribut',
        view
      ),
    value: PropertiesView.Attributes,
  },
  {
    id: 'subsets',
    renderContent: () =>
      getPropertiesOptionsRender(
        {
          label: resources.ClassificationDetails.Subsets,
          value: PropertiesView.Subsets,
        },
        'tag',
        view
      ),
    value: PropertiesView.Subsets,
  },
];

enum FilterType {
  Set,
  Domain,
  Reset,
}
const getSetsOptions = (sets: Set[]) =>
  sets.map((set) => ({
    id: `set-${set.Id}`,
    label: set.Name,
    value: set.Id,
    type: FilterType.Set,
  }));
const getDomainsOptions = (domains: PropertyDomain[]) =>
  domains.map((domain) => ({
    id: `domain-${domain.Id}`,
    label: domain.Name,
    value: domain.Id,
    type: FilterType.Domain,
  }));

const getFilterButtonText = (
  filter: Filter,
  sets: Set[],
  domains: PropertyDomain[],
  fallbackText: string
) => {
  if (filter.setId) {
    return sets.find((set) => set.Id === filter.setId)?.Name ?? fallbackText;
  }

  if (filter.domainId) {
    return domains.find((domain) => domain.Id === filter.domainId)?.Name ?? fallbackText;
  }

  return fallbackText;
};

const getFilterOptions = (
  sets: Set[],
  domains: PropertyDomain[],
  enableSets: boolean,
  resources: any
) => {
  const allOption = {
    id: 'all',
    label: resources.ClassificationDetails.AllProperties,
    type: FilterType.Reset,
  };
  const domainsOpion = {
    id: 'domains',
    label: resources.ClassificationDetails.Domains,
    value: 'domains',
    items: getDomainsOptions(domains),
  };

  if (enableSets && sets.length > 0) {
    const setsOption = {
      id: 'sets',
      label: resources.ClassificationDetails.Sets,
      value: 'sets',
      items: getSetsOptions(sets),
    };
    return [allOption, setsOption, domainsOpion];
  }

  return [allOption, domainsOpion];
};

type Props = {
  filter: Filter;
  setFilter: (x: Filter) => void;
  sets: Set[];
  domains: PropertyDomain[];
  view: PropertiesView;
  onViewChange: (view: PropertiesView) => void;
  enableSets: boolean;
  resources: any;
};

const PropertyFilters: React.FC<Props> = ({
  filter,
  setFilter,
  sets,
  domains,
  view,
  onViewChange,
  enableSets,
  resources,
}) => {
  const onTextChangedHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setFilter({ ...filter, text: event.target.value });
  };
  const onMenuChangedHandler = ({ value }) => {
    onViewChange(value as PropertiesView);
  };
  const onFilterChangedHandler = ({ type, value, label }) => {
    switch (type) {
      case FilterType.Domain:
        setFilter({ ...filter, setId: null, domainId: value });
        break;
      case FilterType.Set:
        setFilter({ ...filter, setId: value, domainId: null });
        break;
      case FilterType.Reset:
        setFilter({ ...filter, setId: null, domainId: null });
        break;
      default:
        break;
    }
  };

  return (
    <MainWrapper apart>
      <Menu
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        buttonText={getFilterButtonText(
          filter,
          sets,
          domains,
          resources.ClassificationDetails.AllProperties
        )}
        items={getFilterOptions(sets, domains, enableSets, resources)}
        onChange={onFilterChangedHandler}
      />
      <FlexWrapper>
        <FilterWrapper>
          <TextField
            value={filter.text}
            onChange={onTextChangedHandler}
            iconLeft="search"
            placeholder={resources.ClassificationDetails.Search}
            size="dense"
          />
        </FilterWrapper>
        {enableSets && (
          <Menu
            items={getPropertiesOptions(resources, view)}
            onChange={onMenuChangedHandler}
            size="dense"
            menuOptions={{ placement: 'bottom-end' }}
          />
        )}
      </FlexWrapper>
    </MainWrapper>
  );
};

const MainWrapper = styled(FlexWrapper)`
  margin-top: ${space[100]};
  margin-bottom: ${space[50]};
`;
const FilterWrapper = styled.div`
  margin-right: ${space[50]};
`;
const PropertiesOptionsContainer = styled(FlexWrapper)`
  width: 100%;
  margin: 0;
`;

const PropertiesOptionLabelContainer = styled(FlexWrapper)`
  max-width: calc(100% - ${space[200]});
`;

const PropertiesOptionIcon = styled(Icon)`
  min-width: ${space[100]};
  margin-right: ${space[75]};
`;

const CheckIcon = styled(Icon)`
  min-width: ${space[125]};
  margin-left: ${space[75]};
  color: ${colors.BC[100]};
`;

const mapStateToProps = createStructuredSelector({
  filter: selectFilter,
  sets: selectSets,
  domains: selectDomains,
  enableSets: selectEnableSetsManagement,
  resources: selectTranslatedResources,
});
const mapDispatchToProps = (dispatch) => ({
  setFilter: (filter: Filter) => dispatch(setFilterAction(filter)),
});
export default connect(mapStateToProps, mapDispatchToProps)(PropertyFilters);