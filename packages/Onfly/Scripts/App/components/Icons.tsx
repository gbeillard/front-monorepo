import React from 'react';
import styled from '@emotion/styled';
import { ISize, IVariant } from '@bim-co/componentui-foundation';
import SIZES from './sizes';

type Props = {
  svg: any;
  variant?: IVariant;
  size?: ISize;
  disabled?: boolean;
};

const getIconDimensions = (size?: ISize): string => {
  switch (size) {
    case 'dense':
      return SIZES.ICONS.DENSE;
    case 'default':
      return SIZES.ICONS.DEFAULT;
    case 'large':
      return SIZES.ICONS.LARGE;
    default:
      return SIZES.ICONS.DEFAULT;
  }
};

const StyledIcon = styled.div<Props>(({ svg, variant, size, disabled }) => {
  if (variant || disabled) {
    return {
      mask: `url(${svg}) no-repeat center`,
      maskSize: 'contain',
      width: getIconDimensions(size),
      height: getIconDimensions(size),
    };
  }

  return {
    backgroundImage: `url(${svg})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    width: getIconDimensions(size),
    height: getIconDimensions(size),
  };
});

export const Icon: React.FunctionComponent<Props> = ({
  svg,
  variant,
  size,
  disabled,
  ...otherProps
}) => {
  if (svg === null || svg === undefined) {
    return null;
  }

  return <StyledIcon svg={svg} variant={variant} size={size} disabled={disabled} {...otherProps} />;
};

export const StartIcon = styled(Icon)<Props>(() => ({
  marginRight: '8px',
}));

export const EndIcon = styled(Icon)<Props>(() => ({
  marginLeft: '8px',
}));