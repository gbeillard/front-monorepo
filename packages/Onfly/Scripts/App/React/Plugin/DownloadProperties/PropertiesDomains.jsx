import React from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Domain from './Domain.jsx';

const PropertiesDomainsLayout = ({ children }) => <div className="bim-properties">{children}</div>;

const innerTheme = createTheme({
  overrides: {
    MuiPopover: {
      root: {
        zIndex: '3001 !important',
      },
    },
    MuiSelect: {
      select: {
        padding: '7px 32px 7px 7px !important',
      },
    },
    MuiCheckbox: {
      root: {
        '&$checked': {
          color: '#1A83F7 !important',
        },
      },
    },
  },
});

const PropertiesDomains = ({
  SearchText,
  currentSelectedProperties,
  selectProperty,
  Domains,
  changePropertyNature,
}) => {
  if (!Array.isArray(Domains)) {
    return <PropertiesDomainsLayout />;
  }

  const domainsDisplayed = Domains.map((domain) => (
    <Domain
      value={domain}
      key={domain.Id}
      propKeyWord={SearchText}
      currentSelectedProperties={currentSelectedProperties}
      selectProperty={selectProperty}
      expand={Domains.length === 1}
      changePropertyNature={changePropertyNature}
    />
  ));

  return (
    <PropertiesDomainsLayout>
      <ThemeProvider theme={innerTheme}>{domainsDisplayed}</ThemeProvider>
    </PropertiesDomainsLayout>
  );
};

export default PropertiesDomains;