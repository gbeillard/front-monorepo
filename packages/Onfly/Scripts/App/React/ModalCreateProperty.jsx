import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import _ from 'underscore';
import toastr from 'toastr';
import MuiDialog from '@material-ui/core/Dialog';
import styled from '@emotion/styled';
import store from '../Store/Store';
import PropertyElement from './CommonsElements/PropertyElement.jsx';
import { API_URL } from '../Api/constants';

import { sendPropertyRequestSuccess } from '../Actions/create-property-actions';

const Dialog = styled(MuiDialog)({
  zIndex: '2010 !important',
});

const PropertyElementWrapper = styled.div({
  display: 'flex',
  marginLeft: '50px',
  padding: '102px 0',
  alignItems: 'center',
  flexDirection: 'column',
  '> div': {
    width: '40%',
  },
});

let ModalCreateProperty = createReactClass({
  getInitialState() {
    return {
      openModal: false,
      language: this.props.Language,
      propertyName: '',
      description: '',
      domain: '',
      unit: '',
      dataType: '',
      editType: '',
      editTypeValue: '',
      information: '',
      errorFieldPropertyName: false,
      errorFieldDescription: false,
      defaultPropValues: {
        PropertyName: '',
        PropertyDescription: '',
        PropertyLang: '',
        PropertyDomain: '',
        PropertyUnit: '',
        PropertyType: '',
        PropertyEditType: '',
        PropertyEditTypeValues: '',
        PropertyInformations: '',
      },
    };
  },

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    if (this.props.OpenModal != nextProps.OpenModal) {
      const initState = this.getInitialState();
      initState.openModal = nextProps.OpenModal;

      if (nextProps.OpenModal) {
        store.dispatch({
          type: 'LOAD_PROPERTY',
          language: this.props.Language,
          temporaryToken: this.props.TemporaryToken,
        });
      }

      this.setState(initState);
    }
  },

  handleSelectFieldChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  },

  handleTextFieldChange(event) {
    this.state = Object.assign(this.state, { [event.target.name]: event.target.value });
  },

  createNewProperty(datas) {
    const self = this;

    if (!datas) {
      return;
    }

    if (this.props.RoleKey === 'admin') {
      const currentElements = datas;
      const self = this;

      fetch(
        `${API_URL}/api/ws/v1/${self.props.Language}/contentmanagement/${self.props.ManagementCloudId}/dictionary/property/create?token=${self.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            LanguageCode: currentElements.PropertyLang,
            Name: currentElements.PropertyName,
            Description: currentElements.PropertyDescription,
            DomainId: currentElements.PropertyDomain,
            DomainType: currentElements.PropertyDomainType,
            Unit: currentElements.PropertyUnit,
            EditType: currentElements.PropertyEditType,
            EditTypeValues: currentElements.PropertyEditTypeValues,
            Information: currentElements.PropertyInformations,
            DataType: currentElements.PropertyType,
            ToOfficial: false,
            ManagementCloudId: self.props.ManagementCloudId,
            Nature: currentElements.Nature,
          }),
        }
      ).then((response) => {
        if (response.status == 200) {
          toastr.success(self.props.Resources.ContentManagement.PropertiesCreationConfirmation);
          self.closeModalCreateproperty();
        } else {
          toastr.error(response.statusText);
        }
      });
    } else {
      const currentRequest = {
        Name: datas.PropertyName,
        Description: datas.PropertyDescription,
        LanguageCode: datas.PropertyLang,
        DomainId: datas.PropertyDomain,
        UnitId: datas.PropertyUnit,
        DataTypeId: datas.PropertyType,
        EditTypeId: datas.PropertyEditType,
        EditTypeValues: datas.PropertyEditTypeValues,
        ParameterTypeId: datas.PropertyParameterType,
        Information: datas.PropertyInformations,
        RequestComments: datas.RequestComments,
        Nature: datas.Nature,
      };

      fetch(
        `${API_URL}/api/ws/v1/contentmanagement/${self.props.ManagementCloudId}/property/request?token=${self.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentRequest),
        }
      ).then((response) => {
        if (response.status == 200) {
          self.props.sendPropertyRequestSuccess();
          toastr.success(self.props.Resources.ContentManagement.PropertyRequestSendedLabel);
          self.closeModalCreateproperty();
        } else {
          toastr.error(self.props.Resources.ContentManagement.PropertyRequestSendedError);
        }
      });
    }
  },

  closeModalCreateproperty() {
    store.dispatch({ type: 'CLOSE_MODAL_CREATE_PROPERTY' });
  },

  render() {
    const self = this;

    return (
      <Dialog
        fullScreen
        open={this.state.openModal}
        onClose={self.closeModalCreateproperty}
        scroll="body"
      >
        <PropertyElementWrapper>
          <PropertyElement
            TemporaryToken={self.props.TemporaryToken}
            ManagementCloudId={self.props.ManagementCloudId}
            Resources={self.props.Resources}
            Language={self.props.Language}
            Languages={self.props.Languages}
            Domains={self.props.Domains}
            Units={self.props.Units}
            DataTypes={self.props.DataTypes}
            EditTypes={self.props.EditTypes}
            CurrentDataModel={null}
            ValidateBottomButton={self.createNewProperty}
            IsReadOnly={false}
            IsCreationMode
            HeaderTitle={self.props.Resources.UserPropertyPage.TitleCreatePropertyLabel}
            CancelButtonLabel={self.props.Resources.MetaResource.Cancel}
            CancelButtonAction={self.closeModalCreateproperty}
            IsPropRequest={this.props.RoleKey !== 'admin'}
            ParameterTypes={self.props.ParameterTypes}
          />
        </PropertyElementWrapper>
      </Dialog>
    );
  },
});

const mapStateToProps = function (store) {
  const { createPropertyState } = store;
  const { appState } = store;

  return {
    ManagementCloudId: appState.ManagementCloudId,
    OpenModal: createPropertyState.OpenModal,
    Domains: createPropertyState.Domains,
    Units: createPropertyState.Units,
    DataTypes: createPropertyState.DataTypes,
    EditTypes: createPropertyState.EditTypes,
    Language: appState.Language,
    Languages: appState.Languages,
    Resources: appState.Resources[appState.Language],
    TemporaryToken: appState.TemporaryToken,
    UserId: appState.UserId,
    RoleKey: appState.RoleKey,
    ParameterTypes: createPropertyState.ParameterTypes,
  };
};

const mapDispatchToProps = (dispatch) => ({
  sendPropertyRequestSuccess: () => dispatch(sendPropertyRequestSuccess()),
});

export default ModalCreateProperty = connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalCreateProperty);