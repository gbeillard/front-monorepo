import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

import { Button, TextField, space } from '@bim-co/componentui-foundation';
import PropertiesPickerModal from '../../CommonsElements/PropertiesPicker/PropertiesPickerModal';

import { Set } from '../../../Reducers/properties-sets/types';
import { Property } from '../../../Reducers/Sets/Properties/types';
import { View } from '../../Classifications/Details/Panel/types';

type Props = {
  resources: any;
  languageCode: string;
  set: Set;
  properties: Property[];
  fetchPropertiesIsSuccess: boolean;
  setFilterSearch: (search: string) => void;
  addProperties: (setId: number, properties: Property[]) => void;
};

const FlexContainer = styled.div`
  display: flex;
`;

const Container = styled(FlexContainer)`
  justify-content: space-between;
  margin-bottom: ${space[100]};
  padding-top: ${space[125]};
`;

const SearchBarContainer = styled.div`
  width: ${space[2000]};
  margin: 0 ${space[50]};
`;

const Header: React.FunctionComponent<Props> = ({
  resources,
  languageCode,
  set,
  properties,
  fetchPropertiesIsSuccess,
  setFilterSearch,
  addProperties,
}) => {
  const [propertiesModalIsOpen, setPropertiesModalIsOpen] = useState(false);
  const [view, setView] = useState(View.Properties);

  let timeoutId = null;
  const nbProperties = properties?.length;
  const showSearchBar = fetchPropertiesIsSuccess && nbProperties > 0; // The set has properties

  const handleSearchProperties = (event) => {
    const search = event.currentTarget.value;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => setFilterSearch(search), 500);
  };

  const handleOnConfirmPropertiesModal = ({ properties }) => {
    if (properties?.length > 0) {
      addProperties(set?.Id, properties);
    }

    setPropertiesModalIsOpen(false);
  };

  return (
    <>
      <Container>
        {/* Left */}
        <FlexContainer>
          <Link to={`/${languageCode}/dictionary/sets`}>
            <Button icon="arrow-left" />
          </Link>
          {showSearchBar && (
            <SearchBarContainer>
              <TextField
                iconLeft="search"
                placeholder={resources.ContentManagementDictionary.Search}
                onChange={(event) => handleSearchProperties(event)}
              />
            </SearchBarContainer>
          )}
        </FlexContainer>

        {/* Right */}
        <FlexContainer>
          <Button
            variant="primary"
            icon="create"
            onClick={() => setPropertiesModalIsOpen(true)}
            isDisabled={set?.IsPublic}
          >
            {resources.ContentManagement.AddProperties}
          </Button>
        </FlexContainer>
      </Container>
      <PropertiesPickerModal
        isDisplayed={propertiesModalIsOpen}
        onCancel={() => setPropertiesModalIsOpen(false)}
        onConfirm={handleOnConfirmPropertiesModal}
        view={view}
        setView={setView}
        enableSets={false}
        existingElements={{ properties }}
      />
    </>
  );
};

export default Header;