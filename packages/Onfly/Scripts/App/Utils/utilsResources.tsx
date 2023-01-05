import React, { ReactElement } from 'react';

/**
 * @param {string} initialString Initial string
 * @param {string} subString String to be replace by the component
 * @param {string} component Component that replace the substring
 * @param {string} [typographyComponent] Component to use for unreplaced string
 */
export const replaceStringByComponent = (
  initialString: string,
  subString: string,
  component: ReactElement,
  TypographyComponent?: React.FC
) => {
  const subStringIndex = initialString?.indexOf(subString);

  if (subStringIndex > -1) {
    const stringLeft = initialString?.substring(0, subStringIndex);
    const stringRight = initialString?.substring(subStringIndex + subString?.length);

    // Use a typography component
    if (TypographyComponent) {
      return (
        <>
          {stringLeft && <TypographyComponent>{stringLeft}</TypographyComponent>}
          {component}
          {stringRight && <TypographyComponent>{stringRight}</TypographyComponent>}
        </>
      );
    }

    return (
      <>
        {stringLeft}
        {component}
        {stringRight}
      </>
    );
  }

  return initialString;
};