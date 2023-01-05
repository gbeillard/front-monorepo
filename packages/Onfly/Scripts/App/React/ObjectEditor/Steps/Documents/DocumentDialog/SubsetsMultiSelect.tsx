import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';
import {
  Label,
  Dropdown,
  getColorNameFromId,
  IClassificationColor,
  space,
  defaultTheme,
} from '@bim-co/componentui-foundation';
import { DocumentSubsets } from '../../../../../Reducers/BimObject/Documents/types';
import { selectTranslatedResources } from '../../../../../Reducers/app/selectors';
import { selectAllSubsetsForDisplaySorted } from '../../../../../Reducers/Sets/Subsets/selectors';

type Props = {
  values: DocumentSubsets[];
  onChange: (x: DocumentSubsets[]) => void;
  resources: any;
  subsets: DocumentSubsets[];
};

type Option = {
  value: number;
  label: string;
  color?: IClassificationColor;
};

const getLabel = (subset: DocumentSubsets) =>
  !subset?.IsDefault && subset?.Name !== ''
    ? `${subset.Set.Name} - ${subset.Name}`
    : subset.Set.Name;

const mapSubsetsToOptions = (subsets: DocumentSubsets[]): Option[] =>
  subsets.map((subset) => ({
    value: subset.Id,
    label: getLabel(subset),
    color: getColorNameFromId(subset.Id),
  }));

const mapOptionsToSubsets = (options: Option[], subsets: DocumentSubsets[]): DocumentSubsets[] =>
  options?.map((option) => subsets?.find((subset) => subset.Id === option.value));

const SubsetsMultiSelect: React.FC<Props> = ({ values, onChange, resources, subsets }) => {
  const handleChange = useCallback(
    (options: Option[]) => {
      const selectedSubsets = options != null ? mapOptionsToSubsets(options, subsets) : [];
      onChange(selectedSubsets);
    },
    [subsets, onChange]
  );

  const mappedValues = mapSubsetsToOptions(values);
  const mappedOptions = mapSubsetsToOptions(subsets);

  return (
    <>
      <StyledLabel>{resources.ContentManagement.Subset}</StyledLabel>
      <Dropdown
        placeholder={resources.ContentManagement.SearchSubset}
        value={mappedValues}
        onChange={handleChange}
        options={mappedOptions}
        hasOptionTags
        isMulti
      />
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  subsets: selectAllSubsetsForDisplaySorted,
  resources: selectTranslatedResources,
});

const StyledLabel = styled(Label)`
  margin-bottom: ${space[50]};
  font-weight: ${defaultTheme.boldWeight};
`;

export default connect(mapStateToProps)(SubsetsMultiSelect);