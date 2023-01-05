import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Icon } from '@bim-co/componentui-foundation';
import { selectLanguageCode, selectTranslatedResources } from '../../../Reducers/app/selectors';
import MenuItem from '.';
import { RoutePaths } from '../RoutePaths';

type Props = {
  languageCode: string;
  resources: any;
};

const Spaces: React.FC<Props> = ({ languageCode, resources }) => (
  <MenuItem
    name={resources.Spaces.MenuItemLabel}
    link={`/${languageCode}/${RoutePaths.Spaces}`}
    icon={<Icon size="m" icon="space" />}
  />
);

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(Spaces);