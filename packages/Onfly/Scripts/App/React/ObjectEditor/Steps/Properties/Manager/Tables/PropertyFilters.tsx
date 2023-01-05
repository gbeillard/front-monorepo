import React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';

import { space, IIcon, TextField, Menu, Icon, colors, Ellipsis} from '@bim-co/componentui-foundation';

import { FlexWrapper } from './_shared/styles';

import { Set } from '../../../../../../Reducers/properties-sets/types';
import { View, PropertiesView } from '../types';

import { Domain, Filter } from '../../../../../../Reducers/BimObject/Properties/types';

import {
  selectEnableSetsManagement,
  selectTranslatedResources,
} from '../../../../../../Reducers/app/selectors';

const MainWrapper = styled(FlexWrapper)`
  margin-bottom: ${space[50]};
`;
const FilterWrapper = styled.div`
  margin-right: ${space[50]};
`;

/* Menu - View Attribut/Subsets  */

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
          label: resources.ObjectPropertiesManager.Attributes,
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
          label: resources.ObjectPropertiesManager.Subsets,
          value: PropertiesView.Subsets,
        },
        'tag',
        view
      ),
    value: PropertiesView.Subsets,
  },
];

/* Menu - Filter Domains/Sets */

enum FilterType {
  Set,
  Domain,
  Reset,
}
const getSetsOptions = (sets: Set[]) =>
  sets?.map((set) => ({
    id: `set-${set.Id}`,
    label: set.Name,
    value: set.Id,
    type: FilterType.Set,
  }));
const getDomainsOptions = (domains: Domain[]) =>
  domains?.map((domain) => ({
    id: `domain-${domain.Id}`,
    label: domain.Name,
    value: domain.Id,
    type: FilterType.Domain,
  }));

const getFilterButtonText = (
  view: View,
  filter: Filter,
  sets: Set[],
  domains: Domain[],
  resources
) => {
  let fallbackText = resources.ObjectPropertiesManager.AllProperties;

  if (view === View.Sets) {
    fallbackText = resources.ObjectPropertiesManager.AllSets;
  }

  if (filter.setId) {
    return sets.find((set) => set.Id === filter.setId)?.Name ?? fallbackText;
  }

  if (filter.domainId) {
    return domains.find((domain) => domain.Id === filter.domainId)?.Name ?? fallbackText;
  }

  return fallbackText;
};

const getFilterOptions = (
  view: View,
  sets: Set[],
  domains: Domain[],
  enableSets: boolean,
  resources: any
) => {
  const allOption = {
    id: 'all',
    label:
      view === View.Sets
        ? resources.ObjectPropertiesManager.AllSets
        : resources.ObjectPropertiesManager.AllProperties,
    type: FilterType.Reset,
  };

  switch (view) {
    case View.Sets:
      if (!enableSets || sets?.length === 0) {
        return [allOption];
      }

      return [allOption, ...getSetsOptions(sets)];
    case View.Properties:
      if (domains?.length === 0) {
        return [allOption];
      }

      // eslint-disable-next-line no-case-declarations
      const domainsOption = {
        id: 'domains',
        label: resources.ObjectPropertiesManager.AllDomains,
        value: 'domains',
        items: getDomainsOptions(domains),
      };

      if (enableSets && sets?.length > 0) {
        const setsOption = {
          id: 'sets',
          label: resources.ObjectPropertiesManager.AllSets,
          value: 'sets',
          items: getSetsOptions(sets),
        };
        return [allOption, domainsOption, setsOption];
      }

      return [allOption, domainsOption];
    default:
      return [allOption];
  }
};

type Props = {
  resources: any;
  enableSets: boolean;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  sets?: Set[];
  domains?: Domain[];
  view: View;
  propertiesView: PropertiesView;
  onViewChange?: (view: PropertiesView) => void;
};

const PropertyFilters: React.FC<Props> = ({
  resources,
  enableSets,
  filter,
  setFilter,
  sets,
  domains,
  view,
  propertiesView,
  onViewChange,
}) => {
  const onTextChangedHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setFilter({ ...filter, text: event.target.value });
  };
  const onMenuChangedHandler = ({ value }) => {
    onViewChange && onViewChange(value as PropertiesView);
  };
  const onFilterChangedHandler = ({ type, value }) => {
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
        buttonText={getFilterButtonText(view, filter, sets, domains, resources)}
        items={getFilterOptions(view, sets, domains, enableSets, resources)}
        onChange={onFilterChangedHandler}
      />
      <FlexWrapper>
        <FilterWrapper>
          <TextField
            value={filter.text}
            onChange={onTextChangedHandler}
            iconLeft="search"
            placeholder={resources.ObjectPropertiesManager.Search}
            size="dense"
          />
        </FilterWrapper>
        {enableSets && view !== View.Sets && (
          <Menu
            items={getPropertiesOptions(resources, propertiesView)}
            onChange={onMenuChangedHandler}
            size="dense"
            menuOptions={{ placement: 'bottom-end' }}
          />
        )}
      </FlexWrapper>
    </MainWrapper>
  );
};

const mapStateToProps = createStructuredSelector({
  enableSets: selectEnableSetsManagement,
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(PropertyFilters);