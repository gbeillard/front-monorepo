import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { H2, Icon, Menu, space } from '@bim-co/componentui-foundation';
import { createStructuredSelector } from 'reselect';
import { useNavigate } from 'react-router-dom';
import { LanguageCode } from '../../../Reducers/app/types';
import { selectTranslatedResources } from '../../../Reducers/app/selectors';
import { setLanguage as setLanguageAction } from '../../../Reducers/classifications/actions';
import LanguagesMenu from '../../CommonsElements/LanguagesMenu';
import {
  selectLanguage,
  selectIsFetchingClassification,
} from '../../../Reducers/classifications/selectors';
import { FlexWrapper } from './Panel/_shared/styles';

enum MenuOption {
  Edit,
  Delete,
}

const getOptions = (resources: any, disableCriticalFeatures: boolean) => {
  const editOption = {
    id: '1',
    value: MenuOption.Edit,
    label: resources.ClassificationDetails.EditClassification,
    icon: 'settings',
  };

  if (disableCriticalFeatures) {
    return [editOption];
  }

  const deleteOption = {
    id: '2',
    value: MenuOption.Delete,
    label: resources.ClassificationDetails.DeleteClassification,
    icon: 'delete',
  };

  return [editOption, deleteOption];
};

type Props = {
  title: string;
  onEdit: () => void;
  onDelete: () => void;
  languageCode: LanguageCode;
  classificationLanguage: LanguageCode;
  setClassificationLanguage: (x: LanguageCode) => void;
  resources: any;
  isFetchingClassification: boolean;
  disableCriticalFeatures: boolean;
};

const Header: React.FC<Props> = ({
  title,
  onEdit,
  onDelete,
  languageCode,
  classificationLanguage,
  setClassificationLanguage,
  resources,
  isFetchingClassification,
  disableCriticalFeatures,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    setClassificationLanguage(languageCode);
  }, []);

  const onClickHandler = () => {
    const url = `/${languageCode}/manage-classifications/`;
    navigate(url);
  };

  const onMenuChange = (option) => {
    switch (option.value) {
      case MenuOption.Edit:
        onEdit();
        break;
      case MenuOption.Delete:
        onDelete();
        break;
      default:
        break;
    }
  };

  return (
    <MainWrapper apart>
      <FlexWrapper>
        <IconWrapper onClick={onClickHandler}>
          <Icon icon="arrow-left" size="l" />
        </IconWrapper>
        {!isFetchingClassification && <H2>{title}</H2>}
        <LanguageDropdownWrapper>
          <LanguagesMenu
            value={classificationLanguage}
            onChange={setClassificationLanguage}
            menuOptions={{ placement: 'bottom-end' }}
          />
        </LanguageDropdownWrapper>
      </FlexWrapper>
      <FlexWrapper>
        <Menu
          items={getOptions(resources, disableCriticalFeatures)}
          onChange={onMenuChange}
          menuOptions={{ placement: 'bottom-end' }}
        />
      </FlexWrapper>
    </MainWrapper>
  );
};

const MainWrapper = styled(FlexWrapper)`
  align-items: center;
`;
const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: ${space[50]};
`;
const LanguageDropdownWrapper = styled.div`
  margin-left: ${space[50]};
`;

const mapStateToProps = createStructuredSelector({
  classificationLanguage: selectLanguage,
  resources: selectTranslatedResources,
  isFetchingClassification: selectIsFetchingClassification,
});
const mapDispatchToProps = (dispatch) => ({
  setClassificationLanguage: (language) => dispatch(setLanguageAction(language)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Header);