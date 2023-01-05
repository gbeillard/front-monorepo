/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tag,
  Button,
  TextField,
  Menu,
  space,
  getColorNameFromId,
} from '@bim-co/componentui-foundation';

import { Set } from '../../../../Reducers/properties-sets/types';
import { Subset } from '../../../../Reducers/Sets/Subsets/types';

import { setFilter as setFilterAction } from '../../../../Reducers/classifications/subsets/actions';
import {
  selectFilteredSubsets,
  selectFilter,
  selectSets,
} from '../../../../Reducers/classifications/subsets/selectors';
import { Filter } from '../../../../Reducers/classifications/subsets/types';
import { FlexWrapper } from './_shared/styles';
import { selectTranslatedResources } from '../../../../Reducers/app/selectors';

const FiltersWrapper = styled(FlexWrapper)`
  margin-top: ${space[100]};
  margin-bottom: ${space[50]};
`;

type Props = {
  subsets: Subset[];
  sets: Set[];
  filter: Filter;
  disableCriticalFeatures: boolean;
  resources: any;
  setFilter: (x: Filter) => void;
  onDelete: (x: Subset) => void;
};

const defaultOption = (label) => ({
  label,
  value: null,
});
const mapSetsToOptions = (sets: Set[], defaultText: string) => {
  const mappedSets = sets.map((set) => ({
    id: set.Id,
    label: set.Name,
    value: set.Id,
  }));
  return [defaultOption(defaultText), ...mappedSets];
};
const getSetsButtonText = (sets: Set[], setId: number, fallbackText: string) =>
  sets.find((set) => set.Id === setId)?.Name ?? fallbackText;

const SubsetsTable: React.FC<Props> = ({
  subsets,
  sets,
  filter,
  disableCriticalFeatures,
  resources,
  setFilter,
  onDelete,
}) => {
  const onTextChangedHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setFilter({ ...filter, text: event.target.value });
  };
  const onSetChangedHandler = (option) => {
    setFilter({ ...filter, setId: option.value });
  };

  return (
    <>
      <FiltersWrapper apart>
        <Menu
          items={mapSetsToOptions(sets, resources.ClassificationDetails.AllSets)}
          buttonText={getSetsButtonText(
            sets,
            filter.setId,
            resources.ClassificationDetails.AllSets
          )}
          onChange={onSetChangedHandler}
        />
        <div>
          <TextField
            value={filter.text}
            onChange={onTextChangedHandler}
            iconLeft="search"
            placeholder={resources.ClassificationDetails.Search}
            size="dense"
          />
        </div>
      </FiltersWrapper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{resources.ClassificationDetails.NameColumn}</TableCell>
            <TableCell>{resources.ClassificationDetails.Subsets}</TableCell>
            <TableCell width={space[250]} />
          </TableRow>
        </TableHead>
        <TableBody>
          {subsets && Array.isArray(subsets)
            ? subsets.map((subset) => (
              <TableRow key={subset.Id} hover>
                <TableCell>{subset.Set.Name}</TableCell>
                <TableCell>
                  {!subset.IsDefault && (
                    <Tag.ColorTag color={getColorNameFromId(subset.Id)}>
                      {subset.Name}
                    </Tag.ColorTag>
                  )}
                </TableCell>
                <TableCell width={space[250]}>
                  <Button
                    size="dense"
                    variant="alternative"
                    icon="remove"
                    onClick={() => onDelete(subset)}
                    disabled={disableCriticalFeatures}
                  />
                </TableCell>
              </TableRow>
            ))
            : 'no properties to map!'}
        </TableBody>
      </Table>
    </>
  );
};
const mapStateToProps = createStructuredSelector({
  subsets: selectFilteredSubsets,
  sets: selectSets,
  filter: selectFilter,
  resources: selectTranslatedResources,
});
const mapDispatchToProps = (dispatch: any) => ({
  setFilter: (filter: Filter) => dispatch(setFilterAction(filter)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SubsetsTable);