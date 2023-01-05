/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React from 'react';
import { defaultTheme } from '@bim-co/componentui-foundation';

// material UI imports
import Tooltip from '@material-ui/core/Tooltip';

// material ui icons
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircle from '@material-ui/icons/CheckCircleOutline';

export default function PropertiesImportViewListInfo({ property, showCheck, resources }) {
  let errorText = '';
  if (property.IsGuidExists && property.IsNameExists) {
    errorText = `${resources.ManageClassifications.PropertiesTemplateNameErrorMessage}\n${resources.ManageClassifications.PropertiesTemplateGuidErrorMessage}`;
  } else if (property.IsGuidExists && !property.IsNameExists) {
    errorText = `${resources.ManageClassifications.PropertiesTemplateGuidErrorMessage}`;
  } else if (!property.IsGuidExists && property.IsNameExists) {
    errorText = `${resources.ManageClassifications.PropertiesTemplateNameErrorMessage}`;
  } else if (property.ErrorsList.length > 0) {
    property.ErrorsList.forEach((err) => {
      errorText === '' ? (errorText = err) : (errorText = `${errorText}\n${err}`);
    });
  }

  const tooltipErrorText = <div style={{ whiteSpace: 'pre-line' }}>{errorText}</div>;

  let info = showCheck ? <CheckCircle style={{ color: defaultTheme.primaryColor }} /> : null;

  if (!property.IsOk && (property.IsGuidExists || property.IsNameExists)) {
    info = (
      <Tooltip title={tooltipErrorText}>
        <ErrorIcon
          style={{
            color: '#C4C4C4',
            transform: 'rotate(180deg)',
          }}
        />
      </Tooltip>
    );
  } else if (!property.IsOk) {
    info = (
      <Tooltip title={tooltipErrorText}>
        <ErrorIcon style={{ color: '#e9485b' }} />
      </Tooltip>
    );
  }

  return <div>{info}</div>;
}