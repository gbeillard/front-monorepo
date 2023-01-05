/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prefer-es6-class */
import React from 'react';
import createReactClass from 'create-react-class';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import _ from 'underscore';
import toastr from 'toastr';
import { Button, defaultTheme } from '@bim-co/componentui-foundation';
import Tooltip from '@material-ui/core/Tooltip';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import MuiLockIcon from '@material-ui/icons/Lock';
import styled from '@emotion/styled';
import { PropertyRevisionModal } from './Steps/Properties/PropertyRevisionModal';
import EditorStepOne from './Steps/Information/EditorInformation';
import EditorStepPhotos from './Steps/EditorStepPhotos';
import EditorStepClassifications from './Steps/Classification/EditorStepClassifications';
import EditorStepProperties from './Steps/Properties/EditorStepProperties';
import EditorStepModels from './Steps/EditorStepModels';
import EditorStepDocuments from './Steps/Documents';
import EditorStepPublication from './Steps/EditorStepPublication';
import { PropertiesStepButtons } from './Steps/Properties/PropertiesStepButtons';
import { redirectOptions } from './Steps/Properties/utils/redirectOptions';

import store from '../../Store/Store';
import { API_URL } from '../../Api/constants';
import { withRouter } from '../../Utils/withRouter';
import { retrieveUrl } from './Steps/Properties/utils/retrieveUrl';

const StepsContainer = styled.div({
  position: 'relative',
  textAlign: 'center',
  margin: '20px 0',
});

const StepsConnector = styled.div({
  position: 'absolute',
  top: '20px',
  left: 0,
  width: '100%',
  height: '10px',
  borderTop: '2px dotted #e2e4e5',
});

const linkStyle = {
  display: 'inline-block',
  position: ' relative',
  width: '12%',
  verticalAlign: 'top',
  color: '#333 !important',
  cursor: 'pointer',
  '&:hover, &:focus': {
    color: `${defaultTheme.primaryColor} !important`,
    textDecoration: 'none',
    p: {
      fontWeight: 500,
    },
  },
  '@media (max-width: 768px)': {
    width: '10%',
  },
};

const StepLink = styled(Link)(linkStyle);

const Step = styled.div(linkStyle);

const StepNumber = styled.span({
  display: 'inline-block',
  width: '40px',
  height: '40px',
  marginBottom: '10px',
  border: '1px solid transparent',
  borderRadius: '50%',
  backgroundColor: '#fff',
  fontSize: '22px',
  lineHeight: ' 40px',
  '&.current': {
    backgroundColor: defaultTheme.textColorOnSecondary,
    color: '#fff',
  },
});

const StepTitle = styled.p({
  color: '#333 !important',
  fontSize: '15px !important',
  lineHeight: '16px !important',
  textDecoration: 'none',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  '&.current': {
    fontWeight: 500,
  },
  '@media (max-width: 992px)': {
    fontSize: '14px !important',
  },
  '@media (max-width: 768px)': {
    visibility: 'hidden',
  },
});

const InfoIconStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  display: 'flex',
  width: '40px',
  height: '40px',
  border: '2px dotted #e2e4e5',
  borderRadius: '30px',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#ededed',
  color: defaultTheme.textColorTertiary,
  '&:hover': {
    color: `${defaultTheme.textColorOnSecondary} !important`,
  },
};

const IconButton = styled.button(InfoIconStyle);

const StepIconButton = styled(Link)(InfoIconStyle);

const Overlay = styled.div({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  borderRadius: '8px',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1999,
  h2: {
    color: '#fff !important',
    fontSize: '30px !important',
  },
});

const LockIcon = styled(MuiLockIcon)({
  color: ' #fff',
  fontSize: '100px !important',
});

const ButtonNextPrevContainer = styled.div({
  display: 'flex',
  marginBottom: '80px',
  justifyContent: 'center',
  'a:hover, a:focus': {
    textDecoration: 'none',
  },
  button: {
    margin: '0 20px',
  },
});

const EditorContent = styled.div({
  position: 'relative',
  minHeight: '150px',
  borderRadius: '8px',
});

const Editor = createReactClass({
  getInitialState() {
    return {
      permissions: null,
      bimobjectId: null,
      companiesAuthorization: [],
      manufacturersAuthorization: [],
      initialData: null,
      isRevisionModalOpen: false,
      redirectOption: null,
      shouldOpenRevisionModal: false,
    };
  },

  componentDidMount() {
    this.setState({ bimobjectId: this.props.params.bimobjectId });
    this.getUserPermissions();
    if (this.props.params.bimobjectId != null) {
      this.getBimObjectInformations();
    } else {
      store.dispatch({
        type: 'SET_TITLE_PAGE',
        data: this.props.resources.ContentManagement.MenuItemCreateNewObject,
      });
    }
  },

  componentDidUpdate() {
    if (this.props.params.bimobjectId != this.state.bimobjectId) {
      this.state.bimobjectId = this.props.params.bimobjectId;
      if (this.props.params.bimobjectId != null) {
        this.getBimObjectInformations();
      }
      this.getUserPermissions();
    }
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.Language != nextProps.Language) {
      if (this.props.params.bimobjectId != null) {
        if (this.state.initialData != null) {
          store.dispatch({
            type: 'SET_TITLE_PAGE',
            data: `${nextProps.resources.EditionPages.MainBimObjectTitle} : ${this.state.initialData.Name}`,
          });
        }
      } else {
        store.dispatch({
          type: 'SET_TITLE_PAGE',
          data: nextProps.resources.ContentManagement.MenuItemCreateNewObject,
        });
      }
    }
  },

  getBimObjectInformations() {
    const self = this;
    fetch(
      `${API_URL}/api/ws/v1/bimobject/${this.props.params.bimobjectId}/informations/${this.props.params.language}?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ GeneralInformations: true }),
      }
    )
      .then((response) => response.json())
      .then((json) => {
        self.setState({ initialData: json });
        store.dispatch({
          type: 'SET_TITLE_PAGE',
          data: `${self.props.resources.EditionPages.MainBimObjectTitle} : ${json.Name}`,
        });
      });
  },

  getUserPermissions() {
    const self = this;

    let objectId = this.props.params.bimobjectId;
    if (objectId == null) {
      objectId = 0;
    }

    fetch(
      `${API_URL}/api/ws/v1/informations/${this.props.params.language}/user/bimobject/${objectId}?token=${this.props.TemporaryToken}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        const permissions = [];
        for (const i in json.Permissions) {
          permissions[json.Permissions[i].ActionZone] = json.Permissions[i].Authorized;
        }
        self.setState({
          permissions,
          companiesAuthorization: json.Companies,
          manufacturersAuthorization: json.Manufacturers,
        });
        store.dispatch({ type: 'LOADER', state: false });
      });
  },

  displayWariningCreateObject() {
    toastr.options = {
      "preventDuplicates": true,
      "preventOpenDuplicates": true
    };
    toastr.warning(this.props.resources.EditionPage.NameRequiredBeforeNextStep);
  },

  isPropertyStep() {
    return this.props.contextEditor === 'properties';
  },

  render() {
    let contentEditor = '';
    let currentInfo = '';
    let currentPhoto = '';
    let currentClassif = '';
    let currentProps = '';
    let currentModels = '';
    let currentDocs = '';
    let currentPublish = '';
    let stepButtons = null;
    let isNotAuthorize = false;
    const isEnableDictionnary = this.props.Settings?.EnableDictionary;

    const handleShouldOpenRevisionModal = () => {
      this.setState({ shouldOpenRevisionModal: true });
    };

    const handleOpenRevisionModal = (redirectOption) => {
      if (!this.state.shouldOpenRevisionModal) {
        this.props.navigate(
          retrieveUrl(redirectOption, this.props.Language, this.props.params.bimobjectId)
        );
        this.setState({ shouldOpenRevisionModal: false });
      } else {
        this.setState({
          isRevisionModalOpen: true,
          redirectOption,
          shouldOpenRevisionModal: false,
        });
      }
    };

    const handleCloseRevisionModal = () => {
      this.setState({ isRevisionModalOpen: false });
    };

    // verify permissions
    if (this.state.permissions != null) {
      const keys = _.keys(this.state.permissions);
      let one_permission = false;
      for (const key in keys) {
        if (this.state.permissions[keys[key]]) {
          one_permission = true;
        }
      }

      if (!one_permission) {
        return (
          <EditorContent>
            <Overlay>
              <LockIcon />
              <h2>{this.props.resources.BimObjectAccessAuthorizeAttribute.NoAuthorize}</h2>
            </Overlay>
          </EditorContent>
        );
      }
    }

    if (this.props.contextEditor == 'create' && this.state.permissions != null) {
      contentEditor = (
        <EditorStepOne
          bimObjectId={null}
          permissions={this.state.permissions}
          companiesAuthorization={this.state.companiesAuthorization}
          manufacturersAuthorization={this.state.manufacturersAuthorization}
          initialData={null}
          refreshInformation={this.getBimObjectInformations}
        />
      );
      currentInfo = 'current';
    } else if (
      this.props.contextEditor === 'informations' &&
      this.state.permissions != null &&
      (this.state.initialData != null || this.props.params.bimobjectId == null)
    ) {
      contentEditor = (
        <EditorStepOne
          bimObjectId={this.props.params.bimobjectId}
          permissions={this.state.permissions}
          companiesAuthorization={this.state.companiesAuthorization}
          manufacturersAuthorization={this.state.manufacturersAuthorization}
          initialData={this.state.initialData}
          refreshInformation={this.getBimObjectInformations}
        />
      );
      currentInfo = 'current';
      stepButtons = (
        <Link
          to={`/${this.props.params.language}/bimobject/${this.props.params.bimobjectId}/edit/photos`}
        >
          <NextButton resources={this.props.resources} />
        </Link>
      );
    } else if (this.props.contextEditor === 'photos' && this.state.permissions != null) {
      contentEditor = (
        <EditorStepPhotos
          bimObjectId={this.props.params.bimobjectId}
          permissions={this.state.permissions}
        />
      );
      currentPhoto = 'current';
      stepButtons = (
        <>
          <Link
            to={`/${this.props.params.language}/bimobject/${this.props.params.bimobjectId}/edit/informations`}
          >
            <PrevButton resources={this.props.resources} />
          </Link>
          <Link
            to={`/${this.props.params.language}/bimobject/${this.props.params.bimobjectId}/edit/classifications`}
          >
            <NextButton resources={this.props.resources} />
          </Link>
        </>
      );
    } else if (this.props.contextEditor === 'classifications' && this.state.permissions != null) {
      contentEditor = (
        <EditorStepClassifications
          bimObjectId={this.props.params.bimobjectId}
          permissions={this.state.permissions}
        />
      );
      currentClassif = 'current';
      stepButtons = (
        <>
          <Link
            to={`/${this.props.params.language}/bimobject/${this.props.params.bimobjectId}/edit/photos`}
          >
            <PrevButton resources={this.props.resources} />
          </Link>
          <Link
            to={`/${this.props.params.language}/bimobject/${this.props.params.bimobjectId}/edit/properties`}
          >
            <NextButton resources={this.props.resources} />
          </Link>
        </>
      );
    } else if (
      this.props.contextEditor === 'properties' &&
      this.state.permissions != null &&
      this.state.initialData != null
    ) {
      contentEditor = (
        <EditorStepProperties
          bimObjectId={this.props.params.bimobjectId}
          permissions={this.state.permissions}
          initialData={this.state.initialData}
          Settings={this.props.Settings}
          isRevisionModalOpen={this.state.isRevisionModalOpen}
          OpenRevisionModal={handleOpenRevisionModal}
          handleShouldOpenRevisionModal={handleShouldOpenRevisionModal}
        />
      );
      currentProps = 'current';
      isNotAuthorize = !isEnableDictionnary;
      stepButtons = (
        <PropertiesStepButtons
          resources={this.props.resources}
          handleOpenRevisionModal={handleOpenRevisionModal}
        />
      );
    } else if (this.props.contextEditor === 'models' && this.state.permissions != null) {
      contentEditor = (
        <EditorStepModels
          bimObjectId={this.props.params.bimobjectId}
          permissions={this.state.permissions}
        />
      );
      currentModels = 'current';
      isNotAuthorize = !isEnableDictionnary;
      stepButtons = (
        <>
          <Link
            to={`/${this.props.params.language}/bimobject/${this.props.params.bimobjectId}/edit/properties`}
          >
            <PrevButton resources={this.props.resources} />
          </Link>
          <Link
            to={`/${this.props.params.language}/bimobject/${this.props.params.bimobjectId}/edit/documents`}
          >
            <NextButton resources={this.props.resources} />
          </Link>
        </>
      );
    } else if (this.props.contextEditor === 'documents' && this.state.permissions != null) {
      isNotAuthorize = !this.state.permissions.bimobject_documents || !isEnableDictionnary;
      contentEditor = <EditorStepDocuments bimObjectId={this.props.params.bimobjectId} />;

      currentDocs = 'current';
      stepButtons = (
        <>
          <Link
            className="pull-right"
            to={`/${this.props.params.language}/bimobject/${this.props.params.bimobjectId}/edit/models`}
          >
            <PrevButton resources={this.props.resources} />
          </Link>
          <Link
            to={`/${this.props.params.language}/bimobject/${this.props.params.bimobjectId}/edit/publication`}
          >
            <NextButton resources={this.props.resources} />
          </Link>
        </>
      );
    } else if (
      this.props.contextEditor === 'publication' &&
      this.state.permissions != null &&
      this.state.initialData != null
    ) {
      contentEditor = (
        <EditorStepPublication
          initialData={this.state.initialData}
          bimObjectId={this.props.params.bimobjectId}
          permissions={this.state.permissions}
          shouldOpenRevisionModal={this.state.shouldOpenRevisionModal}
          handleOpenRevisionModal={handleOpenRevisionModal}
        />
      );
      currentPublish = 'current';
      stepButtons = (
        <Link
          to={`/${this.props.params.language}/bimobject/${this.props.params.bimobjectId}/edit/documents`}
        >
          <PrevButton resources={this.props.resources} />
        </Link>
      );
    }

    let stepWizard;

    if (this.props.params.bimobjectId != null) {
      stepWizard = (
        <>
          <StepLink
            id="step_info"
            to={`/${this.props.params.language}/bimobject/${this.props.params.bimobjectId}/edit/informations`}
          >
            <StepNumber className={currentInfo}>1</StepNumber>
            <StepTitle className={currentInfo}>
              {this.props.resources.EditionPagesWizard.Infos}
            </StepTitle>
          </StepLink>
          <StepLink
            id="step_photos"
            to={`/${this.props.params.language}/bimobject/${this.props.params.bimobjectId}/edit/photos`}
          >
            <StepNumber className={currentPhoto}>2</StepNumber>
            <StepTitle className={currentPhoto}>
              {this.props.resources.EditionPagesWizard.Photos}
            </StepTitle>
          </StepLink>
          <StepLink
            id="step_classifications"
            to={`/${this.props.params.language}/bimobject/${this.props.params.bimobjectId}/edit/classifications`}
          >
            <StepNumber className={currentClassif}>3</StepNumber>
            <StepTitle className={currentClassif}>
              {this.props.resources.EditionPagesWizard.Classifications}
            </StepTitle>
          </StepLink>
          <StepLink
            id="step_properties"
            to={`/${this.props.params.language}/bimobject/${this.props.params.bimobjectId}/edit/properties`}
          >
            <StepNumber className={currentProps}>4</StepNumber>
            <StepTitle className={currentProps}>
              {this.props.resources.EditionPagesWizard.Properties}
            </StepTitle>
          </StepLink>
          <StepLink
            id="step_models"
            to={`/${this.props.params.language}/bimobject/${this.props.params.bimobjectId}/edit/models`}
          >
            <StepNumber className={currentModels}>5</StepNumber>
            <StepTitle className={currentModels}>
              {this.props.resources.EditionPagesWizard['3DModels']}
            </StepTitle>
          </StepLink>
          <StepLink
            id="step_documents"
            to={`/${this.props.params.language}/bimobject/${this.props.params.bimobjectId}/edit/documents`}
          >
            <StepNumber className={currentDocs}>6</StepNumber>
            <StepTitle className={currentDocs}>
              {this.props.resources.EditionPagesWizard.Documents}
            </StepTitle>
          </StepLink>
          <StepLink
            id="step_publication"
            to={`/${this.props.params.language}/bimobject/${this.props.params.bimobjectId}/edit/publication`}
          >
            <StepNumber className={currentPublish}>7</StepNumber>
            <StepTitle className={currentPublish}>
              {this.props.resources.EditionPagesWizard.Publications}
            </StepTitle>
          </StepLink>

          <Tooltip title={this.props.resources.EditionPagesWizard.ViewObjectToolTip}>
            {!this.isPropertyStep() ? (
              <StepIconButton
                to={`/${this.props.params.language}/bimobject/${this.props.params.bimobjectId}/details`}
              >
                <RemoveRedEyeIcon />
              </StepIconButton>
            ) : (
              <IconButton onClick={() => handleOpenRevisionModal(redirectOptions.Detail)}>
                <RemoveRedEyeIcon />
              </IconButton>
            )}
          </Tooltip>
        </>
      );
    } else {
      stepWizard = (
        <>
          <Step id="step_info">
            <StepNumber className={currentInfo}>1</StepNumber>
            <StepTitle className={currentInfo}>
              {this.props.resources.EditionPagesWizard.Infos}
            </StepTitle>
          </Step>
          <Step id="step_photos" onClick={this.displayWariningCreateObject}>
            <StepNumber>2</StepNumber>
            <StepTitle>{this.props.resources.EditionPagesWizard.Photos}</StepTitle>
          </Step>
          <Step id="step_classifications" onClick={this.displayWariningCreateObject}>
            <StepNumber>3</StepNumber>
            <StepTitle>{this.props.resources.EditionPagesWizard.Classifications}</StepTitle>
          </Step>
          <Step id="step_properties" onClick={this.displayWariningCreateObject}>
            <StepNumber>4</StepNumber>
            <StepTitle>{this.props.resources.EditionPagesWizard.Properties}</StepTitle>
          </Step>
          <Step id="step_models" onClick={this.displayWariningCreateObject}>
            <StepNumber>5</StepNumber>
            <StepTitle>{this.props.resources.EditionPagesWizard['3DModels']}</StepTitle>
          </Step>
          <Step id="step_documents" onClick={this.displayWariningCreateObject}>
            <StepNumber>6</StepNumber>
            <StepTitle>{this.props.resources.EditionPagesWizard.Documents}</StepTitle>
          </Step>
          <Step id="step_publication" onClick={this.displayWariningCreateObject}>
            <StepNumber>7</StepNumber>
            <StepTitle>{this.props.resources.EditionPagesWizard.Publications}</StepTitle>
          </Step>
        </>
      );
    }

    return (
      <div>
        <StepsContainer>
          <StepsConnector />
          {stepWizard}
        </StepsContainer>
        <EditorContent>
          {contentEditor}
          {isNotAuthorize && (
            <Overlay>
              <LockIcon />
            </Overlay>
          )}
        </EditorContent>
        <ButtonNextPrevContainer>{stepButtons}</ButtonNextPrevContainer>

        <PropertyRevisionModal
          language={this.props.Language}
          temporaryToken={this.props.TemporaryToken}
          handleOpenRevisionModal={this.state.isRevisionModalOpen}
          handleCloseRevisionModal={() => handleCloseRevisionModal()}
          bimObjectId={this.state.bimobjectId}
          permissions={this.state.permissions}
          resources={this.props.resources}
          redirectOption={this.state.redirectOption}
        />
      </div>
    );
  },
});

export const PrevButton = ({ resources, onClick }) => (
  <Button onClick={onClick && onClick} variant="primary" icon="chevron-left">
    {resources?.EditionWizardNavigation.PrevButton}
  </Button>
);

export const NextButton = ({ resources, onClick }) => (
  <Button onClick={onClick && onClick} variant="primary" icon="chevron-right" iconPlacement="right">
    {resources?.EditionWizardNavigation.NextButton}
  </Button>
);

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    resources: appState.Resources[appState.Language],
    ready: typeof appState.Resources[appState.Language] !== 'undefined',
    entityType: appState.EntityType,
    entityId: appState.EntityId,
    managementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    RoleKey: appState.RoleKey,
    Languages: appState.Languages,
    Language: appState.Language,
    Settings: appState.Settings,
  };
};

export default withRouter(connect(mapStateToProps)(Editor));
