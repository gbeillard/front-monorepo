import React from 'react';
import styled from '@emotion/styled';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Select, Label, space, defaultTheme } from '@bim-co/componentui-foundation';
import { ObjectVariant } from '../../../../../Reducers/BimObject/Variants/types';
import { selectTranslatedResources } from '../../../../../Reducers/app/selectors';
import { selectVariants } from '../../../../../Reducers/BimObject/Variants/selectors';

type Props = {
  values: ObjectVariant[];
  onChange: (x: ObjectVariant[]) => void;
  variants: ObjectVariant[];
  resources: any;
};

const VariantsMultiSelect: React.FC<Props> = ({ values, onChange, variants, resources }) => (
  <>
    <StyledLabel>{resources.DocumentsDialog.LabelDocumentReference}</StyledLabel>
    <Select
      placeholder={resources.DocumentsDialog.PlaceholderDocumentReference}
      value={values}
      onChange={onChange}
      options={(variants as any).asMutable()}
      getOptionValue={(variant: ObjectVariant) => variant.Id}
      getOptionLabel={(variant: ObjectVariant) => variant.Name}
      isMulti
    />
  </>
);

const mapStateToProps = createStructuredSelector({
  variants: selectVariants,
  resources: selectTranslatedResources,
});

const StyledLabel = styled(Label)`
  margin-bottom: ${space[50]};
  font-weight: ${defaultTheme.boldWeight};
`;

export default connect(mapStateToProps)(VariantsMultiSelect);