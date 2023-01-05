import React from 'react';
import createReactClass from 'create-react-class';

import { connect } from 'react-redux';
import toastr from 'toastr';
import _ from 'underscore';

// Materials UI Icons
import ContentRequest from '../CommonsElements/ContentRequest.jsx';
import store from '../../Store/Store';
import { API_URL } from '../../Api/constants';
import { history } from '../../history';
import { withRouter } from '../../Utils/withRouter';

let CreateContentRequests = createReactClass({
  homeReturn() {
    let origin = 'CONTENT_REQUEST';
    let returnURL = 'content-requests';

    if (this.props.location.state != null) {
      origin = this.props.location.state.origin;
    }

    if (origin == 'OBJECT_LIST') {
      returnURL = 'bimobjects';
    }

    history.push(`/${this.props.Language}/${returnURL}`);
  },

  confirmContentRequest(contentRequestDatas) {
    const self = this;

    let referenceIsEmpty;
    let referenceIsDuplicate = false;

    if (contentRequestDatas.VariantList.length > 0) {
      const variantList = contentRequestDatas.VariantList;

      _.each(variantList, (variant, i) => {
        if (variant.Reference.trim() == '') {
          referenceIsEmpty = true;
        }

        if (!referenceIsEmpty) {
          const duplicateVariant = _.filter(
            variantList,
            (v) => v.Reference.trim() == variant.Reference.trim()
          );

          if (duplicateVariant != null && duplicateVariant.length > 1) {
            referenceIsDuplicate = true;
          }
        }
      });
    }

    // request name
    if (contentRequestDatas.ProjectName.value == '') {
      toastr.error(this.props.Resources.ContentManagement.CreateContentRequestErrorProjectName);
    }
    // request date
    else if (
      contentRequestDatas.EndDate == null ||
      contentRequestDatas.EndDate == undefined ||
      contentRequestDatas.EndDate == ''
    ) {
      toastr.error(this.props.Resources.ContentManagement.CreateContentRequestErrorEndDate);
    }
    // object name
    else if (contentRequestDatas.ObjectName.value == '') {
      toastr.error(this.props.Resources.ContentManagement.CreateContentRequestErrorObjectName);
    }
    // description
    else if (contentRequestDatas.Description == '') {
      toastr.error(this.props.Resources.ContentManagement.CreateContentRequestErrorDescription);
    }
    // Variants
    else if (referenceIsEmpty) {
      toastr.error(this.props.Resources.ContentManagement.CreateContentRequestErrorReference);
    } else if (referenceIsDuplicate) {
      // R�f�rence de variant en double
      toastr.error(this.props.Resources.ContentManagement.CreateContentRequestDuplicateReference);
    }
    // softwares
    else if (contentRequestDatas.SoftwaresListRequired.length < 1) {
      toastr.error(this.props.Resources.ContentManagement.CreateContentRequestErrorSoftwares);
    }
    // documents types
    else if (
      contentRequestDatas.DocumentsWanted.indexOf('Other') > -1 &&
      contentRequestDatas.OtherDocumentName.value == ''
    ) {
      toastr.error(this.props.Resources.ContentManagement.CreateContentRequestErrorOtherDocName);
    }
    // levels of details
    else if (contentRequestDatas.RequestLods.length < 1) {
      toastr.error(this.props.Resources.ContentManagement.CreateContentRequestErrorLod);
    }
    // classifications
    else if (contentRequestDatas.ObjectClassifications.length < 1) {
      toastr.error(this.props.Resources.ContentManagement.CreateContentRequestErrorClassifications);
    }
    // if good, build object and send it to webservice
    else {
      store.dispatch({ type: 'LOADER', state: true });
      const token = self.props.TemporaryToken;

      const tagsList = [];
      _.map(contentRequestDatas.TagsList, (tag, i) => {
        const tagId = tag.split('#')[0];
        tagsList.push(tagId);
      });

      const classifsList = [];
      _.map(contentRequestDatas.ObjectClassifications, (classif, i) => {
        const classifNodeId = classif.split('#')[1];
        classifsList.push(classifNodeId);
      });
      fetch(`${API_URL}/api/ws/v1/request/content?token=${token}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          OnFlyId: self.props.ManagementCloudId.toString(),
          Description: contentRequestDatas.Description,
          CommentsModeler: contentRequestDatas.CommentsModeler,
          ProjectName: contentRequestDatas.ProjectName.value,
          EndDate: contentRequestDatas.EndDate,
          ObjectType: contentRequestDatas.ObjectType,
          ObjectName: contentRequestDatas.ObjectName.value,
          SoftwaresListRequired: contentRequestDatas.SoftwaresListRequired,
          RequestLods: contentRequestDatas.RequestLods,
          DocumentsWanted: contentRequestDatas.DocumentsWanted,
          OtherDocumentName: contentRequestDatas.OtherDocumentName.value,
          ObjectClassifications: classifsList,
          RequestUnit: contentRequestDatas.RequestUnit,
          TagsList: tagsList,
          SupplierId: contentRequestDatas.SupplierId,
          ContentRequestVariantList: contentRequestDatas.VariantList,
          SupplierName: contentRequestDatas.SupplierName,
        }),
      })
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          }
          store.dispatch({ type: 'LOADER', state: false });
          const jsonResponse = JSON.parse(response.text);
          toastr.error(jsonResponse.ModelState);
        })
        .then((json) => {
          // if one document, we upload it after creating request
          if (contentRequestDatas.LinkedDocuments.length > 0) {
            // addeds doc
            const data = new FormData();
            $.each(contentRequestDatas.LinkedDocuments, (index, doc) => {
              data.append(`file${[index]}`, doc);
            });

            $.ajax({
              type: 'POST',
              url: `${API_URL}/api/ws/v1/request/content/${json}/additionaldocument?token=${token}`,
              data,
              processData: false,
              contentType: false,
              async: true,
            });
          }

          store.dispatch({ type: 'LOADER', state: false });
          toastr.success(self.props.Resources.ContentManagement.ContentRequestSendedMessage);
          self.homeReturn();
        });
    }
  },

  render() {
    return (
      <div>
        <ContentRequest
          TemporaryToken={this.props.TemporaryToken}
          ManagementCloudId={this.props.ManagementCloudId}
          Resources={this.props.Resources}
          Language={this.props.Language}
          Softwares={this.props.Softwares}
          DocumentTypes={this.props.DocumentTypes}
          RequestCondition="Creation"
          UserName={`${this.props.UserFirstName} ${this.props.UserLastName}`}
          CancelButtonAction={this.homeReturn}
          CancelButtonClass="btn-flat blue btn-reset"
          CancelButtonLabel={this.props.Resources.MetaResource.Return}
          ValidButtonAction={this.confirmContentRequest}
          ValidButtonClass="btn-raised btn-send"
          ValidButtonLabel={
            this.props.Resources.ContentManagement.CreateContentRequestValidateRequest
          }
          UserLevel={this.props.RoleKey}
        />
      </div>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    Language: appState.Language,
    UserId: appState.UserId,
    UserFirstName: appState.UserFirstName,
    UserLastName: appState.UserLastName,
    RoleKey: appState.RoleKey,
    RoleName: appState.RoleName,
    ManagementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    Resources: appState.Resources[appState.Language],
    DocumentTypes: appState.DocumentTypes,
    Softwares: appState.Softwares,
    RoleKey: appState.RoleKey,
  };
};

export default CreateContentRequests = withRouter(connect(mapStateToProps)(CreateContentRequests));