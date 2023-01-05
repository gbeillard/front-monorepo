import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';

import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import MuiTextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import { API_URL } from '../../../Api/constants';
import {
  selectTranslatedResources,
  selectLanguageCode,
  selectManagementCloudId,
  selectToken,
  selectLanguages,
  selectRole,
} from '../../../Reducers/app/selectors';
import {
  PropertyRequest,
  PropertyDetails,
  PropertyDetailsTranslation,
  Unit,
  Domain,
  Language,
  EditType,
  DataType,
  ParameterType,
  PropertyRequestResponse,
} from './definitions';
import { Nature } from '../../../Reducers/properties/constants';

type LanguageCode = 'pt' | 'pl' | 'en' | 'nl' | 'de' | 'es' | 'it' | 'fr';
type Props = {
  request: PropertyRequest;
  domains: Domain[];
  units: Unit[];
  editTypes: EditType[];
  dataTypes: DataType[];
  parameterTypes: ParameterType[];
  sendResponse: (x: PropertyRequestResponse) => void;
  languageCode: LanguageCode;
  languages: Language[];
  onflyId: number;
  token: string;
  resources: any;
  role: any;
};

const getTranslation = (
  details: PropertyDetails,
  languageCode: string
): PropertyDetailsTranslation => {
  let translation = details.Translations.find(
    (translation) => translation.IsDefaultTranslation === true
  );

  if (!translation) {
    translation = details.Translations.find(
      (translation) => translation.TranslationLangCode === languageCode
    );
  }

  if (!translation) {
    translation = details.Translations.find(
      (translation) => translation.TranslationLangCode === 'en'
    );
  }

  return translation;
};

const getLanguageName = (
  languageCode: string,
  languages: Language[],
  languageCodeTranslation: string
): string => {
  const language = languages.find((language) => language.LanguageCode === languageCode);
  if (!language) {
    return '';
  }

  return language.Translations[languageCodeTranslation];
};

const getDomainName = ({ PropertyDomainCode }: PropertyDetails, domains: Domain[]): string => {
  const domain = domains.find((domain) => domain.DomainId === PropertyDomainCode);
  if (!domain) {
    return '';
  }

  return domain.DomainName;
};

const getUnitName = ({ PropertyUnitCode }: PropertyDetails, units: Unit[]): string => {
  const unit = units.find((unit) => unit.Id === PropertyUnitCode);
  if (!unit) {
    return '';
  }

  return unit.Name;
};

const getEditType = ({ PropertyEditTypeCode }: PropertyDetails, editTypes: EditType[]): EditType =>
  editTypes.find((editType) => editType.Id === PropertyEditTypeCode);

const getDataTypeName = (
  { PropertyDataTypeCode }: PropertyDetails,
  dataTypes: DataType[]
): string => {
  const unit = dataTypes.find((dataType) => dataType.Id === PropertyDataTypeCode);
  if (!unit) {
    return '';
  }

  return unit.Name;
};

const getParameterTypeName = (
  { PropertyParameterType }: PropertyDetails,
  parameterTypes: ParameterType[]
): string => {
  const unit = parameterTypes.find((parameterType) => parameterType.Id === PropertyParameterType);
  if (!unit) {
    return '';
  }

  return unit.Name;
};

const getNatureName = (resources, nature: Nature): string => {
  switch (nature) {
    case Nature.INSTANCE:
      return resources.DownloadProperties.NatureInstanceLabel;
    case Nature.TYPE:
      return resources.DownloadProperties.NatureTypeLabel;
    default:
      return '';
  }
};

/* eslint-disable max-lines-per-function */
const Editor: React.FC<Props> = ({
  request,
  domains,
  units,
  editTypes,
  dataTypes,
  parameterTypes,
  sendResponse, // from parent
  languageCode,
  languages,
  onflyId,
  token,
  resources,
  role, // from mapStateToProps
}) => {
  const [details, setDetails] = useState<PropertyDetails>(null);
  const fetchRequestDetails = async (id: number) => {
    const response = await fetch(
      `${API_URL}/api/ws/v1/${languageCode}/contentmanagement/${onflyId}/property/request/${id}/details?token=${token}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    const json = await response.json();
    setDetails(json);
  };

  const onChangeResponse: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const RequestResponse = event.target.value;
    setDetails({ ...details, RequestResponse });
  };

  const onReject = () => {
    const response: PropertyRequestResponse = {
      RequestId: details.PropertyId,
      RequestStatus: 'rejected',
      RequestMessageResponse: details.RequestResponse,
    };
    sendResponse(response);
  };

  const onAccept = () => {
    const response: PropertyRequestResponse = {
      RequestId: details.PropertyId,
      RequestStatus: 'accepted',
      RequestMessageResponse: details.RequestResponse,
    };
    sendResponse(response);
  };

  useEffect(() => {
    fetchRequestDetails(request.Id);
  }, []);

  if (details === null) {
    return null;
  }

  const translation = getTranslation(details, languageCode);
  const language = getLanguageName(translation?.TranslationLangCode, languages, languageCode);
  const domainName = getDomainName(details, domains);
  const unitName = getUnitName(details, units);
  const editType = getEditType(details, editTypes);
  const dataTypeName = getDataTypeName(details, dataTypes);
  const parameterTypeName = getParameterTypeName(details, parameterTypes);
  const natureName = getNatureName(resources, details.Nature);
  const requestStatusIsSended = request.RequestStatus === 'sended';

  let availableEditTypeValues;

  if (editType?.IsMultiple === true) {
    availableEditTypeValues = (
      <TextField
        label={resources.UserPropertyPage.AvailableEditTypeValuesLabel}
        helperText={resources.UserPropertyPage.AvailableEditTypeValuesHelpText}
        multiline
        InputProps={{
          readOnly: true,
        }}
        InputLabelProps={{
          shrink: true,
        }}
        rows="2"
        margin="normal"
        fullWidth
        value={translation?.PropertyEditTypeValues}
      />
    );
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <DialogContent>
        <Content>
          <Typography variant="h5" style={{ marginBottom: '16px' }}>
            {resources.ContentManagement.PropertyRequestEditorTitle}
          </Typography>
          <TextField
            label={resources.UserPropertyPage.PropertyNameLabel}
            helperText={<HelperText>{resources.UserPropertyPage.PropertyNameHelpText}</HelperText>}
            value={translation.PropertyName}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label={resources.UserPropertyPage.PropertyDescriptionLabel}
            helperText={
              <HelperText>{resources.UserPropertyPage.PropertyDescriptionHelpText}</HelperText>
            }
            value={translation.PropertyDescription}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label={resources.UserPropertyPage.SelectLanguageLabel}
            helperText={<HelperText>{resources.UserPropertyPage.LanguageHelpText}</HelperText>}
            value={language}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControlLabel
            label={<HelperText>{resources.UserPropertyPage.IsDefaultTranslation}</HelperText>}
            labelPlacement="end"
            control={
              <Checkbox
                checked={translation.IsDefaultTranslation}
                checkedIcon={<CheckCircleIcon />}
                icon={<RadioButtonUncheckedIcon />}
                disableRipple={request.RequestStatus !== 'sended'}
              />
            }
          />
          <TextField
            label={resources.UserPropertyPage.PropertyDomainLabel}
            helperText={
              <HelperText>{resources.UserPropertyPage.PropertyDomainHelpText}</HelperText>
            }
            value={domainName}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label={resources.UserPropertyPage.PropertyUnitLabel}
            helperText={<HelperText>{resources.UserPropertyPage.PropertyUnitHelpText}</HelperText>}
            value={unitName}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label={resources.UserPropertyPage.DataTypeLabel}
            helperText={<HelperText>{resources.UserPropertyPage.DataTypeHelpText}</HelperText>}
            value={dataTypeName}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label={resources.UserPropertyPage.PropertyEditTypeLabel}
            helperText={
              <HelperText>{resources.UserPropertyPage.PropertyEditTypeHelpText}</HelperText>
            }
            value={editType?.Name}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          {availableEditTypeValues}

          <TextField
            label={resources.UserPropertyPage.PropertyParameterTypeLabel}
            helperText={
              <HelperText>{resources.UserPropertyPage.PropertyParameterTypeHelpText}</HelperText>
            }
            value={parameterTypeName}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label={resources.UserPropertyPage.InformationLabel}
            helperText={<HelperText>{resources.UserPropertyPage.InformationHelpText}</HelperText>}
            value={translation.PropertyInformations}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label={resources.DownloadProperties.PropertyNatureLabel}
            value={natureName}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label={resources.ContentManagement.PropertyRequestComment}
            multiline
            value={details.RequestComment}
            rows={4}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {(role.key === 'admin' || !requestStatusIsSended) && (
            <TextField
              label={resources.ContentManagement.PropertyRequestResponse}
              multiline
              value={details.RequestResponse}
              onChange={onChangeResponse}
              rows={4}
              InputProps={{
                readOnly: !requestStatusIsSended,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
          {role.key === 'admin' && requestStatusIsSended && (
            <Actions>
              <Button variant="contained" onClick={onReject} disabled={!requestStatusIsSended}>
                {resources.ContentManagement.PropertyRequestRejectButtonLabel}
              </Button>
              <ConfirmButton
                color="primary"
                variant="contained"
                onClick={onAccept}
                disabled={!requestStatusIsSended}
              >
                {resources.MetaResource.Confirm}
              </ConfirmButton>
            </Actions>
          )}
        </Content>
      </DialogContent>
    </ThemeProvider>
  );
};

const defaultTheme = createTheme({
  palette: {
    primary: {
      light: '#88dbf4',
      main: '#06baec',
      dark: '#00aad9',
      contrastText: '#fff',
    },
    secondary: {
      light: '#e2e4e5',
      main: '#a4a4a4',
      dark: '#676767',
      contrastText: '#fff',
    },
    text: {
      primary: 'rgba(33,33,33,.9)',
      secondary: '#676767',
      disabled: '#e2e4e5',
      hint: '#e2e4e5',
    },
  },
});
const Content = styled.div({
  display: 'flex',
  flexFlow: 'column nowrap',
  width: '100%',
  padding: '8px',
});
const Actions = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '16px 0',
});

const TextField = withStyles({
  root: {
    marginTop: '8px',
    marginBottom: '8px',
  },
})(MuiTextField);

const HelperText = styled.span({
  fontSize: '.75rem',
});
const ConfirmButton = withStyles({
  root: {
    marginLeft: '8px',
  },
})(Button);

const mapStateToProps = createStructuredSelector({
  resources: selectTranslatedResources,
  languageCode: selectLanguageCode,
  languages: selectLanguages,
  onflyId: selectManagementCloudId,
  token: selectToken,
  role: selectRole,
});

export default connect(mapStateToProps)(Editor);