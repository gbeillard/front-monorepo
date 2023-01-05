import React from 'react';
import { Tag, ISize, space } from '@bim-co/componentui-foundation';
import styled from '@emotion/styled';

type LayoutType = 'inline' | 'column';

type Props = {
  chips: any;
  size?: ISize;
  max?: number;
  layout?: LayoutType;
  onDelete?: (chip: any) => void;
};

const ChipList: React.FunctionComponent<Props> = ({ chips, size, max, layout, onDelete }) => {
  if (chips === null || chips === undefined) {
    return null;
  }

  const chipList = chips.slice(0, max).map(
    (chip) =>
      chip && (
        <Tag.Primary key={chip.Id} size={size} onDelete={onDelete && (() => onDelete(chip))}>
          {chip.Name}
        </Tag.Primary>
      )
  );

  if (chips.length > max) {
    chipList.push(
      <Tag.Primary key="chip-count" size={size}>
        {`+${chips.length - max}`}
      </Tag.Primary>
    );
  }

  return <ListContainer layout={layout}>{chipList}</ListContainer>;
};

const ListContainer = styled.div<{ layout: LayoutType }>(
  ({ layout }) => `
    padding-right: ${space[25]};
    cursor: default;
    display: ${layout === 'inline' ? 'flex' : 'inherit'};
    flex-wrap: ${layout === 'inline' ? 'wrap' : 'inherit'};

    > * {
        display: inline-flex;
        max-width: 100%;
        margin: ${space[25]};
    }
`
);

export default ChipList;